// 用户账号存储（邮件为主键）
// 生产环境应替换为 Vercel KV / PostgreSQL
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const USERS_FILE = path.join('/tmp', 'esim-users.json');
const TOKENS_FILE = path.join('/tmp', 'esim-tokens.json');
const SUBS_FILE = path.join('/tmp', 'esim-subscriptions.json');

function loadFile(f) {
  try { if (fs.existsSync(f)) return JSON.parse(fs.readFileSync(f, 'utf8')); } catch {}
  return {};
}
function saveFile(f, d) {
  try { fs.writeFileSync(f, JSON.stringify(d, null, 2)); } catch {}
}

// ──────────────────── Users ────────────────────
const users = {
  get(email) {
    return loadFile(USERS_FILE)[email.toLowerCase()] || null;
  },

  upsert(email, data = {}) {
    const all = loadFile(USERS_FILE);
    const key = email.toLowerCase();
    all[key] = {
      email: key,
      telegramId: null,
      language: 'en',
      pushSubscription: null,
      autoRenew: false,
      usageAlerts: true,
      createdAt: new Date().toISOString(),
      ...all[key],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    saveFile(USERS_FILE, all);
    return all[key];
  },

  update(email, data) {
    const all = loadFile(USERS_FILE);
    const key = email.toLowerCase();
    if (!all[key]) return null;
    all[key] = { ...all[key], ...data, updatedAt: new Date().toISOString() };
    saveFile(USERS_FILE, all);
    return all[key];
  },

  list() {
    return Object.values(loadFile(USERS_FILE));
  },
};

// ──────────────────── Auth Tokens (Magic Link) ────────────────────
const tokens = {
  create(email) {
    const all = loadFile(TOKENS_FILE);
    const token = crypto.randomBytes(24).toString('hex');
    all[token] = {
      email: email.toLowerCase(),
      createdAt: Date.now(),
      expiresAt: Date.now() + 15 * 60 * 1000, // 15分钟
      used: false,
    };
    saveFile(TOKENS_FILE, all);
    return token;
  },

  verify(token) {
    const all = loadFile(TOKENS_FILE);
    const t = all[token];
    if (!t) return null;
    if (t.used || Date.now() > t.expiresAt) return null;
    all[token].used = true;
    saveFile(TOKENS_FILE, all);
    return t.email;
  },
};

// ──────────────────── Subscriptions (Auto-Renewal) ────────────────────
const subscriptions = {
  create({ email, productId, productName, price, iccid, expiryDate, paymentMethod }) {
    const all = loadFile(SUBS_FILE);
    const id = `sub_${Date.now().toString(36)}_${Math.random().toString(36).slice(2,6)}`;
    all[id] = {
      id,
      email: email.toLowerCase(),
      productId,
      productName,
      price,
      iccid: iccid || null,
      paymentMethod,
      expiryDate,           // ISO 日期：套餐到期日
      renewalEnabled: true,
      reminderSent: false,
      status: 'active',     // active | paused | cancelled | renewed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastRenewedAt: null,
    };
    saveFile(SUBS_FILE, all);
    return all[id];
  },

  get(id) {
    return loadFile(SUBS_FILE)[id] || null;
  },

  update(id, data) {
    const all = loadFile(SUBS_FILE);
    if (!all[id]) return null;
    all[id] = { ...all[id], ...data, updatedAt: new Date().toISOString() };
    saveFile(SUBS_FILE, all);
    return all[id];
  },

  byEmail(email) {
    return Object.values(loadFile(SUBS_FILE))
      .filter(s => s.email === email.toLowerCase())
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // 找到即将到期（N天内）且已开启自动续费的订阅
  expiringSoon(daysAhead = 3) {
    const all = Object.values(loadFile(SUBS_FILE));
    const now = Date.now();
    const threshold = now + daysAhead * 24 * 3600 * 1000;
    return all.filter(s => {
      if (s.status !== 'active') return false;
      if (!s.expiryDate) return false;
      const expiry = new Date(s.expiryDate).getTime();
      return expiry <= threshold && expiry >= now;
    });
  },

  list() {
    return Object.values(loadFile(SUBS_FILE));
  },
};

module.exports = { users, tokens, subscriptions };
