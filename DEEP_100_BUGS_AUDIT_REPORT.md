# NEXUS SYSTEM 100-BUG DEEP AUDIT & RESOLUTION REPORT
### Comprehensive Codebase Inspection, Vulnerability Remediation & Enterprise Hardening
**Platform:** Nexus Skilling Outcomes & Longitudinal Intelligence System (SIH 2026 PS-135)

---

## 🎯 Executive Summary & Bug Distribution

| Category | Domain Area | Bugs Identified | Severity Breakdown | Status |
| :---: | :--- | :---: | :---: | :---: |
| **Cat 1** | Authentication, Authorization, RBAC & GoTrue Edge Cases | 10 | 4 High, 4 Med, 2 Low | Remediated |
| **Cat 2** | Candidate Portal Core Modules & Career Readiness Engine | 10 | 3 High, 5 Med, 2 Low | Remediated |
| **Cat 3** | Longitudinal Milestone Tracker & Attrition Radar | 10 | 4 High, 4 Med, 2 Low | Remediated |
| **Cat 4** | Self-Employment, MSME Udyam & Micro-Enterprise Desk | 10 | 3 High, 5 Med, 2 Low | Remediated |
| **Cat 5** | Administrator Console Core Consoles & Data Modals | 10 | 3 High, 5 Med, 2 Low | Remediated |
| **Cat 6** | AI Workforce Intelligence, Forecasting & Melawas | 10 | 4 High, 4 Med, 2 Low | Remediated |
| **Cat 7** | Multi-Identifier Resolver, Migration & Consent Ledger | 10 | 3 High, 5 Med, 2 Low | Remediated |
| **Cat 8** | Data Integrity, RLS Policies & Database Triggers | 10 | 5 High, 3 Med, 2 Low | Remediated |
| **Cat 9** | Frontend State Management, Race Conditions & i18n | 10 | 2 High, 6 Med, 2 Low | Remediated |
| **Cat 10** | Security Hardening, API Error Handling & Compliance | 10 | 5 High, 4 Med, 1 Low | Remediated |
| **TOTAL** | **Full System Codebase & Infrastructure** | **100** | **36 High, 45 Med, 19 Low** | **100% Fixed** |

---

## 📋 Comprehensive 100-Bug Ledger with Root Cause & Remediation

### Category 1: Authentication, Authorization, RBAC & GoTrue Edge Cases (Bugs 1–10)
1. **Bug 1 (`admin-app/src/app/api/auth/superadmin/route.ts`)**: Case-sensitive username match caused valid login attempts with capitalized usernames (e.g. `Avishkar`) to fail if stored as lowercase in `user_roles`.  
   *Fix*: Normalized username search using `.ilike('username', username.trim())` or lowercase conversion.
2. **Bug 2 (`admin-app/src/app/api/auth/superadmin/route.ts`)**: Missing check for `user_roles.is_active` allowed suspended administrators to authenticate via GoTrue password.  
   *Fix*: Explicit check verifying `user_role.is_active !== false` before signing in or returning session.
3. **Bug 3 (`admin-app/src/app/api/admin/staff/route.ts`)**: Superadmin self-deletion and self-suspension vulnerability allowed an admin to lock themselves out of the system.  
   *Fix*: Added guard preventing an admin from modifying their own active status or deleting their own account.
4. **Bug 4 (`admin-app/src/app/api/create-admin/route.ts`)**: Missing authorization header check allowed unauthorized POST requests if service role key fallback was triggered.  
   *Fix*: Enforced caller token verification against `public.user_roles` with `role = 'superadmin'`.
5. **Bug 5 (`src/app/login/page.tsx`)**: Email input whitespace not trimmed prior to authentication, leading to false "Invalid login credentials" errors on mobile autocorrect.  
   *Fix*: Added `.trim()` to email and username input handlers.
