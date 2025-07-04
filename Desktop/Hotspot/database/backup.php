#!/usr/bin/env php
<?php

/**
 * Database Backup and Recovery Script
 * Provides comprehensive backup and recovery procedures for the hotspot portal
 * 
 * Usage:
 *   php backup.php [action] [options]
 * 
 * Actions:
 *   backup     Create a new backup
 *   restore    Restore from a backup file
 *   list       List available backups
 *   verify     Verify backup integrity
 *   cleanup    Clean up old backups
 * 
 * Options:
 *   --file=NAME        Specific backup file for restore/verify operations
 *   --compress         Compress backup files (gzip)
 *   --no-data          Backup structure only (no data)
 *   --tables=LIST      Backup specific tables only (comma-separated)
 *   --force            Skip confirmation prompts
 *   --quiet            Run silently
 *   --verbose          Show detailed output
 *   --retention=DAYS   Set backup retention period (default: 30)
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
require_once __DIR__ . '/../api/classes/ErrorHandler.php';

// Configuration
$backupDir = __DIR__ . '/../backups/';
$maxBackupSize = 100 * 1024 * 1024; // 100MB
$defaultRetention = 30; // days

// Parse command line arguments
$args = array_slice($argv, 1);
$action = $args[0] ?? 'backup';

$options = [];
foreach ($args as $arg) {
    if (strpos($arg, '--') === 0) {
        if (strpos($arg, '=') !== false) {
            list($key, $value) = explode('=', substr($arg, 2), 2);
            $options[$key] = $value;
        } else {
            $options[substr($arg, 2)] = true;
        }
    }
}

$compress = isset($options['compress']);
$noData = isset($options['no-data']);
$force = isset($options['force']);
$quiet = isset($options['quiet']);
$verbose = isset($options['verbose']);
$tables = isset($options['tables']) ? explode(',', $options['tables']) : null;
$retention = isset($options['retention']) ? (int)$options['retention'] : $defaultRetention;
$file = $options['file'] ?? null;

// Create backup directory if it doesn't exist
if (!is_dir($backupDir)) {
    mkdir($backupDir, 0755, true);
}

// Main execution
try {
    switch ($action) {
        case 'backup':
            createBackup($compress, $noData, $tables, $quiet, $verbose);
            break;
            
        case 'restore':
            if (!$file) {
                logMessage("Error: --file parameter required for restore operation", 'ERROR');
                exit(1);
            }
            restoreBackup($file, $force, $quiet, $verbose);
            break;
            
        case 'list':
            listBackups($verbose);
            break;
            
        case 'verify':
            if (!$file) {
                logMessage("Error: --file parameter required for verify operation", 'ERROR');
                exit(1);
            }
            verifyBackup($file, $verbose);
            break;
            
        case 'cleanup':
            cleanupOldBackups($retention, $force, $quiet, $verbose);
            break;
            
        case 'help':
        case '--help':
            showHelp();
            break;
            
        default:
            logMessage("Unknown action: $action. Use 'help' for usage information.", 'ERROR');
            exit(1);
    }
    
} catch (Exception $e) {
    logMessage("FATAL ERROR: " . $e->getMessage(), 'ERROR');
    exit(1);
}

/**
 * Create database backup
 */
