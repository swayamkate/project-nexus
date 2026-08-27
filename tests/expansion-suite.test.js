const { test, describe } = require('node:test');
const assert = require('node:assert');
const { createClient } = require('@supabase/supabase-js');

// Master Role Competency Database (NSQF Aligned)
const ROLE_BENCHMARKS = {
  'Senior Apparel Quality Specialist & Boutique Entrepreneur': {
    sector: 'Apparel & Fashion',
    baselineSalary: 12000,
    targetSalary: 35000,
    requiredSkills: [
      'Industrial Stitching',
      'Pattern Making',
      'AQL 2.5 Quality Inspection',
      'Garment CAD Grading',
      'Fabric Defect Identification',
      'Udyam & GST Invoicing'
    ],
    certifications: ['MSSDS Master Apparel Quality Certificate', 'NSQF Level 5 Apparel']
  },
  'Solar PV Rooftop Installation & Inverter Lead': {
    sector: 'Renewable Energy',
    baselineSalary: 14000,
    targetSalary: 38000,
    requiredSkills: [
      'Solar PV Installation',
      'Inverter Wiring',
      'Megger Insulation Testing',
      'Earthing & Lightning Protection',
      'Grid Net Metering Integration',
      'OSHA Safety Protocols'
    ],
    certifications: ['Surya Mitra Certified Solar PV Technician', 'NSQF Level 4 Solar']
  },
  'Electric Vehicle (EV) Diagnostic & Battery Lead': {
    sector: 'Automotive & EV',
    baselineSalary: 15000,
    targetSalary: 42000,
    requiredSkills: [
      'EV Powertrain Diagnostics',
      'High Voltage Safety (1000V PPE)',
      'Battery Management System (BMS)',
      'CAN Bus Telemetry',
      'Thermal Runaway Prevention',
      'OBD-II Scanning'
    ],
    certifications: ['Automotive Sector Skill Council EV Lead', 'NSQF Level 6 EV']
  },
  'Full-Stack Web & Cloud Developer': {
    sector: 'IT & Digital',
    baselineSalary: 18000,
    targetSalary: 55000,
    requiredSkills: [
      'TypeScript',
      'Next.js & React',
      'PostgreSQL & Row Level Security',
      'REST & GraphQL APIs',
      'Git & CI/CD Deployment',
      'Cloud Architecture'
    ],
    certifications: ['Meta Full-Stack Professional', 'AWS Cloud Practitioner']
  }
};

function diagnoseSkillGap(currentSkills = [], targetRole, targetSalary = 30000) {
  const cleanCurrent = (currentSkills || []).map(s => s.trim().toLowerCase());
  const benchmark = ROLE_BENCHMARKS[targetRole] || {
    sector: 'Vocational & Technical',
    baselineSalary: 12000,
    targetSalary: Math.max(targetSalary, 25000),
    requiredSkills: ['Core Domain Technology', 'Quality Standards', 'Safety Protocols'],
    certifications: ['NSQF Certified']
  };

  const matchedSkills = [];
  const missingSkills = [];
  const competencyScores = [];

  benchmark.requiredSkills.forEach(reqSkill => {
    const isMatched = cleanCurrent.some(cs => {
      if (cs.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cs)) return true;
      const words = cs.split(/\s+/).filter(w => w.length > 3);
      return words.some(w => reqSkill.toLowerCase().includes(w));
    });

    if (isMatched) {
      matchedSkills.push(reqSkill);
      competencyScores.push({ skill: reqSkill, current: 85, required: 90, gap: 5 });
    } else {
      missingSkills.push(reqSkill);
      competencyScores.push({ skill: reqSkill, current: 20, required: 85, gap: 65 });
    }
  });

  const totalRequired = benchmark.requiredSkills.length;
  const matchRatio = totalRequired > 0 ? matchedSkills.length / totalRequired : 0.5;
  const readinessScore = Math.min(100, Math.round(matchRatio * 80 + 15));
  const gapPercentage = 100 - readinessScore;
  const baseline = benchmark.baselineSalary;
  const target = Math.max(targetSalary, benchmark.targetSalary);
  const wageMultiplier = Number((target / baseline).toFixed(2));

  const priorityActions = missingSkills.slice(0, 3).map(skill => 
    `Master "${skill}" via accredited NPTEL/Swayam technical coursework & interactive assessment.`
  );

  const aiDiagnosticSummary = `Baseline readiness at ${readinessScore}%. Target salary: ₹${target.toLocaleString('en-IN')}/month.`;

  return {
    targetRole,
    matchedSkills,
    missingSkills,
    competencyScores,
    gapPercentage,
    readinessScore,
    wageMultiplier,
    projectedSalary: target,
    aiDiagnosticSummary,
    priorityActions
  };
}

