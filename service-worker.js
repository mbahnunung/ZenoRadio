// Sets the cache name
const CACHE_NAME = 'web-radio-v1';

// List of files to be cached
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/img/cover.png',
  // Add other resources you want to cache here
];

// Install Service Worker and add cached files
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepts requests and serves cached files if available
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - returns response from cache
        if (response) {
          return response;
        }
        // Not found in cache - network search
        return fetch(event.request);
      }
    )
  );
});
