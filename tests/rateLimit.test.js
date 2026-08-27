const test = require('node:test');
const assert = require('node:assert');

// In-memory sliding window rate limiter implementation under test
function checkRateLimit(store, identifier, options = {}) {
  const limit = options.limit || 5;
  const windowMs = options.windowMs || 1000;
  const now = Date.now();

  const record = store.get(identifier);

  if (!record || now > record.resetAt) {
    const newRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    store.set(identifier, newRecord);
    return {
      success: true,
      limit,
      remaining: limit - 1,
      reset: newRecord.resetAt,
    };
  }

  if (record.count < limit) {
    record.count += 1;
    return {
      success: true,
      limit,
      remaining: limit - record.count,
      reset: record.resetAt,
    };
  }

  return {
    success: false,
    limit,
    remaining: 0,
    reset: record.resetAt,
  };
}

test('Rate limiter allows requests under the limit', () => {
  const store = new Map();
  const id = 'user-1';
  
  const r1 = checkRateLimit(store, id, { limit: 3 });
  assert.strictEqual(r1.success, true);
  assert.strictEqual(r1.remaining, 2);

  const r2 = checkRateLimit(store, id, { limit: 3 });
  assert.strictEqual(r2.success, true);
  assert.strictEqual(r2.remaining, 1);

  const r3 = checkRateLimit(store, id, { limit: 3 });
  assert.strictEqual(r3.success, true);
  assert.strictEqual(r3.remaining, 0);

  const r4 = checkRateLimit(store, id, { limit: 3 });
  assert.strictEqual(r4.success, false);
  assert.strictEqual(r4.remaining, 0);
});

test('Rate limiter isolates distinct identifiers', () => {
  const store = new Map();
  const r1 = checkRateLimit(store, 'ip-1', { limit: 1 });
  assert.strictEqual(r1.success, true);

  const r2 = checkRateLimit(store, 'ip-1', { limit: 1 });
  assert.strictEqual(r2.success, false);

  const r3 = checkRateLimit(store, 'ip-2', { limit: 1 });
  assert.strictEqual(r3.success, true);
});
