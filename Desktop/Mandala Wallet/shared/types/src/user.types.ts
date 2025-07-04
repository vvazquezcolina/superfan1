export enum UserRole {
  ADMIN = 'admin',
  VENUE_MANAGER = 'venue_manager',
  RP = 'rp',
  CLIENT = 'client'
}

export interface User {
  id: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  roles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  emailVerified: boolean;
  phoneNumber?: string;
  lastLoginAt?: Date;
}

export interface UserProfile {
  userId: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  nationality?: string;
  preferences: {
    language: string;
    currency: string;
    notifications: {
      email: boolean;
      push: boolean;
      sms: boolean;
    };
  };
  kycStatus: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  userId: string;
  roles: UserRole[];
}

export interface LoginRequest {
  email: string;
  password?: string;
  provider?: 'email' | 'google' | 'apple';
  idToken?: string;
}

export interface RegisterRequest {
  email: string;
  password?: string;
  displayName: string;
  provider?: 'email' | 'google' | 'apple';
  idToken?: string;
  roles: UserRole[];
}

export interface UserSession {
  user: User;
  token: AuthToken;
  permissions: string[];
} 