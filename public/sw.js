// Service Worker for Torah App
// Handles caching and offline functionality

const CACHE_VERSION = '1.0.1'; // Static version - update manually for major changes
const BUILD_TIME = '{{BUILD_TIME}}'; // Replaced by Vite build
const STATIC_CACHE = `static-v${CACHE_VERSION}`;
const DYNAMIC_CACHE = `dynamic-v${CACHE_VERSION}`;
const DEBUG = true; // Always enabled for debugging publish issues

console.log('[SW] 📦 Service Worker Version:', CACHE_VERSION);
console.log('[SW] 🕐 Build Time:', BUILD_TIME);

// Assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Cache size limits
const CACHE_SIZE_LIMIT = 50;

// Helper to limit cache size
const limitCacheSize = async (cacheName, maxSize) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxSize) {
    await cache.delete(keys[0]);
    await limitCacheSize(cacheName, maxSize);
  }
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[SW] 🟢 Installing service worker... Version:', CACHE_VERSION);
  console.log('[SW] 🟢 Caching assets:', STATIC_ASSETS);
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] ✅ Static cache opened:', STATIC_CACHE);
      return cache.addAll(STATIC_ASSETS)
        .then(() => console.log('[SW] ✅ All assets cached successfully'))
        .catch(err => console.error('[SW] ❌ Failed to cache assets:', err));
    })
  );
  console.log('[SW] ⏭️ Skip waiting called');
  self.skipWaiting(); // Activate immediately
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] 🔵 Activating service worker...');
  event.waitUntil(
    caches.keys()
      .then((keys) => {
        console.log('[SW] 🔍 Found caches:', keys);
        return Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => {
              console.log('[SW] 🗑️ Removing old cache:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => {
        console.log('[SW] ✅ Old caches removed');
        // Only claim clients AFTER cache cleanup
        return self.clients.claim();
      })
      .then(() => {
        console.log('[SW] 👑 Clients claimed - activation complete!');
      })
  );
});

// Fetch event - Network First with Cache Fallback (for instant updates)
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== location.origin) {
    return;
  }

  // Skip chrome-extension and other protocols
  if (!url.protocol.startsWith('http')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        // Always try network first for instant updates
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          throw new Error('Network response not ok');
        }

        // Clone and cache for offline use
        const responseToCache = networkResponse.clone();
        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseToCache);
          limitCacheSize(DYNAMIC_CACHE, CACHE_SIZE_LIMIT);
        });

        return networkResponse;
      })
      .catch((error) => {
        // Only use cache if network fails (offline mode)
        console.log('[SW] 🔴 Network failed for:', url.pathname, '- Serving from cache');
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            console.log('[SW] ✅ Cache hit for:', url.pathname);
            return cachedResponse;
          }
          // Return offline page if available
          console.log('[SW] ⚠️ No cache found, returning fallback');
          return caches.match('/index.html');
        });
      })
  );
});

// Message event - handle skip waiting and version requests
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] 📨 Received SKIP_WAITING message');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    console.log('[SW] 📨 Version requested');
    event.ports[0].postMessage({
      version: CACHE_VERSION,
      buildTime: BUILD_TIME
    });
  }
});
