# Handoff Report — Bug 3: Course Enrollment & NPTEL Link Reflection

## 1. Observation
- **File:** `src/components/CourseSearchModule.tsx`
  - Lines 52–242: Static fallback array `AUTHENTIC_COURSES` uses hardcoded string IDs:
    ```typescript
    id: 'nptel-garment-01', title: 'Apparel Manufacturing & Industrial Garment Technology', platform: 'NPTEL'
    id: 'swayam-fashion-02', title: 'Garment Manufacturing Technology & Quality Assurance', platform: 'Swayam'
    id: 'nptel-ev-03', title: 'Electric Vehicles - System Architecture & Battery Management', platform: 'NPTEL'
    id: 'skill-solar-04', title: 'Suryamitra Solar Photovoltaic Installer & Grid-Tie Technician', platform: 'Skill India'
    id: 'coursera-python-05', title: 'Python for Industrial Automation & Data Analysis', platform: 'Coursera'
    id: 'nptel-health-07', title: 'Medical Device Technologies & Patient Monitoring Systems', platform: 'NPTEL'
    ```
  - Lines 270–309: `fetchCoursesAndEnrollments()` queries `external_courses` table and attempts to merge with `AUTHENTIC_COURSES` using `mergedMap.set(c.id, c)` and `mergedMap.set(dbc.id, ...)`. Because `c.id` is a string (e.g. `'nptel-garment-01'`) and `dbc.id` is a UUID, `mergedMap` keeps both, creating duplicates.
  - Lines 313–325: `fetchCoursesAndEnrollments()` queries `trainee_course_enrollments` and populates `enrolledCourses` with `map[e.course_id] = ...`. In Postgres, `e.course_id` is a UUID referencing `external_courses.id`.
  - Lines 344–396: `handleEnrollCourse(course: Course)` checks `!isUuid`, runs `supabase.from('external_courses').select('id').ilike('title', course.title).maybeSingle()`. If title does not match exactly, it inserts a new course into `external_courses` to obtain a UUID, then inserts into `trainee_course_enrollments` using `mutateDb`.
  - Lines 398–403: Sets local state `enrolledCourses` using both `[course.id]` and `[targetCourseUuid]`.
  - Line 479: `const enrolledCourseList = courses.filter(c => !!enrolledCourses[c.id]);`
  - Lines 605–606: Catalog card checks `const isEnrolled = !!enrolledCourses[course.id];`
  - Lines 706–790: Enrolled tab ("My Active Roadmap") iterates over `enrolledCourseList`.
  - Lines 777–786: Card shows link `Continue on {course.platform}` with URL `course.url` (`https://onlinecourses.nptel.ac.in/...`) and status badge `'In Progress'`.

- **File:** `src/db/EXPANSION_SUITE.sql`
  - Line 249: Seeded title is `'Apparel Manufacturing & Garment Technology'` (missing `"Industrial"`), whereas `AUTHENTIC_COURSES[0].title` is `'Apparel Manufacturing & Industrial Garment Technology'`.
  - Line 56: `CONSTRAINT uq_trainee_course UNIQUE(trainee_id, course_id)`.

- **File:** `src/app/api/trainee/mutate/route.ts`
  - Lines 4–20: `ALLOWED_TABLES` includes `trainee_course_enrollments` and `external_courses`. Supports `insert`, `upsert`, `update`, `delete`.

- **File:** `src/components/TraineePortal.tsx`
  - Line 70: Uses `supabase.from('trainee_enrollments').insert(...)` directly instead of `mutateDb`, risking RLS rejections for training program enrollments.

---

