export enum ProgressMetricType {
  POINTS = 'points',
  TIER_PROGRESS = 'tier_progress',
  ACHIEVEMENTS = 'achievements',
  VISITS = 'visits',
  SPENDING = 'spending',
  STREAKS = 'streaks',
  SOCIAL_ENGAGEMENT = 'social_engagement',
  PASSPORT_COMPLETION = 'passport_completion',
  REWARDS_EARNED = 'rewards_earned'
}

export enum ProgressPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly',
  ALL_TIME = 'all_time'
}

export enum ProgressChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  DONUT = 'donut',
  AREA = 'area',
  GAUGE = 'gauge',
  PROGRESS_BAR = 'progress_bar',
  HEATMAP = 'heatmap'
}

export enum AchievementCategory {
  VISITS = 'visits',
  SPENDING = 'spending',
  SOCIAL = 'social',
  LOYALTY = 'loyalty',
  EXPLORATION = 'exploration',
  TIER_MILESTONE = 'tier_milestone',
  SPECIAL_EVENT = 'special_event',
  SEASONAL = 'seasonal'
}

export interface ProgressDataPoint {
  timestamp: Date;
  value: number;
  metadata?: Record<string, any>;
  label?: string;
}

export interface ProgressTrend {
  period: ProgressPeriod;
  data: ProgressDataPoint[];
  trend: 'increasing' | 'decreasing' | 'stable';
  changePercentage: number;
  totalValue: number;
  averageValue: number;
  peakValue: number;
  peakDate: Date;
}

export interface TierProgressStatus {
  currentTier: string;
  currentPoints: number;
  pointsToNextTier: number;
  progressPercentage: number;
  nextTier: string | null;
  tierBenefits: Array<{
    type: string;
    description: string;
    unlocked: boolean;
  }>;
  estimatedTimeToNextTier?: string;
}

export interface AchievementProgress {
  achievementId: string;
  name: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  currentProgress: number;
  totalRequired: number;
  progressPercentage: number;
  isCompleted: boolean;
  completedAt?: Date;
  unlockedAt?: Date;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  pointsReward: number;
  badgeUrl?: string;
  prerequisites?: string[];
}

export interface StreakAnalytics {
  currentStreak: number;
  longestStreak: number;
  streakType: 'daily_visit' | 'weekly_visit' | 'spending' | 'passport_stamps';
  lastActivity: Date;
  streakStartDate: Date;
  streakEndDate?: Date;
  averageStreakLength: number;
  totalStreaks: number;
  streakMultiplier: number;
}

export interface VenueEngagement {
  venueId: string;
  venueName: string;
  totalVisits: number;
  totalDuration: number; // minutes
  averageVisitDuration: number;
  totalSpending: number;
  pointsEarned: number;
  stampsCollected: number;
  rewardsEarned: number;
  lastVisit: Date;
  favoriteTimeSlot: string;
  favoriteDay: string;
  engagementScore: number; // 0-100
}

export interface SocialMetrics {
  referralsCount: number;
  referralPointsEarned: number;
  friendsInvited: number;
  socialInteractions: number;
  leaderboardRank: number;
  leaderboardParticipation: number; // percentage of weeks participated
  communityEngagement: number; // 0-100 score
  sharesCount: number;
}

export interface ProgressInsight {
  type: 'achievement' | 'milestone' | 'recommendation' | 'celebration';
  title: string;
  description: string;
  actionable: boolean;
  actionText?: string;
  actionUrl?: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  generatedAt: Date;
  metadata?: Record<string, any>;
}

export interface UserProgressSummary {
  userId: string;
  displayName: string;
  profilePicture?: string;
  overallScore: number; // 0-100 comprehensive engagement score
  tierProgress: TierProgressStatus;
  pointsAnalytics: {
    totalPoints: number;
    pointsThisWeek: number;
    pointsThisMonth: number;
    averagePointsPerVisit: number;
    pointsTrend: ProgressTrend;
  };
  achievementProgress: {
    totalAchievements: number;
    completedAchievements: number;
    inProgressAchievements: AchievementProgress[];
    recentAchievements: AchievementProgress[];
    rareAchievements: AchievementProgress[];
  };
  venueEngagement: VenueEngagement[];
  streakAnalytics: StreakAnalytics[];
  socialMetrics: SocialMetrics;
  insights: ProgressInsight[];
  lastUpdated: Date;
}

