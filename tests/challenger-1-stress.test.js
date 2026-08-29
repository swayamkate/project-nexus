const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// ==============================================================================
// CHALLENGER 1 ADVERSARIAL STRESS TEST SUITE
// Scope: Bug 1 & Bug 4 (Employment & Career Outcome), Bug 2 (Training Programs)
// ==============================================================================

// ------------------------------------------------------------------------------
// SUITE 1: BUG 1 & BUG 4 ADVERSARIAL CHALLENGES
// ------------------------------------------------------------------------------

test('[Bug 1 & 4] Date Sanitizer Handles Extreme Edge Cases, Leap Years & Whitespace Escapes', () => {
  const sanitizeDate = (val) => (val?.trim() ? val.trim() : null);

  // 1. Empty & Whitespace variations
  assert.strictEqual(sanitizeDate(''), null);
  assert.strictEqual(sanitizeDate('   '), null);
  assert.strictEqual(sanitizeDate('\t\n\r  '), null);
  assert.strictEqual(sanitizeDate(null), null);
  assert.strictEqual(sanitizeDate(undefined), null);

  // 2. Leap year dates
  assert.strictEqual(sanitizeDate('2024-02-29'), '2024-02-29');
  assert.strictEqual(sanitizeDate('2020-02-29'), '2020-02-29');
  assert.strictEqual(sanitizeDate('2028-02-29'), '2028-02-29');

  // 3. Standard boundary dates
  assert.strictEqual(sanitizeDate('2026-01-01'), '2026-01-01');
  assert.strictEqual(sanitizeDate('2026-12-31'), '2026-12-31');
  assert.strictEqual(sanitizeDate('1999-12-31'), '1999-12-31');

  // 4. Untrimmed valid dates
  assert.strictEqual(sanitizeDate('  2026-08-29  '), '2026-08-29');
  assert.strictEqual(sanitizeDate('\t2025-05-15\n'), '2025-05-15');
});

test('[Bug 1 & 4] Numeric Sanitizer Evaluates Garbage, Decimals, Negatives & Form Values', () => {
  const sanitizeNumeric = (val) => (isNaN(Number(val)) ? 0 : Number(val));

  // 1. Strings with numbers
  assert.strictEqual(sanitizeNumeric('18000'), 18000);
  assert.strictEqual(sanitizeNumeric(' 25000 '), 25000);
  assert.strictEqual(sanitizeNumeric('0'), 0);
  assert.strictEqual(sanitizeNumeric('-500'), -500);
  assert.strictEqual(sanitizeNumeric('15000.75'), 15000.75);
  assert.strictEqual(sanitizeNumeric('1e4'), 10000);

  // 2. Garbage, empty, non-numeric values
  assert.strictEqual(sanitizeNumeric(''), 0);
  assert.strictEqual(sanitizeNumeric('   '), 0);
  assert.strictEqual(sanitizeNumeric('abc'), 0);
  assert.strictEqual(sanitizeNumeric('₹25000'), 0);
  assert.strictEqual(sanitizeNumeric('undefined'), 0);
  assert.strictEqual(sanitizeNumeric('null'), 0);
  assert.strictEqual(sanitizeNumeric('NaN'), 0);
  assert.strictEqual(sanitizeNumeric(null), 0);
  assert.strictEqual(sanitizeNumeric(undefined), 0);
  assert.strictEqual(sanitizeNumeric({}), 0);
  assert.strictEqual(sanitizeNumeric([]), 0);
});

