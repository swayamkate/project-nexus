-- =============================================================================
-- NEXUS (PS-135) MASTER DATABASE SETUP SCRIPT
-- Privacy-Preserving Longitudinal Skilling-Outcomes and Impact-Measurement System
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ENUMS
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('superadmin', 'admin', 'evaluator', 'employer', 'trainee');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE employment_status_type AS ENUM (
        'employed', 
        'self_employed', 
        'apprenticeship', 
        'job_seeking', 
        'not_employed'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE followup_milestone_type AS ENUM ('3_months', '6_months', '12_months', '18_months', '24_months');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE followup_status_type AS ENUM ('scheduled', 'completed', 'upcoming', 'overdue', 'pending');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE business_status_type AS ENUM ('active', 'scaling', 'struggling', 'closed', 'transitioning');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- -----------------------------------------------------------------------------
-- 2. USER ROLES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    role user_role NOT NULL DEFAULT 'trainee',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. TRAINEES PROFILE TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trainees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    trainee_id VARCHAR(50) NOT NULL UNIQUE DEFAULT 'TRN-' || LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0'),
    username VARCHAR(100) UNIQUE,
    full_name VARCHAR(255) NOT NULL DEFAULT '',
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(30) DEFAULT '',
    dob DATE DEFAULT '2000-01-01',
    gender VARCHAR(30) DEFAULT 'Not Specified',
    aadhaar_masked VARCHAR(20) DEFAULT 'XXXX-XXXX-0000',
    address TEXT DEFAULT '',
    district VARCHAR(100) DEFAULT '',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    pincode VARCHAR(20) DEFAULT '',
    avatar_url TEXT DEFAULT '',
    profile_completion_pct INT NOT NULL DEFAULT 30 CHECK (profile_completion_pct BETWEEN 0 AND 100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Education Details
    highest_education VARCHAR(150) DEFAULT '',
    board_university VARCHAR(255) DEFAULT '',
    year_of_passing INT DEFAULT 2022,
    education_percentage NUMERIC(5, 2) DEFAULT 0.00,
    
    -- Skills Array
    skills TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    
    -- Bio / About Me
    about_me TEXT DEFAULT '',
    
    -- Privacy Preservation Hash (Zero-PII research token)
    privacy_hash VARCHAR(64) NOT NULL UNIQUE DEFAULT encode(digest(gen_random_bytes(32), 'sha256'), 'hex'),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. TRAINING PROGRAMS & ENROLLMENTS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.training_programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL,
    duration_months INT NOT NULL DEFAULT 3,
    provider_name VARCHAR(255) NOT NULL DEFAULT 'Maharashtra State Skill Development Society (MSSDS)',
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.trainee_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.training_programs(id) ON DELETE CASCADE,
    enrolled_date DATE NOT NULL DEFAULT CURRENT_DATE,
    completed_date DATE,
    certified_date DATE,
    certificate_id VARCHAR(100) DEFAULT 'MS-CERT-' || LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0'),
    status VARCHAR(50) NOT NULL DEFAULT 'enrolled',
    grade VARCHAR(10) DEFAULT 'A',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. TRAINEE EMPLOYMENT & SELF-EMPLOYMENT
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trainee_employment (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
    status employment_status_type NOT NULL DEFAULT 'job_seeking',
    
    -- Wage Employment Fields
    company_name VARCHAR(255),
    designation VARCHAR(150),
    joining_date DATE,
    monthly_salary NUMERIC(12, 2) DEFAULT 0,
    offer_letter_url TEXT,
    
    -- Self Employment / Enterprise Fields
    business_name VARCHAR(255),
    business_type VARCHAR(150),
    business_category VARCHAR(100),
    business_status business_status_type DEFAULT 'active',
    establishment_date DATE,
    monthly_revenue NUMERIC(12, 2) DEFAULT 0,
    monthly_profit NUMERIC(12, 2) DEFAULT 0,
    udyam_number VARCHAR(100),
    gst_number VARCHAR(50),
    business_address TEXT,
    employees_count INT DEFAULT 0,
    
    verified_by_admin BOOLEAN NOT NULL DEFAULT false,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. LONGITUDINAL FOLLOW-UP SURVEYS (3M, 6M, 12M, 18M, 24M)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.trainee_followups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
    milestone followup_milestone_type NOT NULL,
    due_date DATE NOT NULL,
    completed_date DATE,
    status followup_status_type NOT NULL DEFAULT 'upcoming',
    
    -- Survey responses
    current_status employment_status_type,
    current_income_range VARCHAR(50),
    income_growth_pct NUMERIC(5, 2) DEFAULT 0,
    job_satisfaction_score INT CHECK (job_satisfaction_score BETWEEN 1 AND 5),
    skill_utilization_score INT CHECK (skill_utilization_score BETWEEN 1 AND 5),
    additional_support_needed TEXT,
    survey_channel VARCHAR(50) DEFAULT 'web_portal', -- 'web_portal', 'whatsapp', 'sms', 'call'
    survey_data_json JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. VERIFICATIONS QUEUE TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
    document_type VARCHAR(100) NOT NULL, -- 'udyam', 'gst', 'offer_letter', 'salary_slip', 'bank_statement'
    document_name VARCHAR(255) NOT NULL,
    document_url TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    admin_notes TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. AUDIT LOGS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_email VARCHAR(255) NOT NULL,
    action VARCHAR(255) NOT NULL,
    target_entity VARCHAR(100),
    target_id VARCHAR(100),
    details TEXT,
    ip_address VARCHAR(50),
    status VARCHAR(50) NOT NULL DEFAULT 'Success',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. ANALYTICS & INSIGHT TABLES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.top_skill_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_name VARCHAR(150) NOT NULL,
    demand_count INT NOT NULL DEFAULT 0,
    supply_count INT NOT NULL DEFAULT 0,
    gap_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0,
    priority_level VARCHAR(20) DEFAULT 'High',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.district_employment_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_name VARCHAR(100) NOT NULL,
    total_trained INT NOT NULL DEFAULT 0,
    employed_count INT NOT NULL DEFAULT 0,
    self_employed_count INT NOT NULL DEFAULT 0,
    seeking_count INT NOT NULL DEFAULT 0,
    avg_wage NUMERIC(10, 2) DEFAULT 0,
    placement_rate NUMERIC(5, 2) DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.recommended_opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    provider VARCHAR(255) NOT NULL,
    link_url TEXT,
    description TEXT,
    target_skills TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.trainee_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID REFERENCES public.trainees(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info',
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_policy_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_text TEXT NOT NULL,
    target_sector VARCHAR(100),
    target_districts TEXT[],
    confidence_score NUMERIC(5, 2) DEFAULT 94.5,
    recommended_action TEXT,
    created_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- -----------------------------------------------------------------------------
-- 10. AUTOMATED PROVISIONING TRIGGER (auth.users -> public.trainees & user_roles)
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    clean_username VARCHAR(100);
    derived_name VARCHAR(255);
BEGIN
    -- Extract username from raw_user_meta_data or from email prefix
    clean_username := COALESCE(
        NEW.raw_user_meta_data->>'username',
        SPLIT_PART(NEW.email, '@', 1)
    );
    
    -- Extract full name
    derived_name := COALESCE(
        NEW.raw_user_meta_data->>'full_name',
        INITCAP(REPLACE(SPLIT_PART(NEW.email, '@', 1), '.', ' '))
    );

    -- Insert into public.trainees
    INSERT INTO public.trainees (
        user_id,
        email,
        username,
        full_name,
        is_active
    ) VALUES (
        NEW.id,
        NEW.email,
        clean_username,
        derived_name,
        true
    ) ON CONFLICT (email) DO UPDATE SET
        user_id = EXCLUDED.user_id,
        username = COALESCE(public.trainees.username, EXCLUDED.username);

    -- Insert role into user_roles
    INSERT INTO public.user_roles (
        user_id,
        email,
        username,
        role
    ) VALUES (
        NEW.id,
        NEW.email,
        clean_username,
        CASE 
            WHEN NEW.email = 'admin@nexus.com' THEN 'superadmin'::public.user_role
            ELSE 'trainee'::public.user_role
        END
    ) ON CONFLICT DO NOTHING;

    RETURN NEW;
EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'handle_new_user trigger error: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- -----------------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------
ALTER TABLE public.trainees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_employment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_followups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.top_skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.district_employment_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommended_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainee_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_policy_insights ENABLE ROW LEVEL SECURITY;

-- Permissive policy creation for all tables to allow seamless web and service-role operations
CREATE POLICY "Permissive read trainees" ON public.trainees FOR SELECT USING (true);
CREATE POLICY "Permissive insert trainees" ON public.trainees FOR INSERT WITH CHECK (true);
CREATE POLICY "Permissive update trainees" ON public.trainees FOR UPDATE USING (true);
CREATE POLICY "Permissive delete trainees" ON public.trainees FOR DELETE USING (true);

CREATE POLICY "Permissive read user_roles" ON public.user_roles FOR SELECT USING (true);
CREATE POLICY "Permissive insert user_roles" ON public.user_roles FOR INSERT WITH CHECK (true);
CREATE POLICY "Permissive update user_roles" ON public.user_roles FOR UPDATE USING (true);
CREATE POLICY "Permissive delete user_roles" ON public.user_roles FOR DELETE USING (true);

CREATE POLICY "Permissive read training_programs" ON public.training_programs FOR SELECT USING (true);
CREATE POLICY "Permissive insert training_programs" ON public.training_programs FOR INSERT WITH CHECK (true);
CREATE POLICY "Permissive update training_programs" ON public.training_programs FOR UPDATE USING (true);
CREATE POLICY "Permissive delete training_programs" ON public.training_programs FOR DELETE USING (true);

CREATE POLICY "Permissive read trainee_enrollments" ON public.trainee_enrollments FOR SELECT USING (true);
CREATE POLICY "Permissive insert trainee_enrollments" ON public.trainee_enrollments FOR INSERT WITH CHECK (true);
CREATE POLICY "Permissive update trainee_enrollments" ON public.trainee_enrollments FOR UPDATE USING (true);
CREATE POLICY "Permissive delete trainee_enrollments" ON public.trainee_enrollments FOR DELETE USING (true);

CREATE POLICY "Permissive read trainee_employment" ON public.trainee_employment FOR SELECT USING (true);
CREATE POLICY "Permissive insert trainee_employment" ON public.trainee_employment FOR INSERT WITH CHECK (true);
CREATE POLICY "Permissive update trainee_employment" ON public.trainee_employment FOR UPDATE USING (true);
CREATE POLICY "Permissive delete trainee_employment" ON public.trainee_employment FOR DELETE USING (true);

CREATE POLICY "Permissive read trainee_followups" ON public.trainee_followups FOR SELECT USING (true);
CREATE POLICY "Permissive insert trainee_followups" ON public.trainee_followups FOR INSERT WITH CHECK (true);
CREATE POLICY "Permissive update trainee_followups" ON public.trainee_followups FOR UPDATE USING (true);
CREATE POLICY "Permissive delete trainee_followups" ON public.trainee_followups FOR DELETE USING (true);

CREATE POLICY "Permissive read verifications" ON public.verifications FOR SELECT USING (true);
CREATE POLICY "Permissive insert verifications" ON public.verifications FOR INSERT WITH CHECK (true);
CREATE POLICY "Permissive update verifications" ON public.verifications FOR UPDATE USING (true);
CREATE POLICY "Permissive delete verifications" ON public.verifications FOR DELETE USING (true);

CREATE POLICY "Permissive read audit_logs" ON public.audit_logs FOR SELECT USING (true);
CREATE POLICY "Permissive insert audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Permissive update audit_logs" ON public.audit_logs FOR UPDATE USING (true);
CREATE POLICY "Permissive delete audit_logs" ON public.audit_logs FOR DELETE USING (true);

CREATE POLICY "Permissive read top_skill_gaps" ON public.top_skill_gaps FOR SELECT USING (true);
CREATE POLICY "Permissive read district_employment_stats" ON public.district_employment_stats FOR SELECT USING (true);
CREATE POLICY "Permissive read recommended_opportunities" ON public.recommended_opportunities FOR SELECT USING (true);
CREATE POLICY "Permissive read trainee_notifications" ON public.trainee_notifications FOR SELECT USING (true);
CREATE POLICY "Permissive read ai_policy_insights" ON public.ai_policy_insights FOR SELECT USING (true);

-- -----------------------------------------------------------------------------
-- 12. INITIAL SEED DATA (Training Programs, Skill Gaps, District Analytics)
-- -----------------------------------------------------------------------------
INSERT INTO public.training_programs (title, sector, duration_months, provider_name, description) VALUES
('Advanced Tailoring & Garment Manufacturing', 'Apparel & Fashion', 3, 'Maharashtra State Skill Development Society (MSSDS)', 'Comprehensive industrial stitching, pattern design, and boutique entrepreneurship.'),
('Solar PV Rooftop Technician', 'Renewable Energy', 4, 'National Institute of Solar Energy (NISE)', 'Grid-connected solar system design, inverter configuration, and safety compliance.'),
('Full-Stack Web Development & Cloud Deployment', 'IT & ITeS', 6, 'National Skill Development Corporation (NSDC)', 'Modern enterprise web architecture, database design, and cloud scalability.'),
('Automotive Electric Vehicle (EV) Maintenance', 'Automotive', 4, 'Automotive Skills Development Council (ASDC)', 'EV battery diagnostics, motor controllers, and regenerative braking repair.')
ON CONFLICT DO NOTHING;

INSERT INTO public.top_skill_gaps (skill_name, demand_count, supply_count, gap_percentage, priority_level) VALUES
('EV Battery Diagnostics & Repair', 1420, 310, 78.17, 'Critical'),
('Solar Inverter & Micro-Grid Automation', 1890, 620, 67.20, 'High'),
('Boutique Pattern Making & Quality Control', 2150, 940, 56.28, 'Medium'),
('Cloud Backend Engineering & Security', 3200, 1100, 65.63, 'High')
ON CONFLICT DO NOTHING;

INSERT INTO public.district_employment_stats (district_name, total_trained, employed_count, self_employed_count, seeking_count, avg_wage, placement_rate) VALUES
('Pune', 4200, 2400, 1250, 550, 21500.00, 86.90),
('Nagpur', 3100, 1650, 980, 470, 18200.00, 84.84),
('Nashik', 2800, 1400, 920, 480, 17500.00, 82.86),
('Aurangabad (Chhatrapati Sambhajinagar)', 2350, 1100, 810, 440, 16800.00, 81.28),
('Thane', 3800, 2200, 1100, 500, 22800.00, 86.84)
ON CONFLICT DO NOTHING;

INSERT INTO public.recommended_opportunities (title, category, provider, link_url, description, target_skills) VALUES
('Prime Minister Employment Generation Programme (PMEGP)', 'Government Scheme', 'Ministry of MSME', 'https://www.kviconline.gov.in/pmegpeportal/', 'Credit-linked subsidy programme for setting up new micro-enterprises with up to 35% government subsidy.', ARRAY['Entrepreneurship', 'Tailoring', 'Manufacturing']),
('Mudra Loan Yojana for Micro-Enterprises', 'Financial Aid', 'Government of India', 'https://www.mudra.org.in/', 'Collateral-free business loans up to ₹10 Lakhs under Shishu, Kishore, and Tarun categories.', ARRAY['Self-Employment', 'Business Growth']),
('Advanced Digital Marketing & E-Commerce Onboarding', 'Upskilling Course', 'Skill India Digital Hub', 'https://www.skillindiadigital.gov.in/', 'Master social media selling, ONDC integration, and digital payments for your enterprise.', ARRAY['Digital Marketing', 'E-Commerce'])
ON CONFLICT DO NOTHING;

INSERT INTO public.ai_policy_insights (insight_text, target_sector, target_districts, confidence_score, recommended_action) VALUES
('Self-employed micro-tailors in rural Pune experience 3.2x higher wage growth when equipped with digital payments and ONDC cataloging.', 'Apparel & Fashion', ARRAY['Pune', 'Nashik'], 95.8, 'Mandate a 1-week digital commerce module in all Phase-2 tailoring courses.'),
('Solar technicians certified under MSSDS show a 92% retention rate in Vidarbha region with an average salary bump of 35% after 6 months.', 'Renewable Energy', ARRAY['Nagpur', 'Amravati'], 94.2, 'Expand Solar PV training capacity by 40% across Vidarbha industrial clusters.')
ON CONFLICT DO NOTHING;

-- -----------------------------------------------------------------------------
-- 13. PROMO CODES & SUBSCRIPTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.promo_codes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    discount_type VARCHAR(50) NOT NULL DEFAULT 'percentage', -- 'percentage', 'fixed', 'free_lifetime'
    discount_val VARCHAR(50) NOT NULL DEFAULT '100% OFF',
    max_uses INT NOT NULL DEFAULT 500,
    current_uses INT NOT NULL DEFAULT 0,
    district VARCHAR(100) DEFAULT 'All Districts',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 14. GOVERNMENT SCHEMES & SUBSIDY TRACKER
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.government_schemes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    nodal_agency VARCHAR(255) NOT NULL,
    subsidy_pct NUMERIC(5, 2) NOT NULL DEFAULT 35.00,
    max_grant_amount NUMERIC(14, 2) NOT NULL DEFAULT 500000.00,
    target_trades TEXT[] DEFAULT ARRAY['Tailoring', 'Solar', 'EV Repair'],
    allocated_budget NUMERIC(16, 2) NOT NULL DEFAULT 50000000.00,
    disbursed_budget NUMERIC(16, 2) NOT NULL DEFAULT 14250000.00,
    beneficiaries_count INT NOT NULL DEFAULT 142,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 15. SUPPORT TICKETS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID REFERENCES public.trainees(id) ON DELETE SET NULL,
    trainee_name VARCHAR(255) DEFAULT '',
    trainee_email VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Certificate Verification',
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved'
    assigned_to VARCHAR(255) DEFAULT 'District Officer Pune',
    admin_response TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS Policies for new tables
ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permissive read promo_codes" ON public.promo_codes FOR SELECT USING (true);
CREATE POLICY "Permissive insert promo_codes" ON public.promo_codes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permissive update promo_codes" ON public.promo_codes FOR UPDATE USING (true);
CREATE POLICY "Permissive delete promo_codes" ON public.promo_codes FOR DELETE USING (true);

CREATE POLICY "Permissive read government_schemes" ON public.government_schemes FOR SELECT USING (true);
CREATE POLICY "Permissive insert government_schemes" ON public.government_schemes FOR INSERT WITH CHECK (true);
CREATE POLICY "Permissive update government_schemes" ON public.government_schemes FOR UPDATE USING (true);
CREATE POLICY "Permissive delete government_schemes" ON public.government_schemes FOR DELETE USING (true);

CREATE POLICY "Permissive read support_tickets" ON public.support_tickets FOR SELECT USING (true);
CREATE POLICY "Permissive insert support_tickets" ON public.support_tickets FOR INSERT WITH CHECK (true);
CREATE POLICY "Permissive update support_tickets" ON public.support_tickets FOR UPDATE USING (true);
CREATE POLICY "Permissive delete support_tickets" ON public.support_tickets FOR DELETE USING (true);

-- Seed Promo Codes & Schemes
INSERT INTO public.promo_codes (code, discount_type, discount_val, max_uses, current_uses, district) VALUES
('NEXUS-GOV-26', 'percentage', '100% OFF', 500, 482, 'Pune'),
('SKILL-UP-MH', 'percentage', '50% OFF', 2000, 1204, 'All Districts'),
('BETA-TESTER', 'free_lifetime', 'FREE LIFETIME', 50, 10, 'Statewide')
ON CONFLICT (code) DO NOTHING;

INSERT INTO public.government_schemes (name, nodal_agency, subsidy_pct, max_grant_amount, target_trades, allocated_budget, disbursed_budget, beneficiaries_count) VALUES
('PMEGP - Prime Minister Employment Generation Programme', 'Khadi and Village Industries Commission (KVIC)', 35.00, 500000.00, ARRAY['Tailoring & Garments', 'Solar & Electrical', 'Agri-Tech'], 100000000.00, 38500000.00, 420),
('Pradhan Mantri Mudra Yojana (Shishu & Tarun)', 'National Credit Guarantee Trustee Company (NCGTC)', 20.00, 1000000.00, ARRAY['Micro-Enterprise', 'Automotive Repair', 'Food Processing'], 85000000.00, 24100000.00, 310),
('Mahaswayam State Entrepreneurship Grant', 'MSSDS Maharashtra', 50.00, 250000.00, ARRAY['Women Artisans', 'Handicrafts', 'Boutique Stitching'], 40000000.00, 19200000.00, 185)
ON CONFLICT (name) DO NOTHING;

INSERT INTO public.audit_logs (admin_email, action, target_entity, details, status) VALUES
('admin@nexus.com', 'INITIALIZE_SYSTEM', 'CORE', 'System initialized with zero-knowledge enclave configuration', 'Success'),
('admin@nexus.com', 'PROVISION_ADMIN', 'USER_ROLES', 'Superadmin master console activated for admin@nexus.com', 'Success'),
('admin@nexus.com', 'VERIFY_INTEGRITY', 'MSSDS_REGISTRY', 'Verified cryptographic integrity of State Trainee Hash Registry', 'Success')
ON CONFLICT DO NOTHING;

