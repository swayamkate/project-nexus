--
-- PostgreSQL database dump
--

\restrict 1bZQm5Xs55Lwn9HXXOwzXQFcpvutjPSfLd2lfheHLKz0vu7lJfg2bayOfh6tZdU

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP POLICY IF EXISTS "Permissive update verifications" ON public.verifications;
DROP POLICY IF EXISTS "Permissive update user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Permissive update training_programs" ON public.training_programs;
DROP POLICY IF EXISTS "Permissive update trainees" ON public.trainees;
DROP POLICY IF EXISTS "Permissive update trainee_followups" ON public.trainee_followups;
DROP POLICY IF EXISTS "Permissive update trainee_enrollments" ON public.trainee_enrollments;
DROP POLICY IF EXISTS "Permissive update trainee_employment" ON public.trainee_employment;
DROP POLICY IF EXISTS "Permissive update support_tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Permissive update promo_codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Permissive update government_schemes" ON public.government_schemes;
DROP POLICY IF EXISTS "Permissive update audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Permissive read verifications" ON public.verifications;
DROP POLICY IF EXISTS "Permissive read user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Permissive read training_programs" ON public.training_programs;
DROP POLICY IF EXISTS "Permissive read trainees" ON public.trainees;
DROP POLICY IF EXISTS "Permissive read trainee_notifications" ON public.trainee_notifications;
DROP POLICY IF EXISTS "Permissive read trainee_followups" ON public.trainee_followups;
DROP POLICY IF EXISTS "Permissive read trainee_enrollments" ON public.trainee_enrollments;
DROP POLICY IF EXISTS "Permissive read trainee_employment" ON public.trainee_employment;
DROP POLICY IF EXISTS "Permissive read top_skill_gaps" ON public.top_skill_gaps;
DROP POLICY IF EXISTS "Permissive read support_tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Permissive read recommended_opportunities" ON public.recommended_opportunities;
DROP POLICY IF EXISTS "Permissive read promo_codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Permissive read government_schemes" ON public.government_schemes;
DROP POLICY IF EXISTS "Permissive read district_employment_stats" ON public.district_employment_stats;
DROP POLICY IF EXISTS "Permissive read audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Permissive read ai_policy_insights" ON public.ai_policy_insights;
DROP POLICY IF EXISTS "Permissive insert verifications" ON public.verifications;
DROP POLICY IF EXISTS "Permissive insert user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Permissive insert training_programs" ON public.training_programs;
DROP POLICY IF EXISTS "Permissive insert trainees" ON public.trainees;
DROP POLICY IF EXISTS "Permissive insert trainee_followups" ON public.trainee_followups;
DROP POLICY IF EXISTS "Permissive insert trainee_enrollments" ON public.trainee_enrollments;
DROP POLICY IF EXISTS "Permissive insert trainee_employment" ON public.trainee_employment;
DROP POLICY IF EXISTS "Permissive insert support_tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Permissive insert promo_codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Permissive insert government_schemes" ON public.government_schemes;
DROP POLICY IF EXISTS "Permissive insert audit_logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Permissive delete verifications" ON public.verifications;
DROP POLICY IF EXISTS "Permissive delete user_roles" ON public.user_roles;
DROP POLICY IF EXISTS "Permissive delete training_programs" ON public.training_programs;
DROP POLICY IF EXISTS "Permissive delete trainees" ON public.trainees;
DROP POLICY IF EXISTS "Permissive delete trainee_followups" ON public.trainee_followups;
DROP POLICY IF EXISTS "Permissive delete trainee_enrollments" ON public.trainee_enrollments;
DROP POLICY IF EXISTS "Permissive delete trainee_employment" ON public.trainee_employment;
DROP POLICY IF EXISTS "Permissive delete support_tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Permissive delete promo_codes" ON public.promo_codes;
DROP POLICY IF EXISTS "Permissive delete government_schemes" ON public.government_schemes;
DROP POLICY IF EXISTS "Permissive delete audit_logs" ON public.audit_logs;
ALTER TABLE IF EXISTS ONLY public.verifications DROP CONSTRAINT IF EXISTS verifications_trainee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.trainees DROP CONSTRAINT IF EXISTS trainees_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.trainee_notifications DROP CONSTRAINT IF EXISTS trainee_notifications_trainee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.trainee_followups DROP CONSTRAINT IF EXISTS trainee_followups_trainee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.trainee_enrollments DROP CONSTRAINT IF EXISTS trainee_enrollments_trainee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.trainee_enrollments DROP CONSTRAINT IF EXISTS trainee_enrollments_program_id_fkey;
ALTER TABLE IF EXISTS ONLY public.trainee_employment DROP CONSTRAINT IF EXISTS trainee_employment_trainee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_trainee_id_fkey;
ALTER TABLE IF EXISTS ONLY public.verifications DROP CONSTRAINT IF EXISTS verifications_pkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_pkey;
ALTER TABLE IF EXISTS ONLY public.user_roles DROP CONSTRAINT IF EXISTS user_roles_email_key;
ALTER TABLE IF EXISTS ONLY public.training_programs DROP CONSTRAINT IF EXISTS training_programs_title_key;
ALTER TABLE IF EXISTS ONLY public.training_programs DROP CONSTRAINT IF EXISTS training_programs_pkey;
ALTER TABLE IF EXISTS ONLY public.trainees DROP CONSTRAINT IF EXISTS trainees_username_key;
ALTER TABLE IF EXISTS ONLY public.trainees DROP CONSTRAINT IF EXISTS trainees_trainee_id_key;
ALTER TABLE IF EXISTS ONLY public.trainees DROP CONSTRAINT IF EXISTS trainees_privacy_hash_key;
ALTER TABLE IF EXISTS ONLY public.trainees DROP CONSTRAINT IF EXISTS trainees_pkey;
ALTER TABLE IF EXISTS ONLY public.trainees DROP CONSTRAINT IF EXISTS trainees_email_key;
ALTER TABLE IF EXISTS ONLY public.trainee_notifications DROP CONSTRAINT IF EXISTS trainee_notifications_pkey;
ALTER TABLE IF EXISTS ONLY public.trainee_followups DROP CONSTRAINT IF EXISTS trainee_followups_pkey;
ALTER TABLE IF EXISTS ONLY public.trainee_enrollments DROP CONSTRAINT IF EXISTS trainee_enrollments_pkey;
ALTER TABLE IF EXISTS ONLY public.trainee_employment DROP CONSTRAINT IF EXISTS trainee_employment_pkey;
ALTER TABLE IF EXISTS ONLY public.top_skill_gaps DROP CONSTRAINT IF EXISTS top_skill_gaps_pkey;
ALTER TABLE IF EXISTS ONLY public.support_tickets DROP CONSTRAINT IF EXISTS support_tickets_pkey;
ALTER TABLE IF EXISTS ONLY public.recommended_opportunities DROP CONSTRAINT IF EXISTS recommended_opportunities_pkey;
ALTER TABLE IF EXISTS ONLY public.promo_codes DROP CONSTRAINT IF EXISTS promo_codes_pkey;
ALTER TABLE IF EXISTS ONLY public.promo_codes DROP CONSTRAINT IF EXISTS promo_codes_code_key;
ALTER TABLE IF EXISTS ONLY public.government_schemes DROP CONSTRAINT IF EXISTS government_schemes_pkey;
ALTER TABLE IF EXISTS ONLY public.government_schemes DROP CONSTRAINT IF EXISTS government_schemes_name_key;
ALTER TABLE IF EXISTS ONLY public.district_employment_stats DROP CONSTRAINT IF EXISTS district_employment_stats_pkey;
ALTER TABLE IF EXISTS ONLY public.audit_logs DROP CONSTRAINT IF EXISTS audit_logs_pkey;
ALTER TABLE IF EXISTS ONLY public.ai_policy_insights DROP CONSTRAINT IF EXISTS ai_policy_insights_pkey;
DROP TABLE IF EXISTS public.verifications;
DROP TABLE IF EXISTS public.user_roles;
DROP TABLE IF EXISTS public.training_programs;
DROP TABLE IF EXISTS public.trainees;
DROP TABLE IF EXISTS public.trainee_notifications;
DROP TABLE IF EXISTS public.trainee_followups;
DROP TABLE IF EXISTS public.trainee_enrollments;
DROP TABLE IF EXISTS public.trainee_employment;
DROP TABLE IF EXISTS public.top_skill_gaps;
DROP TABLE IF EXISTS public.support_tickets;
DROP TABLE IF EXISTS public.recommended_opportunities;
DROP TABLE IF EXISTS public.promo_codes;
DROP TABLE IF EXISTS public.government_schemes;
DROP TABLE IF EXISTS public.district_employment_stats;
DROP TABLE IF EXISTS public.audit_logs;
DROP TABLE IF EXISTS public.ai_policy_insights;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TYPE IF EXISTS public.user_role;
DROP TYPE IF EXISTS public.followup_status_type;
DROP TYPE IF EXISTS public.followup_milestone_type;
DROP TYPE IF EXISTS public.employment_status_type;
DROP TYPE IF EXISTS public.business_status_type;
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: business_status_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.business_status_type AS ENUM (
    'active',
    'scaling',
    'struggling',
    'closed',
    'transitioning'
);


