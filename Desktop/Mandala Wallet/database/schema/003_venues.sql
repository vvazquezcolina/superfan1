-- Create enum for venue status
CREATE TYPE venue_status AS ENUM ('active', 'inactive', 'maintenance');

-- Create enum for tier levels
CREATE TYPE tier_level AS ENUM ('bronze', 'silver', 'gold', 'black');

-- Create venues table
CREATE TABLE venues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    street_address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(3) DEFAULT 'MEX',
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    geofence_radius INTEGER DEFAULT 500 CHECK (geofence_radius > 0),
    contact_phone VARCHAR(20),
    contact_email VARCHAR(255),
    website VARCHAR(255),
    manager_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status venue_status DEFAULT 'active',
    accepts_qr_payments BOOLEAN DEFAULT TRUE,
    accepts_cash_payments BOOLEAN DEFAULT TRUE,
    geofence_enabled BOOLEAN DEFAULT TRUE,
    push_notifications_enabled BOOLEAN DEFAULT TRUE,
    max_transaction_amount DECIMAL(10,2) DEFAULT 10000.00,
    timezone VARCHAR(50) DEFAULT 'America/Mexico_City',
    business_hours JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create geofences table
CREATE TABLE geofences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    radius INTEGER NOT NULL CHECK (radius > 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create location events table
CREATE TABLE location_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    type VARCHAR(10) NOT NULL CHECK (type IN ('enter', 'exit')),
    latitude DECIMAL(10,8) NOT NULL,
    longitude DECIMAL(11,8) NOT NULL,
    accuracy DECIMAL(8,2),
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- Create user tiers table
CREATE TABLE user_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    current_tier tier_level DEFAULT 'bronze',
    points INTEGER DEFAULT 0 CHECK (points >= 0),
    points_to_next_tier INTEGER DEFAULT 1000,
    tier_benefits TEXT[],
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create rewards table
CREATE TABLE rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(20) NOT NULL CHECK (type IN ('cashback', 'points', 'discount', 'freebie')),
    value DECIMAL(10,2) NOT NULL CHECK (value > 0),
    min_amount DECIMAL(10,2),
    max_amount DECIMAL(10,2),
    tier_required tier_level,
    time_restriction JSONB,
    location_required BOOLEAN DEFAULT FALSE,
    first_time_user BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    max_redemptions INTEGER,
    current_redemptions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user rewards table
CREATE TABLE user_rewards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    reward_id UUID REFERENCES rewards(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
    type VARCHAR(20) NOT NULL CHECK (type IN ('cashback', 'points', 'discount', 'freebie')),
    status VARCHAR(20) DEFAULT 'earned' CHECK (status IN ('earned', 'redeemed', 'expired')),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    redeemed_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    venue_id UUID REFERENCES venues(id) ON DELETE SET NULL
);

-- Create QR passports table
CREATE TABLE qr_passports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    total_stamps INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create QR stamps table
CREATE TABLE qr_stamps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    passport_id UUID REFERENCES qr_passports(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    venue_name VARCHAR(255) NOT NULL,
    transaction_id UUID REFERENCES transactions(id) ON DELETE SET NULL,
    stamped_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_valid BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '1 year')
);

-- Create promotions table
CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(30) NOT NULL CHECK (type IN ('discount', 'cashback', 'bonus_points', 'buy_one_get_one')),
    value DECIMAL(10,2) NOT NULL CHECK (value > 0),
    min_amount DECIMAL(10,2),
    max_amount DECIMAL(10,2),
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    valid_until TIMESTAMP WITH TIME ZONE,
    time_restriction JSONB,
    tier_required tier_level,
    first_time_user BOOLEAN DEFAULT FALSE,
    geofence_required BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    max_redemptions INTEGER,
    current_redemptions INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create geofence notifications table
