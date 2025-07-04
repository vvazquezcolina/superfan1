// User types
export * from './user.types';

// Wallet types
export * from './wallet.types';

// Venue types
export * from './venue.types';

// Gamification types
export * from './gamification.types';

// Passport types
export * from './passport.types';

// Rewards types
export * from './rewards.types';

// Progress types
export * from './progress.types';

// Common API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  code?: string;
  timestamp: Date;
}

// Common utility types
export type ID = string;
export type Currency = 'MXN' | 'USD';
export type Locale = 'es-MX' | 'en-US';

// Environment types
export interface EnvironmentConfig {
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL: string;
  FIREBASE_CONFIG: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  STRIPE_CONFIG: {
    publishableKey: string;
    secretKey: string;
    webhookSecret: string;
  };
  RADAR_CONFIG: {
    publishableKey: string;
    secretKey: string;
  };
}

// GraphQL types
export interface GraphQLContext {
  user?: import('./user.types').User;
  userId?: string;
  roles?: import('./user.types').UserRole[];
  isAuthenticated: boolean;
} 