<?php

/**
 * Email Configuration
 * Settings for email service integration
 */

// Email service configuration
$email_config = [
    // Email service provider - options: 'smtp', 'sendmail', 'mail'
    'service' => 'smtp',
    
    // SMTP Configuration for Bluehost
    'smtp' => [
        'host' => 'mail.your-domain.com', // Replace with your domain
        'port' => 587, // Use 587 for TLS, 465 for SSL
        'encryption' => 'tls', // 'tls' or 'ssl'
        'username' => 'noreply@your-domain.com', // Your email address
        'password' => 'your-email-password', // Your email password
        'timeout' => 30,
        'debug' => false // Set to true for debugging
    ],
    
    // Alternative Gmail SMTP (for testing)
    'gmail' => [
        'host' => 'smtp.gmail.com',
        'port' => 587,
        'encryption' => 'tls',
        'username' => 'your-gmail@gmail.com',
        'password' => 'your-app-password', // Use app password for Gmail
        'timeout' => 30,
        'debug' => false
    ],
    
    // Email templates and settings
    'templates' => [
        'verification' => [
            'subject' => 'Verify your email address - WiFi Access',
            'from_name' => 'WiFi Portal',
            'from_email' => 'noreply@your-domain.com'
        ],
        'welcome' => [
            'subject' => 'Welcome to our WiFi network',
            'from_name' => 'WiFi Portal',
            'from_email' => 'noreply@your-domain.com'
        ]
    ],
    
    // Email sending limits (to prevent spam)
    'limits' => [
        'max_per_hour' => 100,
        'max_per_day' => 500,
        'max_per_ip_per_hour' => 5
    ],
    
    // Email verification settings
    'verification' => [
        'token_expiry' => 3600, // 1 hour in seconds
        'base_url' => 'https://your-domain.com', // Your domain
        'verify_path' => '/verify.html?token=',
        'resend_cooldown' => 300 // 5 minutes in seconds
    ]
];

// Environment-specific configuration
$environment = getenv('ENVIRONMENT') ?: 'production';

switch ($environment) {
    case 'development':
        // Development settings - use local testing
        $email_config['service'] = 'mail'; // Use PHP mail() for testing
        $email_config['smtp']['debug'] = true;
        $email_config['verification']['base_url'] = 'http://localhost';
        break;
        
    case 'testing':
        // Testing settings - disable actual sending
        $email_config['service'] = 'test'; // Special test mode
        break;
        
    case 'production':
    default:
        // Production settings - use environment variables if available
        if (getenv('SMTP_HOST')) {
            $email_config['smtp']['host'] = getenv('SMTP_HOST');
        }
        if (getenv('SMTP_USERNAME')) {
            $email_config['smtp']['username'] = getenv('SMTP_USERNAME');
        }
        if (getenv('SMTP_PASSWORD')) {
            $email_config['smtp']['password'] = getenv('SMTP_PASSWORD');
        }
        if (getenv('BASE_URL')) {
            $email_config['verification']['base_url'] = getenv('BASE_URL');
        }
        if (getenv('FROM_EMAIL')) {
            $email_config['templates']['verification']['from_email'] = getenv('FROM_EMAIL');
            $email_config['templates']['welcome']['from_email'] = getenv('FROM_EMAIL');
        }
        break;
}

/**
 * Get email configuration
 */
function getEmailConfig() {
    global $email_config;
    return $email_config;
}

/**
 * Bluehost SMTP Setup Instructions:
 * 
 * 1. Create an email account in your Bluehost cPanel
 * 2. Go to "Email Accounts" in cPanel
 * 3. Create a new email account (e.g., noreply@yourdomain.com)
 * 4. Update the configuration above:
 *    - 'host' => 'mail.yourdomain.com'
 *    - 'username' => 'noreply@yourdomain.com'
 *    - 'password' => 'your-email-password'
 * 
 * 5. Test the configuration using the email service class
 * 
 * Common Bluehost SMTP settings:
 * - Incoming Server: mail.yourdomain.com
 * - Outgoing Server: mail.yourdomain.com
 * - Port: 587 (TLS) or 465 (SSL)
 * - Authentication: Required
 * 
 * For security, consider using environment variables:
 * - SMTP_HOST=mail.yourdomain.com
 * - SMTP_USERNAME=noreply@yourdomain.com
 * - SMTP_PASSWORD=your-password
 * - BASE_URL=https://yourdomain.com
 * - FROM_EMAIL=noreply@yourdomain.com
 */

?> 