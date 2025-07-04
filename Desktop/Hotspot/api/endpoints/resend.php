<?php

/**
 * Resend Verification Email API Endpoint
 * Allows users to request a new verification email with rate limiting
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
require_once __DIR__ . '/../classes/EmailService.php';
require_once __DIR__ . '/../config/database.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    ApiResponse::methodNotAllowed('Only POST requests are allowed');
}

// Get request data
$input = json_decode(file_get_contents('php://input'), true);

// Validate input format
if (!$input || !is_array($input)) {
    ApiResponse::badRequest('Invalid JSON data');
}

// Validate email
$email = isset($input['email']) ? trim(strtolower($input['email'])) : null;

if (!$email) {
    ApiResponse::badRequest('Email address is required');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    ApiResponse::badRequest('Please provide a valid email address');
}

// Get client information for rate limiting
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';

// Connect to database
try {
    $db = getDatabase();
    
    if (!$db->isConnected()) {
        throw new Exception('Database connection failed');
    }
    
    // Check if user exists and is not verified
    $stmt = $db->prepare("
        SELECT id, first_name, email_verified, created_at, last_resend_at, resend_count 
        FROM users 
        WHERE email = ?
    ");
    $stmt->execute([$email]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if (!$user) {
        // Don't reveal if email exists or not for security
        ApiResponse::success([
            'message' => 'If this email address is registered and not yet verified, a new verification email will be sent.',
            'email' => $email
        ], 'Resend request processed');
    }
    
    if ($user['email_verified']) {
        ApiResponse::badRequest('This email address is already verified');
    }
    
    // Rate limiting checks
    $now = new DateTime();
    $createdAt = new DateTime($user['created_at']);
    $lastResendAt = $user['last_resend_at'] ? new DateTime($user['last_resend_at']) : null;
    $resendCount = (int)$user['resend_count'];
    
    // Check if too many resend attempts
    if ($resendCount >= 5) {
        ApiResponse::tooManyRequests('Maximum resend attempts reached. Please try registering again.');
    }
    
    // Check if last resend was too recent (5 minutes minimum)
    if ($lastResendAt) {
        $timeSinceLastResend = $now->diff($lastResendAt);
        $minutesSinceLastResend = ($timeSinceLastResend->days * 24 * 60) + ($timeSinceLastResend->h * 60) + $timeSinceLastResend->i;
        
        if ($minutesSinceLastResend < 5) {
            $remainingMinutes = 5 - $minutesSinceLastResend;
            ApiResponse::tooManyRequests("Please wait $remainingMinutes more minutes before requesting another verification email.");
        }
    }
    
    // Check IP-based rate limiting (max 3 requests per hour per IP)
    $stmt = $db->prepare("
        SELECT COUNT(*) as resend_requests 
        FROM users 
        WHERE client_ip = ? 
        AND last_resend_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)
    ");
    $stmt->execute([$clientIp]);
    $ipRequests = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($ipRequests['resend_requests'] >= 3) {
        ApiResponse::tooManyRequests('Too many resend requests from this IP address. Please try again later.');
    }
    
    // Generate new verification token
    $verificationToken = bin2hex(random_bytes(32));
    $tokenExpiry = date('Y-m-d H:i:s', strtotime('+1 hour'));
    
    // Update user with new token and resend information
    $stmt = $db->prepare("
        UPDATE users 
        SET verification_token = ?, 
            token_expiry = ?, 
            last_resend_at = NOW(),
            resend_count = resend_count + 1,
            updated_at = NOW()
        WHERE id = ?
    ");
    $result = $stmt->execute([$verificationToken, $tokenExpiry, $user['id']]);
    
    if (!$result) {
        throw new Exception('Failed to update user with new verification token');
    }
    
    // Send verification email
    $emailService = new EmailService();
    $emailSent = $emailService->sendVerificationEmail(
        $email,
        $user['first_name'],
        $verificationToken
    );
    
    if ($emailSent) {
        ErrorHandler::logMessage("Verification email resent to $email (attempt " . ($resendCount + 1) . ")", 'INFO');
        
        ApiResponse::success([
            'message' => 'A new verification email has been sent to your email address.',
            'email' => $email,
            'resend_count' => $resendCount + 1,
            'token_expiry' => $tokenExpiry
        ], 'Verification email resent successfully');
    } else {
        ErrorHandler::logMessage("Failed to resend verification email to $email", 'ERROR');
        ApiResponse::serverError('Failed to send verification email. Please try again.');
    }
    
} catch (PDOException $e) {
    ErrorHandler::logMessage("Database error during resend: " . $e->getMessage(), 'ERROR');
    ApiResponse::serverError('Database error occurred');
    
} catch (Exception $e) {
    ErrorHandler::logMessage("Resend error: " . $e->getMessage(), 'ERROR');
    ApiResponse::serverError('Failed to resend verification email. Please try again.');
}

?> 