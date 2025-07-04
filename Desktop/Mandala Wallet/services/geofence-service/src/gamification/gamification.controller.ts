import { GamificationService } from './gamification.service';
import { DatabaseService } from '../database/database.service';
import { NotificationService } from '../notification/notification.service';
import {
  TierConfiguration,
  UserTier,
  TierProgressSummary,
  PointsSummary,
  PointsActionType,
  PointsTransaction,
  LeaderboardData,
  TierUpgradeNotification,
  PointsAwardNotification,
  ApiResponse as MandalaApiResponse
} from '@mandala/shared-types';

export class GamificationController {
  constructor(
    private readonly gamificationService: GamificationService,
    private readonly databaseService: DatabaseService,
    private readonly notificationService: NotificationService
  ) {}

  // Get all tier configurations
  async getTierConfigurations(): Promise<MandalaApiResponse<TierConfiguration[]>> {
    try {
      const tiers = this.gamificationService.getAllTierConfigurations();
      return {
        success: true,
        data: tiers,
        message: 'Tier configurations retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve tier configurations',
        timestamp: new Date()
      };
    }
  }

  // Get specific tier configuration
  async getTierConfiguration(level: string): Promise<MandalaApiResponse<TierConfiguration>> {
    try {
      const tierLevel = level.toLowerCase() as any;
      const tier = this.gamificationService.getTierConfiguration(tierLevel);
      return {
        success: true,
        data: tier,
        message: 'Tier configuration retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve tier configuration',
        timestamp: new Date()
      };
    }
  }

  // Get user tier information
  async getUserTier(userId: string): Promise<MandalaApiResponse<UserTier>> {
    try {
      const userTier = await this.databaseService.getUserTier(userId);
      if (!userTier) {
        // Create new tier for user
        const newTier = await this.gamificationService.createUserTier(userId);
        return {
          success: true,
          data: newTier,
          message: 'User tier created successfully',
          timestamp: new Date()
        };
      }

      return {
        success: true,
        data: userTier,
        message: 'User tier retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve user tier',
        timestamp: new Date()
      };
    }
  }

  // Get user tier progress summary
  async getTierProgress(userId: string): Promise<MandalaApiResponse<TierProgressSummary>> {
    try {
      const progress = await this.gamificationService.getTierProgressSummary(userId);
      return {
        success: true,
        data: progress,
        message: 'Tier progress retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve tier progress',
        timestamp: new Date()
      };
    }
  }

  // Get user points summary
  async getPointsSummary(userId: string): Promise<MandalaApiResponse<PointsSummary>> {
    try {
      const summary = await this.gamificationService.getPointsSummary(userId);
      return {
        success: true,
        data: summary,
        message: 'Points summary retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve points summary',
        timestamp: new Date()
      };
    }
  }

  // Get user points transactions
  async getPointsTransactions(
    userId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<MandalaApiResponse<PointsTransaction[]>> {
    try {
      const transactions = await this.databaseService.getPointsTransactionsByUser(
        userId,
        limit,
        offset
      );
      return {
        success: true,
        data: transactions,
        message: 'Points transactions retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve points transactions',
        timestamp: new Date()
      };
    }
  }

  // Award points to user (admin/system endpoint)
  async awardPoints(
    userId: string,
    awardRequest: {
      actionType: PointsActionType;
      metadata?: Record<string, any>;
      reason?: string;
    }
  ): Promise<MandalaApiResponse<{
    pointsTransaction: PointsTransaction;
    tierUpgrade?: TierUpgradeNotification;
    notification: PointsAwardNotification;
  }>> {
    try {
      const result = await this.gamificationService.awardPoints(
        userId,
        awardRequest.actionType,
        awardRequest.metadata
      );

      // Store the points transaction
      await this.databaseService.createPointsTransaction(result.pointsTransaction);

      // Send notification about points awarded
      await this.notificationService.sendPointsNotification(result.notification);

      // Send tier upgrade notification if applicable
      if (result.tierUpgrade) {
        await this.notificationService.sendTierUpgradeNotification(result.tierUpgrade);
      }

      return {
        success: true,
        data: result,
        message: `Awarded ${result.pointsTransaction.points} points for ${awardRequest.actionType}`,
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to award points',
        timestamp: new Date()
      };
    }
  }

  // Get leaderboard
  async getLeaderboard(
    period: 'weekly' | 'monthly' | 'all_time' = 'monthly',
    limit: number = 10
  ): Promise<MandalaApiResponse<LeaderboardData>> {
    try {
      const leaderboard = await this.gamificationService.getLeaderboard(period, limit);
      return {
        success: true,
        data: leaderboard,
        message: 'Leaderboard retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to retrieve leaderboard',
        timestamp: new Date()
      };
    }
  }

  // Calculate points for an action (preview endpoint)
  async calculatePoints(calculateRequest: {
    actionType: PointsActionType;
    userTier: string;
    metadata?: Record<string, any>;
  }): Promise<MandalaApiResponse<{ points: number; description: string }>> {
    try {
      const tierLevel = calculateRequest.userTier.toLowerCase() as any;
      const points = this.gamificationService.calculatePoints(
        calculateRequest.actionType,
        tierLevel,
        calculateRequest.metadata
      );

      return {
        success: true,
        data: {
          points,
          description: `${calculateRequest.actionType} would award ${points} points for ${tierLevel} tier`
        },
        message: 'Points calculated successfully',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Failed to calculate points',
        timestamp: new Date()
      };
    }
  }

  // Health check
  async healthCheck(): Promise<MandalaApiResponse<{ status: string; services: Record<string, boolean> }>> {
    try {
      const gamificationHealth = await this.gamificationService.healthCheck();
      const databaseHealth = await this.databaseService.healthCheck();
      const notificationHealth = await this.notificationService.healthCheck();

      const allHealthy = gamificationHealth && databaseHealth && notificationHealth;

      return {
        success: allHealthy,
        data: {
          status: allHealthy ? 'healthy' : 'degraded',
          services: {
            gamification: gamificationHealth,
            database: databaseHealth,
            notification: notificationHealth
          }
        },
        message: allHealthy ? 'All services healthy' : 'Some services are degraded',
        timestamp: new Date()
      };
    } catch (error) {
      return {
        success: false,
        error: (error as Error).message,
        message: 'Health check failed',
        timestamp: new Date()
      };
    }
  }
} 