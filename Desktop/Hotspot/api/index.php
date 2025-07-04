<?php

/**
 * Hotspot Portal API
 * Main entry point for all API requests
 */

// Start output buffering
ob_start();

// Define API context for security
define('API_CONTEXT', true);

// Include required classes
require_once __DIR__ . '/classes/ErrorHandler.php';
require_once __DIR__ . '/classes/ApiResponse.php';
require_once __DIR__ . '/classes/Router.php';

// Register error handler
ErrorHandler::register();

// Handle CORS preflight requests
ApiResponse::handleOptions();

// Start session if needed
session_start();

// Initialize router
$router = new Router('/api');

// API Status endpoint
$router->get('/', function() {
    ApiResponse::success([
        'message' => 'Hotspot Portal API is running',
        'version' => '1.0.0',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
});

// Health check endpoint
$router->get('/health', function() {
    // Check database connection
    try {
        require_once __DIR__ . '/config/database.php';
        $db = getDatabase();
        $isDbConnected = $db->isConnected();
    } catch (Exception $e) {
        $isDbConnected = false;
    }
    
    $status = [
        'status' => 'ok',
        'database' => $isDbConnected ? 'connected' : 'disconnected',
        'timestamp' => date('Y-m-d H:i:s'),
        'server' => [
            'php_version' => phpversion(),
            'memory_usage' => memory_get_usage(true),
            'peak_memory' => memory_get_peak_usage(true)
        ]
    ];
    
    if (!$isDbConnected) {
        $status['status'] = 'error';
        ApiResponse::error('Database connection failed', 503, $status);
    } else {
        ApiResponse::success($status);
    }
});

// User registration endpoint
$router->post('/register', __DIR__ . '/endpoints/register.php');

// Email verification endpoint
$router->get('/verify/{token}', __DIR__ . '/endpoints/verify.php');

// Resend verification email endpoint
$router->post('/resend', __DIR__ . '/endpoints/resend.php');

// Data export endpoint (for admin)
$router->get('/export', __DIR__ . '/endpoints/export.php');

// User info endpoint
$router->get('/user/{id}', function($id) {
    // This would typically require authentication
    ApiResponse::success([
        'user_id' => $id,
        'message' => 'User endpoint - authentication required'
    ]);
});

// Test endpoint for development
$router->get('/test', function() {
    $data = [
        'method' => $_SERVER['REQUEST_METHOD'],
        'uri' => $_SERVER['REQUEST_URI'],
        'headers' => Router::getHeaders(),
        'client_ip' => Router::getClientIp(),
        'user_agent' => Router::getUserAgent(),
        'request_data' => Router::getRequestData()
    ];
    
    ApiResponse::success($data, 'Test endpoint response');
});

// Log all API requests
$endpoint = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$method = $_SERVER['REQUEST_METHOD'];
$data = Router::getRequestData();

ErrorHandler::logApiRequest($endpoint, $method, $data);

// Dispatch the request
try {
    $router->dispatch();
} catch (Exception $e) {
    ErrorHandler::logMessage("Router error: " . $e->getMessage(), 'ERROR');
    ApiResponse::serverError('Internal server error');
}

// This should never be reached due to ApiResponse::exit() calls
ApiResponse::notFound('API endpoint not found');

?> 