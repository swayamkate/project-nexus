## 2026-08-29T02:15:00Z
You are Worker M2.
Your working directory is: c:\Users\Dell\Desktop\SIH2026\.agents\teamwork_preview_worker_m2
Original Request: c:\Users\Dell\Desktop\SIH2026\.agents\ORIGINAL_REQUEST.md
Please read c:\Users\Dell\Desktop\SIH2026\.agents\ORIGINAL_REQUEST.md and c:\Users\Dell\Desktop\SIH2026\PROJECT.md first.
Also read the Survey 2 analysis and handoff report:
- c:\Users\Dell\Desktop\SIH2026\.agents\teamwork_preview_explorer_survey_2\analysis.md
- c:\Users\Dell\Desktop\SIH2026\.agents\teamwork_preview_explorer_survey_2\handoff.md

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Owned Files:
- `src/app/api/trainee/mutate/route.ts`
- `src/components/TrainingDetailsPage.tsx`

Objective:
Implement genuine, production-grade fixes for:
Bug 2: Adding a course fails in "add training and course details".

Key Technical Requirements:
1. In `src/app/api/trainee/mutate/route.ts`:
   - Add `'training_programs'` to `ALLOWED_TABLES` set so server-side proxy allows service-role insertions/upserts for training programs.
2. In `src/components/TrainingDetailsPage.tsx`:
   - Add an interactive "Add Training & Course Details" action button and modal dialog.
   - The modal must allow the candidate to add a course/training program either by selecting an accredited course from catalog OR entering custom training details (Course Title, Sector/Trade, Training Provider, Duration in Months, Enrollment Date, Completion Date, Certificate ID, Grade/Score, Status).
   - On submission, save the record via `mutateDb` (provisioning/linking in `training_programs` and `trainee_enrollments`).
   - Guard `handleEnroll` so it validates `profile?.id`, checks if already enrolled, provides clear toast notifications, and triggers `refreshData()`.
   - Maintain the existing clean UI aesthetic.
3. Verify by running `npx tsc --noEmit` and inspecting build results.
4. Write your findings and verification results to `c:\Users\Dell\Desktop\SIH2026\.agents\teamwork_preview_worker_m2\handoff.md` and send a message back.
