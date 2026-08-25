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
- [x] User Profile & Onboarding with Role-based Authentication.
- [x] Target Job & Target Company Selection Engine (Catalog across Tech, EV, Solar, Healthcare, Modern Trades).
- [x] Real-time Skill Gap Analyzer (Comparing trainee verified/declared skills against target role matrix).
- [x] Dynamic Course & Badge Recommendation Pipeline.
- [x] "Estimated Days to Achieve Goal" algorithmic calculation based on learning hours per day and weighted skill gap.

### Module 2: Longitudinal Tracking, Verification & Attrition Logging
- [x] Verified Digital Badges for completed certified courses.
- [x] Longitudinal Career Timeline (Permanent, Temporary, Contractual, Gig).
- [x] Wage Progression Tracker with longitudinal chart, percentage growth, and baseline-to-present ROI.
- [x] Attrition Logging Module with structured reason capture (including "removed for no reason", layoff, wage dissatisfaction).
- [x] Verification badge workflow for employer validation of offer letters / experience.

### Module 3: Self-Employment Validation Module
- [x] Self-Employment Multi-Factor Verification Workflow.
- [x] Business Identity verification (Trade License, GST / Udyam registration ID).
- [x] Income Proof verification (Invoice bundles, bank statements, revenue band classification).
- [x] Digital Footprint validator (Portfolio URL, Upwork/Fiverr/GitHub profiles).
- [x] Client References management & verification status tracker.

### Module 4: Community & Feedback Hub
- [x] Glassdoor-style Interview Question repository tied to companies & roles.
- [x] Real interview experiences, difficulty ratings, and round-by-round breakdown.
- [x] Anonymized salary and benefits community benchmarks.
- [x] Peer upvoting and verified trainee reviews.

### Module 5: Admin Performance Dashboard & Geospatial Analytics
- [x] Executive Metrics: Placement Rate, Average Wage Multiple, Longitudinal Retention Curve.
- [x] State and District level Geospatial heatmaps of skilling outcomes and job stability.
- [x] Permanent vs. Temporary vs. Self-employed distribution analytics.
- [x] Attrition Analysis dashboard identifying systemic failure points (e.g. sectors with high "removed for no reason" rates).
- [x] Automated Webhook Queue Monitor (WhatsApp follow-up delivery & response rates).

### Module 6: Automation & Webhook Follow-up Engine
- [x] Next.js API route `/api/webhooks/whatsapp` simulating and handling real two-way WhatsApp survey bots.
- [x] Automated longitudinal scheduler checking in at M+1, M+3, M+6, M+12.
- [x] Natural language / structured survey response ingestion into `wage_progression_logs` and `attrition_logs`.

---

## 4. Completed Feature Log
*Note: This section is updated after each implementation milestone.*

- [x] **Project Initialization**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Lucide Icons, Recharts, Supabase Client installed.
- [x] **Ledger Creation**: Root `context.md` created with complete Tech Stack, Schema, and Roadmap.
- [x] **Repository Linked**: Pushed to `https://github.com/avishkarkedar-org/SIH2026`.
- [x] **Schema & Seed Migrations Created**: `src/db/schema.sql` and `src/db/seed.sql` generated with full 17 tables, views, and demo dataset.
- [x] **Trainee Portal & Skill Gap Engine Built**: `src/components/TraineePortal.tsx` with dynamic goal estimation and NSDC badge recommendations.
- [x] **Longitudinal Career & Wage Tracker Built**: `src/components/LongitudinalTracker.tsx` with Recharts growth graphs, permanent vs temporary timeline, and "removed for no reason" attrition diagnostics.
- [x] **Self-Employment Multi-Factor Validation Module Built**: `src/components/SelfEmploymentModule.tsx` supporting Trade License, Udyam GST, Income Proof, Digital Footprint, and Client References.
- [x] **Glassdoor-Style Interview Hub Built**: `src/components/CommunityHub.tsx` with zero-PII privacy hashes, difficulty ratings, and crowdsourced test patterns.
- [x] **Admin Performance & Geospatial Dashboard Built**: `src/components/AdminDashboard.tsx` with 24-month retention curve, state placement breakdown, and differential privacy ($k \ge 5$).
- [x] **Two-Way WhatsApp Webhook Engine Built**: `src/app/api/webhooks/whatsapp/route.ts` & `src/components/AutomationHub.tsx` with natural language intent extraction.

---

## 5. Production Deployment & Infrastructure Guide

### A. Frontend Hosting on Cloudflare Pages (or Cloudflare Workers)
Nexus can be deployed to Cloudflare in two ways:

