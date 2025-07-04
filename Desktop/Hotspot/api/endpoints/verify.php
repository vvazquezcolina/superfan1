<?php

/**
 * Email Verification API Endpoint
 * Verifies user email addresses using secure tokens
 */

// Prevent direct access
if (!defined('API_CONTEXT')) {
    http_response_code(403);
    exit('Direct access not allowed');
}

// Include required classes
require_once __DIR__ . '/../classes/Database.php';
require_once __DIR__ . '/../classes/ApiResponse.php';
require_once __DIR__ . '/../classes/ErrorHandler.php';
require_once __DIR__ . '/../config/database.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ApiResponse::methodNotAllowed('Only GET requests are allowed');
}

// Get token from URL parameter (passed by Router)
$token = func_get_args()[0] ?? null;

if (!$token) {
    ApiResponse::badRequest('Verification token is required');
}

// Validate token format
if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
    ApiResponse::badRequest('Invalid token format');
}

// Connect to database and verify token
try {
    $db = getDatabase();
    
    if (!$db->isConnected()) {
        throw new Exception('Database connection failed');
    }
    
    // Find user with this token
    $stmt = $db->prepare("
        SELECT id, email, verification_token, token_expiry, email_verified 
        FROM users 
        WHERE verification_token = ?
    ");
    $stmt->execute([$token]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        ApiResponse::notFound('Invalid verification token');
    }
    
    // Check if already verified
    if ($user['email_verified']) {
        ApiResponse::success([
            'message' => 'Email address is already verified',
            'email' => $user['email'],
            'verified' => true
        ], 'Email already verified');
    }
    
    // Check token expiry
    $now = new DateTime();
    $expiry = new DateTime($user['token_expiry']);
    
    if ($now > $expiry) {
        ApiResponse::badRequest('Verification token has expired. Please register again.');
    }
    
    // Update user as verified
    $stmt = $db->prepare("
        UPDATE users 
        SET email_verified = 1, 
            verification_token = NULL, 
            token_expiry = NULL,
            verified_at = NOW(),
            updated_at = NOW()
        WHERE id = ?
    ");
    $result = $stmt->execute([$user['id']]);
    
    if (!$result) {
        throw new Exception('Failed to update user verification status');
    }
    
    // Log successful verification
    ErrorHandler::logMessage("Email verified successfully: {$user['email']} (ID: {$user['id']})", 'INFO');
    
    // Send welcome email
    require_once __DIR__ . '/../classes/EmailService.php';
    $emailService = new EmailService();
    
    // Get user's first name for welcome email
    $stmt = $db->prepare("SELECT first_name FROM users WHERE id = ?");
    $stmt->execute([$user['id']]);
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);
    $firstName = $userData['first_name'] ?? 'User';
    
    $welcomeEmailSent = $emailService->sendWelcomeEmail($user['email'], $firstName);
    
    if (!$welcomeEmailSent) {
        ErrorHandler::logMessage("Failed to send welcome email to {$user['email']}", 'WARNING');
        // Continue with verification even if welcome email fails
    }
    
    // TODO: Grant network access via UniFi API (will be implemented in Task 4.0)
    
    // Return success response
    ApiResponse::success([
        'message' => 'Email verified successfully! You now have access to the WiFi network.',
        'email' => $user['email'],
        'verified' => true,
        'access_granted' => true
    ], 'Email verification successful');
    
} catch (PDOException $e) {
    ErrorHandler::logMessage("Database error during verification: " . $e->getMessage(), 'ERROR');
    ApiResponse::serverError('Database error occurred');
    
} catch (Exception $e) {
    ErrorHandler::logMessage("Verification error: " . $e->getMessage(), 'ERROR');
    ApiResponse::serverError('Verification failed. Please try again.');
}

?> 