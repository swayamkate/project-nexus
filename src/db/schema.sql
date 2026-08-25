# =============================================================================
# MAHA-SKILL TRACK / NEXUS (PS-135) SUPABASE POSTGRESQL MASTER SCHEMA
# =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- ENUMS
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('trainee', 'employer', 'evaluator', 'admin', 'state_admin');
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
-- 1. PROFILES & TRAINEES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trainees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id VARCHAR(50) NOT NULL UNIQUE DEFAULT 'TRN' || LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0'),
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    dob DATE NOT NULL DEFAULT '2002-05-15',
    gender VARCHAR(20) NOT NULL DEFAULT 'Female',
    aadhaar_masked VARCHAR(20) NOT NULL DEFAULT 'XXXX-XXXX-1234',
    address TEXT NOT NULL DEFAULT '123, Shivaji Nagar, Pune, Maharashtra - 411005',
    district VARCHAR(100) NOT NULL DEFAULT 'Pune',
    state VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    pincode VARCHAR(10) NOT NULL DEFAULT '411005',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    profile_completion_pct INT NOT NULL DEFAULT 85 CHECK (profile_completion_pct BETWEEN 0 AND 100),
    is_active BOOLEAN NOT NULL DEFAULT true,
    
    -- Education Details
    highest_education VARCHAR(150) NOT NULL DEFAULT '12th (Science)',
    board_university VARCHAR(255) NOT NULL DEFAULT 'Maharashtra State Board',
    year_of_passing INT NOT NULL DEFAULT 2020,
    education_percentage NUMERIC(5, 2) NOT NULL DEFAULT 78.60,
    
    -- Skills Array
    skills TEXT[] NOT NULL DEFAULT ARRAY['Tailoring', 'Stitching', 'Pattern Making', 'Fabric Knowledge', 'Embroidery', 'Machine Operation'],
    
    -- Bio / About Me
    about_me TEXT DEFAULT 'I am passionate about tailoring and fashion designing. I have completed my training and now running my own tailoring business. I love creating new designs and delivering quality work to my customers.',
    
    -- Privacy Preservation Hash (Zero-PII research token)
    privacy_hash VARCHAR(64) NOT NULL UNIQUE DEFAULT encode(digest(gen_random_bytes(32), 'sha256'), 'hex'),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 2. TRAINING PROGRAMS & CERTIFICATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS training_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    sector VARCHAR(100) NOT NULL, -- e.g. 'Apparel & Fashion', 'IT & ITeS', 'Renewable Energy', 'Automotive'
    duration_months INT NOT NULL DEFAULT 3,
    provider_name VARCHAR(255) NOT NULL DEFAULT 'Maharashtra State Skill Development Society (MSSDS)',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trainee_enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    enrolled_date DATE NOT NULL DEFAULT '2024-04-10',
    completed_date DATE DEFAULT '2024-06-30',
    certified_date DATE DEFAULT '2024-07-15',
    certificate_id VARCHAR(100) DEFAULT 'MS-CERT-' || LPAD(FLOOR(RANDOM() * 900000 + 100000)::TEXT, 6, '0'),
    status VARCHAR(50) NOT NULL DEFAULT 'certified',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 3. EMPLOYMENT & SELF-EMPLOYMENT RECORDS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trainee_employment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    status employment_status_type NOT NULL DEFAULT 'self_employed',
    
    -- Self-Employment specifics
    business_name VARCHAR(255) DEFAULT 'Priya Stitch Works',
    business_type VARCHAR(150) DEFAULT 'Tailoring Services',
    start_date DATE NOT NULL DEFAULT '2024-08-01',
    location VARCHAR(150) DEFAULT 'Pune, Maharashtra',
    monthly_income_range VARCHAR(50) DEFAULT '₹10,000 - ₹20,000',
    exact_monthly_income NUMERIC(12, 2) DEFAULT 16500.00,
    
    trade_license_no VARCHAR(100) DEFAULT 'MH-PUN-TL-2024-8891',
    udyam_registration_no VARCHAR(100) DEFAULT 'UDYAM-MH-26-0049182',
    is_verified BOOLEAN NOT NULL DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 4. LONGITUDINAL FOLLOW-UPS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trainee_followups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    milestone followup_milestone_type NOT NULL DEFAULT '3_months',
    milestone_label VARCHAR(100) NOT NULL DEFAULT '3 Months Follow-up',
    scheduled_date DATE NOT NULL,
    submitted_date DATE,
    status followup_status_type NOT NULL DEFAULT 'scheduled',
    business_status business_status_type DEFAULT 'active',
    income_range VARCHAR(50) DEFAULT '₹5,000 - ₹10,000',
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 5. SKILL GAPS & DEMAND CATALOG
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS top_skill_gaps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    skill_name VARCHAR(150) NOT NULL UNIQUE,
    sector VARCHAR(100) NOT NULL,
    demand_gap INT NOT NULL, -- Negative integer representing deficit
    demand_growth_pct NUMERIC(5, 2) NOT NULL DEFAULT 25.00,
    high_demand_districts TEXT[] DEFAULT ARRAY['Pune', 'Nashik', 'Nagpur', 'Mumbai'],
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 6. DISTRICT LEVEL AGGREGATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS district_employment_stats (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_name VARCHAR(100) NOT NULL UNIQUE,
    state_name VARCHAR(100) NOT NULL DEFAULT 'Maharashtra',
    employed_count INT NOT NULL DEFAULT 0,
    total_trainees INT NOT NULL DEFAULT 0,
    employment_rate_pct NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    avg_salary NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 7. RECOMMENDED OPPORTUNITIES & SCHEMES
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS recommended_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Online Course', 'PMEGP Scheme', 'Connect & Grow'
    provider_scheme VARCHAR(150) NOT NULL,
    description TEXT,
    badge_label VARCHAR(100),
    action_url TEXT,
    icon_type VARCHAR(50) DEFAULT 'course',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 8. NOTIFICATIONS & QUICK LINKS
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS trainee_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    trainee_id UUID NOT NULL REFERENCES trainees(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notification_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. AI INSIGHTS OF THE DAY TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ai_policy_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    insight_text TEXT NOT NULL,
    target_sector VARCHAR(100),
    target_districts TEXT[],
    created_date DATE NOT NULL DEFAULT CURRENT_DATE,
    is_active BOOLEAN NOT NULL DEFAULT true
);
- -   E n a b l e   r e q u i r e d   e x t e n s i o n s  
 C R E A T E   E X T E N S I O N   I F   N O T   E X I S T S   " u u i d - o s s p " ;  
 C R E A T E   E X T E N S I O N   I F   N O T   E X I S T S   " p g c r y p t o " ;  
  
 - -   E n a b l e   R L S   a n d   s e t u p   p e r m i s s i v e   p o l i c i e s   f o r   p r o t o t y p e   t e s t i n g   o n   a l l   t a b l e s  
 - -   T r a i n e e s  
 A L T E R   T A B L E   t r a i n e e s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   r e a d   a c c e s s   t r a i n e e s "   O N   t r a i n e e s   F O R   S E L E C T   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   i n s e r t   a c c e s s   t r a i n e e s "   O N   t r a i n e e s   F O R   I N S E R T   W I T H   C H E C K   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   u p d a t e   a c c e s s   t r a i n e e s "   O N   t r a i n e e s   F O R   U P D A T E   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   d e l e t e   a c c e s s   t r a i n e e s "   O N   t r a i n e e s   F O R   D E L E T E   U S I N G   ( t r u e ) ;  
  
 - -   T r a i n i n g   P r o g r a m s  
 A L T E R   T A B L E   t r a i n i n g _ p r o g r a m s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   r e a d   a c c e s s   t r a i n i n g _ p r o g r a m s "   O N   t r a i n i n g _ p r o g r a m s   F O R   S E L E C T   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   i n s e r t   a c c e s s   t r a i n i n g _ p r o g r a m s "   O N   t r a i n i n g _ p r o g r a m s   F O R   I N S E R T   W I T H   C H E C K   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   u p d a t e   a c c e s s   t r a i n i n g _ p r o g r a m s "   O N   t r a i n i n g _ p r o g r a m s   F O R   U P D A T E   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   d e l e t e   a c c e s s   t r a i n i n g _ p r o g r a m s "   O N   t r a i n i n g _ p r o g r a m s   F O R   D E L E T E   U S I N G   ( t r u e ) ;  
  
 - -   T r a i n e e   E n r o l l m e n t s  
 A L T E R   T A B L E   t r a i n e e _ e n r o l l m e n t s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   r e a d   a c c e s s   t r a i n e e _ e n r o l l m e n t s "   O N   t r a i n e e _ e n r o l l m e n t s   F O R   S E L E C T   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   i n s e r t   a c c e s s   t r a i n e e _ e n r o l l m e n t s "   O N   t r a i n e e _ e n r o l l m e n t s   F O R   I N S E R T   W I T H   C H E C K   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   u p d a t e   a c c e s s   t r a i n e e _ e n r o l l m e n t s "   O N   t r a i n e e _ e n r o l l m e n t s   F O R   U P D A T E   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   d e l e t e   a c c e s s   t r a i n e e _ e n r o l l m e n t s "   O N   t r a i n e e _ e n r o l l m e n t s   F O R   D E L E T E   U S I N G   ( t r u e ) ;  
  
 - -   T r a i n e e   E m p l o y m e n t  
 A L T E R   T A B L E   t r a i n e e _ e m p l o y m e n t   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   r e a d   a c c e s s   t r a i n e e _ e m p l o y m e n t "   O N   t r a i n e e _ e m p l o y m e n t   F O R   S E L E C T   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   i n s e r t   a c c e s s   t r a i n e e _ e m p l o y m e n t "   O N   t r a i n e e _ e m p l o y m e n t   F O R   I N S E R T   W I T H   C H E C K   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   u p d a t e   a c c e s s   t r a i n e e _ e m p l o y m e n t "   O N   t r a i n e e _ e m p l o y m e n t   F O R   U P D A T E   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   d e l e t e   a c c e s s   t r a i n e e _ e m p l o y m e n t "   O N   t r a i n e e _ e m p l o y m e n t   F O R   D E L E T E   U S I N G   ( t r u e ) ;  
  
 - -   T r a i n e e   F o l l o w u p s  
 A L T E R   T A B L E   t r a i n e e _ f o l l o w u p s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   r e a d   a c c e s s   t r a i n e e _ f o l l o w u p s "   O N   t r a i n e e _ f o l l o w u p s   F O R   S E L E C T   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   i n s e r t   a c c e s s   t r a i n e e _ f o l l o w u p s "   O N   t r a i n e e _ f o l l o w u p s   F O R   I N S E R T   W I T H   C H E C K   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   u p d a t e   a c c e s s   t r a i n e e _ f o l l o w u p s "   O N   t r a i n e e _ f o l l o w u p s   F O R   U P D A T E   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   d e l e t e   a c c e s s   t r a i n e e _ f o l l o w u p s "   O N   t r a i n e e _ f o l l o w u p s   F O R   D E L E T E   U S I N G   ( t r u e ) ;  
  
 - -   T o p   S k i l l   G a p s  
 A L T E R   T A B L E   t o p _ s k i l l _ g a p s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   r e a d   a c c e s s   t o p _ s k i l l _ g a p s "   O N   t o p _ s k i l l _ g a p s   F O R   S E L E C T   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   i n s e r t   a c c e s s   t o p _ s k i l l _ g a p s "   O N   t o p _ s k i l l _ g a p s   F O R   I N S E R T   W I T H   C H E C K   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   u p d a t e   a c c e s s   t o p _ s k i l l _ g a p s "   O N   t o p _ s k i l l _ g a p s   F O R   U P D A T E   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   d e l e t e   a c c e s s   t o p _ s k i l l _ g a p s "   O N   t o p _ s k i l l _ g a p s   F O R   D E L E T E   U S I N G   ( t r u e ) ;  
  
 - -   D i s t r i c t   S t a t s  
 A L T E R   T A B L E   d i s t r i c t _ e m p l o y m e n t _ s t a t s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   r e a d   a c c e s s   d i s t r i c t _ e m p l o y m e n t _ s t a t s "   O N   d i s t r i c t _ e m p l o y m e n t _ s t a t s   F O R   S E L E C T   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   i n s e r t   a c c e s s   d i s t r i c t _ e m p l o y m e n t _ s t a t s "   O N   d i s t r i c t _ e m p l o y m e n t _ s t a t s   F O R   I N S E R T   W I T H   C H E C K   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   u p d a t e   a c c e s s   d i s t r i c t _ e m p l o y m e n t _ s t a t s "   O N   d i s t r i c t _ e m p l o y m e n t _ s t a t s   F O R   U P D A T E   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   d e l e t e   a c c e s s   d i s t r i c t _ e m p l o y m e n t _ s t a t s "   O N   d i s t r i c t _ e m p l o y m e n t _ s t a t s   F O R   D E L E T E   U S I N G   ( t r u e ) ;  
  
 - -   R e c o m m e n d e d   O p p o r t u n i t i e s  
 A L T E R   T A B L E   r e c o m m e n d e d _ o p p o r t u n i t i e s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   r e a d   a c c e s s   r e c o m m e n d e d _ o p p o r t u n i t i e s "   O N   r e c o m m e n d e d _ o p p o r t u n i t i e s   F O R   S E L E C T   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   i n s e r t   a c c e s s   r e c o m m e n d e d _ o p p o r t u n i t i e s "   O N   r e c o m m e n d e d _ o p p o r t u n i t i e s   F O R   I N S E R T   W I T H   C H E C K   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   u p d a t e   a c c e s s   r e c o m m e n d e d _ o p p o r t u n i t i e s "   O N   r e c o m m e n d e d _ o p p o r t u n i t i e s   F O R   U P D A T E   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   d e l e t e   a c c e s s   r e c o m m e n d e d _ o p p o r t u n i t i e s "   O N   r e c o m m e n d e d _ o p p o r t u n i t i e s   F O R   D E L E T E   U S I N G   ( t r u e ) ;  
  
 - -   T r a i n e e   N o t i f i c a t i o n s  
 A L T E R   T A B L E   t r a i n e e _ n o t i f i c a t i o n s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   r e a d   a c c e s s   t r a i n e e _ n o t i f i c a t i o n s "   O N   t r a i n e e _ n o t i f i c a t i o n s   F O R   S E L E C T   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   i n s e r t   a c c e s s   t r a i n e e _ n o t i f i c a t i o n s "   O N   t r a i n e e _ n o t i f i c a t i o n s   F O R   I N S E R T   W I T H   C H E C K   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   u p d a t e   a c c e s s   t r a i n e e _ n o t i f i c a t i o n s "   O N   t r a i n e e _ n o t i f i c a t i o n s   F O R   U P D A T E   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   d e l e t e   a c c e s s   t r a i n e e _ n o t i f i c a t i o n s "   O N   t r a i n e e _ n o t i f i c a t i o n s   F O R   D E L E T E   U S I N G   ( t r u e ) ;  
  
 - -   A I   P o l i c y   I n s i g h t s  
 A L T E R   T A B L E   a i _ p o l i c y _ i n s i g h t s   E N A B L E   R O W   L E V E L   S E C U R I T Y ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   r e a d   a c c e s s   a i _ p o l i c y _ i n s i g h t s "   O N   a i _ p o l i c y _ i n s i g h t s   F O R   S E L E C T   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   i n s e r t   a c c e s s   a i _ p o l i c y _ i n s i g h t s "   O N   a i _ p o l i c y _ i n s i g h t s   F O R   I N S E R T   W I T H   C H E C K   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   u p d a t e   a c c e s s   a i _ p o l i c y _ i n s i g h t s "   O N   a i _ p o l i c y _ i n s i g h t s   F O R   U P D A T E   U S I N G   ( t r u e ) ;  
 C R E A T E   P O L I C Y   " A l l o w   p u b l i c   d e l e t e   a c c e s s   a i _ p o l i c y _ i n s i g h t s "   O N   a i _ p o l i c y _ i n s i g h t s   F O R   D E L E T E   U S I N G   ( t r u e ) ;  
 