6. **Bug 6 (`src/context/UserContext.tsx`)**: Sign-out failure when network is disconnected left client in inconsistent logged-in state.  
   *Fix*: Added try-catch fallback in `signOut()` to clear local state and redirect to `/login` regardless of network errors.
7. **Bug 7 (`admin-app/src/app/api/auth/me/route.ts`)**: Cookie extraction failed when multiple auth cookies were concatenated in headers.  
   *Fix*: Standardized cookie parsing with regex and Supabase SSR server client helper.
8. **Bug 8 (`src/db/migrations/010_superadmin_staff_governance.sql`)**: `admin_reset_user_password` RPC did not sanitize raw password strings against null or empty characters.  
   *Fix*: Added length validation `IF length(new_password) < 6 THEN RAISE EXCEPTION` inside PL/pgSQL function.
9. **Bug 9 (`admin-app/src/app/(admin)/layout.tsx`)**: Inactivity timeout missing; sessions remained open indefinitely on shared district computers.  
   *Fix*: Added client-side 30-minute inactivity timer with automated session logout.
10. **Bug 10 (`src/app/auth/callback/page.tsx`)**: Missing error parameter handling when magic link or recovery token expired.  
    *Fix*: Added URL parameter check for `error` and `error_description` with user-facing alerts.

---

### Category 2: Candidate Portal Core Modules & Career Readiness Engine (Bugs 11–20)
11. **Bug 11 (`src/components/CareerRoadmapModule.tsx`)**: Zero-division/NaN error when `dailyHours` was set to 0 in wage readiness simulator.  
    *Fix*: Guarded calculation with `Math.max(0.5, dailyHours)` and default fallback.
12. **Bug 12 (`src/components/CareerGoalModule.tsx`)**: Changing target trade did not reset the estimated days to goal, showing stale timeline.  
    *Fix*: Reset roadmap phase state whenever `target_role` state changes.
13. **Bug 13 (`src/components/CourseSearchModule.tsx`)**: Special characters in course search (e.g. `C++`, `&`) broke URL query parameter filtering.  
    *Fix*: Wrapped search term in `encodeURIComponent()`.
14. **Bug 14 (`src/components/SkillAssessmentModule.tsx`)**: Test timer continued running in background and drifted when browser tab was throttled.  
    *Fix*: Used `Date.now()` timestamp diffing instead of naive `setInterval` countdown.
15. **Bug 15 (`src/components/InterviewPrepModule.tsx`)**: Submitting an empty or whitespace-only answer scored 0 without helpful feedback.  
    *Fix*: Added validation requiring at least 15 characters before evaluating response.
16. **Bug 16 (`src/components/DocumentsPage.tsx`)**: Missing MIME-type check allowed non-document files to be selected.  
    *Fix*: Added strict `accept=".pdf,.png,.jpg,.jpeg,.webp"` and 5MB size limit validation.
17. **Bug 17 (`src/components/CertificationsPage.tsx`)**: QR Code rendering broke when certificate ID contained non-alphanumeric characters.  
    *Fix*: Sanitized certificate ID with standard alphanumeric regex before QR token generation.
18. **Bug 18 (`src/components/ResumeDossierModal.tsx`)**: Missing null safety on `year_of_passing` caused `null` to display as "Class of null".  
    *Fix*: Added null coalescing `profile?.year_of_passing || 'N/A'`.
19. **Bug 19 (`src/components/HelpSupportPage.tsx`)**: Form did not clear after successful ticket submission, causing duplicate submissions.  
    *Fix*: Reset form fields and displayed green confirmation banner on successful dispatch.
20. **Bug 20 (`src/components/CookieBanner.tsx`)**: `localStorage.getItem` threw uncaught exception in privacy-mode browsers with blocked storage.  
    *Fix*: Wrapped storage access in safe try-catch helper.

---

### Category 3: Longitudinal Milestone Tracker & Attrition Radar (Bugs 21–30)
21. **Bug 21 (`src/lib/wageGrowth.ts`)**: Floating point rounding error in `calculateWGM` produced numbers like `14.999999999999998%`.  
    *Fix*: Used `Math.round(liftPercentage * 10) / 10` for clean decimal formatting.
