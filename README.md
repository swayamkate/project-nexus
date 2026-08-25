# Nexus (PS-135)
### Privacy-Preserving, Longitudinal Skilling-Outcomes and Impact-Measurement System

Nexus is an end-to-end impact measurement and skilling intelligence platform designed for Smart India Hackathon 2026 (Problem Statement PS-135). It tracks learners across their lifetime career trajectories—measuring verified skill gains, longitudinal wage progression, employment stability (permanent vs. temporary), attrition patterns, self-employment legitimacy, and state-level policy effectiveness.

---

## ⚡ Tech Stack & Architecture

- **Frontend & API Routes:** Next.js 16 (App Router), React 19, TypeScript
- **UI & Visualization:** Tailwind CSS v4, Lucide Icons, Shadcn UI patterns, Recharts
- **Database & Auth:** Self-Hosted Supabase (PostgreSQL, Supabase Auth, Row Level Security)
- **Automation & Bots:** Next.js Webhook Routes for WhatsApp/SMS longitudinal survey triggers
- **Hosting Targets:** Cloudflare Pages / Workers (Frontend), Oracle Cloud Free Tier (Self-Hosted Supabase / Backend)

---

## 🚀 Key Modules

1. **Trainee Portal & Skill Mapping Engine:** Target career selection, real-time Skill Gap calculation, verified course badges, and "Estimated Days to Goal".
2. **Longitudinal Employment & Wage Progression:** Wage milestone logs, ROI multiplier, and job stability categorization (Permanent vs. Temporary).
3. **Attrition & Transition Logging:** Multi-factor exit diagnostics (e.g., unfair termination, wage dissatisfaction, upskilling).
4. **Self-Employment Validation Module:** Multi-pillar verification (GST/Udyam/Trade License, bank statements, client references, digital footprint).
5. **Community & Feedback Hub:** Glassdoor-style crowdsourced interview questions and peer hiring experiences.
6. **Admin Performance & Geospatial Dashboard:** National and district-level placement heatmaps and retention analytics.
7. **WhatsApp Automated Follow-up Engine:** Automated longitudinal surveys (M+1, M+3, M+6, M+12) via webhook pipelines.

---

## 🛠 Getting Started

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

---

## 📖 Architecture & Database Ledger
See [`context.md`](./context.md) for the authoritative database schema (SQL DDL), API specifications, and roadmap.
