export enum PassportType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  VENUE_CHAIN = 'venue_chain',
  SPECIAL_EVENT = 'special_event',
  SEASONAL = 'seasonal'
}

export enum StampStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  REDEEMED = 'redeemed'
}

export enum PassportStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  EXPIRED = 'expired',
  CLAIMED = 'claimed'
}

export interface QRStamp {
  id: string;
  passportId: string;
  venueId: string;
  venueName: string;
  visitId: string; // Reference to location event
  stampedAt: Date;
  validUntil: Date;
  status: StampStatus;
  metadata?: {
    visitDuration?: number;
    transactionAmount?: number;
    specialEvent?: string;
    [key: string]: any;
  };
}

export interface PassportTemplate {
  id: string;
  type: PassportType;
  name: string;
  description: string;
  requiredVenues: string[]; // Venue IDs required for completion
  requiredStamps: number;
  validityPeriod: number; // Hours
  rewards: PassportReward[];
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  rules: PassportRule[];
}

export interface PassportRule {
  type: 'minimum_visit_duration' | 'minimum_spend' | 'specific_time_range' | 'sequential_visits' | 'same_day_visits';
  value: number | string;
  description: string;
}

export interface PassportReward {
  type: 'points' | 'cashback' | 'discount' | 'free_item' | 'tier_bonus';
  value: number;
  description: string;
  conditions?: {
    tierRequired?: string;
    minimumStamps?: number;
  };
}

export interface QRPassport {
  id: string;
  userId: string;
  templateId: string;
  type: PassportType;
  name: string;
  description: string;
  stamps: QRStamp[];
  totalStamps: number;
  requiredStamps: number;
  progress: number; // Percentage completion
  status: PassportStatus;
  createdAt: Date;
  completedAt?: Date;
  claimedAt?: Date;
  expiresAt: Date;
  rewards: PassportReward[];
  metadata?: {
    specialRequirements?: string[];
    bonusProgress?: number;
    [key: string]: any;
  };
}

export interface PassportCollection {
  userId: string;
  activePassports: QRPassport[];
  completedPassports: QRPassport[];
  totalStampsCollected: number;
  totalPassportsCompleted: number;
  currentStreak: number; // Days with at least one stamp
  longestStreak: number;
  achievements: PassportAchievement[];
  lastUpdated: Date;
}

export interface PassportAchievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
  requirements: {
    type: 'stamps_collected' | 'passports_completed' | 'streak_days' | 'venues_visited';
    threshold: number;
  };
  rewards: PassportReward[];
}

export interface StampValidationResult {
  isValid: boolean;
  reason?: string;
  stamp?: QRStamp;
  passportUpdates?: QRPassport[];
  newAchievements?: PassportAchievement[];
  rewardsEarned?: PassportReward[];
}

export interface PassportProgress {
  passport: QRPassport;
  recentStamps: QRStamp[];
  nextRequiredVenues: string[];
  estimatedCompletion: Date | null;
  recommendations: {
    venueId: string;
    venueName: string;
    reason: string;
    urgency: 'low' | 'medium' | 'high';
  }[];
}

export interface PassportAnalytics {
  completionRate: number;
  averageCompletionTime: number; // Hours
  popularVenues: {
    venueId: string;
    venueName: string;
    stampCount: number;
  }[];
  userEngagement: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    averageStampsPerUser: number;
  };
  passportPerformance: {
    type: PassportType;
    created: number;
    completed: number;
    completionRate: number;
  }[];
}

export interface PassportNotification {
  type: 'stamp_earned' | 'passport_completed' | 'passport_expiring' | 'achievement_unlocked' | 'recommendation';
  title: string;
  message: string;
  actionUrl?: string;
  metadata?: {
    passportId?: string;
    stampId?: string;
    achievementId?: string;
    venueId?: string;
  };
}

// API Response types
export interface PassportResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
} 