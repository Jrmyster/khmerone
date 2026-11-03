/* Only the explicitly downloaded public Learning Labs activity pack is cached. */
const CACHE = 'ko-learning-labs-v1';
const BASE = new URL('./', self.location.href);
const MARKER = new URL('offline-ready', BASE).href;
let downloading;

self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

async function downloadPack(report) {
  const manifestResponse = await fetch(new URL('offline-assets.json', BASE), {cache:'no-store'});
  if (!manifestResponse.ok) throw new Error('Manifest unavailable');
  const manifest = await manifestResponse.json();
  if (!Array.isArray(manifest.assets) || !manifest.assets.length) throw new Error('Empty activity pack');
  const stagingName = `${CACHE}-installing`;
  await caches.delete(stagingName);
  const staging = await caches.open(stagingName);
  let done = 0;
  try {
    for (let start = 0; start < manifest.assets.length; start += 4) {
      await Promise.all(manifest.assets.slice(start, start + 4).map(async asset => {
        const url = new URL(asset.path, BASE);
        if (url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) throw new Error('Invalid activity path');
        const response = await fetch(url, {cache:'reload'});
        if (!response.ok) throw new Error(`Missing activity file: ${asset.path}`);
        const bytes = await response.clone().arrayBuffer();
        const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), n => n.toString(16).padStart(2,'0')).join('');
        if (hash !== asset.sha256) throw new Error(`Activity file changed: ${asset.path}`);
        await staging.put(url, response);
        report({progress:++done, total:manifest.assets.length});
      }));
    }
    const cache = await caches.open(CACHE);
    await cache.delete(MARKER);
    for (const request of await staging.keys()) await cache.put(request, await staging.match(request));
    await cache.put(MARKER, new Response(JSON.stringify({savedAt:new Date().toISOString(), version:manifest.version}), {headers:{'Content-Type':'application/json'}}));
  } finally {
    await caches.delete(stagingName);
  }
}

self.addEventListener('message', event => {
  if (event.data?.type !== 'DOWNLOAD_LEARNING_PACK' || !event.ports[0]) return;
  const port = event.ports[0];
  const task = async () => {
    try {
      if (downloading) await downloading;
      else {
        downloading = downloadPack(data => port.postMessage(data));
        try { await downloading; } finally { downloading = undefined; }
      }
      port.postMessage({ok:true});
    } catch {
      port.postMessage({ok:false});
    } finally { port.close(); }
  };
  event.waitUntil(task());
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;
  if (url.pathname.endsWith('/sw.js') || url.pathname.endsWith('/offline-assets.json')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const lookup = url.pathname === BASE.pathname ? new URL('index.html', BASE).href : event.request;
    const cached = await cache.match(lookup, {ignoreSearch:true});
    try {
      const response = await fetch(event.request);
      if (response.status < 500 || !cached) return response;
    } catch (error) {
      if (!cached) throw error;
    }
    // A navigation cannot replay a response that followed Cloudflare's HTML redirect.
    return cached.redirected ? new Response(cached.body, cached) : cached;
  })());
});
