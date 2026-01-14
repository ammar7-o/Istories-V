const CACHE_NAME = 'istories-v4'; // تذكر تغيير الرقم عند كل تحديث كبير
const BASE = '/Istories-V';

const ASSETS = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/style.css`,
  `${BASE}/English/imdex.html`,
  `${BASE}/English/reader/imdex.html`


];

// 1. التثبيت: تحميل الملفات الأساسية فوراً
self.addEventListener('install', event => {
  self.skipWaiting(); // إجبار الـ Service Worker الجديد على التفعيل فوراً
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      console.log('Caching assets...');
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

// 2. التفعيل: تنظيف الكاش القديم تماماً
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(k => {
          if (k !== CACHE_NAME) {
            console.log('Deleting old cache:', k);
            return caches.delete(k);
          }
        })
      )
    )
  );
  self.clients.claim(); // السيطرة على الصفحات المفتوحة فوراً
});

// 3. جلب البيانات: استراتيجية (عرض من الكاش ثم التحديث من الشبكة)
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // جلب النسخة الجديدة من الشبكة دائماً لتحديث الكاش
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse.ok) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // في حال انقطاع الإنترنت وعدم وجود كاش
          return cachedResponse;
        });

        // إرجاع الكاش فوراً للسرعة، أو انتظار الشبكة إذا لم يوجد كاش
        return cachedResponse || fetchPromise;
      });
    })
  );
});
