const cacheName = 'istories-v1';
const assets = [
    './', // بدلاً من '/'
    'index.html',
    'style.css',
    'English/index.html',
    'English/main.js',
    'English/style.css',
    'English/addstories.css',
    'English/addstories.js',
    'English/other.js',
    'English/database/main.js',
    // أضف أي صور أساسية هنا مثل: 'logo.png'
];

// تثبيت وتخزين الملفات
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(cacheName).then(cache => {
            console.log('Caching assets...');
            return cache.addAll(assets);
        })
    );
});

// تفعيل السيرفس وركر وحذف الكاش القديم (مهم جداً عند التحديث)
self.addEventListener('activate', e => {
    e.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(keys
                .filter(key => key !== cacheName)
                .map(key => caches.delete(key))
            );
        })
    );
});

// الاستجابة من الكاش
self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request).then(response => {
            return response || fetch(e.request);
        })
    );
});