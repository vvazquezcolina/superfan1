<?php

/**
 * Users API Endpoint
 * Handles user listing, filtering, and pagination for the admin dashboard
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow GET requests for now
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit();
}

// Load required classes
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../classes/Database.php';
require_once __DIR__ . '/../classes/UserManager.php';
require_once __DIR__ . '/../classes/ApiResponse.php';
require_once __DIR__ . '/../classes/ErrorHandler.php';

// Rate limiting
$rateLimitKey = 'users_' . ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR']);
$rateLimitFile = __DIR__ . '/../temp/rate_limit_' . md5($rateLimitKey) . '.txt';
$rateLimitMax = 100; // Max 100 requests per minute
$rateLimitPeriod = 60; // 1 minute

// Check rate limit
if (file_exists($rateLimitFile)) {
    $rateLimitData = json_decode(file_get_contents($rateLimitFile), true);
    $currentTime = time();
    
    // Clean old requests
    $rateLimitData = array_filter($rateLimitData, function($timestamp) use ($currentTime, $rateLimitPeriod) {
        return ($currentTime - $timestamp) < $rateLimitPeriod;
    });
    
    if (count($rateLimitData) >= $rateLimitMax) {
        ApiResponse::error('Rate limit exceeded. Max ' . $rateLimitMax . ' requests per minute.', 429);
    }
    
    $rateLimitData[] = $currentTime;
    file_put_contents($rateLimitFile, json_encode($rateLimitData));
} else {
    // Create temp directory if it doesn't exist
    if (!is_dir(__DIR__ . '/../temp')) {
        mkdir(__DIR__ . '/../temp', 0755, true);
    }
    file_put_contents($rateLimitFile, json_encode([time()]));
}

try {
    // Initialize UserManager
    $userManager = new UserManager();
    
    // Extract filters from query parameters
    $filters = [];
    
    // Text filters
    if (!empty($_GET['email'])) {
        $filters['email'] = trim($_GET['email']);
    }
    
    if (!empty($_GET['name'])) {
        $filters['name'] = trim($_GET['name']);
    }
    
    if (!empty($_GET['ip'])) {
        $filters['ip'] = trim($_GET['ip']);
    }
    
    // Boolean filters
    if (isset($_GET['verified'])) {
        $verifiedValue = $_GET['verified'];
        if ($verifiedValue === '1' || $verifiedValue === 'true') {
            $filters['verified'] = true;
        } elseif ($verifiedValue === '0' || $verifiedValue === 'false') {
            $filters['verified'] = false;
        }
    }
    
    if (isset($_GET['include_deleted'])) {
        $filters['include_deleted'] = $_GET['include_deleted'] === '1' || $_GET['include_deleted'] === 'true';
    }
    
    // Date range filters
    if (!empty($_GET['date_from'])) {
        $dateFrom = $_GET['date_from'];
        if (validateDate($dateFrom)) {
            $filters['date_from'] = $dateFrom;
        }
    }
    
    if (!empty($_GET['date_to'])) {
        $dateTo = $_GET['date_to'];
        if (validateDate($dateTo)) {
            $filters['date_to'] = $dateTo;
        }
    }
    
    // Pagination parameters
    $pagination = [];
    
    // Page number
    if (isset($_GET['page'])) {
        $page = (int)$_GET['page'];
        if ($page > 0) {
            $pagination['page'] = $page;
        }
    }
    
    // Results per page
    if (isset($_GET['limit'])) {
        $limit = (int)$_GET['limit'];
        if ($limit > 0 && $limit <= 100) { // Max 100 per page
            $pagination['limit'] = $limit;
        }
    }
    
    // Sorting parameters
    if (!empty($_GET['sort'])) {
        $allowedSortFields = ['id', 'first_name', 'last_name', 'email', 'created_at', 'verified_at', 'email_verified'];
        if (in_array($_GET['sort'], $allowedSortFields)) {
            $pagination['sort'] = $_GET['sort'];
        }
    }
    
    if (!empty($_GET['order'])) {
        $order = strtoupper($_GET['order']);
        if (in_array($order, ['ASC', 'DESC'])) {
            $pagination['order'] = $order;
        }
    }
    
    // Get users with filters and pagination
    $result = $userManager->getUsers($filters, $pagination);
    
    if ($result['success']) {
        // Add additional metadata
        $response = [
            'success' => true,
            'users' => $result['users'],
            'pagination' => $result['pagination'],
            'filters' => $result['filters'],
            'total_count' => $result['pagination']['total'],
            'loaded_at' => date('Y-m-d H:i:s')
        ];
        
        // Add summary statistics for current filter
        $summary = generateSummary($result['users']);
        $response['summary'] = $summary;
        
        ApiResponse::success($response, 'Users loaded successfully');
    } else {
        ApiResponse::error($result['error'], 500);
    }
    
} catch (Exception $e) {
    ErrorHandler::logMessage("Users endpoint error: " . $e->getMessage(), 'ERROR');
    ApiResponse::error('Failed to load users', 500);
}

/**
 * Validate date format
 */
function validateDate($date) {
    $d = DateTime::createFromFormat('Y-m-d', $date);
    return $d && $d->format('Y-m-d') === $date;
}

/**
 * Generate summary statistics for current result set
 */
function generateSummary($users) {
    $summary = [
        'total_displayed' => count($users),
        'verified_count' => 0,
        'unverified_count' => 0,
        'terms_agreed_count' => 0,
        'unique_ips' => [],
        'recent_registrations' => 0, // Last 24 hours
        'recent_verifications' => 0  // Last 24 hours
    ];
    
    $yesterday = date('Y-m-d H:i:s', strtotime('-24 hours'));
    
    foreach ($users as $user) {
        // Count verified status
        if ($user['email_verified']) {
            $summary['verified_count']++;
        } else {
            $summary['unverified_count']++;
        }
        
        // Count terms agreement
        if ($user['terms_agreement']) {
            $summary['terms_agreed_count']++;
        }
        
        // Collect unique IPs
        if (!empty($user['client_ip'])) {
            $summary['unique_ips'][] = $user['client_ip'];
        }
        
        // Count recent registrations
        if ($user['created_at'] >= $yesterday) {
            $summary['recent_registrations']++;
        }
        
        // Count recent verifications
        if (!empty($user['verified_at']) && $user['verified_at'] >= $yesterday) {
            $summary['recent_verifications']++;
        }
    }
    
    // Calculate unique IPs
    $summary['unique_ips'] = count(array_unique($summary['unique_ips']));
    
    // Calculate percentages
    if ($summary['total_displayed'] > 0) {
        $summary['verification_rate'] = round(($summary['verified_count'] / $summary['total_displayed']) * 100, 2);
        $summary['terms_agreement_rate'] = round(($summary['terms_agreed_count'] / $summary['total_displayed']) * 100, 2);
    } else {
        $summary['verification_rate'] = 0;
        $summary['terms_agreement_rate'] = 0;
    }
    
    return $summary;
}

?> 