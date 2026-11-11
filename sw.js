const CACHE = 'simsasukgo-v1';
self.addEventListener('install', e => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;
  const same = new URL(req.url).origin === self.location.origin;
  const save = res => {
    if (res && (res.ok || res.type === 'opaque')) {
      const copy = res.clone();
      caches.open(CACHE).then(c => c.put(req, copy));
    }
    return res;
  };
  if (same) {
    e.respondWith(fetch(req).then(save).catch(() => caches.match(req, {ignoreSearch: true})));
  } else {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(save)));
  }
});
