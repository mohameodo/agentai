const CACHE_NAME = 'nexiloop-v2';
const STATIC_CACHE = 'nexiloop-static-v2';
const DYNAMIC_CACHE = 'nexiloop-dynamic-v2';

const urlsToCache = [
  '/',
  '/favicon.ico',
  '/manifest.json',
  '/icon-512x512.png',
  '/icon.png',
  '/robots.txt',
  // Add other static assets here
];

// Install event - cache important resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Activate event - claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip service worker for Google APIs and Firebase
  if (url.hostname.includes('googleapis.com') || 
      url.hostname.includes('google.com') ||
      url.hostname.includes('firebase.googleapis.com') ||
      url.hostname.includes('firestore.googleapis.com') ||
      url.hostname.includes('identitytoolkit.googleapis.com') ||
      url.hostname.includes('securetoken.googleapis.com')) {
    return; // Let the browser handle these requests normally
  }

  // Handle different types of requests
  if (request.method === 'GET') {
    // Static assets
    if (urlsToCache.includes(url.pathname)) {
      event.respondWith(
        caches.match(request).then((response) => {
          return response || fetch(request);
        })
      );
    }
    // API requests - network first, cache fallback (exclude user-specific endpoints)
    else if (url.pathname.startsWith('/api/')) {
      // Don't cache user-specific API calls to ensure fresh data
      if (url.pathname.includes('/user') || 
          url.pathname.includes('/profile') ||
          url.pathname.includes('/preferences') ||
          url.pathname.includes('/auth') ||
          url.pathname.includes('/chat')) {
        event.respondWith(fetch(request));
      } else {
        // Cache non-user-specific API calls
        event.respondWith(
          fetch(request)
            .then((response) => {
              const responseClone = response.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
              return response;
            })
            .catch(() => {
              return caches.match(request);
            })
        );
      }
    }
    // Other requests - cache first, network fallback
    else {
      event.respondWith(
        caches.match(request)
          .then((response) => {
            return response || fetch(request).then((fetchResponse) => {
              const responseClone = fetchResponse.clone();
              caches.open(DYNAMIC_CACHE).then((cache) => {
                cache.put(request, responseClone);
              });
              return fetchResponse;
            });
          })
          .catch(() => {
            // Return offline page if available
            if (request.destination === 'document') {
              return caches.match('/');
            }
          })
      );
    }
  }
});

// Background sync for offline functionality
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  // Handle background sync operations
  console.log('Background sync triggered');
}
