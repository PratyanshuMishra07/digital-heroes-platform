-- ================================================================
-- DIGITAL HEROES PLATFORM - SUPABASE POSTGRESQL SCHEMA
-- Edition 2026 - Trainee Selection Assignment
-- ================================================================

-- Enable UUID generation extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CHARITIES TABLE (§ 08)
CREATE TABLE IF NOT EXISTS charities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT NOT NULL,
    image_url TEXT NOT NULL,
    is_featured BOOLEAN DEFAULT false,
    upcoming_events JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. USERS / PROFILES TABLE (§ 03, § 04, § 08)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'subscriber' CHECK (role IN ('subscriber', 'admin')),
    subscription_status VARCHAR(50) DEFAULT 'active' CHECK (subscription_status IN ('active', 'inactive', 'canceled')),
    subscription_plan VARCHAR(50) DEFAULT 'monthly' CHECK (subscription_plan IN ('monthly', 'yearly')),
    renewal_date DATE DEFAULT (CURRENT_DATE + INTERVAL '1 month'),
    charity_id UUID REFERENCES charities(id) ON DELETE SET NULL,
    charity_percentage INT DEFAULT 10 CHECK (charity_percentage >= 10),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SCORES TABLE (§ 05)
-- Enforces Stableford range (1 to 45) and 1 score per date per user
CREATE TABLE IF NOT EXISTS scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    score INT NOT NULL CHECK (score >= 1 AND score <= 45),
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_score_per_date UNIQUE (user_id, date)
);

-- 4. DRAWS TABLE (§ 06, § 07)
CREATE TABLE IF NOT EXISTS draws (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_date DATE NOT NULL DEFAULT CURRENT_DATE,
    draw_mode VARCHAR(50) DEFAULT 'random' CHECK (draw_mode IN ('random', 'algorithmic')),
    winning_numbers INT[] NOT NULL,
    total_pool NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tier5_jackpot NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tier4_pool NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tier3_pool NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) DEFAULT 'published' CHECK (status IN ('simulated', 'published')),
    rollover_amount NUMERIC(12, 2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. WINNER CLAIMS & VERIFICATION TABLE (§ 09)
CREATE TABLE IF NOT EXISTS winner_claims (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    draw_id UUID REFERENCES draws(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
    tier VARCHAR(50) NOT NULL CHECK (tier IN ('tier5', 'tier4', 'tier3')),
    matched_count INT NOT NULL CHECK (matched_count IN (3, 4, 5)),
    prize_amount NUMERIC(12, 2) NOT NULL,
    proof_image_url TEXT,
    verification_status VARCHAR(50) DEFAULT 'pending_proof' 
        CHECK (verification_status IN ('pending_proof', 'under_review', 'approved', 'rejected', 'paid')),
    admin_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ================================================================
-- INITIAL SEED DATA FOR TESTING / EVALUATION
-- ================================================================

-- Insert sample charities
INSERT INTO charities (name, tagline, description, image_url, is_featured, upcoming_events) VALUES
(
    'Youth Golf & Dreams Foundation',
    'Empowering underprivileged youth through mentorship & sports',
    'Providing golf equipment, educational coaching, and tournament access to young athletes from underserved communities.',
    'https://images.unsplash.com/photo-1593111774240-d529f12cf4bb?auto=format&fit=crop&w=800&q=80',
    true,
    '[{"title": "Junior Open Invitational", "date": "2026-04-12", "location": "Augusta Meadow"}]'::jsonb
),
(
    'GreenFairway Wildlife Sanctuary',
    'Preserving biodiversity around community recreational lands',
    'Dedicated to protecting wetland ecosystems, pollinator habitats, and native trees located across community green spaces.',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
    false,
    '[{"title": "Earth Day Charity Scramble", "date": "2026-04-22", "location": "Pine Valley Links"}]'::jsonb
),
(
    'Veterans Rehabilitation Links',
    'Adaptive golf and psychological recovery for wounded veterans',
    'Using sport and camaraderie to help veterans recover from physical trauma and PTSD.',
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
    true,
    '[{"title": "Honor & Drive Pro-Am", "date": "2026-05-15", "location": "Heritage Golf Club"}]'::jsonb
);
