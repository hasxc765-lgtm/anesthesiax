/**
 * AnesthesiaX — Service Worker (PWA Offline Engine)
 * Version: 2.0.0 (Auto-Purge Old Cache & Live Sync)
 */

const CACHE_NAME = 'anesthesiax-v2.0.0';

const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon.png',
  './css/style.css',
  './js/app.js',
  './js/components/navigation.js'
];

// 1. التثبيت والتخزين الآمن للملفات
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[AnesthesiaX PWA] Caching v2 assets');
      return Promise.allSettled(
        ASSETS_TO_CACHE.map((url) =>
          cache.add(url).catch((err) => console.log('Asset skipped:', url, err))
        )
      );
    })
  );
  // تفعيل النسخة الجديدة فوراً دون انتظار إغلاق التبويبات
  self.skipWaiting();
});

// 2. تفعيل وحذف جميع النسخ والكاشات القديمة نهائياً
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[AnesthesiaX PWA] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  // استلام السيطرة المباشرة على جميع الصفحات المفتوحة
  self.clients.claim();
});

// 3. إدارة جلب البيانات (Network First مع دعم كامل للأوفلاين)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  // استثناء روابط قاعدة بيانات العداد السحابي لتبقى حية ومباشرة دائماً
  if (
    event.request.url.includes('firebaseio.com') ||
    event.request.url.includes('firebasedatabase.app') ||
    event.request.url.includes('counterapi.dev')
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match('./index.html')))
  );
});
