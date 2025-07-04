<?php

/**
 * CSRF Token API Endpoint
 * Generates and serves CSRF tokens for frontend forms
 */

// Prevent direct access
if (!defined('API_CONTEXT')) {
    define('API_CONTEXT', true);
}

// Include required classes
require_once __DIR__ . '/../classes/ApiResponse.php';
require_once __DIR__ . '/../classes/Security.php';
require_once __DIR__ . '/../classes/ErrorHandler.php';

// Apply security headers
Security::applySecurityHeaders();

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ApiResponse::methodNotAllowed('Only GET requests are allowed');
}

// Rate limiting check for CSRF token generation
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitResult = Security::checkRateLimit('csrf_' . $clientIp, 60, 3600); // 60 requests per hour
if (!$rateLimitResult['allowed']) {
    ApiResponse::tooManyRequests('Too many CSRF token requests. Please try again later.');
}

try {
    // Generate CSRF token
    $token = Security::generateCsrfToken();
    
    // Log token generation for debugging
    ErrorHandler::logMessage("CSRF token generated for IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown'), 'INFO');
    
    // Return token
    ApiResponse::success([
        'csrf_token' => $token,
        'expires_in' => 3600, // 1 hour
        'expires_at' => date('Y-m-d H:i:s', time() + 3600)
    ], 'CSRF token generated successfully');
    
} catch (Exception $e) {
    ErrorHandler::logMessage("CSRF token generation error: " . $e->getMessage(), 'ERROR');
    ApiResponse::serverError('Failed to generate CSRF token');
}

?> 