export interface ProgressVisualization {
  id: string;
  type: ProgressChartType;
  title: string;
  description: string;
  data: any; // Chart.js compatible data
  options: any; // Chart.js compatible options
  period: ProgressPeriod;
  metricType: ProgressMetricType;
  refreshInterval: number; // seconds
  isRealTime: boolean;
}

export interface ProgressDashboard {
  userId: string;
  dashboardType: 'user' | 'admin' | 'venue_manager';
  widgets: Array<{
    id: string;
    type: 'chart' | 'metric' | 'leaderboard' | 'achievement' | 'insight';
    visualization: ProgressVisualization;
    position: { x: number; y: number; w: number; h: number };
    isVisible: boolean;
    refreshRate: number;
  }>;
  customizations: {
    theme: 'light' | 'dark' | 'mandala';
    accentColor: string;
    showAnimations: boolean;
    compactMode: boolean;
  };
  lastUpdated: Date;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  profilePicture?: string;
  score: number;
  tier: string;
  change: number; // rank change from previous period
  badges: string[];
  isCurrentUser: boolean;
}

export interface Leaderboard {
  id: string;
  name: string;
  description: string;
  category: 'points' | 'visits' | 'spending' | 'achievements' | 'streaks';
  period: ProgressPeriod;
  entries: LeaderboardEntry[];
  totalParticipants: number;
  userRank?: number;
  lastUpdated: Date;
  prizes?: Array<{
    rank: number;
    description: string;
    value: number;
    currency: string;
  }>;
}

export interface ProgressGoal {
  id: string;
  userId: string;
  title: string;
  description: string;
  category: AchievementCategory;
  targetValue: number;
  currentValue: number;
  progressPercentage: number;
  deadline?: Date;
  isCompleted: boolean;
  completedAt?: Date;
  reward: {
    type: 'points' | 'badge' | 'tier_boost' | 'special_offer';
    value: number;
    description: string;
  };
  milestones: Array<{
    percentage: number;
    reward: string;
    isUnlocked: boolean;
  }>;
}

export interface ProgressNotification {
  id: string;
  userId: string;
  type: 'achievement_unlocked' | 'tier_upgraded' | 'streak_milestone' | 'goal_completed' | 'leaderboard_position';
  title: string;
  message: string;
  icon: string;
  action?: {
    text: string;
    url: string;
  };
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
  celebrationLevel: 'none' | 'confetti' | 'fireworks' | 'special';
  createdAt: Date;
  expiresAt?: Date;
}

export interface ProgressAnalytics {
  userId: string;
  period: ProgressPeriod;
  metrics: {
    engagement: {
      visitFrequency: number;
      averageSessionDuration: number;
      venuesDiversity: number;
      returnRate: number;
    };
    performance: {
      pointsVelocity: number; // points per day
      achievementRate: number; // achievements per month
      tierProgressionSpeed: number;
      spendingGrowth: number;
    };
    social: {
      referralSuccess: number;
      communityParticipation: number;
      leaderboardPerformance: number;
    };
    predictive: {
      churnRisk: number; // 0-100
      tierUpgradeETA: string;
      nextAchievementETA: string;
      recommendedActions: string[];
    };
  };
  comparisons: {
    vsLastPeriod: Record<string, number>;
    vsPeerGroup: Record<string, number>;
    vsTopPerformers: Record<string, number>;
  };
  generatedAt: Date;
}

export interface VenueAnalytics {
  venueId: string;
  venueName: string;
  period: ProgressPeriod;
  engagement: {
    totalVisits: number;
    uniqueVisitors: number;
    averageVisitDuration: number;
    repeatVisitorRate: number;
    peakHours: Array<{ hour: number; visits: number }>;
    peakDays: Array<{ day: string; visits: number }>;
  };
  gamification: {
    pointsAwarded: number;
    stampsCollected: number;
    achievementsUnlocked: number;
    tierUpgrades: number;
    rewardsTriggered: number;
  };
  userSegmentation: {
    byTier: Record<string, number>;
    byEngagement: Record<string, number>;
    newVsReturning: { new: number; returning: number };
  };
  revenue: {
    totalSpending: number;
    averageSpendingPerVisit: number;
    averageSpendingPerUser: number;
    spendingTrend: ProgressTrend;
  };
  recommendations: ProgressInsight[];
}

// API Response types
export interface ProgressResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface ProgressUpdate {
  userId: string;
  metricType: ProgressMetricType;
  oldValue: number;
  newValue: number;
  change: number;
  triggeredAchievements: string[];
  triggeredInsights: ProgressInsight[];
  timestamp: Date;
} 