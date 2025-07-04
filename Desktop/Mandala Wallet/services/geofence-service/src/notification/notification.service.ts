import {
  GeofenceNotification,
  User,
  Venue,
  NotificationType,
  PointsAwardNotification,
  TierUpgradeNotification
} from '@mandala/shared-types';

export interface PushNotificationPayload {
  title: string;
  body: string;
  data?: Record<string, any>;
  icon?: string;
  badge?: number;
  sound?: string;
  priority?: 'high' | 'normal';
  ttl?: number;
}

export class NotificationService {
  constructor() {
    // Initialize notification service
  }

  // Send geofence notification
  async sendGeofenceNotification(notification: GeofenceNotification): Promise<boolean> {
    try {
      const payload: PushNotificationPayload = {
        title: notification.title,
        body: notification.message,
        data: {
          type: 'geofence',
          venueId: notification.venueId,
          actionUrl: notification.actionUrl,
          notificationId: notification.id
        },
        icon: '/icons/mandala-icon-192.png',
        badge: 1,
        priority: 'high',
        ttl: 86400 // 24 hours
      };

      // Mock FCM send - in production would use Firebase Admin SDK
      console.log(`Sending ${notification.type} notification to user ${notification.userId}:`, {
        title: payload.title,
        body: payload.body,
        data: payload.data
      });

      // Simulate successful delivery
      await this.delay(100);
      
      // Store notification in database
      await this.storeNotification(notification);
      
      return true;
    } catch (error) {
      console.error('Error sending geofence notification:', error);
      return false;
    }
  }

  // Send push notification to specific user
  async sendPushNotification(
    userId: string,
    payload: PushNotificationPayload
  ): Promise<boolean> {
    try {
      console.log(`Sending push notification to user ${userId}:`, payload);
      
      // Mock implementation - would use Firebase Cloud Messaging
      await this.delay(50);
      
      return true;
    } catch (error) {
      console.error('Error sending push notification:', error);
      return false;
    }
  }

  // Send location-based promotional notification
  async sendLocationPromotion(
    userId: string,
    venueId: string,
    promotion: {
      title: string;
      description: string;
      actionUrl: string;
    }
  ): Promise<boolean> {
    const notification: GeofenceNotification = {
      id: `promo_notif_${Date.now()}`,
      userId,
      venueId,
      type: 'promotion',
      title: promotion.title,
      message: promotion.description,
      actionUrl: promotion.actionUrl,
      isRead: false,
      sentAt: new Date()
    };

    return await this.sendGeofenceNotification(notification);
  }

  // Send welcome notification for new venue visitor
  async sendWelcomeNotification(
    userId: string,
    venueId: string,
    venueName: string,
    isFirstVisit: boolean = false
  ): Promise<boolean> {
    const notification: GeofenceNotification = {
      id: `welcome_${Date.now()}`,
      userId,
      venueId,
      type: 'welcome',
      title: isFirstVisit ? `¡Bienvenido a ${venueName}!` : `¡Hola de nuevo!`,
      message: isFirstVisit 
        ? `Gracias por visitarnos por primera vez. ¡Disfruta tu experiencia!`
        : `¡Qué bueno verte otra vez en ${venueName}!`,
      actionUrl: `/venues/${venueId}`,
      isRead: false,
      sentAt: new Date()
    };

    return await this.sendGeofenceNotification(notification);
  }

  // Send farewell notification when user leaves venue
  async sendFarewellNotification(
    userId: string,
    venueId: string,
    venueName: string,
    visitDurationMinutes?: number
  ): Promise<boolean> {
    const durationText = visitDurationMinutes 
      ? `después de ${visitDurationMinutes} minutos`
      : '';

    const notification: GeofenceNotification = {
      id: `farewell_${Date.now()}`,
      userId,
      venueId,
      type: 'farewell',
      title: '¡Gracias por visitarnos!',
      message: `Esperamos que hayas disfrutado tu tiempo en ${venueName} ${durationText}. ¡Regresa pronto!`,
      actionUrl: `/venues/${venueId}/feedback`,
      isRead: false,
      sentAt: new Date()
    };

    return await this.sendGeofenceNotification(notification);
  }

  // Send reminder notification for users near venue
  async sendProximityReminder(
    userId: string,
    venueId: string,
    venueName: string,
    reminderType: 'visit' | 'promotion' | 'event'
  ): Promise<boolean> {
    let title = '';
    let message = '';
    
    switch (reminderType) {
      case 'visit':
        title = `¡${venueName} está cerca!`;
        message = '¿Te gustaría visitarnos? Tenemos ofertas especiales esperándote.';
        break;
      case 'promotion':
        title = '🎉 ¡Oferta especial cerca!';
        message = `Estás cerca de ${venueName}. ¡Aprovecha nuestras promociones actuales!`;
        break;
      case 'event':
        title = '🎵 ¡Evento en vivo!';
        message = `Hay un evento especial en ${venueName}. ¡No te lo pierdas!`;
        break;
    }

    const notification: GeofenceNotification = {
      id: `reminder_${Date.now()}`,
      userId,
      venueId,
      type: 'reminder',
      title,
      message,
      actionUrl: `/venues/${venueId}/current-offers`,
      isRead: false,
      sentAt: new Date()
    };

    return await this.sendGeofenceNotification(notification);
  }