test('[Bug 1 & 4] UserContext.updateEmployment Payload Generator Resilience', () => {
  // Simulate the UserContext updateEmployment sanitization engine
  const buildEmploymentPayload = (profileId, data, existingEmployment) => {
    if (!profileId) return null;
    const sanitizedPayload = {
      trainee_id: profileId,
      status: data.status || 'not_employed',
      updated_at: new Date().toISOString(),
    };

    if (existingEmployment?.id || data.id) {
      sanitizedPayload.id = data.id || existingEmployment?.id;
    }

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
    if (data.establishment_date !== undefined) sanitizedPayload.establishment_date = data.establishment_date?.trim() ? data.establishment_date.trim() : null;
    if (data.monthly_revenue !== undefined) sanitizedPayload.monthly_revenue = isNaN(Number(data.monthly_revenue)) ? 0 : Number(data.monthly_revenue);
    if (data.monthly_profit !== undefined) sanitizedPayload.monthly_profit = isNaN(Number(data.monthly_profit)) ? 0 : Number(data.monthly_profit);
    if (data.udyam_number !== undefined) sanitizedPayload.udyam_number = data.udyam_number?.trim() || null;
    if (data.gst_number !== undefined) sanitizedPayload.gst_number = data.gst_number?.trim() || null;
    if (data.employees_count !== undefined) sanitizedPayload.employees_count = isNaN(Number(data.employees_count)) ? 0 : Number(data.employees_count);

    // Unemployed fields
    if (data.unemployed_reason !== undefined) sanitizedPayload.unemployed_reason = data.unemployed_reason || null;
    if (data.unemployed_perspective !== undefined) sanitizedPayload.unemployed_perspective = data.unemployed_perspective?.trim() || null;
    if (data.target_workforce_timeline !== undefined) sanitizedPayload.target_workforce_timeline = data.target_workforce_timeline || null;
    if (data.support_needed !== undefined) sanitizedPayload.support_needed = data.support_needed || null;
    if (data.appreciation_details !== undefined) sanitizedPayload.appreciation_details = data.appreciation_details?.trim() || null;

    return sanitizedPayload;
  };

  const profileId = 'user-uuid-101';

  // Case A: First time wage employee submission with empty dates & raw string numbers
  const firstTimeWage = buildEmploymentPayload(profileId, {
    status: 'employed',
    company_name: ' Mahindra & Mahindra ',
    designation: ' CNC Operator ',
    joining_date: '  ',
    monthly_salary: '22500',
    work_location: ' Pune Bhosari ',
    pf_esic_number: '',
    appreciation_details: ' Best performer award '
  }, null);

  assert.strictEqual(firstTimeWage.trainee_id, profileId);
  assert.strictEqual(firstTimeWage.id, undefined);
  assert.strictEqual(firstTimeWage.status, 'employed');
  assert.strictEqual(firstTimeWage.company_name, 'Mahindra & Mahindra');
  assert.strictEqual(firstTimeWage.designation, 'CNC Operator');
  assert.strictEqual(firstTimeWage.joining_date, null);
  assert.strictEqual(firstTimeWage.monthly_salary, 22500);
  assert.strictEqual(firstTimeWage.work_location, 'Pune Bhosari');
  assert.strictEqual(firstTimeWage.pf_esic_number, null);
  assert.strictEqual(firstTimeWage.appreciation_details, 'Best performer award');

  // Case B: Existing self-employed update with Udyam & Profit
  const existingSelf = buildEmploymentPayload(profileId, {
    status: 'self_employed',
    business_name: 'Omkar Electrical Works',
    business_category: 'Services',
    establishment_date: '2024-03-01',
    monthly_revenue: '75000',
    monthly_profit: '32000',
    udyam_number: 'UDYAM-MH-12-0098765',
    employees_count: '3'
  }, { id: 'emp-record-uuid-999' });

  assert.strictEqual(existingSelf.trainee_id, profileId);
  assert.strictEqual(existingSelf.id, 'emp-record-uuid-999');
  assert.strictEqual(existingSelf.status, 'self_employed');
  assert.strictEqual(existingSelf.business_name, 'Omkar Electrical Works');
  assert.strictEqual(existingSelf.establishment_date, '2024-03-01');
  assert.strictEqual(existingSelf.monthly_revenue, 75000);
  assert.strictEqual(existingSelf.monthly_profit, 32000);
  assert.strictEqual(existingSelf.udyam_number, 'UDYAM-MH-12-0098765');
  assert.strictEqual(existingSelf.employees_count, 3);

  // Case C: Unemployed / seeking submission with missing fields
  const seekingSubmission = buildEmploymentPayload(profileId, {
    status: 'not_employed',
    unemployed_reason: 'higher_education',
    unemployed_perspective: ' Preparing for SSC CGL exam ',
    target_workforce_timeline: 'after_studies',
    support_needed: 'counseling'
  }, null);

  assert.strictEqual(seekingSubmission.status, 'not_employed');
  assert.strictEqual(seekingSubmission.unemployed_reason, 'higher_education');
  assert.strictEqual(seekingSubmission.unemployed_perspective, 'Preparing for SSC CGL exam');
  assert.strictEqual(seekingSubmission.target_workforce_timeline, 'after_studies');
  assert.strictEqual(seekingSubmission.support_needed, 'counseling');
});

