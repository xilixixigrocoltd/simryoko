const DESTS = [
  { code:'JP', name:'Japan', flag:'🇯🇵', from: 2.48 },
  { code:'KR', name:'South Korea', flag:'🇰🇷', from: 2.70 },
  { code:'TW', name:'Taiwan', flag:'🇹🇼', from: 2.70 },
  { code:'TH', name:'Thailand', flag:'🇹🇭', from: 2.70 },
  { code:'MY', name:'Malaysia', flag:'🇲🇾', from: 2.70 },
  { code:'SG', name:'Singapore', flag:'🇸🇬', from: 2.80 },
  { code:'DE', name:'Europe (28 countries)', flag:'🇪🇺', from: 2.40 },
  { code:'US', name:'United States', flag:'🇺🇸', from: 3.20 },
  { code:'AU', name:'Australia', flag:'🇦🇺', from: 3.00 },
  { code:'HK', name:'Hong Kong', flag:'🇭🇰', from: 2.60 },
  { code:'ID', name:'Indonesia', flag:'🇮🇩', from: 2.90 },
  { code:'PH', name:'Philippines', flag:'🇵🇭', from: 2.80 },
  { code:'VN', name:'Vietnam', flag:'🇻🇳', from: 2.60 },
  { code:'IN', name:'India', flag:'🇮🇳', from: 3.50 },
  { code:'GB', name:'United Kingdom', flag:'🇬🇧', from: 2.40 },
  { code:'FR', name:'France', flag:'🇫🇷', from: 2.40 },
];

// Featured destinations (hero grid)
const FEATURED = ['JP','DE','KR','TH','TW','MY','US','AU'];

function renderDestGrid() {
  const grid = document.getElementById('destGrid');
  if (!grid) return;
  grid.innerHTML = FEATURED.map(code => {
    const d = DESTS.find(x => x.code === code);
    if (!d) return '';
    return `
    <div class="dest-card" onclick="window.location='/shop.html?country=${d.code}'">
      <div class="dest-flag">${d.flag}</div>
      <div class="dest-country">${d.name}</div>
      <div class="dest-from">
        <label>From</label>
        <div class="price">$${d.from.toFixed(2)}</div>
      </div>
      <span class="dest-cta">View plans →</span>
    </div>`;
  }).join('');
}

function initSearch() {
  const input = document.getElementById('destInput');
  const dropdown = document.getElementById('destDropdown');
  if (!input) return;

  input.addEventListener('input', () => {
    const q = input.value.toLowerCase().trim();
    if (!q) { dropdown.innerHTML = ''; return; }
    const hits = DESTS.filter(d => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q)).slice(0, 7);
    dropdown.innerHTML = hits.map(d =>
      `<div class="dest-item" onclick="window.location='/shop.html?country=${d.code}'">
        <span>${d.flag}</span><span>${d.name}</span>
        <span class="from-price">from $${d.from.toFixed(2)}</span>
      </div>`
    ).join('');
  });

  document.addEventListener('click', e => {
    if (!input.closest('.search-wrap').contains(e.target)) dropdown.innerHTML = '';
  });
}

function goSearch() {
  const q = document.getElementById('destInput')?.value?.trim();
  if (!q) { window.location = '/shop.html'; return; }
  const hit = DESTS.find(d => d.name.toLowerCase().includes(q.toLowerCase()) || d.code.toLowerCase() === q.toLowerCase());
  window.location = hit ? `/shop.html?country=${hit.code}` : `/shop.html?search=${encodeURIComponent(q)}`;
}

document.getElementById('destInput')?.addEventListener('keydown', e => { if (e.key === 'Enter') goSearch(); });

renderDestGrid();
initSearch();
