# Project: CareerLoop Candidate Portal Bug Fixes

## Architecture
- **Framework**: Next.js App Router React application with Supabase / PostgreSQL backend.
- **Data Layer & Security**: Mutation proxy API route (`src/app/api/trainee/mutate/route.ts`) executing with Supabase Service Role to bypass client-side RLS safely.
- **State Management**: React Context (`src/context/UserContext.tsx`) provides trainee profile, employment record, and database sync methods.
- **Candidate Modules**:
  - `src/components/profile/EmploymentStatusModal.tsx` & `src/components/TraineeProfilePage.tsx`: Career outcome and wage/self-employment management.
  - `src/components/TrainingDetailsPage.tsx`: Vocational training details and state training programs.
  - `src/components/CourseSearchModule.tsx`: External MOOCs (NPTEL, Swayam, Skill India) enrollment and active roadmap tracking.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Career Outcome Saving in Profile | Persist and render candidate career outcome status on candidate profile | M1 | Survey 1 (Bug 1 & 4) |
| 2 | Update Employment & Outcome Status | Fix modal form validation, date/number sanitization, and upsert execution | M1 | Survey 1 (Bug 1 & 4) |
| 3 | Add Course & Training Details | Whitelist training_programs in mutation API & add interactive modal form in TrainingDetailsPage | M2 | Survey 2 (Bug 2) |
| 4 | Course Enrollment & Reflection | Fix ID mapping, relational hydration, fuzzy title matching, upsert, and roadmap list display | M3 | Survey 3 (Bug 3) |
| 5 | End-to-End Verification & Forensic Audit | Comprehensive verification across all 4 bug fixes, review gates, and integrity audit | M4 | Synthesis |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| 1 | Milestone 1: Employment Status & Career Outcome Persistence | Fix `EmploymentStatusModal.tsx`, `UserContext.tsx`, `TraineeProfilePage.tsx` | none | DONE |
| 2 | Milestone 2: Add Training and Course Details | Whitelist `training_programs` in `/api/trainee/mutate/route.ts` and add interactive Add Course modal in `TrainingDetailsPage.tsx` | none | DONE |
| 3 | Milestone 3: Course Enrollment & Enrolled Courses Reflection | Fix `CourseSearchModule.tsx` data hydration, string ID mapping, upsert, and active roadmap rendering | none | DONE |
| 4 | Milestone 4: Verification, Review & Forensic Audit | Full integration verification, typecheck, challenger stress-tests, reviewer gates, and forensic audit | M1, M2, M3 | DONE |

## Interface Contracts
### Client ↔ `/api/trainee/mutate`
- Table whitelisting: `training_programs`, `trainees`, `trainee_employment`, `trainee_enrollments`, `trainee_course_enrollments`, `external_courses`, etc.
- Actions: `insert`, `update`, `upsert` with `onConflict`.
- Sanitization: All `date` fields must be valid ISO `YYYY-MM-DD` strings or `null` (never empty strings `""`). All `numeric` fields must be parsed numbers or `0` (never `NaN` or raw strings).

### `UserContext.updateEmployment`
- Signature: `(data: Partial<TraineeEmployment>) => Promise<boolean>`
- Behavior: Performs atomic, sanitized `upsert` on `trainee_employment` with `onConflict: 'trainee_id'` and synchronizes React state with the persisted record.

### `TrainingDetailsPage` ↔ Database
- Adding a course provisions `training_programs` row and links to `trainee_enrollments` via `mutateDb` with service role.
- Refreshes context and displays newly added course under "Enrolled Programs".

### `CourseSearchModule` ↔ Database
- Queries `trainee_course_enrollments` joined with `external_courses(*)`.
- Populates `enrolledCourses` map using both database UUIDs, course URLs, normalized titles, and fallback catalog IDs.
- Hydrates "My Active Roadmap" directly from relational records and preserves status across page refreshes.

## Code Layout
- `src/app/api/trainee/mutate/route.ts` - Whitelist and server DB operations
- `src/components/profile/EmploymentStatusModal.tsx` - Employment update form & sanitization
- `src/context/UserContext.tsx` - Global state and updateEmployment upsert
- `src/components/TraineeProfilePage.tsx` - Outcome display normalization
- `src/components/TrainingDetailsPage.tsx` - Add course modal and enrollment list
- `src/components/CourseSearchModule.tsx` - External course search, enrollment, and active roadmap
