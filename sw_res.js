const cacheVersion = 'V1';
var CACHE_NAME = 'V1';
var urlsToCache = [
  './', 
  './register.js',
  './index.html',
  './restaurant.html',
  './data/restaurants.json', 
  './img/1.jpg',
  './img/2.jpg',
  './img/3.jpg',
  './img/4.jpg',
  './img/5.jpg',
  './img/6.jpg',
  './img/7.jpg',
  './img/8.jpg',
  './img/9.jpg',
  './img/10.jpg',
  './js/dbhelper.js',
  './js/main.js', 
  './js/restaurant_info.js', 
  './css/styles.css',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js'
]

//logging
const log = msg => {
  console.log(`[ServiceWorker ${cacheVersion}] ${msg}`);
}


//install
self.addEventListener('install', function (event) {
  self.skipWaiting();
  log('install');
  console.log('install !!!');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function (cache) {
        console.log('Opened cache');
        log('caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

//Activate Event
self.addEventListener("activate", e => {
  log('activate');
  console.log('activate !!!');
  e.waitUntil(
    caches.keys().then(cacheVersions => {
      return Promise.all(
        cacheVersions.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

//fetch
self.addEventListener('fetch', function (event) {
  log('fetch');
  event.respondWith(
    caches.match(event.request).then(function (response) {

      if (response) {
        return response;
      }

      var request = event.request.clone();

      if (request.mode !== 'navigate' && request.url.indexOf(request.referrer) === -1) {
        request = new Request(request, { mode: 'no-cors' })
      }

      return fetch(request).then(function (httpRes) {

        if (!httpRes || (httpRes.status !== 200 && httpRes.status !== 304 && httpRes.type !== 'opaque') || request.method === 'POST') {
          return httpRes;
        }

        var responseClone = httpRes.clone();
        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseClone);
        });

        return httpRes;
      });
    })
  );
});






/*
const log = msg => {
  console.log(`[ServiceWorker ${_version}] ${msg}`);
}

self.addEventListener('install', event => {
  self.skipWaiting();
  log('install');
  event.waitUntil(
  caches.open(cacheName).then(cache => {
    log('caching app shell');
    return cache.addAll(cacheList);
  })
  )
});

self.addEventListener('activate', event => {
  log('activate');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key =>{
        if(key !== cacheName){
          log('removing old cache' + key);
          return caches.delete(key);
        }
      }))
    })
  )
});

self.addEventListener(`fetch`, event =>{
  log('fetch' + event.request.url);
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch (event.request);
    })
  )
}); */











