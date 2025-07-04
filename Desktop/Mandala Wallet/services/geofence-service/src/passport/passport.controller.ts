import { PassportService } from './passport.service';
import { DatabaseService } from '../database/database.service';
import { NotificationService } from '../notification/notification.service';
import {
  QRPassport,
  QRStamp,
  PassportTemplate,
  PassportCollection,
  PassportProgress,
  PassportAchievement,
  StampValidationResult,
  PassportAnalytics,
  ApiResponse as MandalaApiResponse
} from '@mandala/shared-types';

export class PassportController {
  constructor(
    private readonly passportService: PassportService,
    private readonly databaseService: DatabaseService,
    private readonly notificationService: NotificationService
  ) {}

  // Get all passport templates
  async getPassportTemplates(): Promise<MandalaApiResponse<PassportTemplate[]>> {
    try {
      const templates = this.passportService.getPassportTemplates();
      return {
        success: true,
        data: templates,
        message: 'Passport templates retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve passport templates',
        timestamp: new Date()
      };
    }
  }

  // Create a new passport for user
  async createPassport(
    userId: string,
    templateId: string
  ): Promise<MandalaApiResponse<QRPassport>> {
    try {
      const passport = await this.passportService.createPassport(userId, templateId);
      await this.databaseService.createUserPassport(passport);
      
      return {
        success: true,
        data: passport,
        message: `Passport ${passport.name} created successfully`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to create passport',
        timestamp: new Date()
      };
    }
  }

  // Get user's passport collection
  async getUserPassportCollection(userId: string): Promise<MandalaApiResponse<PassportCollection>> {
    try {
      const collection = await this.databaseService.getUserPassportCollection(userId);
      return {
        success: true,
        data: collection,
        message: 'Passport collection retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve passport collection',
        timestamp: new Date()
      };
    }
  }

  // Get user's active passports
  async getUserActivePassports(userId: string): Promise<MandalaApiResponse<QRPassport[]>> {
    try {
      const passports = await this.databaseService.getUserActivePassports(userId);
      return {
        success: true,
        data: passports,
        message: 'Active passports retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve active passports',
        timestamp: new Date()
      };
    }
  }

  // Get passport progress
  async getPassportProgress(
    userId: string,
    passportId: string
  ): Promise<MandalaApiResponse<PassportProgress>> {
    try {
      const progress = await this.passportService.getPassportProgress(userId, passportId);
      return {
        success: true,
        data: progress,
        message: 'Passport progress retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve passport progress',
        timestamp: new Date()
      };
    }
  }