CREATE TABLE geofence_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    venue_id UUID REFERENCES venues(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN ('welcome', 'promotion', 'reminder', 'farewell')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX idx_venues_manager_id ON venues(manager_id);
CREATE INDEX idx_venues_status ON venues(status);
CREATE INDEX idx_venues_location ON venues(latitude, longitude);
CREATE INDEX idx_venues_geofence_enabled ON venues(geofence_enabled);

CREATE INDEX idx_geofences_venue_id ON geofences(venue_id);
CREATE INDEX idx_geofences_is_active ON geofences(is_active);
CREATE INDEX idx_geofences_location ON geofences(latitude, longitude);

CREATE INDEX idx_location_events_user_id ON location_events(user_id);
CREATE INDEX idx_location_events_venue_id ON location_events(venue_id);
CREATE INDEX idx_location_events_type ON location_events(type);
CREATE INDEX idx_location_events_timestamp ON location_events(timestamp);

CREATE INDEX idx_user_tiers_user_id ON user_tiers(user_id);
CREATE INDEX idx_user_tiers_current_tier ON user_tiers(current_tier);
CREATE INDEX idx_user_tiers_points ON user_tiers(points);

CREATE INDEX idx_rewards_venue_id ON rewards(venue_id);
CREATE INDEX idx_rewards_is_active ON rewards(is_active);
CREATE INDEX idx_rewards_type ON rewards(type);
CREATE INDEX idx_rewards_valid_from ON rewards(valid_from);
CREATE INDEX idx_rewards_valid_until ON rewards(valid_until);

CREATE INDEX idx_user_rewards_user_id ON user_rewards(user_id);
CREATE INDEX idx_user_rewards_reward_id ON user_rewards(reward_id);
CREATE INDEX idx_user_rewards_status ON user_rewards(status);
CREATE INDEX idx_user_rewards_expires_at ON user_rewards(expires_at);

CREATE INDEX idx_qr_passports_user_id ON qr_passports(user_id);

CREATE INDEX idx_qr_stamps_passport_id ON qr_stamps(passport_id);
CREATE INDEX idx_qr_stamps_venue_id ON qr_stamps(venue_id);
CREATE INDEX idx_qr_stamps_is_valid ON qr_stamps(is_valid);
CREATE INDEX idx_qr_stamps_expires_at ON qr_stamps(expires_at);

CREATE INDEX idx_promotions_venue_id ON promotions(venue_id);
CREATE INDEX idx_promotions_is_active ON promotions(is_active);
CREATE INDEX idx_promotions_valid_from ON promotions(valid_from);
CREATE INDEX idx_promotions_valid_until ON promotions(valid_until);

CREATE INDEX idx_geofence_notifications_user_id ON geofence_notifications(user_id);
CREATE INDEX idx_geofence_notifications_venue_id ON geofence_notifications(venue_id);
CREATE INDEX idx_geofence_notifications_is_read ON geofence_notifications(is_read);
CREATE INDEX idx_geofence_notifications_sent_at ON geofence_notifications(sent_at);

-- Create triggers for updated_at
CREATE TRIGGER update_venues_updated_at BEFORE UPDATE ON venues
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_geofences_updated_at BEFORE UPDATE ON geofences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rewards_updated_at BEFORE UPDATE ON rewards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_qr_passports_updated_at BEFORE UPDATE ON qr_passports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_promotions_updated_at BEFORE UPDATE ON promotions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to update QR passport stamp count
CREATE OR REPLACE FUNCTION update_passport_stamp_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE qr_passports 
    SET total_stamps = (
        SELECT COUNT(*) 
        FROM qr_stamps 
        WHERE passport_id = NEW.passport_id 
          AND is_valid = TRUE
    )
    WHERE id = NEW.passport_id;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for passport stamp count
CREATE TRIGGER update_passport_stamp_count_trigger
    AFTER INSERT OR UPDATE ON qr_stamps
    FOR EACH ROW
    EXECUTE FUNCTION update_passport_stamp_count();

-- Create unique constraint for one tier per user
CREATE UNIQUE INDEX idx_user_tiers_user_id_unique ON user_tiers(user_id);

-- Create unique constraint for one passport per user
CREATE UNIQUE INDEX idx_qr_passports_user_id_unique ON qr_passports(user_id);

-- Insert sample venues for testing (Cancún locations)
INSERT INTO venues (
    name, description, street_address, city, state, postal_code,
    latitude, longitude, contact_phone, contact_email, manager_id
) VALUES 
(
    'Mandala Beach Club',
    'Premier beach club and nightlife destination',
    'Blvd. Kukulcan Km 9.5, Zona Hotelera',
    'Cancún',
    'Quintana Roo',
    '77500',
    21.134167,
    -86.747833,
    '+52 998 883 3333',
    'info@mandalabeach.com',
    (SELECT id FROM users WHERE email = 'manager@mandala.local' LIMIT 1)
),
(
    'Mandala Rooftop',
    'Rooftop bar with stunning views',
    'Blvd. Kukulcan Km 9, Zona Hotelera',
    'Cancún',
    'Quintana Roo',
    '77500',
    21.133889,
    -86.746944,
    '+52 998 883 4444',
    'rooftop@mandalabeach.com',
    (SELECT id FROM users WHERE email = 'manager@mandala.local' LIMIT 1)
) ON CONFLICT DO NOTHING; 