# Nexus deep audit report

Audit date: 2026-08-27  
Scope: live public site, source tree, Supabase contracts, and production build/tests.

## Live checks

All of these returned HTTP 200: `/`, `/login`, `/contact`, `/privacy-policy`, `/terms`, `/verify`, `/verify/CERT-2026-849201`, `/employers`, `/dashboard`, `/api/docs`, `/api/health`, `/api/cron/milestones`.

`/api/schemes/apply` returned HTTP 404 although it is advertised in `/api/docs`.

The live browser also emitted React minified error #418 on interactive public routes. Re-test in a fresh browser after the current deployment is live; likely sources include date/locale-dependent values rendered during hydration, especially certificate registry stamps.

## Critical findings (fix before real users)

### C1 — Employer actions are exposed on a public page

`src/app/employers/page.tsx` renders “Register Company” and “Post Vacancy” without an authentication gate. It inserts directly into `employers` and `job_postings`. Under permissive/old RLS this permits spam or fabricated employers/jobs; under hardened RLS it fails for normal visitors. Require an authenticated employer session, bind inserts to `auth.uid()`, and route new companies to an approval queue.

### C2 — Interview invite failures are reported as success

`src/app/employers/page.tsx:328-335` catches the notification insert and ignores the error, then always displays “Interview invitation dispatched.” Show success only after a confirmed insert and show the actual failure otherwise.

### C3 — Longitudinal wage chart contains fabricated values

`src/components/LongitudinalTracker.tsx:52-60` synthesizes wages by multiplying a baseline and `:197-199` falls back to hardcoded district totals/wages. This conflicts with the platform’s verified-outcomes promise. Render “insufficient verified data” until real observations exist; never infer a user’s wage trajectory.

### C4 — Health and cron endpoints claim live state while static

`src/app/api/health/route.ts:3` and `src/app/api/cron/milestones/route.ts:4` use `force-static`. Health therefore freezes its timestamp/status at build time, and cron status is not a live operational check. Make health dynamic and actually query the database; protect cron execution/status with a secret and do not expose pending-survey counts publicly.

### C5 — Documentation advertises a missing endpoint

`src/app/api/docs/page.tsx:67` advertises `/api/schemes/apply`, but live HTTP returns 404. Implement an authenticated route with validation/RLS or remove it from the public API documentation.

### C6 — Certification UI manufactured credentials

`CertificationsPage`, `ResumeDossierModal`, and the public verification routes previously filled missing certificate IDs, grades, dates, programs, and demo registry references with realistic-looking values. A newly registered trainee could therefore see a “verified” credential before completing training. The UI now requires both `status = 'certified'` and a non-empty database `certificate_id`; otherwise it shows an empty state or an invalid lookup.

### C7 — Database defaults created synthetic outcomes

The original setup scripts gave `trainee_enrollments.certificate_id`, `grade`, profile DOB/state, employment status, and follow-up income fields plausible defaults. A normal enrollment could therefore appear certified and charts could display a made-up baseline. Migration `src/db/migrations/008_real_data_only.sql` removes those defaults, normalizes non-authoritative certificate fields, and adds a certification consistency constraint. Apply it to the live database.

## High-priority findings

### H1 — Signup availability errors must not be presented as “taken”

Fixed in the latest source commit `8ae9deb`: only an explicit RPC `false` means taken; RPC errors now show a retry/configuration error.

### H2 — Public credential verification needs hydration-safe rendering

`src/app/verify/page.tsx:266` and `src/app/verify/[certId]/CertificateValidationClient.tsx:184` render `new Date().toLocaleDateString(...)` in client-rendered markup. Render the date after mount or pass a stable server value to eliminate React hydration mismatch #418.

### H3 — Settings alert toggle is not persisted

`src/components/SettingsPage.tsx:39` stores `inAppAlerts` only in React state. Reloading loses the user’s choice. Persist it in `notification_preferences` and load it from the profile.

### H4 — Employer portal uses fallback labels that can look like verified data

Candidate cards use fallback skills/education and district defaults when fields are missing. Empty verified fields should display “Not provided,” not invented values such as `Apparel`, `Lockstitch`, `12th Vocational`, or `Pune`.

### H5 — Error handling is inconsistent across mutation flows

Search for empty catches, especially `src/app/employers/page.tsx:335` and admin user actions. Every mutation must inspect `{ data, error }`, show failure state, and prevent optimistic “success” messaging.

### H6 — Privacy/contact addresses are not governed by one source

The database setting is now standardized to `support@nexus.in`, but all public/admin pages should read the same setting or shared constant. Add a single support-contact source and a smoke test for consistency.

## Medium-priority findings

- `/dashboard` has an expected loading state when signed out, but add an explicit timeout/error state so network failures do not look like an endless load.
- Password policy is inconsistent: platform settings say minimum 8 while the login/settings UI accepts 6. Align validation and messaging.
- `src/context/UserContext.tsx` provisions a profile with `Math.random()` IDs. Use a database-generated ID/transaction and handle duplicate races explicitly.
- The public portal sends notification inserts from client code; enforce server-side authorization and rate limits even if RLS currently blocks unauthorized writes.
- API docs state “Bearer JWT Authenticated,” but public health/verification routes are unauthenticated. Document public vs authenticated endpoints accurately.
- The service worker caches navigations; bump the cache version on releases and ensure stale HTML cannot preserve obsolete client auth code.
- The dashboard header exposed language and theme controls that were not consistently reflected across the product. Those non-functional quick toggles were removed from the header; language/theme configuration remains available only in Settings until each translation/theme surface is fully verified.
- Analytics and longitudinal charts previously synthesized wage multipliers, baselines, district rows, and skill-gap chips when queries were empty. They now render an explicit no-verified-data state and only plot numeric observations from the database.

## Recommended execution order

1. Deploy commit `8ae9deb` and verify the new bundle is live.
2. Apply `src/db/SQL_EDITOR_COMPLETE.sql` and verify RPC/settings queries.
3. Fix C1–C5 (authorization, fabricated data, live health/cron, docs).
4. Fix H2–H6 and add route-level smoke tests.
5. Add an authenticated test account and execute signup, OTP, profile, settings, certificate, employer, and admin workflows end-to-end.
6. Only then enable optional AI features; AI must remain advisory and must never approve certificates, grants, or employment verification.
