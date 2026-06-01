const CACHE_NAME = 'softyes-v1'
const OFFLINE_URLS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/sw.js'
]

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(OFFLINE_URLS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k=>k!==CACHE_NAME).map(k=>caches.delete(k))
    ))
  )
  self.clients.claim()
})

self.addEventListener('fetch', event => {
  const req = event.request
  // Only handle GET requests for same-origin
  if(req.method !== 'GET' || new URL(req.url).origin !== location.origin) return

  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(networkRes => {
      // Update cache in background
      caches.open(CACHE_NAME).then(cache=>cache.put(req, networkRes.clone()))
      return networkRes
    }).catch(()=>{
      // Fallback to offline index
      return caches.match('/index.html')
    }))
  )
})
