-- =============================================================================
-- MIGRATION 001: INITIAL SCHEMA WITH STRICT CONSTRAINTS & DATA INTEGRITY
-- MahaSkill Track / Nexus (SIH 2026 - PS-135)
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enum Types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('trainee', 'admin', 'district_officer', 'evaluator', 'superadmin');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE employment_status AS ENUM ('employed', 'self_employed', 'apprenticeship', 'job_seeking', 'not_employed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE business_status AS ENUM ('active', 'scaling', 'struggling', 'closed', 'transitioning');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'flagged');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE survey_milestone AS ENUM ('3M', '6M', '12M', '18M', '24M');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 1. PROFILES & TRAINEES
CREATE TABLE IF NOT EXISTS trainees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE,
    trainee_id VARCHAR(50) NOT NULL UNIQUE,
    username VARCHAR(50) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20),
    dob DATE,
    gender VARCHAR(30) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    aadhaar_masked VARCHAR(20) DEFAULT 'XXXX-XXXX-1234',
    address TEXT,
    district VARCHAR(100) NOT NULL DEFAULT 'Pune',
    state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    pincode VARCHAR(10),
    avatar_url TEXT,
    profile_completion_pct INT NOT NULL DEFAULT 85 CHECK (profile_completion_pct BETWEEN 0 AND 100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    highest_education VARCHAR(100) DEFAULT '12th (Science)',
    board_university VARCHAR(150) DEFAULT 'Maharashtra State Board',
    year_of_passing INT CHECK (year_of_passing BETWEEN 1970 AND 2035),
    education_percentage NUMERIC(5, 2) CHECK (education_percentage BETWEEN 0 AND 100),
    skills TEXT[] DEFAULT ARRAY['Tailoring', 'Stitching', 'Pattern Making']::TEXT[],
    about_me TEXT,
    privacy_hash VARCHAR(64) NOT NULL UNIQUE DEFAULT encode(digest(gen_random_bytes(32), 'sha256'), 'hex'),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. EMPLOYMENT & MSME OUTCOMES
CREATE TABLE IF NOT EXISTS trainee_employment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    status employment_status NOT NULL DEFAULT 'self_employed',
    company_name VARCHAR(150),
    designation VARCHAR(100),
    monthly_salary NUMERIC(12, 2) DEFAULT 0.00 CHECK (monthly_salary >= 0),
    business_name VARCHAR(150),
    business_type VARCHAR(100),
    business_category VARCHAR(50) DEFAULT 'Micro',
    business_status business_status NOT NULL DEFAULT 'active',
    establishment_date DATE,
    monthly_revenue NUMERIC(12, 2) DEFAULT 0.00 CHECK (monthly_revenue >= 0),
    monthly_profit NUMERIC(12, 2) DEFAULT 0.00 CHECK (monthly_profit >= 0),
    monthly_income_range VARCHAR(50) DEFAULT '₹10,000 – ₹20,000',
    employee_count INT NOT NULL DEFAULT 0 CHECK (employee_count >= 0),
    udyam_reg_number VARCHAR(50),
    gst_number VARCHAR(30),
    bank_loan_availed BOOLEAN NOT NULL DEFAULT FALSE,
    bank_loan_scheme VARCHAR(100),
    loan_amount NUMERIC(12, 2) DEFAULT 0.00 CHECK (loan_amount >= 0),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. TRAINING PROGRAMS & NSQF CATALOG
CREATE TABLE IF NOT EXISTS training_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    duration_months INT NOT NULL CHECK (duration_months > 0),
    provider_name VARCHAR(150) NOT NULL,
    description TEXT,
    nsqf_level INT DEFAULT 4 CHECK (nsqf_level BETWEEN 1 AND 10),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. TRAINEE ENROLLMENTS
CREATE TABLE IF NOT EXISTS trainee_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE RESTRICT,
    enrolled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completion_date DATE,
    grade VARCHAR(50) DEFAULT 'Grade A+ (Distinction)',
    certificate_id VARCHAR(100) UNIQUE,
    status VARCHAR(50) NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'in_progress', 'completed', 'dropped')),
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. VERIFICATIONS QUEUE (IDENTITY & MSME)
CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL,
    document_url TEXT NOT NULL,
    status verification_status NOT NULL DEFAULT 'pending',
    verified_by UUID,
    verified_at TIMESTAMPTZ,
    rejection_reason TEXT,
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. LONGITUDINAL FOLLOWUPS & CADENCE SURVEYS
CREATE TABLE IF NOT EXISTS trainee_followups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    milestone survey_milestone NOT NULL,
    due_date DATE NOT NULL,
    completed_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'overdue', 'escalated')),
    current_status VARCHAR(100),
    current_income_range VARCHAR(50),
    job_satisfaction_score INT CHECK (job_satisfaction_score BETWEEN 1 AND 5),
    skill_utilization_score INT CHECK (skill_utilization_score BETWEEN 1 AND 5),
    remarks TEXT,
    channel VARCHAR(30) DEFAULT 'in_app',
    deleted_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. IMMUTABLE AUDIT LOG
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    action VARCHAR(100) NOT NULL,
    performed_by VARCHAR(150) NOT NULL,
    target VARCHAR(150),
    details TEXT,
    ip_address VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
