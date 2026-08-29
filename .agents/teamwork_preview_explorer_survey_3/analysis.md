# Deep Technical Analysis: Bug 3 (Course Enrollment & NPTEL Link Reflection)

## Executive Summary
**Bug Description:** Enrolling in a course shows NPTEL link in progress but doesn't reflect in enrolled courses list.
**Primary Component:** `src/components/CourseSearchModule.tsx` (and related integration with `trainee_course_enrollments`, `external_courses`, and `UserContext.tsx`).
**Core Mechanism Failure:** An ID mismatch between static course identifiers (`nptel-garment-01`, etc.) and database UUIDs (`a0000000-...`), combined with an exact-string title lookup failure, duplicate map entries in `fetchCoursesAndEnrollments`, and non-joined enrollment fetching, causes newly enrolled courses to fail correlation with catalog entries. While local state temporarily indicates "In Progress" with the external NPTEL link, reloads and tab navigations fail to resolve the course ID, causing the enrolled course to vanish from "My Active Roadmap" (enrolled courses list) and reset to "Add to My Roadmap".

---

## 1. Relevant Architecture & Data Flow

The application has two distinct course domains:
1. **Internal State Programs:** `training_programs` & `trainee_enrollments` — Managed via `UserContext.tsx` and displayed in `TrainingDetailsPage.tsx`, `CertificationsPage.tsx`, and `AnalyticsPage.tsx`.
2. **External / NPTEL / Swayam Catalog:** `external_courses` & `trainee_course_enrollments` — Managed within `CourseSearchModule.tsx`.

### Data Flow in `CourseSearchModule.tsx`:
1. **Catalog Initialization:**
   - Static catalog defined in `AUTHENTIC_COURSES` (`src/components/CourseSearchModule.tsx:52-242`) with hardcoded string IDs: `'nptel-garment-01'`, `'swayam-fashion-02'`, `'nptel-ev-03'`, `'skill-solar-04'`, `'coursera-python-05'`, `'nptel-health-07'`.
   - `fetchCoursesAndEnrollments` (`src/components/CourseSearchModule.tsx:267-329`) queries table `external_courses` and attempts to merge them into `courses` state using `mergedMap.set(c.id, c)`.
2. **Enrollment Action:**
   - User clicks "Add to My Roadmap" (`handleEnrollCourse`, lines 335-412).
   - If `course.id` is not a UUID, it attempts to look up `external_courses` by exact title:
     `supabase.from('external_courses').select('id').ilike('title', course.title).maybeSingle()`
   - If found or provisioned, it inserts a record into `trainee_course_enrollments` with `course_id = targetCourseUuid`.
   - It sets local state `enrolledCourses` for both `[course.id]` and `[targetCourseUuid]`.
3. **Display & Progress Tracking:**
   - The course card updates to show progress bar, status `"In Progress"`, and link `"Continue on NPTEL"` (`course.url`).
   - The tab toggle switches between "Course Catalog" and "My Active Roadmap" (`enrolledCourseList = courses.filter(c => !!enrolledCourses[c.id])`).

---

## 2. Root Cause Breakdown

### Root Cause 1: ID Disconnect Between Static Catalog and DB UUIDs
- **Location:** `src/components/CourseSearchModule.tsx:277-324`, `344-403`, `479`
- **Mechanism:**
  - `AUTHENTIC_COURSES` uses string IDs like `'nptel-garment-01'`.
  - The database table `trainee_course_enrollments` stores `course_id` referencing `external_courses.id` (UUID).
  - When `fetchCoursesAndEnrollments` runs on mount or refresh:
    ```typescript
    const { data: enrollData } = await supabase
      .from('trainee_course_enrollments')
      .select('*')
      .eq('trainee_id', profile.id);

    if (enrollData) {
      const map: Record<string, { id: string; status: string; progress_pct: number }> = {};
      enrollData.forEach(e => {
        map[e.course_id] = { id: e.id, status: e.status, progress_pct: e.progress_pct };
      });
      setEnrolledCourses(map);
    }
    ```
  - The map is populated with `map[UUID] = ...`.
  - But `courses` in the catalog contains entries where `c.id` is `'nptel-garment-01'`.
  - `enrolledCourses['nptel-garment-01']` is `undefined`.
  - `enrolledCourseList` filter: `courses.filter(c => !!enrolledCourses[c.id])` returns `false` for `'nptel-garment-01'`.
  - As a result, "My Active Roadmap" displays "You have not enrolled in any courses yet." even after enrollment.

