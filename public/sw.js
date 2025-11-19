// Service Worker para PWA
const CACHE_NAME = "gestao-ti-v1"
const urlsToCache = ["/", "/dashboard", "/offline.html", "/manifest.json"]

// Instalação do Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

// Estratégia de cache: Network first, falling back to cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match(event.request).then((response) => {
        if (response) {
          return response
        }

        // Para navegação, retorna a página offline
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html")
        }

        return Promise.reject("offline")
      })
    }),
  )
})

// Limpar caches antigos
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME]
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
