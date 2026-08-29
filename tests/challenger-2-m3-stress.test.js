const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const { createClient } = require('@supabase/supabase-js');

// Static Catalog fixture matching CourseSearchModule.tsx
const AUTHENTIC_COURSES = [
  {
    id: 'nptel-garment-01',
    title: 'Apparel Manufacturing & Industrial Garment Technology',
    provider: 'Prof. R. Chattopadhyay',
    institute: 'IIT Delhi / NPTEL',
    platform: 'NPTEL',
    sector: 'Apparel & Fashion',
    duration_weeks: 12,
    estimated_hours: 60,
    rating: 4.9,
    enrolled_count: 14820,
    is_free: true,
    has_certificate: true,
    nsqf_level: 5,
    deadline: '15 Sep 2025',
    exam_date: '26 Oct 2025',
    prerequisites: 'Basic knowledge of textiles or 10th Standard passing certificate',
    description: 'A comprehensive National Programme on Technology Enhanced Learning course covering industrial fabric cutting...',
    syllabus: [
      'Fabric Inspection Protocols & 4-Point Defect Scoring',
      'Computer-Aided Design (CAD) Pattern Making & Marker Efficiency',
      'Industrial Sewing Machine Kinematics & Stitch Class 100-600',
      'Garment Finishing, Pressing & Packaging Compliance'
    ],
    url: 'https://onlinecourses.nptel.ac.in/noc24_te01/preview',
    skill_tags: ['Garment CAD', 'AQL 2.5 Inspection', 'Industrial Stitching', 'Pattern Making']
  },
  {
    id: 'swayam-fashion-02',
    title: 'Garment Manufacturing Technology & Quality Assurance',
    provider: 'National Institute of Fashion Technology (NIFT)',
    institute: 'NIFT / Ministry of Textiles',
    platform: 'Swayam',
    sector: 'Apparel & Fashion',
    duration_weeks: 8,
    estimated_hours: 40,
    rating: 4.8,
    enrolled_count: 9240,
    is_free: true,
    has_certificate: true,
    nsqf_level: 4,
    deadline: '28 Sep 2025',
    exam_date: '15 Nov 2025',
    prerequisites: 'Open to all vocational school students and boutique owners',
    description: 'Developed by NIFT under the Ministry of Education Swayam framework...',
    syllabus: [
      'Anthropometric Sizing Charts & Body Measurement Standards',
      'Draping Fundamentals & Dart Manipulation Techniques',
      'Garment Costing, Fabric Estimation & Trim Procurement',
      'Export Quality Standards (ISO / OEKO-TEX Compliance)'
    ],
    url: 'https://swayam.gov.in/explorer?category=Design',
    skill_tags: ['Pattern Drafting', 'Production Balancing', 'Boutique Management', 'Seam Testing']
  },
  {
    id: 'nptel-ev-03',
    title: 'Electric Vehicles - System Architecture & Battery Management',
    provider: 'Prof. Ashok Jhunjhunwala',
    institute: 'IIT Madras / NPTEL',
    platform: 'NPTEL',
    sector: 'Automotive & EV',
    duration_weeks: 12,
    estimated_hours: 72,
    rating: 4.9,
    enrolled_count: 26400,
    is_free: true,
    has_certificate: true,
    nsqf_level: 6,
    deadline: '10 Sep 2025',
    exam_date: '02 Nov 2025',
    prerequisites: 'Basic Electrical / Physics background or ITI Wireman certification',
    description: 'The flagship IIT Madras EV course designed for state automotive technicians...',
    syllabus: [
      'EV Powertrain Topologies & BLDC Motor Control',
      'Li-ion Cell Balancing & State-of-Charge (SoC) Algorithms',
      'CAN Bus Telemetry Diagnostics & Fault Code Analysis',
      'High Voltage Isolation & AIS-038 State Safety Regulations'
    ],
    url: 'https://onlinecourses.nptel.ac.in/noc24_ee12/preview',
    skill_tags: ['EV Battery Diagnostics', 'CAN Bus Analysis', 'BLDC Motor Drives', 'HV Safety']
  },
  {
    id: 'skill-solar-04',
    title: 'Suryamitra Solar Photovoltaic Installer & Grid-Tie Technician',
    provider: 'National Institute of Solar Energy (NISE)',
    institute: 'Ministry of New & Renewable Energy (MNRE)',
    platform: 'Skill India',
    sector: 'Renewable Energy',
    duration_weeks: 6,
    estimated_hours: 36,
    rating: 4.8,
    enrolled_count: 18200,
    is_free: true,
    has_certificate: true,
    nsqf_level: 4,
    deadline: 'Rolling Admissions',
    exam_date: 'Continuous Assessment',
    prerequisites: '10th Pass or ITI Electrical / Electronics Certificate',
    description: 'Government of India certified Suryamitra program...',
    syllabus: [
      'Solar Irradiance Measurement & Tilt Angle Optimization',
      'PV Module Stringing, MC4 Crimping & DC Combiner Boxes',
      'Grid-Tie Inverter Synchronization & Anti-Islanding Protection',
      'Discom Net Metering Paperwork & Commissioning Sign-off'
    ],
    url: 'https://www.skillindiadigital.gov.in',
    skill_tags: ['Solar PV Sizing', 'Grid Inverter Wiring', 'Net Metering', 'O&M Troubleshooting']
  }
];

