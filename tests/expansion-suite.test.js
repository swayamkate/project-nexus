import { test, describe } from 'node:test';
import assert from 'node:assert';
import { createClient } from '@supabase/supabase-js';
import { 
  diagnoseSkillGap, 
  generateDynamicRoadmap, 
  evaluateMockInterviewAnswer, 
  ROLE_BENCHMARKS 
} from '../src/lib/aiCareerEngine.ts';

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
    assert.ok(result.matchedSkills.length >= 2, 'Should match Fabric Inspection and Pattern Making');
    assert.ok(result.missingSkills.length > 0, 'Should have missing skills like CAD Grading');
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
