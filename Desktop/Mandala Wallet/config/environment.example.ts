import { EnvironmentConfig } from '@mandala/shared-types';

// Template for environment configuration
// Copy this file to environment.ts and fill in your actual values
export const environmentConfig: EnvironmentConfig = {
  NODE_ENV: 'development',
  DATABASE_URL: 'postgresql://mandala:mandala_dev_password@localhost:5432/mandala_wallet',
  
  FIREBASE_CONFIG: {
    apiKey: 'your-firebase-api-key',
    authDomain: 'your-project.firebaseapp.com',
    projectId: 'your-project-id',
    storageBucket: 'your-project.appspot.com',
    messagingSenderId: 'your-sender-id',
    appId: 'your-app-id'
  },
  
  STRIPE_CONFIG: {
    publishableKey: 'pk_test_your_stripe_publishable_key',
    secretKey: 'sk_test_your_stripe_secret_key',
    webhookSecret: 'whsec_your_webhook_secret'
  },
  
  RADAR_CONFIG: {
    publishableKey: 'prj_test_your_radar_publishable_key',
    secretKey: 'sk_test_your_radar_secret_key'
  }
};

// Additional service-specific configurations
export const serviceConfig = {
  // API Gateway
  API_GATEWAY_PORT: 3000,
  GRAPHQL_PLAYGROUND: true,
  
  // Wallet Service
  WALLET_SERVICE_PORT: 3001,
  WALLET_SERVICE_URL: 'http://localhost:3001',
  
  // Auth Service
  AUTH_SERVICE_PORT: 3002,
  AUTH_SERVICE_URL: 'http://localhost:3002',
  
  // Geofence Service
  GEOFENCE_SERVICE_PORT: 3003,
  GEOFENCE_SERVICE_URL: 'http://localhost:3003',
  
  // Notification Service
  NOTIFICATION_SERVICE_PORT: 3004,
  NOTIFICATION_SERVICE_URL: 'http://localhost:3004',
  
  // Xetux Proxy
  XETUX_PROXY_PORT: 3005,
  XETUX_PROXY_URL: 'http://localhost:3005',
  XETUX_API_URL: 'https://api.xetux.com',
  XETUX_API_KEY: 'your-xetux-api-key',
  
  // Redis
  REDIS_URL: 'redis://localhost:6379',
  
  // JWT
  JWT_SECRET: 'your-jwt-secret-key',
  JWT_EXPIRES_IN: '7d',
  
  // CORS
  CORS_ORIGINS: ['http://localhost:3000', 'http://localhost:3001'],
  
  // Rate Limiting
  RATE_LIMIT_MAX: 100,
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  
  // File Upload
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Encryption
  ENCRYPTION_KEY: 'your-32-character-encryption-key',
  
  // Email (for notifications)
  SMTP_HOST: 'localhost',
  SMTP_PORT: 1025,
  SMTP_USER: '',
  SMTP_PASS: '',
  
  // Logging
  LOG_LEVEL: 'debug',
  LOG_FORMAT: 'combined',
  
  // Health Check
  HEALTH_CHECK_INTERVAL: 30000, // 30 seconds
  
  // Wallet Configuration
  WALLET_MIN_BALANCE: 100.00,
  WALLET_MAX_BALANCE: 10000.00,
  DEFAULT_CURRENCY: 'MXN',
  
  // Geofence Configuration
  DEFAULT_GEOFENCE_RADIUS: 500, // meters
  LOCATION_ACCURACY_THRESHOLD: 50, // meters
  
  // Rewards Configuration
  DEFAULT_TIER_POINTS: {
    bronze: 0,
    silver: 1000,
    gold: 5000,
    black: 10000
  },
  
  // QR Code Configuration
  QR_CODE_EXPIRY_HOURS: 24,
  QR_CODE_SIZE: 256,
  
  // Notification Configuration
  PUSH_NOTIFICATION_BATCH_SIZE: 100,
  NOTIFICATION_RETRY_ATTEMPTS: 3,
  
  // Note: Production overrides should be handled at runtime
  // For production, override these values in environment.ts:
  // GRAPHQL_PLAYGROUND: false,
  // LOG_LEVEL: 'error',
  // CORS_ORIGINS: ['https://mandala-wallet.vercel.app'],
  // RATE_LIMIT_MAX: 50,
  // HEALTH_CHECK_INTERVAL: 60000
}; 