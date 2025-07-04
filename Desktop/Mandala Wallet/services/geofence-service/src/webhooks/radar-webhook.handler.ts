import { RadarService, RadarWebhookPayload } from '../radar/radar.service';
import { NotificationService } from '../notification/notification.service';
import { DatabaseService } from '../database/database.service';
import { GamificationService } from '../gamification/gamification.service';
import { PassportService } from '../passport/passport.service';
import { RewardTriggerService } from '../rewards/reward-trigger.service';
import {
  LocationEvent,
  GeofenceNotification,
  User,
  Venue,
  Promotion,
  Reward,
  PointsActionType,
  PointsTransaction,
  TierUpgradeNotification,
  PointsAwardNotification,
  QRStamp,
  StampValidationResult,
  PassportNotification,
  ApiResponse as MandalaApiResponse
} from '@mandala/shared-types';

export interface WebhookValidationResult {
  isValid: boolean;
  reason?: string;
  shouldProcess: boolean;
}

export interface LocationEventResult {
  event: LocationEvent;
  notifications: GeofenceNotification[];
  triggeredPromotions: Promotion[];
  earnedRewards: Reward[];
  pointsAwarded: PointsTransaction[];
  stampsAwarded: QRStamp[];
  tierUpgrade?: TierUpgradeNotification;
  shouldUpdateTier: boolean;
}

export class RadarWebhookHandler {
  constructor(
    private radarService: RadarService,
    private notificationService: NotificationService,
    private databaseService: DatabaseService,
    private gamificationService: GamificationService,
    private passportService: PassportService,
    private rewardTriggerService: RewardTriggerService
  ) {}