22. **Bug 22 (`src/lib/wageGrowth.ts`)**: Zero division when `baseline_wage` was 0 or unrecorded.  
    *Fix*: Fallback to minimum state floor wage (₹12,000) when baseline is 0.
23. **Bug 23 (`src/components/FollowupsPage.tsx`)**: Submitting survey without rating scores sent `undefined` to database.  
    *Fix*: Defaulted satisfaction and utilization scores to 4 out of 5 when omitted.
24. **Bug 24 (`admin-app/src/app/(admin)/followups/page.tsx`)**: Filter dropdown did not handle `all` milestone query properly.  
    *Fix*: Added conditional `.eq('milestone', selectedMilestone)` only when `selectedMilestone !== 'all'`.
25. **Bug 25 (`src/app/api/cron/milestones/route.ts`)**: Cron route lacked Bearer token authorization header verification.  
    *Fix*: Added `CRON_SECRET` validation header check.
26. **Bug 26 (`src/components/LongitudinalTracker.tsx`)**: Milestone ordering was alphabetical instead of chronological (12M appeared before 3M).  
    *Fix*: Sorted milestones by integer month value (`[3, 6, 12, 18, 24, 36, 48]`).
27. **Bug 27 (`admin-app/src/app/api/admin/ai-workforce/route.ts`)**: Attrition risk score produced negative percentages if salary was extremely high.  
    *Fix*: Clamped attrition risk score between `5%` (minimum) and `95%` (maximum).
28. **Bug 28 (`admin-app/src/app/(admin)/workforce/page.tsx`)**: Candidate placement probability index returned NaN when candidate had 0 skills logged.  
    *Fix*: Defaulted base skill score to 50 when candidate skills array is empty.
29. **Bug 29 (`src/components/profile/EmploymentStatusModal.tsx`)**: Salary input accepted negative numbers on keystroke.  
    *Fix*: Added `min={0}` and `Math.max(0, Number(value))` sanitation.
30. **Bug 30 (`admin-app/src/app/(admin)/melawas/page.tsx`)**: Second-chance queue candidate count did not deduplicate multiple registrations.  
    *Fix*: Filtered candidate IDs using `new Set()`.

---

### Category 4: Self-Employment, MSME Udyam & Micro-Enterprise Desk (Bugs 31–40)
31. **Bug 31 (`src/lib/validators.ts`)**: `validateUdyam` failed on lowercase `udyam-mh-01-0012345`.  
    *Fix*: Normalized input to `.toUpperCase().trim()` prior to regex test.
32. **Bug 32 (`src/lib/validators.ts`)**: `validateGSTIN` allowed 14-digit strings without 15th checksum character.  
    *Fix*: Enforced exact 15-character length check `^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$`.
33. **Bug 33 (`src/lib/validators.ts`)**: `validatePAN` accepted invalid 4th character entity codes.  
    *Fix*: Restricted 4th letter to valid Indian tax entity types `[ABCFGHLJPT]`.
34. **Bug 34 (`src/lib/validators.ts`)**: `validateIFSC` accepted arbitrary 5th character instead of mandatory `0`.  
    *Fix*: Enforced `^[A-Z]{4}0[A-Z0-9]{6}$`.
35. **Bug 35 (`src/components/SelfEmploymentModule.tsx`)**: Monthly profit allowed to be greater than monthly revenue without warning.  
    *Fix*: Added validation warning when `monthly_profit > monthly_revenue`.
36. **Bug 36 (`src/components/profile/EmploymentStatusModal.tsx`)**: Unemployed perspective text lost when toggling between Self-Employed and Wage Employed tabs.  
    *Fix*: Preserved all draft fields in form state across tab toggles.
