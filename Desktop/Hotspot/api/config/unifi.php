<?php

/**
 * UniFi Controller Configuration
 * Settings for UniFi API integration
 */

// UniFi Controller configuration
$unifi_config = [
    // UniFi Controller connection settings
    'controller' => [
        'host' => 'unifi.local', // Your UniFi Controller IP or hostname
        'port' => 8443, // Default HTTPS port for UniFi Controller
        'username' => 'admin', // UniFi Controller admin username
        'password' => 'admin_password', // UniFi Controller admin password
        'site' => 'default', // UniFi site name (usually 'default')
        'version' => 'v2', // API version (v1 or v2)
        'ssl_verify' => false, // Set to true for production with valid SSL
        'timeout' => 30
    ],
    
    // Guest access settings
    'guest' => [
        'portal_enabled' => true,
        'portal_url' => 'https://your-domain.com', // Your portal URL
        'redirect_url' => 'https://your-domain.com/success.html', // After login redirect
        'session_timeout' => 1440, // Session timeout in minutes (24 hours)
        'bandwidth_up' => 0, // Upload bandwidth limit (0 = unlimited)
        'bandwidth_down' => 0, // Download bandwidth limit (0 = unlimited)
        'data_limit' => 0, // Data usage limit in MB (0 = unlimited)
        'voucher_enabled' => false
    ],
    
    // API endpoints
    'endpoints' => [
        'login' => '/api/login',
        'logout' => '/api/logout',
        'authorize_guest' => '/api/s/{site}/cmd/stamgr',
        'unauthorize_guest' => '/api/s/{site}/cmd/stamgr',
        'get_clients' => '/api/s/{site}/stat/sta',
        'get_devices' => '/api/s/{site}/stat/device',
        'get_site_info' => '/api/s/{site}/self'
    ],
    
    // Rate limiting for API calls
    'rate_limit' => [
        'requests_per_minute' => 60,
        'requests_per_hour' => 1000
    ],
    
    // Logging settings
    'logging' => [
        'enabled' => true,
        'level' => 'info', // debug, info, warning, error
        'log_requests' => true,
        'log_responses' => false // Set to true for debugging
    ]
];

// Environment-specific configuration
$environment = getenv('ENVIRONMENT') ?: 'production';

switch ($environment) {
    case 'development':
        // Development settings
        $unifi_config['controller']['host'] = 'localhost';
        $unifi_config['controller']['ssl_verify'] = false;
        $unifi_config['logging']['level'] = 'debug';
        $unifi_config['logging']['log_responses'] = true;
        $unifi_config['guest']['portal_url'] = 'http://localhost';
        $unifi_config['guest']['redirect_url'] = 'http://localhost/success.html';
        break;
        
    case 'testing':
        // Testing settings - use mock responses
        $unifi_config['controller']['host'] = 'mock';
        $unifi_config['logging']['level'] = 'debug';
        break;
        
    case 'production':
    default:
        // Production settings - use environment variables if available
        if (getenv('UNIFI_HOST')) {
            $unifi_config['controller']['host'] = getenv('UNIFI_HOST');
        }
        if (getenv('UNIFI_USERNAME')) {
            $unifi_config['controller']['username'] = getenv('UNIFI_USERNAME');
        }
        if (getenv('UNIFI_PASSWORD')) {
            $unifi_config['controller']['password'] = getenv('UNIFI_PASSWORD');
        }
        if (getenv('UNIFI_SITE')) {
            $unifi_config['controller']['site'] = getenv('UNIFI_SITE');
        }
        if (getenv('PORTAL_URL')) {
            $unifi_config['guest']['portal_url'] = getenv('PORTAL_URL');
        }
        if (getenv('REDIRECT_URL')) {
            $unifi_config['guest']['redirect_url'] = getenv('REDIRECT_URL');
        }
        $unifi_config['controller']['ssl_verify'] = true;
        $unifi_config['logging']['level'] = 'warning';
        break;
}

/**
 * Get UniFi configuration
 */
function getUniFiConfig() {
    global $unifi_config;
    return $unifi_config;
}

/**
 * UniFi Controller Setup Instructions:
 * 
 * 1. Access your UniFi Controller (Cloud Key, Dream Machine, or software)
 * 2. Go to Settings > Guest Control
 * 3. Enable Guest Portal
 * 4. Set Authentication to "External Portal Server"
 * 5. Configure these settings:
 *    - Portal URL: https://your-domain.com
 *    - Redirect URL: https://your-domain.com/success.html
 *    - Session Timeout: 1440 minutes (24 hours)
 * 
 * 6. Update the configuration above:
 *    - 'host' => 'your-unifi-controller-ip'
 *    - 'username' => 'your-admin-username'
 *    - 'password' => 'your-admin-password'
 *    - 'site' => 'default' (or your site name)
 * 
 * 7. Test the connection using the UniFi API class
 * 
 * Common UniFi Controller access:
 * - Cloud Key: https://cloudkey-ip:8443
 * - Dream Machine: https://dream-machine-ip
 * - Software Controller: https://controller-ip:8443
 * 
 * For security, consider using environment variables:
 * - UNIFI_HOST=your-controller-ip
 * - UNIFI_USERNAME=your-admin-username
 * - UNIFI_PASSWORD=your-admin-password
 * - UNIFI_SITE=default
 * - PORTAL_URL=https://your-domain.com
 * - REDIRECT_URL=https://your-domain.com/success.html
 * 
 * API Documentation:
 * - https://ubntwiki.com/products/software/unifi-controller/api
 * - https://github.com/Art-of-WiFi/UniFi-API-client
 */

?> 