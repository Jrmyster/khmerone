const CACHE = "khmerone-public-v41";
const PUBLIC_IMAGES = new Set([
  "/favicon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/cambodia-tomorrow-poster-320.webp",
  "/cambodia-tomorrow-poster-896.webp",
  "/museum-of-obsolete-systems.webp",
]);

self.addEventListener("install", (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(
      names
        .filter((name) => name.startsWith("khmerone-") && name !== CACHE)
        .map((name) => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (
    request.method !== "GET" ||
    url.origin !== self.location.origin ||
    url.search ||
    request.mode === "navigate" ||
    request.headers.has("Authorization") ||
    request.headers.has("Range") ||
    !PUBLIC_IMAGES.has(url.pathname)
  ) return;

  event.respondWith((async () => {
    let cache;
    try {
      cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      if (cached) return cached;
    } catch {
      // Continue through network if storage is unavailable
    }

    const response = await fetch(request);
    const cacheControl = response.headers.get("Cache-Control") || "";
    const contentType = response.headers.get("Content-Type") || "";

    if (
      cache &&
      response.status === 200 &&
      !response.redirected &&
      response.type === "basic" &&
      contentType.toLowerCase().startsWith("image/") &&
      !/\b(private|no-store)\b/i.test(cacheControl)
    ) {
      try {
        await cache.put(request, response.clone());
      } catch {
        // Continue serving response even if cache put fails
      }
    }

    return response;
  })());
});
