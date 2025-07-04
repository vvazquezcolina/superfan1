import { ProgressTrackingService } from './progress-tracking.service';
import { DatabaseService } from '../database/database.service';
import {
  ProgressMetricType,
  ProgressPeriod,
  ProgressChartType,
  UserProgressSummary,
  ProgressDashboard,
  Leaderboard,
  ProgressGoal,
  ProgressAnalytics,
  VenueAnalytics,
  ProgressVisualization,
  ProgressResponse,
  UserRole,
  User,
  ApiResponse as MandalaApiResponse
} from '@mandala/shared-types';

export class ProgressTrackingController {
  constructor(
    private readonly progressTrackingService: ProgressTrackingService,
    private readonly databaseService: DatabaseService
  ) {}

  async getUserProgressSummary(
    user: User
  ): Promise<MandalaApiResponse<UserProgressSummary>> {
    try {
      const summary = await this.progressTrackingService.getUserProgressSummary(user.id);
      
      return {
        success: true,
        data: summary,
        message: 'Progress summary retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get progress summary',
        timestamp: new Date()
      };
    }
  }

  async getProgressDashboard(
    user: User,
    dashboardType: 'user' | 'admin' | 'venue_manager' = 'user'
  ): Promise<MandalaApiResponse<ProgressDashboard>> {
    try {
      // Check permissions for admin/venue manager dashboards
      if (dashboardType !== 'user') {
        if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.VENUE_MANAGER)) {
          throw new Error('Insufficient permissions for requested dashboard type');
        }
      }

      const dashboard = await this.progressTrackingService.createProgressDashboard(
        user.id,
        dashboardType
      );
      
