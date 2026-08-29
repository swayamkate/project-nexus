# Comprehensive Investigation Analysis: Bug 1 & Bug 4

**Agent:** Survey Explorer 1  
**Date:** 2026-08-29  
**Target System:** CareerLoop Candidate Portal (Next.js 15 / React 19 / Supabase PostgreSQL)  
**Investigation Scope:**
1. **Bug 1:** Career outcome does not save in the profile.
2. **Bug 4:** Unable to save anything in "update employment and outcome status".

---

## Executive Summary

Both Bug 1 and Bug 4 stem from a shared root cause in the **Career Outcome & Employment Status persistence pipeline**:
- In `src/components/profile/EmploymentStatusModal.tsx`, form submission constructs payloads containing empty string date values (`joining_date: ''` and `establishment_date: ''`) and un-sanitized numeric fields.
- When passed to `updateEmployment` in `src/context/UserContext.tsx` and submitted to `/api/trainee/mutate`, PostgreSQL rejects empty string dates with error code `22007: invalid input syntax for type date: ""` (resulting in HTTP 500).
- Furthermore, `updateEmployment` uses a brittle `insert`-vs-`update` branching based on in-memory `employment?.id`, causing unique key conflicts or state desynchronization where `setEmployment` evaluates `prev ? ... : null` to `null`.
- Consequently, users are completely unable to save in "Update Employment & Outcome Status" (Bug 4), and the Career Outcome card on the Trainee Profile page never reflects or saves updated outcome records (Bug 1).

---

## Codebase Architecture & Call Chain Analysis

```
[TraineeProfilePage.tsx] (Current Outcome Status Card)
   │  (clicks "Update")
   ▼
[EmploymentStatusModal.tsx] ("Update Employment & Outcome Status" Modal)
   │  (submits form via handleSave)
   ▼
[UserContext.tsx] (updateEmployment)
   │  (formats payload: adds trainee_id & updated_at)
   ▼
[traineeApi.ts] (mutateDb)
   │  (POST /api/trainee/mutate)
   ▼
[src/app/api/trainee/mutate/route.ts]
   │  (Supabase Service Role query on table: 'trainee_employment')
   ▼
[PostgreSQL Database: public.trainee_employment]
   └── REJECTS: invalid input syntax for type date: ""
```

---

## Granular Bug Diagnosis

### 1. Bug 4: Unable to save anything in "update employment and outcome status"

#### A. File & Line Number Identification
- **Form Component:** `src/components/profile/EmploymentStatusModal.tsx`
  - Lines 66–95: State initialization setting `joining_date: ''`, `establishment_date: ''`, etc.
  - Lines 109–154: `handleSave` handler executing without date/numeric sanitization.
  - Lines 593–600: Modal action button "Save & Synchronize Outcome".
- **Context Provider:** `src/context/UserContext.tsx`
  - Lines 410–444: `updateEmployment` mutation function.
- **Server API Handler:** `src/app/api/trainee/mutate/route.ts`
  - Lines 22–82: Table mutation endpoint.
- **Database Schema:** `src/db/COMPLETE_SUPABASE_REPAIR.sql`
  - Lines 82–109: Schema definition for `public.trainee_employment` where `joining_date` and `establishment_date` are typed as `DATE`.

#### B. Step-by-Step Failure Sequence
1. **Initial Form State:** When a user opens "Update Employment & Outcome Status", `setFormData` initializes empty strings for non-entered fields (`joining_date: ''`, `establishment_date: ''`, `udyam_number: ''`, etc.).
2. **Payload Formulation:** In `handleSave`:
   ```typescript
   const payload: Partial<TraineeEmployment> = {
     ...formData,
     status: status,
   };
   const ok = await updateEmployment(payload);
   ```
   `payload` carries `joining_date: ""` and `establishment_date: ""`.
3. **API Dispatch:** `updateEmployment` dispatches the payload to `/api/trainee/mutate` targeting table `trainee_employment`.
4. **PostgreSQL Type Rejection:** PostgreSQL executes `INSERT INTO trainee_employment (...)` or `UPDATE trainee_employment SET ...`. When attempting to cast `""` into a `DATE` column (`joining_date` or `establishment_date`), PostgreSQL throws:
   ```
   ERROR 22007: invalid input syntax for type date: ""
   ```
5. **UI Error Display:** The API returns status 500. `updateEmployment` catches the error, logs it, and returns `false`. `EmploymentStatusModal` sets `errorMsg = 'Failed to update employment records. Please verify your inputs.'`, blocking the save operation.

