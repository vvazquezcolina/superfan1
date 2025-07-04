<?php

/**
 * User Data Management Class
 * Handles CRUD operations, search, filtering, and data export for user data
 */

class UserManager {
    private $db;
    private $table = 'users';
    private $sessionsTable = 'sessions';
    
    public function __construct($database = null) {
        if ($database === null) {
            require_once __DIR__ . '/../config/database.php';
            $this->db = getDatabase();
        } else {
            $this->db = $database;
        }
    }
    
    /**
     * Create a new user (used internally by registration)
     */
    public function createUser($userData) {
        try {
            $stmt = $this->db->prepare("
                INSERT INTO {$this->table} (
                    first_name, last_name, email, verification_token, token_expiry,
                    terms_agreement, client_ip, user_agent, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ");
            
            $result = $stmt->execute([
                $userData['first_name'],
                $userData['last_name'],
                $userData['email'],
                $userData['verification_token'],
                $userData['token_expiry'],
                $userData['terms_agreement'] ? 1 : 0,
                $userData['client_ip'] ?? null,
                $userData['user_agent'] ?? null
            ]);
            
            if ($result) {
                return [
                    'success' => true,
                    'user_id' => $this->db->lastInsertId(),
                    'message' => 'User created successfully'
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Failed to create user'
                ];
            }
            
        } catch (PDOException $e) {
            ErrorHandler::logMessage("Error creating user: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => 'Database error: ' . $e->getMessage()
            ];
        }
    }
    
    /**
     * Get user by ID
     */
    public function getUserById($id) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = ?");
            $stmt->execute([$id]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                return [
                    'success' => true,
                    'user' => $this->sanitizeUserData($user)
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'User not found'
                ];
            }
            
        } catch (PDOException $e) {
            ErrorHandler::logMessage("Error getting user by ID: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => 'Database error'
            ];
        }
    }
    
