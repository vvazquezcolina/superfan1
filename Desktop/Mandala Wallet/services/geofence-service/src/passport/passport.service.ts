import {
  QRPassport,
  QRStamp,
  PassportTemplate,
  PassportType,
  PassportStatus,
  StampStatus,
  PassportReward,
  PassportRule,
  PassportCollection,
  PassportAchievement,
  StampValidationResult,
  PassportProgress,
  PassportNotification,
  LocationEvent,
  Venue,
  PointsActionType
} from '@mandala/shared-types';

export class PassportService {
  private readonly passportTemplates: PassportTemplate[];
  private readonly achievements: PassportAchievement[];

  constructor() {
    this.passportTemplates = this.initializePassportTemplates();
    this.achievements = this.initializeAchievements();
    console.log('Passport service initialized');
  }

  // Initialize passport templates
  private initializePassportTemplates(): PassportTemplate[] {
    return [
      {
        id: 'daily_explorer',
        type: PassportType.DAILY,
        name: 'Explorador Diario',
        description: 'Visita 2 venues diferentes en un día',
        requiredVenues: [], // Any 2 venues
        requiredStamps: 2,
        validityPeriod: 24, // 24 hours
        rewards: [
          {
            type: 'points',
            value: 100,
            description: '100 puntos bonus por completar el pasaporte diario'
          },
          {
            type: 'cashback',
            value: 50,
            description: '$50 MXN de cashback'
          }
        ],
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
        rules: [
          {
            type: 'same_day_visits',
            value: 2,
            description: 'Deben ser visitas el mismo día'
          },
          {
            type: 'minimum_visit_duration',
            value: 30,
            description: 'Mínimo 30 minutos por visita'
          }
        ]
      },
      {
        id: 'mandala_master',
        type: PassportType.VENUE_CHAIN,
        name: 'Maestro Mandala',
        description: 'Visita todos los venues de Mandala en Cancún',
        requiredVenues: ['venue_1', 'venue_2'], // All Mandala venues
        requiredStamps: 2,
        validityPeriod: 168, // 1 week
        rewards: [
          {
            type: 'points',
            value: 500,
            description: '500 puntos bonus por completar toda la cadena'
          },
          {
            type: 'tier_bonus',
            value: 1,
            description: 'Bono de nivel - puntos extra para próximo tier'
          },
          {
            type: 'free_item',
            value: 1,
            description: 'Copa premium gratuita en próxima visita'
          }
        ],
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        rules: [
          {
            type: 'minimum_visit_duration',
            value: 45,
            description: 'Mínimo 45 minutos por venue'
          }
        ]
      },
      {
        id: 'weekend_warrior',
        type: PassportType.WEEKLY,
        name: 'Guerrero del Fin de Semana',
        description: 'Visita venues viernes, sábado y domingo',
        requiredVenues: [],
        requiredStamps: 3,
        validityPeriod: 72, // Weekend (Friday-Sunday)
        rewards: [
          {
            type: 'discount',
            value: 20,
            description: '20% de descuento en próxima visita'
          },
          {
            type: 'points',
            value: 200,
            description: '200 puntos bonus de fin de semana'
          }
        ],
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        rules: [
          {
            type: 'specific_time_range',
            value: 'friday-sunday',
            description: 'Solo válido viernes a domingo'
          }
        ]
      },
      {
        id: 'special_event_collector',
        type: PassportType.SPECIAL_EVENT,
        name: 'Coleccionista de Eventos',
        description: 'Participa en eventos especiales durante el mes',
        requiredVenues: [],
        requiredStamps: 3,
        validityPeriod: 720, // 30 days
        rewards: [
          {
            type: 'points',
            value: 300,
            description: '300 puntos por eventos especiales'
          },
          {
            type: 'free_item',
            value: 2,
            description: 'Invitación VIP a próximo evento'
          }
        ],
        isActive: true,
        startDate: new Date(),
        endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        rules: [
          {
            type: 'minimum_spend',
            value: 500,
            description: 'Gasto mínimo de $500 MXN por evento'
          }
        ]
      }
    ];
  }

