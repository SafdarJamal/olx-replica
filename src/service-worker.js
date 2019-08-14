'use strict';

const CACHE_NAME = 'olx-static-v1';
var filesToCache = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './libraries/bootstrap-4.3.1/css/bootstrap.min.css',
  './libraries/bootstrap-4.3.1/js/jquery-3.4.1.slim.min.js',
  './libraries/bootstrap-4.3.1/js/bootstrap.bundle.min.js',
  './libraries/bootstrap-4.3.1/js/bs-custom-file-input.min.js',
  './styles/style.css',
  './pages/signup.html',
  './pages/login.html',
  './pages/reset-password.html',
  './pages/post.html',
  './pages/my-ads.html',
  './pages/favorites.html',
  './scripts/app.js',
  './scripts/config.js',
  './scripts/validate.js',
  './scripts/authenticate.js',
  './scripts/post.js',
  './scripts/retrieve.js',
  './images/logo.png',
  './images/hero-bg-pk.jpg',
  './images/icons/fb.png',
  './images/icons/user.png',
  './images/icons/ad.png',
  './images/icons/star.png',
  './images/icons/positive.svg',
  './images/icons/negative.svg',
  './images/icons/back.png',
  './images/icons/logout.png',
  './images/favicons/favicon.png',
  './images/favicons/android-icon-48x48.png',
  './images/favicons/android-icon-72x72.png',
  './images/favicons/android-icon-96x96.png',
  './images/favicons/desktop-icon-144x144.png',
  './images/favicons/mstile-150x150.png',
  './images/favicons/android-chrome-192x192.png',
  './images/favicons/android-chrome-512x512.png',
  './images/favicons/apple-touch-icon.png'
];

self.addEventListener('install', event => {
  // Perform install steps
  console.log('SW installed');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(async cache => {
        // console.log('Opened cache');
        await cache.addAll(filesToCache);

        console.log('All files are cached.');
      })
      .catch(error => {
        console.log('Error occurred while caching: ', error);
      })
  );
});

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     (async function() {
//       const cache = await caches.open(CACHE_NAME);
//       const cachedResponse = await cache.match(event.request);
//       if (cachedResponse) return cachedResponse;
//       const networkResponse = await fetch(event.request);
//       event.waitUntil(cache.put(event.request, networkResponse.clone()));
//       return networkResponse;
//     })()
//   );
// });

// self.addEventListener('notificationclick', event => {
//   const notification = event.notification;
//   const primaryKey = notification.data.primaryKey;
//   const action = event.action;
//   // console.log(event);

//   if (action === 'close') {
//     notification.close();
//   } else {
//     clients.openWindow('http://localhost:8080');
//     notification.close();
//   }
//   console.log('Closed notification: ' + primaryKey);
// });

// self.addEventListener('notificationclose', event => {
//   const notification = event.notification;
//   const primaryKey = notification.data.primaryKey;
//   console.log('Closed notification: ' + primaryKey);
// });