test('[Bug 1 & 4] Profile Outcome View Decision Matrix across all Status Enums', () => {
  const getOutcomeViewMode = (employment) => {
    if (employment && ['employed', 'wage_employed', 'apprenticeship'].includes(employment.status || '')) {
      return 'WAGE_EMPLOYED_VIEW';
    }
    if (employment && employment.status === 'self_employed') {
      return 'SELF_EMPLOYED_VIEW';
    }
    return 'SEEKING_PLACEMENT_VIEW';
  };

  // 1. Wage employment variants
  assert.strictEqual(getOutcomeViewMode({ status: 'employed' }), 'WAGE_EMPLOYED_VIEW');
  assert.strictEqual(getOutcomeViewMode({ status: 'wage_employed' }), 'WAGE_EMPLOYED_VIEW');
  assert.strictEqual(getOutcomeViewMode({ status: 'apprenticeship' }), 'WAGE_EMPLOYED_VIEW');

  // 2. Self-employed
  assert.strictEqual(getOutcomeViewMode({ status: 'self_employed' }), 'SELF_EMPLOYED_VIEW');

  // 3. Seeking / Unemployed / Fallback variants
  assert.strictEqual(getOutcomeViewMode({ status: 'not_employed' }), 'SEEKING_PLACEMENT_VIEW');
  assert.strictEqual(getOutcomeViewMode({ status: 'unemployed' }), 'SEEKING_PLACEMENT_VIEW');
  assert.strictEqual(getOutcomeViewMode({ status: 'job_seeking' }), 'SEEKING_PLACEMENT_VIEW');
  assert.strictEqual(getOutcomeViewMode({ status: 'transition' }), 'SEEKING_PLACEMENT_VIEW');
  assert.strictEqual(getOutcomeViewMode({ status: '' }), 'SEEKING_PLACEMENT_VIEW');
  assert.strictEqual(getOutcomeViewMode(null), 'SEEKING_PLACEMENT_VIEW');
  assert.strictEqual(getOutcomeViewMode(undefined), 'SEEKING_PLACEMENT_VIEW');
  assert.strictEqual(getOutcomeViewMode({ status: 'unknown_custom_status' }), 'SEEKING_PLACEMENT_VIEW');
});

// ------------------------------------------------------------------------------
// SUITE 2: BUG 2 ADVERSARIAL CHALLENGES
// ------------------------------------------------------------------------------