  // Initialize achievements
  private initializeAchievements(): PassportAchievement[] {
    return [
      {
        id: 'first_stamp',
        name: 'Primer Sello',
        description: 'Obtén tu primer sello en cualquier venue',
        icon: '🎯',
        unlockedAt: new Date(),
        requirements: {
          type: 'stamps_collected',
          threshold: 1
        },
        rewards: [
          {
            type: 'points',
            value: 25,
            description: '25 puntos de bienvenida'
          }
        ]
      },
      {
        id: 'stamp_collector',
        name: 'Coleccionista',
        description: 'Acumula 10 sellos en total',
        icon: '📚',
        unlockedAt: new Date(),
        requirements: {
          type: 'stamps_collected',
          threshold: 10
        },
        rewards: [
          {
            type: 'points',
            value: 100,
            description: '100 puntos bonus'
          }
        ]
      },
      {
        id: 'passport_master',
        name: 'Maestro de Pasaportes',
        description: 'Completa 5 pasaportes',
        icon: '🏆',
        unlockedAt: new Date(),
        requirements: {
          type: 'passports_completed',
          threshold: 5
        },
        rewards: [
          {
            type: 'cashback',
            value: 200,
            description: '$200 MXN de cashback especial'
          }
        ]
      },
      {
        id: 'streak_master',
        name: 'Rey de las Rachas',
        description: 'Mantén una racha de 7 días con sellos',
        icon: '🔥',
        unlockedAt: new Date(),
        requirements: {
          type: 'streak_days',
          threshold: 7
        },
        rewards: [
          {
            type: 'tier_bonus',
            value: 1,
            description: 'Multiplicador de puntos temporal'
          }
        ]
      },
      {
        id: 'venue_explorer',
        name: 'Explorador de Venues',
        description: 'Visita todos los venues disponibles',
        icon: '🗺️',
        unlockedAt: new Date(),
        requirements: {
          type: 'venues_visited',
          threshold: 2 // All available venues
        },
        rewards: [
          {
            type: 'free_item',
            value: 1,
            description: 'Experiencia VIP exclusiva'
          }
        ]
      }
    ];
  }

