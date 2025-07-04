import {
  TierLevel,
  TierConfiguration,
  TierBenefit,
  UserTier,
  TierHistory,
  PointsTransaction,
  PointsActionType,
  PointsCalculationRule,
  PointsSummary,
  TierProgressSummary,
  GamificationSettings,
  LeaderboardData,
  LeaderboardEntry,
  TierUpgradeNotification,
  PointsAwardNotification
} from '@mandala/shared-types';

export class GamificationService {
  private readonly tierConfigurations: TierConfiguration[];
  private readonly pointsRules: PointsCalculationRule[];
  private readonly settings: GamificationSettings;

  constructor() {
    this.tierConfigurations = this.initializeTierConfigurations();
    this.pointsRules = this.initializePointsRules();
    this.settings = this.initializeSettings();
  }

  // Initialize tier configurations
  private initializeTierConfigurations(): TierConfiguration[] {
    return [
      {
        level: TierLevel.BRONZE,
        name: 'Bronce',
        description: 'Nivel inicial para nuevos usuarios',
        minPoints: 0,
        maxPoints: 999,
        color: '#CD7F32',
        icon: '🥉',
        multiplier: 1.0,
        benefits: [
          {
            type: 'discount',
            value: 5,
            description: '5% de descuento en bebidas seleccionadas'
          },
          {
            type: 'cashback',
            value: 2,
            description: '2% de cashback en compras'
          }
        ]
      },
      {
        level: TierLevel.SILVER,
        name: 'Plata',
        description: 'Para usuarios regulares con actividad consistente',
        minPoints: 1000,
        maxPoints: 4999,
        color: '#C0C0C0',
        icon: '🥈',
        multiplier: 1.2,
        benefits: [
          {
            type: 'discount',
            value: 10,
            description: '10% de descuento en bebidas seleccionadas'
          },
          {
            type: 'cashback',
            value: 3,
            description: '3% de cashback en compras'
          },
          {
            type: 'priority_access',
            value: 1,
            description: 'Acceso prioritario en eventos especiales'
          }
        ]
      },
      {
        level: TierLevel.GOLD,
        name: 'Oro',
        description: 'Para usuarios VIP con alta actividad',
        minPoints: 5000,
        maxPoints: 19999,
        color: '#FFD700',
        icon: '🥇',
        multiplier: 1.5,
        benefits: [
          {
            type: 'discount',
            value: 15,
            description: '15% de descuento en bebidas seleccionadas'
          },
          {
            type: 'cashback',
            value: 5,
            description: '5% de cashback en compras'
          },
          {
            type: 'priority_access',
            value: 1,
            description: 'Acceso prioritario y reservas VIP'
          },
          {
            type: 'free_items',
            value: 1,
            description: 'Copa de bienvenida gratuita'
          }
        ]
      },
      {
        level: TierLevel.BLACK,
        name: 'Black',
        description: 'Nivel exclusivo para usuarios elite',
        minPoints: 20000,
        maxPoints: null,
        color: '#000000',
        icon: '💎',
        multiplier: 2.0,
        benefits: [
          {
            type: 'discount',
            value: 20,
            description: '20% de descuento en toda la barra'
          },
          {
            type: 'cashback',
            value: 8,
            description: '8% de cashback en compras'
          },
          {
            type: 'priority_access',
            value: 1,
            description: 'Acceso VIP completo y mesas reservadas'
          },
          {
            type: 'free_items',
            value: 2,
            description: 'Copa de bienvenida y botana gratuita'
          },
          {
            type: 'exclusive_events',
            value: 1,
            description: 'Invitaciones exclusivas a eventos privados'
          }
        ]
      }
    ];
  }

