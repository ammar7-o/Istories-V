/**
 * IStories service worker
 * =======================
 *
 * Goals
 * -----
 * 1. Work at ANY base path (root, `/Istories-V/`, a project sub-folder, …).
 *    Earlier versions hard-coded `/Istories-V` which broke everywhere else.
 * 2. Pre-cache the small app shell so the UI opens offline.
 * 3. Cache code and data (html/js/css/json) fetched at runtime, so repeat
 *    visits are served from cache.
 *
 * NOTE: the app no longer ships an offline neural translation model, so the
 * service worker no longer has to keep multi-hundred-megabyte model files
 * around. Bumping CACHE_VERSION below also purges any such files that earlier
 * versions had already cached in the browser.
 */

const CACHE_VERSION = 'v11';
const SHELL_CACHE = `istories-shell-${CACHE_VERSION}`;

// Paths are resolved relative to the service-worker scope, so the same file
// works when the app is served from "/" or from "/Istories-V/".
const SHELL_ASSETS = [
  './',
  './index.html',
  './icon.png',
  './icon-manifest.png',
  './main/nav/sidebar.css',
  './main/nav/sidebar.js',
  './main/nav/common.js',
  './main/nav/storage.js',
  './main/nav/theme.css',
  './main/nav/header.css',
  './main/nav/settings-panel.js',
  './main/nav/vendor/localforage.min.js',
  './main/index.html',
  './main/main/style.css',
  './main/main/main.js',
  './main/main/other.js',
  './main/reader/index.html',
  './main/reader/styles/main.css',
  './main/reader/scripts/main.js',
  './main/reader/scripts/settings.js',
  './main/reader/scripts/thems.js',
  './database/database/main.js',
  './database/database/more.js',
  './main/vocabulary/index.html',
  './main/flashcard/index.html',
  './main/quiz/index.html',
  './store/index.html',
  './tools/index.html',
  './main/settings/index.html',
];

// INSTALL — pre-cache the app shell.
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then(cache =>
      // addAll rejects the whole batch if a single URL 404s, so add
      // everything but tolerate individual failures.
      Promise.all(
        SHELL_ASSETS.map(url =>
          cache.add(url).catch(error => {
            console.warn('[sw] could not pre-cache', url, error);
          })
        )
      )
    )
  );
});

// ACTIVATE — drop caches from previous versions.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== SHELL_CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

function isCodeOrData(url) {
  return /\.(?:js|mjs|css|json|html)$/.test(url.pathname);
}

// FETCH — cache-first for same-origin GET requests.
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch (error) {
    return;
  }
  if (url.origin !== self.location.origin) return;

  // Never cache range requests (audio/video seeking).
  if (request.headers.has('range')) return;

  event.respondWith(
    (async () => {
      const cached = await caches.match(request, { ignoreSearch: false });
      if (cached) return cached;

      try {
        const response = await fetch(request);

        if (response && response.status === 200 && response.type === 'basic') {
          // Keep code/data around so the app keeps working offline.
          if (isCodeOrData(url)) {
            const cache = await caches.open(SHELL_CACHE);
            await cache.put(request, response.clone());
          }
        }

        return response;
      } catch (error) {
        // Offline and not cached: fall back to the app shell for navigations.
        if (request.mode === 'navigate') {
          const shell = await caches.match('./index.html');
          if (shell) return shell;
        }
        throw error;
      }
    })()
  );
});

// Allow pages to trigger an immediate update.
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
