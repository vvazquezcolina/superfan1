#!/usr/bin/env php
<?php

/**
 * Data Retention Cleanup CLI Script
 * Automates data cleanup and retention policies
 * 
 * Usage:
 *   php cleanup.php [options]
 * 
 * Options:
 *   --dry-run          Preview what would be deleted without actually deleting
 *   --force            Skip confirmation prompts
 *   --stats            Show retention statistics only
 *   --config           Show current retention configuration
 *   --help             Show this help message
 *   --quiet            Run silently (no output except errors)
 *   --verbose          Show detailed output
 */

// Ensure this is run from command line
if (php_sapi_name() !== 'cli') {
    die('This script can only be run from the command line.');
}

// Set error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Load required classes
require_once __DIR__ . '/../api/config/database.php';
require_once __DIR__ . '/../api/classes/Database.php';
require_once __DIR__ . '/../api/classes/UserManager.php';
require_once __DIR__ . '/../api/classes/DataRetentionManager.php';
require_once __DIR__ . '/../api/classes/ErrorHandler.php';

// Parse command line arguments
$options = getopt('', [
    'dry-run',
    'force',
    'stats',
    'config',
    'help',
    'quiet',
    'verbose'
]);

$dryRun = isset($options['dry-run']);
$force = isset($options['force']);
$showStats = isset($options['stats']);
$showConfig = isset($options['config']);
$showHelp = isset($options['help']);
$quiet = isset($options['quiet']);
$verbose = isset($options['verbose']);

// Show help
if ($showHelp) {
    showHelp();
    exit(0);
}

// Initialize
try {
    $retentionManager = new DataRetentionManager();
    
    // Show configuration
    if ($showConfig) {
        showConfiguration($retentionManager);
        exit(0);
    }
    
    // Show statistics
    if ($showStats) {
        showStatistics($retentionManager);
        exit(0);
    }
    
    // Run cleanup
    runCleanup($retentionManager, $dryRun, $force, $quiet, $verbose);
    
} catch (Exception $e) {
    logMessage("FATAL ERROR: " . $e->getMessage(), 'ERROR');
    exit(1);
}

/**
 * Show help message
 */
function showHelp() {
    echo "\n";
    echo "Data Retention Cleanup Script\n";
    echo "=============================\n\n";
    echo "Usage: php cleanup.php [options]\n\n";
    echo "Options:\n";
    echo "  --dry-run     Preview what would be deleted without actually deleting\n";
    echo "  --force       Skip confirmation prompts (use with caution)\n";
    echo "  --stats       Show retention statistics only\n";
    echo "  --config      Show current retention configuration\n";
    echo "  --help        Show this help message\n";
    echo "  --quiet       Run silently (no output except errors)\n";
    echo "  --verbose     Show detailed output\n\n";
    echo "Examples:\n";
    echo "  php cleanup.php --dry-run     # Preview cleanup without deleting\n";
    echo "  php cleanup.php --stats       # Show cleanup statistics\n";
    echo "  php cleanup.php --force       # Run cleanup without confirmation\n";
    echo "  php cleanup.php --verbose     # Run with detailed output\n\n";
    echo "Note: This script should be run regularly via cron job for automated cleanup.\n";
    echo "Recommended cron schedule: 0 2 * * * (daily at 2 AM)\n\n";
}

/**
 * Show current configuration
 */
function showConfiguration($retentionManager) {
    logMessage("Current Data Retention Configuration", 'INFO');
    logMessage(str_repeat('=', 50), 'INFO');
    
    $stats = $retentionManager->getRetentionStatistics();
    if ($stats['success']) {
        $config = $stats['statistics']['config'];
        
        logMessage("Retention Periods:", 'INFO');
        logMessage("  Unverified users: {$config['unverified_user_retention']} days", 'INFO');
        logMessage("  Inactive sessions: {$config['inactive_session_retention']} days", 'INFO');
        logMessage("  Deleted users: {$config['deleted_user_retention']} days", 'INFO');
        logMessage("  Rate limit files: {$config['rate_limit_cleanup']} days", 'INFO');
        logMessage("  Backup files: {$config['backup_retention']} days", 'INFO');
        
        logMessage("\nArchive Settings:", 'INFO');
        logMessage("  Archive enabled: " . ($config['archive_enabled'] ? 'Yes' : 'No'), 'INFO');
        logMessage("  Archive before delete: " . ($config['archive_before_delete'] ? 'Yes' : 'No'), 'INFO');
        logMessage("  Archive path: {$config['archive_path']}", 'INFO');
        
        logMessage("\nSafety Settings:", 'INFO');
        logMessage("  Batch size: {$config['batch_size']} records", 'INFO');
        logMessage("  Max execution time: {$config['max_execution_time']} seconds", 'INFO');
        logMessage("  Max delete per run: {$config['max_delete_per_run']} records", 'INFO');
        logMessage("  Preserve recent data: " . ($config['preserve_recent_data'] ? 'Yes' : 'No'), 'INFO');
    } else {
        logMessage("Failed to load configuration: " . $stats['error'], 'ERROR');
    }
}

/**
 * Show retention statistics
 */