    /**
     * Get user by email
     */
    public function getUserByEmail($email) {
        try {
            $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE email = ?");
            $stmt->execute([strtolower($email)]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            
            if ($user) {
                return [
                    'success' => true,
                    'user' => $this->sanitizeUserData($user)
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'User not found'
                ];
            }
            
        } catch (PDOException $e) {
            ErrorHandler::logMessage("Error getting user by email: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => 'Database error'
            ];
        }
    }
    
    /**
     * Update user data
     */
    public function updateUser($id, $updateData) {
        try {
            // Build dynamic update query
            $setClause = [];
            $values = [];
            
            $allowedFields = [
                'first_name', 'last_name', 'email', 'email_verified',
                'verification_token', 'token_expiry', 'verified_at',
                'last_resend_at', 'resend_count', 'client_ip', 'user_agent'
            ];
            
            foreach ($updateData as $field => $value) {
                if (in_array($field, $allowedFields)) {
                    $setClause[] = "$field = ?";
                    $values[] = $value;
                }
            }
            
            if (empty($setClause)) {
                return [
                    'success' => false,
                    'error' => 'No valid fields to update'
                ];
            }
            
            // Add updated_at timestamp
            $setClause[] = "updated_at = NOW()";
            $values[] = $id;
            
            $sql = "UPDATE {$this->table} SET " . implode(', ', $setClause) . " WHERE id = ?";
            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute($values);
            
            if ($result) {
                return [
                    'success' => true,
                    'message' => 'User updated successfully',
                    'affected_rows' => $stmt->rowCount()
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Failed to update user'
                ];
            }
            
        } catch (PDOException $e) {
            ErrorHandler::logMessage("Error updating user: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => 'Database error'
            ];
        }
    }
    
    /**
     * Delete user (soft delete - mark as deleted)
     */
    public function deleteUser($id, $hardDelete = false) {
        try {
            if ($hardDelete) {
                // Hard delete - permanently remove user and sessions
                $stmt = $this->db->prepare("DELETE FROM {$this->sessionsTable} WHERE user_id = ?");
                $stmt->execute([$id]);
                
                $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = ?");
                $result = $stmt->execute([$id]);
            } else {
                // Soft delete - mark as deleted
                $stmt = $this->db->prepare("
                    UPDATE {$this->table} 
                    SET email = CONCAT('deleted_', id, '_', email),
                        first_name = 'Deleted',
                        last_name = 'User',
                        email_verified = 0,
                        verification_token = NULL,
                        deleted_at = NOW(),
                        updated_at = NOW()
                    WHERE id = ?
                ");
                $result = $stmt->execute([$id]);
                
                // Mark all sessions as terminated
                $stmt = $this->db->prepare("
                    UPDATE {$this->sessionsTable} 
                    SET status = 'terminated', updated_at = NOW() 
                    WHERE user_id = ? AND status = 'active'
                ");
                $stmt->execute([$id]);
            }
            
            if ($result) {
                return [
                    'success' => true,
                    'message' => $hardDelete ? 'User permanently deleted' : 'User deleted successfully',
                    'affected_rows' => $stmt->rowCount()
                ];
            } else {
                return [
                    'success' => false,
                    'error' => 'Failed to delete user'
                ];
            }
            
        } catch (PDOException $e) {
            ErrorHandler::logMessage("Error deleting user: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => 'Database error'
            ];
        }
    }
    
    /**
     * Get users with filtering and pagination
     */
    public function getUsers($filters = [], $pagination = []) {
        try {
            // Default pagination
            $page = $pagination['page'] ?? 1;
            $limit = $pagination['limit'] ?? 25;
            $offset = ($page - 1) * $limit;
            
            // Build WHERE clause
            $whereConditions = [];
            $params = [];
            
            // Email filter
            if (!empty($filters['email'])) {
                $whereConditions[] = "email LIKE ?";
                $params[] = '%' . $filters['email'] . '%';
            }
            
            // Name filter
            if (!empty($filters['name'])) {
                $whereConditions[] = "(first_name LIKE ? OR last_name LIKE ?)";
                $params[] = '%' . $filters['name'] . '%';
                $params[] = '%' . $filters['name'] . '%';
            }
            
            // Verification status filter
            if (isset($filters['verified'])) {
                $whereConditions[] = "email_verified = ?";
                $params[] = $filters['verified'] ? 1 : 0;
            }
            
            // Date range filter
            if (!empty($filters['date_from'])) {
                $whereConditions[] = "created_at >= ?";
                $params[] = $filters['date_from'];
            }
            
            if (!empty($filters['date_to'])) {
                $whereConditions[] = "created_at <= ?";
                $params[] = $filters['date_to'] . ' 23:59:59';
            }
            
            // IP address filter
            if (!empty($filters['ip'])) {
                $whereConditions[] = "client_ip = ?";
                $params[] = $filters['ip'];
            }
            
            // Exclude deleted users unless specifically requested
            if (!isset($filters['include_deleted']) || !$filters['include_deleted']) {
                $whereConditions[] = "deleted_at IS NULL";
            }
            
            $whereClause = empty($whereConditions) ? '' : 'WHERE ' . implode(' AND ', $whereConditions);
            
            // Get total count
            $countSql = "SELECT COUNT(*) as total FROM {$this->table} $whereClause";
            $countStmt = $this->db->prepare($countSql);
            $countStmt->execute($params);
            $totalCount = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];
            
            // Get users with pagination
            $orderBy = $this->buildOrderBy($pagination['sort'] ?? 'created_at', $pagination['order'] ?? 'DESC');
            $sql = "SELECT * FROM {$this->table} $whereClause $orderBy LIMIT ? OFFSET ?";
            $params[] = $limit;
            $params[] = $offset;
            
            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Sanitize user data
            $sanitizedUsers = array_map([$this, 'sanitizeUserData'], $users);
            
            return [
                'success' => true,
                'users' => $sanitizedUsers,
                'pagination' => [
                    'page' => $page,
                    'limit' => $limit,
                    'total' => (int)$totalCount,
                    'pages' => ceil($totalCount / $limit),
                    'has_next' => $page < ceil($totalCount / $limit),
                    'has_prev' => $page > 1
                ],
                'filters' => $filters
            ];
            
        } catch (PDOException $e) {
            ErrorHandler::logMessage("Error getting users: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => 'Database error'
            ];
        }
    }
    
    /**
     * Get user statistics
     */
    public function getUserStatistics($dateRange = null) {
        try {
            $stats = [];
            
            // Base date filter
            $dateFilter = '';
            $params = [];
            
            if ($dateRange) {
                if (!empty($dateRange['from'])) {
                    $dateFilter .= " AND created_at >= ?";
                    $params[] = $dateRange['from'];
                }
                if (!empty($dateRange['to'])) {
                    $dateFilter .= " AND created_at <= ?";
                    $params[] = $dateRange['to'] . ' 23:59:59';
                }
            }
            
            // Total users
            $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM {$this->table} WHERE deleted_at IS NULL $dateFilter");
            $stmt->execute($params);
            $stats['total_users'] = (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Verified users
            $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM {$this->table} WHERE email_verified = 1 AND deleted_at IS NULL $dateFilter");
            $stmt->execute($params);
            $stats['verified_users'] = (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Unverified users
            $stats['unverified_users'] = $stats['total_users'] - $stats['verified_users'];
            
            // Active sessions
            $stmt = $this->db->prepare("
                SELECT COUNT(*) as count 
                FROM {$this->sessionsTable} s
                JOIN {$this->table} u ON s.user_id = u.id
                WHERE s.status = 'active' AND s.expires_at > NOW() AND u.deleted_at IS NULL
            ");
            $stmt->execute();
            $stats['active_sessions'] = (int)$stmt->fetch(PDO::FETCH_ASSOC)['count'];
            
            // Registration by day (last 30 days)
            $stmt = $this->db->prepare("
                SELECT DATE(created_at) as date, COUNT(*) as count
                FROM {$this->table}
                WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) AND deleted_at IS NULL
                GROUP BY DATE(created_at)
                ORDER BY date DESC
            ");
            $stmt->execute();
            $stats['registrations_by_day'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Top IPs
            $stmt = $this->db->prepare("
                SELECT client_ip, COUNT(*) as count
                FROM {$this->table}
                WHERE client_ip IS NOT NULL AND deleted_at IS NULL $dateFilter
                GROUP BY client_ip
                ORDER BY count DESC
                LIMIT 10
            ");
            $stmt->execute($params);
            $stats['top_ips'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            // Verification rate
            if ($stats['total_users'] > 0) {
                $stats['verification_rate'] = round(($stats['verified_users'] / $stats['total_users']) * 100, 2);
            } else {
                $stats['verification_rate'] = 0;
            }
            
            return [
                'success' => true,
                'statistics' => $stats,
                'generated_at' => date('Y-m-d H:i:s')
            ];
            
        } catch (PDOException $e) {
            ErrorHandler::logMessage("Error getting user statistics: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => 'Database error'
            ];
        }
    }
    
    /**
     * Get user sessions
     */
    public function getUserSessions($userId, $includeExpired = false) {
        try {
            $whereClause = "user_id = ?";
            $params = [$userId];
            
            if (!$includeExpired) {
                $whereClause .= " AND (status = 'active' OR expires_at > NOW())";
            }
            
            $stmt = $this->db->prepare("
                SELECT * FROM {$this->sessionsTable}
                WHERE $whereClause
                ORDER BY created_at DESC
            ");
            $stmt->execute($params);
            $sessions = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'sessions' => $sessions
            ];
            
        } catch (PDOException $e) {
            ErrorHandler::logMessage("Error getting user sessions: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => 'Database error'
            ];
        }
    }
    
    /**
     * Search users by multiple criteria
     */
    public function searchUsers($searchTerm, $searchFields = ['email', 'first_name', 'last_name'], $limit = 20) {
        try {
            $whereConditions = [];
            $params = [];
            
            foreach ($searchFields as $field) {
                $whereConditions[] = "$field LIKE ?";
                $params[] = '%' . $searchTerm . '%';
            }
            
            $whereClause = '(' . implode(' OR ', $whereConditions) . ') AND deleted_at IS NULL';
            
            $stmt = $this->db->prepare("
                SELECT id, first_name, last_name, email, email_verified, created_at, verified_at
                FROM {$this->table}
                WHERE $whereClause
                ORDER BY 
                    CASE WHEN email LIKE ? THEN 1 ELSE 2 END,
                    created_at DESC
                LIMIT ?
            ");
            
            $params[] = $searchTerm . '%'; // Exact match priority
            $params[] = $limit;
            
            $stmt->execute($params);
            $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            return [
                'success' => true,
                'users' => $users,
                'search_term' => $searchTerm,
                'count' => count($users)
            ];
            
        } catch (PDOException $e) {
            ErrorHandler::logMessage("Error searching users: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => 'Database error'
            ];
        }
    }
    
    /**
     * Export users data for CSV/Excel
     */
    public function exportUsers($filters = []) {
        try {
            // Get all users matching filters (no pagination for export)
            $result = $this->getUsers($filters, ['limit' => PHP_INT_MAX]);
            
            if (!$result['success']) {
                return $result;
            }
            
            $exportData = [];
            foreach ($result['users'] as $user) {
                $exportData[] = [
                    'ID' => $user['id'],
                    'First Name' => $user['first_name'],
                    'Last Name' => $user['last_name'],
                    'Email' => $user['email'],
                    'Email Verified' => $user['email_verified'] ? 'Yes' : 'No',
                    'Terms Agreement' => $user['terms_agreement'] ? 'Yes' : 'No',
                    'Client IP' => $user['client_ip'] ?? 'Unknown',
                    'Created At' => $user['created_at'],
                    'Verified At' => $user['verified_at'] ?? 'Not verified',
                    'Last Resend' => $user['last_resend_at'] ?? 'Never',
                    'Resend Count' => $user['resend_count'] ?? 0
                ];
            }
            
            return [
                'success' => true,
                'data' => $exportData,
                'count' => count($exportData),
                'exported_at' => date('Y-m-d H:i:s')
            ];
            
        } catch (Exception $e) {
            ErrorHandler::logMessage("Error exporting users: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => 'Export error'
            ];
        }
    }
    
    /**
     * Clean up old data based on retention policies
     */
    public function cleanupOldData($retentionDays = 365) {
        try {
            $cutoffDate = date('Y-m-d H:i:s', strtotime("-$retentionDays days"));
            
            // Delete unverified users older than retention period
            $stmt = $this->db->prepare("
                DELETE FROM {$this->table}
                WHERE email_verified = 0 
                AND created_at < ?
                AND deleted_at IS NULL
            ");
            $stmt->execute([$cutoffDate]);
            $deletedUsers = $stmt->rowCount();
            
            // Delete expired sessions older than retention period
            $stmt = $this->db->prepare("
                DELETE FROM {$this->sessionsTable}
                WHERE status IN ('expired', 'terminated')
                AND created_at < ?
            ");
            $stmt->execute([$cutoffDate]);
            $deletedSessions = $stmt->rowCount();
            
            ErrorHandler::logMessage("Data cleanup completed: $deletedUsers users, $deletedSessions sessions", 'INFO');
            
            return [
                'success' => true,
                'deleted_users' => $deletedUsers,
                'deleted_sessions' => $deletedSessions,
                'cutoff_date' => $cutoffDate
            ];
            
        } catch (PDOException $e) {
            ErrorHandler::logMessage("Error during data cleanup: " . $e->getMessage(), 'ERROR');
            return [
                'success' => false,
                'error' => 'Cleanup error'
            ];
        }
    }
    
    /**
     * Build ORDER BY clause
     */
    private function buildOrderBy($sortField, $sortOrder) {
        $allowedFields = ['id', 'first_name', 'last_name', 'email', 'created_at', 'verified_at', 'email_verified'];
        $allowedOrders = ['ASC', 'DESC'];
        
        if (!in_array($sortField, $allowedFields)) {
            $sortField = 'created_at';
        }
        
        if (!in_array(strtoupper($sortOrder), $allowedOrders)) {
            $sortOrder = 'DESC';
        }
        
        return "ORDER BY $sortField $sortOrder";
    }
    
    /**
     * Sanitize user data for output
     */
    private function sanitizeUserData($user) {
        // Remove sensitive data
        unset($user['verification_token']);
        
        // Convert boolean fields
        $user['email_verified'] = (bool)$user['email_verified'];
        $user['terms_agreement'] = (bool)$user['terms_agreement'];
        
        // Convert numeric fields
        $user['id'] = (int)$user['id'];
        $user['resend_count'] = (int)($user['resend_count'] ?? 0);
        
        return $user;
    }
}

?> 