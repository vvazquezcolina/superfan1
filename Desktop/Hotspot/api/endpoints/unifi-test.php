<?php

/**
 * UniFi Controller Test API Endpoint
 * Tests connection to UniFi Controller for admin verification
 */

// Prevent direct access
if (!defined('API_CONTEXT')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

// Include required classes
require_once __DIR__ . '/../classes/UniFiController.php';
require_once __DIR__ . '/../classes/ApiResponse.php';
require_once __DIR__ . '/../classes/ErrorHandler.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ApiResponse::methodNotAllowed('Only GET requests are allowed');
}

// TODO: Add authentication check for admin access
// For now, log the access attempt
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
ErrorHandler::logMessage("UniFi test endpoint accessed from IP: $clientIp", 'INFO');

try {
    // Initialize UniFi Controller
    $unifiController = new UniFiController();
    
    // Test connection
    $testResult = $unifiController->testConnection();
    
    if ($testResult['success']) {
        ErrorHandler::logMessage("UniFi Controller test successful", 'INFO');
        
        // Additional info for testing
        $additionalInfo = [
            'configuration' => [
                'host' => $unifiController->getConfig()['controller']['host'],
                'port' => $unifiController->getConfig()['controller']['port'],
                'site' => $unifiController->getConfig()['controller']['site'],
                'ssl_verify' => $unifiController->getConfig()['controller']['ssl_verify']
            ],
            'guest_settings' => [
                'session_timeout' => $unifiController->getConfig()['guest']['session_timeout'],
                'portal_url' => $unifiController->getConfig()['guest']['portal_url'],
                'redirect_url' => $unifiController->getConfig()['guest']['redirect_url']
            ],
            'test_performed_at' => date('Y-m-d H:i:s'),
            'authenticated' => $unifiController->isAuthenticated()
        ];
        
        ApiResponse::success(array_merge($testResult, $additionalInfo), 'UniFi Controller test successful');
    } else {
        ErrorHandler::logMessage("UniFi Controller test failed: " . $testResult['error'], 'ERROR');
        ApiResponse::serverError($testResult['error'], $testResult);
    }
    
} catch (Exception $e) {
    ErrorHandler::logMessage("UniFi test endpoint error: " . $e->getMessage(), 'ERROR');
    ApiResponse::serverError('UniFi Controller test failed: ' . $e->getMessage());
}

?> 