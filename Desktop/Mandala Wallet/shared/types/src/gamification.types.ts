export enum TierLevel {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  BLACK = 'black'
}

export enum PointsActionType {
  VENUE_VISIT = 'venue_visit',
  FIRST_VISIT = 'first_visit',
  PAYMENT = 'payment',
  EXTENDED_VISIT = 'extended_visit',
  MULTIPLE_VENUES = 'multiple_venues',
  FRIEND_REFERRAL = 'friend_referral',
  BIRTHDAY_BONUS = 'birthday_bonus',
  TIER_UPGRADE = 'tier_upgrade',
  SPECIAL_EVENT = 'special_event'
}

export interface TierConfiguration {
  level: TierLevel;
  name: string;
  description: string;
  minPoints: number;
  maxPoints: number | null;
  benefits: TierBenefit[];
  color: string;
  icon: string;
  multiplier: number; // Points multiplier for this tier
}

export interface TierBenefit {
  type: 'discount' | 'cashback' | 'priority_access' | 'free_items' | 'exclusive_events';
  value: number;
  description: string;
  conditions?: {
    minAmount?: number;
    venues?: string[];
    timeRestriction?: {
      startTime: string;
      endTime: string;
      days: string[];
    };
  };
}

export interface UserTier {
  id: string;
  userId: string;
  currentTier: TierLevel;
  points: number;
  pointsToNextTier: number;
  tierBenefits: TierBenefit[];
  lastUpdated: Date;
  createdAt: Date;
  history: TierHistory[];
}

export interface TierHistory {
  id: string;
  userId: string;
  previousTier: TierLevel;
  newTier: TierLevel;
  pointsAtUpgrade: number;
  upgradedAt: Date;
  reason: string;
}

export interface PointsTransaction {
  id: string;
  userId: string;
  actionType: PointsActionType;
  points: number;
  description: string;
  metadata?: {
    venueId?: string;
    transactionId?: string;
    visitDuration?: number;
    referralUserId?: string;
    [key: string]: any;
  };
  createdAt: Date;
  expiresAt?: Date;
}

export interface PointsCalculationRule {
  actionType: PointsActionType;
  basePoints: number;
  tierMultiplier: boolean;
  conditions?: {
    minAmount?: number;
    minDuration?: number;
    dailyLimit?: number;
    cooldownHours?: number;
  };
  bonusConditions?: {
    firstTime?: number; // Bonus points for first time
    streak?: { days: number; bonus: number }[]; // Streak bonuses
    volume?: { threshold: number; bonus: number }[]; // Volume bonuses
  };
}

export interface PointsSummary {
  totalPoints: number;
  availablePoints: number;
  expiredPoints: number;
  earnedThisMonth: number;
  earnedThisWeek: number;
  recentTransactions: PointsTransaction[];
}

export interface TierProgressSummary {
  currentTier: TierLevel;
  currentPoints: number;
  nextTier: TierLevel | null;
  pointsToNextTier: number;
  progressPercentage: number;
  estimatedUpgradeDate: Date | null;
  monthlyActivity: {
    pointsEarned: number;
    venuesVisited: number;
    averageVisitDuration: number;
  };
}

export interface GamificationSettings {
  isEnabled: boolean;
  pointsExpirationMonths: number;
  tierDowngradeEnabled: boolean;
  tierDowngradeMonths: number;
  dailyPointsLimit: number;
  referralBonusPoints: number;
  birthdayBonusPoints: number;
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  tier: TierLevel;
  points: number;
  rank: number;
  monthlyPoints: number;
  venuesVisited: number;
}

export interface LeaderboardData {
  period: 'weekly' | 'monthly' | 'all_time';
  entries: LeaderboardEntry[];
  userRank: number | null;
  totalParticipants: number;
  lastUpdated: Date;
}

export interface GamificationAnalytics {
  totalUsers: number;
  tierDistribution: Record<TierLevel, number>;
  averagePointsPerUser: number;
  topPointsEarners: LeaderboardEntry[];
  pointsAwarded: {
    thisMonth: number;
    thisWeek: number;
    today: number;
  };
  popularActions: {
    actionType: PointsActionType;
    count: number;
    averagePoints: number;
  }[];
}

// API Response types
export interface GamificationResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface TierUpgradeNotification {
  userId: string;
  previousTier: TierLevel;
  newTier: TierLevel;
  pointsEarned: number;
  newBenefits: TierBenefit[];
  congratulationMessage: string;
}

export interface PointsAwardNotification {
  userId: string;
  actionType: PointsActionType;
  pointsAwarded: number;
  description: string;
  totalPoints: number;
  tierProgress: {
    currentTier: TierLevel;
    pointsToNextTier: number;
  };
} 