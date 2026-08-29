# Review & Adversarial Verification Report: Candidate Portal Bug Fixes

**Reviewer:** Reviewer 2 (Reviewer & Adversarial Critic)  
**Date:** 2026-08-29  
**Target:** Project Orchestrator (`c77cd3fe-83b3-4d06-967d-2e695619bdd0`)  
**Verdict:** **APPROVE**  

---

## 1. Observation

### 1.1 Scope & Codebase Verification
The review inspected all modifications made across the 6 core target files and verified compliance against the database definitions in `src/db/EXPANSION_SUITE.sql` and `src/db/COMPLETE_SUPABASE_REPAIR.sql`:

1. **`src/app/api/trainee/mutate/route.ts` (API Whitelist & Mutation Proxy)**:
   - Lines 4–21: Strict `ALLOWED_TABLES` Set whitelists `'training_programs'`, `'trainees'`, `'trainee_employment'`, `'trainee_enrollments'`, `'trainee_course_enrollments'`, `'external_courses'`, `'verifications'`, `'trainee_followups'`, `'trainee_career_goals'`, `'career_roadmaps'`, `'scheme_applications'`, `'assessment_submissions'`, `'support_tickets'`, `'trainee_notifications'`, `'enterprise_ledger'`, and `'interview_questions'`.
   - Line 28: Non-whitelisted tables are rejected immediately with HTTP 400 (`Unauthorized or invalid table: "${table}"`).
   - Lines 38–73: Supported actions are strictly limited to `'insert'`, `'upsert'`, `'update'`, and `'delete'`.
   - Lines 52–54, 64–66: Mandatory match criteria validation prevents unrestricted mass update/delete operations.
   - Lines 44–49: Upsert actions support explicit `onConflict` clauses for idempotent writes.
   - Lines 76–82: Comprehensive error handling returns HTTP 500 with diagnostic error details.

2. **`src/context/UserContext.tsx` (State Management & Persistence)**:
   - Lines 410–477: `updateEmployment` performs payload sanitization:
     - Date fields (`joining_date`, `establishment_date`) are normalized: empty strings `""` are converted to `null` to avoid PostgreSQL `ERROR 22007: invalid input syntax for type date: ""`.
     - Numeric fields (`monthly_salary`, `monthly_revenue`, `monthly_profit`, `employees_count`) are safely parsed using `isNaN(Number(val)) ? 0 : Number(val)`.
     - Non-placement fields (`unemployed_reason`, `unemployed_perspective`, `target_workforce_timeline`, `support_needed`, `appreciation_details`) are preserved.
     - Atomic `upsert` on `trainee_employment` is executed with `onConflict: 'trainee_id'`.
     - React state `setEmployment(savedRecord)` synchronizes immediately with the persisted database row or fallback merged state, eliminating the previous `setEmployment(null)` bug.

3. **`src/components/profile/EmploymentStatusModal.tsx` & `src/components/TraineeProfilePage.tsx`**:
   - `EmploymentStatusModal.tsx` (lines 66–130, 169–194):
     - Maps existing status variants (`wage_employed`, `apprenticeship`, `employed`, `self_employed`, `not_employed`) reliably on modal open.
     - `handleSave` sanitizes dates, parses numbers, validates Udyam and GSTIN formats, and invokes `updateEmployment`.
     - Dispatches `await refreshData()` upon success and displays contextual success/error toasts.
   - `TraineeProfilePage.tsx` (lines 427–494):
     - Evaluates status categories via normalized predicate checks:
       - Wage Employed & Apprenticeship: `['employed', 'wage_employed', 'apprenticeship'].includes(employment.status)` (renders company, designation, monthly salary, work location, and appreciation details).
       - Self Employed / Micro-Enterprise: `employment.status === 'self_employed'` (renders business name, category, team size, monthly profit, revenue, and MSME Udyam registration number).
       - Seeking Placement / Diagnostic: fallback matching (renders primary reason for non-placement, target workforce timeline, and personal perspective).

4. **`src/components/TrainingDetailsPage.tsx` (Add Training & Course Details)**:
   - Lines 103–129, 617–1011: Interactive modal allowing candidates to record training details via two distinct paths:
     - **Mode A (Accredited Catalog)**: Selects from state-accredited courses, specifies enrollment/completion/certification dates, certificate IDs, and performance grades.
     - **Mode B (Custom / Past ITI Details)**: Enters custom vocational trades (Course Title, Sector/Trade, Training Provider, Duration in Months, Description, Dates, Certificate ID, Grade).
   - Lines 313–351: Dual-step mutation creates a row in `training_programs` via service-role proxy, retrieves the assigned `id`, and links it in `trainee_enrollments`.
   - Lines 303–311: Case-insensitive duplicate detection prevents redundant duplicate course registrations.
   - Lines 320, 855: Enforces duration as a positive integer (`Math.max(1, duration)`).
   - Lines 571–609: "Explore Secondary Upskilling Opportunities" dynamically renders an emerald "Already Enrolled" badge with a disabled button when the candidate is already enrolled.

