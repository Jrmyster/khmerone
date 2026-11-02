/* Isolated, explicit offline pack. Other Khmer One caches are never removed. */
const PREFIX = 'khmerone-brain-explorer-', META = PREFIX + 'metadata-v1';
const BASE = new URL('./', self.location.href), POINTER = new URL('offline-ready', BASE).href;
let busy = false;
self.addEventListener('install', event => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));
async function active() { const cache = await caches.open(META); const response = await cache.match(POINTER); return response ? response.json() : null; }
function assetURL(path) {
  if (typeof path !== 'string' || path.includes('..') || path.startsWith('/')) throw new Error('Invalid asset path');
  const url = new URL(path, BASE);
  if (url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname) || url.search || url.hash) throw new Error('Invalid asset URL');
  return url;
}
async function sha256(bytes) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), b => b.toString(16).padStart(2, '0')).join(''); }
async function download(port) {
  if (busy) { port?.postMessage({ok:false,error:'busy'}); return; }
  busy = true; let name, committed = false;
  try {
    const response = await fetch(new URL('offline-assets.json', BASE), {cache:'reload'});
    if (!response.ok) throw new Error('Manifest unavailable');
    const manifest = await response.json();
    if (!/^[a-f0-9]{16}$/.test(manifest.version) || !Array.isArray(manifest.assets) || manifest.assets.length < 10 || manifest.assets.length > 60) throw new Error('Invalid manifest');
    const paths = new Set(); let total = 0;
    for (const asset of manifest.assets) {
      assetURL(asset.path);
      if (!/^[a-f0-9]{64}$/.test(asset.sha256) || !Number.isSafeInteger(asset.bytes) || asset.bytes < 0 || asset.bytes > 15000000 || paths.has(asset.path)) throw new Error('Invalid asset');
      paths.add(asset.path); total += asset.bytes;
    }
    if (total > 40000000 || total !== manifest.totalBytes) throw new Error('Invalid pack size');
    for (const path of ['index.html','brain.js','brain.css','lesson.js','MNI-LICENSE.txt','vendor/niivue.js','vendor/NIIVUE-LICENSE.txt','vendor/khmer-400.woff2','vendor/khmer-700.woff2','vendor/FONT-LICENSE.txt','assets/mni152.nii.gz']) if (!paths.has(path)) throw new Error('Incomplete manifest');
    name = PREFIX + 'pack-' + manifest.version + '-' + crypto.randomUUID(); const stage = await caches.open(name);
    for (const [index,asset] of manifest.assets.entries()) {
      const url = assetURL(asset.path), file = await fetch(url, {cache:'reload'});
      if (!file.ok) throw new Error('Asset unavailable');
      const bytes = await file.clone().arrayBuffer();
      if (bytes.byteLength !== asset.bytes || await sha256(bytes) !== asset.sha256) throw new Error('Integrity mismatch');
      await stage.put(url.href, file); port?.postMessage({progress:index + 1,total:manifest.assets.length});
    }
    await stage.put(new URL('offline-assets.json', BASE).href, new Response(JSON.stringify(manifest), {headers:{'Content-Type':'application/json'}}));
    const meta = await caches.open(META);
    await meta.put(POINTER, new Response(JSON.stringify({cache:name,version:manifest.version}), {headers:{'Content-Type':'application/json'}})); committed = true;
    try { for (const previous of await caches.keys()) if (previous.startsWith(PREFIX + 'pack-') && previous !== name) await caches.delete(previous); } catch { /* A committed pack remains valid if cleanup fails. */ }
    port?.postMessage({ok:true,version:manifest.version});
  } catch (error) {
    if (name && !committed) await caches.delete(name).catch(() => {});
    port?.postMessage({ok:false,error:error.message});
  } finally { busy = false; port?.close(); }
}
self.addEventListener('message', event => { if (event.data?.type === 'DOWNLOAD_BRAIN_PACK') event.waitUntil(download(event.ports?.[0])); });
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== BASE.origin || !url.pathname.startsWith(BASE.pathname)) return;
  event.respondWith((async () => {
    try { const response = await fetch(event.request); if (response.ok) return response; throw new Error('Network response unavailable'); }
    catch {
      try { const info = await active(); if (info) { const cache = await caches.open(info.cache); const path = url.pathname === BASE.pathname ? new URL('index.html',BASE).pathname : url.pathname; const saved = await cache.match(url.origin + path); if (saved) return saved; } } catch { /* Storage unavailable. */ }
      return new Response('Brain explorer is unavailable offline. Connect and save the complete pack first.', {status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});
    }
  })());
});