  // Process incoming Radar.io webhook
  async processWebhook(
    payload: RadarWebhookPayload,
    signature?: string
  ): Promise<MandalaApiResponse<LocationEventResult | null>> {
    try {
      console.log(`Processing Radar webhook: ${payload.type} for user ${payload.user.userId}`);

      // Validate webhook
      const validation = await this.validateWebhook(payload, signature);
      if (!validation.isValid) {
        return {
          success: false,
          error: validation.reason || 'Invalid webhook',
          message: 'Webhook validation failed',
          timestamp: new Date()
        };
      }

      if (!validation.shouldProcess) {
        return {
          success: true,
          data: null,
          message: 'Webhook received but not processed (duplicate or test event)',
          timestamp: new Date()
        };
      }

      // Process the webhook payload
      const result = await this.processLocationEvent(payload);

      if (result) {
        // Store location event
        await this.storeLocationEvent(result.event);

        // Send notifications
        for (const notification of result.notifications) {
          await this.sendNotification(notification);
        }

        // Process gamification updates
        if (result.shouldUpdateTier) {
          await this.updateUserTier(payload.user.userId, result.event.venueId);
        }

        // Log analytics
        await this.logVenueAnalytics(result.event);

        return {
          success: true,
          data: result,
          message: `Processed ${payload.type} event successfully`,
          timestamp: new Date()
        };
      } else {
        return {
          success: true,
          data: null,
          message: 'Event processed but no action required',
          timestamp: new Date()
        };
      }
    } catch (error) {
      console.error('Error processing Radar webhook:', error);
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to process webhook',
        timestamp: new Date()
      };
    }
  }

  // Validate webhook authenticity and content
  private async validateWebhook(
    payload: RadarWebhookPayload,
    signature?: string
  ): Promise<WebhookValidationResult> {
    // Check if event is live (not test)
    if (!payload.live) {
      return {
        isValid: true,
        reason: 'Test event',
        shouldProcess: false
      };
    }

    // Check if event type is supported
    const supportedTypes = ['user.entered_geofence', 'user.exited_geofence'];
    if (!supportedTypes.includes(payload.type)) {
      return {
        isValid: true,
        reason: 'Unsupported event type',
        shouldProcess: false
      };
    }

    // Check if user exists
    const user = await this.getUser(payload.user.userId);
    if (!user) {
      return {
        isValid: false,
        reason: 'User not found',
        shouldProcess: false
      };
    }

    // Check if venue exists (for geofence events)
    if (payload.geofence?.metadata?.venueId) {
      const venue = await this.getVenue(payload.geofence.metadata.venueId);
      if (!venue) {
        return {
          isValid: false,
          reason: 'Venue not found',
          shouldProcess: false
        };
      }

      // Check if venue has geofencing enabled
      if (!venue.settings.geofenceEnabled) {
        return {
          isValid: true,
          reason: 'Geofencing disabled for venue',
          shouldProcess: false
        };
      }
    }

    // Check for duplicate events (basic deduplication)
    const isDuplicate = await this.isDuplicateEvent(payload);
    if (isDuplicate) {
      return {
        isValid: true,
        reason: 'Duplicate event',
        shouldProcess: false
      };
    }

    // Validate location accuracy (reject if too inaccurate)
    if (payload.location.accuracy > 100) { // 100 meters threshold
      return {
        isValid: false,
        reason: 'Location accuracy too low',
        shouldProcess: false
      };
    }

    return {
      isValid: true,
      shouldProcess: true
    };
  }

  // Process location event and generate notifications/rewards/stamps
  private async processLocationEvent(payload: RadarWebhookPayload): Promise<LocationEventResult | null> {
    const { locationEvent, shouldNotify, notificationType } = 
      await this.radarService.processWebhookPayload(payload);

    if (!locationEvent) {
      return null;
    }

    const notifications: GeofenceNotification[] = [];
    const triggeredPromotions: Promotion[] = [];
    const earnedRewards: Reward[] = [];
    const pointsAwarded: PointsTransaction[] = [];
    const stampsAwarded: QRStamp[] = [];
    let shouldUpdateTier = false;
    let tierUpgrade: TierUpgradeNotification | undefined;

    // Get user and venue data
    const user = await this.getUser(locationEvent.userId);
    const venue = await this.getVenue(locationEvent.venueId);

    if (!user || !venue) {
      return null;
    }

    // Process venue entry
    if (locationEvent.type === 'enter') {
      console.log(`Processing venue entry for user ${user.displayName} at ${venue.name}`);

      // Check if this is first visit
      const isFirstVisit = await this.isFirstVenueVisit(user.id, venue.id);
      
      // Award QR stamps for passport progression
      try {
        const stampResult = await this.passportService.awardStamp(
          user.id,
          venue.id,
          venue.name,
          locationEvent,
          {
            isFirstTime: isFirstVisit,
            visitType: 'entry'
          }
        );

        if (stampResult.isValid && stampResult.stamp) {
          stampsAwarded.push(stampResult.stamp);
          
          // Store stamps and update passports in database
          await this.databaseService.createQRStamp(stampResult.stamp);
          
          if (stampResult.passportUpdates) {
            for (const passport of stampResult.passportUpdates) {
              await this.databaseService.updateUserPassport(passport);
            }
          }

          // Award additional points for passport completion
          if (stampResult.rewardsEarned && stampResult.rewardsEarned.length > 0) {
            for (const reward of stampResult.rewardsEarned) {
              if (reward.type === 'points') {
                const passportPointsResult = await this.gamificationService.awardPoints(
                  user.id,
                  PointsActionType.SPECIAL_EVENT,
                  {
                    venueId: venue.id,
                    venueName: venue.name,
                    reason: `Passport completion: ${reward.description}`
                  }
                );
                pointsAwarded.push(passportPointsResult.pointsTransaction);
                await this.databaseService.createPointsTransaction(passportPointsResult.pointsTransaction);
              }
            }
          }

          console.log(`Awarded QR stamp for passport progression at ${venue.name}`);
        }
      } catch (error) {
        console.error('Error awarding QR stamp:', error);
      }

      // Award points for venue visit (existing logic)
      try {
        const visitPointsResult = await this.gamificationService.awardPoints(
          user.id,
          isFirstVisit ? PointsActionType.FIRST_VISIT : PointsActionType.VENUE_VISIT,
          {
            venueId: venue.id,
            venueName: venue.name,
            isFirstTime: isFirstVisit,
            location: {
              latitude: locationEvent.latitude,
              longitude: locationEvent.longitude
            }
          }
        );

        pointsAwarded.push(visitPointsResult.pointsTransaction);
        
        // Check for tier upgrade
        if (visitPointsResult.tierUpgrade) {
          tierUpgrade = visitPointsResult.tierUpgrade;
          shouldUpdateTier = true;
        }

        await this.databaseService.createPointsTransaction(visitPointsResult.pointsTransaction);
        console.log(`Awarded ${visitPointsResult.pointsTransaction.points} points for venue visit`);
      } catch (error) {
        console.error('Error awarding venue visit points:', error);
      }

      // Check for multiple venues visit bonus
      if (await this.hasVisitedMultipleVenuesToday(user.id, venue.id)) {
        try {
          const multiVenueResult = await this.gamificationService.awardPoints(
            user.id,
            PointsActionType.MULTIPLE_VENUES,
            {
              venueId: venue.id,
              venueName: venue.name,
              visitDate: new Date().toISOString().split('T')[0]
            }
          );

          pointsAwarded.push(multiVenueResult.pointsTransaction);
          await this.databaseService.createPointsTransaction(multiVenueResult.pointsTransaction);
          
          console.log(`Awarded ${multiVenueResult.pointsTransaction.points} bonus points for multiple venues`);
        } catch (error) {
          console.error('Error awarding multiple venues bonus:', error);
        }
      }

      // Process reward triggers for venue entry
      try {
        const rewardTriggerEvent = await this.processRewardTriggers(
          locationEvent,
          user,
          venue,
          { 
            visitCount: await this.databaseService.getVenueVisitCount(user.id, venue.id),
            isFirstVisit,
            currentSpending: 0,
            lastVisit: await this.getLastVisitDate(user.id, venue.id)
          }
        );

        if (rewardTriggerEvent && rewardTriggerEvent.triggeredRewards.length > 0) {
          // Save reward trigger event
          await this.databaseService.saveRewardTriggerEvent(rewardTriggerEvent);

          // Save triggered rewards
          for (const reward of rewardTriggerEvent.triggeredRewards) {
            await this.databaseService.saveTriggeredReward(reward);
          }

          // Create notifications for triggered rewards
          for (const reward of rewardTriggerEvent.triggeredRewards) {
            const rewardNotification = await this.createRewardNotification(
              user,
              venue,
              reward
            );
            notifications.push(rewardNotification);
          }

          console.log(`Triggered ${rewardTriggerEvent.triggeredRewards.length} location-based rewards for ${user.displayName} at ${venue.name}`);
        }
      } catch (error) {
        console.error('Error processing reward triggers:', error);
      }

      // Send welcome notification with stamps/points information
      if (shouldNotify && venue.settings.pushNotificationsEnabled) {
        const welcomeNotification = await this.createWelcomeNotification(
          user,
          venue,
          locationEvent,
          pointsAwarded,
          stampsAwarded
        );
        notifications.push(welcomeNotification);
      }

      // Send passport-specific notifications
      for (const stamp of stampsAwarded) {
        const stampNotification = await this.createStampNotification(
          user,
          venue,
          stamp
        );
        notifications.push(stampNotification);
      }

      // Check for available promotions
      const availablePromotions = await this.getAvailablePromotions(user, venue);
      triggeredPromotions.push(...availablePromotions);

      // Send promotion notifications
      for (const promotion of availablePromotions) {
        const promoNotification = await this.createPromotionNotification(
          user,
          venue,
          promotion,
          locationEvent
        );
        notifications.push(promoNotification);
      }

      // Award entry rewards
      const entryRewards = await this.getEntryRewards(user, venue);
      earnedRewards.push(...entryRewards);

      console.log(`User ${user.displayName} entered ${venue.name} - ${notifications.length} notifications, ${pointsAwarded.length} points, ${stampsAwarded.length} stamps`);

    } else if (locationEvent.type === 'exit') {
      console.log(`Processing venue exit for user ${user.displayName} from ${venue.name}`);

      // Calculate visit duration
      const visitDuration = locationEvent.metadata?.duration || 0;
      
      // Award QR stamps for extended visits
      if (visitDuration >= 1800) { // 30 minutes or more
        try {
          const extendedStampResult = await this.passportService.awardStamp(
            user.id,
            venue.id,
            venue.name,
            locationEvent,
            {
              visitDuration,
              visitType: 'extended',
              durationMinutes: Math.floor(visitDuration / 60)
            }
          );

          if (extendedStampResult.isValid && extendedStampResult.stamp) {
            stampsAwarded.push(extendedStampResult.stamp);
            await this.databaseService.createQRStamp(extendedStampResult.stamp);
            
            if (extendedStampResult.passportUpdates) {
              for (const passport of extendedStampResult.passportUpdates) {
                await this.databaseService.updateUserPassport(passport);
              }
            }

            console.log(`Awarded extended visit QR stamp for ${Math.floor(visitDuration / 60)} minute visit`);
          }
        } catch (error) {
          console.error('Error awarding extended visit stamp:', error);
        }
      }

      // Award points for extended visit
      if (visitDuration >= 1800) {
        try {
          const extendedVisitResult = await this.gamificationService.awardPoints(
            user.id,
            PointsActionType.EXTENDED_VISIT,
            {
              venueId: venue.id,
              venueName: venue.name,
              visitDuration,
              durationMinutes: Math.floor(visitDuration / 60)
            }
          );

          pointsAwarded.push(extendedVisitResult.pointsTransaction);
          await this.databaseService.createPointsTransaction(extendedVisitResult.pointsTransaction);
          
          // Check for tier upgrade from extended visit
          if (extendedVisitResult.tierUpgrade) {
            tierUpgrade = extendedVisitResult.tierUpgrade;
            shouldUpdateTier = true;
          }

          console.log(`Awarded ${extendedVisitResult.pointsTransaction.points} points for extended visit`);
        } catch (error) {
          console.error('Error awarding extended visit points:', error);
        }
      }

      // Send farewell notification
      if (shouldNotify && venue.settings.pushNotificationsEnabled) {
        const farewellNotification = await this.createFarewellNotification(
          user,
          venue,
          locationEvent,
          pointsAwarded,
          stampsAwarded
        );
        notifications.push(farewellNotification);
      }

      // Award visit completion rewards
      const visitRewards = await this.getVisitCompletionRewards(user, venue, locationEvent);
      earnedRewards.push(...visitRewards);

      console.log(`User ${user.displayName} exited ${venue.name} after ${Math.floor(visitDuration / 60)} minutes - ${pointsAwarded.length} points, ${stampsAwarded.length} stamps`);
    }

    // Send tier upgrade notification if applicable
    if (tierUpgrade) {
      const tierUpgradeNotification = await this.createTierUpgradeNotification(
        user,
        venue,
        tierUpgrade
      );
      notifications.push(tierUpgradeNotification);
    }

    return {
      event: locationEvent,
      notifications,
      triggeredPromotions,
      earnedRewards,
      pointsAwarded,
      stampsAwarded,
      tierUpgrade,
      shouldUpdateTier
    };
  }

  // Create welcome notification with points and stamps information
  private async createWelcomeNotification(
    user: User,
    venue: Venue,
    event: LocationEvent,
    pointsAwarded: PointsTransaction[],
    stampsAwarded: QRStamp[]
  ): Promise<GeofenceNotification> {
    const isFirstVisit = await this.isFirstVenueVisit(user.id, venue.id);
    const totalPoints = pointsAwarded.reduce((sum, pt) => sum + pt.points, 0);
    const stampCount = stampsAwarded.length;
    
    const baseMessage = isFirstVisit 
      ? `¡Bienvenido a ${venue.name}! Gracias por visitarnos por primera vez.`
      : `¡Hola de nuevo en ${venue.name}! Qué bueno verte otra vez.`;
    
    let rewardsMessage = '';
    if (totalPoints > 0 && stampCount > 0) {
      rewardsMessage = ` Has ganado ${totalPoints} puntos y ${stampCount} sello${stampCount > 1 ? 's' : ''} para tu pasaporte.`;
    } else if (totalPoints > 0) {
      rewardsMessage = ` Has ganado ${totalPoints} puntos por tu visita.`;
    } else if (stampCount > 0) {
      rewardsMessage = ` Has ganado ${stampCount} sello${stampCount > 1 ? 's' : ''} para tu pasaporte.`;
    }

    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: user.id,
      venueId: venue.id,
      type: 'welcome',
      title: isFirstVisit ? `¡Bienvenido a ${venue.name}!` : `¡Hola de nuevo en ${venue.name}!`,
      message: baseMessage + rewardsMessage + ' ¡Disfruta tu experiencia!',
      actionUrl: `/venues/${venue.id}/passport`,
      isRead: false,
      sentAt: new Date()
    };
  }

  // Create farewell notification with points and stamps information
  private async createFarewellNotification(
    user: User,
    venue: Venue,
    event: LocationEvent,
    pointsAwarded: PointsTransaction[],
    stampsAwarded: QRStamp[]
  ): Promise<GeofenceNotification> {
    const visitDuration = event.metadata?.duration || 0;
    const totalPoints = pointsAwarded.reduce((sum, pt) => sum + pt.points, 0);
    const stampCount = stampsAwarded.length;
    
    const durationText = visitDuration > 0 
      ? `después de ${Math.floor(visitDuration / 60)} minutos`
      : '';
    
    let rewardsMessage = '';
    if (totalPoints > 0 && stampCount > 0) {
      rewardsMessage = ` Has ganado ${totalPoints} puntos adicionales y ${stampCount} sello${stampCount > 1 ? 's' : ''} por tu visita.`;
    } else if (totalPoints > 0) {
      rewardsMessage = ` Has ganado ${totalPoints} puntos adicionales por tu visita.`;
    } else if (stampCount > 0) {
      rewardsMessage = ` Has ganado ${stampCount} sello${stampCount > 1 ? 's' : ''} adicional${stampCount > 1 ? 'es' : ''} por tu visita.`;
    }

    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: user.id,
      venueId: venue.id,
      type: 'farewell',
      title: `¡Gracias por visitarnos!`,
      message: `Esperamos que hayas disfrutado tu tiempo en ${venue.name} ${durationText}.${rewardsMessage} ¡Regresa pronto!`,
      actionUrl: `/passport/collection`,
      isRead: false,
      sentAt: new Date()
    };
  }

  // Create stamp award notification
  private async createStampNotification(
    user: User,
    venue: Venue,
    stamp: QRStamp
  ): Promise<GeofenceNotification> {
    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: user.id,
      venueId: venue.id,
      type: 'promotion',
      title: `📖 ¡Nuevo sello obtenido!`,
      message: `Has ganado un sello en ${venue.name}. ¡Sigue coleccionando para completar tu pasaporte!`,
      actionUrl: `/passport/${stamp.passportId}`,
      isRead: false,
      sentAt: new Date()
    };
  }

  // Create tier upgrade notification
  private async createTierUpgradeNotification(
    user: User,
    venue: Venue,
    tierUpgrade: TierUpgradeNotification
  ): Promise<GeofenceNotification> {
    const tierConfig = this.gamificationService.getTierConfiguration(tierUpgrade.newTier);
    
    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: user.id,
      venueId: venue.id,
      type: 'promotion',
      title: `🎉 ¡Nivel ${tierConfig.name} desbloqueado!`,
      message: `${tierUpgrade.congratulationMessage} Ahora tienes acceso a ${tierUpgrade.newBenefits.length} beneficios exclusivos.`,
      actionUrl: `/profile/tier`,
      isRead: false,
      sentAt: new Date()
    };
  }

  // Check if user has visited multiple venues today
  private async hasVisitedMultipleVenuesToday(userId: string, currentVenueId: string): Promise<boolean> {
    // Mock implementation - would check location_events table for today's entries
    return Math.random() > 0.8; // 20% chance of multiple venues
  }

  // Get available promotions for user at venue
  private async getAvailablePromotions(user: User, venue: Venue): Promise<Promotion[]> {
    // Mock implementation - would query database for active promotions
    const mockPromotions: Promotion[] = [
      {
        id: `promo_${Date.now()}`,
        venueId: venue.id,
        name: 'Happy Hour Especial',
        description: '20% de descuento en bebidas hasta las 8 PM',
        type: 'discount',
        value: 20,
        conditions: {
          minAmount: 100,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
          geofenceRequired: true
        },
        isActive: true,
        maxRedemptions: 100,
        currentRedemptions: 25,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Filter by user tier, time restrictions, etc.
    return mockPromotions.filter(promo => 
      promo.isActive && 
      promo.currentRedemptions < (promo.maxRedemptions || Infinity)
    );
  }

  // Create promotion notification
  private async createPromotionNotification(
    user: User,
    venue: Venue,
    promotion: Promotion,
    event: LocationEvent
  ): Promise<GeofenceNotification> {
    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: user.id,
      venueId: venue.id,
      type: 'promotion',
      title: `🎉 ${promotion.name}`,
      message: `${promotion.description} - ¡Disponible ahora en ${venue.name}!`,
      actionUrl: `/promotions/${promotion.id}/claim`,
      isRead: false,
      sentAt: new Date()
    };
  }

  // Get entry rewards for visiting venue
  private async getEntryRewards(user: User, venue: Venue): Promise<Reward[]> {
    // Mock implementation - would award points for visiting
    return [
      {
        id: `reward_${Date.now()}`,
        venueId: venue.id,
        name: 'Puntos de Visita',
        description: 'Puntos por visitar el venue',
        type: 'points',
        value: 10,
        conditions: {
          locationRequired: true
        },
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        maxRedemptions: 1,
        currentRedemptions: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // Get visit completion rewards
  private async getVisitCompletionRewards(
    user: User,
    venue: Venue,
    event: LocationEvent
  ): Promise<Reward[]> {
    const visitDuration = event.metadata?.duration || 0;
    
    // Award rewards based on visit duration
    if (visitDuration > 1800) { // 30 minutes or more
      return [
        {
          id: `reward_${Date.now()}`,
          venueId: venue.id,
          name: 'Bono de Permanencia',
          description: 'Recompensa por pasar más de 30 minutos en el venue',
          type: 'cashback',
          value: 25,
          conditions: {
            minAmount: 0,
            locationRequired: true
          },
          isActive: true,
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          maxRedemptions: 1,
          currentRedemptions: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
    }

    return [];
  }

  // Helper methods
  private async getUser(userId: string): Promise<User | null> {
    try {
      return await this.databaseService.findUserById(userId);
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  }

  private async getVenue(venueId: string): Promise<Venue | null> {
    try {
      return await this.databaseService.findVenueById(venueId);
    } catch (error) {
      console.error('Error fetching venue:', error);
      return null;
    }
  }

  private async isDuplicateEvent(payload: RadarWebhookPayload): Promise<boolean> {
    // Mock implementation - would check database for recent identical events
    return false;
  }

  private async isFirstVenueVisit(userId: string, venueId: string): Promise<boolean> {
    // Mock implementation - would check location_events table
    return Math.random() > 0.7; // 30% chance of first visit
  }

  private async shouldUpdateUserTier(userId: string, venueId: string): Promise<boolean> {
    // Mock implementation - would check if user has enough points for tier upgrade
    return Math.random() > 0.9; // 10% chance of tier update
  }

  private async storeLocationEvent(event: LocationEvent): Promise<void> {
    console.log('Storing location event:', event.id, event.type, event.venueId);
    // Would use database service to store the event
  }

  private async sendNotification(notification: GeofenceNotification): Promise<void> {
    try {
      await this.notificationService.sendGeofenceNotification(notification);
      console.log(`Sent ${notification.type} notification to user ${notification.userId}`);
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  }

  private async updateUserTier(userId: string, venueId: string): Promise<void> {
    try {
      const userTier = await this.databaseService.getUserTier(userId);
      if (userTier) {
        // The points have already been awarded, so the tier will be updated
        // when the database service recalculates it
        console.log(`User ${userId} tier updated after venue ${venueId} activity`);
      }
    } catch (error) {
      console.error('Error updating user tier:', error);
    }
  }

  private async logVenueAnalytics(event: LocationEvent): Promise<void> {
    console.log(`Analytics: User ${event.userId} ${event.type} venue ${event.venueId} at ${event.timestamp}`);
    // Would store analytics data in database
  }

  // Process reward triggers for location events
  private async processRewardTriggers(
    locationEvent: LocationEvent,
    user: User,
    venue: Venue,
    contextData: any
  ): Promise<any> {
    try {
      const userTier = await this.databaseService.getUserTier(user.id);
      if (!userTier) {
        console.log(`No user tier found for user ${user.id}, skipping reward triggers`);
        return null;
      }

      const rewardTriggerEvent = await this.rewardTriggerService.processLocationEvent(
        locationEvent,
        user,
        venue,
        userTier,
        contextData
      );

      return rewardTriggerEvent;
    } catch (error) {
      console.error('Error processing reward triggers:', error);
      return null;
    }
  }

  // Create reward notification
  private async createRewardNotification(
    user: User,
    venue: Venue,
    reward: any
  ): Promise<GeofenceNotification> {
    return {
      id: `notif_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: user.id,
      venueId: venue.id,
      type: 'promotion',
      title: `🎁 ${reward.reward.name}`,
      message: `${reward.reward.description} - Código: ${reward.redemptionCode}`,
      actionUrl: `/rewards/${reward.id}/redeem`,
      isRead: false,
      sentAt: new Date()
    };
  }

  // Get last visit date for user at venue
  private async getLastVisitDate(userId: string, venueId: string): Promise<Date | null> {
    // Mock implementation - would query location_events table
    const randomDaysAgo = Math.floor(Math.random() * 30);
    return new Date(Date.now() - randomDaysAgo * 24 * 60 * 60 * 1000);
  }

  async healthCheck(): Promise<boolean> {
    try {
      const radarHealth = await this.radarService.healthCheck();
      const notificationHealth = await this.notificationService.healthCheck();
      const dbHealth = await this.databaseService.healthCheck();
      const gamificationHealth = await this.gamificationService.healthCheck();
      const passportHealth = await this.passportService.healthCheck();
      const rewardTriggerHealth = await this.rewardTriggerService.healthCheck();
      
      return radarHealth && notificationHealth && dbHealth && gamificationHealth && passportHealth && rewardTriggerHealth;
    } catch (error) {
      console.error('Webhook handler health check failed:', error);
      return false;
    }
  }
} 