  // Get notification preferences for user
  async getNotificationPreferences(userId: string): Promise<{
    geofenceEnabled: boolean;
    promotionsEnabled: boolean;
    welcomeEnabled: boolean;
    farewellEnabled: boolean;
    reminderEnabled: boolean;
  }> {
    // Mock implementation - would fetch from user preferences
    return {
      geofenceEnabled: true,
      promotionsEnabled: true,
      welcomeEnabled: true,
      farewellEnabled: true,
      reminderEnabled: true
    };
  }

  // Update notification preferences
  async updateNotificationPreferences(
    userId: string,
    preferences: {
      geofenceEnabled?: boolean;
      promotionsEnabled?: boolean;
      welcomeEnabled?: boolean;
      farewellEnabled?: boolean;
      reminderEnabled?: boolean;
    }
  ): Promise<boolean> {
    console.log(`Updating notification preferences for user ${userId}:`, preferences);
    // Would update user preferences in database
    return true;
  }

  // Get notification history for user
  async getNotificationHistory(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<GeofenceNotification[]> {
    // Mock implementation - would fetch from database
    return [];
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId: string, userId: string): Promise<boolean> {
    console.log(`Marking notification ${notificationId} as read for user ${userId}`);
    // Would update notification status in database
    return true;
  }

  // Batch send notifications to multiple users
  async sendBatchNotifications(
    notifications: Array<{
      userId: string;
      payload: PushNotificationPayload;
    }>
  ): Promise<{
    successful: number;
    failed: number;
    results: Array<{ userId: string; success: boolean; error?: string }>;
  }> {
    const results = [];
    let successful = 0;
    let failed = 0;

    for (const notif of notifications) {
      try {
        const success = await this.sendPushNotification(notif.userId, notif.payload);
        results.push({ userId: notif.userId, success });
        if (success) {
          successful++;
        } else {
          failed++;
        }
      } catch (error) {
        results.push({ 
          userId: notif.userId, 
          success: false, 
          error: (error as Error).message 
        });
        failed++;
      }
    }

    return { successful, failed, results };
  }

  // Test notification for debugging
  async sendTestNotification(userId: string): Promise<boolean> {
    const payload: PushNotificationPayload = {
      title: 'Mandala Wallet - Notificación de Prueba',
      body: 'Esta es una notificación de prueba para verificar que todo funciona correctamente.',
      data: {
        type: 'test',
        timestamp: new Date().toISOString()
      },
      priority: 'normal'
    };

    return await this.sendPushNotification(userId, payload);
  }

  // Private helper methods
  private async storeNotification(notification: GeofenceNotification): Promise<void> {
    console.log('Storing notification in database:', notification.id);
    // Would store in geofence_notifications table
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      // Test notification service connectivity
      await this.delay(10);
      return true;
    } catch (error) {
      console.error('Notification service health check failed:', error);
      return false;
    }
  }

  // Send points award notification
  async sendPointsNotification(notification: PointsAwardNotification): Promise<boolean> {
    try {
      const payload: PushNotificationPayload = {
        title: `🎯 ¡${notification.pointsAwarded} puntos ganados!`,
        body: `${notification.description}. Total: ${notification.totalPoints} puntos.`,
        data: {
          type: 'points_awarded',
          actionType: notification.actionType,
          pointsAwarded: notification.pointsAwarded.toString(),
          totalPoints: notification.totalPoints.toString(),
          currentTier: notification.tierProgress.currentTier,
          pointsToNextTier: notification.tierProgress.pointsToNextTier.toString()
        },
        icon: '/icons/points-icon.png',
        badge: 1,
        priority: 'normal',
        ttl: 86400 // 24 hours
      };

      console.log(`Sending points notification to user ${notification.userId}:`, {
        title: payload.title,
        body: payload.body,
        data: payload.data
      });

      // Mock FCM send
      await this.delay(100);
      
      return true;
    } catch (error) {
      console.error('Error sending points notification:', error);
      return false;
    }
  }

  // Send tier upgrade notification
  async sendTierUpgradeNotification(notification: TierUpgradeNotification): Promise<boolean> {
    try {
      const payload: PushNotificationPayload = {
        title: `🎉 ¡Nivel ${notification.newTier.toUpperCase()} desbloqueado!`,
        body: notification.congratulationMessage,
        data: {
          type: 'tier_upgrade',
          previousTier: notification.previousTier,
          newTier: notification.newTier,
          pointsEarned: notification.pointsEarned.toString(),
          benefitsCount: notification.newBenefits.length.toString()
        },
        icon: '/icons/tier-upgrade-icon.png',
        badge: 1,
        priority: 'high',
        ttl: 86400 // 24 hours
      };

      console.log(`Sending tier upgrade notification to user ${notification.userId}:`, {
        title: payload.title,
        body: payload.body,
        data: payload.data
      });

      // Mock FCM send
      await this.delay(100);
      
      return true;
    } catch (error) {
      console.error('Error sending tier upgrade notification:', error);
      return false;
    }
  }
} 