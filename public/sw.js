const CACHE_NAME = 'prakom625-v3';

const STATIC_ASSETS = [
  '/',
  '/materials',
  '/schedules',
  '/quiz',
  '/icon-192x192.png',
  '/icon-512x512.png',
  '/icon-maskable-192x192.png',
  '/icon-maskable-512x512.png',
  '/apple-touch-icon.png',
  '/favicon.ico',
  '/Logo.webp',
  '/manifest.webmanifest',
  '/manifest.json'
];

// 1. Install event: pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Pre-cache partial warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// 2. Activate event: clean outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch event: Stale-While-Revalidate for static assets, Network-First for navigation
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and non-http(s)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // CRITICAL: NEVER cache API routes, Supabase calls, or Next.js RSC requests
  const isRscRequest =
    url.searchParams.has('_rsc') ||
    request.headers.get('rsc') === '1' ||
    Boolean(request.headers.get('next-router-state-tree'));

  const isApiOrSupabase =
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('supabase.co');

  if (isApiOrSupabase || isRscRequest) {
    return; // Pass through directly to network
  }

  // Navigation requests (HTML pages) -> Network-First, fallback to cached page or root
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) {
            return cachedResponse;
          }
          return (await caches.match('/')) || new Response(
            '<html><head><meta charset="utf-8"><title>Mode Offline - Diklat Prakom</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="font-family:sans-serif;text-align:center;padding:40px 20px;background:#0f172a;color:#f8fafc;"><h2>📡 Mode Offline</h2><p>Koneksi internet Anda sedang terputus. Buka modul atau halaman yang sudah pernah Anda buka sebelumnya.</p><button onclick="window.location.reload()" style="margin-top:16px;padding:10px 20px;border-radius:20px;border:none;background:#2563eb;color:white;font-weight:bold;cursor:pointer;">Coba Muat Ulang</button></body></html>',
            { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
    return;
  }

  // Static Assets (images, fonts, scripts, css) -> Cache First / Stale-While-Revalidate
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch in background to revalidate cache
        fetch(request)
          .then((networkResponse) => {
            if (networkResponse.status === 200) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, networkResponse);
              });
            }
          })
          .catch(() => {
            // Ignore background fetch error
          });
        return cachedResponse;
      }

      return fetch(request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      });
    })
  );
});