      return {
        success: true,
        data: dashboard,
        message: 'Dashboard retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get dashboard',
        timestamp: new Date()
      };
    }
  }

  async getTierProgress(
    user: User
  ): Promise<MandalaApiResponse<any>> {
    try {
      const tierProgress = await this.progressTrackingService.getTierProgressStatus(user.id);
      
      return {
        success: true,
        data: tierProgress,
        message: 'Tier progress retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get tier progress',
        timestamp: new Date()
      };
    }
  }

  async getAchievements(
    user: User,
    category?: string,
    status?: 'completed' | 'in_progress' | 'all'
  ): Promise<MandalaApiResponse<any>> {
    try {
      const achievements = await this.progressTrackingService.getAchievementProgressSummary(user.id);
      
      let filteredAchievements;
      switch (status) {
        case 'completed':
          filteredAchievements = achievements.recentAchievements;
          break;
        case 'in_progress':
          filteredAchievements = achievements.inProgressAchievements;
          break;
        default:
          filteredAchievements = achievements;
      }

      if (category) {
        // Filter by category if specified
        if (Array.isArray(filteredAchievements)) {
          filteredAchievements = filteredAchievements.filter((a: any) => a.category === category);
        }
      }
      
      return {
        success: true,
        data: filteredAchievements,
        message: 'Achievements retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get achievements',
        timestamp: new Date()
      };
    }
  }

  async getLeaderboard(
    category: 'points' | 'visits' | 'spending' | 'achievements' | 'streaks' = 'points',
    period: ProgressPeriod = ProgressPeriod.WEEKLY,
    limit: number = 10
  ): Promise<MandalaApiResponse<Leaderboard>> {
    try {
      const leaderboard = await this.progressTrackingService.getLeaderboard(
        category,
        period,
        Math.min(limit, 50) // Max 50 entries
      );
      
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

  async getVenueEngagement(
    user: User,
    venueId?: string
  ): Promise<MandalaApiResponse<any>> {
    try {
      const venueEngagement = await this.progressTrackingService.getVenueEngagement(user.id);
      
      const filteredEngagement = venueId 
        ? venueEngagement.filter(ve => ve.venueId === venueId)
        : venueEngagement;
      
      return {
        success: true,
        data: filteredEngagement,
        message: 'Venue engagement retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get venue engagement',
        timestamp: new Date()
      };
    }
  }

  async getStreakAnalytics(
    user: User,
    streakType?: 'daily_visit' | 'weekly_visit' | 'spending' | 'passport_stamps'
  ): Promise<MandalaApiResponse<any>> {
    try {
      const streakAnalytics = await this.progressTrackingService.getStreakAnalytics(user.id);
      
      const filteredStreaks = streakType 
        ? streakAnalytics.filter(sa => sa.streakType === streakType)
        : streakAnalytics;
      
      return {
        success: true,
        data: filteredStreaks,
        message: 'Streak analytics retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get streak analytics',
        timestamp: new Date()
      };
    }
  }

  async getPointsAnalytics(
    user: User,
    period: ProgressPeriod = ProgressPeriod.MONTHLY
  ): Promise<MandalaApiResponse<any>> {
    try {
      const pointsAnalytics = await this.progressTrackingService.getPointsAnalytics(user.id);
      
      // Add period-specific trend data
      if (period !== ProgressPeriod.MONTHLY) {
        pointsAnalytics.pointsTrend = await this.progressTrackingService.generatePointsTrend(
          user.id,
          period
        );
      }
      
      return {
        success: true,
        data: pointsAnalytics,
        message: 'Points analytics retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get points analytics',
        timestamp: new Date()
      };
    }
  }

  async getProgressInsights(
    user: User,
    category?: string,
    priority?: 'low' | 'medium' | 'high'
  ): Promise<MandalaApiResponse<any>> {
    try {
      const insights = await this.progressTrackingService.generateProgressInsights(user.id);
      
      let filteredInsights = insights;
      
      if (category) {
        filteredInsights = filteredInsights.filter(insight => insight.category === category);
      }
      
      if (priority) {
        filteredInsights = filteredInsights.filter(insight => insight.priority === priority);
      }
      
      return {
        success: true,
        data: filteredInsights,
        message: 'Progress insights retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get progress insights',
        timestamp: new Date()
      };
    }
  }

  async getVisualizationData(
    user: User,
    visualizationType: ProgressChartType,
    metricType: ProgressMetricType,
    period: ProgressPeriod = ProgressPeriod.WEEKLY
  ): Promise<MandalaApiResponse<any>> {
    try {
      const data = await this.generateVisualizationData(
        user.id,
        visualizationType,
        metricType,
        period
      );
      
      return {
        success: true,
        data,
        message: 'Visualization data retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get visualization data',
        timestamp: new Date()
      };
    }
  }

  async getUserGoals(
    user: User,
    status?: 'active' | 'completed' | 'expired'
  ): Promise<MandalaApiResponse<any>> {
    try {
      // Mock implementation - would query database for user goals
      const mockGoals = [
        {
          id: 'weekly_visits_user',
          userId: user.id,
          title: 'Meta Semanal de Visitas',
          description: 'Visita Mandala 3 veces esta semana',
          targetValue: 3,
          currentValue: Math.floor(Math.random() * 3),
          progressPercentage: 0,
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          isCompleted: false,
          category: 'visits'
        },
        {
          id: 'monthly_points_user',
          userId: user.id,
          title: 'Meta Mensual de Puntos',
          description: 'Gana 1,000 puntos este mes',
          targetValue: 1000,
          currentValue: Math.floor(Math.random() * 1000),
          progressPercentage: 0,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          isCompleted: false,
          category: 'points'
        }
      ];

      // Calculate progress percentages
      mockGoals.forEach(goal => {
        goal.progressPercentage = Math.round((goal.currentValue / goal.targetValue) * 100);
        goal.isCompleted = goal.currentValue >= goal.targetValue;
      });

      let filteredGoals = mockGoals;
      
      if (status) {
        switch (status) {
          case 'active':
            filteredGoals = mockGoals.filter(g => !g.isCompleted && new Date() < g.deadline);
            break;
          case 'completed':
            filteredGoals = mockGoals.filter(g => g.isCompleted);
            break;
          case 'expired':
            filteredGoals = mockGoals.filter(g => !g.isCompleted && new Date() > g.deadline);
            break;
        }
      }
      
      return {
        success: true,
        data: filteredGoals,
        message: 'User goals retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get user goals',
        timestamp: new Date()
      };
    }
  }

  async getVenueAnalytics(
    user: User,
    venueId: string,
    period: ProgressPeriod = ProgressPeriod.MONTHLY
  ): Promise<MandalaApiResponse<VenueAnalytics>> {
    try {
      // Check permissions for venue analytics
      if (!user.roles.includes(UserRole.ADMIN) && !user.roles.includes(UserRole.VENUE_MANAGER)) {
        throw new Error('Insufficient permissions for venue analytics');
      }

      // Mock venue analytics
      const venueAnalytics: VenueAnalytics = {
        venueId,
        venueName: 'Mandala Beach Club',
        period,
        engagement: {
          totalVisits: Math.floor(Math.random() * 1000) + 500,
          uniqueVisitors: Math.floor(Math.random() * 300) + 200,
          averageVisitDuration: Math.floor(Math.random() * 120) + 90,
          repeatVisitorRate: Math.random() * 0.4 + 0.4,
          peakHours: Array.from({ length: 8 }, (_, i) => ({
            hour: 18 + i,
            visits: Math.floor(Math.random() * 100) + 20
          })),
          peakDays: [
            { day: 'friday', visits: Math.floor(Math.random() * 200) + 100 },
            { day: 'saturday', visits: Math.floor(Math.random() * 250) + 150 },
            { day: 'sunday', visits: Math.floor(Math.random() * 180) + 80 }
          ]
        },
        gamification: {
          pointsAwarded: Math.floor(Math.random() * 50000) + 20000,
          stampsCollected: Math.floor(Math.random() * 1000) + 500,
          achievementsUnlocked: Math.floor(Math.random() * 200) + 100,
          tierUpgrades: Math.floor(Math.random() * 50) + 20,
          rewardsTriggered: Math.floor(Math.random() * 300) + 150
        },
        userSegmentation: {
          byTier: {
            bronze: Math.floor(Math.random() * 150) + 100,
            silver: Math.floor(Math.random() * 100) + 50,
            gold: Math.floor(Math.random() * 50) + 25,
            black: Math.floor(Math.random() * 20) + 10
          },
          byEngagement: {
            low: Math.floor(Math.random() * 100) + 50,
            medium: Math.floor(Math.random() * 150) + 100,
            high: Math.floor(Math.random() * 100) + 75
          },
          newVsReturning: {
            new: Math.floor(Math.random() * 100) + 50,
            returning: Math.floor(Math.random() * 200) + 150
          }
        },
        revenue: {
          totalSpending: Math.floor(Math.random() * 500000) + 200000,
          averageSpendingPerVisit: Math.floor(Math.random() * 1000) + 300,
          averageSpendingPerUser: Math.floor(Math.random() * 3000) + 1000,
          spendingTrend: {
            period,
            data: [],
            trend: 'increasing',
            changePercentage: Math.random() * 20 + 5,
            totalValue: 0,
            averageValue: 0,
            peakValue: 0,
            peakDate: new Date()
          }
        },
        recommendations: [
          {
            type: 'recommendation',
            title: 'Optimizar horarios de peak',
            description: 'Los fines de semana de 9-11 PM tienen la mayor actividad. Considere promociones especiales.',
            actionable: true,
            actionText: 'Crear promoción',
            actionUrl: '/admin/promotions/create',
            priority: 'high',
            category: 'engagement',
            generatedAt: new Date()
          }
        ]
      };
      
      return {
        success: true,
        data: venueAnalytics,
        message: 'Venue analytics retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get venue analytics',
        timestamp: new Date()
      };
    }
  }

  async getUserRankings(
    user: User,
    category: 'points' | 'visits' | 'spending' | 'achievements' = 'points'
  ): Promise<MandalaApiResponse<any>> {
    try {
      // Mock user rankings across different categories
      const rankings = {
        global: {
          rank: Math.floor(Math.random() * 1000) + 1,
          totalUsers: Math.floor(Math.random() * 5000) + 2000,
          percentile: Math.floor(Math.random() * 100) + 1,
          score: Math.floor(Math.random() * 10000) + 1000
        },
        venue: {
          rank: Math.floor(Math.random() * 100) + 1,
          totalUsers: Math.floor(Math.random() * 500) + 200,
          percentile: Math.floor(Math.random() * 100) + 1,
          score: Math.floor(Math.random() * 5000) + 500
        },
        tier: {
          rank: Math.floor(Math.random() * 50) + 1,
          totalUsers: Math.floor(Math.random() * 200) + 100,
          percentile: Math.floor(Math.random() * 100) + 1,
          score: Math.floor(Math.random() * 3000) + 300
        },
        improvements: {
          rankChange: Math.floor(Math.random() * 20) - 10,
          scoreChange: Math.floor(Math.random() * 200) - 100,
          nextRankScore: Math.floor(Math.random() * 500) + 100
        }
      };
      
      return {
        success: true,
        data: rankings,
        message: 'User rankings retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get user rankings',
        timestamp: new Date()
      };
    }
  }

  async getProgressMetrics(
    user: User,
    metricTypes: ProgressMetricType[],
    period: ProgressPeriod = ProgressPeriod.WEEKLY
  ): Promise<MandalaApiResponse<any>> {
    try {
      const metrics: Record<string, any> = {};
      
      for (const metricType of metricTypes) {
        switch (metricType) {
          case ProgressMetricType.POINTS:
            metrics.points = await this.progressTrackingService.getPointsAnalytics(user.id);
            break;
          case ProgressMetricType.TIER_PROGRESS:
            metrics.tierProgress = await this.progressTrackingService.getTierProgressStatus(user.id);
            break;
          case ProgressMetricType.ACHIEVEMENTS:
            metrics.achievements = await this.progressTrackingService.getAchievementProgressSummary(user.id);
            break;
          case ProgressMetricType.VISITS:
            metrics.visits = await this.progressTrackingService.getVenueEngagement(user.id);
            break;
          case ProgressMetricType.STREAKS:
            metrics.streaks = await this.progressTrackingService.getStreakAnalytics(user.id);
            break;
          case ProgressMetricType.SOCIAL_ENGAGEMENT:
            metrics.social = await this.progressTrackingService.getSocialMetrics(user.id);
            break;
        }
      }
      
      return {
        success: true,
        data: metrics,
        message: 'Progress metrics retrieved successfully',
        timestamp: new Date()
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage,
        message: 'Failed to get progress metrics',
        timestamp: new Date()
      };
    }
  }

  // Helper method to generate visualization data
  private async generateVisualizationData(
    userId: string,
    chartType: ProgressChartType,
    metricType: ProgressMetricType,
    period: ProgressPeriod
  ): Promise<any> {
    switch (chartType) {
      case ProgressChartType.LINE:
        return this.generateLineChartData(userId, metricType, period);
      case ProgressChartType.PIE:
        return this.generatePieChartData(userId, metricType);
      case ProgressChartType.BAR:
        return this.generateBarChartData(userId, metricType, period);
      case ProgressChartType.GAUGE:
        return this.generateGaugeData(userId, metricType);
      case ProgressChartType.HEATMAP:
        return this.generateHeatmapData(userId, period);
      default:
        throw new Error(`Unsupported chart type: ${chartType}`);
    }
  }

  private async generateLineChartData(
    userId: string,
    metricType: ProgressMetricType,
    period: ProgressPeriod
  ): Promise<any> {
    const trend = await this.progressTrackingService.generatePointsTrend(userId, period);
    
    return {
      labels: trend.data.map(point => point.label),
      datasets: [{
        label: this.getMetricLabel(metricType),
        data: trend.data.map(point => point.value),
        borderColor: '#FF6B6B',
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        tension: 0.4
      }]
    };
  }

  private async generatePieChartData(userId: string, metricType: ProgressMetricType): Promise<any> {
    const venueEngagement = await this.progressTrackingService.getVenueEngagement(userId);
    
    return {
      labels: venueEngagement.map(ve => ve.venueName),
      datasets: [{
        data: venueEngagement.map(ve => ve.totalVisits),
        backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
      }]
    };
  }

  private async generateBarChartData(
    userId: string,
    metricType: ProgressMetricType,
    period: ProgressPeriod
  ): Promise<any> {
    const achievements = await this.progressTrackingService.getAchievementProgressSummary(userId);
    
    return {
      labels: achievements.inProgressAchievements.map((a: any) => a.name),
      datasets: [{
        label: 'Progreso (%)',
        data: achievements.inProgressAchievements.map((a: any) => a.progressPercentage),
        backgroundColor: '#4ECDC4'
      }]
    };
  }

  private async generateGaugeData(userId: string, metricType: ProgressMetricType): Promise<any> {
    const tierProgress = await this.progressTrackingService.getTierProgressStatus(userId);
    
    return {
      datasets: [{
        data: [tierProgress.progressPercentage, 100 - tierProgress.progressPercentage],
        backgroundColor: ['#FF6B6B', '#E0E0E0'],
        circumference: 180,
        rotation: 270
      }]
    };
  }

  private async generateHeatmapData(userId: string, period: ProgressPeriod): Promise<any> {
    // Mock heatmap data for activity by day/hour
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const hours = Array.from({ length: 24 }, (_, i) => i);
    
    const data = [];
    for (let day = 0; day < 7; day++) {
      for (let hour = 0; hour < 24; hour++) {
        data.push({
          x: hour,
          y: day,
          v: Math.floor(Math.random() * 10)
        });
      }
    }
    
    return {
      datasets: [{
        label: 'Actividad',
        data,
        backgroundColor: function(context: any) {
          const value = context.parsed.v;
          const alpha = value / 10;
          return `rgba(255, 107, 107, ${alpha})`;
        }
      }],
      scales: {
        x: { type: 'linear', position: 'bottom', min: 0, max: 23 },
        y: { type: 'linear', min: 0, max: 6 }
      }
    };
  }

  private getMetricLabel(metricType: ProgressMetricType): string {
    switch (metricType) {
      case ProgressMetricType.POINTS: return 'Puntos';
      case ProgressMetricType.VISITS: return 'Visitas';
      case ProgressMetricType.SPENDING: return 'Gasto (MXN)';
      case ProgressMetricType.ACHIEVEMENTS: return 'Logros';
      case ProgressMetricType.STREAKS: return 'Rachas';
      default: return 'Métrica';
    }
  }

  async healthCheck(): Promise<MandalaApiResponse<any>> {
    try {
      const serviceHealth = await this.progressTrackingService.healthCheck();
      const dbHealth = await this.databaseService.healthCheck();
      
      const overallHealth = serviceHealth && dbHealth;
      
      return {
        success: true,
        data: {
          status: overallHealth ? 'healthy' : 'unhealthy',
          services: {
            progressTrackingService: serviceHealth ? 'healthy' : 'unhealthy',
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