/**
 * IStories service worker
 * =======================
 *
 * Goals
 * -----
 * 1. Work at ANY base path (root, `/Istories-V/`, a project sub-folder, …).
 *    Earlier versions hard-coded `/Istories-V` which broke everywhere else.
 * 2. Pre-cache the app shell so the UI opens offline.
 * 3. Cache the assets the UI is made of — code, data, images, fonts, icons —
 *    so pages, logos, story covers and Font Awesome glyphs all survive offline.
 * 4. Cache remote story covers (Pexels/Unsplash, …) after the first view too.
 *
 * NOTE: the app no longer ships an offline neural translation model, so the
 * service worker no longer has to keep multi-hundred-megabyte model files
 * around. Bumping CACHE_VERSION below also purges any such files that earlier
 * versions had already cached in the browser.
 */

const CACHE_VERSION = 'v3.7';
const SHELL_CACHE = `istories-shell-${CACHE_VERSION}`;
const RUNTIME_CACHE = `istories-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `istories-images-${CACHE_VERSION}`;
const CURRENT_CACHES = [SHELL_CACHE, RUNTIME_CACHE, IMAGE_CACHE];

// Keep the runtime caches from growing without bound.
const MAX_RUNTIME_ENTRIES = 250;
const MAX_IMAGE_ENTRIES = 250;

// Paths are resolved relative to the service-worker scope, so the same file
// works when the app is served from "/" or from "/Istories-V/".
const SHELL_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './icon.svg',
  './icon-512.png',
  './icon-manifest.png',

  // Shared navigation / layout
  './main/nav/sidebar.css',
  './main/nav/sidebar.js',
  './main/nav/common.js',
  './main/nav/storage.js',
  './main/nav/theme.css',
  './main/nav/header.css',
  './main/nav/settings-panel.js',
  './main/nav/vendor/localforage.min.js',

  // Pages
  './main/index.html',
  './main/reader/index.html',
  './main/vocabulary/index.html',
  './main/flashcard/index.html',
  './main/quiz/index.html',
  './main/profile/index.html',
  './main/settings/index.html',
  './main/storiesStudio/index.html',
  './store/index.html',
  './tools/index.html',
  './tools/All-tools/translator.html',
  './tools/All-tools/Analyzer.html',

  // Page code
  './main/main/style.css',
  './main/main/main.js',
  './main/main/other.js',
  './main/reader/styles/main.css',
  './main/reader/styles/settings.css',
  './main/reader/styles/fonts.css',
  './main/reader/scripts/main.js',
  './main/reader/scripts/settings.js',
  './main/reader/scripts/thems.js',
  './main/vocabulary/main.js',
  './main/vocabulary/style.css',
  './main/flashcard/main.js',
  './main/flashcard/style.css',
  './main/quiz/scripts/main.js',
  './main/quiz/scripts/creat-quiz.js',
  './main/quiz/database/quiz.js',
  './main/quiz/database/quiz-2.js',
  './main/quiz/database/quiz-3.js',
  './main/quiz/styles/style.css',
  './main/quiz/styles/add-quiz.css',
  './main/profile/script.js',
  './main/profile/style.css',
  './main/storiesStudio/addstories.js',
  './main/storiesStudio/addStories.css',
  './store/main.js',
  './store/stories.js',
  './store/stories2.js',
  './store/style.css',
  './tools/main.js',
  './tools/style.css',
  './database/database/main.js',
  './database/database/more/more.js',
  './database/data.json',
  './database/reader.json',
  './database/Dictionarys/english.json',
  './database/Dictionarys/french.json',
  './database/Dictionarys/main.json',
  './database/Dictionarys/story1.json',
  './database/Dictionarys/story1-fr.json',

  // Images / icons used by the UI and the bundled stories
  './imges/cover.jpg',
  './imges/cover.webp',
  './imges/flower.jpg',
  './imges/garden.jpg',
  './imges/plant.jpg',
  './imges/story1.jpeg',
  './imges/story1.jpg',
  './imges/story3.jpeg',
  './imges/user.jpg',

  // Custom reader fonts
  './fonts/BradleyHandITCTT-Bold.ttf',
  './fonts/Caveat-Bold.ttf',
  './fonts/PatrickHandSC-Regular.ttf',
  './fonts/PNU-Bold.ttf',

  // Font Awesome stylesheet + the webfonts that draw the icons
  './font-awesome/css/all.min.css',
  './font-awesome/webfonts/fa-brands-400.woff2',
  './font-awesome/webfonts/fa-regular-400.woff2',
  './font-awesome/webfonts/fa-solid-900.woff2',
  './font-awesome/webfonts/fa-v4compatibility.woff2',
];

// INSTALL — pre-cache the app shell.
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(SHELL_CACHE).then(cache =>
      // addAll rejects the whole batch if a single URL errors, so add
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
          .filter(key => !CURRENT_CACHES.includes(key))
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Assets requested by the CSS/HTML that make the UI look right offline.
const CACHEABLE_EXTENSIONS = /\.(?:js|mjs|css|json|html|png|jpe?g|webp|gif|svg|ico|avif|bmp|woff2?|ttf|otf|eot)$/i;
const CACHEABLE_DESTINATIONS = new Set([
  'document',
  'script',
  'style',
  'worker',
  'image',
  'font',
  'manifest',
]);

function isCacheableRequest(request, url) {
  return CACHEABLE_EXTENSIONS.test(url.pathname) ||
    CACHEABLE_DESTINATIONS.has(request.destination);
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  await Promise.all(
    keys.slice(0, keys.length - maxEntries).map(key => cache.delete(key))
  );
}

// Cache writes must never break the response: a quota error while storing an
// image should still let that image render normally.
async function putInCache(cacheName, request, response, maxEntries) {
  try {
    const cache = await caches.open(cacheName);
    await cache.put(request, response);
    await trimCache(cacheName, maxEntries);
  } catch (error) {
    console.warn('[sw] could not cache', request.url, error);
  }
}

// Cache-first for same-origin assets: instant offline start, network only on
// a cache miss. Query strings (e.g. `icon.png?v=2`) are ignored so pre-cached
// files match cache-busted URLs.
async function cacheFirst(request) {
  const cached = await caches.match(request, { ignoreSearch: true });
  if (cached) return cached;

  try {
    const response = await fetch(request);

    if (response && response.status === 200 && response.type === 'basic') {
      await putInCache(RUNTIME_CACHE, request, response.clone(), MAX_RUNTIME_ENTRIES);
    }

    return response;
  } catch (error) {
    // Offline and not cached: fall back to the app shell for navigations.
    if (request.mode === 'navigate') {
      const shellUrl = new URL('./index.html', self.registration.scope).href;
      const shell = await caches.match(shellUrl, { ignoreSearch: true });
      if (shell) return shell;
    }
    throw error;
  }
}

// Remote covers: cache-first, same as local assets, so offline rendering is
// instant. Opaque (no-cors) image responses are cacheable with cache.put().
async function cacheFirstImage(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);

  if (response && (response.status === 200 || response.type === 'opaque')) {
    await putInCache(IMAGE_CACHE, request, response.clone(), MAX_IMAGE_ENTRIES);
  }

  return response;
}

// FETCH — serve cached assets first; keep runtime caches warm.
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  let url;
  try {
    url = new URL(request.url);
  } catch (error) {
    return;
  }

  // Never cache range requests (audio/video seeking).
  if (request.headers.has('range')) return;

  if (url.origin === self.location.origin) {
    if (!isCacheableRequest(request, url)) return;
    event.respondWith(cacheFirst(request));
    return;
  }

  // Cross-origin story covers (Pexels etc.) so they still render offline.
  if (request.destination === 'image' && /^https?:$/.test(url.protocol)) {
    event.respondWith(cacheFirstImage(request));
  }
});

// Allow pages to trigger an immediate update.
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
