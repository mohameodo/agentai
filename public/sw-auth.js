// Service Worker for enhanced caching and offline support
// This helps with authentication persistence and better user experience

const CACHE_NAME = 'agentai-v1'
const STATIC_CACHE_NAME = 'agentai-static-v1'

// Cache static assets
const STATIC_ASSETS = [
  '/',
  '/manifest.json',
  '/icon-512x512.png',
  '/icon.png',
]

// Cache Firebase auth tokens and user data
const AUTH_CACHE_KEY = 'firebase-auth-cache'

self.addEventListener('install', (event) => {
  console.log('Service Worker installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => {
        return self.skipWaiting()
      })
  )
})

self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME && name !== STATIC_CACHE_NAME) {
            console.log('Deleting old cache:', name)
            return caches.delete(name)
          }
        })
      )
    }).then(() => {
      return self.clients.claim()
    })
  )
})

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Handle Firebase Auth requests specially
  if (url.pathname.includes('firebase') || url.pathname.includes('auth')) {
    // Don't cache auth requests, but ensure they work offline
    event.respondWith(
      fetch(request).catch(() => {
        // If offline, return a proper response for auth
        return new Response(JSON.stringify({ offline: true }), {
          headers: { 'Content-Type': 'application/json' }
        })
      })
    )
    return
  }

  // Handle static assets
  if (request.destination === 'image' || request.destination === 'script' || request.destination === 'style') {
    event.respondWith(
      caches.match(request).then((response) => {
        if (response) {
          return response
        }
        return fetch(request).then((response) => {
          const responseClone = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone)
          })
          return response
        })
      })
    )
    return
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/').then((response) => {
          return response || new Response('Offline', { status: 503 })
        })
      })
    )
    return
  }
})

// Listen for messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data && event.data.type === 'CACHE_AUTH_DATA') {
    // Cache authentication data for persistence
    const authData = event.data.payload
    self.caches.open(AUTH_CACHE_KEY).then((cache) => {
      cache.put('/auth-data', new Response(JSON.stringify(authData)))
    })
  }
})
