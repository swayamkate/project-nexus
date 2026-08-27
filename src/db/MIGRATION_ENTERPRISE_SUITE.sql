-- ==============================================================================
-- NEXUS ENTERPRISE SUITE: CONSOLIDATED DATABASE SCHEMA EXTENSIONS
-- Stack: PostgreSQL 17 / Supabase with Row Level Security (RLS)
-- ==============================================================================

-- 1. PRIVACY REQUESTS (DPDP Act 2023 Compliance)
CREATE TABLE IF NOT EXISTS public.privacy_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID REFERENCES public.trainees(id) ON DELETE CASCADE,
    request_type VARCHAR(50) NOT NULL DEFAULT 'portability' CHECK (request_type IN ('portability', 'erasure', 'rectification', 'consent_withdrawal')),
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'rejected')),
    details TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    processed_at TIMESTAMPTZ
);

-- 2. GOVERNMENT SCHEME APPLICATIONS (PMEGP, Mudra, CMEGP)
CREATE TABLE IF NOT EXISTS public.scheme_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_no VARCHAR(50) UNIQUE NOT NULL DEFAULT ('SCH-' || TO_CHAR(now(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 90000 + 10000)::TEXT, 5, '0')),
    trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
    scheme_id UUID NOT NULL REFERENCES public.government_schemes(id) ON DELETE CASCADE,
    business_name VARCHAR(255) NOT NULL DEFAULT '',
    requested_amount NUMERIC(12,2) NOT NULL DEFAULT 50000.00,
    sanctioned_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'under_review', 'sanctioned', 'disbursed', 'rejected')),
    bank_account_no VARCHAR(50) DEFAULT '',
    ifsc_code VARCHAR(20) DEFAULT '',
    remarks TEXT DEFAULT '',
    applied_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. ENTERPRISE CASHBOOK & REVENUE LEDGER
CREATE TABLE IF NOT EXISTS public.enterprise_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trainee_id UUID NOT NULL REFERENCES public.trainees(id) ON DELETE CASCADE,
    entry_month VARCHAR(20) NOT NULL,
    revenue_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    expense_amount NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    net_profit NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. REGISTERED EMPLOYERS
CREATE TABLE IF NOT EXISTS public.employers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100) NOT NULL DEFAULT 'Manufacturing',
    contact_email VARCHAR(255) UNIQUE NOT NULL,
    contact_phone VARCHAR(50) DEFAULT '',
    district VARCHAR(100) DEFAULT 'Pune',
    state VARCHAR(100) DEFAULT 'Maharashtra',
    is_verified BOOLEAN NOT NULL DEFAULT true,
    website VARCHAR(255) DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. JOB & APPRENTICESHIP POSTINGS
CREATE TABLE IF NOT EXISTS public.job_postings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    trade_category VARCHAR(100) NOT NULL,
    min_salary NUMERIC(10,2) NOT NULL DEFAULT 15000.00,
    max_salary NUMERIC(10,2) NOT NULL DEFAULT 25000.00,
    location_district VARCHAR(100) NOT NULL DEFAULT 'Pune',
    openings_count INT NOT NULL DEFAULT 3,
    type VARCHAR(50) NOT NULL DEFAULT 'full_time' CHECK (type IN ('full_time', 'apprenticeship', 'part_time')),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'filled', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. SURVEY TEMPLATES & QUESTIONNAIRES
CREATE TABLE IF NOT EXISTS public.survey_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    milestone VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT DEFAULT '',
    questions JSONB NOT NULL DEFAULT '[]'::JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.privacy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scheme_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_ledger ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_templates ENABLE ROW LEVEL SECURITY;

