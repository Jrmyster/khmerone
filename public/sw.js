const CACHE = "khmerone-v11";
const CORE = ["/", "/api/catalog", "/manifest.webmanifest", "/favicon.svg", "/cambodia-tomorrow-poster-320.webp"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (event) => {
  event.waitUntil(Promise.all([
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))),
    self.clients.claim(),
  ]));
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  if (request.mode === "navigate") {
    event.respondWith(fetch(request).then((response) => {
      if (response.ok) { const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put("/", copy)); }
      return response;
    }).catch(async () => (await caches.match("/")) || Response.error()));
    return;
  }
  event.respondWith(caches.match(request).then((cached) => {
    const refresh = fetch(request).then((response) => {
      if (response.ok && (request.url.includes("/_next/") || request.url.includes("/assets/") || CORE.includes(new URL(request.url).pathname) || ["/museum-of-obsolete-systems.webp", "/cambodia-tomorrow-poster-896.webp"].includes(new URL(request.url).pathname))) {
        const copy = response.clone(); caches.open(CACHE).then((cache) => cache.put(request, copy));
      }
      return response;
    }).catch(() => cached || Response.error());
    return cached || refresh;
  }));
});
