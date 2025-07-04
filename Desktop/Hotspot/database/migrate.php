<?php

/**
 * Database Migration Runner
 * Executes all database migrations in order
 */

// Include database configuration
require_once __DIR__ . '/../api/config/database.php';

class MigrationRunner {
    private $database;
    private $migrations_path;
    
    public function __construct($database) {
        $this->database = $database;
        $this->migrations_path = __DIR__ . '/migrations/';
    }
    
    /**
     * Run all migrations
     */
    public function runMigrations() {
        echo "Starting database migrations...\n";
        
        // Create migrations tracking table if it doesn't exist
        $this->createMigrationsTable();
        
        // Get list of migration files
        $migration_files = $this->getMigrationFiles();
        
        if (empty($migration_files)) {
            echo "No migration files found.\n";
            return;
        }
        
        foreach ($migration_files as $file) {
            $this->runMigration($file);
        }
        
        echo "All migrations completed successfully!\n";
    }
    
    /**
     * Create migrations tracking table
     */
    private function createMigrationsTable() {
        $sql = "CREATE TABLE IF NOT EXISTS migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            migration_name VARCHAR(255) NOT NULL UNIQUE,
            executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )";
        
        try {
            $this->database->query($sql);
            echo "✓ Migrations tracking table ready\n";
        } catch (Exception $e) {
            throw new Exception("Failed to create migrations table: " . $e->getMessage());
        }
    }
    
    /**
     * Get all migration files sorted by name
     */
    private function getMigrationFiles() {
        $files = glob($this->migrations_path . "*.sql");
        sort($files);
        return $files;
    }
    
    /**
     * Run a single migration
     */
    private function runMigration($file_path) {
        $migration_name = basename($file_path);
        
        // Check if migration already executed
        if ($this->isMigrationExecuted($migration_name)) {
            echo "⏭ Skipping {$migration_name} (already executed)\n";
            return;
        }
        
        echo "🔄 Running {$migration_name}...\n";
        
        try {
            // Read SQL file
            $sql = file_get_contents($file_path);
            
            if ($sql === false) {
                throw new Exception("Could not read migration file: {$file_path}");
            }
            
            // Split SQL statements (in case there are multiple)
            $statements = array_filter(array_map('trim', explode(';', $sql)));
            
            // Execute each statement
            $this->database->beginTransaction();
            
            foreach ($statements as $statement) {
                if (!empty($statement)) {
                    $this->database->query($statement);
                }
            }
            
            // Mark migration as executed
            $this->markMigrationExecuted($migration_name);
            
            $this->database->commit();
            echo "✓ {$migration_name} completed successfully\n";
            
        } catch (Exception $e) {
            $this->database->rollback();
            throw new Exception("Migration {$migration_name} failed: " . $e->getMessage());
        }
    }
    
    /**
     * Check if migration was already executed
     */
    private function isMigrationExecuted($migration_name) {
        $sql = "SELECT COUNT(*) as count FROM migrations WHERE migration_name = ?";
        $result = $this->database->selectOne($sql, [$migration_name]);
        return $result['count'] > 0;
    }
    
    /**
     * Mark migration as executed
     */
    private function markMigrationExecuted($migration_name) {
        $sql = "INSERT INTO migrations (migration_name) VALUES (?)";
        $this->database->insert($sql, [$migration_name]);
    }
    
    /**
     * Get list of executed migrations
     */
    public function getExecutedMigrations() {
        $sql = "SELECT migration_name, executed_at FROM migrations ORDER BY executed_at";
        return $this->database->selectAll($sql);
    }
    
    /**
     * Reset migrations (WARNING: This will drop all tables!)
     */
    public function resetMigrations() {
        echo "WARNING: This will drop all tables and reset the database!\n";
        echo "Are you sure? Type 'yes' to continue: ";
        
        $handle = fopen("php://stdin", "r");
        $line = fgets($handle);
        fclose($handle);
        
        if (trim($line) !== 'yes') {
            echo "Migration reset cancelled.\n";
            return;
        }
        
        try {
            // Drop tables in reverse order
            $this->database->query("DROP TABLE IF EXISTS sessions");
            $this->database->query("DROP TABLE IF EXISTS users");
            $this->database->query("DROP TABLE IF EXISTS migrations");
            
            echo "✓ Database reset completed\n";
            echo "Run migrations again to recreate tables\n";
            
        } catch (Exception $e) {
            throw new Exception("Failed to reset database: " . $e->getMessage());
        }
    }
}

// CLI execution
if (php_sapi_name() === 'cli') {
    try {
        $runner = new MigrationRunner(getDatabase());
        
        // Check command line arguments
        $command = isset($argv[1]) ? $argv[1] : 'migrate';
        
        switch ($command) {
            case 'migrate':
                $runner->runMigrations();
                break;
                
            case 'reset':
                $runner->resetMigrations();
                break;
                
            case 'status':
                $migrations = $runner->getExecutedMigrations();
                echo "Executed migrations:\n";
                foreach ($migrations as $migration) {
                    echo "- {$migration['migration_name']} (executed: {$migration['executed_at']})\n";
                }
                break;
                
            default:
                echo "Usage: php migrate.php [migrate|reset|status]\n";
                echo "  migrate - Run all pending migrations\n";
                echo "  reset   - Reset database (WARNING: drops all tables)\n";
                echo "  status  - Show executed migrations\n";
                break;
        }
        
    } catch (Exception $e) {
        echo "Error: " . $e->getMessage() . "\n";
        exit(1);
    }
}

?> 