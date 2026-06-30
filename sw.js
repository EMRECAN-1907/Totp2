/* Authenticator — Service Worker
   Strateji: cache-first. İlk açılıştan sonra uygulama tamamen çevrimdışı çalışır.
   (TOTP kodları zaten cihazda üretilir, sunucuya hiç ihtiyaç yok.)
   Uygulamayı güncellediğinde aşağıdaki sürüm numarasını artır (v1 -> v2). */

const CACHE = 'authenticator-v3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-48.png',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// Kurulum: kabuğu önbelleğe al
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Etkinleşme: eski sürüm önbelleklerini temizle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// İstekler: önbellekte varsa oradan, yoksa ağdan (ve tembel önbellekle)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 &&
              new URL(event.request.url).origin === self.location.origin) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
