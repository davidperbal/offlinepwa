var CACHE_NAME = 'static-v1.1';
/*[
          '/',
          '/index.html',
          '/manifest.json',
          '/js/app.js',
          '/css/style.css'
      ]*/

var urlsToCache = [
  '.',
  'index.html',
  'manifest.json',
  'js/app.js',
  'css/style.css'
];

/**
 * Install PWA.
 */
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  )
});

/**
 * Active service worker.
 */
self.addEventListener('active', function activator(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys
        .filter(function(key) {
          return key.indexOf(CACHE_NAME) !== 0;
        })
        .map(function(key) {
          return caches.delete(key);
        })
      );
    })
  );
});

/**
 * Intercepet request cache.
 */
/*self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function (cachedResponse) {
      return cachedResponse || fetch(event.request);
    })
  );
});*/
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
    .then(function(response) {
      return response || fetchAndCache(event.request);
    })
  );
});

function fetchAndCache(url) {
  return fetch(url)
  .then(function(response) {
    // Check if we received a valid response
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return caches.open(CACHE_NAME)
    .then(function(cache) {
      cache.put(url, response.clone());
      return response;
    });
  })
  .catch(function(error) {
    console.log('Request failed:', error);
    // You could return a custom offline 404 page here
  });
}