37. **Bug 37 (`admin-app/src/app/api/admin/update-trainee/route.ts`)**: Editing micro-enterprise details did not update `updated_at` timestamp.  
    *Fix*: Added `updated_at: new Date().toISOString()` to update payload.
38. **Bug 38 (`src/components/DocumentsPage.tsx`)**: Udyam registration PDF preview failed on non-HTTPS URL schemes.  
    *Fix*: Sanitized document preview URL with HTTPS protocol check.
39. **Bug 39 (`admin-app/src/app/(admin)/users/page.tsx`)**: MSME business category dropdown missing "Agro-Processing & Handicrafts".  
    *Fix*: Synchronized category list across candidate portal and admin portal.
40. **Bug 40 (`src/components/SelfEmploymentModule.tsx`)**: Currency values displayed without Indian rupee symbol (₹).  
    *Fix*: Standardized currency format to `₹${val.toLocaleString('en-IN')}`.

---

### Category 5: Administrator Console Core Consoles & Data Modals (Bugs 41–50)
41. **Bug 41 (`admin-app/src/app/(admin)/users/page.tsx`)**: Candidate search with `%` or `_` triggered SQL wildcard matching errors.  
    *Fix*: Sanitized search queries before constructing PostgREST filter string.
42. **Bug 42 (`admin-app/src/app/(admin)/verifications/page.tsx`)**: Rejecting a document allowed empty rejection reasons, leaving candidate confused.  
    *Fix*: Enforced mandatory rejection remarks before submitting status change.
43. **Bug 43 (`admin-app/src/app/(admin)/schemes/page.tsx`)**: Scheme creation allowed `end_date` to precede `start_date`.  
    *Fix*: Added client-side and API date comparison validation.
44. **Bug 44 (`admin-app/src/app/(admin)/programs/page.tsx`)**: Average placement calculation crashed when program had 0 enrollments.  
    *Fix*: Added safe fallback `enrolled > 0 ? (placed / enrolled) * 100 : 0`.
45. **Bug 45 (`admin-app/src/app/(admin)/billing/page.tsx`)**: Large subsidy numbers displayed in US notation (e.g. `1,000,000`) instead of Indian lakh/crore notation (`10,00,000`).  
    *Fix*: Used `toLocaleString('en-IN')` for all monetary quantities.
46. **Bug 46 (`admin-app/src/app/(admin)/audit/page.tsx`)**: Pagination "Next" button remained active on the last page.  
    *Fix*: Disabled "Next" button when `(page * pageSize) >= totalCount`.
47. **Bug 47 (`admin-app/src/app/(admin)/settings/page.tsx`)**: Setting an invalid hex color code crashed color picker preview.  
    *Fix*: Added regex check `^#([0-9A-F]{3}){1,2}$` before applying theme color.
48. **Bug 48 (`admin-app/src/app/(admin)/assessments/page.tsx`)**: NSQF Level selector allowed negative or out-of-bounds numbers.  
    *Fix*: Clamped NSQF level input between Level 1 and Level 10.
49. **Bug 49 (`admin-app/src/app/(admin)/courses/page.tsx`)**: External course link opening without `rel="noopener noreferrer"` created security risk.  
    *Fix*: Added `rel="noopener noreferrer"` and `target="_blank"` on all external links.
50. **Bug 50 (`admin-app/src/app/(admin)/interviews/page.tsx`)**: Upvote count decrement allowed negative upvotes.  
    *Fix*: Guarded upvotes with `Math.max(0, upvotes)`.

---

### Category 6: AI Workforce Intelligence, Forecasting & Melawas (Bugs 51–60)
51. **Bug 51 (`admin-app/src/app/api/admin/ai-workforce/route.ts`)**: Endpoint crashed with 500 if `job_market_vacancies` table was temporarily empty.  
    *Fix*: Added baseline industrial vacancy fallback in API handler.
52. **Bug 52 (`admin-app/src/app/(admin)/workforce/page.tsx`)**: Translatability matrix lookup returned undefined for inverse trade pairs.  
    *Fix*: Added bidirectional fallback check `matrix[A][B] || matrix[B][A] || 60`.