ALTER TYPE public.business_status_type OWNER TO postgres;

--
-- Name: employment_status_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.employment_status_type AS ENUM (
    'employed',
    'self_employed',
    'apprenticeship',
    'job_seeking',
    'not_employed'
);


ALTER TYPE public.employment_status_type OWNER TO postgres;

--
-- Name: followup_milestone_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.followup_milestone_type AS ENUM (
    '3_months',
    '6_months',
    '12_months',
    '18_months',
    '24_months'
);


ALTER TYPE public.followup_milestone_type OWNER TO postgres;

--
-- Name: followup_status_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.followup_status_type AS ENUM (
    'scheduled',
    'completed',
    'upcoming',
    'overdue',
    'pending'
);


ALTER TYPE public.followup_status_type OWNER TO postgres;

--
-- Name: user_role; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role AS ENUM (
    'superadmin',
    'admin',
    'evaluator',
    'employer',
    'trainee'
);


ALTER TYPE public.user_role OWNER TO postgres;

--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public', 'auth', 'pg_temp'
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


ALTER FUNCTION public.handle_new_user() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: ai_policy_insights; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ai_policy_insights (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    insight_text text NOT NULL,
    target_sector character varying(100),
    target_districts text[],
    confidence_score numeric(5,2) DEFAULT 94.5,
    recommended_action text,
    created_date date DEFAULT CURRENT_DATE NOT NULL,
    is_active boolean DEFAULT true NOT NULL
);


ALTER TABLE public.ai_policy_insights OWNER TO postgres;