  // Initialize points calculation rules
  private initializePointsRules(): PointsCalculationRule[] {
    return [
      {
        actionType: PointsActionType.VENUE_VISIT,
        basePoints: 10,
        tierMultiplier: true,
        conditions: {
          dailyLimit: 50,
          cooldownHours: 2
        }
      },
      {
        actionType: PointsActionType.FIRST_VISIT,
        basePoints: 50,
        tierMultiplier: true,
        bonusConditions: {
          firstTime: 100
        }
      },
      {
        actionType: PointsActionType.PAYMENT,
        basePoints: 1, // 1 point per 10 MXN spent
        tierMultiplier: true,
        conditions: {
          minAmount: 10,
          dailyLimit: 500
        }
      },
      {
        actionType: PointsActionType.EXTENDED_VISIT,
        basePoints: 25,
        tierMultiplier: true,
        conditions: {
          minDuration: 1800, // 30 minutes
          dailyLimit: 100
        },
        bonusConditions: {
          volume: [
            { threshold: 3600, bonus: 15 }, // 1 hour
            { threshold: 7200, bonus: 30 }  // 2 hours
          ]
        }
      },
      {
        actionType: PointsActionType.MULTIPLE_VENUES,
        basePoints: 75,
        tierMultiplier: true,
        conditions: {
          dailyLimit: 150
        }
      },
      {
        actionType: PointsActionType.FRIEND_REFERRAL,
        basePoints: 200,
        tierMultiplier: false,
        conditions: {
          dailyLimit: 1000
        }
      },
      {
        actionType: PointsActionType.BIRTHDAY_BONUS,
        basePoints: 500,
        tierMultiplier: false,
        conditions: {
          dailyLimit: 500
        }
      },
      {
        actionType: PointsActionType.SPECIAL_EVENT,
        basePoints: 100,
        tierMultiplier: true,
        conditions: {
          dailyLimit: 300
        }
      }
    ];
  }

  // Initialize gamification settings
  private initializeSettings(): GamificationSettings {
    return {
      isEnabled: true,
      pointsExpirationMonths: 12,
      tierDowngradeEnabled: false,
      tierDowngradeMonths: 6,
      dailyPointsLimit: 1000,
      referralBonusPoints: 200,
      birthdayBonusPoints: 500
    };
  }

  // Get tier configuration by level
  getTierConfiguration(level: TierLevel): TierConfiguration {
    const config = this.tierConfigurations.find(tier => tier.level === level);
    if (!config) {
      throw new Error(`Tier configuration not found for level: ${level}`);
    }
    return config;
  }

  // Get all tier configurations
  getAllTierConfigurations(): TierConfiguration[] {
    return this.tierConfigurations;
  }

  // Calculate points for an action
  calculatePoints(
    actionType: PointsActionType,
    userTier: TierLevel,
    metadata?: Record<string, any>
  ): number {
    const rule = this.pointsRules.find(r => r.actionType === actionType);
    if (!rule) {
      console.warn(`No points rule found for action: ${actionType}`);
      return 0;
    }

    let points = rule.basePoints;

    // Apply tier multiplier
    if (rule.tierMultiplier) {
      const tierConfig = this.getTierConfiguration(userTier);
      points *= tierConfig.multiplier;
    }

    // Apply special calculations based on action type
    switch (actionType) {
      case PointsActionType.PAYMENT:
        // 1 point per 10 MXN spent
        const amount = metadata?.amount || 0;
        points = Math.floor(amount / 10) * points;
        break;

      case PointsActionType.EXTENDED_VISIT:
        // Bonus points for longer visits
        const duration = metadata?.visitDuration || 0;
        if (rule.bonusConditions?.volume) {
          for (const bonus of rule.bonusConditions.volume) {
            if (duration >= bonus.threshold) {
              points += bonus.bonus;
            }
          }
        }
        break;

      case PointsActionType.FIRST_VISIT:
        // First time bonus
        if (metadata?.isFirstTime && rule.bonusConditions?.firstTime) {
          points += rule.bonusConditions.firstTime;
        }
        break;
    }

    return Math.floor(points);
  }

  // Calculate tier from points
  calculateTierFromPoints(points: number): TierLevel {
    // Sort tiers by min points descending to find the highest applicable tier
    const sortedTiers = [...this.tierConfigurations]
      .sort((a, b) => b.minPoints - a.minPoints);

    for (const tier of sortedTiers) {
      if (points >= tier.minPoints) {
        return tier.level;
      }
    }

    return TierLevel.BRONZE; // Default to bronze
  }