function generateDynamicRoadmap(targetRole, targetDays = 90, currentSkills = []) {
  const diagnosis = diagnoseSkillGap(currentSkills, targetRole);
  const missing = diagnosis.missingSkills;
  const dayStep1 = Math.max(1, Math.round(targetDays * 0.25));
  const dayStep2 = Math.max(dayStep1 + 1, Math.round(targetDays * 0.55));
  const dayStep3 = Math.max(dayStep2 + 1, Math.round(targetDays * 0.80));

  return [
    {
      phase_number: 1,
      phase_title: 'Foundations & Baseline Competency',
      day_range: `Day 1 - Day ${dayStep1}`,
      objective: `Master fundamental core standards in ${targetRole}`,
      tasks: [
        { id: 'p1_1', task: 'Complete accredited baseline theory modules', completed: true, skill_tag: missing[0] || 'Theory' },
        { id: 'p1_2', task: 'Review NSQF regulatory standards and SOPs', completed: false, skill_tag: 'Compliance' }
      ]
    },
    {
      phase_number: 2,
      phase_title: 'Practical Specialization & Core Skill Gaps',
      day_range: `Day ${dayStep1 + 1} - Day ${dayStep2}`,
      objective: 'Address primary skill deficits through lab practice',
      tasks: [
        { id: 'p2_1', task: `Execute hands-on laboratory exercises for ${missing[0] || 'Core Skill'}`, completed: false, skill_tag: missing[0] || 'Practice' },
        { id: 'p2_2', task: 'Submit practical coursework for instructor review', completed: false, skill_tag: 'Assessment' }
      ]
    },
    {
      phase_number: 3,
      phase_title: 'Skill Assessment & Certification Readiness',
      day_range: `Day ${dayStep2 + 1} - Day ${dayStep3}`,
      objective: 'Validate trade competencies through state assessments',
      tasks: [
        { id: 'p3_1', task: 'Take interactive Trade Skill Quiz & benchmark score >= 70%', completed: false, skill_tag: 'Assessment' },
        { id: 'p3_2', task: 'Obtain NSQF-aligned badge and digital verification proof', completed: false, skill_tag: 'Certification' }
      ]
    },
    {
      phase_number: 4,
      phase_title: 'Mock Interview & Placement Acceleration',
      day_range: `Day ${dayStep3 + 1} - Day ${targetDays}`,
      objective: 'Complete employer interview prep and wage progression',
      tasks: [
        { id: 'p4_1', task: 'Practice industry mock interview questions with instant evaluation', completed: false, skill_tag: 'Interview Prep' },
        { id: 'p4_2', task: 'Submit verified credential to Maharashtra employer network', completed: false, skill_tag: 'Placement' }
      ]
    }
  ];
}

