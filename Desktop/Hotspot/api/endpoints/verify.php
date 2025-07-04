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
require_once __DIR__ . '/../classes/Security.php';
require_once __DIR__ . '/../config/database.php';

// Apply security headers
Security::applySecurityHeaders();

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ApiResponse::methodNotAllowed('Only GET requests are allowed');
}

// Get token from URL parameter (passed by Router)
$token = func_get_args()[0] ?? null;

if (!$token) {
    ApiResponse::badRequest('Verification token is required');
}

// Rate limiting check for verification attempts
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitResult = Security::checkRateLimit('verify_' . $clientIp, 10, 300); // 10 attempts per 5 minutes
if (!$rateLimitResult['allowed']) {
    ApiResponse::tooManyRequests('Too many verification attempts. Please try again later.');
}

// Sanitize and validate token format
try {
    $token = Security::sanitizeInput($token, 'string', ['max_length' => 64]);
    if (!preg_match('/^[a-f0-9]{64}$/i', $token)) {
        ApiResponse::badRequest('Invalid token format');
    }
} catch (Exception $e) {
    ErrorHandler::logMessage("Invalid verification token received: " . substr($token, 0, 20), 'WARNING');
    ApiResponse::badRequest('Invalid token provided');
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
    
    // Grant network access via UniFi API
    require_once __DIR__ . '/../classes/UniFiController.php';
    $unifiController = new UniFiController();
    
    // Get client MAC address from session/cookies or request headers
    $macAddress = getClientMacAddress();
    
    if ($macAddress) {
        $authResult = $unifiController->authorizeGuest($macAddress);
        
        if ($authResult['success']) {
            ErrorHandler::logMessage("Network access granted to {$user['email']} (MAC: $macAddress)", 'INFO');
            
            // Create session record for tracking
            $stmt = $db->prepare("
                INSERT INTO sessions (user_id, mac_address, authorized_at, expires_at, status, created_at, updated_at)
                VALUES (?, ?, NOW(), ?, 'active', NOW(), NOW())
            ");
            $stmt->execute([
                $user['id'],
                $macAddress,
                $authResult['expires_at']
            ]);
            
            $networkAccess = [
                'granted' => true,
                'mac_address' => $macAddress,
                'expires_at' => $authResult['expires_at'],
                'session_timeout' => $authResult['session_timeout']
            ];
        } else {
            ErrorHandler::logMessage("Failed to grant network access to {$user['email']}: " . $authResult['error'], 'WARNING');
            $networkAccess = [
                'granted' => false,
                'error' => 'Network authorization failed',
                'details' => $authResult['error']
            ];
        }
    } else {
        ErrorHandler::logMessage("No MAC address available for network authorization: {$user['email']}", 'WARNING');
        $networkAccess = [
            'granted' => false,
            'error' => 'Client MAC address not detected',
            'note' => 'Network access will be granted when you connect to the WiFi network'
        ];
    }
    
    // Return success response
    ApiResponse::success([
        'message' => 'Email verified successfully! You now have access to the WiFi network.',
        'email' => $user['email'],
        'verified' => true,
        'access_granted' => true,
        'network_access' => $networkAccess
    ], 'Email verification successful');
    
} catch (PDOException $e) {
    ErrorHandler::logMessage("Database error during verification: " . $e->getMessage(), 'ERROR');
    ApiResponse::serverError('Database error occurred');
    
} catch (Exception $e) {
    ErrorHandler::logMessage("Verification error: " . $e->getMessage(), 'ERROR');
    ApiResponse::serverError('Verification failed. Please try again.');
}

/**
 * Attempt to get client MAC address
 * Note: This is challenging in web environments due to browser security
 */
function getClientMacAddress() {
    // Try to get MAC from session if previously stored
    if (isset($_SESSION['client_mac'])) {
        return $_SESSION['client_mac'];
    }
    
    // Try to get MAC from cookie if previously stored
    if (isset($_COOKIE['client_mac'])) {
        return $_COOKIE['client_mac'];
    }
    
    // Try to get MAC from request headers (if available from captive portal)
    $headers = getallheaders();
    if (isset($headers['X-Client-MAC'])) {
        return $headers['X-Client-MAC'];
    }
    
    // Check for common captive portal headers
    $macHeaders = ['HTTP_X_CLIENT_MAC', 'HTTP_CLIENT_MAC', 'HTTP_X_MAC_ADDRESS'];
    foreach ($macHeaders as $header) {
        if (isset($_SERVER[$header])) {
            return $_SERVER[$header];
        }
    }
    
    // For development/testing - return a mock MAC
    if (getenv('ENVIRONMENT') === 'development') {
        return '00:11:22:33:44:55';
    }
    
    // If all else fails, return null
    // In a real captive portal setup, the MAC would be provided by the gateway
    return null;
}

?> 