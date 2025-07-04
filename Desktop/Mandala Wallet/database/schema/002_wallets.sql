-- Create enum for balance types
CREATE TYPE balance_type AS ENUM ('cash', 'credit', 'rewards');

-- Create enum for transaction types
CREATE TYPE transaction_type AS ENUM (
    'deposit', 'withdrawal', 'payment', 'refund', 'transfer', 
    'bonus', 'allocation', 'expiry'
);

-- Create enum for transaction status
CREATE TYPE transaction_status AS ENUM (
    'pending', 'processing', 'completed', 'failed', 'cancelled'
);

-- Create enum for payment methods
CREATE TYPE payment_method AS ENUM (
    'stripe', 'oxxo_pay', 'apple_pay', 'spei', 'qr_code', 'cash'
);

-- Create wallets table
CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    cash_balance DECIMAL(10,2) DEFAULT 0.00 CHECK (cash_balance >= 0),
    credit_balance DECIMAL(10,2) DEFAULT 0.00 CHECK (credit_balance >= 0),
    rewards_balance DECIMAL(10,2) DEFAULT 0.00 CHECK (rewards_balance >= 0),
    total_balance DECIMAL(10,2) GENERATED ALWAYS AS (cash_balance + credit_balance + rewards_balance) STORED,
    currency VARCHAR(3) DEFAULT 'MXN',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_transaction_at TIMESTAMP WITH TIME ZONE,
    
    -- Balance limits constraints
    CONSTRAINT wallet_min_balance CHECK (total_balance >= 0),
    CONSTRAINT wallet_max_balance CHECK (total_balance <= 10000.00),
    CONSTRAINT wallet_min_cash CHECK (cash_balance >= 0),
    CONSTRAINT wallet_balance_limit CHECK (
        (cash_balance + credit_balance + rewards_balance) >= 100.00 
        OR (cash_balance + credit_balance + rewards_balance) = 0
    )
);

-- Create balance details table for tracking expiration
CREATE TABLE balance_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    balance_type balance_type NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_expired BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Set expiration rules based on balance type
    CONSTRAINT balance_expiry_rules CHECK (
        (balance_type = 'cash' AND expires_at IS NULL) OR
        (balance_type = 'credit' AND expires_at IS NOT NULL) OR
        (balance_type = 'rewards' AND expires_at IS NOT NULL)
    )
);

-- Create transactions table for audit trail
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type transaction_type NOT NULL,
    status transaction_status DEFAULT 'pending',
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    balance_type balance_type NOT NULL,
    payment_method payment_method,
    description TEXT NOT NULL,
    metadata JSONB,
    venue_id UUID,
    merchant_transaction_id VARCHAR(255),
    external_transaction_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    failed_at TIMESTAMP WITH TIME ZONE,
    failure_reason TEXT,
    
    -- Constraints
    CONSTRAINT transaction_completion_check CHECK (
        (status = 'completed' AND completed_at IS NOT NULL) OR
        (status = 'failed' AND failed_at IS NOT NULL) OR
        (status IN ('pending', 'processing', 'cancelled'))
    )
);

-- Create QR codes table
CREATE TABLE qr_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('payment', 'receipt')),
    venue_id UUID,
    amount DECIMAL(10,2) CHECK (amount > 0),
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    data JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    used_at TIMESTAMP WITH TIME ZONE,
    used_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

-- Create indexes for performance
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_wallets_is_active ON wallets(is_active);
CREATE INDEX idx_wallets_total_balance ON wallets(total_balance);

CREATE INDEX idx_balance_details_wallet_id ON balance_details(wallet_id);
CREATE INDEX idx_balance_details_balance_type ON balance_details(balance_type);
CREATE INDEX idx_balance_details_expires_at ON balance_details(expires_at);
CREATE INDEX idx_balance_details_is_expired ON balance_details(is_expired);

CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_created_at ON transactions(created_at);
CREATE INDEX idx_transactions_venue_id ON transactions(venue_id);
CREATE INDEX idx_transactions_external_id ON transactions(external_transaction_id);

CREATE INDEX idx_qr_codes_type ON qr_codes(type);
CREATE INDEX idx_qr_codes_venue_id ON qr_codes(venue_id);
CREATE INDEX idx_qr_codes_is_active ON qr_codes(is_active);
CREATE INDEX idx_qr_codes_expires_at ON qr_codes(expires_at);

-- Create triggers for updated_at
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_balance_details_updated_at BEFORE UPDATE ON balance_details
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update wallet last_transaction_at
CREATE OR REPLACE FUNCTION update_wallet_last_transaction()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE wallets 
    SET last_transaction_at = NOW()
    WHERE id = NEW.wallet_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for wallet last transaction update
CREATE TRIGGER update_wallet_last_transaction_trigger
    AFTER INSERT OR UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_wallet_last_transaction();

-- Create function to expire balances automatically
CREATE OR REPLACE FUNCTION expire_balances()
RETURNS void AS $$
BEGIN
    -- Mark expired credit balances (monthly expiration)
    UPDATE balance_details 
    SET is_expired = TRUE 
    WHERE balance_type = 'credit' 
      AND expires_at < NOW() 
      AND is_expired = FALSE;
    
    -- Mark expired rewards balances (yearly expiration)
    UPDATE balance_details 
    SET is_expired = TRUE 
    WHERE balance_type = 'rewards' 
      AND expires_at < NOW() 
      AND is_expired = FALSE;
    
    -- Update wallet balances to reflect expired amounts
    UPDATE wallets 
    SET 
        credit_balance = COALESCE((
            SELECT SUM(amount) 
            FROM balance_details 
            WHERE wallet_id = wallets.id 
              AND balance_type = 'credit' 
              AND is_expired = FALSE
        ), 0),
        rewards_balance = COALESCE((
            SELECT SUM(amount) 
            FROM balance_details 
            WHERE wallet_id = wallets.id 
              AND balance_type = 'rewards' 
              AND is_expired = FALSE
        ), 0);
END;
$$ language 'plpgsql';

-- Create unique constraint to ensure one wallet per user
CREATE UNIQUE INDEX idx_wallets_user_id_unique ON wallets(user_id) WHERE is_active = TRUE; 