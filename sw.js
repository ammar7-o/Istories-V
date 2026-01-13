const CACHE_NAME = 'istories-v3';
const BASE = '/Istories-V';

const ASSETS = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/style.css`,

  `${BASE}/English/index.html`,
  `${BASE}/English/main.js`,
  `${BASE}/English/style.css`,
  `${BASE}/English/addstories.css`,
  `${BASE}/English/addstories.js`,
  `${BASE}/English/other.js`,
  `${BASE}/English/database/main.js`
];

// INSTALL
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of ASSETS) {
        try {
          const res = await fetch(url);
          if (res.ok) await cache.put(url, res.clone());
        } catch (e) {
          console.warn('Failed to cache:', url);
        }
      }
    })
  );
});

// ACTIVATE
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// FETCH
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
