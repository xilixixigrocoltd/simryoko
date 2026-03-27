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

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
  'https://simkaze.com',
  'https://www.simkaze.com',
  'https://simkaze-xilixixigrocoltdcoms-projects.vercel.app',
];

/**
 * Set CORS headers — restricts to known origins only
 * Falls back to first allowed origin if unknown
 */
function setCors(req, res, methods = 'GET, POST, OPTIONS') {
  const origin = req.headers.origin || '';
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  res.setHeader('Access-Control-Allow-Origin', allowed);
  res.setHeader('Access-Control-Allow-Methods', methods);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

module.exports = { applyRateLimit, getClientIp, setCors, ALLOWED_ORIGINS };
