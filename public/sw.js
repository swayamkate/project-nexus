// Nexus Enterprise Progressive Web App (PWA) Service Worker
// Offline Resilience & Low-Bandwidth Network Caching Engine

const CACHE_NAME = 'nexus-cache-v2.1.0';
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icon.svg',
  '/login',
  '/verify',
  '/employers',
  '/api/docs'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET and API requests (always hit network for live data)
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    return;
  }

  // Network First with Cache Fallback for HTML and static resources
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        // Fallback for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('/');
        }
      })
  );
});