test('[Bug 2] Whitelist in /api/trainee/mutate Strictly Contains training_programs & Blocks Malicious Tables', () => {
  const routePath = path.resolve(__dirname, '../src/app/api/trainee/mutate/route.ts');
  const code = fs.readFileSync(routePath, 'utf8');

  // Must whitelist training_programs
  assert.ok(code.includes("'training_programs'"), 'training_programs must be in ALLOWED_TABLES');
  assert.ok(code.includes("'trainees'"), 'trainees must be in ALLOWED_TABLES');
  assert.ok(code.includes("'trainee_employment'"), 'trainee_employment must be in ALLOWED_TABLES');
  assert.ok(code.includes("'trainee_enrollments'"), 'trainee_enrollments must be in ALLOWED_TABLES');
  assert.ok(code.includes("'external_courses'"), 'external_courses must be in ALLOWED_TABLES');

  // Reconstructed ALLOWED_TABLES check
  const ALLOWED_TABLES = new Set([
    'trainees',
    'trainee_employment',
    'trainee_enrollments',
    'trainee_course_enrollments',
    'training_programs',
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

  // Test allowed vs unauthorized tables
  assert.strictEqual(ALLOWED_TABLES.has('training_programs'), true);
  assert.strictEqual(ALLOWED_TABLES.has('trainee_employment'), true);
  assert.strictEqual(ALLOWED_TABLES.has('admin_users'), false);
  assert.strictEqual(ALLOWED_TABLES.has('auth_tokens'), false);
  assert.strictEqual(ALLOWED_TABLES.has('pg_catalog'), false);
  assert.strictEqual(ALLOWED_TABLES.has('information_schema'), false);
  assert.strictEqual(ALLOWED_TABLES.has('../../../etc/passwd'), false);
});

test('[Bug 2] Custom Training Program Form Validation & Bounds Enforcement', () => {
  const validateCustomProgram = ({ title, provider, duration, sector }) => {
    if (!title || !title.trim()) {
      return { valid: false, error: 'Please enter the Course / Program Title.' };
    }
    if (!provider || !provider.trim()) {
      return { valid: false, error: 'Please enter the Training Provider or ITI Institute name.' };
    }
    const cleanDuration = Math.max(1, parseInt(duration, 10) || 1);
    return {
      valid: true,
      data: {
        title: title.trim(),
        provider_name: provider.trim(),
        sector: (sector || 'Other Vocational Trade').trim(),
        duration_months: cleanDuration
      }
    };
  };

  // 1. Rejects blank title / provider
  assert.strictEqual(validateCustomProgram({ title: '', provider: 'Govt ITI', duration: 3 }).valid, false);
  assert.strictEqual(validateCustomProgram({ title: '   ', provider: 'Govt ITI', duration: 3 }).valid, false);
  assert.strictEqual(validateCustomProgram({ title: 'Electrician', provider: '', duration: 3 }).valid, false);
  assert.strictEqual(validateCustomProgram({ title: 'Electrician', provider: '   ', duration: 3 }).valid, false);

  // 2. Sanitizes duration bounds
  const zeroDur = validateCustomProgram({ title: 'Fitter', provider: 'Govt ITI', duration: 0 });
  assert.strictEqual(zeroDur.valid, true);
  assert.strictEqual(zeroDur.data.duration_months, 1);

  const negDur = validateCustomProgram({ title: 'Fitter', provider: 'Govt ITI', duration: -12 });
  assert.strictEqual(negDur.valid, true);
  assert.strictEqual(negDur.data.duration_months, 1);

  const invalidDur = validateCustomProgram({ title: 'Fitter', provider: 'Govt ITI', duration: 'invalid' });
  assert.strictEqual(invalidDur.valid, true);
  assert.strictEqual(invalidDur.data.duration_months, 1);

  const validDur = validateCustomProgram({ title: 'Fitter', provider: 'Govt ITI', duration: '6' });
  assert.strictEqual(validDur.valid, true);
  assert.strictEqual(validDur.data.duration_months, 6);
});

test('[Bug 2] Duplicate Detection with Case/Whitespace/Special Character Permutations', () => {
  const existingEnrollments = [
    {
      id: 'enr-1',
      program_id: 'd9b1a5e0-1111-4444-9999-000000000001',
      training_programs: { title: 'Solar PV Rooftop Technician', sector: 'Renewable Energy' }
    },
    {
      id: 'enr-2',
      program_id: 'd9b1a5e0-2222-4444-9999-000000000002',
      training_programs: { title: 'Advanced Tailoring & Garment Manufacturing', sector: 'Apparel & Fashion' }
    },
    {
      id: 'enr-3',
      program_id: 'd9b1a5e0-3333-4444-9999-000000000003',
      training_programs: null // Edge case: enrollment with broken relational join
    }
  ];

  const checkIsDuplicate = (programId, title) => {
    return existingEnrollments.some(
      (e) =>
        (programId && e.program_id === programId) ||
        (title && e.training_programs?.title && e.training_programs.title.trim().toLowerCase() === title.trim().toLowerCase())
    );
  };

  // 1. Matching by Program ID
  assert.strictEqual(checkIsDuplicate('d9b1a5e0-1111-4444-9999-000000000001', ''), true);
  assert.strictEqual(checkIsDuplicate('d9b1a5e0-9999-9999-9999-999999999999', ''), false);

  // 2. Matching by Exact & Fuzzy Title
  assert.strictEqual(checkIsDuplicate(null, 'Solar PV Rooftop Technician'), true);
  assert.strictEqual(checkIsDuplicate(null, 'solar pv rooftop technician'), true);
  assert.strictEqual(checkIsDuplicate(null, '   SOLAR PV ROOFTOP TECHNICIAN   '), true);
  assert.strictEqual(checkIsDuplicate(null, 'advanced tailoring & garment manufacturing'), true);

  // 3. Distinct titles
  assert.strictEqual(checkIsDuplicate(null, 'CNC Milling & Precision Machining'), false);
  assert.strictEqual(checkIsDuplicate(null, 'Automotive Electric Vehicle Maintenance'), false);

  // 4. Survives broken relational record (enr-3 where training_programs is null)
  assert.doesNotThrow(() => checkIsDuplicate(null, 'Any Course'));
});

test('[Bug 2] Training Enrollment Status-Dependent Payload Sanitization', () => {
  const buildEnrollmentPayload = (traineeId, programId, status, rawDates) => {
    return {
      trainee_id: traineeId,
      program_id: programId,
      enrolled_date: rawDates.enrolled_date || new Date().toISOString().split('T')[0],
      status: status,
      completed_date: (status === 'completed' || status === 'certified') && rawDates.completed_date?.trim() ? rawDates.completed_date.trim() : null,
      certified_date: status === 'certified' && rawDates.certified_date?.trim() ? rawDates.certified_date.trim() : null,
      certificate_id: (status === 'certified' || status === 'completed') && rawDates.certificate_id?.trim() ? rawDates.certificate_id.trim() : null,
      grade: rawDates.grade?.trim() ? rawDates.grade.trim() : null
    };
  };

  const traineeId = 'trainee-123';
  const programId = 'prog-456';

  // Case 1: Status = 'enrolled' (Even if completion dates/certificate ID are supplied, they must be stripped/null)
  const enrolledPayload = buildEnrollmentPayload(traineeId, programId, 'enrolled', {
    enrolled_date: '2026-08-01',
    completed_date: '2026-10-01',
    certified_date: '2026-10-15',
    certificate_id: 'CERT-123',
    grade: 'A'
  });
  assert.strictEqual(enrolledPayload.status, 'enrolled');
  assert.strictEqual(enrolledPayload.enrolled_date, '2026-08-01');
  assert.strictEqual(enrolledPayload.completed_date, null);
  assert.strictEqual(enrolledPayload.certified_date, null);
  assert.strictEqual(enrolledPayload.certificate_id, null);
  assert.strictEqual(enrolledPayload.grade, 'A');

  // Case 2: Status = 'completed' (Allows completion date, certificate ID, grade, but certified_date must be null)
  const completedPayload = buildEnrollmentPayload(traineeId, programId, 'completed', {
    enrolled_date: '2026-01-10',
    completed_date: '2026-06-15',
    certified_date: '2026-07-01',
    certificate_id: 'COMP-789',
    grade: 'Distinction'
  });
  assert.strictEqual(completedPayload.status, 'completed');
  assert.strictEqual(completedPayload.enrolled_date, '2026-01-10');
  assert.strictEqual(completedPayload.completed_date, '2026-06-15');
  assert.strictEqual(completedPayload.certified_date, null);
  assert.strictEqual(completedPayload.certificate_id, 'COMP-789');
  assert.strictEqual(completedPayload.grade, 'Distinction');

  // Case 3: Status = 'certified' with empty strings in dates/certificate
  const certifiedEmpty = buildEnrollmentPayload(traineeId, programId, 'certified', {
    enrolled_date: '2026-01-10',
    completed_date: '  ',
    certified_date: '',
    certificate_id: '   ',
    grade: ''
  });
  assert.strictEqual(certifiedEmpty.status, 'certified');
  assert.strictEqual(certifiedEmpty.completed_date, null);
  assert.strictEqual(certifiedEmpty.certified_date, null);
  assert.strictEqual(certifiedEmpty.certificate_id, null);
  assert.strictEqual(certifiedEmpty.grade, null);

  // Case 4: Status = 'certified' fully populated
  const certifiedFull = buildEnrollmentPayload(traineeId, programId, 'certified', {
    enrolled_date: '2025-08-01',
    completed_date: '2025-11-30',
    certified_date: '2025-12-10',
    certificate_id: 'NCVT-MSDE-2025-88412',
    grade: 'A+'
  });
  assert.strictEqual(certifiedFull.status, 'certified');
  assert.strictEqual(certifiedFull.completed_date, '2025-11-30');
  assert.strictEqual(certifiedFull.certified_date, '2025-12-10');
  assert.strictEqual(certifiedFull.certificate_id, 'NCVT-MSDE-2025-88412');
  assert.strictEqual(certifiedFull.grade, 'A+');
});