function createBackup($compress, $noData, $tables, $quiet, $verbose) {
    global $backupDir, $maxBackupSize;
    
    if (!$quiet) {
        logMessage("Starting database backup...", 'INFO');
    }
    
    try {
        // Get database connection
        $db = getDatabase();
        $config = getDatabaseConfig();
        
        // Generate backup filename
        $timestamp = date('Y-m-d_H-i-s');
        $suffix = $compress ? '.sql.gz' : '.sql';
        $filename = "hotspot_backup_{$timestamp}{$suffix}";
        $filepath = $backupDir . $filename;
        
        // Build mysqldump command
        $command = buildMysqldumpCommand($config, $filepath, $compress, $noData, $tables);
        
        if ($verbose) {
            logMessage("Backup command: $command", 'INFO');
        }
        
        // Execute backup
        $output = [];
        $returnCode = 0;
        exec($command . ' 2>&1', $output, $returnCode);
        
        if ($returnCode !== 0) {
            logMessage("Backup failed: " . implode("\n", $output), 'ERROR');
            if (file_exists($filepath)) {
                unlink($filepath);
            }
            exit(1);
        }
        
        // Verify backup file
        if (!file_exists($filepath) || filesize($filepath) == 0) {
            logMessage("Backup file is empty or missing", 'ERROR');
            exit(1);
        }
        
        $fileSize = filesize($filepath);
        if ($fileSize > $maxBackupSize) {
            logMessage("Warning: Backup file is larger than expected ({$fileSize} bytes)", 'WARNING');
        }
        
        // Create backup metadata
        $metadata = [
            'filename' => $filename,
            'created_at' => date('Y-m-d H:i:s'),
            'size_bytes' => $fileSize,
            'size_human' => formatBytes($fileSize),
            'compressed' => $compress,
            'structure_only' => $noData,
            'tables' => $tables ?: 'all',
            'database' => $config['database'],
            'mysql_version' => getMysqlVersion($db),
            'php_version' => PHP_VERSION,
            'checksum' => hash_file('sha256', $filepath)
        ];
        
        $metadataFile = $backupDir . pathinfo($filename, PATHINFO_FILENAME) . '.json';
        file_put_contents($metadataFile, json_encode($metadata, JSON_PRETTY_PRINT));
        
        if (!$quiet) {
            logMessage("Backup completed successfully!", 'SUCCESS');
            logMessage("File: $filename", 'INFO');
            logMessage("Size: " . $metadata['size_human'], 'INFO');
            logMessage("Tables: " . (is_array($tables) ? implode(', ', $tables) : 'all'), 'INFO');
        }
        
        return $filepath;
        
    } catch (Exception $e) {
        logMessage("Backup failed: " . $e->getMessage(), 'ERROR');
        exit(1);
    }
}

/**
 * Restore database from backup
 */
function restoreBackup($file, $force, $quiet, $verbose) {
    global $backupDir;
    
    if (!$quiet) {
        logMessage("Starting database restore...", 'INFO');
    }
    
    // Locate backup file
    $filepath = findBackupFile($file);
    if (!$filepath) {
        logMessage("Backup file not found: $file", 'ERROR');
        exit(1);
    }
    
    // Load metadata if available
    $metadataFile = $backupDir . pathinfo($file, PATHINFO_FILENAME) . '.json';
    $metadata = null;
    if (file_exists($metadataFile)) {
        $metadata = json_decode(file_get_contents($metadataFile), true);
        
        if ($verbose && $metadata) {
            logMessage("Backup metadata:", 'INFO');
            logMessage("  Created: {$metadata['created_at']}", 'INFO');
            logMessage("  Size: {$metadata['size_human']}", 'INFO');
            logMessage("  Tables: {$metadata['tables']}", 'INFO');
            logMessage("  Database: {$metadata['database']}", 'INFO');
        }
    }
    
    // Verify backup integrity
    if ($metadata && isset($metadata['checksum'])) {
        $currentChecksum = hash_file('sha256', $filepath);
        if ($currentChecksum !== $metadata['checksum']) {
            logMessage("Warning: Backup file checksum mismatch. File may be corrupted.", 'WARNING');
            if (!$force) {
                logMessage("Use --force to proceed anyway.", 'INFO');
                exit(1);
            }
        }
    }
    
    // Confirmation prompt
    if (!$force) {
        echo "\nThis will COMPLETELY REPLACE the current database with the backup data.\n";
        echo "Current database will be PERMANENTLY LOST.\n";
        echo "Continue with restore? (y/N): ";
        
        $handle = fopen("php://stdin", "r");
        $line = fgets($handle);
        fclose($handle);
        
        if (trim(strtolower($line)) !== 'y') {
            logMessage("Restore cancelled by user.", 'INFO');
            exit(0);
        }
    }
    
    try {
        // Get database configuration
        $config = getDatabaseConfig();
        
        // Create pre-restore backup
        if (!$quiet) {
            logMessage("Creating pre-restore backup...", 'INFO');
        }
        
        $preRestoreFile = createBackup(true, false, null, true, false);
        
        if ($verbose) {
            logMessage("Pre-restore backup: " . basename($preRestoreFile), 'INFO');
        }
        
        // Build mysql restore command
        $command = buildMysqlCommand($config, $filepath);
        
        if ($verbose) {
            logMessage("Restore command: $command", 'INFO');
        }
        
        // Execute restore
        $output = [];
        $returnCode = 0;
        exec($command . ' 2>&1', $output, $returnCode);
        
        if ($returnCode !== 0) {
            logMessage("Restore failed: " . implode("\n", $output), 'ERROR');
            logMessage("Pre-restore backup available: " . basename($preRestoreFile), 'INFO');
            exit(1);
        }
        
        if (!$quiet) {
            logMessage("Database restore completed successfully!", 'SUCCESS');
            logMessage("Pre-restore backup: " . basename($preRestoreFile), 'INFO');
        }
        
    } catch (Exception $e) {
        logMessage("Restore failed: " . $e->getMessage(), 'ERROR');
        exit(1);
    }
}

