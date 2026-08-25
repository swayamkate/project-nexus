# Nexus: Context Ledger & Architecture Source of Truth
**Problem Statement PS-135**: Privacy-Preserving, Longitudinal Skilling-Outcomes and Impact-Measurement System  
**Application Name**: Nexus  
**Status**: Initialized & Schema Ready  
**Last Updated**: 2026-08-25  

---

## 1. System Architecture & Tech Stack

| Layer | Technologies | Purpose / Role |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router), React 19, TypeScript | High-performance server/client rendered UI with typed route handlers |
| **Styling & Design System** | Tailwind CSS v4, Lucide Icons, Shadcn UI patterns | Accessible, modern, dark/light responsive interface with clean typography |
| **Data Visualization** | Recharts, Lucide Icons | Longitudinal wage trajectories, retention curves, state geospatial heatmaps |
| **Database & Identity** | PostgreSQL (Self-Hosted Supabase / Cloud Supabase), Supabase Auth | Relational schema with Row Level Security (RLS) and cryptographic hashes |
| **Privacy Preservation** | SHA-256 Hashing, Differential Privacy aggregation, Role Masking | Public dashboards show zero PII; aggregates masked at $k \ge 5$ threshold |
| **Automation Engine** | Next.js Webhook API routes (`/api/webhooks/whatsapp`) | Automated longitudinal surveys (M+1, M+3, M+6, M+12) and follow-up logging |

---

## 2. Relational PostgreSQL Database Schema (DDL)