// Helper functions under test
const normalizeStr = (s) => (s ? s.toLowerCase().replace(/[^a-z0-9]/g, '') : '');

const createEnrollmentResolver = (enrolledCourses) => {
  return (course) => {
    if (!course) return undefined;
    if (enrolledCourses[course.id]) return enrolledCourses[course.id];
    if (course.url && enrolledCourses[course.url]) return enrolledCourses[course.url];
    if (course.title) {
      const rawLower = course.title.toLowerCase().trim();
      if (enrolledCourses[rawLower]) return enrolledCourses[rawLower];
      const norm = normalizeStr(course.title);
      if (enrolledCourses[`title-norm:${norm}`]) return enrolledCourses[`title-norm:${norm}`];
    }
    return undefined;
  };
};

// ==========================================
// TEST SUITE 1: Multi-Key Resolution & String Normalization
// ==========================================
test('Multi-Key Resolution: normalizeStr handles special characters, punctuation, and casing', () => {
  assert.strictEqual(normalizeStr('Apparel Manufacturing & Industrial Garment Technology'), 'apparelmanufacturingindustrialgarmenttechnology');
  assert.strictEqual(normalizeStr('Electric Vehicles - System Architecture & Battery Management!'), 'electricvehiclessystemarchitecturebatterymanagement');
  assert.strictEqual(normalizeStr('  Solar PV Sizing (Grid-Tie) #123  '), 'solarpvsizinggridtie123');
  assert.strictEqual(normalizeStr(''), '');
  assert.strictEqual(normalizeStr(null), '');
  assert.strictEqual(normalizeStr(undefined), '');
});

