const CACHE_NAME = 'prakom625-v2';

const STATIC_ASSETS = [
  '/',
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
      return cache.addAll(STATIC_ASSETS);
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

// 3. Fetch event: Stale-While-Revalidate for static assets, Network-First for navigation & API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser-extension requests
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // CRITICAL: NEVER cache API routes, Supabase calls, or Next.js RSC requests
  // Next.js client-side navigation uses RSC fetches (?_rsc=... or rsc header).
  // Caching these caused materials and other modules to appear outdated.
  const isRscRequest =
    url.searchParams.has('_rsc') ||
    request.headers.get('rsc') === '1' ||
    Boolean(request.headers.get('next-router-state-tree'));

  const isApiOrSupabase =
    url.pathname.startsWith('/api/') ||
    url.hostname.includes('supabase.co');

  const isDynamicRoute =
    url.pathname.startsWith('/materials') ||
    url.pathname.startsWith('/schedules') ||
    url.pathname.startsWith('/tasks') ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/admin');

  if (isApiOrSupabase || isRscRequest || isDynamicRoute) {
    return; // Pass through directly to network
  }

  // Navigation requests (HTML pages) -> Network-First, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 200) {
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
          return caches.match('/');
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
