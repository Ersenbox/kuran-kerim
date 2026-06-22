// ══════════════════════════════════════════
// KURAN-I KERİM PWA — Service Worker v40
// Cache version güncellendi → eski cache temizlenir
// ══════════════════════════════════════════

const CACHE_NAME = 'kuran-v40';
const CACHE_VERSION = '2026-06-22-v40';

// Cache'lenecek dosyalar
const CACHE_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-144.png',
  '/icons/icon-152.png',
  '/icons/icon-192.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
  // Ezan dosyaları — offline çalışması için cache'le
  '/public/audio/sabah.mp3',
  '/public/audio/ezan.mp3',
  '/public/audio/azan1.mp3',
  '/public/audio/azan2.mp3',
  '/public/audio/azan3.mp3',
  '/public/audio/azan4.mp3',
  '/public/audio/azan5.mp3',
  '/public/audio/azan6.mp3',
  '/public/audio/azan7.mp3',
  '/public/audio/azan8.mp3',
  '/public/audio/azan9.mp3',
  '/public/audio/azan10.mp3',
  '/public/audio/azan11.mp3',
  '/public/audio/azan12.mp3',
  '/public/audio/azan13.mp3',
  '/public/audio/azan14.mp3',
  '/public/audio/azan15.mp3',
  '/public/audio/azan16.mp3',
  '/public/audio/azan17.mp3',
  '/public/audio/azan18.mp3',
  '/public/audio/azan19.mp3',
  '/public/audio/azan20.mp3',
  '/public/audio/azan21.mp3',
];

// ── INSTALL: Yeni cache kur ──
self.addEventListener('install', event => {
  console.log('[SW v40] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      // Promise.allSettled: tek MP3 hata verse de diğerleri cache'lenir
      return Promise.allSettled(
        CACHE_FILES.map(url => cache.add(url).catch(err => {
          console.warn('[SW v40] Cache skip:', url, err.message);
        }))
      );
    })
  );
  // Hemen aktive et — bekleme yok
  self.skipWaiting();
});

// ── ACTIVATE: ESKİ CACHE'LERİ TEMİZLE ──
self.addEventListener('activate', event => {
  console.log('[SW v40] Activating — clearing old caches...');
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => {
            console.log('[SW v40] Deleting old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => {
      console.log('[SW v40] Old caches cleared');
      // Tüm açık sekmeleri hemen güncelle
      return self.clients.claim();
    })
  );
});

// ── FETCH: Network first, cache fallback ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // API istekleri — her zaman network (cache'leme)
  if (
    url.hostname.includes('api.alquran.cloud') ||
    url.hostname.includes('aladhan.com') ||
    url.hostname.includes('cdn.islamic.network') ||
    url.hostname.includes('everyayah.com') ||
    url.hostname.includes('googletagmanager.com') ||
    url.hostname.includes('google-analytics.com')
  ) {
    event.respondWith(
      fetch(event.request).catch(() => {
        return new Response('{"error":"offline"}', {
          headers: { 'Content-Type': 'application/json' }
        });
      })
    );
    return;
  }

  // Ana uygulama dosyaları — Network first, cache fallback
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Başarılı yanıtı cache'e kaydet
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Network yok — cache'ten sun
        return caches.match(event.request).then(cached => {
          if (cached) return cached;
          // Cache'te de yok — index.html döndür (SPA fallback)
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// ── MESAJ: Manuel cache temizle ──
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'CLEAR_CACHE') {
    caches.keys().then(keys => {
      keys.forEach(key => caches.delete(key));
    });
    console.log('[SW v40] All caches cleared by message');
  }
});