---

### 2. Bug 1: Career outcome does not save in the profile

#### A. File & Line Number Identification
- **Profile Component:** `src/components/TraineeProfilePage.tsx`
  - Lines 417–479: "Current Outcome Status" Card and modal trigger.
- **Modal Component:** `src/components/profile/EmploymentStatusModal.tsx`
  - Lines 134–146: Save invocation and modal close sequence.
- **Context Provider:** `src/context/UserContext.tsx`
  - Lines 274–282: Fetching `trainee_employment` record on profile load.
  - Lines 410–444: `updateEmployment` state synchronization logic.

#### B. Step-by-Step Failure Sequence
1. **Save Failure Cascades to Profile:** Because the underlying mutation in `updateEmployment` fails (as diagnosed in Bug 4), no record is written to `trainee_employment`.
2. **State Nullification Bug in React Context:** In `src/context/UserContext.tsx` line 427:
   ```typescript
   setEmployment(prev => prev ? { ...prev, ...payload } : null);
   ```
   If `employment` was initially `null` in memory (for instance, a first-time candidate without an initial record), `prev ? ... : null` evaluates to `null`. Even if an update or mutation were attempted, the React state is forcibly reset to `null`.
3. **Status String Normalization Mismatch:** In `TraineeProfilePage.tsx` lines 427, 444, 460:
   The UI tests explicitly for `employment?.status === 'employed'`, `'self_employed'`, and `'not_employed'`. Legacy or alternate statuses in the database (`'wage_employed'`, `'job_seeking'`, `'apprenticeship'`, `'unemployed'`) fail to match the employed/self-employed cards and fall through to unhandled or default states.

---

## Additional Related Surfaces Verified

1. **`SelfEmploymentModule.tsx` (Line 175):**
   - Calls `updateEmployment(payload)`. Suffers from the exact same failure when saving business profiles due to empty `establishment_date: ''` or un-sanitized fields.
2. **`TraineeHomeDashboard.tsx` (Line 83):**
   - Calls `updateEmployment` to save micro-business updates. Also dependent on `updateEmployment` reliability.
3. **`CareerGoalModule.tsx` (Lines 140–158):**
   - Correctly uses `mutateDb` with `action: 'upsert'`, `table: 'trainee_career_goals'`, `onConflict: 'trainee_id'`. This proves that `upsert` with `onConflict` is the robust, proven pattern in this codebase.

---

## Detailed Recommended Fixes

### 1. Robust Fix for `updateEmployment` in `src/context/UserContext.tsx`