  // Create a new passport for user based on template
  async createPassport(userId: string, templateId: string): Promise<QRPassport> {
    const template = this.passportTemplates.find(t => t.id === templateId);
    if (!template) {
      throw new Error(`Passport template not found: ${templateId}`);
    }

    const passport: QRPassport = {
      id: `passport_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId,
      templateId: template.id,
      type: template.type,
      name: template.name,
      description: template.description,
      stamps: [],
      totalStamps: 0,
      requiredStamps: template.requiredStamps,
      progress: 0,
      status: PassportStatus.ACTIVE,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + template.validityPeriod * 60 * 60 * 1000),
      rewards: template.rewards,
      metadata: {
        specialRequirements: template.requiredVenues
      }
    };

    console.log(`Created passport ${passport.name} for user ${userId}`);
    return passport;
  }

  // Award stamp when user visits venue
  async awardStamp(
    userId: string,
    venueId: string,
    venueName: string,
    locationEvent: LocationEvent,
    metadata?: Record<string, any>
  ): Promise<StampValidationResult> {
    try {
      // Get user's active passports
      const activePassports = await this.getUserActivePassports(userId);
      
      if (activePassports.length === 0) {
        // Auto-create daily passport for new users
        const dailyPassport = await this.createPassport(userId, 'daily_explorer');
        activePassports.push(dailyPassport);
      }

      const updatedPassports: QRPassport[] = [];
      const newAchievements: PassportAchievement[] = [];
      const rewardsEarned: PassportReward[] = [];
      
      // Check if stamp should be awarded for each active passport
      for (const passport of activePassports) {
        const validationResult = await this.validateStampForPassport(
          passport,
          venueId,
          venueName,
          locationEvent,
          metadata
        );

        if (validationResult.isValid && validationResult.stamp) {
          // Add stamp to passport
          passport.stamps.push(validationResult.stamp);
          passport.totalStamps = passport.stamps.length;
          passport.progress = (passport.totalStamps / passport.requiredStamps) * 100;

          // Check if passport is completed
          if (passport.totalStamps >= passport.requiredStamps) {
            passport.status = PassportStatus.COMPLETED;
            passport.completedAt = new Date();
            rewardsEarned.push(...passport.rewards);
          }

          updatedPassports.push(passport);
        }
      }

      // Check for new achievements
      const collection = await this.getUserPassportCollection(userId);
      collection.totalStampsCollected += updatedPassports.length; // One stamp per updated passport
      
      const unlockedAchievements = await this.checkForNewAchievements(collection);
      newAchievements.push(...unlockedAchievements);

      const firstStamp = updatedPassports.length > 0 ? updatedPassports[0].stamps[updatedPassports[0].stamps.length - 1] : undefined;

      return {
        isValid: updatedPassports.length > 0,
        reason: updatedPassports.length > 0 ? 'Stamp awarded successfully' : 'No eligible passports found',
        stamp: firstStamp,
        passportUpdates: updatedPassports,
        newAchievements,
        rewardsEarned
      };
    } catch (error) {
      console.error('Error awarding stamp:', error);
      return {
        isValid: false,
        reason: (error as Error).message
      };
    }
  }

  // Validate if stamp can be awarded for specific passport
  private async validateStampForPassport(
    passport: QRPassport,
    venueId: string,
    venueName: string,
    locationEvent: LocationEvent,
    metadata?: Record<string, any>
  ): Promise<StampValidationResult> {
    // Check if passport is still active
    if (passport.status !== PassportStatus.ACTIVE) {
      return { isValid: false, reason: 'Passport is not active' };
    }

    // Check if passport has expired
    if (new Date() > passport.expiresAt) {
      return { isValid: false, reason: 'Passport has expired' };
    }

    // Check if already has stamp for this venue (for some passport types)
    if (passport.type === PassportType.VENUE_CHAIN) {
      const existingStamp = passport.stamps.find(s => s.venueId === venueId);
      if (existingStamp) {
        return { isValid: false, reason: 'Already has stamp for this venue' };
      }
    }

    // Check if venue is required for this passport
    if (passport.metadata?.specialRequirements?.length > 0) {
      const requiredVenues = passport.metadata.specialRequirements as string[];
      if (!requiredVenues.includes(venueId)) {
        return { isValid: false, reason: 'Venue not required for this passport' };
      }
    }

    // Apply passport rules validation
    const template = this.passportTemplates.find(t => t.id === passport.templateId);
    if (template) {
      for (const rule of template.rules) {
        const ruleValid = await this.validatePassportRule(rule, locationEvent, metadata);
        if (!ruleValid) {
          return { isValid: false, reason: `Rule validation failed: ${rule.description}` };
        }
      }
    }

    // Create the stamp
    const stamp: QRStamp = {
      id: `stamp_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      passportId: passport.id,
      venueId,
      venueName,
      visitId: locationEvent.id,
      stampedAt: new Date(),
      validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
      status: StampStatus.ACTIVE,
      metadata: {
        visitDuration: metadata?.visitDuration,
        transactionAmount: metadata?.transactionAmount,
        specialEvent: metadata?.specialEvent
      }
    };

    return {
      isValid: true,
      stamp
    };
  }

  // Validate passport rule
  private async validatePassportRule(
    rule: PassportRule,
    locationEvent: LocationEvent,
    metadata?: Record<string, any>
  ): Promise<boolean> {
    switch (rule.type) {
      case 'minimum_visit_duration':
        const duration = metadata?.visitDuration || 0;
        return duration >= (rule.value as number) * 60; // Convert minutes to seconds

      case 'minimum_spend':
        const amount = metadata?.transactionAmount || 0;
        return amount >= (rule.value as number);

      case 'specific_time_range':
        if (rule.value === 'friday-sunday') {
          const day = new Date().getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
          return day === 0 || day === 5 || day === 6;
        }
        return true;

      case 'same_day_visits':
        // This would need to check if other stamps were awarded on the same day
        return true; // Simplified for now

      case 'sequential_visits':
        // This would need to check visit order
        return true; // Simplified for now

      default:
        return true;
    }
  }

