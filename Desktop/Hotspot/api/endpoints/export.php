<?php

/**
 * Data Export API Endpoint
 * Handles CSV and Excel export of user data with filtering
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Load required classes
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../classes/Database.php';
require_once __DIR__ . '/../classes/UserManager.php';
require_once __DIR__ . '/../classes/ApiResponse.php';
require_once __DIR__ . '/../classes/ErrorHandler.php';

// Rate limiting
$rateLimitKey = 'export_' . ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR']);
$rateLimitFile = __DIR__ . '/../temp/rate_limit_' . md5($rateLimitKey) . '.txt';
$rateLimitMax = 5; // Max 5 exports per hour
$rateLimitPeriod = 3600; // 1 hour

// Check rate limit
if (file_exists($rateLimitFile)) {
    $rateLimitData = json_decode(file_get_contents($rateLimitFile), true);
    $currentTime = time();
    
    // Clean old requests
    $rateLimitData = array_filter($rateLimitData, function($timestamp) use ($currentTime, $rateLimitPeriod) {
        return ($currentTime - $timestamp) < $rateLimitPeriod;
    });
    
    if (count($rateLimitData) >= $rateLimitMax) {
        ApiResponse::error('Rate limit exceeded. Max ' . $rateLimitMax . ' exports per hour.', 429);
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
    
    // Get request parameters
    $format = $_GET['format'] ?? 'csv'; // csv or excel
    $filters = [];
    
    // Extract filters from query parameters
    if (!empty($_GET['email'])) {
        $filters['email'] = $_GET['email'];
    }
    
    if (!empty($_GET['name'])) {
        $filters['name'] = $_GET['name'];
    }
    
    if (isset($_GET['verified'])) {
        $filters['verified'] = $_GET['verified'] === '1' || $_GET['verified'] === 'true';
    }
    
    if (!empty($_GET['date_from'])) {
        $filters['date_from'] = $_GET['date_from'];
    }
    
    if (!empty($_GET['date_to'])) {
        $filters['date_to'] = $_GET['date_to'];
    }
    
    if (!empty($_GET['ip'])) {
        $filters['ip'] = $_GET['ip'];
    }
    
    if (isset($_GET['include_deleted'])) {
        $filters['include_deleted'] = $_GET['include_deleted'] === '1' || $_GET['include_deleted'] === 'true';
    }
    
    // Get export data
    $exportResult = $userManager->exportUsers($filters);
    
    if (!$exportResult['success']) {
        ApiResponse::error($exportResult['error'], 500);
    }
    
    $data = $exportResult['data'];
    $filename = 'hotspot_users_' . date('Y-m-d_H-i-s');
    
    // Generate appropriate format
    switch (strtolower($format)) {
        case 'csv':
            generateCSV($data, $filename);
            break;
            
        case 'excel':
        case 'xlsx':
            generateExcel($data, $filename);
            break;
            
        default:
            ApiResponse::error('Invalid format. Supported formats: csv, excel', 400);
    }
    
} catch (Exception $e) {
    ErrorHandler::logMessage("Export error: " . $e->getMessage(), 'ERROR');
    ApiResponse::error('Export failed', 500);
}

/**
 * Generate CSV file
 */
function generateCSV($data, $filename) {
    // Set headers for CSV download
    header('Content-Type: text/csv; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '.csv"');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Expires: 0');
    
    // Create output stream
    $output = fopen('php://output', 'w');
    
    // Add BOM for UTF-8 Excel compatibility
    fprintf($output, chr(0xEF).chr(0xBB).chr(0xBF));
    
    if (!empty($data)) {
        // Write header row
        fputcsv($output, array_keys($data[0]));
        
        // Write data rows
        foreach ($data as $row) {
            fputcsv($output, $row);
        }
    } else {
        // Write empty header if no data
        fputcsv($output, ['No data found']);
    }
    
    fclose($output);
    exit();
}

/**
 * Generate Excel file (simplified HTML table format)
 */
function generateExcel($data, $filename) {
    // Set headers for Excel download
    header('Content-Type: application/vnd.ms-excel; charset=utf-8');
    header('Content-Disposition: attachment; filename="' . $filename . '.xls"');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Expires: 0');
    
    // Start HTML table
    echo '<html><head><meta charset="UTF-8"></head><body>';
    echo '<table border="1">';
    
    if (!empty($data)) {
        // Write header row
        echo '<tr>';
        foreach (array_keys($data[0]) as $header) {
            echo '<th>' . htmlspecialchars($header) . '</th>';
        }
        echo '</tr>';
        
        // Write data rows
        foreach ($data as $row) {
            echo '<tr>';
            foreach ($row as $cell) {
                echo '<td>' . htmlspecialchars($cell) . '</td>';
            }
            echo '</tr>';
        }
    } else {
        echo '<tr><td>No data found</td></tr>';
    }
    
    echo '</table>';
    echo '</body></html>';
    exit();
}

/**
 * Generate advanced Excel file using simple XML format
 */
function generateAdvancedExcel($data, $filename) {
    // Set headers for Excel download
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment; filename="' . $filename . '.xlsx"');
    header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
    header('Expires: 0');
    
    // Simple XML-based Excel format
    $xml = '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
    $xml .= '<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"' . "\n";
    $xml .= '    xmlns:o="urn:schemas-microsoft-com:office:office"' . "\n";
    $xml .= '    xmlns:x="urn:schemas-microsoft-com:office:excel"' . "\n";
    $xml .= '    xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"' . "\n";
    $xml .= '    xmlns:html="http://www.w3.org/TR/REC-html40">' . "\n";
    $xml .= '<Worksheet ss:Name="Users">' . "\n";
    $xml .= '<Table>' . "\n";
    
    if (!empty($data)) {
        // Header row
        $xml .= '<Row>' . "\n";
        foreach (array_keys($data[0]) as $header) {
            $xml .= '<Cell><Data ss:Type="String">' . htmlspecialchars($header) . '</Data></Cell>' . "\n";
        }
        $xml .= '</Row>' . "\n";
        
        // Data rows
        foreach ($data as $row) {
            $xml .= '<Row>' . "\n";
            foreach ($row as $cell) {
                $type = is_numeric($cell) ? 'Number' : 'String';
                $xml .= '<Cell><Data ss:Type="' . $type . '">' . htmlspecialchars($cell) . '</Data></Cell>' . "\n";
            }
            $xml .= '</Row>' . "\n";
        }
    } else {
        $xml .= '<Row><Cell><Data ss:Type="String">No data found</Data></Cell></Row>' . "\n";
    }
    
    $xml .= '</Table>' . "\n";
    $xml .= '</Worksheet>' . "\n";
    $xml .= '</Workbook>';
    
    echo $xml;
    exit();
}

?> 