### Root Cause 2: Inexact Title Mismatch on External Course Lookup
- **Location:** `src/components/CourseSearchModule.tsx:55`, `349-354`, and `src/db/EXPANSION_SUITE.sql:249`
- **Mechanism:**
  - In `AUTHENTIC_COURSES`:
    `title: 'Apparel Manufacturing & Industrial Garment Technology'`
  - In database seed (`EXPANSION_SUITE.sql:249` / `REAL_COURSES_EXPANSION.sql:25`):
    `title: 'Apparel Manufacturing & Garment Technology'`
  - The lookup in `handleEnrollCourse`:
    ```typescript
    const { data: found } = await supabase
      .from('external_courses')
      .select('id')
      .ilike('title', course.title)
      .maybeSingle();
    ```
    performs an exact string comparison (no `%` wildcards). Because the titles differ by the word "Industrial", `found` is `null`.
  - It falls back to provisioning a brand new row in `external_courses` via `mutateDb`, producing a duplicate course entry with a new random UUID.
  - When merging DB courses in `fetchCoursesAndEnrollments`, `mergedMap` keeps both the static course (`'nptel-garment-01'`) and the newly created course (`new UUID`), resulting in duplicate course cards in the catalog.

### Root Cause 3: Non-Idempotent Insert & Silent Failure on Existing Enrollments
- **Location:** `src/components/CourseSearchModule.tsx:385-396`
- **Mechanism:**
  - `handleEnrollCourse` uses `action: 'insert'` on `trainee_course_enrollments`.
  - The database table has a unique constraint `CONSTRAINT uq_trainee_course UNIQUE(trainee_id, course_id)`.
  - If a user clicks enroll again or re-enrolls, `mutateDb` returns a unique key violation error.
  - The function does not use `upsert`, causing subsequent updates or re-enrollments to fail.

### Root Cause 4: Enrolled Courses List Not Hydrated from Enrollment Relations
- **Location:** `src/components/CourseSearchModule.tsx:313-324`, `479`, `725-790`
- **Mechanism:**
  - Instead of querying `trainee_course_enrollments` with joined course data (`select('*, external_courses(*)')`) and rendering enrolled courses directly from database records, the component attempts to filter the client-side `courses` array using `enrolledCourses[c.id]`.
  - Because `c.id` does not match `e.course_id` (string ID vs UUID), the list is empty (`enrolledCourseList.length === 0`).
  - Meanwhile, in the modal or card, the static NPTEL link (`https://onlinecourses.nptel.ac.in/...`) is rendered with status "In Progress", leading to the reported behavior:
    "Enrolling in a course shows NPTEL link in progress but doesn't reflect in enrolled courses."

---

## 3. Comprehensive Fix Recommendations

### Fix 1: Unify Course Identifiers and Map Static IDs to DB UUIDs
In `CourseSearchModule.tsx`:
1. Query `trainee_course_enrollments` with joined course metadata:
   ```typescript
   const { data: enrollData } = await supabase
     .from('trainee_course_enrollments')
     .select('*, external_courses(*)')
     .eq('trainee_id', profile.id);
   ```
2. Build `enrolledCourses` map indexing both `e.course_id` (UUID), `e.external_courses?.title?.toLowerCase()`, and any matching static catalog IDs:
   ```typescript
   if (enrollData) {
     const map: Record<string, { id: string; status: string; progress_pct: number; courseData?: any }> = {};
     enrollData.forEach((e: any) => {
       map[e.course_id] = { id: e.id, status: e.status, progress_pct: e.progress_pct, courseData: e.external_courses };
       if (e.external_courses?.title) {
         map[e.external_courses.title.toLowerCase()] = { id: e.id, status: e.status, progress_pct: e.progress_pct, courseData: e.external_courses };
       }
       if (e.external_courses?.url) {
         map[e.external_courses.url] = { id: e.id, status: e.status, progress_pct: e.progress_pct, courseData: e.external_courses };
       }
     });
     setEnrolledCourses(map);
   }
   ```
3. Update `isEnrolled` check helper:
   ```typescript
   const getEnrollment = (course: Course) => {
     return enrolledCourses[course.id] || 
            (course.title && enrolledCourses[course.title.toLowerCase()]) ||
            (course.url && enrolledCourses[course.url]);
   };
   ```

### Fix 2: Robust Course Lookup in `handleEnrollCourse`
1. When looking up `external_courses`, search by URL or normalized title:
   ```typescript
   let targetCourseUuid = course.id;
   if (!isUuid) {
     const { data: found } = await supabase
       .from('external_courses')
       .select('id')
       .or(`url.eq."${course.url}",title.ilike."%${course.title.slice(0, 20)}%"`)
       .maybeSingle();
     if (found?.id) {
       targetCourseUuid = found.id;
     } else {
       // Provision via mutateDb
     }
   }
   ```
2. Use `action: 'upsert'` with `onConflict: 'trainee_id,course_id'` when saving to `trainee_course_enrollments`.

### Fix 3: Direct Hydration for "My Active Roadmap" (Enrolled Courses View)
Construct `enrolledCourseList` by combining catalog items and joined enrollment records so that every enrolled record in `trainee_course_enrollments` is guaranteed to be rendered with full title, provider, platform badge, progress bar, and external link.
