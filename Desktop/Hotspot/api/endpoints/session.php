<?php

/**
 * Session Management API Endpoint
 * Handles user session checking and management
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
require_once __DIR__ . '/../classes/UniFiController.php';
require_once __DIR__ . '/../config/database.php';

// Handle different HTTP methods
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        handleGetSession();
        break;
    case 'POST':
        handleCreateSession();
        break;
    case 'DELETE':
        handleDeleteSession();
        break;
    default:
        ApiResponse::methodNotAllowed('Only GET, POST, and DELETE requests are allowed');
}

/**
 * Handle GET request - check session status
 */
function handleGetSession() {
    try {
        $db = getDatabase();
        
        if (!$db->isConnected()) {
            throw new Exception('Database connection failed');
        }
        
        // Get session identifier (email or MAC address)
        $email = $_GET['email'] ?? null;
        $macAddress = $_GET['mac'] ?? null;
        
        if (!$email && !$macAddress) {
            ApiResponse::badRequest('Email or MAC address is required');
        }
        
        // Build query based on available identifiers
        if ($email && $macAddress) {
            $stmt = $db->prepare("
                SELECT s.*, u.email, u.first_name, u.last_name
                FROM sessions s
                JOIN users u ON s.user_id = u.id
                WHERE u.email = ? AND s.mac_address = ? AND s.status = 'active'
                ORDER BY s.created_at DESC
                LIMIT 1
            ");
            $stmt->execute([$email, $macAddress]);
        } elseif ($email) {
            $stmt = $db->prepare("
                SELECT s.*, u.email, u.first_name, u.last_name
                FROM sessions s
                JOIN users u ON s.user_id = u.id
                WHERE u.email = ? AND s.status = 'active'
                ORDER BY s.created_at DESC
                LIMIT 1
            ");
            $stmt->execute([$email]);
        } else {
            $stmt = $db->prepare("
                SELECT s.*, u.email, u.first_name, u.last_name
                FROM sessions s
                JOIN users u ON s.user_id = u.id
                WHERE s.mac_address = ? AND s.status = 'active'
                ORDER BY s.created_at DESC
                LIMIT 1
            ");
            $stmt->execute([$macAddress]);
        }
        
        $session = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$session) {
            ApiResponse::success([
                'session_active' => false,
                'message' => 'No active session found'
            ], 'Session check completed');
        }
        
        // Check if session has expired
        $now = new DateTime();
        $expiresAt = new DateTime($session['expires_at']);
        $isExpired = $now > $expiresAt;
        
        if ($isExpired) {
            // Mark session as expired
            $stmt = $db->prepare("UPDATE sessions SET status = 'expired', updated_at = NOW() WHERE id = ?");
            $stmt->execute([$session['id']]);
            
            ApiResponse::success([
                'session_active' => false,
                'session_expired' => true,
                'expired_at' => $session['expires_at'],
                'message' => 'Session has expired'
            ], 'Session expired');
        }
        
        // Calculate remaining time
        $remainingSeconds = $expiresAt->getTimestamp() - $now->getTimestamp();
        $remainingMinutes = floor($remainingSeconds / 60);
        
        ApiResponse::success([
            'session_active' => true,
            'session_id' => $session['id'],
            'email' => $session['email'],
            'mac_address' => $session['mac_address'],
            'authorized_at' => $session['authorized_at'],
            'expires_at' => $session['expires_at'],
            'remaining_minutes' => $remainingMinutes,
            'remaining_seconds' => $remainingSeconds,
            'user_info' => [
                'first_name' => $session['first_name'],
                'last_name' => $session['last_name']
            ]
        ], 'Active session found');
        
    } catch (PDOException $e) {
        ErrorHandler::logMessage("Database error during session check: " . $e->getMessage(), 'ERROR');
        ApiResponse::serverError('Database error occurred');
        
    } catch (Exception $e) {
        ErrorHandler::logMessage("Session check error: " . $e->getMessage(), 'ERROR');
        ApiResponse::serverError('Failed to check session status');
    }
}

/**
 * Handle POST request - create/authorize session
 */
function handleCreateSession() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !is_array($input)) {
            ApiResponse::badRequest('Invalid JSON data');
        }
        
        $email = $input['email'] ?? null;
        $macAddress = $input['mac_address'] ?? null;
        
        if (!$email || !$macAddress) {
            ApiResponse::badRequest('Email and MAC address are required');
        }
        
        // Validate MAC address format
        if (!preg_match('/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/', $macAddress)) {
            ApiResponse::badRequest('Invalid MAC address format');
        }
        
        $db = getDatabase();
        
        // Find user by email
        $stmt = $db->prepare("SELECT id, email_verified FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$user) {
            ApiResponse::notFound('User not found');
        }
        
        if (!$user['email_verified']) {
            ApiResponse::badRequest('Email not verified');
        }
        
        // Check for existing active session
        $stmt = $db->prepare("
            SELECT id FROM sessions 
            WHERE user_id = ? AND mac_address = ? AND status = 'active' AND expires_at > NOW()
        ");
        $stmt->execute([$user['id'], $macAddress]);
        $existingSession = $stmt->fetch();
        
        if ($existingSession) {
            ApiResponse::conflict('Active session already exists for this user and device');
        }
        
        // Authorize guest with UniFi Controller
        $unifiController = new UniFiController();
        $authResult = $unifiController->authorizeGuest($macAddress);
        
        if (!$authResult['success']) {
            ApiResponse::serverError('Network authorization failed: ' . $authResult['error']);
        }
        
        // Create session record
        $stmt = $db->prepare("
            INSERT INTO sessions (user_id, mac_address, authorized_at, expires_at, status, created_at, updated_at)
            VALUES (?, ?, NOW(), ?, 'active', NOW(), NOW())
        ");
        $stmt->execute([
            $user['id'],
            $macAddress,
            $authResult['expires_at']
        ]);
        
        $sessionId = $db->lastInsertId();
        
        ErrorHandler::logMessage("Session created for $email (MAC: $macAddress, Session ID: $sessionId)", 'INFO');
        
        ApiResponse::success([
            'session_created' => true,
            'session_id' => $sessionId,
            'email' => $email,
            'mac_address' => $macAddress,
            'expires_at' => $authResult['expires_at'],
            'session_timeout' => $authResult['session_timeout'],
            'network_access' => $authResult
        ], 'Session created and network access granted');
        
    } catch (PDOException $e) {
        ErrorHandler::logMessage("Database error during session creation: " . $e->getMessage(), 'ERROR');
        ApiResponse::serverError('Database error occurred');
        
    } catch (Exception $e) {
        ErrorHandler::logMessage("Session creation error: " . $e->getMessage(), 'ERROR');
        ApiResponse::serverError('Failed to create session');
    }
}

/**
 * Handle DELETE request - terminate session
 */
function handleDeleteSession() {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input || !is_array($input)) {
            ApiResponse::badRequest('Invalid JSON data');
        }
        
        $sessionId = $input['session_id'] ?? null;
        $email = $input['email'] ?? null;
        $macAddress = $input['mac_address'] ?? null;
        
        if (!$sessionId && !($email && $macAddress)) {
            ApiResponse::badRequest('Session ID or email and MAC address are required');
        }
        
        $db = getDatabase();
        
        // Find session
        if ($sessionId) {
            $stmt = $db->prepare("
                SELECT s.*, u.email 
                FROM sessions s
                JOIN users u ON s.user_id = u.id
                WHERE s.id = ? AND s.status = 'active'
            ");
            $stmt->execute([$sessionId]);
        } else {
            $stmt = $db->prepare("
                SELECT s.*, u.email
                FROM sessions s
                JOIN users u ON s.user_id = u.id
                WHERE u.email = ? AND s.mac_address = ? AND s.status = 'active'
                ORDER BY s.created_at DESC
                LIMIT 1
            ");
            $stmt->execute([$email, $macAddress]);
        }
        
        $session = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$session) {
            ApiResponse::notFound('Active session not found');
        }
        
        // Unauthorize guest with UniFi Controller
        $unifiController = new UniFiController();
        $unauthResult = $unifiController->unauthorizeGuest($session['mac_address']);
        
        // Mark session as terminated regardless of UniFi result
        $stmt = $db->prepare("UPDATE sessions SET status = 'terminated', updated_at = NOW() WHERE id = ?");
        $stmt->execute([$session['id']]);
        
        ErrorHandler::logMessage("Session terminated for {$session['email']} (MAC: {$session['mac_address']})", 'INFO');
        
        ApiResponse::success([
            'session_terminated' => true,
            'session_id' => $session['id'],
            'email' => $session['email'],
            'mac_address' => $session['mac_address'],
            'terminated_at' => date('Y-m-d H:i:s'),
            'network_revoked' => $unauthResult['success']
        ], 'Session terminated');
        
    } catch (PDOException $e) {
        ErrorHandler::logMessage("Database error during session termination: " . $e->getMessage(), 'ERROR');
        ApiResponse::serverError('Database error occurred');
        
    } catch (Exception $e) {
        ErrorHandler::logMessage("Session termination error: " . $e->getMessage(), 'ERROR');
        ApiResponse::serverError('Failed to terminate session');
    }
}

?> 