/**
 * List available backups
 */
function listBackups($verbose) {
    global $backupDir;
    
    $backups = glob($backupDir . 'hotspot_backup_*.sql*');
    
    if (empty($backups)) {
        logMessage("No backups found in $backupDir", 'INFO');
        return;
    }
    
    logMessage("Available backups:", 'INFO');
    logMessage(str_repeat('-', 80), 'INFO');
    
    foreach ($backups as $backup) {
        $filename = basename($backup);
        $size = formatBytes(filesize($backup));
        $date = date('Y-m-d H:i:s', filemtime($backup));
        
        logMessage(sprintf("%-35s %15s %s", $filename, $size, $date), 'INFO');
        
        if ($verbose) {
            // Load metadata if available
            $metadataFile = $backupDir . pathinfo($filename, PATHINFO_FILENAME) . '.json';
            if (file_exists($metadataFile)) {
                $metadata = json_decode(file_get_contents($metadataFile), true);
                if ($metadata) {
                    logMessage("  Compressed: " . ($metadata['compressed'] ? 'Yes' : 'No'), 'INFO');
                    logMessage("  Structure only: " . ($metadata['structure_only'] ? 'Yes' : 'No'), 'INFO');
                    logMessage("  Tables: " . $metadata['tables'], 'INFO');
                    logMessage("  Checksum: " . substr($metadata['checksum'], 0, 16) . '...', 'INFO');
                }
            }
            logMessage("", 'INFO');
        }
    }
    
    logMessage("\nTotal backups: " . count($backups), 'INFO');
}

/**
 * Verify backup integrity
 */
function verifyBackup($file, $verbose) {
    global $backupDir;
    
    logMessage("Verifying backup: $file", 'INFO');
    
    // Locate backup file
    $filepath = findBackupFile($file);
    if (!$filepath) {
        logMessage("Backup file not found: $file", 'ERROR');
        exit(1);
    }
    
    $errors = 0;
    
    // Check file exists and is readable
    if (!file_exists($filepath) || !is_readable($filepath)) {
        logMessage("File is not readable or does not exist", 'ERROR');
        $errors++;
    }
    
    // Check file size
    $fileSize = filesize($filepath);
    if ($fileSize == 0) {
        logMessage("File is empty", 'ERROR');
        $errors++;
    } else {
        logMessage("File size: " . formatBytes($fileSize), 'INFO');
    }
    
    // Load and verify metadata
    $metadataFile = $backupDir . pathinfo($file, PATHINFO_FILENAME) . '.json';
    if (file_exists($metadataFile)) {
        $metadata = json_decode(file_get_contents($metadataFile), true);
        if ($metadata) {
            // Verify checksum
            $currentChecksum = hash_file('sha256', $filepath);
            if ($currentChecksum === $metadata['checksum']) {
                logMessage("Checksum verification: PASSED", 'SUCCESS');
            } else {
                logMessage("Checksum verification: FAILED", 'ERROR');
                $errors++;
            }
            
            // Verify file size
            if ($fileSize === $metadata['size_bytes']) {
                logMessage("Size verification: PASSED", 'SUCCESS');
            } else {
                logMessage("Size verification: FAILED (expected: {$metadata['size_bytes']}, actual: $fileSize)", 'ERROR');
                $errors++;
            }
            
            if ($verbose) {
                logMessage("Backup details:", 'INFO');
                logMessage("  Created: {$metadata['created_at']}", 'INFO');
                logMessage("  Database: {$metadata['database']}", 'INFO');
                logMessage("  MySQL version: {$metadata['mysql_version']}", 'INFO');
                logMessage("  Compressed: " . ($metadata['compressed'] ? 'Yes' : 'No'), 'INFO');
                logMessage("  Structure only: " . ($metadata['structure_only'] ? 'Yes' : 'No'), 'INFO');
            }
        } else {
            logMessage("Metadata file is corrupted", 'WARNING');
        }
    } else {
        logMessage("No metadata file found", 'WARNING');
    }
    
    // Basic SQL file validation
    if (pathinfo($filepath, PATHINFO_EXTENSION) === 'sql' || 
        (pathinfo($filepath, PATHINFO_EXTENSION) === 'gz' && 
         strpos(pathinfo($filepath, PATHINFO_FILENAME), '.sql') !== false)) {
        
        $content = '';
        if (pathinfo($filepath, PATHINFO_EXTENSION) === 'gz') {
            $content = gzfile($filepath);
            $content = implode('', array_slice($content, 0, 10)); // First 10 lines
        } else {
            $handle = fopen($filepath, 'r');
            for ($i = 0; $i < 10 && !feof($handle); $i++) {
                $content .= fgets($handle);
            }
            fclose($handle);
        }
        
        if (strpos($content, 'mysqldump') !== false || strpos($content, 'CREATE TABLE') !== false) {
            logMessage("SQL format validation: PASSED", 'SUCCESS');
        } else {
            logMessage("SQL format validation: FAILED", 'ERROR');
            $errors++;
        }
    }
    
    if ($errors === 0) {
        logMessage("Backup verification completed successfully!", 'SUCCESS');
    } else {
        logMessage("Backup verification failed with $errors errors", 'ERROR');
        exit(1);
    }
}

