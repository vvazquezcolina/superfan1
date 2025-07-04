<?php

/**
 * User Statistics API Endpoint
 * Provides statistics and metrics for the admin dashboard
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

// Only allow GET requests
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
$rateLimitKey = 'stats_' . ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR']);
$rateLimitFile = __DIR__ . '/../temp/rate_limit_' . md5($rateLimitKey) . '.txt';
$rateLimitMax = 60; // Max 60 requests per minute
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
    
    // Get date range from query parameters
    $dateRange = null;
    if (!empty($_GET['date_from']) || !empty($_GET['date_to'])) {
        $dateRange = [];
        if (!empty($_GET['date_from'])) {
            $dateRange['from'] = $_GET['date_from'];
        }
        if (!empty($_GET['date_to'])) {
            $dateRange['to'] = $_GET['date_to'];
        }
    }
    
    // Get statistics
    $result = $userManager->getUserStatistics($dateRange);
    
    if ($result['success']) {
        // Add additional calculated metrics
        $stats = $result['statistics'];
        
        // Calculate percentage metrics
        if ($stats['total_users'] > 0) {
            $stats['verification_percentage'] = round(($stats['verified_users'] / $stats['total_users']) * 100, 2);
            $stats['unverified_percentage'] = round(($stats['unverified_users'] / $stats['total_users']) * 100, 2);
        } else {
            $stats['verification_percentage'] = 0;
            $stats['unverified_percentage'] = 0;
        }
        
        // Calculate session utilization
        if ($stats['verified_users'] > 0) {
            $stats['session_utilization'] = round(($stats['active_sessions'] / $stats['verified_users']) * 100, 2);
        } else {
            $stats['session_utilization'] = 0;
        }
        
        // Add trend indicators for last 7 days vs previous 7 days
        $trendStats = calculateTrends($userManager);
        if ($trendStats['success']) {
            $stats['trends'] = $trendStats['trends'];
        }
        
        ApiResponse::success($stats, 'Statistics loaded successfully');
    } else {
        ApiResponse::error($result['error'], 500);
    }
    
} catch (Exception $e) {
    ErrorHandler::logMessage("Statistics error: " . $e->getMessage(), 'ERROR');
    ApiResponse::error('Failed to load statistics', 500);
}

/**
 * Calculate trend indicators
 */
function calculateTrends($userManager) {
    try {
        $db = getDatabase();
        
        // Get registrations for last 7 days
        $stmt = $db->prepare("
            SELECT COUNT(*) as count 
            FROM users 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
            AND deleted_at IS NULL
        ");
        $stmt->execute();
        $last7Days = (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Get registrations for previous 7 days (8-14 days ago)
        $stmt = $db->prepare("
            SELECT COUNT(*) as count 
            FROM users 
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 14 DAY) 
            AND created_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
            AND deleted_at IS NULL
        ");
        $stmt->execute();
        $previous7Days = (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        // Calculate percentage change
        $registrationTrend = 0;
        if ($previous7Days > 0) {
            $registrationTrend = round((($last7Days - $previous7Days) / $previous7Days) * 100, 2);
        } elseif ($last7Days > 0) {
            $registrationTrend = 100; // 100% increase from 0
        }
        
        // Get verification trend
        $stmt = $db->prepare("
            SELECT COUNT(*) as count 
            FROM users 
            WHERE verified_at >= DATE_SUB(NOW(), INTERVAL 7 DAY) 
            AND deleted_at IS NULL
        ");
        $stmt->execute();
        $verifiedLast7Days = (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        $stmt = $db->prepare("
            SELECT COUNT(*) as count 
            FROM users 
            WHERE verified_at >= DATE_SUB(NOW(), INTERVAL 14 DAY) 
            AND verified_at < DATE_SUB(NOW(), INTERVAL 7 DAY)
            AND deleted_at IS NULL
        ");
        $stmt->execute();
        $verifiedPrevious7Days = (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
        
        $verificationTrend = 0;
        if ($verifiedPrevious7Days > 0) {
            $verificationTrend = round((($verifiedLast7Days - $verifiedPrevious7Days) / $verifiedPrevious7Days) * 100, 2);
        } elseif ($verifiedLast7Days > 0) {
            $verificationTrend = 100;
        }
        
        return [
            'success' => true,
            'trends' => [
                'registration_trend' => $registrationTrend,
                'verification_trend' => $verificationTrend,
                'registrations_last_7_days' => $last7Days,
                'registrations_previous_7_days' => $previous7Days,
                'verifications_last_7_days' => $verifiedLast7Days,
                'verifications_previous_7_days' => $verifiedPrevious7Days
            ]
        ];
        
    } catch (Exception $e) {
        ErrorHandler::logMessage("Trend calculation error: " . $e->getMessage(), 'ERROR');
        return [
            'success' => false,
            'error' => 'Failed to calculate trends'
        ];
    }
}

?> 