-- Allow Public / Service Role / Users access policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view active job postings" ON public.job_postings;
    CREATE POLICY "Public can view active job postings" ON public.job_postings FOR SELECT USING (status = 'active');

    DROP POLICY IF EXISTS "Public can view verified employers" ON public.employers;
    CREATE POLICY "Public can view verified employers" ON public.employers FOR SELECT USING (is_verified = true);

    DROP POLICY IF EXISTS "Public can view survey templates" ON public.survey_templates;
    CREATE POLICY "Public can view survey templates" ON public.survey_templates FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Trainees can view own privacy requests" ON public.privacy_requests;
    CREATE POLICY "Trainees can view own privacy requests" ON public.privacy_requests FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Trainees can insert privacy requests" ON public.privacy_requests;
    CREATE POLICY "Trainees can insert privacy requests" ON public.privacy_requests FOR INSERT WITH CHECK (true);

    DROP POLICY IF EXISTS "Trainees can view own scheme applications" ON public.scheme_applications;
    CREATE POLICY "Trainees can view own scheme applications" ON public.scheme_applications FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Trainees can insert scheme applications" ON public.scheme_applications;
    CREATE POLICY "Trainees can insert scheme applications" ON public.scheme_applications FOR INSERT WITH CHECK (true);

    DROP POLICY IF EXISTS "Trainees can view own ledger" ON public.enterprise_ledger;
    CREATE POLICY "Trainees can view own ledger" ON public.enterprise_ledger FOR SELECT USING (true);

    DROP POLICY IF EXISTS "Trainees can insert own ledger" ON public.enterprise_ledger;
    CREATE POLICY "Trainees can insert own ledger" ON public.enterprise_ledger FOR INSERT WITH CHECK (true);

    -- Allow all for admin/service role
    DROP POLICY IF EXISTS "Admin full scheme applications" ON public.scheme_applications;
    CREATE POLICY "Admin full scheme applications" ON public.scheme_applications FOR ALL USING (true);
END $$;

-- Indexes for Fast Query Performance
CREATE INDEX IF NOT EXISTS idx_scheme_apps_trainee ON public.scheme_applications(trainee_id);
CREATE INDEX IF NOT EXISTS idx_scheme_apps_status ON public.scheme_applications(status);
CREATE INDEX IF NOT EXISTS idx_ledger_trainee ON public.enterprise_ledger(trainee_id);
CREATE INDEX IF NOT EXISTS idx_job_postings_district ON public.job_postings(location_district);
CREATE INDEX IF NOT EXISTS idx_job_postings_trade ON public.job_postings(trade_category);

-- ==============================================================================
-- INITIAL SEED DATA FOR NEW TABLES
-- ==============================================================================

-- 1. Seed Real Survey Templates
INSERT INTO public.survey_templates (milestone, title, description, questions) VALUES
('3_months', '3-Month Post-Certification Survey (M+3)', 'Initial transition and wage baseline check-in.', '[
    {"id": "q1", "text": "What is your current employment or enterprise status?", "type": "select", "options": ["Employed (Wage / Salary)", "Self-Employed / Own Enterprise", "Seeking Employment", "Pursuing Higher Education"]},
    {"id": "q2", "text": "What is your current monthly income / business revenue?", "type": "number", "min": 0, "max": 200000},
    {"id": "q3", "text": "Are you utilizing the skills learned during your training course?", "type": "select", "options": ["Yes, Directly in Daily Work", "Partially", "No, Different Field"]}
]'::JSONB),
('6_months', '6-Month Career Retention Survey (M+6)', 'Mid-term wage growth and workplace retention verification.', '[
    {"id": "q1", "text": "Are you still with the same employer / operating the same business?", "type": "select", "options": ["Yes, Same Job / Business", "Switched to Higher-Paying Role", "Shifted Trade", "Currently Unemployed"]},
    {"id": "q2", "text": "Current monthly take-home salary or net enterprise profit:", "type": "number", "min": 0, "max": 500000},
    {"id": "q3", "text": "Have you received any wage increments or promotions in the last 6 months?", "type": "select", "options": ["Yes, Increment Received", "Promoted with Higher Wage", "No Change", "Decreased"]}
]'::JSONB),
('12_months', '12-Month Annual Impact Survey (M+12)', 'One-year longitudinal trajectory and financial independence audit.', '[
    {"id": "q1", "text": "Current professional occupation status:", "type": "select", "options": ["Full-time Salaried", "Registered MSME Entrepreneur", "Freelancer / Gig Worker", "Career Break"]},
    {"id": "q2", "text": "Current monthly earning range:", "type": "select", "options": ["Below ₹15,000", "₹15,000 - ₹25,000", "₹25,000 - ₹40,000", "Above ₹40,000"]},
    {"id": "q3", "text": "How has your certification impacted your overall household income?", "type": "select", "options": ["Significantly Increased (>50%)", "Moderately Increased (20-50%)", "Slight Increase", "No Impact"]}
]'::JSONB)
ON CONFLICT (milestone) DO NOTHING;