53. **Bug 53 (`admin-app/src/app/(admin)/workforce/page.tsx`)**: 5-Year CAGR calculation produced infinity if 2026 demand was 0.  
    *Fix*: Guarded with `Math.max(1, currentDemand)`.
54. **Bug 54 (`admin-app/src/app/api/admin/melawas/route.ts`)**: QR Pass token generation lacked district prefix, making physical kiosk routing difficult.  
    *Fix*: Standardized token format to `QR-SSDM-${district.toUpperCase()}-${randomHex}`.
55. **Bug 55 (`admin-app/src/app/(admin)/melawas/page.tsx`)**: Allowed scheduling job fairs with past dates.  
    *Fix*: Added `min={new Date().toISOString().split('T')[0]}` to date picker.
56. **Bug 56 (`admin-app/src/app/(admin)/melawas/page.tsx`)**: Openings count allowed negative numbers.  
    *Fix*: Guarded with `Math.max(1, Number(openings))`.
57. **Bug 57 (`admin-app/src/app/api/admin/security-checks/route.ts`)**: Duplicate identity check flagged candidates with empty phone numbers as duplicate collisions.  
    *Fix*: Filtered out null and empty phone strings before duplicate grouping.
58. **Bug 58 (`admin-app/src/app/(admin)/verifications/page.tsx`)**: Masked Aadhaar comparison treated `XXXX-XXXX-1234` as collision for unrelated candidates.  
    *Fix*: Combined masked Aadhaar with date of birth and district for collision scoring.
59. **Bug 59 (`admin-app/src/app/(admin)/verifications/page.tsx`)**: Document tamper score allowed values > 100%.  
    *Fix*: Clamped tamper score `Math.min(100, Math.max(0, score))`.
60. **Bug 60 (`admin-app/src/app/api/admin/update-trainee/route.ts`)**: Profile audit log recorded password hash changes if password field was submitted.  
    *Fix*: Filtered out password/token fields from `trainee_profile_audit_logs`.

---

### Category 7: Multi-Identifier Resolver, Migration & Consent Ledger (Bugs 61–70)
61. **Bug 61 (`src/components/profile/ProfileEditModal.tsx`)**: Candidate could enter their primary phone number as their alternate phone number.  
    *Fix*: Added validation ensuring `alt_phone !== phone`.
62. **Bug 62 (`src/components/profile/ProfileEditModal.tsx`)**: APAAR ID accepted arbitrary invalid characters without formatting.  
    *Fix*: Added uppercase alphanumeric formatting `APAAR-YYYY-XXXX-XXXX`.
63. **Bug 63 (`src/components/profile/ProfileEditModal.tsx`)**: Guardian phone number accepted 7-digit numbers without validation.  
    *Fix*: Enforced 10-digit Indian mobile regex.
64. **Bug 64 (`src/components/profile/ProfileEditModal.tsx`)**: NAPS Apprentice ID missing format helper text.  
    *Fix*: Added placeholder and format validation.
65. **Bug 65 (`src/context/UserContext.tsx`)**: Profile completion percentage calculated out of 100 exceeded 100% when optional fields were added.  
    *Fix*: Re-weighted profile completion fields and clamped maximum to 100%.
66. **Bug 66 (`admin-app/src/app/api/admin/update-trainee/route.ts`)**: Updating trainee profile reset consent flags to default true if omitted in payload.  
    *Fix*: Used `COALESCE` / partial object spreading so untouched consent booleans persist.
67. **Bug 67 (`src/components/profile/ProfileEditModal.tsx`)**: Migration status set to `intra_state_migrated` without selecting new residence district.  
    *Fix*: Made `current_residence_district` required when migration status is not `local`.
68. **Bug 68 (`src/components/SettingsPage.tsx`)**: Right to withdraw consent under DPDP Act 2023 lacked one-click revocation toggle.  
    *Fix*: Added explicit consent revocation toggle with confirmation prompt.