```sql
-- =============================================================================
-- NEXUS: PS-135 LONGITUDINAL SKILLING OUTCOMES DATABASE SCHEMA
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------
CREATE TYPE user_role AS ENUM ('trainee', 'employer', 'evaluator', 'admin');
CREATE TYPE employment_type AS ENUM ('permanent', 'temporary', 'contract', 'self_employed', 'unemployed', 'internship');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected', 'flagged');
CREATE TYPE attrition_reason AS ENUM (
  'voluntary_upskilling',
  'layoff',
  'contract_expired',
  'removed_no_reason',
  'compensation',
  'work_environment',
  'health_personal',
  'relocation',
  'business_failure',
  'other'
);
CREATE TYPE followup_channel AS ENUM ('whatsapp', 'sms', 'email', 'in_app');
CREATE TYPE followup_status AS ENUM ('scheduled', 'sent', 'delivered', 'responded', 'failed', 'expired');
CREATE TYPE skill_category AS ENUM ('technical', 'soft_skill', 'domain_knowledge', 'tool_proficiency', 'certification');

-- -----------------------------------------------------------------------------
-- 1. USERS & PRIVACY-PRESERVING PROFILES
-- -----------------------------------------------------------------------------
CREATE TABLE profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE, -- Foreign key to supabase auth.users
    email VARCHAR(255) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role user_role NOT NULL DEFAULT 'trainee',
    -- Privacy-Preserving Token for public/aggregate research (zero PII exposure)
    privacy_hash VARCHAR(64) NOT NULL UNIQUE DEFAULT encode(digest(gen_random_bytes(32), 'sha256'), 'hex'),
    -- Geospatial & demographic indicators
    state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    district VARCHAR(100) NOT NULL DEFAULT 'Mumbai Suburban',
    pincode VARCHAR(10),
    gender VARCHAR(30),
    education_level VARCHAR(100),
    baseline_income NUMERIC(12, 2) DEFAULT 0.00,
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. SKILL TAXONOMY & ROLE REQUIREMENTS ENGINE
-- -----------------------------------------------------------------------------
CREATE TABLE skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL UNIQUE,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category skill_category NOT NULL DEFAULT 'technical',
    description TEXT,
    difficulty_level INT NOT NULL DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
    market_demand_index NUMERIC(3, 2) DEFAULT 0.80, -- 0.00 to 1.00
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE roles_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL UNIQUE,
    industry VARCHAR(100) NOT NULL,
    average_starting_salary NUMERIC(12, 2) NOT NULL,
    growth_rate_pct NUMERIC(5, 2) DEFAULT 12.50,
    typical_learning_hours INT NOT NULL DEFAULT 120,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE role_skill_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles_catalog(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    required_proficiency INT NOT NULL DEFAULT 3 CHECK (required_proficiency BETWEEN 1 AND 5),
    is_mandatory BOOLEAN NOT NULL DEFAULT true,
    weight NUMERIC(3, 2) NOT NULL DEFAULT 1.0,
    CONSTRAINT unique_role_skill UNIQUE (role_id, skill_id)
);

CREATE TABLE trainee_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
    proficiency_level INT NOT NULL DEFAULT 1 CHECK (proficiency_level BETWEEN 1 AND 5),
    is_verified BOOLEAN NOT NULL DEFAULT false,
    verified_at TIMESTAMPTZ,
    badge_certificate_url TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_trainee_skill UNIQUE (trainee_id, skill_id)
);

-- -----------------------------------------------------------------------------
-- 3. TARGET CAREER & ESTIMATED DAYS CALCULATION
-- -----------------------------------------------------------------------------
CREATE TABLE trainee_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    target_role_id UUID NOT NULL REFERENCES roles_catalog(id) ON DELETE CASCADE,
    target_company_name VARCHAR(150),
    daily_study_hours NUMERIC(3, 1) NOT NULL DEFAULT 2.0,
    skill_gap_percentage NUMERIC(5, 2) NOT NULL DEFAULT 100.0,
    estimated_days_to_goal INT NOT NULL DEFAULT 60,
    status VARCHAR(50) NOT NULL DEFAULT 'in_progress',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. VERIFIED COURSES & BADGES
-- -----------------------------------------------------------------------------
CREATE TABLE courses_catalog (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    provider_name VARCHAR(150) NOT NULL,
    duration_hours INT NOT NULL DEFAULT 30,
    skills_covered JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of skill IDs & proficiency
    badge_hash VARCHAR(100),
    course_url TEXT,
    verification_standard VARCHAR(100) DEFAULT 'NSDC_Aligned',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE trainee_courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses_catalog(id) ON DELETE CASCADE,
    progress_percentage INT NOT NULL DEFAULT 0 CHECK (progress_percentage BETWEEN 0 AND 100),
    verification_status verification_status NOT NULL DEFAULT 'pending',
    completed_at TIMESTAMPTZ,
    certificate_id VARCHAR(100),
    issued_badge_hash VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. LONGITUDINAL EMPLOYMENT, WAGE PROGRESSION & ATTRITION LOGGING
-- -----------------------------------------------------------------------------
CREATE TABLE employment_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    job_title VARCHAR(150) NOT NULL,
    employment_type employment_type NOT NULL DEFAULT 'permanent',
    is_current BOOLEAN NOT NULL DEFAULT true,
    start_date DATE NOT NULL,
    end_date DATE,
    starting_monthly_wage NUMERIC(12, 2) NOT NULL,
    current_monthly_wage NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    state VARCHAR(100),
    district VARCHAR(100),
    offer_letter_url TEXT,
    verification_status verification_status NOT NULL DEFAULT 'pending',
    verified_by UUID REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE wage_progression_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employment_record_id UUID NOT NULL REFERENCES employment_records(id) ON DELETE CASCADE,
    trainee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
    monthly_wage NUMERIC(12, 2) NOT NULL,
    wage_increment_pct NUMERIC(5, 2) DEFAULT 0.0,
    proof_doc_url TEXT,
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE attrition_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employment_record_id UUID NOT NULL REFERENCES employment_records(id) ON DELETE CASCADE,
    trainee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    exit_date DATE NOT NULL,
    tenure_days INT NOT NULL,
    primary_reason attrition_reason NOT NULL,
    specific_explanation TEXT, -- Handles "removed for no reason" or workplace circumstances
    was_severance_paid BOOLEAN DEFAULT false,
    next_expected_step VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. SELF-EMPLOYMENT VALIDATION MODULE
-- -----------------------------------------------------------------------------
CREATE TABLE self_employment_validations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL,
    business_type VARCHAR(100) NOT NULL, -- Sole Proprietorship, Freelancer, Agency, etc.
    trade_license_number VARCHAR(100),
    gst_udyam_tax_id VARCHAR(100),
    business_identity_doc_url TEXT,
    -- Proof of Income
    proof_of_income_type VARCHAR(50), -- Bank Statement, GST Return, Invoice Pack
    proof_of_income_doc_url TEXT,
    reported_monthly_revenue NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    verified_monthly_revenue NUMERIC(12, 2),
    -- Digital Footprint
    portfolio_url TEXT,
    upwork_profile_url TEXT,
    fiverr_profile_url TEXT,
    freelance_platform_rating NUMERIC(3, 2),
    -- Status
    verification_status verification_status NOT NULL DEFAULT 'pending',
    reviewer_notes TEXT,
    reviewed_by UUID REFERENCES profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE client_references (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    self_employment_id UUID NOT NULL REFERENCES self_employment_validations(id) ON DELETE CASCADE,
    client_name VARCHAR(150) NOT NULL,
    client_company VARCHAR(150),
    client_email VARCHAR(200),
    client_phone VARCHAR(20),
    work_scope_description TEXT,
    invoice_amount NUMERIC(12, 2),
    reference_letter_url TEXT,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    verification_timestamp TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. COMMUNITY & FEEDBACK HUB (GLASSDOOR-STYLE INSIGHTS)
-- -----------------------------------------------------------------------------
CREATE TABLE interview_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_name VARCHAR(200) NOT NULL,
    role_title VARCHAR(150) NOT NULL,
    author_privacy_hash VARCHAR(64) NOT NULL,
    difficulty_rating INT CHECK (difficulty_rating BETWEEN 1 AND 5),
    interview_outcome VARCHAR(50), -- 'Offer Accepted', 'Offer Declined', 'No Offer'
    questions_asked JSONB NOT NULL DEFAULT '[]'::jsonb, -- Array of strings/q-objs
    hiring_process_review TEXT NOT NULL,
    recommended_skills TEXT[],
    is_anonymous BOOLEAN NOT NULL DEFAULT true,
    upvotes INT NOT NULL DEFAULT 0,
    is_moderated BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. AUTOMATED LONGITUDINAL FOLLOW-UP & WHATSAPP WEBHOOK ENGINE
-- -----------------------------------------------------------------------------
CREATE TABLE automated_followups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    checkpoint_milestone VARCHAR(20) NOT NULL, -- 'M+1', 'M+3', 'M+6', 'M+12'
    channel followup_channel NOT NULL DEFAULT 'whatsapp',
    phone_number VARCHAR(20) NOT NULL,
    scheduled_for TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    status followup_status NOT NULL DEFAULT 'scheduled',
    trigger_message_body TEXT NOT NULL,
    response_received_at TIMESTAMPTZ,
    raw_response_text TEXT,
    parsed_employment_status employment_type,
    parsed_current_wage NUMERIC(12, 2),
    parsed_attrition_reason attrition_reason,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE webhook_events_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider VARCHAR(50) NOT NULL DEFAULT 'whatsapp',
    event_type VARCHAR(100) NOT NULL,
    payload JSONB NOT NULL,
    headers JSONB,
    processed_status VARCHAR(50) NOT NULL DEFAULT 'received',
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. PERFORMANCE & GEOSPATIAL ANALYTICS (INDEXES & VIEWS)
-- -----------------------------------------------------------------------------
CREATE INDEX idx_profiles_location ON profiles(state, district);
CREATE INDEX idx_employment_trainee ON employment_records(trainee_id, is_current);
CREATE INDEX idx_wage_logs_trainee ON wage_progression_logs(trainee_id, recorded_at);
CREATE INDEX idx_attrition_reason ON attrition_logs(primary_reason);
CREATE INDEX idx_followups_schedule ON automated_followups(status, scheduled_for);

-- View for Geospatial Placement and Wage Growth (differential privacy aggregated)
CREATE OR REPLACE VIEW v_geospatial_placement_summary AS
SELECT 
    p.state,
    p.district,
    COUNT(DISTINCT p.id) AS total_trainees,
    COUNT(DISTINCT CASE WHEN er.is_current = true THEN er.trainee_id END) AS currently_employed_count,
    ROUND(
        (COUNT(DISTINCT CASE WHEN er.is_current = true THEN er.trainee_id END)::NUMERIC / NULLIF(COUNT(DISTINCT p.id), 0)) * 100, 
        2
    ) AS placement_rate_pct,
    ROUND(AVG(er.current_monthly_wage), 2) AS average_current_wage,
    ROUND(AVG(er.current_monthly_wage - er.starting_monthly_wage), 2) AS average_wage_gain,
    COUNT(DISTINCT CASE WHEN er.employment_type = 'permanent' THEN er.id END) AS permanent_jobs,
    COUNT(DISTINCT CASE WHEN er.employment_type = 'self_employed' THEN er.id END) AS self_employed_jobs,
    COUNT(DISTINCT CASE WHEN er.employment_type = 'temporary' THEN er.id END) AS temporary_jobs
FROM profiles p
LEFT JOIN employment_records er ON p.id = er.trainee_id
GROUP BY p.state, p.district;
```

