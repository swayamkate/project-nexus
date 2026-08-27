interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean expired entries periodically (every 5 minutes)
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
  limit?: number;        // Max allowed requests in window (default 60)
  windowMs?: number;     // Window duration in ms (default 60000 = 1 min)
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * In-memory sliding window rate limiter
 * @param identifier Client IP or User ID
 * @param options Window limits and durations
 */
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