function showStatistics($retentionManager) {
    logMessage("Data Retention Statistics", 'INFO');
    logMessage(str_repeat('=', 50), 'INFO');
    
    $stats = $retentionManager->getRetentionStatistics();
    if ($stats['success']) {
        $data = $stats['statistics'];
        
        logMessage("Records Eligible for Cleanup:", 'INFO');
        logMessage("  Unverified users: {$data['unverified_users_eligible']}", 'INFO');
        logMessage("  Inactive sessions: {$data['inactive_sessions_eligible']}", 'INFO');
        logMessage("  Deleted users: {$data['deleted_users_eligible']}", 'INFO');
        logMessage("  Rate limit files: {$data['rate_limit_files']}", 'INFO');
        logMessage("  Archive files: {$data['archive_files']}", 'INFO');
        
        $totalEligible = $data['unverified_users_eligible'] + $data['inactive_sessions_eligible'] + $data['deleted_users_eligible'];
        logMessage("\nTotal database records eligible: $totalEligible", 'INFO');
        logMessage("Generated at: {$data['generated_at']}", 'INFO');
    } else {
        logMessage("Failed to load statistics: " . $stats['error'], 'ERROR');
    }
}

/**
 * Run cleanup process
 */
function runCleanup($retentionManager, $dryRun, $force, $quiet, $verbose) {
    if (!$quiet) {
        logMessage("Starting Data Retention Cleanup", 'INFO');
        logMessage(str_repeat('=', 50), 'INFO');
        
        if ($dryRun) {
            logMessage("DRY RUN MODE - No data will be deleted", 'WARNING');
        }
    }
    
    // Show what would be cleaned up
    if (!$quiet) {
        $stats = $retentionManager->getRetentionStatistics();
        if ($stats['success']) {
            $data = $stats['statistics'];
            $totalEligible = $data['unverified_users_eligible'] + $data['inactive_sessions_eligible'] + $data['deleted_users_eligible'];
            
            if ($totalEligible > 0) {
                logMessage("Records that will be processed:", 'INFO');
                if ($data['unverified_users_eligible'] > 0) {
                    logMessage("  Unverified users: {$data['unverified_users_eligible']}", 'INFO');
                }
                if ($data['inactive_sessions_eligible'] > 0) {
                    logMessage("  Inactive sessions: {$data['inactive_sessions_eligible']}", 'INFO');
                }
                if ($data['deleted_users_eligible'] > 0) {
                    logMessage("  Deleted users: {$data['deleted_users_eligible']}", 'INFO');
                }
                
                // Confirmation prompt
                if (!$force && !$dryRun) {
                    echo "\nThis will permanently delete $totalEligible records. Continue? (y/N): ";
                    $handle = fopen("php://stdin", "r");
                    $line = fgets($handle);
                    fclose($handle);
                    
                    if (trim(strtolower($line)) !== 'y') {
                        logMessage("Cleanup cancelled by user.", 'INFO');
                        exit(0);
                    }
                }
            } else {
                logMessage("No records eligible for cleanup at this time.", 'INFO');
                exit(0);
            }
        }
    }
    
    // Run the cleanup
    $result = $retentionManager->runCleanup($dryRun);
    
    if (!$quiet) {
        logMessage("\nCleanup Results:", 'INFO');
        logMessage("  Success: " . ($result['success'] ? 'Yes' : 'No'), $result['success'] ? 'SUCCESS' : 'ERROR');
        logMessage("  Total deleted: {$result['total_deleted']}", 'INFO');
        logMessage("  Total archived: {$result['total_archived']}", 'INFO');
        logMessage("  Duration: {$result['duration']} seconds", 'INFO');
        
        if ($verbose && !empty($result['operations'])) {
            logMessage("\nDetailed Results:", 'INFO');
            foreach ($result['operations'] as $operation => $opResult) {
                logMessage("  $operation:", 'INFO');
                if (isset($opResult['deleted'])) {
                    logMessage("    Deleted: {$opResult['deleted']}", 'INFO');
                }
                if (isset($opResult['archived'])) {
                    logMessage("    Archived: {$opResult['archived']}", 'INFO');
                }
                if (!empty($opResult['errors'])) {
                    logMessage("    Errors: " . count($opResult['errors']), 'WARNING');
                    if ($verbose) {
                        foreach ($opResult['errors'] as $error) {
                            logMessage("      - $error", 'ERROR');
                        }
                    }
                }
            }
        }
        
        if (!empty($result['errors'])) {
            logMessage("\nErrors encountered:", 'ERROR');
            foreach ($result['errors'] as $error) {
                logMessage("  - $error", 'ERROR');
            }
        }
    }
    
    // Exit with appropriate code
    exit($result['success'] ? 0 : 1);
}

/**
 * Log message with timestamp and level
 */
function logMessage($message, $level = 'INFO') {
    global $quiet;
    
    if ($quiet && $level !== 'ERROR') {
        return;
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $colors = [
        'INFO' => "\033[36m",      // Cyan
        'SUCCESS' => "\033[32m",   // Green
        'WARNING' => "\033[33m",   // Yellow
        'ERROR' => "\033[31m",     // Red
    ];
    $reset = "\033[0m";
    
    $color = $colors[$level] ?? '';
    echo "{$color}[$timestamp] [$level] $message{$reset}\n";
    
    // Also log to error handler for persistence
    if (class_exists('ErrorHandler')) {
        ErrorHandler::logMessage($message, $level);
    }
}

?> 