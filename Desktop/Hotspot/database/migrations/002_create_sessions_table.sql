-- Migration: 002_create_sessions_table.sql
-- Description: Create sessions table to track user WiFi sessions and UniFi integration
-- Created: 2024

CREATE TABLE IF NOT EXISTS sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    mac_address VARCHAR(17) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT DEFAULT NULL,
    unifi_session_id VARCHAR(255) DEFAULT NULL,
    access_point_mac VARCHAR(17) DEFAULT NULL,
    ssid VARCHAR(100) DEFAULT NULL,
    session_start TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    session_end TIMESTAMP NULL DEFAULT NULL,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    data_uploaded BIGINT DEFAULT 0,
    data_downloaded BIGINT DEFAULT 0,
    session_duration INT DEFAULT 0, -- in seconds
    status ENUM('active', 'expired', 'terminated') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Foreign key constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Indexes for performance
    INDEX idx_user_id (user_id),
    INDEX idx_session_token (session_token),
    INDEX idx_mac_address (mac_address),
    INDEX idx_status (status),
    INDEX idx_session_start (session_start),
    INDEX idx_last_activity (last_activity),
    INDEX idx_unifi_session_id (unifi_session_id)
);

-- Create composite index for session lookups
CREATE INDEX idx_user_session_lookup ON sessions (user_id, session_token, status);

-- Create index for UniFi integration lookups
CREATE INDEX idx_unifi_lookup ON sessions (mac_address, unifi_session_id, status); 