## 2. Logic Chain
1. **Observation 1:** `AUTHENTIC_COURSES` items have string IDs (e.g., `'nptel-garment-01'`), while `trainee_course_enrollments` stores UUIDs (`course_id`).
2. **Observation 2:** In `fetchCoursesAndEnrollments`, `enrolledCourses` map is keyed strictly by `e.course_id` (the UUID).
3. **Reasoning:** When the catalog or roadmap component loads, `enrolledCourses['nptel-garment-01']` evaluates to `undefined`.
4. **Observation 3:** `enrolledCourseList = courses.filter(c => !!enrolledCourses[c.id])`.
5. **Reasoning:** Since `enrolledCourses['nptel-garment-01']` is `undefined`, the filter drops the course from `enrolledCourseList`. The "My Active Roadmap" view renders the empty state: *"You have not enrolled in any courses yet."*
6. **Observation 4:** In `handleEnrollCourse`, title lookup uses `.ilike('title', course.title)` which fails because `AUTHENTIC_COURSES` title contains "Industrial" while database seed does not.
7. **Reasoning:** A new duplicate course with a new UUID is provisioned on each enrollment attempt, and `courses` contains duplicate entries.
8. **Observation 5:** In `handleEnrollCourse`, `mutateDb` uses `action: 'insert'` instead of `upsert`.
9. **Reasoning:** If an enrollment already exists for `(trainee_id, course_id)`, the unique constraint `uq_trainee_course` causes `insert` to fail.
10. **Synthesis:** The UI shows "In Progress" and the NPTEL link while ephemeral state is present, but fails to persist or reflect in the enrolled courses list across page reloads or tab navigation due to the ID/title mismatch and lack of relational hydration.

---

## 3. Caveats
- No caveats regarding the diagnosis of `CourseSearchModule.tsx` and database schema.
- Candidate portal has a parallel skilling module (`TrainingDetailsPage.tsx` and `TraineePortal.tsx`) for `training_programs` (`trainee_enrollments`). While Bug 3 specifically targets NPTEL course enrollments and the enrolled courses list in `CourseSearchModule.tsx`, any global integration between `trainee_course_enrollments` and `UserContext` can also be considered if broader cross-tab synchronization is desired.

---

## 4. Conclusion
Bug 3 is caused by:
1. **ID Key Mismatch in State:** Static string course IDs (`nptel-garment-01`) vs database UUIDs stored in `trainee_course_enrollments`.
2. **Title Inexact Matching:** Exact ILIKE lookup fails due to "Industrial" in static course title, causing duplicate course creation and key divergence.
3. **Non-Relational Hydration:** `fetchCoursesAndEnrollments` does not join `external_courses` when querying `trainee_course_enrollments`, relying instead on brittle array filtering on `courses`.
4. **Non-Idempotent Insert:** Using `action: 'insert'` rather than `upsert` on `trainee_course_enrollments`.

### Recommended Fix:
1. In `src/components/CourseSearchModule.tsx`:
   - Query `trainee_course_enrollments` with `.select('*, external_courses(*)')`.
   - Map `enrolledCourses` using both `e.course_id` (UUID), `e.external_courses?.url`, `e.external_courses?.title?.toLowerCase()`, and static catalog keys.
   - Look up courses in `handleEnrollCourse` using URL or fuzzy title matching, and provision via `upsert`.
   - Update `enrolledCourseList` to build the list directly from the joined `trainee_course_enrollments` records or multi-key lookup.
   - Use `action: 'upsert'` with `onConflict: 'trainee_id,course_id'` in `mutateDb`.

---

## 5. Verification Method
1. **Code Inspection:**
   - Inspect `src/components/CourseSearchModule.tsx` lines 267–330, 335–412, and 479.
   - Inspect `src/db/EXPANSION_SUITE.sql` lines 47–57 and 247–255.
2. **Behavioral Reproduction Test:**
   - Log into candidate portal at `/dashboard#courses`.
   - Click "Add to My Roadmap" on any NPTEL course (e.g. *Apparel Manufacturing & Industrial Garment Technology*).
   - Verify toast message appears.
   - Switch to "My Active Roadmap" tab. Observe whether the course is present.
   - Refresh the page (`F5`) or navigate to `/dashboard#dashboard` and back to `/dashboard#courses`.
   - Observe if the enrolled course persists in "My Active Roadmap" and whether the catalog card still displays "Enrolled (10%)" or reverts to "Add to My Roadmap".
