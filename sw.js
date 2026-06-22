const CACHE = 'bujo-v2';
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
  ev.respondWith(
    caches.match(ev.request).then(cached => cached || fetch(ev.request).then(res => {
      const clone = res.clone();
      caches.open(CACHE).then(c => c.put(ev.request, clone));
      return res;
    }))
  );
});
