const CACHE_NAME = 'ipuc-agenda-v3'; // Incrementa la versión si haces cambios grandes
const urlsToCache = [
  './',
  './index.html',
  './comites.html',
  './eventos.json',
  './logo1.png',
  './manifest.json'
];

// 1. Instalación: Fuerza al Service Worker a instalarse de inmediato
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// 2. Activación: Borra las cachés viejas y toma el control de la app al instante
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Borrando caché antigua:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Intercepción de red: Red primero, respaldo en caché
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si hay internet, responde con la versión más reciente de la red
        return response;
      })
      .catch(() => {
        // Si no hay internet (offline), busca el archivo en la caché
        return caches.match(event.request);
      })
  );
});
