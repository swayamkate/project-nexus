## 2026-08-29T02:14:58Z
You are Worker M1.
Your working directory is: c:\Users\Dell\Desktop\SIH2026\.agents\teamwork_preview_worker_m1
Original Request: c:\Users\Dell\Desktop\SIH2026\.agents\ORIGINAL_REQUEST.md
Please read c:\Users\Dell\Desktop\SIH2026\.agents\ORIGINAL_REQUEST.md and c:\Users\Dell\Desktop\SIH2026\PROJECT.md first.
Also read the Survey 1 analysis and handoff report:
- c:\Users\Dell\Desktop\SIH2026\.agents\teamwork_preview_explorer_survey_1\analysis.md
- c:\Users\Dell\Desktop\SIH2026\.agents\teamwork_preview_explorer_survey_1\handoff.md

DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Scope & Owned Files:
- `src/components/profile/EmploymentStatusModal.tsx`
- `src/context/UserContext.tsx`
- `src/components/TraineeProfilePage.tsx`

Objective:
Implement genuine, production-grade fixes for:
1. Bug 1: Career outcome does not save in the profile.
2. Bug 4: Unable to save anything in "update employment and outcome status".

Key Technical Requirements:
1. In `EmploymentStatusModal.tsx`:
   - Sanitize all date fields: convert empty strings `""` to `null` so Postgres `DATE` columns don't fail with syntax error.
   - Sanitize all numeric fields: ensure `monthly_salary`, `monthly_revenue`, `monthly_profit`, `employees_count` are valid numbers or null/0.
   - Ensure payload is properly prepared for `updateEmployment`.
2. In `UserContext.tsx` (`updateEmployment`):
   - Perform atomic, idempotent `mutateDb` with `action: 'upsert'`, `table: 'trainee_employment'`, `payload`, and `onConflict: 'trainee_id'`.
   - Sanitize payload date/number fields before passing to `mutateDb` (convert empty string dates to null, numbers to numeric).
   - Correctly update React state `setEmployment` with the returned or merged record so in-memory state is never erroneously set to null.
3. In `TraineeProfilePage.tsx`:
   - Ensure all status variants (`employed`, `wage_employed`, `apprenticeship`, `self_employed`, `not_employed`, `job_seeking`, `unemployed`) are cleanly normalized and rendered with their corresponding salary/revenue/timeline details.
4. Verify by running `npx tsc --noEmit` and inspecting build results.
5. Write your findings and verification results to `c:\Users\Dell\Desktop\SIH2026\.agents\teamwork_preview_worker_m1\handoff.md` and send a message back.
