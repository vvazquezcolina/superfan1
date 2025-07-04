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

// Define validation rules
$validation = [
    'first_name' => [
        'required' => true,
        'min_length' => 2,
        'max_length' => 100,
        'pattern' => '/^[a-zA-Z\s\-\'\.]+$/',
        'message' => 'First name must be 2-100 characters and contain only letters, spaces, hyphens, apostrophes, and periods'
    ],
    'last_name' => [
        'required' => true,
        'min_length' => 2,
        'max_length' => 100,
        'pattern' => '/^[a-zA-Z\s\-\'\.]+$/',
        'message' => 'Last name must be 2-100 characters and contain only letters, spaces, hyphens, apostrophes, and periods'
    ],
    'email' => [
        'required' => true,
        'max_length' => 255,
        'email' => true,
        'message' => 'Please provide a valid email address'
    ],
    'terms_agreement' => [
        'required' => true,
        'boolean' => true,
        'must_be_true' => true,
        'message' => 'You must agree to the Terms of Service and Privacy Policy'
    ]
];

// Validate required fields and format
$errors = [];
$validatedData = [];

foreach ($validation as $field => $rules) {
    $value = isset($input[$field]) ? trim($input[$field]) : null;
    
    // Check if field is required
    if ($rules['required'] && (empty($value) && $value !== '0' && $value !== false)) {
        $errors[$field] = $rules['message'];
        continue;
    }
    
    // Skip validation if field is empty and not required
    if (empty($value) && !$rules['required']) {
        continue;
    }
    
    // Length validation
    if (isset($rules['min_length']) && strlen($value) < $rules['min_length']) {
        $errors[$field] = $rules['message'];
        continue;
    }
    
    if (isset($rules['max_length']) && strlen($value) > $rules['max_length']) {
        $errors[$field] = $rules['message'];
        continue;
    }
    
    // Pattern validation
    if (isset($rules['pattern']) && !preg_match($rules['pattern'], $value)) {
        $errors[$field] = $rules['message'];
        continue;
    }
    
    // Email validation
    if (isset($rules['email']) && !filter_var($value, FILTER_VALIDATE_EMAIL)) {
        $errors[$field] = $rules['message'];
        continue;
    }
    
    // Boolean validation
    if (isset($rules['boolean'])) {
        if (!is_bool($value) && !in_array($value, [0, 1, '0', '1', 'true', 'false'], true)) {
            $errors[$field] = $rules['message'];
            continue;
        }
        $value = (bool)$value;
    }
    
    // Must be true validation
    if (isset($rules['must_be_true']) && !$value) {
        $errors[$field] = $rules['message'];
        continue;
    }
    
    $validatedData[$field] = $value;
}

// Return validation errors if any
if (!empty($errors)) {
    ApiResponse::badRequest('Validation failed', [
        'errors' => $errors,
        'received_data' => array_keys($input)
    ]);
}

// Additional security checks
$clientIp = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
$userAgent = $_SERVER['HTTP_USER_AGENT'] ?? 'unknown';
$email = strtolower($validatedData['email']);

// Check for suspicious patterns
$suspiciousPatterns = [
    '/script/i',
    '/javascript/i',
    '/vbscript/i',
    '/onload/i',
    '/onerror/i',
    '/<.*>/i'
];

foreach ($validatedData as $field => $value) {
    if (is_string($value)) {
        foreach ($suspiciousPatterns as $pattern) {
            if (preg_match($pattern, $value)) {
                ErrorHandler::logMessage("Suspicious input detected in $field: $value", 'WARNING');
                ApiResponse::badRequest('Invalid input detected');
            }
        }
    }
}

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
    $verificationToken = bin2hex(random_bytes(32));
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