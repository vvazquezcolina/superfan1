<?php

/**
 * Data Retention Manager
 * Handles automated cleanup, retention policies, and data archiving
 */

class DataRetentionManager {
    private $db;
    private $userManager;
    private $config;
    
    public function __construct($database = null) {
        if ($database === null) {
            require_once __DIR__ . '/../config/database.php';
            $this->db = getDatabase();
        } else {
            $this->db = $database;
        }
        
        $this->userManager = new UserManager($this->db);
        $this->loadConfig();
    }
    
    /**
     * Load retention configuration
     */
    private function loadConfig() {
        $this->config = [
            // Default retention periods in days
            'unverified_user_retention' => 30,      // Delete unverified users after 30 days
            'inactive_session_retention' => 7,       // Delete inactive sessions after 7 days
            'deleted_user_retention' => 90,          // Permanently delete soft-deleted users after 90 days
            'log_retention' => 365,                  // Delete logs after 1 year
            'backup_retention' => 180,               // Keep backups for 6 months
            'rate_limit_cleanup' => 1,               // Clean rate limit files after 1 day
            
            // Archive settings
            'archive_enabled' => true,
            'archive_before_delete' => true,
            'archive_path' => __DIR__ . '/../archives/',
            
            // Cleanup settings
            'batch_size' => 100,                     // Process records in batches
            'max_execution_time' => 300,             // Max 5 minutes per cleanup run
            'enable_auto_cleanup' => true,           // Enable automatic cleanup
            'cleanup_schedule' => 'daily',           // daily, weekly, monthly
            
            // Safety settings
            'require_confirmation' => true,          // Require manual confirmation for large deletions
            'max_delete_per_run' => 1000,           // Maximum deletions per run
            'preserve_recent_data' => true,          // Always preserve data from last 24 hours
        ];
        
        // Load custom config if exists
        $customConfigPath = __DIR__ . '/../config/retention.php';
        if (file_exists($customConfigPath)) {
            $customConfig = include $customConfigPath;
            if (is_array($customConfig)) {
                $this->config = array_merge($this->config, $customConfig);
            }
        }
    }
    
    /**
     * Run complete data retention cleanup
     */
    public function runCleanup($dryRun = false) {
        $startTime = time();
        $results = [
            'success' => true,
            'operations' => [],
            'total_deleted' => 0,
            'total_archived' => 0,
            'errors' => [],
            'start_time' => date('Y-m-d H:i:s', $startTime),
            'dry_run' => $dryRun
        ];
        
        try {
            // Set execution time limit
            set_time_limit($this->config['max_execution_time']);
            
            ErrorHandler::logMessage("Starting data retention cleanup (dry run: " . ($dryRun ? 'yes' : 'no') . ")", 'INFO');
            
            // 1. Clean up unverified users
            $unverifiedResult = $this->cleanupUnverifiedUsers($dryRun);
            $results['operations']['unverified_users'] = $unverifiedResult;
            if ($unverifiedResult['success']) {
                $results['total_deleted'] += $unverifiedResult['deleted'];
                $results['total_archived'] += $unverifiedResult['archived'];
            }
            
            // 2. Clean up inactive sessions
            $sessionsResult = $this->cleanupInactiveSessions($dryRun);
            $results['operations']['inactive_sessions'] = $sessionsResult;
            if ($sessionsResult['success']) {
                $results['total_deleted'] += $sessionsResult['deleted'];
            }
            
            // 3. Clean up soft-deleted users
            $deletedUsersResult = $this->cleanupDeletedUsers($dryRun);
            $results['operations']['deleted_users'] = $deletedUsersResult;
            if ($deletedUsersResult['success']) {
                $results['total_deleted'] += $deletedUsersResult['deleted'];
                $results['total_archived'] += $deletedUsersResult['archived'];
            }
            
            // 4. Clean up rate limit files
            $rateLimitResult = $this->cleanupRateLimitFiles($dryRun);
            $results['operations']['rate_limit_files'] = $rateLimitResult;
            if ($rateLimitResult['success']) {
                $results['total_deleted'] += $rateLimitResult['deleted'];
            }
            
            // 5. Clean up old backups
            $backupsResult = $this->cleanupOldBackups($dryRun);
            $results['operations']['old_backups'] = $backupsResult;
            if ($backupsResult['success']) {
                $results['total_deleted'] += $backupsResult['deleted'];
            }
            
            // 6. Optimize database
            if (!$dryRun) {
                $optimizeResult = $this->optimizeDatabase();
                $results['operations']['database_optimization'] = $optimizeResult;
            }
            
            $results['end_time'] = date('Y-m-d H:i:s');
            $results['duration'] = time() - $startTime;
            
            ErrorHandler::logMessage("Data retention cleanup completed. Deleted: {$results['total_deleted']}, Archived: {$results['total_archived']}", 'INFO');
            
        } catch (Exception $e) {
            $results['success'] = false;
            $results['errors'][] = $e->getMessage();
            ErrorHandler::logMessage("Data retention cleanup failed: " . $e->getMessage(), 'ERROR');
        }
        
        return $results;
    }
    