---

## 3. Detailed Feature Roadmap & Modules

### Module 1: Trainee Portal & Skill Mapping Engine
- [ ] User Profile & Onboarding with Role-based Authentication.
- [ ] Target Job & Target Company Selection Engine (Catalog of 20+ High-Growth Roles across Tech, EV, Solar, Healthcare, Modern Trades).
- [ ] Real-time Skill Gap Analyzer (Comparing trainee verified/declared skills against target role matrix).
- [ ] Dynamic Course & Badge Recommendation Pipeline.
- [ ] "Estimated Days to Achieve Goal" algorithmic calculation based on learning hours per day and weighted skill gap.

### Module 2: Longitudinal Tracking, Verification & Attrition Logging
- [ ] Verified Digital Badges for completed certified courses.
- [ ] Longitudinal Career Timeline (Permanent, Temporary, Contractual, Gig).
- [ ] Wage Progression Tracker with longitudinal chart, percentage growth, and baseline-to-present ROI.
- [ ] Attrition Logging Module with structured reason capture (including "removed for no reason", layoff, wage dissatisfaction).
- [ ] Verification badge workflow for employer validation of offer letters / experience.

### Module 3: Self-Employment Validation Module
- [ ] Self-Employment Multi-Factor Verification Workflow.
- [ ] Business Identity verification (Trade License, GST / Udyam registration ID).
- [ ] Income Proof verification (Invoice bundles, bank statements, revenue band classification).
- [ ] Digital Footprint validator (Portfolio URL, Upwork/Fiverr/GitHub profiles).
- [ ] Client References management & verification status tracker.