/**
 * Clean up old backups
 */
function cleanupOldBackups($retention, $force, $quiet, $verbose) {
    global $backupDir;
    
    if (!$quiet) {
        logMessage("Cleaning up backups older than $retention days...", 'INFO');
    }
    
    $cutoffTime = time() - ($retention * 24 * 60 * 60);
    $backups = glob($backupDir . 'hotspot_backup_*');
    $oldBackups = [];
    
    foreach ($backups as $backup) {
        if (filemtime($backup) < $cutoffTime) {
            $oldBackups[] = $backup;
        }
    }
    
    if (empty($oldBackups)) {
        if (!$quiet) {
            logMessage("No old backups found", 'INFO');
        }
        return;
    }
    
    if (!$quiet) {
        logMessage("Found " . count($oldBackups) . " old backups:", 'INFO');
        foreach ($oldBackups as $backup) {
            $filename = basename($backup);
            $age = round((time() - filemtime($backup)) / (24 * 60 * 60));
            logMessage("  $filename (${age} days old)", 'INFO');
        }
    }
    
    // Confirmation prompt
    if (!$force) {
        echo "\nDelete " . count($oldBackups) . " old backup files? (y/N): ";
        $handle = fopen("php://stdin", "r");
        $line = fgets($handle);
        fclose($handle);
        
        if (trim(strtolower($line)) !== 'y') {
            logMessage("Cleanup cancelled by user.", 'INFO');
            return;
        }
    }
    
    $deleted = 0;
    foreach ($oldBackups as $backup) {
        if (unlink($backup)) {
            $deleted++;
            
            // Also delete metadata file
            $metadataFile = $backupDir . pathinfo(basename($backup), PATHINFO_FILENAME) . '.json';
            if (file_exists($metadataFile)) {
                unlink($metadataFile);
            }
            
            if ($verbose) {
                logMessage("Deleted: " . basename($backup), 'INFO');
            }
        } else {
            logMessage("Failed to delete: " . basename($backup), 'ERROR');
        }
    }
    
    if (!$quiet) {
        logMessage("Cleanup completed. Deleted $deleted files.", 'SUCCESS');
    }
}

/**
 * Build mysqldump command
 */
function buildMysqldumpCommand($config, $filepath, $compress, $noData, $tables) {
    $command = 'mysqldump';
    
    // Connection parameters
    $command .= ' -h ' . escapeshellarg($config['host']);
    $command .= ' -P ' . escapeshellarg($config['port']);
    $command .= ' -u ' . escapeshellarg($config['username']);
    
    if (!empty($config['password'])) {
        $command .= ' -p' . escapeshellarg($config['password']);
    }
    
    // Dump options
    $command .= ' --single-transaction';
    $command .= ' --routines';
    $command .= ' --triggers';
    $command .= ' --lock-tables=false';
    $command .= ' --add-drop-table';
    $command .= ' --extended-insert';
    
    if ($noData) {
        $command .= ' --no-data';
    }
    
    // Database name
    $command .= ' ' . escapeshellarg($config['database']);
    
    // Specific tables
    if ($tables) {
        foreach ($tables as $table) {
            $command .= ' ' . escapeshellarg(trim($table));
        }
    }
    
    // Output redirection
    if ($compress) {
        $command .= ' | gzip > ' . escapeshellarg($filepath);
    } else {
        $command .= ' > ' . escapeshellarg($filepath);
    }
    
    return $command;
}

