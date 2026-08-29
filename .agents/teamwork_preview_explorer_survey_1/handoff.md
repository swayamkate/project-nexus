# Handoff Report: Bug 1 & Bug 4 Investigation

**Agent:** Survey Explorer 1  
**Handoff Type:** Hard (Task Complete)  
**Date:** 2026-08-29  
**Target:** Parent Orchestrator / Implementer  
**Scope:**
- **Bug 1:** Career outcome does not save in the profile.
- **Bug 4:** Unable to save anything in "update employment and outcome status".

---

## 1. Observation

1. **`src/components/profile/EmploymentStatusModal.tsx`**:
   - Lines 66–95: State initialization sets empty strings for non-entered fields:
     ```typescript
     setFormData({
       status: 'employed',
       company_name: '',
       designation: '',
       monthly_salary: 18000,
       joining_date: '',
       pf_esic_number: '',
       work_location: '',
       appreciation_details: '',
       business_name: '',
       business_type: 'Sole Proprietorship',
       business_category: 'Services',
       monthly_revenue: 0,
       monthly_profit: 0,
       udyam_number: '',
       gst_number: '',
       employees_count: 0,
       unemployed_reason: 'lack_of_local_vacancies',
       unemployed_perspective: '',
       target_workforce_timeline: 'immediate',
       support_needed: 'placement_drive',
     });
     ```
   - Lines 134–148: Form submission packs `formData` directly into `payload` without date/number sanitization:
     ```typescript
     const payload: Partial<TraineeEmployment> = {
       ...formData,
       status: status,
     };
     const ok = await updateEmployment(payload);
     if (ok) {
       setSuccessMsg('Employment & career status successfully synchronized!');
       await refreshData();
       setTimeout(() => { onClose(); }, 1200);
     } else {
       setErrorMsg('Failed to update employment records. Please verify your inputs.');
     }
     ```

2. **`src/context/UserContext.tsx`**:
   - Lines 410–444 (`updateEmployment`):
     ```typescript
     const updateEmployment = async (data: Partial<TraineeEmployment>): Promise<boolean> => {
       if (!profile) return false;
       try {
         const payload = {
           ...data,
           trainee_id: profile.id,
           updated_at: new Date().toISOString(),
         };

         if (employment?.id) {
           const { error } = await mutateDb({
             action: 'update',
             table: 'trainee_employment',
             payload,
             match: { id: employment.id }
           });
           if (error) throw error;
           setEmployment(prev => prev ? { ...prev, ...payload } : null);
         } else {
           const { data: inserted, error } = await mutateDb({
             action: 'insert',
             table: 'trainee_employment',
             payload
           });
           if (error) throw error;
           if (inserted && inserted[0]) {
             setEmployment(inserted[0]);
           }
         }
         return true;
       } catch (err) {
         console.error('Failed to update employment details:', err);
         return false;
       }
     };
     ```
   - Note that if `employment` in memory was initially null and an update branch is executed, line 427 sets `employment` state to `null`: `setEmployment(prev => prev ? { ...prev, ...payload } : null)`.

3. **`src/app/api/trainee/mutate/route.ts`**:
   - Lines 4–20: Table `'trainee_employment'` is in `ALLOWED_TABLES`.
   - Lines 43–48: `action === 'upsert'` with `onConflict` is supported:
     ```typescript
     if (action === 'upsert') {
       const { onConflict } = body;
       const { data, error } = await query.upsert(payload, onConflict ? { onConflict } : undefined).select(select);
       if (error) throw error;
       return NextResponse.json({ success: true, data });
     }
     ```

4. **`src/db/COMPLETE_SUPABASE_REPAIR.sql`**:
   - Lines 82–109: Schema for `public.trainee_employment` specifies:
     - `joining_date date`
     - `establishment_date date`
     - `monthly_salary numeric(12,2)`
     - `monthly_revenue numeric(12,2)`
     - `monthly_profit numeric(12,2)`
     - `employees_count integer`
     - `trainee_id uuid NOT NULL REFERENCES public.trainees(id)`

5. **`src/components/TraineeProfilePage.tsx`**:
   - Lines 417–479: Current Outcome Status Card conditionally checks:
     - `employment?.status === 'employed'` (line 427)
     - `employment?.status === 'self_employed'` (line 444)
     - `(!employment || employment?.status === 'not_employed')` (line 460)