    /**
     * Clean up unverified users
     */
    private function cleanupUnverifiedUsers($dryRun = false) {
        $result = [
            'success' => true,
            'deleted' => 0,
            'archived' => 0,
            'errors' => []
        ];
        
        try {
            $cutoffDate = date('Y-m-d H:i:s', strtotime("-{$this->config['unverified_user_retention']} days"));
            
            // Don't delete very recent data (safety measure)
            if ($this->config['preserve_recent_data']) {
                $safetyDate = date('Y-m-d H:i:s', strtotime('-24 hours'));
                if ($cutoffDate > $safetyDate) {
                    $cutoffDate = $safetyDate;
                }
            }
            
            // Find unverified users to delete
            $stmt = $this->db->prepare("
                SELECT id, first_name, last_name, email, created_at
                FROM users
                WHERE email_verified = 0
                AND created_at < ?
                AND deleted_at IS NULL
                ORDER BY created_at ASC
                LIMIT ?
            ");
            $stmt->execute([$cutoffDate, $this->config['batch_size']]);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (empty($users)) {
                return $result;
            }
            
            // Archive users if enabled
            if ($this->config['archive_enabled'] && $this->config['archive_before_delete']) {
                $archiveResult = $this->archiveUsers($users, 'unverified_cleanup', $dryRun);
                if ($archiveResult['success']) {
                    $result['archived'] = $archiveResult['archived'];
                }
            }
            
            // Delete users
            if (!$dryRun) {
                foreach ($users as $user) {
                    $deleteResult = $this->userManager->deleteUser($user['id'], true); // Hard delete
                    if ($deleteResult['success']) {
                        $result['deleted']++;
                    } else {
                        $result['errors'][] = "Failed to delete user {$user['id']}: " . $deleteResult['error'];
                    }
                }
            } else {
                $result['deleted'] = count($users);
            }
            
        } catch (Exception $e) {
            $result['success'] = false;
            $result['errors'][] = $e->getMessage();
        }
        
        return $result;
    }
    
    /**
     * Clean up inactive sessions
     */
    private function cleanupInactiveSessions($dryRun = false) {
        $result = [
            'success' => true,
            'deleted' => 0,
            'errors' => []
        ];
        
        try {
            $cutoffDate = date('Y-m-d H:i:s', strtotime("-{$this->config['inactive_session_retention']} days"));
            
            if (!$dryRun) {
                $stmt = $this->db->prepare("
                    DELETE FROM sessions
                    WHERE (status = 'expired' OR status = 'terminated' OR expires_at < NOW())
                    AND created_at < ?
                    LIMIT ?
                ");
                $stmt->execute([$cutoffDate, $this->config['batch_size']]);
                $result['deleted'] = $stmt->rowCount();
            } else {
                $stmt = $this->db->prepare("
                    SELECT COUNT(*) as count
                    FROM sessions
                    WHERE (status = 'expired' OR status = 'terminated' OR expires_at < NOW())
                    AND created_at < ?
                ");
                $stmt->execute([$cutoffDate]);
                $result['deleted'] = min($stmt->fetch(PDO::FETCH_ASSOC)['count'], $this->config['batch_size']);
            }
            
        } catch (Exception $e) {
            $result['success'] = false;
            $result['errors'][] = $e->getMessage();
        }
        
        return $result;
    }
    
    /**
     * Clean up soft-deleted users
     */
    private function cleanupDeletedUsers($dryRun = false) {
        $result = [
            'success' => true,
            'deleted' => 0,
            'archived' => 0,
            'errors' => []
        ];
        
        try {
            $cutoffDate = date('Y-m-d H:i:s', strtotime("-{$this->config['deleted_user_retention']} days"));
            
            // Find soft-deleted users to permanently delete
            $stmt = $this->db->prepare("
                SELECT id, first_name, last_name, email, deleted_at
                FROM users
                WHERE deleted_at IS NOT NULL
                AND deleted_at < ?
                ORDER BY deleted_at ASC
                LIMIT ?
            ");
            $stmt->execute([$cutoffDate, $this->config['batch_size']]);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            if (empty($users)) {
                return $result;
            }
            
            // Archive users if enabled
            if ($this->config['archive_enabled'] && $this->config['archive_before_delete']) {
                $archiveResult = $this->archiveUsers($users, 'deleted_cleanup', $dryRun);
                if ($archiveResult['success']) {
                    $result['archived'] = $archiveResult['archived'];
                }
            }
            
            // Permanently delete users
            if (!$dryRun) {
                foreach ($users as $user) {
                    $deleteResult = $this->userManager->deleteUser($user['id'], true); // Hard delete
                    if ($deleteResult['success']) {
                        $result['deleted']++;
                    } else {
                        $result['errors'][] = "Failed to delete user {$user['id']}: " . $deleteResult['error'];
                    }
                }
            } else {
                $result['deleted'] = count($users);
            }
            
        } catch (Exception $e) {
            $result['success'] = false;
            $result['errors'][] = $e->getMessage();
        }
        
        return $result;
    }
    
    /**
     * Clean up rate limit files
     */
    private function cleanupRateLimitFiles($dryRun = false) {
        $result = [
            'success' => true,
            'deleted' => 0,
            'errors' => []
        ];
        
        try {
            $tempDir = __DIR__ . '/../temp/';
            if (!is_dir($tempDir)) {
                return $result;
            }
            
            $cutoffTime = time() - ($this->config['rate_limit_cleanup'] * 24 * 60 * 60);
            $files = glob($tempDir . 'rate_limit_*.txt');
            
            foreach ($files as $file) {
                if (filemtime($file) < $cutoffTime) {
                    if (!$dryRun) {
                        if (unlink($file)) {
                            $result['deleted']++;
                        } else {
                            $result['errors'][] = "Failed to delete rate limit file: $file";
                        }
                    } else {
                        $result['deleted']++;
                    }
                }
            }
            
        } catch (Exception $e) {
            $result['success'] = false;
            $result['errors'][] = $e->getMessage();
        }
        
        return $result;
    }
    
    /**
     * Clean up old backups
     */
    private function cleanupOldBackups($dryRun = false) {
        $result = [
            'success' => true,
            'deleted' => 0,
            'errors' => []
        ];
        
        try {
            $archiveDir = $this->config['archive_path'];
            if (!is_dir($archiveDir)) {
                return $result;
            }
            
            $cutoffTime = time() - ($this->config['backup_retention'] * 24 * 60 * 60);
            $files = glob($archiveDir . '*.{json,sql,csv}', GLOB_BRACE);
            
            foreach ($files as $file) {
                if (filemtime($file) < $cutoffTime) {
                    if (!$dryRun) {
                        if (unlink($file)) {
                            $result['deleted']++;
                        } else {
                            $result['errors'][] = "Failed to delete backup file: $file";
                        }
                    } else {
                        $result['deleted']++;
                    }
                }
            }
            
        } catch (Exception $e) {
            $result['success'] = false;
            $result['errors'][] = $e->getMessage();
        }
        
        return $result;
    }
    
    /**
     * Archive users to JSON file
     */
    private function archiveUsers($users, $reason, $dryRun = false) {
        $result = [
            'success' => true,
            'archived' => 0,
            'archive_file' => null
        ];
        
        try {
            if (empty($users)) {
                return $result;
            }
            
            // Create archive directory if it doesn't exist
            if (!is_dir($this->config['archive_path'])) {
                mkdir($this->config['archive_path'], 0755, true);
            }
            
            // Create archive file
            $timestamp = date('Y-m-d_H-i-s');
            $filename = "users_archive_{$reason}_{$timestamp}.json";
            $filepath = $this->config['archive_path'] . $filename;
            
            $archiveData = [
                'metadata' => [
                    'reason' => $reason,
                    'timestamp' => date('Y-m-d H:i:s'),
                    'total_users' => count($users),
                    'retention_policy' => $this->config
                ],
                'users' => $users
            ];
            
            if (!$dryRun) {
                if (file_put_contents($filepath, json_encode($archiveData, JSON_PRETTY_PRINT))) {
                    $result['archived'] = count($users);
                    $result['archive_file'] = $filename;
                } else {
                    $result['success'] = false;
                    ErrorHandler::logMessage("Failed to create archive file: $filepath", 'ERROR');
                }
            } else {
                $result['archived'] = count($users);
                $result['archive_file'] = $filename;
            }
            
        } catch (Exception $e) {
            $result['success'] = false;
            ErrorHandler::logMessage("Archive creation failed: " . $e->getMessage(), 'ERROR');
        }
        
        return $result;
    }
    
    /**
     * Optimize database tables
     */
    private function optimizeDatabase() {
        $result = [
            'success' => true,
            'optimized_tables' => [],
            'errors' => []
        ];
        
        try {
            $tables = ['users', 'sessions'];
            
            foreach ($tables as $table) {
                try {
                    $stmt = $this->db->prepare("OPTIMIZE TABLE $table");
                    $stmt->execute();
                    $result['optimized_tables'][] = $table;
                } catch (Exception $e) {
                    $result['errors'][] = "Failed to optimize table $table: " . $e->getMessage();
                }
            }
            
        } catch (Exception $e) {
            $result['success'] = false;
            $result['errors'][] = $e->getMessage();
        }
        
        return $result;
    }
    
    /**
     * Get retention statistics
     */
    public function getRetentionStatistics() {
        try {
            $stats = [];
            
            // Unverified users eligible for cleanup
            $cutoffDate = date('Y-m-d H:i:s', strtotime("-{$this->config['unverified_user_retention']} days"));
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as count
                FROM users
                WHERE email_verified = 0
                AND created_at < ?
                AND deleted_at IS NULL
            ");
            $stmt->execute([$cutoffDate]);
            $stats['unverified_users_eligible'] = (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Inactive sessions eligible for cleanup
            $cutoffDate = date('Y-m-d H:i:s', strtotime("-{$this->config['inactive_session_retention']} days"));
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as count
                FROM sessions
                WHERE (status = 'expired' OR status = 'terminated' OR expires_at < NOW())
                AND created_at < ?
            ");
            $stmt->execute([$cutoffDate]);
            $stats['inactive_sessions_eligible'] = (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Soft-deleted users eligible for permanent deletion
            $cutoffDate = date('Y-m-d H:i:s', strtotime("-{$this->config['deleted_user_retention']} days"));
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as count
                FROM users
                WHERE deleted_at IS NOT NULL
                AND deleted_at < ?
            ");
            $stmt->execute([$cutoffDate]);
            $stats['deleted_users_eligible'] = (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Rate limit files
            $tempDir = __DIR__ . '/../temp/';
            $stats['rate_limit_files'] = 0;
            if (is_dir($tempDir)) {
                $files = glob($tempDir . 'rate_limit_*.txt');
                $stats['rate_limit_files'] = count($files);
            }
            
            // Archive files
            $archiveDir = $this->config['archive_path'];
            $stats['archive_files'] = 0;
            if (is_dir($archiveDir)) {
                $files = glob($archiveDir . '*.{json,sql,csv}', GLOB_BRACE);
                $stats['archive_files'] = count($files);
            }
            
            $stats['config'] = $this->config;
            $stats['generated_at'] = date('Y-m-d H:i:s');
            
            return [
                'success' => true,
                'statistics' => $stats
            ];
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Update retention configuration
     */
    public function updateConfig($newConfig) {
        try {
            $this->config = array_merge($this->config, $newConfig);
            
            // Save to custom config file
            $configPath = __DIR__ . '/../config/retention.php';
            $configContent = "<?php\n// Data Retention Configuration\n// Generated on " . date('Y-m-d H:i:s') . "\n\nreturn " . var_export($this->config, true) . ";\n";
            
            if (file_put_contents($configPath, $configContent)) {
                return [
                    'success' => true,
                    'message' => 'Configuration updated successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Failed to save configuration'
                ];
            }
            
        } catch (Exception $e) {
            return [
                'success' => false,
                'error' => $e->getMessage()
            ];
        }
    }
}

?> 