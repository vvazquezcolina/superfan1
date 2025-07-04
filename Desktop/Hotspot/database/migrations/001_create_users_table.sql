-- Migration: 001_create_users_table.sql
-- Description: Create users table to store guest registration data
-- Created: 2024

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    verification_token VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    mac_address VARCHAR(17) DEFAULT NULL,
    ip_address VARCHAR(45) DEFAULT NULL,
    user_agent TEXT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL DEFAULT NULL,
    last_access TIMESTAMP NULL DEFAULT NULL,
    INDEX idx_email (email),
    INDEX idx_verification_token (verification_token),
    INDEX idx_is_verified (is_verified),
    INDEX idx_created_at (created_at)
);

-- Add some constraints for data integrity
ALTER TABLE users 
ADD CONSTRAINT chk_email_format 
CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Create index for faster lookups
CREATE INDEX idx_verification_lookup ON users (email, verification_token, is_verified); 