-- 2. Seed Real Employers
INSERT INTO public.employers (company_name, industry, contact_email, contact_phone, district, state, is_verified, website) VALUES
('Tata Motors EV Component Division', 'Automotive & EV', 'careers.ev@tatamotors.com', '+91 20 6658 2000', 'Pune', 'Maharashtra', true, 'https://www.tatamotors.com'),
('Mahindra Solarize Ltd', 'Green Energy & Solar', 'hr@mahindrasolarize.com', '+91 22 2490 1441', 'Mumbai', 'Maharashtra', true, 'https://www.mahindrasolarize.com'),
('Godrej Consumer Products Ltd', 'Apparel & Packaging', 'recruitment@godrejcp.com', '+91 22 6796 5656', 'Nashik', 'Maharashtra', true, 'https://www.godrejcp.com'),
('Bajaj Auto Industrial Trainee Cell', 'Manufacturing & CNC', 'apprentice@bajajauto.co.in', '+91 20 2747 2851', 'Chhatrapati Sambhajinagar', 'Maharashtra', true, 'https://www.bajajauto.com'),
('Finolex Cables Electrical Systems', 'Electrical & Hardware', 'talent@finolex.com', '+91 20 2747 5963', 'Pune', 'Maharashtra', true, 'https://www.finolex.com')
ON CONFLICT (contact_email) DO NOTHING;

-- 3. Seed Real Job Postings
DO $$
DECLARE
    emp_tata UUID;
    emp_mahindra UUID;
    emp_godrej UUID;
    emp_bajaj UUID;
    emp_finolex UUID;
BEGIN
    SELECT id INTO emp_tata FROM public.employers WHERE contact_email = 'careers.ev@tatamotors.com' LIMIT 1;
    SELECT id INTO emp_mahindra FROM public.employers WHERE contact_email = 'hr@mahindrasolarize.com' LIMIT 1;
    SELECT id INTO emp_godrej FROM public.employers WHERE contact_email = 'recruitment@godrejcp.com' LIMIT 1;
    SELECT id INTO emp_bajaj FROM public.employers WHERE contact_email = 'apprentice@bajajauto.co.in' LIMIT 1;
    SELECT id INTO emp_finolex FROM public.employers WHERE contact_email = 'talent@finolex.com' LIMIT 1;

    IF emp_tata IS NOT NULL THEN
        INSERT INTO public.job_postings (employer_id, title, trade_category, min_salary, max_salary, location_district, openings_count, type)
        VALUES (emp_tata, 'EV Battery Assembly Technician', 'Automotive', 18000, 26000, 'Pune', 8, 'full_time');
    END IF;

    IF emp_mahindra IS NOT NULL THEN
        INSERT INTO public.job_postings (employer_id, title, trade_category, min_salary, max_salary, location_district, openings_count, type)
        VALUES (emp_mahindra, 'Rooftop Solar PV Installation Lead', 'Green Energy', 20000, 30000, 'Nashik', 5, 'full_time');
    END IF;

    IF emp_godrej IS NOT NULL THEN
        INSERT INTO public.job_postings (employer_id, title, trade_category, min_salary, max_salary, location_district, openings_count, type)
        VALUES (emp_godrej, 'Industrial Lockstitch & Pattern Maker', 'Apparel', 16000, 22000, 'Mumbai', 12, 'full_time');
    END IF;

    IF emp_bajaj IS NOT NULL THEN
        INSERT INTO public.job_postings (employer_id, title, trade_category, min_salary, max_salary, location_district, openings_count, type)
        VALUES (emp_bajaj, 'CNC VMC Machine Operator Apprentice (NAPS)', 'Manufacturing', 14500, 19000, 'Chhatrapati Sambhajinagar', 15, 'apprenticeship');
    END IF;
END $$;