  // Get user's active passports (mock implementation)
  async getUserActivePassports(userId: string): Promise<QRPassport[]> {
    // Mock implementation - would query database
    return [];
  }

  // Get user's passport collection
  async getUserPassportCollection(userId: string): Promise<PassportCollection> {
    // Mock implementation - would query database
    return {
      userId,
      activePassports: [],
      completedPassports: [],
      totalStampsCollected: Math.floor(Math.random() * 20),
      totalPassportsCompleted: Math.floor(Math.random() * 5),
      currentStreak: Math.floor(Math.random() * 7),
      longestStreak: Math.floor(Math.random() * 14),
      achievements: [],
      lastUpdated: new Date()
    };
  }

  // Check for new achievements
  async checkForNewAchievements(collection: PassportCollection): Promise<PassportAchievement[]> {
    const newAchievements: PassportAchievement[] = [];
    
    for (const achievement of this.achievements) {
      // Check if user already has this achievement
      const hasAchievement = collection.achievements.some(a => a.id === achievement.id);
      if (hasAchievement) continue;

      // Check if requirements are met
      let requirementMet = false;
      switch (achievement.requirements.type) {
        case 'stamps_collected':
          requirementMet = collection.totalStampsCollected >= achievement.requirements.threshold;
          break;
        case 'passports_completed':
          requirementMet = collection.totalPassportsCompleted >= achievement.requirements.threshold;
          break;
        case 'streak_days':
          requirementMet = collection.currentStreak >= achievement.requirements.threshold;
          break;
        case 'venues_visited':
          // Would need to calculate unique venues visited
          requirementMet = false; // Simplified for now
          break;
      }

      if (requirementMet) {
        newAchievements.push({
          ...achievement,
          unlockedAt: new Date()
        });
      }
    }

    return newAchievements;
  }

  // Get passport progress for user
  async getPassportProgress(userId: string, passportId: string): Promise<PassportProgress> {
    // Mock implementation - would query database
    const passport = await this.getPassportById(passportId);
    const template = this.passportTemplates.find(t => t.id === passport.templateId);
    
    return {
      passport,
      recentStamps: passport.stamps.slice(-3),
      nextRequiredVenues: template?.requiredVenues || [],
      estimatedCompletion: passport.progress > 0 ? this.estimateCompletionDate(passport) : null,
      recommendations: await this.getVenueRecommendations(passport)
    };
  }

  // Get passport templates
  getPassportTemplates(): PassportTemplate[] {
    return this.passportTemplates.filter(t => t.isActive);
  }

  // Get achievements
  getAchievements(): PassportAchievement[] {
    return this.achievements;
  }

  // Helper methods
  private async getPassportById(passportId: string): Promise<QRPassport> {
    // Mock implementation
    return {
      id: passportId,
      userId: 'mock_user',
      templateId: 'daily_explorer',
      type: PassportType.DAILY,
      name: 'Explorador Diario',
      description: 'Mock passport',
      stamps: [],
      totalStamps: 0,
      requiredStamps: 2,
      progress: 0,
      status: PassportStatus.ACTIVE,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      rewards: []
    };
  }

  private estimateCompletionDate(passport: QRPassport): Date {
    const remainingStamps = passport.requiredStamps - passport.totalStamps;
    const averageTimePerStamp = 2; // hours
    const estimatedHours = remainingStamps * averageTimePerStamp;
    return new Date(Date.now() + estimatedHours * 60 * 60 * 1000);
  }

  private async getVenueRecommendations(passport: QRPassport): Promise<Array<{
    venueId: string;
    venueName: string;
    reason: string;
    urgency: 'low' | 'medium' | 'high';
  }>> {
    // Mock recommendations
    return [
      {
        venueId: 'venue_1',
        venueName: 'Mandala Beach Club',
        reason: 'Necesario para completar el pasaporte',
        urgency: 'high'
      }
    ];
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    return true;
  }
} 