  // Get user's QR stamps
  async getUserStamps(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<MandalaApiResponse<QRStamp[]>> {
    try {
      const stamps = await this.databaseService.getQRStampsByUser(userId, limit, offset);
      return {
        success: true,
        data: stamps,
        message: 'QR stamps retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve QR stamps',
        timestamp: new Date()
      };
    }
  }

  // Get stamps for specific passport
  async getPassportStamps(passportId: string): Promise<MandalaApiResponse<QRStamp[]>> {
    try {
      const stamps = await this.databaseService.getQRStampsByPassport(passportId);
      return {
        success: true,
        data: stamps,
        message: 'Passport stamps retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve passport stamps',
        timestamp: new Date()
      };
    }
  }

  // Award stamp manually (admin/system endpoint)
  async awardStamp(
    userId: string,
    awardRequest: {
      venueId: string;
      venueName: string;
      reason?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<MandalaApiResponse<StampValidationResult>> {
    try {
      // Create mock location event for manual stamp award
      const mockLocationEvent = {
        id: `manual_${Date.now()}`,
        userId,
        venueId: awardRequest.venueId,
        type: 'enter' as const,
        latitude: 21.134167, // Mock coordinates for Cancún
        longitude: -86.747833,
        accuracy: 10,
        timestamp: new Date(),
        metadata: awardRequest.metadata
      };

      const result = await this.passportService.awardStamp(
        userId,
        awardRequest.venueId,
        awardRequest.venueName,
        mockLocationEvent,
        {
          ...awardRequest.metadata,
          manualAward: true,
          reason: awardRequest.reason
        }
      );

      // Store stamps in database
      if (result.isValid && result.stamp) {
        await this.databaseService.createQRStamp(result.stamp);
        
        if (result.passportUpdates) {
          for (const passport of result.passportUpdates) {
            await this.databaseService.updateUserPassport(passport);
          }
        }
      }

      return {
        success: true,
        data: result,
        message: result.isValid ? 'Stamp awarded successfully' : result.reason || 'Failed to award stamp',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to award stamp',
        timestamp: new Date()
      };
    }
  }

  // Get passport achievements
  async getPassportAchievements(): Promise<MandalaApiResponse<PassportAchievement[]>> {
    try {
      const achievements = this.passportService.getAchievements();
      return {
        success: true,
        data: achievements,
        message: 'Passport achievements retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve passport achievements',
        timestamp: new Date()
      };
    }
  }

  // Get user's unlocked achievements
  async getUserAchievements(userId: string): Promise<MandalaApiResponse<PassportAchievement[]>> {
    try {
      const achievements = await this.databaseService.getUserPassportAchievements(userId);
      return {
        success: true,
        data: achievements,
        message: 'User achievements retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve user achievements',
        timestamp: new Date()
      };
    }
  }

  // Claim passport rewards
  async claimPassportRewards(
    userId: string,
    passportId: string
  ): Promise<MandalaApiResponse<{ claimed: boolean; rewards: any[] }>> {
    try {
      // Mock implementation - would validate and process reward claims
      const claimedRewards = [
        {
          type: 'points',
          value: 100,
          description: 'Passport completion bonus'
        }
      ];

      console.log(`User ${userId} claimed rewards for passport ${passportId}`);
      
      return {
        success: true,
        data: {
          claimed: true,
          rewards: claimedRewards
        },
        message: 'Passport rewards claimed successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to claim passport rewards',
        timestamp: new Date()
      };
    }
  }

  // Get passport analytics (admin endpoint)
  async getPassportAnalytics(
    dateRange?: { startDate: Date; endDate: Date }
  ): Promise<MandalaApiResponse<PassportAnalytics>> {
    try {
      const analytics = await this.databaseService.getPassportAnalytics(dateRange);
      return {
        success: true,
        data: analytics,
        message: 'Passport analytics retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve passport analytics',
        timestamp: new Date()
      };
    }
  }

  // Get venue stamp statistics
  async getVenueStampStats(
    venueId: string,
    dateRange?: { startDate: Date; endDate: Date }
  ): Promise<MandalaApiResponse<{
    venueId: string;
    totalStamps: number;
    uniqueUsers: number;
    averageStampsPerUser: number;
    popularPassportTypes: Array<{ type: string; count: number }>;
  }>> {
    try {
      const totalStamps = await this.databaseService.getVenueStampCount(venueId, dateRange);
      
      // Mock additional statistics
      const stats = {
        venueId,
        totalStamps,
        uniqueUsers: Math.floor(totalStamps * 0.7), // Estimate unique users
        averageStampsPerUser: totalStamps > 0 ? totalStamps / Math.floor(totalStamps * 0.7) : 0,
        popularPassportTypes: [
          { type: 'daily', count: Math.floor(totalStamps * 0.6) },
          { type: 'weekly', count: Math.floor(totalStamps * 0.3) },
          { type: 'venue_chain', count: Math.floor(totalStamps * 0.1) }
        ]
      };

      return {
        success: true,
        data: stats,
        message: 'Venue stamp statistics retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve venue stamp statistics',
        timestamp: new Date()
      };
    }
  }

  // Health check
  async healthCheck(): Promise<MandalaApiResponse<{ status: string; services: Record<string, boolean> }>> {
    try {
      const passportHealth = await this.passportService.healthCheck();
      const databaseHealth = await this.databaseService.healthCheck();
      const notificationHealth = await this.notificationService.healthCheck();

      const allHealthy = passportHealth && databaseHealth && notificationHealth;

      return {
        success: allHealthy,
        data: {
          status: allHealthy ? 'healthy' : 'degraded',
          services: {
            passport: passportHealth,
            database: databaseHealth,
            notification: notificationHealth
          }
        },
        message: allHealthy ? 'All passport services healthy' : 'Some passport services are degraded',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Passport health check failed',
        timestamp: new Date()
      };
    }
  }
} 