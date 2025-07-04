<?php

/**
 * Database Connection Class
 * Handles MySQL database connections for Bluehost hosting
 */
class Database {
    private $host;
    private $username;
    private $password;
    private $database;
    private $connection;
    private $charset = 'utf8mb4';
    
    public function __construct($host, $username, $password, $database) {
        $this->host = $host;
        $this->username = $username;
        $this->password = $password;
        $this->database = $database;
        
        $this->connect();
    }
    
    /**
     * Establish database connection
     */
    private function connect() {
        try {
            $dsn = "mysql:host={$this->host};dbname={$this->database};charset={$this->charset}";
            $options = [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES => false,
                PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES {$this->charset}",
                PDO::ATTR_TIMEOUT => 30 // 30 second timeout for Bluehost
            ];
            
            $this->connection = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            error_log("Database connection failed: " . $e->getMessage());
            throw new Exception("Database connection failed. Please try again later.");
        }
    }
    
    /**
     * Get database connection
     */
    public function getConnection() {
        // Check if connection is still alive
        if (!$this->connection) {
            $this->connect();
        }
        return $this->connection;
    }
    
    /**
     * Execute prepared statement
     */
    public function query($sql, $params = []) {
        try {
            $stmt = $this->connection->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            error_log("Query execution failed: " . $e->getMessage());
            throw new Exception("Database query failed. Please try again later.");
        }
    }
    
    /**
     * Insert data and return last insert ID
     */
    public function insert($sql, $params = []) {
        try {
            $stmt = $this->query($sql, $params);
            return $this->connection->lastInsertId();
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    /**
     * Select single row
     */
    public function selectOne($sql, $params = []) {
        try {
            $stmt = $this->query($sql, $params);
            return $stmt->fetch();
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    /**
     * Select multiple rows
     */
    public function selectAll($sql, $params = []) {
        try {
            $stmt = $this->query($sql, $params);
            return $stmt->fetchAll();
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    /**
     * Update data and return affected rows
     */
    public function update($sql, $params = []) {
        try {
            $stmt = $this->query($sql, $params);
            return $stmt->rowCount();
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    /**
     * Delete data and return affected rows
     */
    public function delete($sql, $params = []) {
        try {
            $stmt = $this->query($sql, $params);
            return $stmt->rowCount();
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    /**
     * Begin transaction
     */
    public function beginTransaction() {
        return $this->connection->beginTransaction();
    }
    
    /**
     * Commit transaction
     */
    public function commit() {
        return $this->connection->commit();
    }
    
    /**
     * Rollback transaction
     */
    public function rollback() {
        return $this->connection->rollback();
    }
    
    /**
     * Close connection
     */
    public function close() {
        $this->connection = null;
    }
    
    /**
     * Get connection status
     */
    public function isConnected() {
        try {
            return $this->connection && $this->connection->query('SELECT 1');
        } catch (PDOException $e) {
            return false;
        }
    }
}

?> 