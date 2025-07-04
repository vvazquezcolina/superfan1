<?php

/**
 * Application Configuration
 * General application settings and environment configuration
 */

// Application settings
$app_config = [
    'name' => 'Hotspot Portal',
    'version' => '1.0.0',
    'author' => 'Your Company',
    'description' => 'UniFi Hotspot Portal with Email Verification',
    
    // Environment settings
    'environment' => getenv('ENVIRONMENT') ?: 'production',
    'debug' => getenv('DEBUG') === 'true',
    'timezone' => getenv('TIMEZONE') ?: 'UTC',
    
    // Application URLs
    'base_url' => getenv('BASE_URL') ?: 'https://your-domain.com',
    'api_url' => getenv('API_URL') ?: 'https://your-domain.com/api',
    
    // Security settings
    'security' => [
        'session_timeout' => 1440, // 24 hours in minutes
        'token_expiry' => 3600, // 1 hour in seconds
        'max_login_attempts' => 5,
        'lockout_duration' => 900, // 15 minutes in seconds
        'password_min_length' => 8,
        'csrf_protection' => true,
        'rate_limiting' => true
    ],
    
    // Rate limiting settings
    'rate_limits' => [
        'registration' => [
            'requests' => 5,
            'window' => 3600 // 1 hour
        ],
        'verification' => [
            'requests' => 3,
            'window' => 1800 // 30 minutes
        ],
        'general' => [
            'requests' => 100,
            'window' => 3600 // 1 hour
        ]
    ],
    
    // File upload settings
    'uploads' => [
        'max_size' => 10 * 1024 * 1024, // 10MB
        'allowed_types' => ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
        'upload_path' => '/uploads/'
    ],
    
    // Logging settings
    'logging' => [
        'enabled' => true,
        'level' => getenv('LOG_LEVEL') ?: 'info',
        'max_files' => 30,
        'max_size' => 100 * 1024 * 1024, // 100MB
        'log_requests' => true,
        'log_errors' => true,
        'log_security' => true
    ],
    
    // Cache settings
    'cache' => [
        'enabled' => true,
        'default_ttl' => 3600, // 1 hour
        'driver' => 'file', // file, redis, memcached
        'prefix' => 'hotspot_'
    ],
    
    // Features flags
    'features' => [
        'email_verification' => true,
        'user_registration' => true,
        'data_export' => true,
        'admin_dashboard' => true,
        'api_rate_limiting' => true,
        'guest_portal' => true,
        'unifi_integration' => true
    ]
];

// Environment-specific overrides
switch ($app_config['environment']) {
    case 'development':
        $app_config['debug'] = true;
        $app_config['base_url'] = 'http://localhost';
        $app_config['api_url'] = 'http://localhost/api';
        $app_config['logging']['level'] = 'debug';
        $app_config['security']['csrf_protection'] = false;
        $app_config['cache']['enabled'] = false;
        break;
        
    case 'testing':
        $app_config['debug'] = true;
        $app_config['base_url'] = 'http://test.local';
        $app_config['api_url'] = 'http://test.local/api';
        $app_config['logging']['level'] = 'debug';
        $app_config['features']['email_verification'] = false;
        $app_config['cache']['enabled'] = false;
        break;
        
    case 'staging':
        $app_config['debug'] = false;
        $app_config['logging']['level'] = 'info';
        break;
        
    case 'production':
    default:
        $app_config['debug'] = false;
        $app_config['logging']['level'] = 'warning';
        $app_config['security']['csrf_protection'] = true;
        $app_config['security']['rate_limiting'] = true;
        break;
}

// Set timezone
date_default_timezone_set($app_config['timezone']);

/**
 * Get application configuration
 */
function getAppConfig($key = null) {
    global $app_config;
    
    if ($key === null) {
        return $app_config;
    }
    
    // Support dot notation for nested config
    $keys = explode('.', $key);
    $value = $app_config;
    
    foreach ($keys as $k) {
        if (isset($value[$k])) {
            $value = $value[$k];
        } else {
            return null;
        }
    }
    
    return $value;
}

/**
 * Check if feature is enabled
 */
function isFeatureEnabled($feature) {
    return getAppConfig("features.{$feature}") === true;
}

/**
 * Get environment
 */
function getEnvironment() {
    return getAppConfig('environment');
}

/**
 * Check if debug mode is enabled
 */
function isDebugMode() {
    return getAppConfig('debug') === true;
}

/**
 * Get base URL
 */
function getBaseUrl() {
    return rtrim(getAppConfig('base_url'), '/');
}

/**
 * Get API URL
 */
function getApiUrl() {
    return rtrim(getAppConfig('api_url'), '/');
}

/**
 * Example .env file for environment variables:
 * 
 * # Environment
 * ENVIRONMENT=production
 * DEBUG=false
 * TIMEZONE=America/New_York
 * 
 * # URLs
 * BASE_URL=https://your-domain.com
 * API_URL=https://your-domain.com/api
 * 
 * # Database
 * DB_HOST=localhost
 * DB_USERNAME=your_db_user
 * DB_PASSWORD=your_db_password
 * DB_NAME=your_database
 * 
 * # Email
 * SMTP_HOST=mail.your-domain.com
 * SMTP_USERNAME=noreply@your-domain.com
 * SMTP_PASSWORD=your_email_password
 * FROM_EMAIL=noreply@your-domain.com
 * 
 * # UniFi
 * UNIFI_HOST=your-controller-ip
 * UNIFI_USERNAME=your-admin-username
 * UNIFI_PASSWORD=your-admin-password
 * UNIFI_SITE=default
 * PORTAL_URL=https://your-domain.com
 * REDIRECT_URL=https://your-domain.com/success.html
 * 
 * # Logging
 * LOG_LEVEL=info
 */

?> 