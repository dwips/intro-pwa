var CACHE_STATIC = 'pre-cache-v1';
var CACHE_DYNAMIC = 'dynamic-v1';

// pre-cache
var STATIC_FILES = [
  '/',
  '/index.html',
  '/assets/js/index.js',
  '/assets/css/index.css',
  '/assets/images/icon-72x72.png',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
];

self.addEventListener('install', function (event) {
  console.log('Installing Service Worker event');
  event.waitUntil(
    caches.open(CACHE_STATIC).then(function (cache) {
      console.log('Pre-cache');
      return cache.addAll(STATIC_FILES);
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('Activate service worker event');
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_STATIC && key !== CACHE_DYNAMIC) {
            console.log('Removing old cache.', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  console.log('Intercept fetch event');

  event.respondWith(
    caches.match(event.request).then(function (res) {
      console.log(res);

      if (res) {
        return res;
      } else {
        return fetch(event.request).then(function (resOnline) {
          console.log('fetch online', resOnline);
          return caches.open(CACHE_DYNAMIC).then(function (cache) {
            cache.put(event.request.url, resOnline.clone());
            return resOnline;
          });
        });
      }
    })
  );
});
