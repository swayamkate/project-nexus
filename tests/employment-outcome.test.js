const test = require('node:test');
const assert = require('node:assert');

// Test Suite: Employment & Career Outcome Data Sanitization
test('Employment sanitization converts empty string dates to null or undefined', () => {
  const sanitizeEmploymentDates = (data) => ({
    ...data,
    joining_date: data.joining_date?.trim() ? data.joining_date.trim() : null,
    establishment_date: data.establishment_date?.trim() ? data.establishment_date.trim() : null,
  });

  const rawPayload = {
    status: 'employed',
    company_name: 'Tata Motors',
    joining_date: '',
    establishment_date: '   ',
  };

  const sanitized = sanitizeEmploymentDates(rawPayload);
  assert.strictEqual(sanitized.joining_date, null);
  assert.strictEqual(sanitized.establishment_date, null);

  const populatedPayload = {
    status: 'employed',
    company_name: 'Tata Motors',
    joining_date: '2026-01-15',
    establishment_date: '2025-06-01',
  };

  const sanitizedPopulated = sanitizeEmploymentDates(populatedPayload);
  assert.strictEqual(sanitizedPopulated.joining_date, '2026-01-15');
  assert.strictEqual(sanitizedPopulated.establishment_date, '2025-06-01');
});

test('Employment sanitization parses numeric fields safely without NaN', () => {
  const sanitizeNumeric = (val) => (isNaN(Number(val)) ? 0 : Number(val));

  assert.strictEqual(sanitizeNumeric('25000'), 25000);
  assert.strictEqual(sanitizeNumeric(30000), 30000);
  assert.strictEqual(sanitizeNumeric(''), 0);
  assert.strictEqual(sanitizeNumeric(null), 0);
  assert.strictEqual(sanitizeNumeric(undefined), 0);
  assert.strictEqual(sanitizeNumeric('not-a-number'), 0);
});

test('Employment status categorization identifies wage, self-employed, and seeking statuses', () => {
  const categorizeStatus = (status) => {
    const isEmployed = ['employed', 'wage_employed', 'apprenticeship'].includes(status || '');
    const isSelfEmployed = status === 'self_employed';
    const isSeeking = !isEmployed && !isSelfEmployed;
    return { isEmployed, isSelfEmployed, isSeeking };
  };

  assert.deepStrictEqual(categorizeStatus('employed'), { isEmployed: true, isSelfEmployed: false, isSeeking: false });
  assert.deepStrictEqual(categorizeStatus('wage_employed'), { isEmployed: true, isSelfEmployed: false, isSeeking: false });
  assert.deepStrictEqual(categorizeStatus('apprenticeship'), { isEmployed: true, isSelfEmployed: false, isSeeking: false });
  assert.deepStrictEqual(categorizeStatus('self_employed'), { isEmployed: false, isSelfEmployed: true, isSeeking: false });
  assert.deepStrictEqual(categorizeStatus('not_employed'), { isEmployed: false, isSelfEmployed: false, isSeeking: true });
  assert.deepStrictEqual(categorizeStatus('unemployed'), { isEmployed: false, isSelfEmployed: false, isSeeking: true });
  assert.deepStrictEqual(categorizeStatus('job_seeking'), { isEmployed: false, isSelfEmployed: false, isSeeking: true });
  assert.deepStrictEqual(categorizeStatus(null), { isEmployed: false, isSelfEmployed: false, isSeeking: true });
  assert.deepStrictEqual(categorizeStatus(undefined), { isEmployed: false, isSelfEmployed: false, isSeeking: true });
});
