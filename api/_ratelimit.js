// Simple rate limiting for Vercel serverless
// Uses in-memory store per function instance

const store = new Map();

/**
 * Rate limit by IP
 * @param {string} ip - Client IP
 * @param {number} limit - Max requests
 * @param {number} windowMs - Time window in ms
 * @returns {boolean} true if allowed, false if rate limited
 */
function rateLimit(ip, limit = 30, windowMs = 60000) {
  const now = Date.now();
  const key = ip;

  if (!store.has(key)) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  const entry = store.get(key);

  if (now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  entry.count++;
  if (entry.count > limit) {
    return false;
  }

  return true;
}

function getClientIp(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    'unknown'
  );
}

function applyRateLimit(req, res, limit = 30, windowMs = 60000) {
  const ip = getClientIp(req);
  const allowed = rateLimit(ip, limit, windowMs);

  if (!allowed) {
    res.setHeader('Retry-After', Math.ceil(windowMs / 1000));
    res.status(429).json({
      error: 'Too many requests. Please slow down.',
      retryAfter: Math.ceil(windowMs / 1000)
    });
    return false;
  }
  return true;
}

module.exports = { applyRateLimit, getClientIp };
