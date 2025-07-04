import {
  ProgressMetricType,
  ProgressPeriod,
  ProgressChartType,
  AchievementCategory,
  ProgressDataPoint,
  ProgressTrend,
  TierProgressStatus,
  AchievementProgress,
  StreakAnalytics,
  VenueEngagement,
  SocialMetrics,
  ProgressInsight,
  UserProgressSummary,
  ProgressVisualization,
  ProgressDashboard,
  Leaderboard,
  LeaderboardEntry,
  ProgressGoal,
  ProgressNotification,
  ProgressAnalytics,
  VenueAnalytics,
  ProgressUpdate,
  User,
  UserTier,
  TierLevel
} from '@mandala/shared-types';

export class ProgressTrackingService {
  private readonly achievements: Map<string, AchievementProgress>;
  private readonly goals: Map<string, ProgressGoal>;
  private readonly visualizations: Map<string, ProgressVisualization>;

  constructor() {
    this.achievements = new Map();
    this.goals = new Map();
    this.visualizations = new Map();
    this.initializeAchievements();
    this.initializeGoals();
    this.initializeVisualizations();
  }

  // Initialize achievement definitions
  private initializeAchievements(): void {
    const achievements: AchievementProgress[] = [
      {
        achievementId: 'first_steps',
        name: 'Primeros Pasos',
        description: 'Visita Mandala por primera vez',
        category: AchievementCategory.VISITS,
        icon: '👶',
        currentProgress: 0,
        totalRequired: 1,
        progressPercentage: 0,
        isCompleted: false,
        rarity: 'common',
        pointsReward: 50
      },
      {
        achievementId: 'regular_visitor',
        name: 'Visitante Regular',
        description: 'Visita Mandala 10 veces',
        category: AchievementCategory.VISITS,
        icon: '🎯',
        currentProgress: 0,
        totalRequired: 10,
        progressPercentage: 0,
        isCompleted: false,
        rarity: 'common',
        pointsReward: 200
      },
      {
        achievementId: 'night_owl',
        name: 'Búho Nocturno',
        description: 'Visita después de medianoche 5 veces',
        category: AchievementCategory.VISITS,
        icon: '🦉',
        currentProgress: 0,
        totalRequired: 5,
        progressPercentage: 0,
        isCompleted: false,
        rarity: 'rare',
        pointsReward: 300
      },
      {
        achievementId: 'big_spender',
        name: 'Gran Gastador',
        description: 'Gasta $5,000 MXN en total',
        category: AchievementCategory.SPENDING,
        icon: '💎',
        currentProgress: 0,
        totalRequired: 5000,
        progressPercentage: 0,
        isCompleted: false,
        rarity: 'epic',
        pointsReward: 500
      },
      {
        achievementId: 'social_butterfly',
        name: 'Mariposa Social',
        description: 'Invita a 5 amigos al sistema',
        category: AchievementCategory.SOCIAL,
        icon: '🦋',
        currentProgress: 0,
        totalRequired: 5,
        progressPercentage: 0,
        isCompleted: false,
        rarity: 'rare',
        pointsReward: 400
      },
      {
        achievementId: 'streak_master',
        name: 'Maestro de Rachas',
        description: 'Mantén una racha de 7 días visitando',
        category: AchievementCategory.LOYALTY,
        icon: '🔥',
        currentProgress: 0,
        totalRequired: 7,
        progressPercentage: 0,
        isCompleted: false,
        rarity: 'epic',
        pointsReward: 600
      },
      {
        achievementId: 'explorer',
        name: 'Explorador',
        description: 'Visita todos los venues de Mandala',
        category: AchievementCategory.EXPLORATION,
        icon: '🗺️',
        currentProgress: 0,
        totalRequired: 3,
        progressPercentage: 0,
        isCompleted: false,
        rarity: 'rare',
        pointsReward: 350
      },
      {
        achievementId: 'gold_tier',
        name: 'Nivel Dorado',
        description: 'Alcanza el tier Gold',
        category: AchievementCategory.TIER_MILESTONE,
        icon: '🥇',
        currentProgress: 0,
        totalRequired: 1,
        progressPercentage: 0,
        isCompleted: false,
        rarity: 'epic',
        pointsReward: 1000
      },
      {
        achievementId: 'passport_collector',
        name: 'Coleccionista de Pasaportes',
        description: 'Completa 5 pasaportes diferentes',
        category: AchievementCategory.EXPLORATION,
        icon: '📖',
        currentProgress: 0,
        totalRequired: 5,
        progressPercentage: 0,
        isCompleted: false,
        rarity: 'legendary',
        pointsReward: 800
      },
      {
        achievementId: 'early_bird',
        name: 'Madrugador',
        description: 'Visita antes de las 8 PM 10 veces',
        category: AchievementCategory.VISITS,
        icon: '🐦',
        currentProgress: 0,
        totalRequired: 10,
        progressPercentage: 0,
        isCompleted: false,
        rarity: 'common',
        pointsReward: 150
      }
    ];

    achievements.forEach(achievement => {
      this.achievements.set(achievement.achievementId, achievement);
    });
  }

