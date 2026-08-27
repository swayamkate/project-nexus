# Nexus A–Z recovery, SQL, and product runbook

This is the source-of-truth execution order for a clean Supabase setup. Run scripts in Supabase SQL Editor as the database owner. Do not run `RESET_TEARDOWN.sql` on production.

## A–Z SQL execution order

Run these files in order. Each is already in the repository and is intentionally kept separate so a failed step can be identified.

1. `src/db/SETUP_MASTER.sql` — base enums, core tables, triggers, starter rows.
2. `src/db/MIGRATION_ENTERPRISE_SUITE.sql` — employers, vacancies, privacy requests, enterprise tables.
3. `src/db/EXPANSION_SUITE.sql` — community, assessment, career and platform expansion tables.
4. `src/db/REAL_COURSES_EXPANSION.sql` — accredited course catalog and upserts.
5. `src/db/migrations/006_platform_settings.sql` — platform settings table, defaults and public-read policy.
6. `src/db/HARDENED_PRODUCTION_RLS.sql` — removes permissive policies and installs production RLS.
7. `src/db/007_auth_rpcs.sql` — safe anonymous username availability/email lookup used by login.
8. Optional data only: `src/db/SEED_REAL_CANDIDATES.sql` and `src/db/SEED_CERT.sql`. Use only in a non-production/demo database unless the records are explicitly approved.

Do not run these as part of a normal production setup:

- `src/db/RESET_TEARDOWN.sql` — destructive teardown.
- `src/db/enable_rls.sql` — old permissive policy set; it conflicts with hardened RLS.
- `src/db/SETUP_COMPLETE_NEXUS_DB.sql` — older permissive consolidated setup; use `SETUP_MASTER.sql` plus the ordered migrations above instead.
- `src/db/seed.sql` — demo seed data; do not mix with real production records.

For an existing database where the base schema already exists, run only steps 5–7 first. The focused patch `src/db/SQL_EDITOR_COMPLETE.sql` is safe for that case and fixes the settings/RPC dependencies.

## Verification queries

Run after the scripts complete:

```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

SELECT key, value
FROM public.platform_settings
ORDER BY key;

SELECT public.is_username_available('__nexus_probe_that_should_not_exist__');

SELECT policyname, tablename
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

Expected: platform settings contains `general.support_email = "support@nexus.in"` and `surveys.milestones_months = [3,6,12,18,24]`; the probe returns `true`; private trainee tables do not have anonymous unrestricted policies.

## Required non-SQL configuration

- Set `NEXT_PUBLIC_SUPABASE_URL` and the current anon key in the Cloudflare Pages build environment, then redeploy commit `320a7f3` or newer.
- Configure Supabase Auth email confirmation and verified SMTP sender/domain. Keep SMTP credentials only in Supabase secrets, never in this repository.
- Hard-refresh existing browsers after deployment; the updated client removes the legacy `sb-api-auth-token`.
- Add a scheduled call for the admin milestone cron only after authenticating it with a secret; do not expose a public cron endpoint.
- Either implement `/api/schemes/apply` or remove it from `src/app/api/docs/page.tsx`; it is currently documentation without a matching public route.

## AI features that can stay free or nearly free

Prioritize features that do not send Aadhaar, email, phone, wage, or uploaded-document data to a model.

1. **Explainable skill-gap coach (recommended first):** use the existing deterministic `aiCareerEngine.ts` to generate a personalized missing-skill list, 30-day plan, and course recommendations. It costs nothing and is auditable.
2. **Offline survey summarizer:** aggregate only anonymous counts and trends in Postgres (employment rate, wage bands, attrition reasons). Generate plain-language admin insights with SQL templates; no external model required.
3. **Gemini Flash assistant:** optional server-side assistant for course Q&A and interview practice using redacted text. Google currently lists a free developer tier with free input/output tokens but limited model access; free-tier content may be used to improve Google products, so do not send PII. Verify current quotas before launch: https://ai.google.dev/gemini-api/docs/pricing
4. **Cloudflare Workers AI:** a good fit if the project adds a Worker/API gateway. Cloudflare currently provides 10,000 Neurons/day free on Workers Free; requests stop when the daily allocation is exhausted. Keep prompts anonymous and rate-limit per user: https://developers.cloudflare.com/workers-ai/platform/pricing/
5. **Local model on the Oracle VPS:** zero per-request API cost using Ollama or llama.cpp, but only if Antigravity confirms available RAM/CPU and adds authentication, timeouts, and a queue. This is the best privacy option for sensitive text.

Avoid making Hugging Face Inference Providers the primary production dependency: free users currently receive only a small monthly credit (listed as $0.10 and subject to change), which is useful for experiments but not reliable capacity: https://huggingface.co/docs/inference-providers/pricing

## Product recommendations

- Fix the signup/OTP path and SMTP observability before adding AI: log request ID, provider response class, and delivery status without logging email contents or tokens.
- Replace zero-valued employer dashboard metrics with an explicit “No verified data yet” state, not fake numbers.
- Add a visible data-consent screen before longitudinal surveys and document retention/deletion clearly.
- Add admin audit filters, CSV export, and an RLS smoke-test page before onboarding government users.
- Add rate limiting and CAPTCHA only after confirming it does not block low-bandwidth trainees.
- Keep all AI output advisory; never let it approve certificates, grants, eligibility, or employment verification automatically.
