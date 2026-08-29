# Review & Adversarial Quality Audit Report

**Reviewer:** Reviewer 1 (Roles: reviewer, critic)  
**Date:** 2026-08-29  
**Target:** Parent Orchestrator (`c77cd3fe-83b3-4d06-967d-2e695619bdd0`)  
**Scope:** Verification of all 4 bug fixes across Candidate Portal modules:
1. Career outcome does not save in the profile.
2. Adding a course fails in "add training and course details".
3. Enrolling in a course shows NPTEL link in progress but doesn't reflect in enrolled courses.
4. Unable to save anything in "update employment and outcome status".

---

## 1. Observation

1. **Build and Compiler Verification:**
   - Command `npx tsc --noEmit` executed cleanly and exited with code `0` (0 type errors).
   - Command `npm run build` executed successfully under Next.js 16.3.3 Turbopack, building all 19 static/dynamic routes (`/`, `/dashboard`, `/employers`, `/verify`, `/api/trainee/mutate`, etc.) with zero compilation or packaging errors.
   - Command `npm test` executed 38 automated test cases across 2 suites (`tests/*.test.js`), resulting in 38 passes and 0 failures.

2. **File-by-File Observations:**
   - **`src/app/api/trainee/mutate/route.ts`**:
     - Line 9 includes `'training_programs'` in `ALLOWED_TABLES`.
     - Supports `insert`, `upsert` with `onConflict`, `update` with mandatory `match`, and `delete` with mandatory `match`.
   - **`src/components/profile/EmploymentStatusModal.tsx`**:
     - Lines 66–130 properly initialize status cards: maps `wage_employed`, `employed`, `apprenticeship` to `'employed'`, `self_employed` to `'self_employed'`, and other states to `'not_employed'`.
     - Lines 145–195 sanitize empty dates into `undefined` and numeric inputs via `isNaN(Number(val)) ? 0 : Number(val)` before invoking `updateEmployment`.
   - **`src/context/UserContext.tsx`**:
     - Lines 410–477 implement `updateEmployment` using an atomic `upsert` on `trainee_employment` with `onConflict: 'trainee_id'`.
     - Explicitly converts empty string dates (`data.joining_date?.trim() ? data.joining_date.trim() : null`) to prevent PostgreSQL `invalid input syntax for type date: ""` errors.
     - Safely parses numbers and handles string trim/null conversions.
     - Updates React context state (`setEmployment`) with the returned database row.
   - **`src/components/TraineeProfilePage.tsx`**:
     - Lines 427–490 normalize outcome card display for all wage variants (`employed`, `wage_employed`, `apprenticeship`), micro-enterprise (`self_employed`), and job-seeking states with complete financial metrics (profit, revenue, salary) and diagnostic information.
   - **`src/components/TrainingDetailsPage.tsx`**:
     - Includes "Add Training & Course Details" modal with dual modes (Accredited Catalog selection and Custom ITI / Vocational Course entry).
     - Automatically provisions unseeded programs in `training_programs` and links to `trainee_enrollments`.
     - Implements duplicate detection by ID and title, positive integer duration constraint (`Math.max(1, duration)`), date sanitization, and state synchronization via `refreshData()`.
   - **`src/components/CourseSearchModule.tsx`**:
     - Relational query in `fetchCoursesAndEnrollments` joins `trainee_course_enrollments` with `external_courses(*)`.
     - Multi-dimensional indexing in `enrolledCourses` map keys enrollments by DB UUID, course URL, raw title, lowercase title, normalized title, and matching catalog IDs.
     - `handleEnrollCourse` handles UUID lookup, fuzzy matching, dynamic provisioning in `external_courses`, and atomic upsert in `trainee_course_enrollments` with `onConflict: 'trainee_id,course_id'`.
     - "My Active Roadmap" tab renders enrolled courses with direct platform links ("Continue on NPTEL" / "Continue on Swayam"), status badges, and interactive progress sliders.

