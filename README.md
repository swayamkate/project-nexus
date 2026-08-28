# Nexus — State Vocational Skilling Intelligence & Longitudinal Outcomes System
### Smart India Hackathon 2026 (Problem Statement 135)
**Maharashtra State Skill Development Mission (SSDM) & National Skill Development Corporation (NSDC)**

---

## 🌐 Live Production Deployments & Official Access

| Application / Console | Live Production URL | Description |
| :--- | :--- | :--- |
| **Executive Administrator Control Room** | [`https://administrator.avishkark.in`](https://administrator.avishkark.in) | Superadmin governance, staff management, AI workforce intelligence, Rozgar Melawas, and verification desk. |
| **Candidate Skilling & Career Portal** | [`https://sih2026.avishkark.in`](https://sih2026.avishkark.in) | Trainee career roadmap, verified skills, dynamic employment tracker, mock interviews, and DigiLocker documents. |
| **Self-Hosted Supabase / PostgREST API** | [`https://api.avishkark.in`](https://api.avishkark.in) | PostgreSQL 17 database, GoTrue Auth server, Storage engine, and RESTful edge endpoints. |
| **Interactive API Documentation** | [`https://sih2026.avishkark.in/api/docs`](https://sih2026.avishkark.in/api/docs) | Complete OpenAPI / Swagger specification and JSON schema explorer for all endpoints. |
| **Public Certificate Verification Portal** | [`https://sih2026.avishkark.in/verify`](https://sih2026.avishkark.in/verify) | Cryptographic QR and SHA-256 certificate authenticity validation. |

---

## 🔐 Verified Administrative Logins & Official Credentials

All administrative credentials are authenticated directly against `auth.users` and `public.user_roles` with bcrypt hashing (`crypt` via `pgcrypto`):

| Role Type | Official Work Email | Username | Security Password | Access Level & Scope |
| :--- | :--- | :--- | :--- | :--- |
| **Primary State Superadmin** | `admin@avishkark.in` | `Avishkar` (or `avishkar`) | `Avishkar@443322` | **100% Unrestricted Sovereignty** (Staff creation, password resets, system governance, data overrides) |
| **Root Superadmin Backup** | `avishkarkedar@gmail.com` | `admin` | `Avishkar@6198` | **100% Unrestricted Sovereignty** (Root state recovery and failover account) |
| **District Administrator** | `admin@nexus.gov.in` | `district_admin` | `AdminPassword@2026!` | **Delegated Regional Access** (Candidate verification, assessments, course tracking, Rozgar Melawas) |
| **SSDM Evaluator Account** | `evaluator@district.gov.in` | `pune_evaluator` | `Evaluator@2026!` | **Verification Queue Only** (Document audit, Aadhaar checks, trade stamps) |

> **Candidate Sample Credentials:**
> - `priya.sharma@mahaskill.in` / `priya123456` (Username: `@priya_sharma`)
> - `rahul.verma@mahaskill.in` / `rahul123456` (Username: `@rahul_verma`)

---

## 🏗️ Architectural Topology & System Infrastructure

```
                                  [ Cloudflare DNS & SSL Edge ]
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
    [ Candidate Portal (Next.js 16) ]                     [ Admin Console (Next.js 16) ]
      https://sih2026.avishkark.in                         https://administrator.avishkark.in
                     │                                                     │
                     └──────────────────────────┬──────────────────────────┘
                                                │ HTTPS / TLS 1.3
                                                ▼
                            [ Oracle Cloud Infrastructure (OCI) VPS ]
                                       IP: 129.146.164.75
                                                │
                     ┌──────────────────────────┴──────────────────────────┐
                     ▼                                                     ▼
          [ Docker Engine Services ]                             [ PM2 Node Cluster ]
          ├── Supabase Database (PostgreSQL 17)                  ├── main-app (Port 3000)
          ├── GoTrue Auth Server (Port 9999)                     └── admin-app (Port 3001)
          ├── PostgREST REST Engine (Port 3000)
          └── Kong API Gateway / Reverse Proxy (Port 8000)
```

---

## 🗄️ Database Schema & Migrations Index

The platform is backed by a relational PostgreSQL schema with Row-Level Security (RLS) policies and automated triggers:

| Migration File | Description | Core Tables / Functions Created |
| :--- | :--- | :--- |
| `001_initial_schema.sql` | Foundational schema for Problem Statement 135 | `trainees`, `trainee_career_goals`, `trainee_course_enrollments`, `trainee_employment`, `trainee_followups` |
| `002_fix_rls.sql` | Zero-Trust RLS Policies for candidate privacy | Enabled RLS on 31 tables; isolated trainee data from anonymous reads/writes |
| `003_courses_assessments_interviews.sql` | Vocational Curricula & Crowdsourced Hub | `external_courses`, `skill_assessments`, `assessment_submissions`, `interview_questions` |
| `004_billing_subsidies.sql` | State Scheme Subsidies & Trainee Stipends | `government_schemes`, `subsidy_disbursements`, `training_partner_billing` |
| `005_audit_logs.sql` | Append-Only Forensic Audit Trail | `audit_logs` (actor, IP, target entity, before/after diffs) |
| `006_platform_settings.sql` | White-Label State Branding & Customizer | `platform_settings` (colors, logos, support email, languages, features) |
| `007_enterprise_hardening.sql` | Security Hardening & Zero-PII Encryption | Cryptographic SHA-256 tokens, rate-limiting rules, session timeouts |
| `008_real_data_seed.sql` | Real Maharashtra Baseline Industrial Data | Seeded real NPTEL courses, NSQF trade tests, and MIDC interview questions |
| `009_multi_dimensional_analytics.sql` | Longitudinal Multi-Vector Diagnostics | Views for Cohort, District, Course, Provider, and Non-Placement reasons |
| `010_superadmin_staff_governance.sql` | Staff Authority & Password Reset RPC | `user_roles.permissions`, `user_roles.is_active`, `public.admin_reset_user_password` |
| `011_exact_superadmin_credentials.sql` | Production SuperAdmin Credentials | Configured `admin@avishkark.in` and `avishkarkedar@gmail.com` |
| `012_enterprise_features_suite.sql` | AI Workforce, Security Checks & Melawas | `job_market_vacancies`, `rozgar_melawas`, `melawa_registrations`, `trainee_profile_audit_logs`, `document_fraud_checks`, `trade_demand_forecasts`, `curriculum_gap_analyses` |

---

## 🚀 Key Functional Modules & Engines

### 1. State SuperAdmin Governance & Staff Desk
- **Staff Provisioning**: Create `superadmin`, `admin`, or `evaluator` accounts with custom district jurisdictions.
- **Direct Password Overrides**: Reset passwords for any staff member instantly via PostgreSQL RPC without email token bottlenecks.
- **Granular RBAC Matrix**: Toggle individual feature permissions (`can_edit_schemes`, `can_edit_courses`, `can_edit_assessments`, `can_verify_trainees`, `can_manage_users`, `can_publish_analytics`).
- **Complete Trainee Modification Suite**: Override any candidate record (Personal, Academic, Skills, Wage Employment, MSME Business Details, Unemployed Perspective, KYC).

### 2. AI Workforce Intelligence & Predictive Labor Analytics
- **Live Vacancy Aggregator**: Real-time vacancy ingestion across MIDC industrial corridors (Pune Bhosari, Chakan, Ambad, MIHAN, Waluj).
- **5-Year Trade Forecasting (2026–2030)**: Growth modeling for emerging sectors (Green Hydrogen, EV Battery Assembly, Rooftop Solar, 5-Axis CNC).
- **Automated Curriculum Gap Diagnostic**: Compares industrial job descriptions against DGET/NSQF syllabi to highlight missing practical modules.
- **Cross-Sector Skill Translatability Matrix**: Calculates competency overlap between traditional trades and high-growth sectors with required bridge hours.
- **3-Month Attrition Early-Warning Radar**: Neural risk scoring detecting early resignation risks based on starting wage vs. district living expenses.

### 3. State Rozgar Melawas & Second-Chance Re-Engagement
- **Event Management Console**: Schedule state job fairs, assign host districts, map venue coordinates, and allocate corporate recruiter quotas.
- **Second-Chance Candidate Queue**: Automatically aggregates candidates seeking placement and matches them to upcoming drives.
- **Cryptographic Entry QR Passes**: Generates verifiable `QR-SSDM-XXXX-XXXX` tokens for candidate registration and on-spot kiosk check-in.

### 4. Candidate KYC, Document Vault & Anti-Fraud Radar
- **Duplicate Identity & Dual-Enrollment Radar**: Detects duplicate phone numbers, duplicate masked Aadhaar patterns, or multi-scheme subsidy exploitation.
- **Document Tamper & Anomaly Scanner**: Image pixel and metadata analyzer verifying cryptographic document authenticity against MSME/DGET signatures.
- **Dynamic Employment Pathways**:
  - *Wage Employed*: Employer, Designation, Monthly Salary (₹), Joining Date, PF/ESIC UAN.
  - *Micro-Enterprise (MSME)*: Business Name, Category, Turnover (₹), Net Profit (₹), Udyam Number, GSTIN.
  - *Seeking Placement*: Root-cause barrier dropdown, narrative candidate perspective, target timeline, requested SSDM support.
- **Photo & Avatar Upload**: Trainees can upload device photos (JPEG/PNG/WebP with client-side 2MB validation and preview) or choose state presets.

---

## 📋 Comprehensive 100 Enterprise Features Catalog

The complete architectural blueprint with 100 structured enterprise features is documented in [`ADMIN_100_FEATURES_ROADMAP.md`](./ADMIN_100_FEATURES_ROADMAP.md):

1. **AI Workforce Intelligence & Predictive Labor Analytics (1–15)**: Geospatial shortage heatmaps, wage drift models, automated resume indexing, trade demand forecasting, voice-to-text interview scoring.
2. **Longitudinal Tracking & Multi-Year Post-Placement (16–30)**: Automated WhatsApp/IVR surveys at 3M/6M/12M/24M/36M, career mobility radar, job stability scorecards, wage lift visualizer.
3. **Candidate KYC & Identity Workflows (31–45)**: DigiLocker enclave, Aadhaar masked e-KYC, duplicate identity radar, document fraud scanner, cryptographic QR pass generator.
4. **Training Partner (TP) & ITI Center Inspections (46–60)**: Accreditation scorecards (1-5★), geo-tagged biometric attendance, surprise inspection orders, ToT registry, CCTV stream audits.
5. **Employer Ecosystem, Melawas & Job Melas (61–75)**: Rozgar Melawa console, corporate hiring pledge tracker, offer letter authenticator, CSR matching, bulk recruitment desk.
6. **Micro-Enterprise, MSME & Self-Employment (76–85)**: Udyam validator, MUDRA/PMEGP loan linkage, toolkit subsidy tracker, ONDC/GeM onboarding, micro-enterprise profit monitors.
7. **Security, Zero-PII Cryptography & Compliance (86–92)**: Zero-PII SHA-256 tokens, granular RBAC, immutable forensic audit trail, SuperAdmin 2FA, DPDP Act 2023 compliance.
8. **Multi-Channel Communication & Policy Simulators (93–100)**: 36-district GIS maps, targeted SMS/WhatsApp broadcasts, white-label branding customizer, multilingual CMS (English, Marathi, Hindi), Cabinet Briefing PDF generator.

---

## 💻 Local Setup & Development Guide

### Prerequisites
- Node.js 20+ or 22+
- npm 10+
- PostgreSQL 15+ (or connection to self-hosted Supabase instance)

### Installation
```bash
# Clone repository
git clone https://github.com/avishkarkedar-org/SIH2026.git
cd SIH2026

# Install candidate portal dependencies
npm install

# Install administrator console dependencies
cd admin-app
npm install
cd ..
```

### Environment Configuration (`.env.local`)
Create `.env.local` in both root and `admin-app` directories:
```env
NEXT_PUBLIC_SUPABASE_URL=https://api.avishkark.in
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3MjQ2ODAwMDAsImV4cCI6MjAzOTk5OTk5OX0.e4hI0xYF88v4tU752c1k-gVwIu-sM6aM0o2W1kY4j5k
```

### Running Locally
```bash
# Terminal 1: Candidate Skilling Portal (Runs on http://localhost:3000)
npm run dev

# Terminal 2: Administrator Console (Runs on http://localhost:3001)
cd admin-app
npm run dev
```

### Running Automated Test Suite
```bash
# Executes all 28 unit, schema, security, and cryptographic tests
npm test
```

### Production Build
```bash
# Build candidate portal
npm run build

# Build administrator console
cd admin-app
npm run build
cd ..
```

---

## 📜 Authors & Copyright

**Project Nexus — Smart India Hackathon 2026**  
*Built for the Maharashtra State Skill Development Mission (SSDM) & Ministry of Skill Development and Entrepreneurship (MSDE).*