function evaluateMockInterviewAnswer(targetRole, question, answer, keyPoints = []) {
  if (!answer || answer.trim().length < 15) {
    return {
      score: 30,
      verdict: 'Needs Work',
      strongPoints: [],
      missingPoints: keyPoints,
      actionableFeedback: 'Answer is too brief. Elaborate on specific technical procedures and standards.',
      modelAnswer: 'Provide a structured, technical response.'
    };
  }

  const cleanAnswer = answer.toLowerCase();
  const strongPoints = [];
  const missingPoints = [];

  keyPoints.forEach(kp => {
    const kpWords = kp.toLowerCase().split(/\s+/).filter(w => w.length > 3);
    const hasMatch = kpWords.some(w => cleanAnswer.includes(w));
    if (hasMatch) {
      strongPoints.push(kp);
    } else {
      missingPoints.push(kp);
    }
  });

  const pointsRatio = keyPoints.length > 0 ? strongPoints.length / keyPoints.length : 0.7;
  const score = Math.min(100, Math.round(pointsRatio * 60 + (answer.length > 100 ? 35 : 20)));
  const verdict = score >= 85 ? 'Mastery' : score >= 70 ? 'Strong' : score >= 50 ? 'Satisfactory' : 'Needs Work';

  return {
    score,
    verdict,
    strongPoints,
    missingPoints,
    actionableFeedback: strongPoints.length >= keyPoints.length ? 'Outstanding technical accuracy!' : 'Good foundation. Include more specific standards.',
    modelAnswer: `A comprehensive answer includes: ${keyPoints.join(', ')}.`
  };
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://api.avishkark.in';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzI0NjgwMDAwLCJleHAiOjIwMzk5OTk5OTl9.uqQrYqxJACG1bl52DQ54opgfhDQwm4ZwJ-l3kuUOl7E';

describe('AI Career Engine & Diagnostic Logic', () => {

  test('ROLE_BENCHMARKS contains required trade benchmarks', () => {
    const roles = Object.keys(ROLE_BENCHMARKS);
    assert.ok(roles.length >= 4, 'Should have at least 4 role benchmarks');
    assert.ok(roles.includes('Senior Apparel Quality Specialist & Boutique Entrepreneur'));
    assert.ok(roles.includes('Solar PV Rooftop Installation & Inverter Lead'));
    assert.ok(roles.includes('Electric Vehicle (EV) Diagnostic & Battery Lead'));
    assert.ok(roles.includes('Full-Stack Web & Cloud Developer'));
  });

  test('diagnoseSkillGap accurately computes readiness score & missing skills', () => {
    const userSkills = ['Fabric Inspection', 'Pattern Making'];
    const targetRole = 'Senior Apparel Quality Specialist & Boutique Entrepreneur';
    const targetSalary = 40000;

    const result = diagnoseSkillGap(userSkills, targetRole, targetSalary);

    assert.ok(result.readinessScore >= 0 && result.readinessScore <= 100);
    assert.ok(result.matchedSkills.length >= 1, 'Should match skills');
    assert.ok(result.missingSkills.length > 0, 'Should have missing skills');
    assert.ok(result.wageMultiplier >= 1.0);
    assert.ok(typeof result.aiDiagnosticSummary === 'string');
    assert.ok(result.priorityActions.length > 0);
  });

  test('generateDynamicRoadmap generates 4 distinct phases for arbitrary N days', () => {
    [30, 60, 90, 180, 365].forEach((days) => {
      const roadmap = generateDynamicRoadmap('Solar PV Rooftop Installation & Inverter Lead', days, ['Wiring']);
      assert.strictEqual(roadmap.length, 4, `Roadmap for ${days} days should have 4 phases`);
      
      roadmap.forEach((phase) => {
        assert.ok(phase.phase_title);
        assert.ok(phase.day_range);
        assert.ok(phase.tasks.length >= 2);
        phase.tasks.forEach(t => {
          assert.ok(t.id);
          assert.ok(t.task);
          assert.ok(t.skill_tag);
        });
      });
    });
  });

  test('evaluateMockInterviewAnswer calculates concept score and feedback', () => {
    const role = 'Senior Apparel Quality Specialist & Boutique Entrepreneur';
    const question = 'What standard inspection methodology do you follow?';
    const keyPoints = ['AQL 2.5 defect threshold', 'Critical vs Major defect', '12 SPI'];
    
    // Good answer
    const answer = 'We inspect lots using AQL 2.5 defect thresholds, checking for critical and major defects, measuring 12 SPI stitching tolerances.';
    const goodEval = evaluateMockInterviewAnswer(role, question, answer, keyPoints);
    assert.ok(goodEval.score >= 70, `Good answer should score >= 70, got ${goodEval.score}`);
    assert.ok(goodEval.strongPoints.length >= 2);
    assert.ok(['Mastery', 'Strong'].includes(goodEval.verdict), `Verdict should be Mastery or Strong, got ${goodEval.verdict}`);

    // Sparse answer
    const sparseAnswer = 'I just look at the cloth and check it.';
    const sparseEval = evaluateMockInterviewAnswer(role, question, sparseAnswer, keyPoints);
    assert.ok(sparseEval.score < 50, `Sparse answer should score < 50, got ${sparseEval.score}`);
    assert.ok(sparseEval.missingPoints.length >= 2);
  });

});

describe('Live PostgreSQL Schema & Suite Verification', () => {
  const supabase = createClient(SUPABASE_URL, ANON_KEY);

  test('external_courses table contains accredited NPTEL, Coursera & Swayam courses', async () => {
    const { data, error } = await supabase
      .from('external_courses')
      .select('*');

    assert.ifError(error);
    assert.ok(data.length >= 6, `Expected at least 6 courses, found ${data.length}`);
    const platforms = new Set(data.map(c => c.platform));
    assert.ok(platforms.has('NPTEL'), 'Should have NPTEL courses');
    assert.ok(platforms.has('Coursera'), 'Should have Coursera courses');
    assert.ok(platforms.has('Swayam'), 'Should have Swayam courses');
  });

  test('skill_assessments table contains trade tests with questions and badges', async () => {
    const { data, error } = await supabase
      .from('skill_assessments')
      .select('*');

    assert.ifError(error);
    assert.ok(data.length >= 3, `Expected at least 3 trade assessments, found ${data.length}`);
    data.forEach(a => {
      assert.ok(a.title);
      assert.ok(a.badge_name);
      assert.ok(Array.isArray(a.questions_json) && a.questions_json.length > 0);
    });
  });

  test('interview_questions table contains industry questions with upvotes', async () => {
    const { data, error } = await supabase
      .from('interview_questions')
      .select('*')
      .eq('is_approved', true);

    assert.ifError(error);
    assert.ok(data.length >= 5, `Expected at least 5 approved interview questions, found ${data.length}`);
    const companies = data.map(q => q.company_name);
    assert.ok(companies.some(c => c.includes('Tata Motors') || c.includes('Raymond') || c.includes('Infosys')));
  });

  test('Zero-Trust RLS protects private trainee career goals from anon writes', async () => {
    const { error } = await supabase
      .from('trainee_career_goals')
      .insert({
        trainee_id: '00000000-0000-0000-0000-000000000000',
        target_role: 'Hacked Role',
        target_days: 10
      });

    assert.ok(error, 'Anonymous insertion into trainee_career_goals MUST be blocked by RLS');
  });

  test('Zero-Trust RLS protects assessment submissions from unauthorized writes', async () => {
    const { error } = await supabase
      .from('assessment_submissions')
      .insert({
        trainee_id: '00000000-0000-0000-0000-000000000000',
        assessment_id: '00000000-0000-0000-0000-000000000000',
        score_pct: 100,
        passed: true
      });

    assert.ok(error, 'Anonymous insertion into assessment_submissions MUST be blocked by RLS');
  });

});
