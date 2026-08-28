const test = require('node:test');
const assert = require('node:assert');
const { z } = require('zod');

// Test Suite: Schema Validations
test('TraineeProfileSchema validates correct payload', () => {
  const TraineeProfileSchema = z.object({
    full_name: z.string().min(2).max(100),
    email: z.string().email(),
    district: z.string().min(2),
    profile_completion_pct: z.number().int().min(0).max(100).default(85)
  });

  const validData = {
    full_name: 'Avishkar Kedar',
    email: 'avishkar.kedar@mahaskill.in',
    district: 'Pune',
    profile_completion_pct: 85
  };

  const res = TraineeProfileSchema.safeParse(validData);
  assert.strictEqual(res.success, true);
});

test('TraineeProfileSchema rejects invalid email', () => {
  const TraineeProfileSchema = z.object({
    email: z.string().email('Invalid email')
  });

  const res = TraineeProfileSchema.safeParse({ email: 'not-an-email' });
  assert.strictEqual(res.success, false);
});

test('MilestoneSurveySchema validates correct milestone survey', () => {
  const MilestoneSurveySchema = z.object({
    milestone: z.enum(['3M', '6M', '12M', '18M', '24M']),
    current_status: z.string().min(1),
    job_satisfaction_score: z.number().int().min(1).max(5)
  });

  const valid = {
    milestone: '6M',
    current_status: 'Self-Employed / Tailoring Studio',
    job_satisfaction_score: 5
  };

  const res = MilestoneSurveySchema.safeParse(valid);
  assert.strictEqual(res.success, true);
});

test('MilestoneSurveySchema rejects invalid score', () => {
  const MilestoneSurveySchema = z.object({
    job_satisfaction_score: z.number().int().min(1).max(5)
  });

  const res = MilestoneSurveySchema.safeParse({ job_satisfaction_score: 10 });
  assert.strictEqual(res.success, false);
});

test('Udyam MSME Registration format check', () => {
  const UdyamSchema = z.string().regex(/^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/);
  
  assert.strictEqual(UdyamSchema.safeParse('UDYAM-MH-26-0048291').success, true);
  assert.strictEqual(UdyamSchema.safeParse('INVALID-MSME-123').success, false);
});
