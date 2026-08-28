interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean expired entries periodically (every 60 seconds)
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitStore.entries()) {
      if (now > record.resetAt) {
        rateLimitStore.delete(key);
      }
    }
  }, 60 * 1000);
  if (timer.unref) timer.unref();
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
 * Extract real client IP behind Cloudflare and reverse proxies
 */
export function getClientIp(request: Request): string {
  const headers = request.headers;
  const cfIp = headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();

  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',');
    return ips[0].trim();
  }

  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return '127.0.0.1';
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