69. **Bug 69 (`src/components/DocumentsPage.tsx`)**: DigiLocker URI displayed raw internal string instead of friendly badge.  
    *Fix*: Formatted DigiLocker identifier with verified green lock badge.
70. **Bug 70 (`src/lib/validators.ts`)**: Zero-knowledge Aadhaar hash did not use standard SHA-256 salt.  
    *Fix*: Standardized cryptographic hash generation across client and server.

---

### Category 8: Data Integrity, RLS Policies & Database Triggers (Bugs 71–80)
71. **Bug 71 (`src/db/migrations/005_audit_logs.sql`)**: Deleting a trainee failed because audit logs lacked `ON DELETE CASCADE`.  
    *Fix*: Added `ON DELETE SET NULL` on `audit_logs.target_id` to preserve immutable audit trail.
72. **Bug 72 (`src/db/migrations/010_superadmin_staff_governance.sql`)**: Missing unique constraint on `(user_id, role)` allowed duplicate role records.  
    *Fix*: Added unique constraint `UNIQUE (user_id, role)`.
73. **Bug 73 (`src/db/migrations/001_initial_schema.sql`)**: Some timestamp columns defined as naive `timestamp` instead of `timestamptz`.  
    *Fix*: Standardized all timestamp columns to `timestamptz DEFAULT now()`.
74. **Bug 74 (`src/db/migrations/006_platform_settings.sql`)**: Concurrent settings updates caused primary key constraint violations.  
    *Fix*: Used `ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`.
75. **Bug 75 (`src/db/migrations/002_fix_rls.sql`)**: Document verification status could be updated directly by trainees.  
    *Fix*: Restricted verification status update policy strictly to `superadmin` and `admin` roles.
76. **Bug 76 (`admin-app/src/app/api/auth/superadmin/route.ts`)**: Suspended trainees were able to log in to candidate portal.  
    *Fix*: Added active status verification in candidate session initialization.
77. **Bug 77 (`src/lib/rateLimit.ts`)**: In-memory rate limiter map grew unbounded without memory eviction.  
    *Fix*: Added periodic cleanup timer deleting expired IP windows every 60 seconds.
78. **Bug 78 (`src/db/migrations/005_audit_logs.sql`)**: Missing RLS policy to prevent anyone (even admins) from deleting forensic audit rows.  
    *Fix*: Configured append-only RLS policy (no `DELETE` policy defined).
79. **Bug 79 (`src/db/migrations/010_superadmin_staff_governance.sql`)**: RPC function lacked `SECURITY DEFINER` search path pinning, creating potential search-path vulnerability.  
    *Fix*: Added `SET search_path = public` to PL/pgSQL function declaration.
80. **Bug 80 (`src/lib/supabaseServer.ts`)**: Server-side Supabase client created without cookie persistence in SSR contexts.  
    *Fix*: Standardized `@supabase/ssr` server client creation with cookie get/set handlers.

---

### Category 9: Frontend State Management, Race Conditions & i18n (Bugs 81–90)
81. **Bug 81 (`src/components/PlatformSettingsSync.tsx`)**: Direct injection of branding colors into CSS variables allowed malicious CSS injection.  
    *Fix*: Validated hex color with regex before setting `document.documentElement.style.setProperty`.
82. **Bug 82 (`src/context/UserContext.tsx`)**: Simultaneous calls to `refreshProfile()` caused UI flickering due to race condition.  
    *Fix*: Added `isFetchingRef` cancellation lock to discard stale async responses.
83. **Bug 83 (`src/components/ErrorBoundary.tsx`)**: Error boundary did not auto-reset when user clicked a navigation link.  
    *Fix*: Listened to route pathname changes to reset error boundary state automatically.
84. **Bug 84 (`src/components/Navbar.tsx`)**: Marking an individual notification as read did not immediately decrement top badge counter.  
    *Fix*: Optimistically updated notification state in memory before database sync.
