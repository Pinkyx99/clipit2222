const CACHE_NAME = "offline-cache-v1";
const OFFLINE_URLS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/styles.css", // if any
  "/main.js",    // if any
  "/icon-192.png",
  "/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
