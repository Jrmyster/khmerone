/* Isolated optional pack: never touches Khmer One's other caches. */
const PREFIX='khmerone-microscope-',META=PREFIX+'metadata-v1';
const BASE=new URL('./',self.location.href),POINTER=new URL('offline-ready',BASE).href;
let busy=false;
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));
async function active(){const cache=await caches.open(META);const response=await cache.match(POINTER);return response?response.json():null;}
function assetURL(path){const url=new URL(path,BASE);if(url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname)||url.search||url.hash||path.includes('..'))throw new Error('Invalid asset path');return url;}
async function sha256(bytes){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');}
async function download(port){
 if(busy){port?.postMessage({ok:false,error:'busy'});return;}busy=true;let stageName,committed=false;
 try{
  const response=await fetch(new URL('offline-assets.json',BASE),{cache:'reload'});if(!response.ok)throw new Error('Manifest unavailable');const manifest=await response.json();
  if(!/^[a-f0-9]{16}$/.test(manifest.version)||!Array.isArray(manifest.assets)||manifest.assets.length<8||manifest.assets.length>50)throw new Error('Invalid manifest');
  const paths=new Set();for(const asset of manifest.assets){assetURL(asset.path);if(!/^[a-f0-9]{64}$/.test(asset.sha256)||!Number.isSafeInteger(asset.bytes)||asset.bytes<0||asset.bytes>10000000||paths.has(asset.path))throw new Error('Invalid asset');paths.add(asset.path);}
  for(const required of ['index.html','microscope.js','microscope.css','specimens.js','vendor/openseadragon.js','vendor/LICENSE.txt','assets/blood.jpg','assets/muscle.jpg','assets/kidney.jpg'])if(!paths.has(required))throw new Error('Incomplete manifest');
  stageName=PREFIX+'pack-'+manifest.version+'-'+crypto.randomUUID();const stage=await caches.open(stageName);
  for(const [i,asset]of manifest.assets.entries()){const url=assetURL(asset.path);const file=await fetch(url,{cache:'reload'});if(!file.ok)throw new Error('Asset unavailable');const bytes=await file.clone().arrayBuffer();if(bytes.byteLength!==asset.bytes||await sha256(bytes)!==asset.sha256)throw new Error('Asset integrity mismatch');await stage.put(url.href,file);port?.postMessage({progress:i+1,total:manifest.assets.length});}
  await stage.put(new URL('offline-assets.json',BASE).href,new Response(JSON.stringify(manifest),{headers:{'Content-Type':'application/json'}}));
  const meta=await caches.open(META);await meta.put(POINTER,new Response(JSON.stringify({cache:stageName,version:manifest.version}),{headers:{'Content-Type':'application/json'}}));committed=true;
  // Cleanup failure does not invalidate a fully committed pack.
  try{for(const name of await caches.keys())if(name.startsWith(PREFIX+'pack-')&&name!==stageName)await caches.delete(name);}catch{/* Leave old packs rather than damage the saved one. */}
  port?.postMessage({ok:true,version:manifest.version});
 }catch(error){if(stageName&&!committed)await caches.delete(stageName).catch(()=>{});port?.postMessage({ok:false,error:error.message});}
 finally{busy=false;port?.close();}
}
self.addEventListener('message',event=>{if(event.data?.type==='DOWNLOAD_MICROSCOPE')event.waitUntil(download(event.ports?.[0]));});
self.addEventListener('fetch',event=>{
 const url=new URL(event.request.url);if(event.request.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname))return;
 event.respondWith((async()=>{try{const response=await fetch(event.request);if(response.ok)return response;throw new Error('HTTP '+response.status);}catch{try{const info=await active();if(info){const cache=await caches.open(info.cache);const path=url.pathname===BASE.pathname?new URL('index.html',BASE).pathname:url.pathname;const saved=await cache.match(url.origin+path);if(saved)return saved;}}catch{/* Blocked storage cannot supply an offline response. */}return new Response('Microscope unavailable offline. Connect and save the complete microscope pack first.',{status:503,headers:{'Content-Type':'text/plain;charset=utf-8'}});}})());
});
