const test = require('node:test');
const assert = require('node:assert');

// Test Suite: Enterprise Validators & Calculators

// 1. Udyam MSME Validator
function validateUdyam(udyam) {
  if (!udyam) return { valid: false, error: 'Udyam number is required.' };
  const clean = udyam.trim().toUpperCase();
  const regex = /^UDYAM-[A-Z]{2}-\d{2}-\d{7}$/;
  if (!regex.test(clean)) {
    return { valid: false, error: 'Invalid format' };
  }
  return { valid: true, formatted: clean };
}

// 2. GSTIN Validator
function validateGSTIN(gstin) {
  if (!gstin) return { valid: false, error: 'GSTIN is required.' };
  const clean = gstin.trim().toUpperCase();
  const regex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!regex.test(clean)) {
    return { valid: false, error: 'Invalid GSTIN structure' };
  }
  return { valid: true, stateCode: clean.substring(0, 2), pan: clean.substring(2, 12) };
}

// 3. PAN Validator
function validatePAN(pan) {
  if (!pan) return { valid: false, error: 'PAN is required.' };
  const clean = pan.trim().toUpperCase();
  const regex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  if (!regex.test(clean)) {
    return { valid: false, error: 'Invalid PAN' };
  }
  return { valid: true };
}

// 4. IFSC Validator
function validateIFSC(ifsc) {
  if (!ifsc) return { valid: false, error: 'IFSC is required.' };
  const clean = ifsc.trim().toUpperCase();
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  if (!regex.test(clean)) {
    return { valid: false, error: 'Invalid IFSC' };
  }
  return { valid: true, bankCode: clean.substring(0, 4) };
}

// 5. WGM Calculator
function calculateWGM(baselineWage, currentWage) {
  const base = Math.max(baselineWage || 0, 1000);
  const current = Math.max(currentWage || 0, 0);
  const multiplier = Number((current / base).toFixed(2));
  const pctIncrease = Math.round(((current - base) / base) * 100);

  let status = 'Stagnant';
  if (multiplier >= 2.5) status = 'Transformational';
  else if (multiplier >= 1.75) status = 'High Multiplier';
  else if (multiplier >= 1.2) status = 'Moderate Growth';

  return { multiplier, pctIncrease, status };
}

test('validateUdyam accepts valid Maharashtra MSME registration numbers', () => {
  const res = validateUdyam('UDYAM-MH-12-0034567');
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.formatted, 'UDYAM-MH-12-0034567');
});

test('validateUdyam rejects invalid MSME strings', () => {
  const res = validateUdyam('UDYAM-1234');
  assert.strictEqual(res.valid, false);
});

test('validateGSTIN parses state code and PAN correctly', () => {
  const res = validateGSTIN('27AAAPL1234F1Z5');
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.stateCode, '27');
  assert.strictEqual(res.pan, 'AAAPL1234F');
});

test('validatePAN verifies valid 10-char Indian tax identifier', () => {
  assert.strictEqual(validatePAN('ABCDE1234F').valid, true);
  assert.strictEqual(validatePAN('invalid-pan').valid, false);
});

test('validateIFSC validates bank routing code', () => {
  assert.strictEqual(validateIFSC('SBIN0001234').valid, true);
  assert.strictEqual(validateIFSC('MAHB0000456').bankCode, 'MAHB');
  assert.strictEqual(validateIFSC('12345').valid, false);
});

test('calculateWGM computes correct multiplier and wage lift status', () => {
  const baseWage = 8000;
  const currentWage = 22000;
  const res = calculateWGM(baseWage, currentWage);

  assert.strictEqual(res.multiplier, 2.75);
  assert.strictEqual(res.pctIncrease, 175);
  assert.strictEqual(res.status, 'Transformational');
});

// 6. APAAR / ABC Validator
function validateApaar(apaar) {
  if (!apaar) return { valid: false, error: 'APAAR ID is required.' };
  const clean = apaar.trim().toUpperCase();
  const regex = /^(APAAR-\d{4}-\d{4}-\d{4}|\d{12})$/;
  if (!regex.test(clean)) {
    return { valid: false, error: 'Invalid format' };
  }
  return { valid: true };
}

// 7. Phone Validator
function validatePhone(phone) {
  if (!phone) return { valid: false, error: 'Phone number is required.' };
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.length === 10) {
    return { valid: true, formatted: `+91 ${clean}` };
  } else if (clean.length === 12 && clean.startsWith('91')) {
    return { valid: true, formatted: `+91 ${clean.substring(2)}` };
  }
  return { valid: false, error: 'Invalid phone' };
}

// 8. Sanitizer
function sanitizeInput(input) {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

test('validateApaar accepts valid 12-digit and formatted APAAR IDs', () => {
  assert.strictEqual(validateApaar('APAAR-2026-9842-1049').valid, true);
  assert.strictEqual(validateApaar('123456789012').valid, true);
  assert.strictEqual(validateApaar('invalid-apaar').valid, false);
});

test('validatePhone accepts valid 10-digit Indian mobile numbers', () => {
  assert.strictEqual(validatePhone('9820011223').valid, true);
  assert.strictEqual(validatePhone('+91 9820011223').valid, true);
  assert.strictEqual(validatePhone('12345').valid, false);
});

test('sanitizeInput converts XSS payload characters to HTML entities', () => {
  const dirty = '<script>alert("XSS")</script>';
  const clean = sanitizeInput(dirty);
  assert.strictEqual(clean, '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;');
});
