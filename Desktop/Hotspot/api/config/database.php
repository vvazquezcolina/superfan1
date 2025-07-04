<?php

/**
 * Database Configuration
 * Settings for Bluehost MySQL connection
 */

// Database configuration - Update these values for your Bluehost setup
$db_config = [
    'host' => 'localhost', // Bluehost typically uses localhost
    'username' => 'your_username', // Your Bluehost database username
    'password' => 'your_password', // Your Bluehost database password
    'database' => 'your_database_name', // Your database name
    'charset' => 'utf8mb4'
];

// Alternative configuration for different environments
$environment = 'production'; // Change to 'development' or 'testing' as needed

switch ($environment) {
    case 'development':
        $db_config = [
            'host' => 'localhost',
            'username' => 'dev_user',
            'password' => 'dev_password',
            'database' => 'hotspot_dev',
            'charset' => 'utf8mb4'
        ];
        break;
        
    case 'testing':
        $db_config = [
            'host' => 'localhost',
            'username' => 'test_user',
            'password' => 'test_password',
            'database' => 'hotspot_test',
            'charset' => 'utf8mb4'
        ];
        break;
        
    case 'production':
    default:
        // Production settings for Bluehost
        $db_config = [
            'host' => 'localhost',
            'username' => getenv('DB_USERNAME') ?: 'your_username',
            'password' => getenv('DB_PASSWORD') ?: 'your_password',
            'database' => getenv('DB_NAME') ?: 'your_database_name',
            'charset' => 'utf8mb4'
        ];
        break;
}

// Create database instance
require_once __DIR__ . '/../classes/Database.php';

try {
    $database = new Database(
        $db_config['host'],
        $db_config['username'],
        $db_config['password'],
        $db_config['database']
    );
} catch (Exception $e) {
    error_log("Database initialization failed: " . $e->getMessage());
    if ($environment === 'development') {
        die("Database connection failed: " . $e->getMessage());
    } else {
        die("Database connection failed. Please try again later.");
    }
}

/**
 * Get database instance
 */
function getDatabase() {
    global $database;
    return $database;
}

/**
 * Instructions for Bluehost setup:
 * 
 * 1. Log into your Bluehost cPanel
 * 2. Go to "MySQL Databases" 
 * 3. Create a new database (e.g., "hotspot_portal")
 * 4. Create a new MySQL user with a strong password
 * 5. Add the user to the database with "All Privileges"
 * 6. Update the $db_config array above with your actual values:
 *    - 'username' => 'your_cpanel_username_dbuser'
 *    - 'password' => 'your_database_password'
 *    - 'database' => 'your_cpanel_username_hotspot_portal'
 * 
 * Note: Bluehost prefixes database names and usernames with your cPanel username
 */

?> 