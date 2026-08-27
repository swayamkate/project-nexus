# Antigravity execution runbook

## Current audit findings

- Public routes `/`, `/login`, `/contact`, `/privacy-policy`, `/terms`, `/verify`, `/employers`, and `/api/docs` load.
- `/dashboard` shows its unauthenticated loading state, as expected.
- `/employers` currently reports 0 employers and 0 openings; this is empty production data, not a rendering failure.
- The login 401 was caused by the legacy `sb-api-auth-token` browser storage key. The source fix is in `src/lib/supabaseBrowser.ts` and has been pushed in commit `dc4f44e`.
- Support contact text is inconsistent: public contact/privacy pages use `support@nexus.in`, while platform defaults used `support@nexus.gov.in`. The SQL patch standardizes the database setting to `support@nexus.in`.
- Terms/privacy/docs describe 18-month milestones, while some defaults omitted 18. The SQL patch stores `[3,6,12,18,24]`; update UI defaults too if 18 months is the intended policy.
- `/api/docs` advertises `/api/schemes/apply`, but the static portal has no matching route. Either implement that route or remove it from the documentation before calling it production-ready.

## Required actions

1. In Supabase SQL Editor, run `src/db/SQL_EDITOR_COMPLETE.sql` as the database owner.
2. Confirm the final two verification queries return a settings rowset and `true`.
3. Confirm Supabase Auth email provider is enabled and SMTP is configured with a verified sender/domain. Do not put SMTP credentials in this repository.
4. Redeploy the public portal from commit `dc4f44e` and hard-refresh the browser once. Verify no `sb-api-auth-token` GoTrue warning remains.
5. Test signup with a real mailbox and verify that the request reaches `/auth/v1/signup` with HTTP 200/422 (not 401), then confirm the email arrives.
6. Seed real employer/company and job-posting records only through the admin workflow; do not add fake production users.
7. Decide whether to add `/api/schemes/apply` (with authenticated validation and RLS) or remove that advertised endpoint from `src/app/api/docs/page.tsx`.

## Important prerequisite

The SQL patch assumes the base schema already contains `public.trainees` and `public.user_roles`. If either table is missing, run `src/db/SETUP_MASTER.sql` first, then run this patch, followed by `src/db/HARDENED_PRODUCTION_RLS.sql`.
