const CACHE_NAME = 'dicoding-story-v1';
const APP_SHELL = [
  '/', // index.html
  '/index.html',
  '/styles/styles.css',
  '/scripts/index.js'
  // tambahkan file penting lain jika perlu
];

self.addEventListener('install', (ev) => {
  ev.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (ev) => {
  const req = ev.request;
  // hanya caching GET
  if (req.method !== 'GET') return;

  ev.respondWith(
    caches.match(req).then(cached => {
      const fetchPromise = fetch(req).then(networkResponse => {
        // update cache (non blocking)
        caches.open(CACHE_NAME).then(cache => {
          cache.put(req, networkResponse.clone());
        }).catch(()=>{});
        return networkResponse.clone();
      }).catch(() => cached);
      // prefer cache first but return network when available
      return cached || fetchPromise;
    })
  );
});

// Push notification
self.addEventListener('push', (ev) => {
  let data = { title: 'New notification', options: { body: 'You have a new message' } };
  try { data = ev.data.json(); } catch(e){
    data.options = { body: ev.data?.text() || data.options.body };
  }
  ev.waitUntil(self.registration.showNotification(data.title, data.options));
});

self.addEventListener('notificationclick', (ev) => {
  ev.notification.close();
  const url = ev.notification?.data?.url || '/';
  ev.waitUntil(clients.matchAll({ type: 'window' }).then(windowClients => {
    for (const client of windowClients) {
      if (client.url === url && 'focus' in client) return client.focus();
    }
    if (clients.openWindow) return clients.openWindow(url);
  }));
});
