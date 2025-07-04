import { RewardTriggerService } from './reward-trigger.service';
import { DatabaseService } from '../database/database.service';
import {
  LocationPromotion,
  TriggeredReward,
  RewardDiscoveryResult,
  RewardAnalytics,
  RewardTriggerEvent,
  ProximityPromotion,
  RewardStatus,
  UserRole,
  User,
  ApiResponse as MandalaApiResponse
} from '@mandala/shared-types';

export class RewardTriggerController {
  constructor(
    private readonly rewardTriggerService: RewardTriggerService,
    private readonly databaseService: DatabaseService
  ) {}

  async discoverRewards(
    user: User,
    venueId: string
  ): Promise<MandalaApiResponse<RewardDiscoveryResult>> {
    try {
      const userTier = await this.databaseService.getUserTier(user.id);
      if (!userTier) {
        throw new Error('User tier not found');
      }

      const result = await this.rewardTriggerService.discoverRewards(
        user.id,
        venueId,
        userTier
      );

      return {
        success: true,
        data: result,
        message: 'Rewards discovered successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to discover rewards',
        timestamp: new Date()
      };
    }
  }

  async getMyRewards(
    user: User,
    status?: RewardStatus
  ): Promise<MandalaApiResponse<TriggeredReward[]>> {
    try {
      const rewards = await this.databaseService.getTriggeredRewards(user.id, status);
      
      return {
        success: true,
        data: rewards,
        message: 'Rewards retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get user rewards',
        timestamp: new Date()
      };
    }
  }

  async redeemReward(
    user: User,
    rewardId: string
  ): Promise<MandalaApiResponse<{ redeemed: boolean; message: string }>> {
    try {
      await this.databaseService.redeemReward(rewardId, user.id);
      
      return {
        success: true,
        data: { redeemed: true, message: 'Reward redeemed successfully' },
        message: 'Reward redeemed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to redeem reward',
        timestamp: new Date()
      };
    }
  }

  async getPromotions(
    venueId?: string
  ): Promise<MandalaApiResponse<LocationPromotion[]>> {
    try {
      const promotions = this.rewardTriggerService.getActivePromotions();
      const filteredPromotions = venueId 
        ? promotions.filter(p => p.venueId === venueId)
        : promotions;
      
      return {
        success: true,
        data: filteredPromotions,
        message: 'Promotions retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get promotions',
        timestamp: new Date()
      };
    }
  }

  async createPromotion(
    user: User,
    promotion: LocationPromotion
  ): Promise<MandalaApiResponse<LocationPromotion>> {
    try {
      // Check if user has permission (admin or venue manager)
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.VENUE_MANAGER)) {
        throw new Error('Insufficient permissions');
      }

      await this.databaseService.createLocationPromotion(promotion);
      