  // Calculate points needed for next tier
  calculatePointsToNextTier(currentPoints: number): { nextTier: TierLevel | null; pointsNeeded: number } {
    const currentTier = this.calculateTierFromPoints(currentPoints);
    const currentConfig = this.getTierConfiguration(currentTier);

    // Find next tier
    const nextTierConfig = this.tierConfigurations.find(
      tier => tier.minPoints > currentConfig.minPoints
    );

    if (!nextTierConfig) {
      return { nextTier: null, pointsNeeded: 0 };
    }

    const pointsNeeded = nextTierConfig.minPoints - currentPoints;
    return {
      nextTier: nextTierConfig.level,
      pointsNeeded: Math.max(0, pointsNeeded)
    };
  }

  // Create user tier
  async createUserTier(userId: string): Promise<UserTier> {
    const userTier: UserTier = {
      id: `tier_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId,
      currentTier: TierLevel.BRONZE,
      points: 0,
      pointsToNextTier: 1000,
      tierBenefits: this.getTierConfiguration(TierLevel.BRONZE).benefits,
      lastUpdated: new Date(),
      createdAt: new Date(),
      history: []
    };

    console.log(`Created user tier for user ${userId}:`, userTier.currentTier);
    return userTier;
  }

  // Award points to user
  async awardPoints(
    userId: string,
    actionType: PointsActionType,
    metadata?: Record<string, any>
  ): Promise<{
    pointsTransaction: PointsTransaction;
    tierUpgrade?: TierUpgradeNotification;
    notification: PointsAwardNotification;
  }> {
    // Get current user tier (mock)
    const currentUserTier = await this.getUserTier(userId);
    
    // Calculate points
    const pointsAwarded = this.calculatePoints(actionType, currentUserTier.currentTier, metadata);
    
    if (pointsAwarded <= 0) {
      throw new Error('No points to award for this action');
    }

    // Create points transaction
    const pointsTransaction: PointsTransaction = {
      id: `points_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId,
      actionType,
      points: pointsAwarded,
      description: this.getActionDescription(actionType, metadata),
      metadata,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + this.settings.pointsExpirationMonths * 30 * 24 * 60 * 60 * 1000)
    };

    // Update user tier
    const newTotalPoints = currentUserTier.points + pointsAwarded;
    const newTierLevel = this.calculateTierFromPoints(newTotalPoints);
    const { nextTier, pointsNeeded } = this.calculatePointsToNextTier(newTotalPoints);

    // Check for tier upgrade
    let tierUpgrade: TierUpgradeNotification | undefined;
    if (newTierLevel !== currentUserTier.currentTier) {
      const newTierConfig = this.getTierConfiguration(newTierLevel);
      tierUpgrade = {
        userId,
        previousTier: currentUserTier.currentTier,
        newTier: newTierLevel,
        pointsEarned: pointsAwarded,
        newBenefits: newTierConfig.benefits,
        congratulationMessage: `¡Felicidades! Has ascendido al nivel ${newTierConfig.name}. Ahora tienes ${newTierConfig.benefits.length} beneficios exclusivos.`
      };
    }

    // Create notification
    const notification: PointsAwardNotification = {
      userId,
      actionType,
      pointsAwarded,
      description: pointsTransaction.description,
      totalPoints: newTotalPoints,
      tierProgress: {
        currentTier: newTierLevel,
        pointsToNextTier: pointsNeeded
      }
    };

    console.log(`Awarded ${pointsAwarded} points to user ${userId} for ${actionType}`);
    