  // Initialize goal templates
  private initializeGoals(): void {
    const goals: ProgressGoal[] = [
      {
        id: 'weekly_visits',
        userId: '', // Set per user
        title: 'Meta Semanal de Visitas',
        description: 'Visita Mandala 3 veces esta semana',
        category: AchievementCategory.VISITS,
        targetValue: 3,
        currentValue: 0,
        progressPercentage: 0,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isCompleted: false,
        reward: {
          type: 'points',
          value: 100,
          description: '100 puntos bonus'
        },
        milestones: [
          { percentage: 33, reward: '25 puntos', isUnlocked: false },
          { percentage: 66, reward: '50 puntos', isUnlocked: false },
          { percentage: 100, reward: '100 puntos bonus', isUnlocked: false }
        ]
      },
      {
        id: 'monthly_spending',
        userId: '',
        title: 'Meta Mensual de Gasto',
        description: 'Gasta $2,000 MXN este mes',
        category: AchievementCategory.SPENDING,
        targetValue: 2000,
        currentValue: 0,
        progressPercentage: 0,
        deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isCompleted: false,
        reward: {
          type: 'tier_boost',
          value: 200,
          description: '200 puntos extra hacia siguiente tier'
        },
        milestones: [
          { percentage: 25, reward: 'Copa gratis', isUnlocked: false },
          { percentage: 50, reward: '10% descuento', isUnlocked: false },
          { percentage: 75, reward: '15% descuento', isUnlocked: false },
          { percentage: 100, reward: 'Acceso VIP gratis', isUnlocked: false }
        ]
      }
    ];

    goals.forEach(goal => {
      this.goals.set(goal.id, goal);
    });
  }