/**
 * Build mysql restore command
 */
function buildMysqlCommand($config, $filepath) {
    $command = '';
    
    // Handle compressed files
    if (pathinfo($filepath, PATHINFO_EXTENSION) === 'gz') {
        $command = 'gunzip -c ' . escapeshellarg($filepath) . ' | ';
    }
    
    $command .= 'mysql';
    
    // Connection parameters
    $command .= ' -h ' . escapeshellarg($config['host']);
    $command .= ' -P ' . escapeshellarg($config['port']);
    $command .= ' -u ' . escapeshellarg($config['username']);
    
    if (!empty($config['password'])) {
        $command .= ' -p' . escapeshellarg($config['password']);
    }
    
    // Database name
    $command .= ' ' . escapeshellarg($config['database']);
    
    // Input redirection for uncompressed files
    if (pathinfo($filepath, PATHINFO_EXTENSION) !== 'gz') {
        $command .= ' < ' . escapeshellarg($filepath);
    }
    
    return $command;
}

/**
 * Find backup file
 */
function findBackupFile($file) {
    global $backupDir;
    
    // Try exact path first
    if (file_exists($file)) {
        return $file;
    }
    
    // Try in backup directory
    $filepath = $backupDir . $file;
    if (file_exists($filepath)) {
        return $filepath;
    }
    
    // Try with backup prefix
    if (strpos($file, 'hotspot_backup_') !== 0) {
        $filepath = $backupDir . 'hotspot_backup_' . $file;
        if (file_exists($filepath)) {
            return $filepath;
        }
    }
    
    return null;
}

/**
 * Get database configuration
 */
function getDatabaseConfig() {
    return [
        'host' => DB_HOST,
        'port' => defined('DB_PORT') ? DB_PORT : 3306,
        'username' => DB_USER,
        'password' => DB_PASS,
        'database' => DB_NAME
    ];
}

/**
 * Get MySQL version
 */
function getMysqlVersion($db) {
    try {
        $stmt = $db->query('SELECT VERSION() as version');
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result['version'];
    } catch (Exception $e) {
        return 'Unknown';
    }
}

/**
 * Format bytes to human readable format
 */
function formatBytes($bytes, $precision = 2) {
    $units = ['B', 'KB', 'MB', 'GB', 'TB'];
    
    for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
        $bytes /= 1024;
    }
    
    return round($bytes, $precision) . ' ' . $units[$i];
}

/**
 * Show help message
 */
function showHelp() {
    echo "\n";
    echo "Database Backup and Recovery Script\n";
    echo "===================================\n\n";
    echo "Usage: php backup.php [action] [options]\n\n";
    echo "Actions:\n";
    echo "  backup     Create a new backup (default)\n";
    echo "  restore    Restore from a backup file\n";
    echo "  list       List available backups\n";
    echo "  verify     Verify backup integrity\n";
    echo "  cleanup    Clean up old backups\n";
    echo "  help       Show this help message\n\n";
    echo "Options:\n";
    echo "  --file=NAME        Specific backup file for restore/verify\n";
    echo "  --compress         Compress backup files (gzip)\n";
    echo "  --no-data          Backup structure only (no data)\n";
    echo "  --tables=LIST      Backup specific tables only (comma-separated)\n";
    echo "  --force            Skip confirmation prompts\n";
    echo "  --quiet            Run silently\n";
    echo "  --verbose          Show detailed output\n";
    echo "  --retention=DAYS   Set backup retention period (default: 30)\n\n";
    echo "Examples:\n";
    echo "  php backup.php                           # Create backup\n";
    echo "  php backup.php --compress                # Create compressed backup\n";
    echo "  php backup.php --no-data                 # Backup structure only\n";
    echo "  php backup.php list                      # List all backups\n";
    echo "  php backup.php verify --file=backup.sql  # Verify specific backup\n";
    echo "  php backup.php restore --file=backup.sql # Restore from backup\n";
    echo "  php backup.php cleanup --retention=7     # Delete backups older than 7 days\n\n";
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