### Module 4: Community & Feedback Hub
- [ ] Glassdoor-style Interview Question repository tied to companies & roles.
- [ ] Real interview experiences, difficulty ratings, and round-by-round breakdown.
- [ ] Anonymized salary and benefits community benchmarks.
- [ ] Peer upvoting and verified trainee reviews.

### Module 5: Admin Performance Dashboard & Geospatial Analytics
- [ ] Executive Metrics: Placement Rate, Average Wage Multiple, Longitudinal Retention Curve.
- [ ] State and District level Geospatial heatmaps of skilling outcomes and job stability.
- [ ] Permanent vs. Temporary vs. Self-employed distribution analytics.
- [ ] Attrition Analysis dashboard identifying systemic failure points (e.g. sectors with high "removed for no reason" rates).
- [ ] Automated Webhook Queue Monitor (WhatsApp follow-up delivery & response rates).

### Module 6: Automation & Webhook Follow-up Engine
- [ ] Next.js API route `/api/webhooks/whatsapp` simulating and handling real two-way WhatsApp survey bots.
- [ ] Automated longitudinal scheduler checking in at M+1, M+3, M+6, M+12.
- [ ] Natural language / structured survey response ingestion into `wage_progression_logs` and `attrition_logs`.

---

## 4. Completed Feature Log
*Note: This section is updated after each implementation milestone.*

- [x] **Project Initialization**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Lucide Icons, Recharts, Supabase Client installed.
- [x] **Ledger Creation**: Root `context.md` created with complete Tech Stack, Schema, and Roadmap.