  // Initialize visualization templates
  private initializeVisualizations(): void {
    const visualizations: ProgressVisualization[] = [
      {
        id: 'points_trend',
        type: ProgressChartType.LINE,
        title: 'Tendencia de Puntos',
        description: 'Evolución de puntos ganados en el tiempo',
        data: {},
        options: {
          responsive: true,
          scales: {
            y: { beginAtZero: true }
          },
          plugins: {
            legend: { position: 'top' },
            title: { display: true, text: 'Puntos Acumulados' }
          }
        },
        period: ProgressPeriod.WEEKLY,
        metricType: ProgressMetricType.POINTS,
        refreshInterval: 300,
        isRealTime: false
      },
      {
        id: 'tier_progress',
        type: ProgressChartType.GAUGE,
        title: 'Progreso de Tier',
        description: 'Progreso hacia el siguiente nivel',
        data: {},
        options: {
          plugins: {
            gauge: {
              needle: { radiusPercentage: 2, widthPercentage: 3.2, lengthPercentage: 80 },
              valueLabel: { formatTextValue: (value: number) => `${value}%` }
            }
          }
        },
        period: ProgressPeriod.ALL_TIME,
        metricType: ProgressMetricType.TIER_PROGRESS,
        refreshInterval: 60,
        isRealTime: true
      },
      {
        id: 'venue_engagement',
        type: ProgressChartType.PIE,
        title: 'Engagement por Venue',
        description: 'Distribución de visitas por venue',
        data: {},
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'right' }
          }
        },
        period: ProgressPeriod.MONTHLY,
        metricType: ProgressMetricType.VISITS,
        refreshInterval: 600,
        isRealTime: false
      },
      {
        id: 'achievements_progress',
        type: ProgressChartType.PROGRESS_BAR,
        title: 'Progreso de Logros',
        description: 'Estado de completación de achievements',
        data: {},
        options: {
          indexAxis: 'y',
          scales: {
            x: { beginAtZero: true, max: 100 }
          }
        },
        period: ProgressPeriod.ALL_TIME,
        metricType: ProgressMetricType.ACHIEVEMENTS,
        refreshInterval: 120,
        isRealTime: true
      },
      {
        id: 'activity_heatmap',
        type: ProgressChartType.HEATMAP,
        title: 'Mapa de Calor de Actividad',
        description: 'Actividad por día y hora de la semana',
        data: {},
        options: {
          plugins: {
            tooltip: {
              callbacks: {
                label: (context: any) => `Actividad: ${context.parsed.v}`
              }
            }
          }
        },
        period: ProgressPeriod.MONTHLY,
        metricType: ProgressMetricType.VISITS,
        refreshInterval: 3600,
        isRealTime: false
      }
    ];

    visualizations.forEach(viz => {
      this.visualizations.set(viz.id, viz);
    });
  }

  // Get comprehensive user progress summary
  async getUserProgressSummary(userId: string): Promise<UserProgressSummary> {
    try {
      const mockUser = {
        userId,
        displayName: `Usuario ${userId.slice(-4)}`,
        profilePicture: `https://api.dicebear.com/7.x/avatars/svg?seed=${userId}`
      };

      const tierProgress = await this.getTierProgressStatus(userId);
      const pointsAnalytics = await this.getPointsAnalytics(userId);
      const achievementProgress = await this.getAchievementProgressSummary(userId);
      const venueEngagement = await this.getVenueEngagement(userId);
      const streakAnalytics = await this.getStreakAnalytics(userId);
      const socialMetrics = await this.getSocialMetrics(userId);
      const insights = await this.generateProgressInsights(userId);

      const summary: UserProgressSummary = {
        userId,
        displayName: mockUser.displayName,
        profilePicture: mockUser.profilePicture,
        overallScore: this.calculateOverallScore(
          tierProgress,
          pointsAnalytics,
          achievementProgress,
          venueEngagement,
          socialMetrics
        ),
        tierProgress,
        pointsAnalytics,
        achievementProgress,
        venueEngagement,
        streakAnalytics,
        socialMetrics,
        insights,
        lastUpdated: new Date()
      };

      return summary;
    } catch (error) {
      console.error('Error generating user progress summary:', error);
      throw error;
    }
  }

  // Get tier progress status
  async getTierProgressStatus(userId: string): Promise<TierProgressStatus> {
    // Mock implementation - would integrate with actual user tier data
    const currentPoints = Math.floor(Math.random() * 15000);
    const currentTier = this.calculateTierFromPoints(currentPoints);
    const pointsToNextTier = this.calculatePointsToNextTier(currentPoints);
    const progressPercentage = this.calculateTierProgressPercentage(currentPoints);
    const nextTier = this.getNextTier(currentTier);

    return {
      currentTier,
      currentPoints,
      pointsToNextTier,
      progressPercentage,
      nextTier,
      tierBenefits: this.getTierBenefits(currentTier),
      estimatedTimeToNextTier: this.estimateTimeToNextTier(currentPoints, userId)
    };
  }

  // Get points analytics
  async getPointsAnalytics(userId: string): Promise<any> {
    const totalPoints = Math.floor(Math.random() * 10000) + 1000;
    const pointsThisWeek = Math.floor(Math.random() * 500) + 50;
    const pointsThisMonth = Math.floor(Math.random() * 2000) + 200;
    const averagePointsPerVisit = Math.floor(Math.random() * 100) + 25;

    const pointsTrend = await this.generatePointsTrend(userId, ProgressPeriod.MONTHLY);

    return {
      totalPoints,
      pointsThisWeek,
      pointsThisMonth,
      averagePointsPerVisit,
      pointsTrend
    };
  }

  // Get achievement progress summary
  async getAchievementProgressSummary(userId: string): Promise<any> {
    const userAchievements = Array.from(this.achievements.values()).map(achievement => {
      const userProgress = {
        ...achievement,
        currentProgress: Math.floor(Math.random() * achievement.totalRequired),
        progressPercentage: 0,
        isCompleted: false
      };
      
      userProgress.progressPercentage = Math.round(
        (userProgress.currentProgress / userProgress.totalRequired) * 100
      );
      userProgress.isCompleted = userProgress.currentProgress >= userProgress.totalRequired;

      if (userProgress.isCompleted && !userProgress.completedAt) {
        userProgress.completedAt = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
      }

      return userProgress;
    });

    const completedAchievements = userAchievements.filter(a => a.isCompleted);
    const inProgressAchievements = userAchievements.filter(a => !a.isCompleted && a.currentProgress > 0);
    const recentAchievements = completedAchievements
      .sort((a, b) => (b.completedAt?.getTime() || 0) - (a.completedAt?.getTime() || 0))
      .slice(0, 5);
    const rareAchievements = completedAchievements.filter(a => ['rare', 'epic', 'legendary'].includes(a.rarity));

    return {
      totalAchievements: userAchievements.length,
      completedAchievements: completedAchievements.length,
      inProgressAchievements,
      recentAchievements,
      rareAchievements
    };
  }

  // Get venue engagement data
  async getVenueEngagement(userId: string): Promise<VenueEngagement[]> {
    const venues = [
      { id: 'venue_1', name: 'Mandala Beach Club' },
      { id: 'venue_2', name: 'Mandala Rooftop' },
      { id: 'venue_3', name: 'Mandala VIP Lounge' }
    ];

    return venues.map(venue => ({
      venueId: venue.id,
      venueName: venue.name,
      totalVisits: Math.floor(Math.random() * 20) + 1,
      totalDuration: Math.floor(Math.random() * 1200) + 300, // 5-25 hours total
      averageVisitDuration: Math.floor(Math.random() * 180) + 60, // 1-4 hours average
      totalSpending: Math.floor(Math.random() * 5000) + 500,
      pointsEarned: Math.floor(Math.random() * 1000) + 100,
      stampsCollected: Math.floor(Math.random() * 15) + 1,
      rewardsEarned: Math.floor(Math.random() * 5) + 1,
      lastVisit: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      favoriteTimeSlot: ['18:00-21:00', '21:00-00:00', '00:00-03:00'][Math.floor(Math.random() * 3)],
      favoriteDay: ['friday', 'saturday', 'sunday'][Math.floor(Math.random() * 3)],
      engagementScore: Math.floor(Math.random() * 40) + 60 // 60-100
    }));
  }

  // Get streak analytics
  async getStreakAnalytics(userId: string): Promise<StreakAnalytics[]> {
    return [
      {
        currentStreak: Math.floor(Math.random() * 10) + 1,
        longestStreak: Math.floor(Math.random() * 20) + 5,
        streakType: 'daily_visit',
        lastActivity: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000),
        streakStartDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
        averageStreakLength: Math.floor(Math.random() * 7) + 3,
        totalStreaks: Math.floor(Math.random() * 15) + 5,
        streakMultiplier: 1 + (Math.floor(Math.random() * 5) * 0.1)
      },
      {
        currentStreak: Math.floor(Math.random() * 5) + 1,
        longestStreak: Math.floor(Math.random() * 12) + 3,
        streakType: 'passport_stamps',
        lastActivity: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000),
        streakStartDate: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        averageStreakLength: Math.floor(Math.random() * 4) + 2,
        totalStreaks: Math.floor(Math.random() * 8) + 3,
        streakMultiplier: 1 + (Math.floor(Math.random() * 3) * 0.1)
      }
    ];
  }

  // Get social metrics
  async getSocialMetrics(userId: string): Promise<SocialMetrics> {
    return {
      referralsCount: Math.floor(Math.random() * 10),
      referralPointsEarned: Math.floor(Math.random() * 500),
      friendsInvited: Math.floor(Math.random() * 15),
      socialInteractions: Math.floor(Math.random() * 50),
      leaderboardRank: Math.floor(Math.random() * 100) + 1,
      leaderboardParticipation: Math.random() * 0.8 + 0.2, // 20-100%
      communityEngagement: Math.floor(Math.random() * 40) + 40, // 40-80
      sharesCount: Math.floor(Math.random() * 20)
    };
  }

  // Generate progress insights
  async generateProgressInsights(userId: string): Promise<ProgressInsight[]> {
    const insights: ProgressInsight[] = [
      {
        type: 'recommendation',
        title: '¡Casi alcanzas el siguiente tier!',
        description: 'Te faltan solo 150 puntos para llegar a Gold. Visita este fin de semana para conseguirlos.',
        actionable: true,
        actionText: 'Ver promociones activas',
        actionUrl: '/promotions',
        priority: 'high',
        category: 'tier_progress',
        generatedAt: new Date()
      },
      {
        type: 'achievement',
        title: 'Nuevo logro disponible',
        description: 'Estás a 2 visitas de desbloquear "Visitante Regular". ¡Continúa así!',
        actionable: true,
        actionText: 'Ver progreso',
        actionUrl: '/achievements',
        priority: 'medium',
        category: 'achievements',
        generatedAt: new Date()
      },
      {
        type: 'celebration',
        title: '¡Racha impresionante!',
        description: 'Llevas 5 días consecutivos visitando Mandala. ¡Increíble compromiso!',
        actionable: false,
        priority: 'medium',
        category: 'streaks',
        generatedAt: new Date()
      }
    ];

    return insights;
  }

  // Generate points trend
  async generatePointsTrend(userId: string, period: ProgressPeriod): Promise<ProgressTrend> {
    const days = period === ProgressPeriod.WEEKLY ? 7 : 30;
    const data: ProgressDataPoint[] = [];

    for (let i = days; i >= 0; i--) {
      const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
      const value = Math.floor(Math.random() * 200) + 50;
      
      data.push({
        timestamp: date,
        value,
        label: date.toLocaleDateString('es-MX', { weekday: 'short' })
      });
    }

    const totalValue = data.reduce((sum, point) => sum + point.value, 0);
    const averageValue = totalValue / data.length;
    const peakPoint = data.reduce((max, point) => point.value > max.value ? point : max);
    
    // Calculate trend
    const firstHalf = data.slice(0, Math.floor(data.length / 2));
    const secondHalf = data.slice(Math.floor(data.length / 2));
    const firstAvg = firstHalf.reduce((sum, p) => sum + p.value, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, p) => sum + p.value, 0) / secondHalf.length;
    
    const changePercentage = ((secondAvg - firstAvg) / firstAvg) * 100;
    const trend = changePercentage > 5 ? 'increasing' : changePercentage < -5 ? 'decreasing' : 'stable';

    return {
      period,
      data,
      trend,
      changePercentage,
      totalValue,
      averageValue,
      peakValue: peakPoint.value,
      peakDate: peakPoint.timestamp
    };
  }

  // Create progress dashboard
  async createProgressDashboard(userId: string, dashboardType: 'user' | 'admin' | 'venue_manager'): Promise<ProgressDashboard> {
    const baseWidgets = [
      {
        id: 'tier_progress_widget',
        type: 'chart' as const,
        visualization: this.visualizations.get('tier_progress')!,
        position: { x: 0, y: 0, w: 6, h: 4 },
        isVisible: true,
        refreshRate: 60
      },
      {
        id: 'points_trend_widget',
        type: 'chart' as const,
        visualization: this.visualizations.get('points_trend')!,
        position: { x: 6, y: 0, w: 6, h: 4 },
        isVisible: true,
        refreshRate: 300
      },
      {
        id: 'achievements_widget',
        type: 'achievement' as const,
        visualization: this.visualizations.get('achievements_progress')!,
        position: { x: 0, y: 4, w: 12, h: 3 },
        isVisible: true,
        refreshRate: 120
      }
    ];

    if (dashboardType === 'user') {
      baseWidgets.push({
        id: 'venue_engagement_widget',
        type: 'chart' as const,
        visualization: this.visualizations.get('venue_engagement')!,
        position: { x: 0, y: 7, w: 6, h: 4 },
        isVisible: true,
        refreshRate: 600
      });
    }

    return {
      userId,
      dashboardType,
      widgets: baseWidgets,
      customizations: {
        theme: 'mandala',
        accentColor: '#FF6B6B',
        showAnimations: true,
        compactMode: false
      },
      lastUpdated: new Date()
    };
  }

  // Get leaderboard
  async getLeaderboard(
    category: 'points' | 'visits' | 'spending' | 'achievements' | 'streaks',
    period: ProgressPeriod,
    limit: number = 10
  ): Promise<Leaderboard> {
    const entries: LeaderboardEntry[] = Array.from({ length: limit }, (_, i) => ({
      rank: i + 1,
      userId: `user_${i + 1}`,
      displayName: `Usuario ${i + 1}`,
      profilePicture: `https://api.dicebear.com/7.x/avatars/svg?seed=user${i + 1}`,
      score: Math.floor(Math.random() * 10000) + 1000 - (i * 100),
      tier: ['bronze', 'silver', 'gold', 'black'][Math.floor(Math.random() * 4)],
      change: Math.floor(Math.random() * 10) - 5,
      badges: [`badge_${Math.floor(Math.random() * 5) + 1}`],
      isCurrentUser: i === 3 // Mock current user at 4th position
    }));

    // Sort by score descending
    entries.sort((a, b) => b.score - a.score);
    entries.forEach((entry, index) => {
      entry.rank = index + 1;
    });

    return {
      id: `leaderboard_${category}_${period}`,
      name: `Top ${category.charAt(0).toUpperCase() + category.slice(1)}`,
      description: `Ranking de usuarios por ${category} en período ${period}`,
      category,
      period,
      entries,
      totalParticipants: Math.floor(Math.random() * 500) + 100,
      userRank: 4,
      lastUpdated: new Date(),
      prizes: [
        { rank: 1, description: '$500 MXN crédito', value: 500, currency: 'MXN' },
        { rank: 2, description: '$300 MXN crédito', value: 300, currency: 'MXN' },
        { rank: 3, description: '$200 MXN crédito', value: 200, currency: 'MXN' }
      ]
    };
  }

  // Helper methods
  private calculateOverallScore(
    tierProgress: TierProgressStatus,
    pointsAnalytics: any,
    achievementProgress: any,
    venueEngagement: VenueEngagement[],
    socialMetrics: SocialMetrics
  ): number {
    const tierScore = this.getTierScore(tierProgress.currentTier) * 0.3;
    const pointsScore = Math.min(pointsAnalytics.totalPoints / 100, 100) * 0.25;
    const achievementScore = (achievementProgress.completedAchievements / achievementProgress.totalAchievements) * 100 * 0.2;
    const engagementScore = venueEngagement.reduce((sum, venue) => sum + venue.engagementScore, 0) / venueEngagement.length * 0.15;
    const socialScore = socialMetrics.communityEngagement * 0.1;

    return Math.round(tierScore + pointsScore + achievementScore + engagementScore + socialScore);
  }

  private calculateTierFromPoints(points: number): string {
    if (points >= 20000) return 'black';
    if (points >= 5000) return 'gold';
    if (points >= 1000) return 'silver';
    return 'bronze';
  }

  private calculatePointsToNextTier(points: number): number {
    if (points >= 20000) return 0;
    if (points >= 5000) return 20000 - points;
    if (points >= 1000) return 5000 - points;
    return 1000 - points;
  }

  private calculateTierProgressPercentage(points: number): number {
    const tier = this.calculateTierFromPoints(points);
    
    switch (tier) {
      case 'bronze':
        return Math.round((points / 1000) * 100);
      case 'silver':
        return Math.round(((points - 1000) / 4000) * 100);
      case 'gold':
        return Math.round(((points - 5000) / 15000) * 100);
      case 'black':
        return 100;
      default:
        return 0;
    }
  }

  private getNextTier(currentTier: string): string | null {
    switch (currentTier) {
      case 'bronze': return 'silver';
      case 'silver': return 'gold';
      case 'gold': return 'black';
      default: return null;
    }
  }

  private getTierBenefits(tier: string): Array<{ type: string; description: string; unlocked: boolean }> {
    const allBenefits = {
      bronze: [
        { type: 'discount', description: '5% descuento en bebidas', unlocked: true },
        { type: 'points', description: 'Puntos x1 por visita', unlocked: true }
      ],
      silver: [
        { type: 'discount', description: '10% descuento en bebidas', unlocked: true },
        { type: 'points', description: 'Puntos x1.2 por visita', unlocked: true },
        { type: 'priority', description: 'Acceso prioritario eventos', unlocked: true }
      ],
      gold: [
        { type: 'discount', description: '15% descuento en bebidas', unlocked: true },
        { type: 'points', description: 'Puntos x1.5 por visita', unlocked: true },
        { type: 'vip', description: 'Acceso a áreas VIP', unlocked: true },
        { type: 'concierge', description: 'Servicio de concierge', unlocked: true }
      ],
      black: [
        { type: 'discount', description: '20% descuento en todo', unlocked: true },
        { type: 'points', description: 'Puntos x2 por visita', unlocked: true },
        { type: 'vip', description: 'Acceso VIP ilimitado', unlocked: true },
        { type: 'exclusive', description: 'Eventos exclusivos', unlocked: true },
        { type: 'personal', description: 'Manager personal', unlocked: true }
      ]
    };

    return allBenefits[tier as keyof typeof allBenefits] || [];
  }

  private getTierScore(tier: string): number {
    switch (tier) {
      case 'bronze': return 25;
      case 'silver': return 50;
      case 'gold': return 75;
      case 'black': return 100;
      default: return 0;
    }
  }

  private estimateTimeToNextTier(currentPoints: number, userId: string): string {
    const pointsToNext = this.calculatePointsToNextTier(currentPoints);
    if (pointsToNext === 0) return 'Tier máximo alcanzado';

    // Mock calculation based on average points per week
    const averagePointsPerWeek = Math.floor(Math.random() * 200) + 100;
    const weeksToNext = Math.ceil(pointsToNext / averagePointsPerWeek);

    if (weeksToNext === 1) return '1 semana';
    if (weeksToNext < 4) return `${weeksToNext} semanas`;
    if (weeksToNext < 52) return `${Math.ceil(weeksToNext / 4)} meses`;
    return `${Math.ceil(weeksToNext / 52)} años`;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    return this.achievements.size > 0 && this.visualizations.size > 0;
  }
} 