---

## 2. Logic Chain

1. **Premise 1 (Observation 1 & 4):** PostgreSQL strict date columns reject empty string `""` input with error `22007: invalid input syntax for type date: ""`.
2. **Premise 2 (Observation 1):** `EmploymentStatusModal` initializes `joining_date` and `establishment_date` to `""` and sends them verbatim in `payload` whenever the user leaves either date unselected or selects "Seeking Placement".
3. **Premise 3 (Observation 2 & 3):** `updateEmployment` forwards `payload` to `/api/trainee/mutate`, which attempts to insert/update `trainee_employment`. PostgreSQL fails with HTTP 500 error `invalid input syntax for type date: ""`.
4. **Premise 4 (Observation 1 & 2):** When `updateEmployment` catches the 500 error, it returns `false`, causing `EmploymentStatusModal` to display `"Failed to update employment records. Please verify your inputs."` and abort saving. This directly causes **Bug 4**.
5. **Premise 5 (Observation 2 & 5):** Because the employment record never updates in the database and context state is not updated (or set to `null` on line 427), the Trainee Profile page's "Current Outcome Status" card cannot save or display the outcome, causing **Bug 1**.
6. **Premise 6 (Observation 3):** The API `/api/trainee/mutate` already supports `action: 'upsert'` with `onConflict: 'trainee_id'`. Switching `updateEmployment` to sanitized upserts ensures atomic, idempotent persistence across all employment states.

---

## 3. Caveats

- No other backend API routes were modified or needed modifications since `/api/trainee/mutate` handles PostgreSQL operations securely under the service role.
- No dummy data should be introduced.
- Third-party speech recognition in `FollowupsPage` is client-browser dependent and unrelated to Bug 1/Bug 4 database saves.

---

## 4. Conclusion

- **Root Cause of Bug 4 & Bug 1:** Unsanitized empty string dates (`joining_date: ''`, `establishment_date: ''`) and numbers in the form payload crashing PostgreSQL `DATE` / `NUMERIC` columns, combined with brittle `insert`/`update` state branching in `UserContext.updateEmployment`.
- **Remediation Strategy:**
  1. Sanitize all date fields (`val?.trim() ? val.trim() : null`) and number fields (`Number(val) || 0`) in `UserContext.updateEmployment` and `EmploymentStatusModal`.
  2. Refactor `updateEmployment` in `src/context/UserContext.tsx` to use `mutateDb` with `action: 'upsert'` and `onConflict: 'trainee_id'`.
  3. Ensure `setEmployment` correctly sets the returned/merged record in React state.
  4. Normalize status checks in `src/components/TraineeProfilePage.tsx` to handle all valid statuses (`employed`, `wage_employed`, `apprenticeship`, `self_employed`, `not_employed`, `job_seeking`, `unemployed`).

---

## 5. Verification Method

1. **TypeScript Typecheck:**
   ```bash
   npx tsc --noEmit
   ```
   Must exit with code 0 without any type mismatches.

2. **Functional UI Flow Verification:**
   - **Wage Employed Outcome:**
     - Navigate to Trainee Profile -> Outcome Status -> Click "Update".
     - Choose "Wage Employed", enter Company: "Tata Motors", Role: "Junior Technician", Gross Salary: "24000", leave joining date empty.
     - Click "Save & Synchronize Outcome".
     - Verify: Success alert appears, modal closes, and profile card displays "Wage Employed", "Tata Motors", "₹24,000/month".
   - **Self-Employed Outcome:**
     - Open modal -> Choose "Self-Employed", Business: "AutoFix Services", Monthly Revenue: "50000", Profit: "30000", leave establishment date empty.
     - Click "Save & Synchronize Outcome".
     - Verify: Profile card updates to "Micro-Enterprise", "AutoFix Services", "Profit: ₹30,000/month".
   - **Seeking Placement Outcome:**
     - Open modal -> Choose "Seeking Placement", select Reason & Timeline.
     - Click "Save & Synchronize Outcome".
     - Verify: Profile card updates to "Seeking Placement" with selected diagnostic parameters.
