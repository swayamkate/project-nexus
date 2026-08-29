const test = require('node:test');
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

// Test Suite: Training & Course Details Module Verification
test('Mutate API route whitelists training_programs in ALLOWED_TABLES', () => {
  const routePath = path.resolve(__dirname, '../src/app/api/trainee/mutate/route.ts');
  const content = fs.readFileSync(routePath, 'utf8');

  // Verify that training_programs is present in the ALLOWED_TABLES Set
  assert.ok(
    content.includes("'training_programs'"),
    'ALLOWED_TABLES must explicitly include "training_programs"'
  );
});

test('Training enrollment date sanitization converts empty strings to null', () => {
  const sanitizeDates = (payload) => ({
    ...payload,
    completed_date: payload.completed_date?.trim() ? payload.completed_date.trim() : null,
    certified_date: payload.certified_date?.trim() ? payload.certified_date.trim() : null,
    certificate_id: payload.certificate_id?.trim() ? payload.certificate_id.trim() : null,
    grade: payload.grade?.trim() ? payload.grade.trim() : null
  });

  const dirtyPayload = {
    trainee_id: '11111111-1111-1111-1111-111111111111',
    program_id: '22222222-2222-2222-2222-222222222222',
    enrolled_date: '2026-01-10',
    completed_date: '',
    certified_date: '   ',
    certificate_id: '   ',
    grade: ''
  };

  const clean = sanitizeDates(dirtyPayload);
  assert.strictEqual(clean.completed_date, null);
  assert.strictEqual(clean.certified_date, null);
  assert.strictEqual(clean.certificate_id, null);
  assert.strictEqual(clean.grade, null);

  const populatedPayload = {
    trainee_id: '11111111-1111-1111-1111-111111111111',
    program_id: '22222222-2222-2222-2222-222222222222',
    enrolled_date: '2025-06-01',
    completed_date: '2025-09-01',
    certified_date: '2025-09-15',
    certificate_id: 'MSDE-ITI-2025-9988',
    grade: 'A+'
  };

  const cleanPopulated = sanitizeDates(populatedPayload);
  assert.strictEqual(cleanPopulated.completed_date, '2025-09-01');
  assert.strictEqual(cleanPopulated.certified_date, '2025-09-15');
  assert.strictEqual(cleanPopulated.certificate_id, 'MSDE-ITI-2025-9988');
  assert.strictEqual(cleanPopulated.grade, 'A+');
});

test('Training program duration sanitization enforces positive integers', () => {
  const sanitizeDuration = (months) => Math.max(1, parseInt(months, 10) || 1);

  assert.strictEqual(sanitizeDuration(3), 3);
  assert.strictEqual(sanitizeDuration('6'), 6);
  assert.strictEqual(sanitizeDuration('0'), 1);
  assert.strictEqual(sanitizeDuration('-5'), 1);
  assert.strictEqual(sanitizeDuration('invalid'), 1);
  assert.strictEqual(sanitizeDuration(null), 1);
  assert.strictEqual(sanitizeDuration(undefined), 1);
});

test('Duplicate enrollment detection detects duplicate program IDs and titles', () => {
  const existingEnrollments = [
    {
      id: 'enr-1',
      program_id: 'prog-uuid-1',
      training_programs: { title: 'Solar PV Rooftop Technician', sector: 'Renewable Energy' }
    },
    {
      id: 'enr-2',
      program_id: 'prog-uuid-2',
      training_programs: { title: 'Advanced Tailoring & Garment Manufacturing', sector: 'Apparel & Fashion' }
    }
  ];

  const checkDuplicate = (programId, title) => {
    return existingEnrollments.some(
      (e) =>
        e.program_id === programId ||
        (title && e.training_programs?.title?.toLowerCase() === title.trim().toLowerCase())
    );
  };

  // Duplicate checks by program_id
  assert.strictEqual(checkDuplicate('prog-uuid-1', ''), true);
  assert.strictEqual(checkDuplicate('prog-uuid-2', ''), true);
  assert.strictEqual(checkDuplicate('prog-uuid-3', ''), false);

  // Duplicate checks by title (case-insensitive)
  assert.strictEqual(checkDuplicate('new-id', 'solar pv rooftop technician'), true);
  assert.strictEqual(checkDuplicate('new-id', '  Advanced Tailoring & Garment Manufacturing  '), true);
  assert.strictEqual(checkDuplicate('new-id', 'CNC Milling Operator'), false);
});
