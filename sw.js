const CACHE_NAME = 'eclipse-rpg-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Instalación: fuerza al nuevo worker a instalarse inmediatamente
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Activación: limpia cualquier caché antigua (como la v1)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }))
    )
  );
  self.clients.claim(); // Toma el control de la app de inmediato
});

// Fetch: ESTRATEGIA "NETWORK FIRST" (Prioridad a la red, resguardo en caché)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Si hay internet, guarda la nueva versión en caché y muéstrala
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
      .catch(() => {
        // Si no hay internet, busca en la caché
        return caches.match(event.request);
      })
  );
});