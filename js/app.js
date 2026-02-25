// =============================================
// SimRyoko — Shared Utilities
// =============================================

const API = window.location.hostname === 'localhost' ? 'http://localhost:3000' : '';

async function apiFetch(path, options = {}) {
  const res = await fetch(`${API}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  return res.json();
}

// Country code → flag emoji
function flagEmoji(code) {
  if (!code) return '🌍';
  const c = code.toUpperCase();
  // Special cases
  if (c === 'EU' || c === 'DE') return '🇪🇺';
  // Convert country code to regional indicator symbols
  try {
    return [...c].map(ch => String.fromCodePoint(ch.charCodeAt(0) + 127397)).join('');
  } catch {
    return '🌍';
  }
}

function formatPrice(price) {
  return '$' + parseFloat(price).toFixed(2);
}

// Parse data amount from product name e.g. "5GB", "500MB", "Unlimited"
function parseData(p) {
  if (!p) return '';
  // 优先使用 API 返回的结构化字段
  if (p.dataAmount) {
    const mb = parseFloat(p.dataAmount);
    if (mb >= 1024) return (mb / 1024).toFixed(mb % 1024 === 0 ? 0 : 1) + 'GB';
    return mb + 'MB';
  }
  // 回退：从产品名称解析
  const name = (p.nameEn || p.name || '');
  const m = name.match(/(\d+(?:\.\d+)?)\s*(GB|MB|TB)/i);
  if (m) return m[1] + m[2].toUpperCase();
  if (/unlimited/i.test(name)) return '∞';
  return '';
}

// Parse validity days from product
function parseDays(p) {
  if (!p) return '';
  // 优先使用结构化字段
  if (p.validityDays) return p.validityDays + 'd';
  // 回退：从产品名称解析
  const name = (p.nameEn || p.name || '');
  const m = name.match(/(\d+)\s*[Dd]ay/i);
  if (m) return m[1] + 'd';
  return '';
}

// Product card — matches style.css .product-card classes
function productCard(p) {
  const country = p.countries?.[0];
  const code = country?.code || '';
  const flag = flagEmoji(code);
  const dest = country ? (country.en || country.cn || code) : (p.nameEn || p.name || '');
  const dataAmt = parseData(p);
  const days = parseDays(p);

  return `
  <div class="product-card" onclick="window.location='/checkout.html?id=${p.id}'">
    <div class="pc-flag">${flag}</div>
    <div class="pc-dest">${dest}</div>
    <div class="pc-name">${p.nameEn || p.name || ''}</div>
    <div class="pc-price">${formatPrice(p.price)} <span>USD</span></div>
    <div class="pc-tags">
      ${dataAmt ? `<span class="pc-tag">📶 ${dataAmt}</span>` : ''}
      ${days ? `<span class="pc-tag">📅 ${days}</span>` : ''}
      <span class="pc-tag">⚡ Instant</span>
    </div>
    <button class="pc-btn">Buy Now</button>
  </div>`;
}

// Debounce
function debounce(fn, ms) {
  let t;
  return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}

// Copy to clipboard
function copyToClipboard(text, btn) {
  navigator.clipboard.writeText(text).then(() => {
    const orig = btn.textContent;
    btn.textContent = '✅ Copied!';
    btn.style.background = 'rgba(74,222,128,0.15)';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
    }, 2000);
  }).catch(() => {
    // Fallback
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    btn.textContent = '✅ Copied!';
    setTimeout(() => btn.textContent = orig, 2000);
  });
}

// Mobile nav toggle
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('navToggle');
  const mobileNav = document.getElementById('mobileNav');
  if (toggle && mobileNav) {
    toggle.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      toggle.innerHTML = open
        ? '<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M18 6 6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'
        : '<svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>';
    });
  }
});