      return {
        success: true,
        data: promotion,
        message: 'Promotion created successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to create promotion',
        timestamp: new Date()
      };
    }
  }

  async getAnalytics(
    user: User,
    venueId?: string
  ): Promise<MandalaApiResponse<RewardAnalytics>> {
    try {
      // Check if user has permission (admin or venue manager)
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.VENUE_MANAGER)) {
        throw new Error('Insufficient permissions');
      }

      const analytics = await this.databaseService.getRewardAnalytics(venueId);
      
      return {
        success: true,
        data: analytics,
        message: 'Analytics retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get analytics',
        timestamp: new Date()
      };
    }
  }

  async getTriggerEvents(
    user: User,
    userId?: string,
    venueId?: string,
    limit: number = 20
  ): Promise<MandalaApiResponse<RewardTriggerEvent[]>> {
    try {
      // Check if user has permission (admin or venue manager)
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.VENUE_MANAGER)) {
        throw new Error('Insufficient permissions');
      }

      const events = await this.databaseService.getRewardTriggerEvents(
        userId,
        venueId,
        limit
      );
      
      return {
        success: true,
        data: events,
        message: 'Trigger events retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get trigger events',
        timestamp: new Date()
      };
    }
  }

  async getProximityPromotions(
    venueId: string
  ): Promise<MandalaApiResponse<ProximityPromotion[]>> {
    try {
      const promotions = await this.databaseService.getProximityPromotions(venueId);
      
      return {
        success: true,
        data: promotions,
        message: 'Proximity promotions retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get proximity promotions',
        timestamp: new Date()
      };
    }
  }

  async testTrigger(
    user: User,
    testData: {
      userId: string;
      venueId: string;
      triggerType: string;
      contextData?: any;
    }
  ): Promise<MandalaApiResponse<RewardTriggerEvent>> {
    try {
      // Check if user has admin permission
      if (!user.roles.includes(UserRole.ADMIN)) {
        throw new Error('Admin permission required');
      }

      const testUser = await this.databaseService.findUserById(testData.userId);
      const venue = await this.databaseService.findVenueById(testData.venueId);
      const userTier = await this.databaseService.getUserTier(testData.userId);

      if (!testUser || !venue || !userTier) {
        throw new Error('User, venue, or tier not found');
      }

      const locationEvent = {
        id: `test_${Date.now()}`,
        userId: testData.userId,
        venueId: testData.venueId,
        type: 'enter' as const,
        timestamp: new Date(),
        latitude: venue.location.latitude,
        longitude: venue.location.longitude,
        accuracy: 10,
        metadata: testData.contextData || {}
      };

      const triggerEvent = await this.rewardTriggerService.processLocationEvent(
        locationEvent,
        testUser,
        venue,
        userTier,
        testData.contextData || {}
      );

      // Save the trigger event
      await this.databaseService.saveRewardTriggerEvent(triggerEvent);

      // Save any triggered rewards
      for (const reward of triggerEvent.triggeredRewards) {
        await this.databaseService.saveTriggeredReward(reward);
      }

      return {
        success: true,
        data: triggerEvent,
        message: 'Trigger test completed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to test trigger',
        timestamp: new Date()
      };
    }
  }

  async getRewardsLeaderboard(
    limit: number = 10
  ): Promise<MandalaApiResponse<any[]>> {
    try {
      // Mock implementation - would query top reward earners
      const leaderboard = Array.from({ length: limit }, (_, i) => ({
        rank: i + 1,
        userId: `user_${i + 1}`,
        displayName: `Usuario ${i + 1}`,
        totalRewards: Math.floor(Math.random() * 20) + 5,
        totalValue: Math.floor(Math.random() * 2000) + 500,
        tier: ['bronze', 'silver', 'gold', 'black'][Math.floor(Math.random() * 4)],
        mostRecentReward: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      }));

      return {
        success: true,
        data: leaderboard,
        message: 'Leaderboard retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get leaderboard',
        timestamp: new Date()
      };
    }
  }

  async getUserStats(
    userId: string
  ): Promise<MandalaApiResponse<any>> {
    try {
      const stats = {
        totalRewardsTriggered: Math.floor(Math.random() * 25) + 5,
        totalRewardsRedeemed: Math.floor(Math.random() * 15) + 3,
        totalValueEarned: Math.floor(Math.random() * 1500) + 300,
        redemptionRate: Math.random() * 0.3 + 0.6,
        favoriteRewardType: ['instant_discount', 'free_item', 'cashback'][Math.floor(Math.random() * 3)],
        mostActiveVenue: 'venue_1',
        averageRewardsPerVisit: Math.random() * 2 + 0.5,
        lastRewardDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        streakDays: Math.floor(Math.random() * 14) + 1
      };

      return {
        success: true,
        data: stats,
        message: 'User stats retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get user stats',
        timestamp: new Date()
      };
    }
  }

  async getConfig(): Promise<MandalaApiResponse<any>> {
    try {
      const config = {
        enabledTriggerTypes: [
          'location_entry',
          'location_exit',
          'extended_visit',
          'first_visit',
          'repeat_visit',
          'multiple_venues',
          'time_based',
          'weather_based',
          'tier_upgrade'
        ],
        rewardTypes: [
          'instant_discount',
          'cashback',
          'free_item',
          'points_multiplier',
          'tier_bonus',
          'vip_access',
          'future_discount',
          'bundle_offer',
          'happy_hour',
          'loyalty_credit'
        ],
        defaultExpirationHours: 24,
        maxRewardsPerUser: 10,
        minTimeBetweenRewards: 60, // minutes
        proximityTriggerRadius: 500, // meters
        extendedVisitThreshold: 120, // minutes
        weatherUpdateInterval: 30 // minutes
      };

      return {
        success: true,
        data: config,
        message: 'Configuration retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get configuration',
        timestamp: new Date()
      };
    }
  }

  async healthCheck(): Promise<MandalaApiResponse<any>> {
    try {
      const serviceHealth = await this.rewardTriggerService.healthCheck();
      const dbHealth = await this.databaseService.healthCheck();
      
      const overallHealth = serviceHealth && dbHealth;
      
      return {
        success: true,
        data: {
          status: overallHealth ? 'healthy' : 'unhealthy',
          services: {
            rewardTriggerService: serviceHealth ? 'healthy' : 'unhealthy',
            databaseService: dbHealth ? 'healthy' : 'unhealthy'
          },
          timestamp: new Date()
        },
        message: 'Health check completed',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Health check failed',
        timestamp: new Date()
      };
    }
  }
} 