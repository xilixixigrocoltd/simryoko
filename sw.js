// SimRyoko Service Worker v1.1.0 — 2026-03-14
const CACHE_NAME = 'simryoko-v1.1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/shop.html',
  '/checkout.html',
  '/app.html',
  '/css/style.css',
  '/img/icon-192.png',
  '/img/icon-512.png',
  '/offline.html'
];

// Install - cache static assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch - network first for API, stale-while-revalidate for static
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // Skip non-GET requests
  if (e.request.method !== 'GET') return;

  // API calls: network only
  if (url.pathname.startsWith('/api/')) return;

  // Navigation requests: network first, fallback to cache, then offline page
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request)
        .then(response => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(e.request).then(c => c || caches.match('/offline.html')))
    );
    return;
  }

  // Static assets: stale-while-revalidate
  e.respondWith(
    caches.match(e.request).then(cached => {
      const fetchPromise = fetch(e.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      }).catch(() => cached);

      return cached || fetchPromise;
    })
  );
});