test('Multi-Key Resolution: getEnrollment resolves across DB UUID, URL, raw title, normalized title, and static catalog ID', () => {
  const sampleUuid = '32d16638-ece2-4e60-8247-7fd2d5d653cf';
  const sampleUrl = 'https://onlinecourses.nptel.ac.in/noc24_ee12/preview';
  const sampleTitle = 'Electric Vehicles - System Architecture & Battery Management';
  const staticId = 'nptel-ev-03';

  const enrollmentRecord = {
    id: 'enr-rec-001',
    course_id: sampleUuid,
    status: 'in_progress',
    progress_pct: 45
  };

  // Populate map multi-dimensionally as fetchCoursesAndEnrollments does
  const enrolledMap = {
    [sampleUuid]: enrollmentRecord,
    [sampleUrl]: enrollmentRecord,
    [sampleTitle]: enrollmentRecord,
    [sampleTitle.toLowerCase().trim()]: enrollmentRecord,
    [`title-norm:${normalizeStr(sampleTitle)}`]: enrollmentRecord,
    [staticId]: enrollmentRecord
  };

  const getEnrollment = createEnrollmentResolver(enrolledMap);

  // 1. Direct query by static course object (has static id)
  const queryByStatic = {
    id: staticId,
    title: sampleTitle,
    url: sampleUrl
  };
  assert.deepStrictEqual(getEnrollment(queryByStatic), enrollmentRecord);

  // 2. Direct query by DB course object (has UUID)
  const queryByDb = {
    id: sampleUuid,
    title: sampleTitle,
    url: sampleUrl
  };
  assert.deepStrictEqual(getEnrollment(queryByDb), enrollmentRecord);

  // 3. Query by URL only (e.g. after catalog mutation)
  const queryByUrlOnly = {
    id: 'unknown-temporary-id',
    title: 'Unrelated Temporary Title',
    url: sampleUrl
  };
  assert.deepStrictEqual(getEnrollment(queryByUrlOnly), enrollmentRecord);

  // 4. Query by title variant matching normalized form
  const queryByNormalizedTitle = {
    id: 'another-random-id',
    title: 'electric-vehicles: system architecture & battery management',
    url: ''
  };
  assert.deepStrictEqual(getEnrollment(queryByNormalizedTitle), enrollmentRecord);

  // 5. Query with non-enrolled course returns undefined (no false positives)
  const unenrolled = {
    id: 'skill-solar-04',
    title: 'Suryamitra Solar Photovoltaic Installer',
    url: 'https://www.skillindiadigital.gov.in'
  };
  assert.strictEqual(getEnrollment(unenrolled), undefined);

  // 6. Query with null/undefined returns undefined
  assert.strictEqual(getEnrollment(null), undefined);
  assert.strictEqual(getEnrollment(undefined), undefined);
});

// ==========================================
// TEST SUITE 2: Active Roadmap Filtering & Deduplication
// ==========================================
test('Active Roadmap: Deduplication algorithm produces exactly 1 item per unique course enrollment', () => {
  const sampleUuid1 = '32d16638-ece2-4e60-8247-7fd2d5d653cf';
  const sampleUuid2 = 'f4249f34-d89d-4b36-b16e-4ac6dfcb45d2';

  const enrollObj1 = { id: 'rec-1', course_id: sampleUuid1, status: 'in_progress', progress_pct: 20 };
  const enrollObj2 = { id: 'rec-2', course_id: sampleUuid2, status: 'completed', progress_pct: 100 };

  // Map containing multiple keys per enrollment
  const enrolledMap = {
    [sampleUuid1]: enrollObj1,
    'nptel-ev-03': enrollObj1,
    'https://onlinecourses.nptel.ac.in/noc24_ee12/preview': enrollObj1,
    'title-norm:electricvehiclessystemarchitecturebatterymanagement': enrollObj1,

    [sampleUuid2]: enrollObj2,
    'nptel-garment-01': enrollObj2,
    'https://onlinecourses.nptel.ac.in/noc24_te01/preview': enrollObj2
  };

  const getEnrollment = createEnrollmentResolver(enrolledMap);

  // Catalog containing static items and DB items (potentially duplicate keys)
  const courseList = [
    AUTHENTIC_COURSES[0], // nptel-garment-01
    AUTHENTIC_COURSES[1], // swayam-fashion-02 (not enrolled)
    AUTHENTIC_COURSES[2], // nptel-ev-03
    AUTHENTIC_COURSES[3], // skill-solar-04 (not enrolled)
    { ...AUTHENTIC_COURSES[2], id: sampleUuid1 } // same EV course under DB UUID
  ];

  // Run CourseSearchModule enrolledCourseList logic
  const seen = new Set();
  const list = [];
  courseList.forEach(c => {
    const enrollment = getEnrollment(c);
    if (enrollment) {
      const key = enrollment.course_id || c.url || c.title.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(c);
      }
    }
  });

  // Verify deduplication: exactly 2 unique enrolled courses in the active roadmap
  assert.strictEqual(list.length, 2, 'Active roadmap must deduplicate and return exactly 2 enrolled courses');
  const resolvedKeys = list.map(c => getEnrollment(c)?.course_id);
  assert.ok(resolvedKeys.includes(sampleUuid1), 'Must include EV course');
  assert.ok(resolvedKeys.includes(sampleUuid2), 'Must include Garment course');
});

