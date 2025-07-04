import { TierLevel } from './gamification.types';

export enum VenueStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  MAINTENANCE = 'maintenance'
}

export interface Venue {
  id: string;
  name: string;
  description?: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  location: {
    latitude: number;
    longitude: number;
    geofenceRadius: number; // in meters
  };
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  managerId: string;
  status: VenueStatus;
  settings: {
    acceptsQRPayments: boolean;
    acceptsCashPayments: boolean;
    geofenceEnabled: boolean;
    pushNotificationsEnabled: boolean;
    maxTransactionAmount: number;
    timezone: string;
  };
  businessHours: {
    [key: string]: {
      open: string;
      close: string;
      isOpen: boolean;
    };
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Geofence {
  id: string;
  venueId: string;
  name: string;
  latitude: number;
  longitude: number;
  radius: number; // in meters
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface LocationEvent {
  id: string;
  userId: string;
  venueId: string;
  type: 'enter' | 'exit';
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  metadata?: Record<string, any>;
}

export interface Reward {
  id: string;
  venueId?: string; // null for global rewards
  name: string;
  description: string;
  type: 'cashback' | 'points' | 'discount' | 'freebie';
  value: number;
  conditions: {
    minAmount?: number;
    maxAmount?: number;
    tierRequired?: TierLevel;
    timeRestriction?: {
      startTime: string;
      endTime: string;
      days: string[];
    };
    locationRequired?: boolean;
    firstTimeUser?: boolean;
  };
  isActive: boolean;
  validFrom: Date;
  validUntil: Date;
  maxRedemptions?: number;
  currentRedemptions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserReward {
  id: string;
  userId: string;
  rewardId: string;
  amount: number;
  type: 'cashback' | 'points' | 'discount' | 'freebie';
  status: 'earned' | 'redeemed' | 'expired';
  earnedAt: Date;
  redeemedAt?: Date;
  expiresAt: Date;
  transactionId?: string;
  venueId?: string;
}

export interface Promotion {
  id: string;
  venueId: string;
  name: string;
  description: string;
  type: 'discount' | 'cashback' | 'bonus_points' | 'buy_one_get_one';
  value: number;
  conditions: {
    minAmount?: number;
    maxAmount?: number;
    validFrom: Date;
    validUntil: Date;
    timeRestriction?: {
      startTime: string;
      endTime: string;
      days: string[];
    };
    tierRequired?: TierLevel;
    firstTimeUser?: boolean;
    geofenceRequired?: boolean;
  };
  isActive: boolean;
  maxRedemptions?: number;
  currentRedemptions: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface GeofenceNotification {
  id: string;
  userId: string;
  venueId: string;
  type: 'welcome' | 'promotion' | 'reminder' | 'farewell';
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  sentAt: Date;
  readAt?: Date;
} 