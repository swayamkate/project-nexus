# Handoff Report — Bug 2: Adding a Course Fails in "Add Training and Course Details"

**Agent**: Survey Explorer 2  
**Date**: 2026-08-29  
**Recipient**: Parent Orchestrator (`c77cd3fe-83b3-4d06-967d-2e695619bdd0`)  
**Status**: Investigation Complete — Hard Handoff  

---

## 1. Observation

Direct code and database observations:

1. **Section Definition in Dashboard & UI**:
   - `src/app/dashboard/page.tsx:160`: `{activeSection === 'training-details' && <TrainingDetailsPage />}`
   - `src/components/TrainingDetailsPage.tsx:78`: `<h1 className="text-2xl font-black text-slate-900 tracking-tight">{t('training.title', 'Training & Course Details')}</h1>`
   - `src/components/TrainingDetailsPage.tsx`: The entire component contains only a list of already enrolled courses (`enrollments.map(...)`) and a catalog grid (`allCourses.map(...)`) with a simple `handleEnroll(course.id)`. There is **no form, modal, or input interface** allowing users to add or record custom training & course details.

2. **Server-Side Mutation Route Whitelist**:
   - `src/app/api/trainee/mutate/route.ts:4-20`:
     ```ts
     const ALLOWED_TABLES = new Set([
       'trainees',
       'trainee_employment',
       'trainee_enrollments',
       'trainee_course_enrollments',
       'verifications',
       'trainee_followups',
       'trainee_career_goals',
       'career_roadmaps',
       'scheme_applications',
       'assessment_submissions',
       'support_tickets',
       'trainee_notifications',
       'enterprise_ledger',
       'interview_questions',
       'external_courses'
     ]);
     ```
     `'training_programs'` is **missing from `ALLOWED_TABLES`**. Any call to `/api/trainee/mutate` with `table: 'training_programs'` is rejected on line 28 with `{ error: 'Unauthorized or invalid table: "training_programs"' }` and HTTP status 400.

3. **Database RLS Policies on `training_programs`**:
   - `src/db/HARDENED_PRODUCTION_RLS.sql:317-320`:
     ```sql
     CREATE POLICY "Public read training programs" ON public.training_programs FOR SELECT USING (true);
     CREATE POLICY "Admin write training programs" ON public.training_programs FOR ALL USING (is_admin()) WITH CHECK (is_admin());
     ```
     Non-admin candidate sessions cannot insert into `public.training_programs` from the browser client, requiring server-side mutation via the service role key in `/api/trainee/mutate`.

4. **Database Table Constraints (`trainee_enrollments`)**:
   - `src/db/COMPLETE_SUPABASE_REPAIR.sql:69-80`:
     `trainee_enrollments` requires `trainee_id` (FK to `trainees(id)`), `program_id` (FK to `training_programs(id)`), `enrolled_date`, `status`, `completed_date`, `certified_date`, `certificate_id`, and `grade`.

5. **`handleEnroll` Silent Abort & Duplicate Logic**:
   - `src/components/TrainingDetailsPage.tsx:40`: `if (!profile?.id) return;` silently returns without user feedback if profile is not loaded.
   - `src/components/TrainingDetailsPage.tsx:164-171`: The "Enroll in Course" button does not check `enrollments.some(e => e.program_id === course.id)`, resulting in duplicate enrollment attempts or errors.

---

## 2. Logic Chain

1. **Step 1**: The user requirement states: *"Adding a course fails in 'add training and course details'"*.
2. **Step 2 (UI Gap)**: Inspecting `TrainingDetailsPage.tsx` (which corresponds to the "Training & Course Details" section) revealed that while the page displays existing enrollments and secondary upskilling courses, it completely lacks an "Add Training & Course Details" modal/form for candidates to record their vocational training courses (e.g. course title, trade sector, training provider, duration, enrollment date, completion date, certificate ID, grade).
3. **Step 3 (API Barrier)**: When candidate inputs a custom course, the system must provision a record in `training_programs` and link it in `trainee_enrollments`. However, `src/app/api/trainee/mutate/route.ts` rejects any mutations to `training_programs` because `'training_programs'` is omitted from `ALLOWED_TABLES`.
4. **Step 4 (RLS Constraint)**: Direct browser-side client insertions into `training_programs` are rejected by PostgreSQL Row Level Security (RLS) policies because candidate users do not have admin roles. Therefore, whitelisting `'training_programs'` in the server-side proxy `/api/trainee/mutate` (which executes with the Supabase Service Role) is mandatory.
5. **Step 5 (Catalog Enrollment Flaws)**: For catalog enrollment in `TrainingDetailsPage.tsx`, `handleEnroll` silently bails out on `!profile?.id`, lacks duplicate enrollment prevention, and lacks fallback catalog handling if the database `training_programs` table has empty or partial records.
6. **Step 6**: Combining the UI modal implementation, server whitelist addition, duplicate guard, and `refreshData()` context synchronization resolves all failure points when adding or enrolling in courses.

---

## 3. Caveats

- In `CourseSearchModule.tsx`, external MOOCs (NPTEL / Swayam) are stored in `external_courses` and `trainee_course_enrollments`, which is separate from state vocational `training_programs` and `trainee_enrollments`. Bug 2 specifically focuses on "Training & Course Details" (`TrainingDetailsPage.tsx`), but ensuring both tables can be referenced will ensure consistency across the candidate portal.
- No other caveats.

---

## 4. Conclusion

Bug 2 is caused by:
1. **Missing UI Feature**: `src/components/TrainingDetailsPage.tsx` does not provide an "Add Training & Course Details" action button or interactive modal form.
2. **Server API Table Exclusion**: `src/app/api/trainee/mutate/route.ts` omits `'training_programs'` from `ALLOWED_TABLES`, causing HTTP 400 errors whenever course creation is attempted.
3. **Missing Duplicate Check & Silent Return**: `handleEnroll` in `TrainingDetailsPage.tsx` does not validate whether a course is already enrolled and returns silently if `profile?.id` is undefined.

**Required Fixes**:
1. Add `'training_programs'` to `ALLOWED_TABLES` in `src/app/api/trainee/mutate/route.ts`.
2. Add an **"Add Training & Course Details"** button and interactive modal in `src/components/TrainingDetailsPage.tsx` supporting:
   - Selecting an accredited program from catalog OR entering custom training details (Title, Sector, Provider, Duration, Dates, Grade, Certificate ID, Status).
   - Atomic database write via `mutateDb` to `training_programs` and `trainee_enrollments`.
   - Context synchronization via `refreshData()`.
3. Add enrollment status checks (`isEnrolled`) and feedback toasts in `TrainingDetailsPage.tsx`.

---

## 5. Verification Method

To independently verify the diagnosis and fix:

1. **Verify API Whitelist**:
   ```bash
   node -e "
     fetch('http://localhost:3000/api/trainee/mutate', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         table: 'training_programs',
         action: 'insert',
         payload: { title: 'Test Course', sector: 'Apparel & Fashion', duration_months: 3, provider_name: 'MSSDS' }
       })
     }).then(r => r.json()).then(console.log);
   "
   ```
   - Before fix: `{ error: 'Unauthorized or invalid table: "training_programs"' }` (HTTP 400)
   - After fix: `{ success: true, data: [...] }` (HTTP 200)

2. **Verify Frontend Add Course Modal**:
   - Navigate to `#training-details` in candidate portal.
   - Click "Add Training & Course Details".
   - Submit a new course with custom details.
   - Check that the course immediately appears under "Enrolled Programs" and is persisted in `trainee_enrollments` and `training_programs`.