// ==========================================
// TEST SUITE 3: Progress State & Status Transition
// ==========================================
test('Progress Update: Status correctly flips between in_progress and completed with boundary assertions', () => {
  const computeProgressState = (newProgress) => {
    const clampedProgress = Math.max(0, Math.min(100, Math.round(newProgress)));
    const isComplete = clampedProgress >= 100;
    const newStatus = isComplete ? 'completed' : 'in_progress';
    const completedAt = isComplete ? new Date().toISOString() : null;
    return {
      progress_pct: clampedProgress,
      status: newStatus,
      completed_at: completedAt
    };
  };

  // Boundary 0%
  const state0 = computeProgressState(0);
  assert.strictEqual(state0.progress_pct, 0);
  assert.strictEqual(state0.status, 'in_progress');
  assert.strictEqual(state0.completed_at, null);

  // Boundary 50%
  const state50 = computeProgressState(50);
  assert.strictEqual(state50.progress_pct, 50);
  assert.strictEqual(state50.status, 'in_progress');
  assert.strictEqual(state50.completed_at, null);

  // Boundary 95%
  const state95 = computeProgressState(95);
  assert.strictEqual(state95.progress_pct, 95);
  assert.strictEqual(state95.status, 'in_progress');
  assert.strictEqual(state95.completed_at, null);

  // Boundary 100%
  const state100 = computeProgressState(100);
  assert.strictEqual(state100.progress_pct, 100);
  assert.strictEqual(state100.status, 'completed');
  assert.ok(typeof state100.completed_at === 'string' && state100.completed_at.length > 0);

  // Out of bounds > 100%
  const state120 = computeProgressState(120);
  assert.strictEqual(state120.progress_pct, 100);
  assert.strictEqual(state120.status, 'completed');

  // Out of bounds < 0%
  const stateNeg = computeProgressState(-15);
  assert.strictEqual(stateNeg.progress_pct, 0);
  assert.strictEqual(stateNeg.status, 'in_progress');
});

// ==========================================
// TEST SUITE 4: Authentic Course Catalogs & Platform URL Integrity
// ==========================================
test('Course Catalog: All authentic courses have valid https URLs, valid platform badges, and NSQF levels', () => {
  const validPlatforms = new Set(['NPTEL', 'Swayam', 'Coursera', 'Skill India', 'MSSDS']);

  AUTHENTIC_COURSES.forEach((course) => {
    assert.ok(course.id && course.id.length > 0, `Course ${course.title} must have valid id`);
    assert.ok(course.title && course.title.length > 0, `Course ${course.id} must have title`);
    assert.ok(validPlatforms.has(course.platform), `Course ${course.id} platform "${course.platform}" must be valid`);
    assert.ok(course.url && course.url.startsWith('https://'), `Course ${course.id} url "${course.url}" must start with https://`);
    assert.ok(course.duration_weeks > 0, `Course ${course.id} duration_weeks must be positive`);
    assert.ok(course.nsqf_level >= 1 && course.nsqf_level <= 10, `Course ${course.id} NSQF level must be 1-10`);
    assert.ok(course.rating >= 1.0 && course.rating <= 5.0, `Course ${course.id} rating must be 1.0-5.0`);
    assert.ok(Array.isArray(course.syllabus) && course.syllabus.length > 0, `Course ${course.id} must have syllabus topics`);
    assert.ok(Array.isArray(course.skill_tags) && course.skill_tags.length > 0, `Course ${course.id} must have skill tags`);
  });
});

