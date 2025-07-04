import {
  RewardTriggerType,
  RewardType,
  RewardStatus,
  PromotionUrgency,
  RewardTriggerCondition,
  RewardDefinition,
  TriggeredReward,
  LocationPromotion,
  RewardTriggerEvent,
  ProximityPromotion,
  HappyHourPromotion,
  WeatherBasedPromotion,
  RewardDiscoveryResult,
  RewardNotification,
  LocationEvent,
  User,
  Venue,
  UserTier,
  TierLevel
} from '@mandala/shared-types';

export class RewardTriggerService {
  private readonly locationPromotions: LocationPromotion[];
  private readonly proximityPromotions: ProximityPromotion[];
  private readonly happyHourPromotions: HappyHourPromotion[];
  private readonly weatherPromotions: WeatherBasedPromotion[];

  constructor() {
    this.locationPromotions = this.initializeLocationPromotions();
    this.proximityPromotions = this.initializeProximityPromotions();
    this.happyHourPromotions = this.initializeHappyHourPromotions();
    this.weatherPromotions = this.initializeWeatherPromotions();
  }

  // Initialize location-based promotions
  private initializeLocationPromotions(): LocationPromotion[] {
    return [
      {
        id: 'welcome_first_timer',
        venueId: 'venue_1',
        name: 'Bienvenida Primera Vez',
        description: 'Descuento especial para nuevos visitantes',
        shortDescription: '20% de descuento para nuevos clientes',
        triggers: [
          {
            type: RewardTriggerType.FIRST_VISIT,
            parameters: { venueIds: ['venue_1'] },
            weight: 1.0
          }
        ],
        rewards: [
          {
            id: 'first_visit_discount',
            name: 'Descuento de Bienvenida',
            description: '20% de descuento en tu primera consumición',
            type: RewardType.INSTANT_DISCOUNT,
            value: 20,
            conditions: {
              minAmount: 100,
              maxAmount: 500,
              userRestrictions: {
                maxPerUser: 1,
                firstTimeOnly: true
              }
            },
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            redemptionInstructions: 'Muestra este código al mesero para aplicar el descuento',
            termsAndConditions: [
              'Válido solo para primera visita',
              'Mínimo de consumo $100 MXN',
              'No acumulable con otras promociones'
            ],
            isActive: true
          }
        ],
        priority: 10,
        urgency: PromotionUrgency.HIGH,
        targetAudience: {
          visitHistory: 'first_time'
        },
        displayRules: {
          maxDisplaysPerUser: 1,
          cooldownBetweenDisplays: 24,
          showOnEntry: true,
          showOnExit: false,
          showDuringVisit: false
        },
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        budget: {
          totalBudget: 10000,
          usedBudget: 1250,
          maxPerUser: 100
        },
        performance: {
          impressions: 150,
          triggers: 85,
          redemptions: 62,
          conversionRate: 0.73
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'extended_visit_bonus',
        venueId: 'venue_1',
        name: 'Bono por Visita Extendida',
        description: 'Recompensa por pasar más tiempo en el venue',
        shortDescription: 'Copa gratis por quedarte más de 2 horas',
        triggers: [
          {
            type: RewardTriggerType.EXTENDED_VISIT,
            parameters: { duration: 120, venueIds: ['venue_1'] },
            weight: 1.0
          }
        ],
        rewards: [
          {
            id: 'extended_visit_free_drink',
            name: 'Copa Gratis',
            description: 'Copa de cortesía por tu visita extendida',
            type: RewardType.FREE_ITEM,
            value: 150,
            conditions: {
              userRestrictions: {
                maxPerUser: 2,
                cooldownHours: 24
              }
            },
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            redemptionInstructions: 'Solicita tu copa gratuita en la barra',
            termsAndConditions: [
              'Válido para cocteles seleccionados',
              'Máximo 2 por día por usuario',
              'Requiere visita mínima de 2 horas'
            ],
            isActive: true
          }
        ],
        priority: 8,
        urgency: PromotionUrgency.MEDIUM,
        targetAudience: {},
        displayRules: {
          maxDisplaysPerUser: 5,
          cooldownBetweenDisplays: 24,
          showOnEntry: false,
          showOnExit: true,
          showDuringVisit: false
        },
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        performance: {
          impressions: 95,
          triggers: 42,
          redemptions: 38,
          conversionRate: 0.90
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'tier_exclusive_vip',
        venueId: 'venue_1',
        name: 'Acceso VIP Exclusivo',
        description: 'Beneficios especiales para usuarios Gold y Black',
        shortDescription: 'Acceso VIP disponible para tu tier',
        triggers: [
          {
            type: RewardTriggerType.LOCATION_ENTRY,
            parameters: { 
              venueIds: ['venue_1'],
              tierRequired: 'gold'
            },
            weight: 1.0
          }
        ],
        rewards: [
          {
            id: 'vip_access_upgrade',
            name: 'Upgrade VIP',
            description: 'Acceso a área VIP sin costo adicional',
            type: RewardType.VIP_ACCESS,
            value: 500,
            conditions: {
              tierRequired: 'gold',
              timeRestrictions: {
                startTime: '20:00',
                endTime: '02:00',
                days: ['friday', 'saturday']
              }
            },
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            redemptionInstructions: 'Solicita tu upgrade VIP en recepción',
            termsAndConditions: [
              'Solo para tiers Gold y Black',
              'Válido viernes y sábados después de 8 PM',
              'Sujeto a disponibilidad'
            ],
            isActive: true
          }
        ],
        priority: 15,
        urgency: PromotionUrgency.HIGH,
        targetAudience: {
          tierLevels: ['gold', 'black'],
          visitHistory: 'vip'
        },
        displayRules: {
          maxDisplaysPerUser: 3,
          cooldownBetweenDisplays: 168, // 1 week
          showOnEntry: true,
          showOnExit: false,
          showDuringVisit: false
        },
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        performance: {
          impressions: 45,
          triggers: 28,
          redemptions: 25,
          conversionRate: 0.89
        },
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'multi_venue_explorer',
        venueId: 'venue_2',
        name: 'Explorador Multi-Venue',
        description: 'Recompensa por visitar múltiples venues',
        shortDescription: 'Cashback por explorar todos nuestros venues',
        triggers: [
          {
            type: RewardTriggerType.MULTIPLE_VENUES,
            parameters: { 
              venueIds: ['venue_1', 'venue_2'],
              visitCount: 2
            },
            weight: 1.0
          }
        ],
        rewards: [
          {
            id: 'multi_venue_cashback',
            name: 'Cashback Explorador',
            description: '$100 MXN de cashback por visitar múltiples venues',
            type: RewardType.CASHBACK,
            value: 100,
            conditions: {
              userRestrictions: {
                maxPerUser: 1,
                cooldownHours: 168 // 1 week
              }
            },
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            redemptionInstructions: 'Cashback aplicado automáticamente a tu wallet',
            termsAndConditions: [
              'Requiere visita a al menos 2 venues diferentes',
              'Máximo una vez por semana',
              'Cashback aplicado en 24 horas'
            ],
            isActive: true
          }
        ],
        priority: 12,
        urgency: PromotionUrgency.MEDIUM,
        targetAudience: {
          visitHistory: 'returning'
        },
        displayRules: {
          maxDisplaysPerUser: 4,
          cooldownBetweenDisplays: 168,
          showOnEntry: true,
          showOnExit: false,
          showDuringVisit: false
        },
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        performance: {
          impressions: 65,
          triggers: 23,
          redemptions: 19,
          conversionRate: 0.83
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // Initialize proximity-based promotions
  private initializeProximityPromotions(): ProximityPromotion[] {
    return [
      {
        id: 'proximity_early_bird',
        venueId: 'venue_1',
        name: 'Early Bird Especial',
        description: 'Descuento por llegar temprano al área',
        triggerRadius: 200, // 200 meters
        reward: {
          id: 'early_bird_discount',
          name: 'Descuento Early Bird',
          description: '15% de descuento si llegas en los próximos 30 minutos',
          type: RewardType.INSTANT_DISCOUNT,
          value: 15,
          conditions: {
            timeRestrictions: {
              startTime: '18:00',
              endTime: '21:00',
              days: ['monday', 'tuesday', 'wednesday', 'thursday']
            }
          },
          validFrom: new Date(),
          validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
          redemptionInstructions: 'Llega al venue en 30 minutos para aplicar descuento',
          termsAndConditions: [
            'Válido solo lunes a jueves 6-9 PM',
            'Debe llegar dentro de 30 minutos',
            'No acumulable con otras ofertas'
          ],
          isActive: true
        },
        targetWindow: 30, // 30 minutes to reach venue
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        maxTriggers: 50,
        currentTriggers: 12
      }
    ];
  }

  // Initialize happy hour promotions
  private initializeHappyHourPromotions(): HappyHourPromotion[] {
    return [
      {
        id: 'happy_hour_mandala',
        venueId: 'venue_1',
        name: 'Happy Hour Mandala',
        description: 'Precios especiales en bebidas seleccionadas',
        timeSlots: [
          {
            startTime: '18:00',
            endTime: '20:00',
            days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
          }
        ],
        rewards: [
          {
            id: 'happy_hour_discount',
            name: 'Descuento Happy Hour',
            description: '30% de descuento en cocteles premium',
            type: RewardType.HAPPY_HOUR,
            value: 30,
            conditions: {
              timeRestrictions: {
                startTime: '18:00',
                endTime: '20:00',
                days: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday']
              }
            },
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            redemptionInstructions: 'Válido automáticamente durante Happy Hour',
            termsAndConditions: [
              'Solo en cocteles premium',
              'Lunes a viernes 6-8 PM',
              'No válido en días festivos'
            ],
            isActive: true
          }
        ],
        autoTriggerOnEntry: true,
        requiresPresence: true,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  // Initialize weather-based promotions
  private initializeWeatherPromotions(): WeatherBasedPromotion[] {
    return [
      {
        id: 'rainy_day_comfort',
        venueId: 'venue_1',
        name: 'Refugio de Lluvia',
        description: 'Descuento especial en días lluviosos',
        weatherTriggers: [
          {
            condition: 'rain',
            threshold: 5, // 5mm precipitation
            duration: 30 // 30 minutes of rain
          }
        ],
        rewards: [
          {
            id: 'rain_discount',
            name: 'Descuento Día Lluvioso',
            description: '25% de descuento en bebidas calientes',
            type: RewardType.INSTANT_DISCOUNT,
            value: 25,
            conditions: {},
            validFrom: new Date(),
            validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            redemptionInstructions: 'Automáticamente aplicado en días lluviosos',
            termsAndConditions: [
              'Solo en bebidas calientes',
              'Válido durante lluvia activa',
              'Máximo 3 bebidas por usuario'
            ],
            isActive: true
          }
        ],
        autoActivate: true,
        isActive: true,
        validFrom: new Date(),
        validUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }
    ];
  }

  // Main method to process location events and trigger rewards
  async processLocationEvent(
    locationEvent: LocationEvent,
    user: User,
    venue: Venue,
    userTier: UserTier,
    contextData: any
  ): Promise<RewardTriggerEvent> {
    const triggerEvent: RewardTriggerEvent = {
      id: `trigger_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: user.id,
      venueId: venue.id,
      triggerType: this.determineMainTriggerType(locationEvent, contextData),
      conditionsMet: [],
      triggeredPromotions: [],
      triggeredRewards: [],
      contextData: {
        userTier: userTier.currentTier,
        visitCount: contextData.visitCount || 0,
        lastVisit: contextData.lastVisit,
        currentSpending: contextData.currentSpending || 0,
        timeOfDay: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
        dayOfWeek: new Date().toLocaleDateString('es-MX', { weekday: 'long' }),
        weather: await this.getCurrentWeather(),
        specialEvents: await this.getActiveSpecialEvents(venue.id)
      },
      processedAt: new Date()
    };

    // Evaluate all location promotions
    for (const promotion of this.locationPromotions) {
      if (!promotion.isActive || promotion.venueId !== venue.id) continue;

      const evaluationResult = await this.evaluatePromotion(
        promotion,
        locationEvent,
        user,
        userTier,
        triggerEvent.contextData
      );

      if (evaluationResult.triggered) {
        triggerEvent.triggeredPromotions.push(promotion);
        triggerEvent.conditionsMet.push(...evaluationResult.conditionsMet);
        triggerEvent.triggeredRewards.push(...evaluationResult.rewards);
      }
    }

    // Evaluate happy hour promotions if during business hours
    if (this.isWithinBusinessHours()) {
      for (const happyHour of this.happyHourPromotions) {
        if (!happyHour.isActive || happyHour.venueId !== venue.id) continue;

        if (this.isHappyHourActive(happyHour)) {
          const reward = await this.triggerHappyHourReward(happyHour, user, venue);
          if (reward) {
            triggerEvent.triggeredRewards.push(reward);
          }
        }
      }
    }

    // Evaluate weather-based promotions
    const currentWeather = triggerEvent.contextData.weather;
    if (currentWeather) {
      for (const weatherPromo of this.weatherPromotions) {
        if (!weatherPromo.isActive || weatherPromo.venueId !== venue.id) continue;

        if (this.isWeatherConditionMet(weatherPromo, currentWeather)) {
          const reward = await this.triggerWeatherReward(weatherPromo, user, venue);
          if (reward) {
            triggerEvent.triggeredRewards.push(reward);
          }
        }
      }
    }

    console.log(`Processed location event: ${triggerEvent.triggeredPromotions.length} promotions, ${triggerEvent.triggeredRewards.length} rewards triggered`);
    
    return triggerEvent;
  }

  // Evaluate a specific promotion against current conditions
  private async evaluatePromotion(
    promotion: LocationPromotion,
    locationEvent: LocationEvent,
    user: User,
    userTier: UserTier,
    contextData: any
  ): Promise<{
    triggered: boolean;
    conditionsMet: RewardTriggerCondition[];
    rewards: TriggeredReward[];
  }> {
    const conditionsMet: RewardTriggerCondition[] = [];
    const rewards: TriggeredReward[] = [];

    // Check target audience
    if (!this.isTargetAudienceMatch(promotion.targetAudience, user, userTier, contextData)) {
      return { triggered: false, conditionsMet, rewards };
    }

    // Check display rules
    if (!await this.checkDisplayRules(promotion.displayRules, user.id, promotion.id)) {
      return { triggered: false, conditionsMet, rewards };
    }

    // Evaluate each trigger condition
    let totalWeight = 0;
    let metWeight = 0;

    for (const trigger of promotion.triggers) {
      totalWeight += trigger.weight;
      
      if (await this.evaluateTriggerCondition(trigger, locationEvent, user, userTier, contextData)) {
        conditionsMet.push(trigger);
        metWeight += trigger.weight;
      }
    }

    // Check if enough conditions are met (require at least 80% weight)
    const triggered = metWeight / totalWeight >= 0.8;

    if (triggered) {
      // Create triggered rewards
      for (const rewardDef of promotion.rewards) {
        const triggeredReward: TriggeredReward = {
          id: `reward_${Date.now()}_${Math.random().toString(36).substring(2)}`,
          userId: user.id,
          rewardDefinitionId: rewardDef.id,
          triggerType: this.determineMainTriggerType(locationEvent, contextData),
          triggerData: {
            venueId: locationEvent.venueId,
            locationEventId: locationEvent.id,
            metadata: {
              promotionId: promotion.id,
              triggerConditions: conditionsMet.map(c => c.type)
            }
          },
          reward: rewardDef,
          status: RewardStatus.TRIGGERED,
          triggeredAt: new Date(),
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours to redeem
          redemptionCode: this.generateRedemptionCode(),
          estimatedValue: rewardDef.value
        };

        rewards.push(triggeredReward);
      }
    }

    return { triggered, conditionsMet, rewards };
  }

  // Evaluate individual trigger condition
  private async evaluateTriggerCondition(
    condition: RewardTriggerCondition,
    locationEvent: LocationEvent,
    user: User,
    userTier: UserTier,
    contextData: any
  ): Promise<boolean> {
    switch (condition.type) {
      case RewardTriggerType.LOCATION_ENTRY:
        return locationEvent.type === 'enter' && 
               this.checkVenueMatch(condition.parameters.venueIds, locationEvent.venueId) &&
               this.checkTierRequirement(condition.parameters.tierRequired, userTier.currentTier);

      case RewardTriggerType.LOCATION_EXIT:
        return locationEvent.type === 'exit' &&
               this.checkVenueMatch(condition.parameters.venueIds, locationEvent.venueId);

      case RewardTriggerType.FIRST_VISIT:
        return contextData.visitCount === 1 &&
               this.checkVenueMatch(condition.parameters.venueIds, locationEvent.venueId);

      case RewardTriggerType.REPEAT_VISIT:
        return contextData.visitCount >= (condition.parameters.visitCount || 2) &&
               this.checkVenueMatch(condition.parameters.venueIds, locationEvent.venueId);

      case RewardTriggerType.EXTENDED_VISIT:
        const visitDuration = locationEvent.metadata?.duration || 0;
        return visitDuration >= (condition.parameters.duration || 60) * 60; // Convert minutes to seconds

      case RewardTriggerType.MULTIPLE_VENUES:
        return await this.checkMultipleVenuesVisit(user.id, condition.parameters);

      case RewardTriggerType.TIME_BASED:
        return this.checkTimeRange(condition.parameters.timeRange);

      case RewardTriggerType.TIER_UPGRADE:
        return condition.parameters.tierRequired === userTier.currentTier;

      default:
        return false;
    }
  }

  // Helper methods
  private determineMainTriggerType(locationEvent: LocationEvent, contextData: any): RewardTriggerType {
    if (contextData.visitCount === 1) return RewardTriggerType.FIRST_VISIT;
    if (locationEvent.type === 'enter') return RewardTriggerType.LOCATION_ENTRY;
    if (locationEvent.type === 'exit') return RewardTriggerType.LOCATION_EXIT;
    return RewardTriggerType.LOCATION_ENTRY;
  }

  private checkVenueMatch(requiredVenues: string[] | undefined, venueId: string): boolean {
    if (!requiredVenues || requiredVenues.length === 0) return true;
    return requiredVenues.includes(venueId);
  }

  private checkTierRequirement(requiredTier: string | undefined, userTier: TierLevel): boolean {
    if (!requiredTier) return true;
    
    const tierLevels = {
      [TierLevel.BRONZE]: 1,
      [TierLevel.SILVER]: 2,
      [TierLevel.GOLD]: 3,
      [TierLevel.BLACK]: 4
    };

    return tierLevels[userTier] >= tierLevels[requiredTier as TierLevel];
  }

  private isTargetAudienceMatch(
    targetAudience: any,
    user: User,
    userTier: UserTier,
    contextData: any
  ): boolean {
    // Check tier levels
    if (targetAudience.tierLevels && !targetAudience.tierLevels.includes(userTier.currentTier)) {
      return false;
    }

    // Check visit history
    if (targetAudience.visitHistory) {
      if (targetAudience.visitHistory === 'first_time' && contextData.visitCount !== 1) return false;
      if (targetAudience.visitHistory === 'returning' && contextData.visitCount < 2) return false;
      if (targetAudience.visitHistory === 'vip' && !['gold', 'black'].includes(userTier.currentTier)) return false;
    }

    return true;
  }

  private async checkDisplayRules(displayRules: any, userId: string, promotionId: string): Promise<boolean> {
    // Mock implementation - would check database for recent displays
    return true; // Simplified for now
  }

  private async checkMultipleVenuesVisit(userId: string, parameters: any): Promise<boolean> {
    // Mock implementation - would check recent venue visits
    return Math.random() > 0.7; // 30% chance
  }

  private checkTimeRange(timeRange: any): boolean {
    if (!timeRange) return true;
    
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5);
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    
    const inTimeRange = currentTime >= timeRange.startTime && currentTime <= timeRange.endTime;
    const inDayRange = !timeRange.days || timeRange.days.includes(currentDay);
    
    return inTimeRange && inDayRange;
  }

  private isWithinBusinessHours(): boolean {
    const hour = new Date().getHours();
    return hour >= 18 && hour <= 26; // 6 PM to 2 AM
  }

  private isHappyHourActive(happyHour: HappyHourPromotion): boolean {
    for (const slot of happyHour.timeSlots) {
      if (this.checkTimeRange(slot)) {
        return true;
      }
    }
    return false;
  }

  private isWeatherConditionMet(weatherPromo: WeatherBasedPromotion, currentWeather: string): boolean {
    // Mock weather condition checking
    return weatherPromo.weatherTriggers.some(trigger => 
      currentWeather.toLowerCase().includes(trigger.condition)
    );
  }

  private async triggerHappyHourReward(
    happyHour: HappyHourPromotion,
    user: User,
    venue: Venue
  ): Promise<TriggeredReward | null> {
    const reward = happyHour.rewards[0]; // Take first reward
    if (!reward) return null;

    return {
      id: `reward_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: user.id,
      rewardDefinitionId: reward.id,
      triggerType: RewardTriggerType.TIME_BASED,
      triggerData: {
        venueId: venue.id,
        metadata: { happyHourId: happyHour.id }
      },
      reward,
      status: RewardStatus.TRIGGERED,
      triggeredAt: new Date(),
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
      redemptionCode: this.generateRedemptionCode(),
      estimatedValue: reward.value
    };
  }

  private async triggerWeatherReward(
    weatherPromo: WeatherBasedPromotion,
    user: User,
    venue: Venue
  ): Promise<TriggeredReward | null> {
    const reward = weatherPromo.rewards[0];
    if (!reward) return null;

    return {
      id: `reward_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      userId: user.id,
      rewardDefinitionId: reward.id,
      triggerType: RewardTriggerType.WEATHER_BASED,
      triggerData: {
        venueId: venue.id,
        metadata: { weatherPromoId: weatherPromo.id }
      },
      reward,
      status: RewardStatus.TRIGGERED,
      triggeredAt: new Date(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      redemptionCode: this.generateRedemptionCode(),
      estimatedValue: reward.value
    };
  }

  private generateRedemptionCode(): string {
    return `MAN${Date.now().toString().slice(-6)}`;
  }

  private async getCurrentWeather(): Promise<string> {
    // Mock weather API call
    const conditions = ['sunny', 'cloudy', 'rain', 'hot'];
    return conditions[Math.floor(Math.random() * conditions.length)];
  }

  private async getActiveSpecialEvents(venueId: string): Promise<string[]> {
    // Mock special events
    return ['live_music', 'dj_night'];
  }

  // Get available promotions for discovery
  async discoverRewards(
    userId: string,
    venueId: string,
    userTier: UserTier
  ): Promise<RewardDiscoveryResult> {
    const availablePromotions = this.locationPromotions.filter(p => 
      p.isActive && p.venueId === venueId
    );

    const proximityOffers = this.proximityPromotions.filter(p => 
      p.isActive && p.venueId === venueId
    );

    const timeBasedOffers = this.happyHourPromotions.filter(p => 
      p.isActive && p.venueId === venueId && this.isHappyHourActive(p)
    );

    const contextualRecommendations = availablePromotions.map(promotion => ({
      promotion,
      reason: this.getRecommendationReason(promotion, userTier),
      urgency: promotion.urgency,
      estimatedValue: promotion.rewards.reduce((sum, r) => sum + r.value, 0)
    }));

    return {
      availablePromotions,
      triggeredRewards: [], // Would fetch from database
      proximityOffers,
      timeBasedOffers,
      contextualRecommendations
    };
  }

  private getRecommendationReason(promotion: LocationPromotion, userTier: UserTier): string {
    if (promotion.targetAudience.tierLevels?.includes(userTier.currentTier)) {
      return `Oferta exclusiva para nivel ${userTier.currentTier}`;
    }
    if (promotion.urgency === PromotionUrgency.HIGH) {
      return 'Oferta por tiempo limitado';
    }
    return 'Promoción disponible ahora';
  }

  // Get all active promotions
  getActivePromotions(): LocationPromotion[] {
    return this.locationPromotions.filter(p => p.isActive);
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    return this.locationPromotions.length > 0;
  }
} 