5. **`src/components/CourseSearchModule.tsx` (Course Enrollment & Reflection)**:
   - Lines 275–288: Multi-key resolver `getEnrollment(course)` indexes and matches enrollments across:
     1. Database UUIDs (`e.course_id`, `e.id`)
     2. Course URLs (`ext?.url`)
     3. Raw and lowercase course titles (`ext?.title`)
     4. Alphanumeric normalized title keys (`title-norm:...`)
     5. Static catalog fallback IDs (`nptel-garment-01`, etc.)
   - Lines 290–436: `fetchCoursesAndEnrollments` joins `trainee_course_enrollments` with `external_courses(*)`, hydrates the multi-key map, and ensures missing courses are merged into the searchable catalog.
   - Lines 438–592: `handleEnrollCourse` provisions external courses if necessary, executes `upsert` with `onConflict: 'trainee_id,course_id'`, and updates local state across all keys.
   - Lines 594–654: `handleUpdateProgress` synchronizes progress percentages and persists completed statuses and timestamps to the database.
   - Lines 673–687, 915–1002: "My Active Roadmap" renders enrolled courses with interactive progress sliders and working external redirection links ("Continue on NPTEL" / "Continue on Swayam").

### 1.2 Build & Test Verification Results
- **TypeScript Typecheck**:
  - Command: `npx tsc --noEmit`
  - Output: Exit code `0` (0 errors across the entire codebase).
- **Automated Test Suite**:
  - Command: `npm test`
  - Output: 46/46 tests passing across all test files (`tests/*.test.js`), 0 failures, 0 skipped.

---

## 2. Logic Chain

1. **Integrity & Authenticity Check**:
   - The implementation contains no hardcoded bypasses, dummy stubs, or facade functions.
   - All persistence operations execute against real PostgreSQL tables (`trainee_employment`, `training_programs`, `trainee_enrollments`, `trainee_course_enrollments`, `external_courses`) via Supabase.
   - UI forms and models perform live state updates, data validation, and error reporting.

2. **Root Cause Remediation (Bug 1 & Bug 4)**:
   - Empty string dates sent to PostgreSQL `DATE` columns crashed with HTTP 500. Converting empty strings to `null` and parsing numeric fields resolves database write failures.
   - Replacing the non-atomic `insert` vs `update` branching in `UserContext.tsx` with an atomic `upsert` on `onConflict: 'trainee_id'` guarantees that both new records and updates persist reliably and update React state immediately.

3. **Root Cause Remediation (Bug 2)**:
   - Client-side RLS on `training_programs` restricts write operations to admins. Adding `'training_programs'` to `ALLOWED_TABLES` in `/api/trainee/mutate` allows authenticated candidates to record vocational training programs via the service-role proxy.
   - The interactive modal in `TrainingDetailsPage.tsx` provides complete input interfaces for both accredited catalog courses and custom ITI trade credentials with date sanitization and duplicate detection.

4. **Root Cause Remediation (Bug 3)**:
   - Static catalog IDs (e.g. `'nptel-garment-01'`) previously diverged from Postgres UUID keys, causing enrolled items to disappear from state.
   - Multi-key mapping across UUIDs, URLs, raw titles, normalized strings, and catalog IDs combined with `getEnrollment(c)` ensures that enrollments persist and reflect under "My Active Roadmap" across all sessions and page refreshes.

5. **Security & Resilience**:
   - Strict Set whitelisting in `/api/trainee/mutate` protects unauthorized tables from tampering.
   - All asynchronous mutations are wrapped in `try ... catch ... finally` blocks, preventing unhandled promise rejections and displaying graceful toasts/banners during network or database errors.

---

## 3. Caveats

- **External MOOC vs Vocational Training Separation**:
  - External online courses (NPTEL, Swayam, Coursera) are tracked in `external_courses` and `trainee_course_enrollments` via `CourseSearchModule.tsx`.
  - State vocational and ITI training programs are tracked in `training_programs` and `trainee_enrollments` via `TrainingDetailsPage.tsx`.
  - Both data pipelines are intentionally distinct and operate in full accordance with the database architecture.

---

## 4. Conclusion

- All four reported bugs are completely and robustly resolved:
  1. **Career outcome saving in profile**: Fixed via atomic upsert, date/numeric sanitization in `UserContext.tsx`, and normalized outcome rendering in `TraineeProfilePage.tsx`.
  2. **Adding course in training and course details**: Fixed via `training_programs` API whitelisting, interactive dual-mode modal, and linked enrollment provisioning.
  3. **Course enrollment reflection**: Fixed via multi-key relational hydration, idempotent upsert on `trainee_course_enrollments`, and active roadmap progress tracking in `CourseSearchModule.tsx`.
  4. **Update employment and outcome status saving**: Fixed via modal input sanitization and error-free PostgreSQL date handling.
- Final Verdict: **APPROVE**.

---

## 5. Verification Method

To independently verify the implementation:

1. **Execute Automated Test Suite**:
   ```powershell
   npm test
   ```
   *Expected Output*: 46 tests passing, 0 failures.

2. **Execute TypeScript Typecheck**:
   ```powershell
   npx tsc --noEmit
   ```
   *Expected Output*: Exits with code 0 (0 errors).

3. **Inspect Key File Implementations**:
   - `src/app/api/trainee/mutate/route.ts` (lines 4–21, 44–49): Confirm `training_programs` in `ALLOWED_TABLES` and `onConflict` support.
   - `src/context/UserContext.tsx` (lines 410–477): Confirm date/numeric sanitization and atomic `upsert` on `trainee_employment`.
   - `src/components/profile/EmploymentStatusModal.tsx` (lines 66–195): Confirm input normalization and form submission.
   - `src/components/TraineeProfilePage.tsx` (lines 427–494): Confirm status rendering for wage, self-employed, and seeking placement states.
   - `src/components/TrainingDetailsPage.tsx` (lines 103–367, 617–1011): Confirm Add Training modal, duplicate prevention, and catalog badge.
   - `src/components/CourseSearchModule.tsx` (lines 275–436, 438–592, 915–1002): Confirm multi-key enrollment resolution and Active Roadmap display.