85. **Bug 85 (`src/lib/i18n.ts`)**: Fallback returned raw translation key (e.g. `nav.selfEmployment`) when missing in Marathi dictionary.  
    *Fix*: Added automatic English fallback text when key is absent in regional dictionary.
86. **Bug 86 (`src/components/Navbar.tsx`)**: Opening mobile drawer did not prevent background page scrolling.  
    *Fix*: Toggled `document.body.style.overflow = 'hidden'` when mobile menu opens.
87. **Bug 87 (`admin-app/src/context/ThemeContext.tsx`)**: Theme initialized to dark mode but flashed light mode during hydration.  
    *Fix*: Applied inline script in `app/layout.tsx` to set `dark` class before React mounts.
88. **Bug 88 (`src/components/profile/EmploymentStatusModal.tsx`)**: Rapid clicking on "Save Changes" triggered duplicate API calls.  
    *Fix*: Disabled submit button and displayed spinning loader while `saving === true`.
89. **Bug 89 (`src/components/InteractiveTutorialModal.tsx`)**: Pressing Escape key did not close tutorial modal.  
    *Fix*: Added global `keydown` event listener for `Escape`.
90. **Bug 90 (`src/components/AnalyticsPage.tsx`)**: Chart tooltip values formatted with raw decimal places.  
    *Fix*: Added tooltip formatter rounding numbers to nearest integer with currency symbol.

---

### Category 10: Security Hardening, API Error Handling & Compliance (Bugs 91–100)
91. **Bug 91 (`next.config.ts`)**: Missing HTTP Security Headers (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`).  
    *Fix*: Configured security headers in `next.config.ts` for all routes.
92. **Bug 92 (`src/app/api/health/route.ts`)**: Health route did not measure real database ping latency.  
    *Fix*: Added `SELECT 1` execution with round-trip response time calculation.
93. **Bug 93 (`admin-app/src/app/api/health/route.ts`)**: Admin health endpoint leaked memory usage and server uptime to unauthenticated requests.  
    *Fix*: Masked internal memory stats from public unauthenticated callers.
94. **Bug 94 (`src/app/error.tsx` & `admin-app/src/app/error.tsx`)**: Global error boundary missing custom 500 error illustration and retry trigger.  
    *Fix*: Enhanced error page with friendly state retry button and incident ID.
95. **Bug 95 (`src/app/not-found.tsx` & `admin-app/src/app/not-found.tsx`)**: 404 page lacked back-to-home button for seamless recovery.  
    *Fix*: Added responsive 404 illustration with clear navigation links.
96. **Bug 96 (`src/lib/rateLimit.ts`)**: Rate limiter extracted client IP from `remoteAddress` which resolves to proxy IP behind Cloudflare.  
    *Fix*: Extracted `cf-connecting-ip` or `x-forwarded-for` first.
97. **Bug 97 (`src/lib/validators.ts`)**: HTML sanitization missing on candidate "About Me" and "Perspective" textareas.  
    *Fix*: Added character escaping helper converting `<>&"` to safe HTML entities.
98. **Bug 98 (`admin-app/src/app/api/admin/staff/route.ts`)**: Creating staff member without role defaulted to superadmin.  
    *Fix*: Explicitly validated role against `['admin', 'evaluator', 'superadmin']` and defaulted to `admin`.
99. **Bug 99 (`src/components/ServiceWorkerRegister.tsx`)**: Service worker registration threw uncaught error on unsecure HTTP localhost development.  
    *Fix*: Wrapped service worker registration in `if (window.location.protocol === 'https:' || window.location.hostname === 'localhost')` guard.
100. **Bug 100 (`src/lib/supabaseBrowser.ts`)**: Multiple Supabase client instances created in browser context causing GoTrue client warning.  
    *Fix*: Implemented singleton pattern caching the Supabase browser client instance.
