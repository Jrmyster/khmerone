const CACHE = "khmerone-public-v42";
const TOOLKIT_CACHE = "khmerone-teacher-toolkit-v1";
const isToolkitAsset = (path) => /^(\/assets\/|\/_next\/static\/).+\.(js|css|woff2?|ttf)$/.test(path);
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
        .filter((name) => name.startsWith("khmerone-") && name !== CACHE && name !== TOOLKIT_CACHE)
        .map((name) => caches.delete(name))
    );
    await self.clients.claim();
  })());
});

self.addEventListener("message", (event) => {
  if (event.data?.type !== "PREPARE_TEACHER_TOOLKIT" || !event.ports[0]) return;
  event.waitUntil((async () => {
    try {
      const manifestResponse = await fetch("/toolkit-offline-assets.json", { cache: "reload", credentials: "omit" });
      if (!manifestResponse.ok) throw new Error("Manifest unavailable");
      const manifest = await manifestResponse.json();
      if (!Array.isArray(manifest.assets) || !manifest.assets.length || manifest.assets.length > 300 || manifest.assets.some((path) => typeof path !== "string" || !isToolkitAsset(path) || path.includes("..") || path.includes("?"))) throw new Error("Invalid asset manifest");
      const cache = await caches.open(TOOLKIT_CACHE);
      const queue = [...manifest.assets];
      await Promise.all(Array.from({ length: Math.min(6, queue.length) }, async () => {
        while (queue.length) {
          const path = queue.shift();
          const response = await fetch(path, { credentials: "omit", cache: "reload" });
          if (!response.ok || response.redirected || /\b(private|no-store)\b/i.test(response.headers.get("Cache-Control") || "")) throw new Error("Asset download failed");
          await cache.put(path, response);
        }
      }));
      const page = await fetch("/teacher-toolkit", { credentials: "omit", cache: "reload" });
      if (!page.ok || page.redirected || !(page.headers.get("Content-Type") || "").includes("text/html")) throw new Error("Toolkit unavailable");
      // Write the page last: its presence marks a fully prepared offline copy.
      await cache.put("/teacher-toolkit", page);
      event.ports[0].postMessage({ ok: true });
    } catch { event.ports[0].postMessage({ ok: false }); }
  })());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method === "GET" && url.origin === self.location.origin && request.mode === "navigate" && url.pathname.replace(/\/$/, "") === "/teacher-toolkit" && !request.headers.has("Authorization")) {
    event.respondWith((async () => {
      try { const response = await fetch(request); if (response.ok) return response; } catch { /* Use the prepared copy. */ }
      try {
        const cache = await caches.open(TOOLKIT_CACHE);
        const cached = await cache.match("/teacher-toolkit");
        if (cached) return cached;
      } catch { /* Storage may be unavailable. */ }
      return new Response("Open Teacher Toolkit while online and choose Make available offline first.", { status: 503, headers: { "Content-Type": "text/plain;charset=utf-8" } });
    })());
    return;
  }

  if (request.method === "GET" && url.origin === self.location.origin && !url.search && isToolkitAsset(url.pathname) && !request.headers.has("Authorization") && !request.headers.has("Range")) {
    event.respondWith((async () => {
      try {
        const cache = await caches.open(TOOLKIT_CACHE);
        const cached = await cache.match(request);
        if (cached) return cached;
      } catch { /* Online use must still work when cache storage is blocked. */ }
      return fetch(request);
    })());
    return;
  }

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
