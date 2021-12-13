importScripts('/assets/js/idb.js');
importScripts('/assets/js/db.js');

var CACHE_STATIC = 'pre-cache-v22';
var CACHE_DYNAMIC = 'dynamic-cache-v6';

// pre-cache
var STATIC_FILES = [
  '/',
  '/index.html',
  '/assets/js/index.js',
  '/assets/js/idb.js',
  '/assets/js/db.js',
  '/assets/css/index.css',
  '/assets/images/icon-72x72.png',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js',
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_STATIC).then(function (cache) {
      return cache.addAll(STATIC_FILES);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(
        keyList.map(function (key) {
          if (key !== CACHE_STATIC && key !== CACHE_DYNAMIC) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  var omdbApi = 'http://www.omdbapi.com/?apikey=8758472a';
  if (event.request.url.indexOf(omdbApi) > -1) {
    event.respondWith(
      fetch(event.request.url).then(function (res) {
        var _res = res.clone();
        _res.json().then(function (data) {
          data.Search.forEach(function (item) {
            writeData('movies', item);
          });
        });
        return res;
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then(function (res) {
        if (res) {
          return res;
        } else {
          return fetch(event.request).then(function (resOnline) {
            return caches.open(CACHE_DYNAMIC).then(function (cache) {
              cache.put(event.request.url, resOnline.clone());
              return resOnline;
            });
          });
        }
      })
    );
  }
});