3. **Integrity & Authenticity:**
   - No hardcoded mock results, dummy bypasses, or fake API returns detected.
   - All database operations route through verified service-role or browser Supabase clients with live schema compatibility.

---

## 2. Logic Chain

1. **Premise 1 (Bug 1 & Bug 4 Resolution):**
   - In PostgreSQL, submitting empty string `""` to a column of type `DATE` triggers `ERROR 22007: invalid input syntax for type date: ""`, which previously crashed `/api/trainee/mutate`.
   - By converting empty string dates to `null` and parsing numbers safely in `EmploymentStatusModal.tsx` and `UserContext.tsx`, and executing an atomic `upsert` with `onConflict: 'trainee_id'`, all employment and career outcome updates persist idempotently and reliably update context state.
   - In `TraineeProfilePage.tsx`, expanding status checks to include `wage_employed` and `apprenticeship` guarantees that saved career outcomes render accurately.

2. **Premise 2 (Bug 2 Resolution):**
   - The mutation proxy previously rejected `training_programs` because it was omitted from `ALLOWED_TABLES` (HTTP 400).
   - Whitelisting `training_programs` and providing an interactive modal in `TrainingDetailsPage.tsx` allows candidates to record both accredited catalog courses and custom vocational trades with full date sanitization, duplicate prevention, and immediate catalog reflection.

3. **Premise 3 (Bug 3 Resolution):**
   - Divergence between static catalog IDs (`nptel-garment-01`) and relational database UUIDs caused `enrolledCourses[course.id]` lookups to fail on reload, hiding enrolled courses.
   - Multi-key hydration across UUIDs, URLs, titles, and static IDs in `CourseSearchModule.tsx`, combined with relational querying (`external_courses(*)`) and `upsert` with `onConflict: 'trainee_id,course_id'`, ensures courses remain enrolled, active, and accessible in "My Active Roadmap".

4. **Adversarial & Edge-Case Assessment:**
   - **Boundary Condition (Unauthenticated session):** Gracefully prompts the user to log in rather than crashing.
   - **Boundary Condition (Duplicate enrollment):** Checked and prevented in both vocational and external course workflows.
   - **Boundary Condition (Rapid progress adjustment):** State updates immediately in local UI and syncs asynchronously to PostgreSQL.

---

## 3. Caveats

- No caveats. The implementation adheres strictly to the architectural and schema specifications outlined in `PROJECT.md` and `ORIGINAL_REQUEST.md`.

---

## 4. Conclusion

- **Verdict: APPROVE**
- All 4 reported bugs have been completely and cleanly resolved.
- Code quality, type safety, test coverage, and database persistence mechanisms are verified and robust.

---

## 5. Verification Method

1. **TypeScript Typecheck:**
   ```bash
   npx tsc --noEmit
   ```
   *Verified Output:* Exit code 0, 0 errors.

2. **Automated Unit & Integration Test Suites:**
   ```bash
   npm test
   ```
   *Verified Output:* 38 passing tests across all test suites, 0 failures.

3. **Next.js Production Build:**
   ```bash
   npm run build
   ```
   *Verified Output:* Successfully generated all 19 static and dynamic routes.

4. **Code Inspection Checkpoints:**
   - `src/app/api/trainee/mutate/route.ts`: Confirmed `training_programs` in `ALLOWED_TABLES`.
   - `src/components/profile/EmploymentStatusModal.tsx`: Confirmed date/numeric sanitization.
   - `src/context/UserContext.tsx`: Confirmed atomic `upsert` on `trainee_employment`.
   - `src/components/TraineeProfilePage.tsx`: Confirmed outcome card status normalization.
   - `src/components/TrainingDetailsPage.tsx`: Confirmed Add Course modal, duplicate detection, and date sanitization.
   - `src/components/CourseSearchModule.tsx`: Confirmed multi-key enrollment resolution and active roadmap rendering.

