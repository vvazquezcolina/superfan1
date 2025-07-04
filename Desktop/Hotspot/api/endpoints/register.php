<?php

/**
 * User Registration API Endpoint
 * Handles user registration with validation and email verification
 */

// Prevent direct access
if (!defined('API_CONTEXT')) {
    define('API_CONTEXT', true);
}

// Include required classes
require_once __DIR__ . '/../classes/Database.php';
require_once __DIR__ . '/../classes/ApiResponse.php';
require_once __DIR__ . '/../classes/ErrorHandler.php';
require_once __DIR__ . '/../classes/Security.php';
require_once __DIR__ . '/../config/database.php';

// Apply security headers
Security::applySecurityHeaders();

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

// Rate limiting check
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$rateLimitResult = Security::checkRateLimit('register_' . $clientIp, 5, 300); // 5 attempts per 5 minutes
if (!$rateLimitResult['allowed']) {
    ApiResponse::tooManyRequests('Too many registration attempts. Please try again later.');
}

// CSRF token validation
$csrfToken = null;
if (isset($_SERVER['HTTP_X_CSRF_TOKEN'])) {
    $csrfToken = $_SERVER['HTTP_X_CSRF_TOKEN'];
} elseif (isset($input['csrf_token'])) {
    $csrfToken = $input['csrf_token'];
}

if (!$csrfToken || !Security::validateCsrfToken($csrfToken)) {
    ErrorHandler::logMessage("Invalid CSRF token in registration attempt from IP: $clientIp", 'WARNING');
    ApiResponse::forbidden('Invalid or expired security token. Please refresh the page and try again.');
}

// Validate and sanitize input fields
$errors = [];
$validatedData = [];

// Validate first name
if (!isset($input['first_name']) || empty(trim($input['first_name']))) {
    $errors['first_name'] = 'First name is required';
} else {
    $firstNameValidation = Security::validateInput($input['first_name'], 'name', ['min_length' => 2]);
    if (!$firstNameValidation['valid']) {
        $errors['first_name'] = $firstNameValidation['error'];
    } else {
        $validatedData['first_name'] = $firstNameValidation['sanitized'];
    }
}

// Validate last name
if (!isset($input['last_name']) || empty(trim($input['last_name']))) {
    $errors['last_name'] = 'Last name is required';
} else {
    $lastNameValidation = Security::validateInput($input['last_name'], 'name', ['min_length' => 2]);
    if (!$lastNameValidation['valid']) {
        $errors['last_name'] = $lastNameValidation['error'];
    } else {
        $validatedData['last_name'] = $lastNameValidation['sanitized'];
    }
}

// Validate email
if (!isset($input['email']) || empty(trim($input['email']))) {
    $errors['email'] = 'Email address is required';
} else {
    $emailValidation = Security::validateInput($input['email'], 'email');
    if (!$emailValidation['valid']) {
        $errors['email'] = $emailValidation['error'];
    } else {
        $validatedData['email'] = $emailValidation['sanitized'];
    }
}

// Validate terms agreement
if (!isset($input['terms_agreement']) || !$input['terms_agreement']) {
    $errors['terms_agreement'] = 'You must agree to the Terms of Service and Privacy Policy';
} else {
    $validatedData['terms_agreement'] = true;
}

// Return validation errors if any
if (!empty($errors)) {
    ApiResponse::badRequest('Validation failed', [
        'errors' => $errors,
        'received_data' => array_keys($input)
    ]);
}

// Additional security info
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$email = $validatedData['email'];

// Connect to database
try {
    $db = getDatabase();
    
    if (!$db->isConnected()) {
        throw new Exception('Database connection failed');
    }
    
    // Check if email already exists
    $stmt = $db->prepare("SELECT id, email_verified, created_at FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $existingUser = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($existingUser) {
        if ($existingUser['email_verified']) {
            ApiResponse::conflict('This email address is already registered and verified');
        } else {
            // Check if the unverified registration is recent (within 1 hour)
            $createdAt = new DateTime($existingUser['created_at']);
            $now = new DateTime();
            $diff = $now->diff($createdAt);
            
            if ($diff->h < 1 && $diff->days == 0) {
                ApiResponse::conflict('A verification email was recently sent to this address. Please check your inbox or wait before registering again.');
            } else {
                // Delete old unverified user and continue with new registration
                $stmt = $db->prepare("DELETE FROM users WHERE id = ?");
                $stmt->execute([$existingUser['id']]);
                ErrorHandler::logMessage("Deleted old unverified user: $email", 'INFO');
            }
        }
    }
    
    // Generate verification token
    $verificationToken = Security::generateSecureToken();
    $tokenExpiry = date('Y-m-d H:i:s', strtotime('+1 hour'));
    
    // Insert new user
    $stmt = $db->prepare("
        INSERT INTO users (
            first_name, 
            last_name, 
            email, 
            verification_token, 
            token_expiry, 
            terms_agreement, 
            client_ip, 
            user_agent,
            created_at,
            updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    ");
    
    $result = $stmt->execute([
        $validatedData['first_name'],
        $validatedData['last_name'],
        $email,
        $verificationToken,
        $tokenExpiry,
        $validatedData['terms_agreement'] ? 1 : 0,
        $clientIp,
        $userAgent
    ]);
    
    if (!$result) {
        throw new Exception('Failed to insert user into database');
    }
    
    $userId = $db->lastInsertId();
    
    // Log successful registration
    ErrorHandler::logMessage("User registered successfully: $email (ID: $userId)", 'INFO');
    
    // Send verification email
    require_once __DIR__ . '/../classes/EmailService.php';
    $emailService = new EmailService();
    
    $emailSent = $emailService->sendVerificationEmail(
        $email,
        $validatedData['first_name'],
        $verificationToken
    );
    
    if (!$emailSent) {
        ErrorHandler::logMessage("Failed to send verification email to $email", 'WARNING');
        // Continue with registration even if email fails
    }
    
    // Return success response
    ApiResponse::success([
        'message' => 'Registration successful! Please check your email for a verification link.',
        'user_id' => $userId,
        'verification_required' => true,
        'email' => $email,
        'token_expiry' => $tokenExpiry
    ], 'User registered successfully');
    
} catch (PDOException $e) {
    ErrorHandler::logMessage("Database error during registration: " . $e->getMessage(), 'ERROR');
    
    // Check for duplicate entry error
    if ($e->getCode() == 23000) {
        ApiResponse::conflict('This email address is already registered');
    } else {
        ApiResponse::serverError('Database error occurred');
    }
    
} catch (Exception $e) {
    ErrorHandler::logMessage("Registration error: " . $e->getMessage(), 'ERROR');
    ApiResponse::serverError('Registration failed. Please try again.');
}

?> 