```typescript
// Replace lines 410-444 in src/context/UserContext.tsx
const updateEmployment = async (data: Partial<TraineeEmployment>): Promise<boolean> => {
  if (!profile) return false;
  try {
    // 1. Sanitize payload fields
    const sanitizedPayload: Record<string, any> = {
      trainee_id: profile.id,
      status: data.status || 'not_employed',
      updated_at: new Date().toISOString(),
    };

    // Wage employment fields
    if (data.company_name !== undefined) sanitizedPayload.company_name = data.company_name?.trim() || null;
    if (data.designation !== undefined) sanitizedPayload.designation = data.designation?.trim() || null;
    if (data.joining_date !== undefined) sanitizedPayload.joining_date = data.joining_date?.trim() ? data.joining_date.trim() : null;
    if (data.monthly_salary !== undefined) sanitizedPayload.monthly_salary = isNaN(Number(data.monthly_salary)) ? 0 : Number(data.monthly_salary);
    if (data.work_location !== undefined) sanitizedPayload.work_location = data.work_location?.trim() || null;
    if (data.pf_esic_number !== undefined) sanitizedPayload.pf_esic_number = data.pf_esic_number?.trim() || null;
    if (data.training_relevance !== undefined) sanitizedPayload.training_relevance = data.training_relevance || 'direct_match';
    if (data.contract_type !== undefined) sanitizedPayload.contract_type = data.contract_type || 'permanent';

    // Self employment fields
    if (data.business_name !== undefined) sanitizedPayload.business_name = data.business_name?.trim() || null;
    if (data.business_type !== undefined) sanitizedPayload.business_type = data.business_type?.trim() || null;
    if (data.business_category !== undefined) sanitizedPayload.business_category = data.business_category || 'Services';
    if (data.business_status !== undefined) sanitizedPayload.business_status = data.business_status || 'active';
    if (data.establishment_date !== undefined) sanitizedPayload.establishment_date = data.establishment_date?.trim() ? data.establishment_date.trim() : null;
    if (data.monthly_revenue !== undefined) sanitizedPayload.monthly_revenue = isNaN(Number(data.monthly_revenue)) ? 0 : Number(data.monthly_revenue);
    if (data.monthly_profit !== undefined) sanitizedPayload.monthly_profit = isNaN(Number(data.monthly_profit)) ? 0 : Number(data.monthly_profit);
    if (data.udyam_number !== undefined) sanitizedPayload.udyam_number = data.udyam_number?.trim() || null;
    if (data.gst_number !== undefined) sanitizedPayload.gst_number = data.gst_number?.trim() || null;
    if (data.employees_count !== undefined) sanitizedPayload.employees_count = isNaN(Number(data.employees_count)) ? 0 : Number(data.employees_count);
    if (data.business_address !== undefined) sanitizedPayload.business_address = data.business_address?.trim() || null;

    // Unemployed / Seeking fields
    if (data.unemployed_reason !== undefined) sanitizedPayload.unemployed_reason = data.unemployed_reason || null;
    if (data.unemployed_perspective !== undefined) sanitizedPayload.unemployed_perspective = data.unemployed_perspective?.trim() || null;
    if (data.target_workforce_timeline !== undefined) sanitizedPayload.target_workforce_timeline = data.target_workforce_timeline || null;
    if (data.support_needed !== undefined) sanitizedPayload.support_needed = data.support_needed || null;
    if (data.appreciation_details !== undefined) sanitizedPayload.appreciation_details = data.appreciation_details?.trim() || null;

    // 2. Perform idempotent upsert on trainee_id
    const { data: resultData, error } = await mutateDb({
      action: 'upsert',
      table: 'trainee_employment',
      payload: sanitizedPayload,
      onConflict: 'trainee_id'
    });

    if (error) throw error;

    // 3. Reliably update React context state
    const savedRecord = (resultData && resultData[0]) ? resultData[0] : { ...(employment || {}), ...sanitizedPayload };
    setEmployment(savedRecord as TraineeEmployment);
    return true;
  } catch (err) {
    console.error('Failed to update employment details:', err);
    return false;
  }
};
```

---

### 2. Fix for `src/components/profile/EmploymentStatusModal.tsx`

Ensure dates and numbers are sanitized before submission:
```typescript
// In handleSave:
const payload: Partial<TraineeEmployment> = {
  ...formData,
  status: status,
  joining_date: formData.joining_date?.trim() ? formData.joining_date.trim() : undefined,
  establishment_date: formData.establishment_date?.trim() ? formData.establishment_date.trim() : undefined,
  monthly_salary: Number(formData.monthly_salary) || 0,
  monthly_revenue: Number(formData.monthly_revenue) || 0,
  monthly_profit: Number(formData.monthly_profit) || 0,
  employees_count: Number(formData.employees_count) || 0,
};
```

---

### 3. Normalization in `src/components/TraineeProfilePage.tsx`

Update status check in Profile page lines 427, 444, 460:
```typescript
// Wage Employed check
const isEmployed = ['employed', 'wage_employed', 'apprenticeship'].includes(employment?.status || '');

// Self Employed check
const isSelfEmployed = employment?.status === 'self_employed';

// Seeking Placement check
const isSeeking = !employment || ['not_employed', 'job_seeking', 'unemployed', ''].includes(employment?.status || '');
```

---

## Verification Plan & Acceptance Check

1. **Update Employment as Wage Employed:**
   - Open Trainee Profile -> Click "Update" on Current Outcome Status.
   - Select "Wage Employed", fill Employer Name "Tata Motors", Role "CNC Technician", Salary "25000", leave `joining_date` blank (or select a date).
   - Click "Save & Synchronize Outcome".
   - Verify modal closes with success notification.
   - Verify Trainee Profile Card displays "Wage Employed", "Tata Motors", "CNC Technician", "₹25,000/month".

2. **Update Employment as Self-Employed:**
   - Open modal -> Select "Self-Employed", Business Name "Shinde Electricals", Revenue "45000", Profit "25000".
   - Click "Save & Synchronize Outcome".
   - Verify Trainee Profile Card displays "Micro-Enterprise", "Shinde Electricals", "Profit: ₹25,000/month".

3. **Update Employment as Seeking Placement:**
   - Open modal -> Select "Seeking Placement", Reason "Lack of local vacancies", Timeline "Immediate".
   - Click "Save & Synchronize Outcome".
   - Verify Trainee Profile Card displays "Seeking Placement" with selected reason and timeline.
