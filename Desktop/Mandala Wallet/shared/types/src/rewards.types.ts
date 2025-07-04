export enum RewardTriggerType {
  LOCATION_ENTRY = 'location_entry',
  LOCATION_EXIT = 'location_exit',
  EXTENDED_VISIT = 'extended_visit',
  FIRST_VISIT = 'first_visit',
  REPEAT_VISIT = 'repeat_visit',
  MULTIPLE_VENUES = 'multiple_venues',
  TIME_BASED = 'time_based',
  WEATHER_BASED = 'weather_based',
  SPECIAL_EVENT = 'special_event',
  BIRTHDAY = 'birthday',
  FRIEND_REFERRAL = 'friend_referral',
  SPENDING_THRESHOLD = 'spending_threshold',
  TIER_UPGRADE = 'tier_upgrade',
  PASSPORT_COMPLETION = 'passport_completion',
  STREAK_MILESTONE = 'streak_milestone'
}

export enum RewardType {
  INSTANT_DISCOUNT = 'instant_discount',
  CASHBACK = 'cashback',
  FREE_ITEM = 'free_item',
  POINTS_MULTIPLIER = 'points_multiplier',
  TIER_BONUS = 'tier_bonus',
  VIP_ACCESS = 'vip_access',
  FUTURE_DISCOUNT = 'future_discount',
  BUNDLE_OFFER = 'bundle_offer',
  HAPPY_HOUR = 'happy_hour',
  LOYALTY_CREDIT = 'loyalty_credit'
}

export enum RewardStatus {
  ACTIVE = 'active',
  TRIGGERED = 'triggered',
  REDEEMED = 'redeemed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum PromotionUrgency {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export interface RewardTriggerCondition {
  type: RewardTriggerType;
  parameters: {
    venueIds?: string[];
    timeRange?: {
      startTime: string;
      endTime: string;
      days: string[];
    };
    visitCount?: number;
    duration?: number; // minutes
    amount?: number; // MXN
    tierRequired?: string;
    weatherCondition?: string;
    eventId?: string;
    proximityDistance?: number; // meters
    [key: string]: any;
  };
  weight: number; // For combining multiple conditions
}

export interface RewardDefinition {
  id: string;
  name: string;
  description: string;
  type: RewardType;
  value: number;
  conditions: {
    minAmount?: number;
    maxAmount?: number;
    tierRequired?: string;
    venueRestrictions?: string[];
    timeRestrictions?: {
      startTime: string;
      endTime: string;
      days: string[];
    };
    userRestrictions?: {
      maxPerUser?: number;
      cooldownHours?: number;
      firstTimeOnly?: boolean;
    };
  };
  validFrom: Date;
  validUntil: Date;
  redemptionInstructions: string;
  termsAndConditions: string[];
  isActive: boolean;
}

export interface TriggeredReward {
  id: string;
  userId: string;
  rewardDefinitionId: string;
  triggerType: RewardTriggerType;
  triggerData: {
    venueId?: string;
    locationEventId?: string;
    transactionId?: string;
    metadata?: Record<string, any>;
  };
  reward: RewardDefinition;
  status: RewardStatus;
  triggeredAt: Date;
  expiresAt: Date;
  redeemedAt?: Date;
  redemptionCode?: string;
  estimatedValue: number; // MXN
}

export interface LocationPromotion {
  id: string;
  venueId: string;
  name: string;
  description: string;
  shortDescription: string; // For notifications
  triggers: RewardTriggerCondition[];
  rewards: RewardDefinition[];
  priority: number;
  urgency: PromotionUrgency;
  targetAudience: {
    tierLevels?: string[];
    ageRange?: { min: number; max: number };
    visitHistory?: 'first_time' | 'returning' | 'vip';
    spendingPattern?: 'low' | 'medium' | 'high';
  };
  displayRules: {
    maxDisplaysPerUser: number;
    cooldownBetweenDisplays: number; // hours
    showOnEntry: boolean;
    showOnExit: boolean;
    showDuringVisit: boolean;
  };
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  budget?: {
    totalBudget: number;
    usedBudget: number;
    maxPerUser: number;
  };
  performance: {
    impressions: number;
    triggers: number;
    redemptions: number;
    conversionRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface RewardTriggerEvent {
  id: string;
  userId: string;
  venueId: string;
  triggerType: RewardTriggerType;
  conditionsMet: RewardTriggerCondition[];
  triggeredPromotions: LocationPromotion[];
  triggeredRewards: TriggeredReward[];
  contextData: {
    userTier: string;
    visitCount: number;
    lastVisit?: Date;
    currentSpending: number;
    timeOfDay: string;
    dayOfWeek: string;
    weather?: string;
    specialEvents?: string[];
    [key: string]: any;
  };
  processedAt: Date;
}

export interface ProximityPromotion {
  id: string;
  venueId: string;
  name: string;
  description: string;
  triggerRadius: number; // meters from venue
  reward: RewardDefinition;
  targetWindow: number; // minutes to reach venue after trigger
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  maxTriggers: number;
  currentTriggers: number;
}

export interface HappyHourPromotion {
  id: string;
  venueId: string;
  name: string;
  description: string;
  timeSlots: Array<{
    startTime: string;
    endTime: string;
    days: string[];
  }>;
  rewards: RewardDefinition[];
  autoTriggerOnEntry: boolean;
  requiresPresence: boolean; // Must be at venue during happy hour
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
}

export interface WeatherBasedPromotion {
  id: string;
  venueId: string;
  name: string;
  description: string;
  weatherTriggers: Array<{
    condition: 'rain' | 'sunny' | 'cloudy' | 'hot' | 'cool';
    threshold?: number; // temperature or precipitation
    duration?: number; // how long condition must persist
  }>;
  rewards: RewardDefinition[];
  autoActivate: boolean;
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
}

export interface RewardAnalytics {
  totalRewardsTriggered: number;
  totalRewardsRedeemed: number;
  totalValueDelivered: number; // MXN
  conversionRate: number;
  popularTriggerTypes: Array<{
    type: RewardTriggerType;
    count: number;
    conversionRate: number;
  }>;
  venuePerformance: Array<{
    venueId: string;
    venueName: string;
    triggeredRewards: number;
    redemptionRate: number;
    totalValue: number;
  }>;
  userEngagement: {
    activeUsers: number;
    averageRewardsPerUser: number;
    topUsers: Array<{
      userId: string;
      rewardsEarned: number;
      totalValue: number;
    }>;
  };
  timeAnalysis: {
    peakHours: Array<{ hour: number; count: number }>;
    peakDays: Array<{ day: string; count: number }>;
    seasonalTrends: Array<{ period: string; performance: number }>;
  };
}

export interface RewardNotification {
  type: 'reward_triggered' | 'reward_expiring' | 'promotion_available' | 'proximity_offer';
  title: string;
  message: string;
  actionUrl?: string;
  urgency: PromotionUrgency;
  metadata?: {
    rewardId?: string;
    promotionId?: string;
    venueId?: string;
    expiresAt?: Date;
    estimatedValue?: number;
  };
}

// API Response types
export interface RewardResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface RewardDiscoveryResult {
  availablePromotions: LocationPromotion[];
  triggeredRewards: TriggeredReward[];
  proximityOffers: ProximityPromotion[];
  timeBasedOffers: HappyHourPromotion[];
  contextualRecommendations: Array<{
    promotion: LocationPromotion;
    reason: string;
    urgency: PromotionUrgency;
    estimatedValue: number;
  }>;
} 