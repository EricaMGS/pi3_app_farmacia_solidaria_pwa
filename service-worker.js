const CACHE_NAME = 'farmacia-solidaria-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/api_recall.html',
  '/api_tylenol.html',
  '/dados.html',
  '/app_recall.js',
  '/app_tylenol.js',
  '/Imagens/medicamento.png',
  '/Imagens/caixamedicamentos.png',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch (Interceptação de Requisições)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});