    return {
      pointsTransaction,
      tierUpgrade,
      notification
    };
  }

  // Get user tier (mock implementation)
  async getUserTier(userId: string): Promise<UserTier> {
    // Mock implementation - would query database
    const mockPoints = Math.floor(Math.random() * 15000);
    const currentTier = this.calculateTierFromPoints(mockPoints);
    const { nextTier, pointsNeeded } = this.calculatePointsToNextTier(mockPoints);

    return {
      id: `tier_${userId}`,
      userId,
      currentTier,
      points: mockPoints,
      pointsToNextTier: pointsNeeded,
      tierBenefits: this.getTierConfiguration(currentTier).benefits,
      lastUpdated: new Date(),
      createdAt: new Date(),
      history: []
    };
  }

  // Get tier progress summary
  async getTierProgressSummary(userId: string): Promise<TierProgressSummary> {
    const userTier = await this.getUserTier(userId);
    const { nextTier, pointsNeeded } = this.calculatePointsToNextTier(userTier.points);
    
    const currentTierConfig = this.getTierConfiguration(userTier.currentTier);
    const progressPercentage = nextTier 
      ? ((userTier.points - currentTierConfig.minPoints) / (this.getTierConfiguration(nextTier).minPoints - currentTierConfig.minPoints)) * 100
      : 100;

    return {
      currentTier: userTier.currentTier,
      currentPoints: userTier.points,
      nextTier,
      pointsToNextTier: pointsNeeded,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      estimatedUpgradeDate: nextTier ? this.estimateUpgradeDate(pointsNeeded) : null,
      monthlyActivity: {
        pointsEarned: Math.floor(Math.random() * 500) + 100,
        venuesVisited: Math.floor(Math.random() * 5) + 1,
        averageVisitDuration: Math.floor(Math.random() * 7200) + 1800
      }
    };
  }

  // Get points summary
  async getPointsSummary(userId: string): Promise<PointsSummary> {
    const userTier = await this.getUserTier(userId);
    
    return {
      totalPoints: userTier.points,
      availablePoints: userTier.points,
      expiredPoints: Math.floor(Math.random() * 200),
      earnedThisMonth: Math.floor(Math.random() * 500) + 100,
      earnedThisWeek: Math.floor(Math.random() * 150) + 50,
      recentTransactions: [] // Would fetch from database
    };
  }

  // Get leaderboard
  async getLeaderboard(period: 'weekly' | 'monthly' | 'all_time', limit: number = 10): Promise<LeaderboardData> {
    // Mock implementation - would query database
    const mockEntries: LeaderboardEntry[] = Array.from({ length: limit }, (_, i) => ({
      userId: `user_${i + 1}`,
      displayName: `Usuario ${i + 1}`,
      tier: [TierLevel.BRONZE, TierLevel.SILVER, TierLevel.GOLD, TierLevel.BLACK][Math.floor(Math.random() * 4)],
      points: Math.floor(Math.random() * 20000) + 1000,
      rank: i + 1,
      monthlyPoints: Math.floor(Math.random() * 1000) + 100,
      venuesVisited: Math.floor(Math.random() * 5) + 1
    })).sort((a, b) => b.points - a.points);

    return {
      period,
      entries: mockEntries,
      userRank: Math.floor(Math.random() * 50) + 1,
      totalParticipants: Math.floor(Math.random() * 500) + 100,
      lastUpdated: new Date()
    };
  }

  // Helper methods
  private getActionDescription(actionType: PointsActionType, metadata?: Record<string, any>): string {
    switch (actionType) {
      case PointsActionType.VENUE_VISIT:
        return `Visita a ${metadata?.venueName || 'venue'}`;
      case PointsActionType.FIRST_VISIT:
        return `Primera visita a ${metadata?.venueName || 'venue'}`;
      case PointsActionType.PAYMENT:
        return `Compra por $${metadata?.amount || 0} MXN`;
      case PointsActionType.EXTENDED_VISIT:
        return `Visita extendida de ${Math.floor((metadata?.visitDuration || 0) / 60)} minutos`;
      case PointsActionType.MULTIPLE_VENUES:
        return `Visita a múltiples venues en un día`;
      case PointsActionType.FRIEND_REFERRAL:
        return `Referir a un amigo`;
      case PointsActionType.BIRTHDAY_BONUS:
        return `Bono de cumpleaños`;
      case PointsActionType.SPECIAL_EVENT:
        return `Participación en evento especial`;
      default:
        return `Acción de gamificación: ${actionType}`;
    }
  }

  private estimateUpgradeDate(pointsNeeded: number): Date {
    // Estimate based on average points per week (mock calculation)
    const averagePointsPerWeek = 200;
    const weeksToUpgrade = Math.ceil(pointsNeeded / averagePointsPerWeek);
    const estimatedDate = new Date();
    estimatedDate.setDate(estimatedDate.getDate() + (weeksToUpgrade * 7));
    return estimatedDate;
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    return this.settings.isEnabled && this.tierConfigurations.length > 0;
  }
} 