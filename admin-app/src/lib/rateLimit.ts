interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number;
  windowMs?: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit || 60;
  const windowMs = options.windowMs || 60 * 1000;
  const now = Date.now();

  const record = rateLimitStore.get(identifier);

  if (!record || now > record.resetAt) {
    const newRecord: RateLimitRecord = {
      count: 1,
      resetAt: now + windowMs,
    };
    rateLimitStore.set(identifier, newRecord);
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
