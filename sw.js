const CACHE = 'bujo-v6';
const ASSETS = [
  '/bullet-journal/',
  '/bullet-journal/index.html',
  '/bullet-journal/manifest.json',
  '/bullet-journal/icons/icon-192.png',
  '/bullet-journal/icons/icon-512.png',
  ];

self.addEventListener('install', ev => {
  ev.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', ev => {
  ev.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', ev => {
  if (ev.request.method !== 'GET') return;
  if (new URL(ev.request.url).origin !== self.location.origin) return;
  ev.respondWith(
    caches.open(CACHE).then(async c => {
      const cached = await c.match(ev.request);
      const network = fetch(ev.request).then(res => {
        c.put(ev.request, res.clone());
        return res;
      }).catch(() => cached);
      return cached || network;
    })
    );
});
