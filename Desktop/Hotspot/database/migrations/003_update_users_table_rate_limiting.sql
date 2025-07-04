-- Migration: 003_update_users_table_rate_limiting.sql
-- Description: Add rate limiting fields and fix field name inconsistencies
-- Created: 2024

-- Add missing fields for rate limiting and fix naming inconsistencies
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE AFTER verification_token,
ADD COLUMN IF NOT EXISTS token_expiry TIMESTAMP NULL DEFAULT NULL AFTER email_verified,
ADD COLUMN IF NOT EXISTS terms_agreement BOOLEAN DEFAULT FALSE AFTER token_expiry,
ADD COLUMN IF NOT EXISTS client_ip VARCHAR(45) DEFAULT NULL AFTER terms_agreement,
ADD COLUMN IF NOT EXISTS last_resend_at TIMESTAMP NULL DEFAULT NULL AFTER client_ip,
ADD COLUMN IF NOT EXISTS resend_count INT DEFAULT 0 AFTER last_resend_at,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP AFTER resend_count;

-- Update existing data if is_verified column exists
UPDATE users SET email_verified = is_verified WHERE is_verified IS NOT NULL;

-- Drop old column if it exists (safely)
-- Note: This will be handled manually in production to avoid data loss
-- ALTER TABLE users DROP COLUMN IF EXISTS is_verified;

-- Update ip_address to client_ip if needed
UPDATE users SET client_ip = ip_address WHERE ip_address IS NOT NULL AND client_ip IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_verified ON users (email_verified);
CREATE INDEX IF NOT EXISTS idx_token_expiry ON users (token_expiry);
CREATE INDEX IF NOT EXISTS idx_client_ip ON users (client_ip);
CREATE INDEX IF NOT EXISTS idx_last_resend_at ON users (last_resend_at);
CREATE INDEX IF NOT EXISTS idx_resend_count ON users (resend_count);

-- Create composite index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_rate_limiting ON users (client_ip, last_resend_at, resend_count);

-- Update verification lookup index to use correct field names
DROP INDEX IF EXISTS idx_verification_lookup;
CREATE INDEX idx_verification_lookup_v2 ON users (email, verification_token, email_verified);

-- Add constraint for resend count
ALTER TABLE users 
ADD CONSTRAINT IF NOT EXISTS chk_resend_count 
CHECK (resend_count >= 0 AND resend_count <= 10);

-- Add constraint for token expiry (should be in the future when set)
-- Note: This is informational - MySQL doesn't support complex check constraints on timestamps
-- ALTER TABLE users 
-- ADD CONSTRAINT chk_token_expiry 
-- CHECK (token_expiry IS NULL OR token_expiry > created_at);

-- Update table comment
ALTER TABLE users COMMENT = 'Guest user registrations with email verification and rate limiting';

COMMIT; 