/* Explicit, isolated, integrity-checked course download; unrelated caches are untouched. */
const PREFIX = 'khmerone-body-works-', META = PREFIX + 'metadata-v1';
const BASE = new URL('./',self.location.href), POINTER = new URL('offline-ready',BASE).href;
let busy = false;
self.addEventListener('install',event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event => event.waitUntil(self.clients.claim()));
function assetURL(path) {
  if (typeof path !== 'string' || path.startsWith('/') || path.includes('..') || path.includes('\\')) throw new Error('Invalid path');
  const url = new URL(path,BASE);
  if (url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname) || url.search || url.hash) throw new Error('Invalid URL');
  return url;
}
async function activePack() { const meta = await caches.open(META); const pointer = await meta.match(POINTER); return pointer ? pointer.json() : null; }
async function hash(bytes) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),value => value.toString(16).padStart(2,'0')).join(''); }
async function download(port) {
  if (busy) { port?.postMessage({ok:false}); port?.close(); return; }
  busy = true; let name, committed = false;
  try {
    const response = await fetch(new URL('offline-assets.json',BASE),{cache:'reload'});
    if (!response.ok) throw new Error('Manifest missing');
    const manifest = await response.json();
    if (!/^[a-f0-9]{16}$/.test(manifest.version) || !Array.isArray(manifest.assets) || manifest.assets.length < 9 || manifest.assets.length > 30) throw new Error('Invalid manifest');
    const paths = new Set(); let total = 0;
    for (const asset of manifest.assets) {
      assetURL(asset.path);
      if (!/^[a-f0-9]{64}$/.test(asset.sha256) || !Number.isSafeInteger(asset.bytes) || asset.bytes < 0 || asset.bytes > 2000000 || paths.has(asset.path)) throw new Error('Invalid asset');
      paths.add(asset.path); total += asset.bytes;
    }
    if (total !== manifest.totalBytes || total > 5000000) throw new Error('Invalid pack size');
    for (const path of ['index.html','course.css','course.js','lessons.js','state.js','CONTENT-LICENSE.txt','vendor/khmer-400.woff2','vendor/khmer-700.woff2','vendor/FONT-LICENSE.txt']) if (!paths.has(path)) throw new Error('Incomplete pack');
    name = PREFIX + 'pack-' + manifest.version + '-' + crypto.randomUUID(); const stage = await caches.open(name);
    for (const [index,asset] of manifest.assets.entries()) {
      const url = assetURL(asset.path), file = await fetch(url,{cache:'reload'});
      if (!file.ok) throw new Error('Missing file');
      const bytes = await file.clone().arrayBuffer();
      if (bytes.byteLength !== asset.bytes || await hash(bytes) !== asset.sha256) throw new Error('Integrity mismatch');
      await stage.put(url.href,file); port?.postMessage({progress:index + 1,total:manifest.assets.length});
    }
    await stage.put(new URL('offline-assets.json',BASE).href,new Response(JSON.stringify(manifest),{headers:{'Content-Type':'application/json'}}));
    const meta = await caches.open(META);
    await meta.put(POINTER,new Response(JSON.stringify({cache:name,version:manifest.version}),{headers:{'Content-Type':'application/json'}})); committed = true;
    try { for (const key of await caches.keys()) if (key.startsWith(PREFIX + 'pack-') && key !== name) await caches.delete(key); } catch { /* Keep a committed pack even if cleanup is blocked. */ }
    port?.postMessage({ok:true});
  } catch { if (name && !committed) await caches.delete(name).catch(() => {}); port?.postMessage({ok:false}); }
  finally { busy = false; port?.close(); }
}
self.addEventListener('message',event => { if (event.data?.type === 'DOWNLOAD_BODY_COURSE') event.waitUntil(download(event.ports?.[0])); });
self.addEventListener('fetch',event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;
  event.respondWith((async () => {
    try { const response = await fetch(event.request); if (response.ok) return response; throw new Error('Network unavailable'); }
    catch {
      try { const pointer = await activePack(); if (pointer) { const pack = await caches.open(pointer.cache); const path = url.pathname === BASE.pathname ? new URL('index.html',BASE).pathname : url.pathname; const cached = await pack.match(url.origin + path); if (cached) return cached; } } catch { /* Browser storage unavailable. */ }
      return new Response('Course unavailable offline. Connect and save the complete course pack first.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
    }
  })());
});
