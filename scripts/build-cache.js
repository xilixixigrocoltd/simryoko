#!/usr/bin/env node
/**
 * 产品缓存预生成脚本
 * 从 B2B API 拉取所有套餐 → 存为静态 JSON → Vercel CDN 直出（无 serverless 延迟）
 * 用法: node scripts/build-cache.js
 */
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const API_BASE = 'https://ciuh32wky.xigrocoltd.com/api';
const USERNAME = process.env.AGENT_USERNAME || 'lx001';
const PASSWORD = process.env.AGENT_PASSWORD || '123123';
const OUT_DIR  = path.join(__dirname, '..', 'cache');

const COUNTRIES = [
  'JP','KR','CN','TW','HK','MO','TH','SG','MY','ID','PH','VN','IN','KH',
  'MM','BD','LK','NP','PK','MN','KZ','UZ','GE','AM','AZ',
  'GB','DE','FR','IT','ES','NL','CH','AT','SE','NO','DK','FI','BE','PT',
  'GR','PL','CZ','HU','RO','TR','UA',
  'US','CA','MX','BR','AR','CL','CO',
  'AE','SA','QA','KW','OM','JO','IL','EG','MA',
  'ZA','NG','KE','GH',
  'AU','NZ',
  '',  // global/regional plans
];

function httpsPost(url, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const data = JSON.stringify(body);
    const req = https.request({
      hostname: u.hostname, path: u.pathname, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(data) }
    }, res => {
      let raw = ''; res.on('data', c => raw += c);
      res.on('end', () => { try { resolve(JSON.parse(raw)); } catch(e) { reject(e); } });
    });
    req.on('error', reject); req.write(data); req.end();
  });
}

function httpsGet(url, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    https.get({ hostname: u.hostname, path: u.pathname + u.search,
      headers: { Authorization: `Bearer ${token}` }
    }, res => {
      let raw = ''; res.on('data', c => raw += c);
      res.on('end', () => { try { resolve(JSON.parse(raw)); } catch(e) { reject(e); } });
    }).on('error', reject);
  });
}

function fmt(p) {
  return {
    id: p.id, name: p.name, nameEn: p.nameEn, type: p.type,
    price: parseFloat(p.price),
    countries: (p.countries || []).map(c => ({ code: c.code, cn: c.cn, en: c.en })),
    dataAmount:   p.dataSize   || p.dataAmount   || null,
    validityDays: p.validDays  || p.validityDays  || null,
  };
}

async function fetchAll(token, country) {
  const all = [];
  let page = 1, total = Infinity;
  while (all.length < total && page <= 30) {
    const qs  = country ? `&country=${country}` : '';
    const res = await httpsGet(`${API_BASE}/agent/products?pageSize=10&page=${page}${qs}`, token);
    if (!res.success) break;
    const list = res.data?.list || [];
    if (page === 1) total = res.data?.total || list.length;
    all.push(...list);
    if (list.length < 10 || all.length >= total) break;
    page++;
    await new Promise(r => setTimeout(r, 100));
  }
  return { list: all.map(fmt).sort((a,b) => a.price - b.price), total };
}

async function main() {
  if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

  console.log('Logging in...');
  const login = await httpsPost(`${API_BASE}/agent/login`, { username: USERNAME, password: PASSWORD });
  if (!login.success) throw new Error('Login failed: ' + login.message);
  const token = login.data.token;
  console.log('OK\n');

  let built = 0, failed = 0, totalPlans = 0;

  for (const country of COUNTRIES) {
    const key = country || '_global';
    try {
      process.stdout.write(`  ${key.padEnd(8)} `);
      const { list, total } = await fetchAll(token, country);
      fs.writeFileSync(
        path.join(OUT_DIR, `${key}.json`),
        JSON.stringify({ list, total, generatedAt: new Date().toISOString() })
      );
      console.log(`${list.length} plans`);
      built++; totalPlans += list.length;
    } catch (e) {
      console.log(`FAIL: ${e.message}`);
      failed++;
    }
    await new Promise(r => setTimeout(r, 150));
  }

  fs.writeFileSync(path.join(OUT_DIR, '_meta.json'), JSON.stringify({
    built, failed, totalPlans, generatedAt: new Date().toISOString()
  }, null, 2));

  console.log(`\n✅ Done: ${built} countries, ${totalPlans} plans total, ${failed} failed`);
}

main().catch(e => { console.error(e.message); process.exit(1); });