--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    admin_email character varying(255) NOT NULL,
    action character varying(255) NOT NULL,
    target_entity character varying(100),
    target_id character varying(100),
    details text,
    ip_address character varying(50),
    status character varying(50) DEFAULT 'Success'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: district_employment_stats; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.district_employment_stats (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    district_name character varying(100) NOT NULL,
    total_trained integer DEFAULT 0 NOT NULL,
    employed_count integer DEFAULT 0 NOT NULL,
    self_employed_count integer DEFAULT 0 NOT NULL,
    seeking_count integer DEFAULT 0 NOT NULL,
    avg_wage numeric(10,2) DEFAULT 0,
    placement_rate numeric(5,2) DEFAULT 0,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.district_employment_stats OWNER TO postgres;

--
-- Name: government_schemes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.government_schemes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    nodal_agency character varying(255) NOT NULL,
    subsidy_pct numeric(5,2) DEFAULT 35.00 NOT NULL,
    max_grant_amount numeric(14,2) DEFAULT 500000.00 NOT NULL,
    target_trades text[] DEFAULT ARRAY['Tailoring'::text, 'Solar'::text, 'EV Repair'::text],
    allocated_budget numeric(16,2) DEFAULT 50000000.00 NOT NULL,
    disbursed_budget numeric(16,2) DEFAULT 14250000.00 NOT NULL,
    beneficiaries_count integer DEFAULT 142 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.government_schemes OWNER TO postgres;

--
-- Name: promo_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.promo_codes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    discount_type character varying(50) DEFAULT 'percentage'::character varying NOT NULL,
    discount_val character varying(50) DEFAULT '100% OFF'::character varying NOT NULL,
    max_uses integer DEFAULT 500 NOT NULL,
    current_uses integer DEFAULT 0 NOT NULL,
    district character varying(100) DEFAULT 'All Districts'::character varying,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.promo_codes OWNER TO postgres;

--
-- Name: recommended_opportunities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.recommended_opportunities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    category character varying(100) NOT NULL,
    provider character varying(255) NOT NULL,
    link_url text,
    description text,
    target_skills text[],
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.recommended_opportunities OWNER TO postgres;

--
-- Name: support_tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.support_tickets (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid,
    trainee_name character varying(255) DEFAULT ''::character varying,
    trainee_email character varying(255) NOT NULL,
    category character varying(100) DEFAULT 'Certificate Verification'::character varying NOT NULL,
    subject character varying(255) NOT NULL,
    message text NOT NULL,
    status character varying(50) DEFAULT 'open'::character varying NOT NULL,
    assigned_to character varying(255) DEFAULT 'District Officer Pune'::character varying,
    admin_response text DEFAULT ''::text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.support_tickets OWNER TO postgres;

--
-- Name: top_skill_gaps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.top_skill_gaps (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    skill_name character varying(150) NOT NULL,
    demand_count integer DEFAULT 0 NOT NULL,
    supply_count integer DEFAULT 0 NOT NULL,
    gap_percentage numeric(5,2) DEFAULT 0 NOT NULL,
    priority_level character varying(20) DEFAULT 'High'::character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.top_skill_gaps OWNER TO postgres;

--
-- Name: trainee_employment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trainee_employment (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid NOT NULL,
    status public.employment_status_type DEFAULT 'job_seeking'::public.employment_status_type NOT NULL,
    company_name character varying(255),
    designation character varying(150),
    joining_date date,
    monthly_salary numeric(12,2) DEFAULT 0,
    offer_letter_url text,
    business_name character varying(255),
    business_type character varying(150),
    business_category character varying(100),
    business_status public.business_status_type DEFAULT 'active'::public.business_status_type,
    establishment_date date,
    monthly_revenue numeric(12,2) DEFAULT 0,
    monthly_profit numeric(12,2) DEFAULT 0,
    udyam_number character varying(100),
    gst_number character varying(50),
    business_address text,
    employees_count integer DEFAULT 0,
    verified_by_admin boolean DEFAULT false NOT NULL,
    verified_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.trainee_employment OWNER TO postgres;

--
-- Name: trainee_enrollments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trainee_enrollments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid NOT NULL,
    program_id uuid NOT NULL,
    enrolled_date date DEFAULT CURRENT_DATE NOT NULL,
    completed_date date,
    certified_date date,
    certificate_id character varying(100) DEFAULT ('MS-CERT-'::text || lpad((floor(((random() * (900000)::double precision) + (100000)::double precision)))::text, 6, '0'::text)),
    status character varying(50) DEFAULT 'enrolled'::character varying NOT NULL,
    grade character varying(10) DEFAULT 'A'::character varying,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.trainee_enrollments OWNER TO postgres;

--
-- Name: trainee_followups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trainee_followups (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid NOT NULL,
    milestone public.followup_milestone_type NOT NULL,
    due_date date NOT NULL,
    completed_date date,
    status public.followup_status_type DEFAULT 'upcoming'::public.followup_status_type NOT NULL,
    current_status public.employment_status_type,
    current_income_range character varying(50),
    income_growth_pct numeric(5,2) DEFAULT 0,
    job_satisfaction_score integer,
    skill_utilization_score integer,
    additional_support_needed text,
    survey_channel character varying(50) DEFAULT 'web_portal'::character varying,
    survey_data_json jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT trainee_followups_job_satisfaction_score_check CHECK (((job_satisfaction_score >= 1) AND (job_satisfaction_score <= 5))),
    CONSTRAINT trainee_followups_skill_utilization_score_check CHECK (((skill_utilization_score >= 1) AND (skill_utilization_score <= 5)))
);


ALTER TABLE public.trainee_followups OWNER TO postgres;

--
-- Name: trainee_notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trainee_notifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) DEFAULT 'info'::character varying,
    is_read boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.trainee_notifications OWNER TO postgres;

--
-- Name: trainees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trainees (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    trainee_id character varying(50) DEFAULT ('TRN-'::text || lpad((floor(((random() * (900000)::double precision) + (100000)::double precision)))::text, 6, '0'::text)) NOT NULL,
    username character varying(100),
    full_name character varying(255) DEFAULT ''::character varying NOT NULL,
    email character varying(255) NOT NULL,
    phone character varying(30) DEFAULT ''::character varying,
    dob date DEFAULT '2000-01-01'::date,
    gender character varying(30) DEFAULT 'Not Specified'::character varying,
    aadhaar_masked character varying(20) DEFAULT 'XXXX-XXXX-0000'::character varying,
    address text DEFAULT ''::text,
    district character varying(100) DEFAULT ''::character varying,
    state character varying(100) DEFAULT 'Maharashtra'::character varying,
    pincode character varying(20) DEFAULT ''::character varying,
    avatar_url text DEFAULT ''::text,
    profile_completion_pct integer DEFAULT 30 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    highest_education character varying(150) DEFAULT ''::character varying,
    board_university character varying(255) DEFAULT ''::character varying,
    year_of_passing integer DEFAULT 2022,
    education_percentage numeric(5,2) DEFAULT 0.00,
    skills text[] DEFAULT ARRAY[]::text[] NOT NULL,
    about_me text DEFAULT ''::text,
    privacy_hash character varying(64) DEFAULT encode(extensions.digest(extensions.gen_random_bytes(32), 'sha256'::text), 'hex'::text) NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT trainees_profile_completion_pct_check CHECK (((profile_completion_pct >= 0) AND (profile_completion_pct <= 100)))
);


ALTER TABLE public.trainees OWNER TO postgres;

--
-- Name: training_programs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.training_programs (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title character varying(255) NOT NULL,
    sector character varying(100) NOT NULL,
    duration_months integer DEFAULT 3 NOT NULL,
    provider_name character varying(255) DEFAULT 'Maharashtra State Skill Development Society (MSSDS)'::character varying NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.training_programs OWNER TO postgres;

--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    email character varying(255) NOT NULL,
    username character varying(100),
    role public.user_role DEFAULT 'trainee'::public.user_role NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.user_roles OWNER TO postgres;

--
-- Name: verifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verifications (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    trainee_id uuid NOT NULL,
    document_type character varying(100) NOT NULL,
    document_name character varying(255) NOT NULL,
    document_url text NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying NOT NULL,
    admin_notes text,
    reviewed_by character varying(255),
    reviewed_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


ALTER TABLE public.verifications OWNER TO postgres;

--
-- Data for Name: ai_policy_insights; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ai_policy_insights (id, insight_text, target_sector, target_districts, confidence_score, recommended_action, created_date, is_active) FROM stdin;
f9f254ed-d71d-4c46-a91d-886973d31e78	Self-employed micro-tailors in rural Pune experience 3.2x higher wage growth when equipped with digital payments and ONDC cataloging.	Apparel & Fashion	{Pune,Nashik}	95.80	Mandate a 1-week digital commerce module in all Phase-2 tailoring courses.	2026-08-26	t
a0d16aae-8da9-4723-a264-c6ddb73452d5	Solar technicians certified under MSSDS show a 92% retention rate in Vidarbha region with an average salary bump of 35% after 6 months.	Renewable Energy	{Nagpur,Amravati}	94.20	Expand Solar PV training capacity by 40% across Vidarbha industrial clusters.	2026-08-26	t
48d08af6-6b7d-4a0e-8fe0-338cfe17fe89	Self-employed micro-tailors in rural Pune experience 3.2x higher wage growth when equipped with digital payments and ONDC cataloging.	Apparel & Fashion	{Pune,Nashik}	95.80	Mandate a 1-week digital commerce module in all Phase-2 tailoring courses.	2026-08-26	t
0050516b-0168-4f13-867e-a37097356f63	Solar technicians certified under MSSDS show a 92% retention rate in Vidarbha region with an average salary bump of 35% after 6 months.	Renewable Energy	{Nagpur,Amravati}	94.20	Expand Solar PV training capacity by 40% across Vidarbha industrial clusters.	2026-08-26	t
\.


--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_logs (id, admin_email, action, target_entity, target_id, details, ip_address, status, created_at) FROM stdin;
1358d702-a3e8-4d2d-8d02-89493db37e0d	admin@nexus.com	INITIALIZE_SYSTEM	CORE	\N	System initialized with zero-knowledge enclave configuration	\N	Success	2026-08-26 19:26:17.996661+00
934d877d-2ea3-4348-abdd-9786a8357419	admin@nexus.com	PROVISION_ADMIN	USER_ROLES	\N	Superadmin master console activated for admin@nexus.com	\N	Success	2026-08-26 19:26:17.996661+00
bc3315d4-c527-495b-b081-af95bfe02416	admin@nexus.com	VERIFY_INTEGRITY	MSSDS_REGISTRY	\N	Verified cryptographic integrity of State Trainee Hash Registry	\N	Success	2026-08-26 19:26:17.996661+00
6d64221e-5fa7-41f8-b0da-9f44c72bed77	admin@nexus.com	Created new admin: pune.officer@mssds.gov.in	user_roles	002a098c-755c-4cb5-b54c-fead93545fd5	\N	\N	Success	2026-08-26 19:32:09.494944+00
\.


--
-- Data for Name: district_employment_stats; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.district_employment_stats (id, district_name, total_trained, employed_count, self_employed_count, seeking_count, avg_wage, placement_rate, created_at) FROM stdin;
ded29573-5096-4302-ac16-ff86a909a9bf	Pune	4200	2400	1250	550	21500.00	86.90	2026-08-26 18:51:42.979878+00
0831227e-5266-4a2c-9dc6-9c7b1e294125	Nagpur	3100	1650	980	470	18200.00	84.84	2026-08-26 18:51:42.979878+00
55f9b230-220b-4aed-886a-3261bc4e830a	Nashik	2800	1400	920	480	17500.00	82.86	2026-08-26 18:51:42.979878+00
0548665f-00b7-4d42-a9b3-760f55ce4815	Aurangabad (Chhatrapati Sambhajinagar)	2350	1100	810	440	16800.00	81.28	2026-08-26 18:51:42.979878+00
98e60556-f627-4bef-a718-7fadc5faa209	Thane	3800	2200	1100	500	22800.00	86.84	2026-08-26 18:51:42.979878+00
5eb79857-27d4-4aa4-b512-d3f679468972	Pune	4200	2400	1250	550	21500.00	86.90	2026-08-26 19:26:17.959396+00
b3db6852-a14e-40a8-99d1-4b973be85e65	Nagpur	3100	1650	980	470	18200.00	84.84	2026-08-26 19:26:17.959396+00
48a2f08d-bd83-4f29-adbf-cb622fcc9f55	Nashik	2800	1400	920	480	17500.00	82.86	2026-08-26 19:26:17.959396+00
7933ab5a-3d8b-4791-973e-87c2c02b20aa	Aurangabad (Chhatrapati Sambhajinagar)	2350	1100	810	440	16800.00	81.28	2026-08-26 19:26:17.959396+00
f324779c-f781-4a7d-8bed-83537382bf57	Thane	3800	2200	1100	500	22800.00	86.84	2026-08-26 19:26:17.959396+00
\.


--
-- Data for Name: government_schemes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.government_schemes (id, name, nodal_agency, subsidy_pct, max_grant_amount, target_trades, allocated_budget, disbursed_budget, beneficiaries_count, is_active, created_at) FROM stdin;
240d3ab1-eaea-4df9-80de-825c81df5f5a	PMEGP - Prime Minister Employment Generation Programme	Khadi and Village Industries Commission (KVIC)	35.00	500000.00	{"Tailoring & Garments","Solar & Electrical",Agri-Tech}	100000000.00	38500000.00	420	t	2026-08-26 19:26:17.995272+00
a99ba186-45e8-4d45-b7f3-51487ee05a16	Pradhan Mantri Mudra Yojana (Shishu & Tarun)	National Credit Guarantee Trustee Company (NCGTC)	20.00	1000000.00	{Micro-Enterprise,"Automotive Repair","Food Processing"}	85000000.00	24100000.00	310	t	2026-08-26 19:26:17.995272+00
1423c024-d42a-4e31-a22e-a7cff2a5f0ad	Mahaswayam State Entrepreneurship Grant	MSSDS Maharashtra	50.00	250000.00	{"Women Artisans",Handicrafts,"Boutique Stitching"}	40000000.00	19200000.00	185	t	2026-08-26 19:26:17.995272+00
\.


--
-- Data for Name: promo_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.promo_codes (id, code, discount_type, discount_val, max_uses, current_uses, district, is_active, created_at) FROM stdin;
bdd9ae60-a796-4026-aeaf-fc44835eb7b0	NEXUS-GOV-26	percentage	100% OFF	500	482	Pune	t	2026-08-26 19:26:17.993953+00
82826931-4ffc-46d4-bb9a-331c755b697b	SKILL-UP-MH	percentage	50% OFF	2000	1204	All Districts	t	2026-08-26 19:26:17.993953+00
0e3da1af-d2ad-454e-a137-0f9394dde57e	BETA-TESTER	free_lifetime	FREE LIFETIME	50	10	Statewide	t	2026-08-26 19:26:17.993953+00
\.


--
-- Data for Name: recommended_opportunities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.recommended_opportunities (id, title, category, provider, link_url, description, target_skills, is_active, created_at) FROM stdin;
a30ed36f-66f8-4c91-ad5f-cd13ee157d21	Prime Minister Employment Generation Programme (PMEGP)	Government Scheme	Ministry of MSME	https://www.kviconline.gov.in/pmegpeportal/	Credit-linked subsidy programme for setting up new micro-enterprises with up to 35% government subsidy.	{Entrepreneurship,Tailoring,Manufacturing}	t	2026-08-26 18:51:42.979878+00
0d3992ea-fa09-417d-9b05-aaacac7eecd7	Mudra Loan Yojana for Micro-Enterprises	Financial Aid	Government of India	https://www.mudra.org.in/	Collateral-free business loans up to ₹10 Lakhs under Shishu, Kishore, and Tarun categories.	{Self-Employment,"Business Growth"}	t	2026-08-26 18:51:42.979878+00
f3965cda-9900-40ce-91ca-6ca280edd984	Advanced Digital Marketing & E-Commerce Onboarding	Upskilling Course	Skill India Digital Hub	https://www.skillindiadigital.gov.in/	Master social media selling, ONDC integration, and digital payments for your enterprise.	{"Digital Marketing",E-Commerce}	t	2026-08-26 18:51:42.979878+00
1b0e39b5-5a36-41f9-8916-20ae5fba7ebe	Prime Minister Employment Generation Programme (PMEGP)	Government Scheme	Ministry of MSME	https://www.kviconline.gov.in/pmegpeportal/	Credit-linked subsidy programme for setting up new micro-enterprises with up to 35% government subsidy.	{Entrepreneurship,Tailoring,Manufacturing}	t	2026-08-26 19:26:17.960566+00
06bc834b-e5bf-4e5e-9f20-7614703ade6c	Mudra Loan Yojana for Micro-Enterprises	Financial Aid	Government of India	https://www.mudra.org.in/	Collateral-free business loans up to ₹10 Lakhs under Shishu, Kishore, and Tarun categories.	{Self-Employment,"Business Growth"}	t	2026-08-26 19:26:17.960566+00
f8d9fd0c-62ce-4094-9639-d881cdf7d6eb	Advanced Digital Marketing & E-Commerce Onboarding	Upskilling Course	Skill India Digital Hub	https://www.skillindiadigital.gov.in/	Master social media selling, ONDC integration, and digital payments for your enterprise.	{"Digital Marketing",E-Commerce}	t	2026-08-26 19:26:17.960566+00
\.


--
-- Data for Name: support_tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.support_tickets (id, trainee_id, trainee_name, trainee_email, category, subject, message, status, assigned_to, admin_response, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: top_skill_gaps; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.top_skill_gaps (id, skill_name, demand_count, supply_count, gap_percentage, priority_level, created_at) FROM stdin;
a1a4a693-2b26-4820-8eff-861759edbb3c	EV Battery Diagnostics & Repair	1420	310	78.17	Critical	2026-08-26 18:51:42.979878+00
5794b297-e654-4213-865a-762d79e960a8	Solar Inverter & Micro-Grid Automation	1890	620	67.20	High	2026-08-26 18:51:42.979878+00
ef9a3a97-bd44-42d4-89c9-2326c7ad2755	Boutique Pattern Making & Quality Control	2150	940	56.28	Medium	2026-08-26 18:51:42.979878+00
b4c59023-0633-4c5a-ace7-6e492f74f939	Cloud Backend Engineering & Security	3200	1100	65.63	High	2026-08-26 18:51:42.979878+00
ac718c9b-9400-42a6-be0e-9e962e7afe8b	EV Battery Diagnostics & Repair	1420	310	78.17	Critical	2026-08-26 19:26:17.958255+00
e07e0dea-624b-4267-8fa8-f5a74c3558e5	Solar Inverter & Micro-Grid Automation	1890	620	67.20	High	2026-08-26 19:26:17.958255+00
80ccac38-bb68-4ddd-b6b7-a8d56b490728	Boutique Pattern Making & Quality Control	2150	940	56.28	Medium	2026-08-26 19:26:17.958255+00
9ba54ebf-cf8c-40e8-b6b5-c6736aba8634	Cloud Backend Engineering & Security	3200	1100	65.63	High	2026-08-26 19:26:17.958255+00
\.


--
-- Data for Name: trainee_employment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trainee_employment (id, trainee_id, status, company_name, designation, joining_date, monthly_salary, offer_letter_url, business_name, business_type, business_category, business_status, establishment_date, monthly_revenue, monthly_profit, udyam_number, gst_number, business_address, employees_count, verified_by_admin, verified_at, created_at, updated_at) FROM stdin;
49b100b8-0930-40ca-b80f-159dbd933a9e	8db21243-0294-4d8f-b6fd-a77ee675de65	self_employed	\N	\N	\N	0.00	\N	Priya Designer Boutique	Micro Enterprise	Apparel & Fashion	active	2023-08-15	45000.00	18500.00	UDYAM-MH-26-0048291	27ABCDE1234F1Z5	Shop 12, FC Road, Pune	4	t	\N	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
d7b550cb-ca62-4fdc-a47e-80a345c396b8	212e0f6a-9233-406d-9975-05161a14e6ff	employed	Mahagenco Green Energy Solutions	Lead Solar Technician	2023-06-01	28500.00	\N	\N	\N	\N	active	\N	0.00	0.00	\N	\N	\N	0	t	\N	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
444b91d8-ab1d-4215-aff3-4c8191d6697e	2823e93f-cbe9-4368-98bf-04977bc8f3c0	self_employed	\N	\N	\N	0.00	\N	Patil Cloud Consulting	Sole Proprietorship	IT & Digital Services	active	2023-09-01	65000.00	42000.00	UDYAM-MH-15-0063910	\N	\N	2	t	\N	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
8e43e8f1-7e6a-49f5-b098-725b58f97049	ba1727b9-703c-45ed-adaf-b563ffe2ab80	self_employed	\N	\N	\N	0.00	\N	Gaikwad EV Service Center	Partnership	Automotive Services	active	2024-01-15	38000.00	16000.00	\N	\N	\N	2	f	\N	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
d2ea84f4-70af-4e08-a1fb-c45396a6a2e2	4c5716ac-0820-44b3-a773-834cee89f9e7	self_employed	\N	\N	\N	0.00	\N	Thane Stitchworks	Private Limited	Textiles & Garments	active	2023-04-10	92000.00	31000.00	UDYAM-MH-33-0074192	\N	\N	6	t	\N	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
\.


--
-- Data for Name: trainee_enrollments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trainee_enrollments (id, trainee_id, program_id, enrolled_date, completed_date, certified_date, certificate_id, status, grade, created_at) FROM stdin;
58b488d7-0535-46d7-b02e-f00a535bae6e	8db21243-0294-4d8f-b6fd-a77ee675de65	c6a0d3e0-d319-469c-8878-eaef0463de26	2023-01-10	2023-04-10	2023-04-15	MS-CERT-904302	certified	A+	2026-08-26 19:35:41.137214+00
0abb549c-ece2-4852-a4b7-11c63d102a59	212e0f6a-9233-406d-9975-05161a14e6ff	71496e5c-0ab2-4010-93a4-425c550630e9	2023-02-01	2023-05-30	2023-06-05	MS-CERT-834141	certified	A	2026-08-26 19:35:41.137214+00
\.


--
-- Data for Name: trainee_followups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trainee_followups (id, trainee_id, milestone, due_date, completed_date, status, current_status, current_income_range, income_growth_pct, job_satisfaction_score, skill_utilization_score, additional_support_needed, survey_channel, survey_data_json, created_at, updated_at) FROM stdin;
5d2db958-877d-44de-8a92-fddc5227bf57	8db21243-0294-4d8f-b6fd-a77ee675de65	6_months	2023-10-15	2023-10-12	completed	self_employed	₹35,000 - ₹50,000	45.00	5	\N	\N	web_portal	{}	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
\.


--
-- Data for Name: trainee_notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trainee_notifications (id, trainee_id, title, message, type, is_read, created_at) FROM stdin;
\.


--
-- Data for Name: trainees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.trainees (id, user_id, trainee_id, username, full_name, email, phone, dob, gender, aadhaar_masked, address, district, state, pincode, avatar_url, profile_completion_pct, is_active, highest_education, board_university, year_of_passing, education_percentage, skills, about_me, privacy_hash, created_at, updated_at) FROM stdin;
212e0f6a-9233-406d-9975-05161a14e6ff	\N	TRN-519284	rahul_solar	Rahul Deshmukh	rahul.deshmukh@mahaskill.in	+91 97654 32109	2001-09-20	Male	XXXX-XXXX-0000	Plot 18, Wardha Road	Nagpur	Maharashtra			85	t	ITI Electrical	MSBTE Maharashtra	2021	79.20	{"Solar Rooftop PV","Inverter Diagnostics","High-Voltage Safety","Grid Sync"}	Grid solar installation specialist certified under NISE with experience in commercial rooftop installations across Vidarbha.	6bf9d298c8bc4591853f55e934d6814de9b7878508107265d8faca25bedb08c8	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
2823e93f-cbe9-4368-98bf-04977bc8f3c0	\N	TRN-639102	snehal_tech	Snehal Patil	snehal.patil@mahaskill.in	+91 94230 87654	2000-11-08	Female	XXXX-XXXX-0000	College Road, Nashik	Nashik	Maharashtra			95	t	B.Sc Computer Science	Savitribai Phule Pune University	2022	84.50	{"Full-Stack Development",PostgreSQL,"Cloud Infrastructure","REST APIs"}	Building next-generation digital tools and agri-commerce solutions for farmers and rural self-help groups in North Maharashtra.	e2a75c8104faaa783d47eb425cd1edb68b270b19ca157d0190e4a7c2474b264c	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
ba1727b9-703c-45ed-adaf-b563ffe2ab80	\N	TRN-392817	amit_ev	Amit Gaikwad	amit.gaikwad@mahaskill.in	+91 98901 23456	2003-02-28	Male	XXXX-XXXX-0000	CIDCO N-4	Aurangabad (Chhatrapati Sambhajinagar)	Maharashtra			80	t	10th Standard + ITI Mechanic	Maharashtra Vocational Board	2022	76.80	{"EV Powertrain","Lithium Battery Repair","BMS Calibration","Motor Controllers"}	Certified EV service technician operating independent two-wheeler EV repair hub funded under PM Mudra Shishu grant.	776954c530620154bc6bb25040e8177d2934515acb0608207a7efca6aeb13d59	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
4c5716ac-0820-44b3-a773-834cee89f9e7	\N	TRN-741920	kavita_thane	Kavita Jadhav	kavita.jadhav@mahaskill.in	+91 98190 65432	1999-07-19	Female	XXXX-XXXX-0000	Ghodbunder Road	Thane	Maharashtra			90	t	Diploma in Textile Technology	Government Polytechnic Thane	2020	88.30	{"Textile Quality Testing","Industrial Sewing",Merchandising,"Export Standards"}	Textile quality supervisor and owner of Thane Stitchworks, exporting eco-friendly fabric bags and apparel.	be929bc6dcaa5363ccb0693580b746498ddef3c805f4a805837b1c9d2200d91a	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
54accd10-6c84-4931-a1e8-c2c6386bfc3f	b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e	TRN-575336	superadmin	Super Administrator	admin@nexus.com		2000-01-01	Not Specified	XXXX-XXXX-0000			Maharashtra			30	t			2022	0.00	{}		1f61b59ab46958cb2321128213262215b383e18b072ffca567db882141feae46	2026-08-26 19:49:30.175888+00	2026-08-26 19:49:30.175888+00
5c49bdd7-d279-4ff2-8484-668598ed32d1	\N	TRN-250605	test_officer	Admin (test_officer)	testofficer@mssds.gov.in		2000-01-01	Not Specified	XXXX-XXXX-0000			Maharashtra			30	t			2022	0.00	{}		626cf8a8cd19f398ee9c36a21cfd33e46f14dc955398f051b1d6ba29bcabe1c8	2026-08-26 19:31:39.831225+00	2026-08-26 19:31:39.831225+00
bfdd9ed2-3a4e-4964-bc6f-0c1b3dd2b1bf	\N	TRN-742028	pune_officer	Admin (pune_officer)	pune.officer@mssds.gov.in		2000-01-01	Not Specified	XXXX-XXXX-0000			Maharashtra			30	t			2022	0.00	{}		6031d2383148340765afb94a5f74558a6d90f964ea61869e251b4025dfd6895a	2026-08-26 19:32:09.186409+00	2026-08-26 19:32:09.186409+00
8db21243-0294-4d8f-b6fd-a77ee675de65	8db21243-0294-4d8f-b6fd-a77ee675de65	TRN-847291	priya_sharma	Priya Sharma	priya.sharma@mahaskill.in	+91 98231 45678	2002-05-14	Female	XXXX-XXXX-0000	Flat 402, Shivajinagar	Pune	Maharashtra			90	t	12th Standard (Arts)	Maharashtra State Board	2020	81.40	{"Boutique Tailoring","Pattern Design","Digital Payments","ONDC Selling"}	Certified garment specialist and founder of Priya Designer Boutique. Empowering 4 local artisans through custom apparel manufacturing.	9bf2830fbde5525d6976c3c3fcb8cebe37352b925b45350223d2818807bcbaba	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
\.


--
-- Data for Name: training_programs; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.training_programs (id, title, sector, duration_months, provider_name, description, created_at) FROM stdin;
c6a0d3e0-d319-469c-8878-eaef0463de26	Advanced Tailoring & Garment Manufacturing	Apparel & Fashion	3	Maharashtra State Skill Development Society (MSSDS)	Comprehensive industrial stitching, pattern design, and boutique entrepreneurship.	2026-08-26 19:26:17.956644+00
71496e5c-0ab2-4010-93a4-425c550630e9	Solar PV Rooftop Technician	Renewable Energy	4	National Institute of Solar Energy (NISE)	Grid-connected solar system design, inverter configuration, and safety compliance.	2026-08-26 19:26:17.956644+00
db9398c1-15dd-44f9-997c-ad53e623fc3d	Full-Stack Web Development & Cloud Deployment	IT & ITeS	6	National Skill Development Corporation (NSDC)	Modern enterprise web architecture, database design, and cloud scalability.	2026-08-26 19:26:17.956644+00
d74eaf3a-0de9-4318-b98d-cbc905ec809a	Automotive Electric Vehicle (EV) Maintenance	Automotive	4	Automotive Skills Development Council (ASDC)	EV battery diagnostics, motor controllers, and regenerative braking repair.	2026-08-26 19:26:17.956644+00
\.


--
-- Data for Name: user_roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_roles (id, user_id, email, username, role, created_at) FROM stdin;
b4722443-afe5-42d2-b7d5-4bdf5e493bba	8db21243-0294-4d8f-b6fd-a77ee675de65	priya.sharma@mahaskill.in	priya_sharma	trainee	2026-08-27 03:59:51.024811+00
1e662b0b-7d53-44a4-bc82-7b3fb6658045	b2c3d4e5-f6a7-8b9c-0d1e-2f3a4b5c6d7e	admin@nexus.com	superadmin	superadmin	2026-08-26 19:49:30.175888+00
\.


--
-- Data for Name: verifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verifications (id, trainee_id, document_type, document_name, document_url, status, admin_notes, reviewed_by, reviewed_at, created_at) FROM stdin;
87b9d0db-dd12-4ee8-ae1f-27f74a313292	8db21243-0294-4d8f-b6fd-a77ee675de65	udyam	Udyam Registration Certificate - Priya Boutique.pdf	https://api.avishkark.in/storage/v1/object/public/docs/udyam_sample.pdf	approved	\N	admin@nexus.com	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
309f31c1-2943-48c5-919f-f3b082fc455b	212e0f6a-9233-406d-9975-05161a14e6ff	offer_letter	Offer Letter & Salary Slip - Mahagenco.pdf	https://api.avishkark.in/storage/v1/object/public/docs/offer_sample.pdf	approved	\N	admin@nexus.com	2026-08-26 19:35:41.137214+00	2026-08-26 19:35:41.137214+00
8fec74da-c2b1-455d-8435-79fc228163fb	ba1727b9-703c-45ed-adaf-b563ffe2ab80	bank_statement	Mudra Loan Sanction Letter - Bank of Maharashtra.pdf	https://api.avishkark.in/storage/v1/object/public/docs/mudra_sample.pdf	pending	\N	\N	\N	2026-08-26 19:35:41.137214+00
4a06c83a-0521-4e47-a3df-cb0279745534	4c5716ac-0820-44b3-a773-834cee89f9e7	gst	GST Registration Certificate - Thane Stitchworks.pdf	https://api.avishkark.in/storage/v1/object/public/docs/gst_sample.pdf	pending	\N	\N	\N	2026-08-26 19:35:41.137214+00
\.


--
-- Name: ai_policy_insights ai_policy_insights_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ai_policy_insights
    ADD CONSTRAINT ai_policy_insights_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: district_employment_stats district_employment_stats_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.district_employment_stats
    ADD CONSTRAINT district_employment_stats_pkey PRIMARY KEY (id);


--
-- Name: government_schemes government_schemes_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.government_schemes
    ADD CONSTRAINT government_schemes_name_key UNIQUE (name);


--
-- Name: government_schemes government_schemes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.government_schemes
    ADD CONSTRAINT government_schemes_pkey PRIMARY KEY (id);


--
-- Name: promo_codes promo_codes_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promo_codes
    ADD CONSTRAINT promo_codes_code_key UNIQUE (code);


--
-- Name: promo_codes promo_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.promo_codes
    ADD CONSTRAINT promo_codes_pkey PRIMARY KEY (id);


--
-- Name: recommended_opportunities recommended_opportunities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.recommended_opportunities
    ADD CONSTRAINT recommended_opportunities_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_pkey PRIMARY KEY (id);


--
-- Name: top_skill_gaps top_skill_gaps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.top_skill_gaps
    ADD CONSTRAINT top_skill_gaps_pkey PRIMARY KEY (id);


--
-- Name: trainee_employment trainee_employment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_employment
    ADD CONSTRAINT trainee_employment_pkey PRIMARY KEY (id);


--
-- Name: trainee_enrollments trainee_enrollments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_enrollments
    ADD CONSTRAINT trainee_enrollments_pkey PRIMARY KEY (id);


--
-- Name: trainee_followups trainee_followups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_followups
    ADD CONSTRAINT trainee_followups_pkey PRIMARY KEY (id);


--
-- Name: trainee_notifications trainee_notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_notifications
    ADD CONSTRAINT trainee_notifications_pkey PRIMARY KEY (id);


--
-- Name: trainees trainees_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_email_key UNIQUE (email);


--
-- Name: trainees trainees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_pkey PRIMARY KEY (id);


--
-- Name: trainees trainees_privacy_hash_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_privacy_hash_key UNIQUE (privacy_hash);


--
-- Name: trainees trainees_trainee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_trainee_id_key UNIQUE (trainee_id);


--
-- Name: trainees trainees_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_username_key UNIQUE (username);


--
-- Name: training_programs training_programs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training_programs
    ADD CONSTRAINT training_programs_pkey PRIMARY KEY (id);


--
-- Name: training_programs training_programs_title_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.training_programs
    ADD CONSTRAINT training_programs_title_key UNIQUE (title);


--
-- Name: user_roles user_roles_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_email_key UNIQUE (email);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: verifications verifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verifications
    ADD CONSTRAINT verifications_pkey PRIMARY KEY (id);


--
-- Name: support_tickets support_tickets_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.support_tickets
    ADD CONSTRAINT support_tickets_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE SET NULL;


--
-- Name: trainee_employment trainee_employment_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_employment
    ADD CONSTRAINT trainee_employment_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: trainee_enrollments trainee_enrollments_program_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_enrollments
    ADD CONSTRAINT trainee_enrollments_program_id_fkey FOREIGN KEY (program_id) REFERENCES public.training_programs(id) ON DELETE CASCADE;


--
-- Name: trainee_enrollments trainee_enrollments_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_enrollments
    ADD CONSTRAINT trainee_enrollments_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: trainee_followups trainee_followups_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_followups
    ADD CONSTRAINT trainee_followups_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: trainee_notifications trainee_notifications_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainee_notifications
    ADD CONSTRAINT trainee_notifications_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: trainees trainees_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trainees
    ADD CONSTRAINT trainees_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE SET NULL;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: verifications verifications_trainee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verifications
    ADD CONSTRAINT verifications_trainee_id_fkey FOREIGN KEY (trainee_id) REFERENCES public.trainees(id) ON DELETE CASCADE;


--
-- Name: audit_logs Permissive delete audit_logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive delete audit_logs" ON public.audit_logs FOR DELETE USING (true);


--
-- Name: government_schemes Permissive delete government_schemes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive delete government_schemes" ON public.government_schemes FOR DELETE USING (true);


--
-- Name: promo_codes Permissive delete promo_codes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive delete promo_codes" ON public.promo_codes FOR DELETE USING (true);


--
-- Name: support_tickets Permissive delete support_tickets; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive delete support_tickets" ON public.support_tickets FOR DELETE USING (true);


--
-- Name: trainee_employment Permissive delete trainee_employment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive delete trainee_employment" ON public.trainee_employment FOR DELETE USING (true);


--
-- Name: trainee_enrollments Permissive delete trainee_enrollments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive delete trainee_enrollments" ON public.trainee_enrollments FOR DELETE USING (true);


--
-- Name: trainee_followups Permissive delete trainee_followups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive delete trainee_followups" ON public.trainee_followups FOR DELETE USING (true);


--
-- Name: trainees Permissive delete trainees; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive delete trainees" ON public.trainees FOR DELETE USING (true);


--
-- Name: training_programs Permissive delete training_programs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive delete training_programs" ON public.training_programs FOR DELETE USING (true);


--
-- Name: user_roles Permissive delete user_roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive delete user_roles" ON public.user_roles FOR DELETE USING (true);


--
-- Name: verifications Permissive delete verifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive delete verifications" ON public.verifications FOR DELETE USING (true);


--
-- Name: audit_logs Permissive insert audit_logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive insert audit_logs" ON public.audit_logs FOR INSERT WITH CHECK (true);


--
-- Name: government_schemes Permissive insert government_schemes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive insert government_schemes" ON public.government_schemes FOR INSERT WITH CHECK (true);


--
-- Name: promo_codes Permissive insert promo_codes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive insert promo_codes" ON public.promo_codes FOR INSERT WITH CHECK (true);


--
-- Name: support_tickets Permissive insert support_tickets; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive insert support_tickets" ON public.support_tickets FOR INSERT WITH CHECK (true);


--
-- Name: trainee_employment Permissive insert trainee_employment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive insert trainee_employment" ON public.trainee_employment FOR INSERT WITH CHECK (true);


--
-- Name: trainee_enrollments Permissive insert trainee_enrollments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive insert trainee_enrollments" ON public.trainee_enrollments FOR INSERT WITH CHECK (true);


--
-- Name: trainee_followups Permissive insert trainee_followups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive insert trainee_followups" ON public.trainee_followups FOR INSERT WITH CHECK (true);


--
-- Name: trainees Permissive insert trainees; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive insert trainees" ON public.trainees FOR INSERT WITH CHECK (true);


--
-- Name: training_programs Permissive insert training_programs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive insert training_programs" ON public.training_programs FOR INSERT WITH CHECK (true);


--
-- Name: user_roles Permissive insert user_roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive insert user_roles" ON public.user_roles FOR INSERT WITH CHECK (true);


--
-- Name: verifications Permissive insert verifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive insert verifications" ON public.verifications FOR INSERT WITH CHECK (true);


--
-- Name: ai_policy_insights Permissive read ai_policy_insights; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read ai_policy_insights" ON public.ai_policy_insights FOR SELECT USING (true);


--
-- Name: audit_logs Permissive read audit_logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read audit_logs" ON public.audit_logs FOR SELECT USING (true);


--
-- Name: district_employment_stats Permissive read district_employment_stats; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read district_employment_stats" ON public.district_employment_stats FOR SELECT USING (true);


--
-- Name: government_schemes Permissive read government_schemes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read government_schemes" ON public.government_schemes FOR SELECT USING (true);


--
-- Name: promo_codes Permissive read promo_codes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read promo_codes" ON public.promo_codes FOR SELECT USING (true);


--
-- Name: recommended_opportunities Permissive read recommended_opportunities; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read recommended_opportunities" ON public.recommended_opportunities FOR SELECT USING (true);


--
-- Name: support_tickets Permissive read support_tickets; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read support_tickets" ON public.support_tickets FOR SELECT USING (true);


--
-- Name: top_skill_gaps Permissive read top_skill_gaps; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read top_skill_gaps" ON public.top_skill_gaps FOR SELECT USING (true);


--
-- Name: trainee_employment Permissive read trainee_employment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read trainee_employment" ON public.trainee_employment FOR SELECT USING (true);


--
-- Name: trainee_enrollments Permissive read trainee_enrollments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read trainee_enrollments" ON public.trainee_enrollments FOR SELECT USING (true);


--
-- Name: trainee_followups Permissive read trainee_followups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read trainee_followups" ON public.trainee_followups FOR SELECT USING (true);


--
-- Name: trainee_notifications Permissive read trainee_notifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read trainee_notifications" ON public.trainee_notifications FOR SELECT USING (true);


--
-- Name: trainees Permissive read trainees; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read trainees" ON public.trainees FOR SELECT USING (true);


--
-- Name: training_programs Permissive read training_programs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read training_programs" ON public.training_programs FOR SELECT USING (true);


--
-- Name: user_roles Permissive read user_roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read user_roles" ON public.user_roles FOR SELECT USING (true);


--
-- Name: verifications Permissive read verifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive read verifications" ON public.verifications FOR SELECT USING (true);


--
-- Name: audit_logs Permissive update audit_logs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive update audit_logs" ON public.audit_logs FOR UPDATE USING (true);


--
-- Name: government_schemes Permissive update government_schemes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive update government_schemes" ON public.government_schemes FOR UPDATE USING (true);


--
-- Name: promo_codes Permissive update promo_codes; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive update promo_codes" ON public.promo_codes FOR UPDATE USING (true);


--
-- Name: support_tickets Permissive update support_tickets; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive update support_tickets" ON public.support_tickets FOR UPDATE USING (true);


--
-- Name: trainee_employment Permissive update trainee_employment; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive update trainee_employment" ON public.trainee_employment FOR UPDATE USING (true);


--
-- Name: trainee_enrollments Permissive update trainee_enrollments; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive update trainee_enrollments" ON public.trainee_enrollments FOR UPDATE USING (true);


--
-- Name: trainee_followups Permissive update trainee_followups; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive update trainee_followups" ON public.trainee_followups FOR UPDATE USING (true);


--
-- Name: trainees Permissive update trainees; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive update trainees" ON public.trainees FOR UPDATE USING (true);


--
-- Name: training_programs Permissive update training_programs; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive update training_programs" ON public.training_programs FOR UPDATE USING (true);


--
-- Name: user_roles Permissive update user_roles; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive update user_roles" ON public.user_roles FOR UPDATE USING (true);


--
-- Name: verifications Permissive update verifications; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY "Permissive update verifications" ON public.verifications FOR UPDATE USING (true);


--
-- Name: ai_policy_insights; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.ai_policy_insights ENABLE ROW LEVEL SECURITY;

--
-- Name: audit_logs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

--
-- Name: district_employment_stats; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.district_employment_stats ENABLE ROW LEVEL SECURITY;

--
-- Name: government_schemes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;

--
-- Name: promo_codes; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.promo_codes ENABLE ROW LEVEL SECURITY;

--
-- Name: recommended_opportunities; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.recommended_opportunities ENABLE ROW LEVEL SECURITY;

--
-- Name: support_tickets; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;

--
-- Name: top_skill_gaps; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.top_skill_gaps ENABLE ROW LEVEL SECURITY;

--
-- Name: trainee_employment; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trainee_employment ENABLE ROW LEVEL SECURITY;

--
-- Name: trainee_enrollments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trainee_enrollments ENABLE ROW LEVEL SECURITY;

--
-- Name: trainee_followups; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trainee_followups ENABLE ROW LEVEL SECURITY;

--
-- Name: trainee_notifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trainee_notifications ENABLE ROW LEVEL SECURITY;

--
-- Name: trainees; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.trainees ENABLE ROW LEVEL SECURITY;

--
-- Name: training_programs; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.training_programs ENABLE ROW LEVEL SECURITY;

--
-- Name: user_roles; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

--
-- Name: verifications; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.verifications ENABLE ROW LEVEL SECURITY;

--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA public TO postgres;
GRANT USAGE ON SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO service_role;


--
-- Name: FUNCTION handle_new_user(); Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON FUNCTION public.handle_new_user() TO anon;
GRANT ALL ON FUNCTION public.handle_new_user() TO authenticated;
GRANT ALL ON FUNCTION public.handle_new_user() TO service_role;


--
-- Name: TABLE ai_policy_insights; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.ai_policy_insights TO anon;
GRANT ALL ON TABLE public.ai_policy_insights TO authenticated;
GRANT ALL ON TABLE public.ai_policy_insights TO service_role;


--
-- Name: TABLE audit_logs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.audit_logs TO anon;
GRANT ALL ON TABLE public.audit_logs TO authenticated;
GRANT ALL ON TABLE public.audit_logs TO service_role;


--
-- Name: TABLE district_employment_stats; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.district_employment_stats TO anon;
GRANT ALL ON TABLE public.district_employment_stats TO authenticated;
GRANT ALL ON TABLE public.district_employment_stats TO service_role;


--
-- Name: TABLE government_schemes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.government_schemes TO anon;
GRANT ALL ON TABLE public.government_schemes TO authenticated;
GRANT ALL ON TABLE public.government_schemes TO service_role;


--
-- Name: TABLE promo_codes; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.promo_codes TO anon;
GRANT ALL ON TABLE public.promo_codes TO authenticated;
GRANT ALL ON TABLE public.promo_codes TO service_role;


--
-- Name: TABLE recommended_opportunities; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.recommended_opportunities TO anon;
GRANT ALL ON TABLE public.recommended_opportunities TO authenticated;
GRANT ALL ON TABLE public.recommended_opportunities TO service_role;


--
-- Name: TABLE support_tickets; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.support_tickets TO anon;
GRANT ALL ON TABLE public.support_tickets TO authenticated;
GRANT ALL ON TABLE public.support_tickets TO service_role;


--
-- Name: TABLE top_skill_gaps; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.top_skill_gaps TO anon;
GRANT ALL ON TABLE public.top_skill_gaps TO authenticated;
GRANT ALL ON TABLE public.top_skill_gaps TO service_role;


--
-- Name: TABLE trainee_employment; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trainee_employment TO anon;
GRANT ALL ON TABLE public.trainee_employment TO authenticated;
GRANT ALL ON TABLE public.trainee_employment TO service_role;


--
-- Name: TABLE trainee_enrollments; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trainee_enrollments TO anon;
GRANT ALL ON TABLE public.trainee_enrollments TO authenticated;
GRANT ALL ON TABLE public.trainee_enrollments TO service_role;


--
-- Name: TABLE trainee_followups; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trainee_followups TO anon;
GRANT ALL ON TABLE public.trainee_followups TO authenticated;
GRANT ALL ON TABLE public.trainee_followups TO service_role;


--
-- Name: TABLE trainee_notifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trainee_notifications TO anon;
GRANT ALL ON TABLE public.trainee_notifications TO authenticated;
GRANT ALL ON TABLE public.trainee_notifications TO service_role;


--
-- Name: TABLE trainees; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.trainees TO anon;
GRANT ALL ON TABLE public.trainees TO authenticated;
GRANT ALL ON TABLE public.trainees TO service_role;


--
-- Name: TABLE training_programs; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.training_programs TO anon;
GRANT ALL ON TABLE public.training_programs TO authenticated;
GRANT ALL ON TABLE public.training_programs TO service_role;


--
-- Name: TABLE user_roles; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.user_roles TO anon;
GRANT ALL ON TABLE public.user_roles TO authenticated;
GRANT ALL ON TABLE public.user_roles TO service_role;


--
-- Name: TABLE verifications; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.verifications TO anon;
GRANT ALL ON TABLE public.verifications TO authenticated;
GRANT ALL ON TABLE public.verifications TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON FUNCTIONS TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: supabase_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO postgres;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO anon;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES FOR ROLE supabase_admin IN SCHEMA public GRANT ALL ON TABLES TO service_role;


--
-- PostgreSQL database dump complete
--

\unrestrict 1bZQm5Xs55Lwn9HXXOwzXQFcpvutjPSfLd2lfheHLKz0vu7lJfg2bayOfh6tZdU