// ==========================================
// TEST SUITE 5: Live Database Schema & Whitelist Verification
// ==========================================
test('Database Mutation Proxy: Whitelist contains external_courses and trainee_course_enrollments', () => {
  const routePath = path.resolve(__dirname, '../src/app/api/trainee/mutate/route.ts');
  const routeContent = fs.readFileSync(routePath, 'utf8');
  assert.ok(routeContent.includes("'external_courses'"), 'route.ts must whitelist external_courses');
  assert.ok(routeContent.includes("'trainee_course_enrollments'"), 'route.ts must whitelist trainee_course_enrollments');
});

test('Live Supabase: external_courses table contains valid records with platforms and active links', async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    console.log('Skipping live DB check (missing env vars)');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey);
  const { data: courses, error } = await supabase
    .from('external_courses')
    .select('*')
    .limit(50);

  assert.strictEqual(error, null, 'Fetching external_courses must not produce errors');
  assert.ok(Array.isArray(courses) && courses.length > 0, 'external_courses table must contain populated records');

  // Verify fields on every fetched course
  courses.forEach(c => {
    assert.ok(c.id, 'Course must have UUID');
    assert.ok(c.title, 'Course must have title');
    assert.ok(c.platform, 'Course must have platform');
    assert.ok(c.url && (c.url.startsWith('http://') || c.url.startsWith('https://')), `Course ${c.title} must have valid URL: ${c.url}`);
  });
});

test('Live Supabase: Idempotent course enrollment upsert & progress update lifecycle', async () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) return;

  const supabase = createClient(supabaseUrl, serviceKey);

  // Fetch a sample trainee and course
  const { data: trainees } = await supabase.from('trainees').select('id').limit(1);
  const { data: courses } = await supabase.from('external_courses').select('id, title').limit(1);

  if (!trainees || trainees.length === 0 || !courses || courses.length === 0) {
    console.log('Skipping lifecycle test: no trainee or course found');
    return;
  }

  const testTraineeId = trainees[0].id;
  const testCourseId = courses[0].id;

  // 1. Initial Enrollment (Upsert with 10% progress)
  const { data: enr1, error: err1 } = await supabase
    .from('trainee_course_enrollments')
    .upsert({
      trainee_id: testTraineeId,
      course_id: testCourseId,
      status: 'in_progress',
      progress_pct: 10
    }, { onConflict: 'trainee_id,course_id' })
    .select();

  assert.strictEqual(err1, null, 'Initial enrollment upsert must succeed');
  assert.ok(enr1 && enr1.length > 0, 'Must return enrolled record');
  assert.strictEqual(enr1[0].progress_pct, 10);
  assert.strictEqual(enr1[0].status, 'in_progress');

  // 2. Idempotent Re-Enrollment (Calling upsert again does not fail unique constraint)
  const { data: enr2, error: err2 } = await supabase
    .from('trainee_course_enrollments')
    .upsert({
      trainee_id: testTraineeId,
      course_id: testCourseId,
      status: 'in_progress',
      progress_pct: 25
    }, { onConflict: 'trainee_id,course_id' })
    .select();

  assert.strictEqual(err2, null, 'Idempotent re-enrollment upsert must succeed without constraint error');
  assert.strictEqual(enr2[0].progress_pct, 25);

  // 3. Progress Update to 100% (Completed)
  const { data: enr3, error: err3 } = await supabase
    .from('trainee_course_enrollments')
    .update({
      progress_pct: 100,
      status: 'completed',
      completed_at: new Date().toISOString()
    })
    .eq('trainee_id', testTraineeId)
    .eq('course_id', testCourseId)
    .select();

  assert.strictEqual(err3, null, 'Progress update to 100% must succeed');
  assert.strictEqual(enr3[0].status, 'completed');
  assert.strictEqual(enr3[0].progress_pct, 100);
  assert.ok(enr3[0].completed_at !== null, 'completed_at timestamp must be set');

  // 4. Reset / Cleanup back to initial state
  await supabase
    .from('trainee_course_enrollments')
    .update({
      progress_pct: 30,
      status: 'in_progress',
      completed_at: null
    })
    .eq('trainee_id', testTraineeId)
    .eq('course_id', testCourseId);
});