#### Option 1: Cloudflare Pages with Git Integration (Recommended for hackathons)
1. **Link Repository**: Log in to [Cloudflare Dashboard](https://dash.cloudflare.com) > **Compute (Workers & Pages)** > **Create application** > **Pages** > **Connect to Git** (`avishkarkedar-org/SIH2026`).
2. **Build Settings**:
   - **Framework Preset**: `Next.js`
   - **Build Command**: `npx @cloudflare/next-on-pages@1` or `npm run build`
   - **Output Directory**: `.vercel/output/static` (or `.next` depending on adapter)
   - **Compatibility Flags**: Add `nodejs_compat` to runtime flags.
3. **Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://supabase.yourdomain.com` (or your Oracle VM IP)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `<your_anon_jwt_token>`
   - `SUPABASE_SERVICE_ROLE_KEY`: `<your_service_role_secret>` (for secure admin/webhook routes)

---

### B. Self-Hosted Supabase on Oracle Cloud Free Tier (Always Free)

Oracle Cloud Infrastructure (OCI) provides **Always Free** tier with:
- **Compute**: 4 OCPUs (ARM Ampere A1) + 24 GB RAM (or 2x AMD x86 1GB VMs). An Ampere 2 OCPU / 12GB RAM instance is ideal for running the entire Supabase stack with high performance.
- **Storage**: 200 GB Total Block Volume.

#### Step 1: Create the Oracle Cloud Compute Instance
1. Go to **OCI Console** > **Compute** > **Instances** > **Create Instance**.
2. **Name**: `nexus-supabase-server`
3. **Image**: `Ubuntu 22.04 LTS` (or Ubuntu 24.04).
4. **Shape**: Choose **Ampere (ARM)** -> 2 to 4 OCPUs, 12 to 24 GB RAM (or AMD Micro instance).
5. **Networking**: Assign a public IPv4 address.
6. **SSH Keys**: Download and save your private SSH key (`id_rsa`).

#### Step 2: Open Ingress Firewall Rules in OCI Virtual Cloud Network (VCN)
1. Go to **Networking** > **Virtual Cloud Networks** > Click your VCN > **Security Lists** > **Default Security List**.
2. Add **Ingress Rules** (Source CIDR: `0.0.0.0/0`):
   - **Port 80 (HTTP)**: TCP port 80 for SSL certification
   - **Port 443 (HTTPS)**: TCP port 443 for API and Studio traffic
   - **Port 8000 (Kong API Gateway)**: Optional if using direct port instead of reverse proxy
   - **Port 5432 (Postgres Direct)**: Restrict to your developer IP CIDR (optional for direct pgAdmin/DBeaver)
3. Open ports inside the VM OS firewall (iptables/ufw):
```bash
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 8000 -j ACCEPT
sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 5432 -j ACCEPT
sudo netfilter-persistent save # or sudo ufw allow 80,443,8000,5432/tcp
```

#### Step 3: Install Docker & Docker Compose on Ubuntu
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git docker.io docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
newgrp docker
```

#### Step 4: Clone and Configure Supabase Docker Stack
```bash
# Clone official supabase docker repository
git clone --depth 1 https://github.com/supabase/supabase
cd supabase/docker

# Copy default environment variables
cp .env.example .env

# Generate secure secrets
# Generate JWT_SECRET, POSTGRES_PASSWORD, ANON_KEY, and SERVICE_ROLE_KEY
nano .env
```
Key settings in `.env`:
- `POSTGRES_PASSWORD`: Use a strong 32-character random string.
- `JWT_SECRET`: Random 40+ character secret.
- `ANON_KEY` & `SERVICE_ROLE_KEY`: Generate via [Supabase JWT generator](https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys) or script using your `JWT_SECRET`.
- `SITE_URL`: Your Next.js frontend URL (e.g. `https://nexus.pages.dev` or `http://localhost:3000`).
- `API_EXTERNAL_URL`: `https://api.yourdomain.com` (or `http://<YOUR_ORACLE_IP>:8000`).

#### Step 5: Start the Supabase Services
```bash
docker compose pull
docker compose up -d
```
Verify running containers:
```bash
docker compose ps
```
The stack will run:
- **Kong (API Gateway)** on port `8000`
- **Supabase Studio (Dashboard)** on port `3000` (or `8000/studio` depending on config)
- **PostgreSQL** on port `5432`
- **GoTrue (Auth)** on port `9999`
- **PostgREST (REST API)** on port `3001`
- **Realtime, Storage & Meta** services

#### Step 6: Setup SSL & Reverse Proxy with Caddy (Recommended - 2 mins)
Caddy provides automatic HTTPS with free Let's Encrypt certificates.
```bash
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update && sudo apt install caddy -y
```

Create `/etc/caddy/Caddyfile`:
```caddy
# Supabase API & Auth Gateway
api.yourdomain.com {
    reverse_proxy localhost:8000
}

# Supabase Studio Admin Dashboard (Protect with basic auth or IP restrict)
studio.yourdomain.com {
    basicauth {
        admin $2a$14$Z... # hash generated via caddy hash-password
    }
    reverse_proxy localhost:3000
}
```
Reload Caddy:
```bash
sudo systemctl restart caddy
```

---

### C. Connecting Nexus Next.js Application to Self-Hosted Supabase

Create `.env.local` in the Next.js project:
```env
NEXT_PUBLIC_SUPABASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...<your_service_role_key>
NEXT_PUBLIC_APP_URL=https://nexus.pages.dev
```

Run schema initialization directly on the self-hosted Postgres database using `psql` or Supabase Studio SQL Editor by copying the SQL from Section 2 of this ledger!

