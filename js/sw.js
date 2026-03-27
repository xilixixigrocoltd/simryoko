// SimKaze Service Worker — PWA Support + Push Notifications
const CACHE = 'simkaze-v1';
const PRECACHE = [
  '/',
  '/app.html',
  '/shop.html',
  '/css/style.css',
  '/js/app.js',
  '/js/i18n.js',
  '/manifest.json',
];

// 安装：预缓存核心资源
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

// 激活：清理旧缓存
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Fetch：网络优先，失败回落缓存
self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  // API 请求：纯网络，不缓存
  if (url.pathname.startsWith('/api/')) return;

  e.respondWith(
    fetch(request)
      .then(res => {
        // 缓存成功响应
        if (res.ok && request.method === 'GET') {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return res;
      })
      .catch(() => caches.match(request))
  );
});

// Push 通知接收
self.addEventListener('push', e => {
  if (!e.data) return;
  let data;
  try { data = e.data.json(); } catch { data = { title: 'SimKaze', body: e.data.text() }; }

  const opts = {
    body: data.body || '',
    icon: '/img/icon-192.png',
    badge: '/img/icon-192.png',
    tag: data.tag || 'simkaze',
    data: data.url ? { url: data.url } : {},
    actions: data.actions || [],
    vibrate: [100, 50, 100],
  };

  e.waitUntil(self.registration.showNotification(data.title || 'SimKaze', opts));
});

// 点击通知：跳转到指定页面
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = e.notification.data?.url || '/app.html';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      const existing = list.find(c => c.url === url && 'focus' in c);
      if (existing) return existing.focus();
      return clients.openWindow(url);
    })
  );
});
