// Self-contained text course. Fetch only the pinned Khmer font archive; no install scripts.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
const base = resolve(dirname(fileURLToPath(import.meta.url)),'../public/body-works');
const fontURL = 'https://registry.npmjs.org/@fontsource/noto-sans-khmer/-/noto-sans-khmer-5.2.5.tgz';
const integrity = 'sha512-jguA0+b/wd8uJWUrqp1GEZiJ668wXDriup/RwZETrpEE5UESPihS+xIKDKplF/6oJn4c3jlDKT8WRKbSKHPsgA==';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
async function download() {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(fontURL,{signal:AbortSignal.timeout(45000)});
      if (!response.ok || Number(response.headers.get('content-length')) > 5000000) throw new Error('Font download unavailable');
      const chunks = []; let size = 0;
      for await (const chunk of response.body) { size += chunk.length; if (size > 5000000) throw new Error('Oversized font archive'); chunks.push(chunk); }
      return Buffer.concat(chunks);
    } catch (error) { if (attempt === 2) throw error; }
  }
}
function entries(bytes) {
  const files = [];
  for (let offset = 0; offset + 512 <= bytes.length;) {
    const header = bytes.subarray(offset,offset + 512);
    if (header.every(byte => byte === 0)) break;
    const field = (start,end) => header.subarray(start,end).toString('utf8').replace(/\0.*$/s,'');
    const name = field(0,100), type = field(156,157), size = parseInt(field(124,136).trim() || '0',8);
    if (!Number.isSafeInteger(size) || size < 0 || offset + 512 + size > bytes.length) throw new Error('Invalid tar archive');
    if (type === '0' || type === '') files.push({name,bytes:bytes.subarray(offset + 512,offset + 512 + size)});
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return files;
}
const archive = await download();
if ('sha512-' + createHash('sha512').update(archive).digest('base64') !== integrity) throw new Error('Font archive integrity mismatch');
const files = entries(gunzipSync(archive,{maxOutputLength:15000000}));
await mkdir(join(base,'vendor'),{recursive:true});
for (const weight of [400,700]) {
  const file = files.find(file => file.name.endsWith(`/files/noto-sans-khmer-khmer-${weight}-normal.woff2`));
  if (!file || file.bytes.subarray(0,4).toString() !== 'wOF2') throw new Error('Missing Khmer font');
  await writeFile(join(base,'vendor',`khmer-${weight}.woff2`),file.bytes);
}
const license = files.find(file => /\/LICENSE(?:\.txt)?$/.test(file.name));
if (!license || !license.bytes.toString().includes('SIL OPEN FONT LICENSE')) throw new Error('Font license missing');
await writeFile(join(base,'vendor','FONT-LICENSE.txt'),license.bytes);
const assets = [];
async function scan(directory) {
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    if (entry.name.startsWith('.')) continue;
    const file = join(directory,entry.name);
    if (entry.isDirectory()) { await scan(file); continue; }
    const path = relative(base,file).replaceAll('\\','/');
    if (['offline-assets.json','sw.js'].includes(path)) continue;
    const bytes = await readFile(file); assets.push({path,bytes:bytes.length,sha256:hash(bytes)});
  }
}
await scan(base); assets.sort((a,b) => a.path.localeCompare(b.path));
const manifest = {version:hash(JSON.stringify(assets)).slice(0,16),totalBytes:assets.reduce((sum,asset) => sum + asset.bytes,0),assets};
await writeFile(join(base,'offline-assets.json'),JSON.stringify(manifest,null,2) + '\n');
console.log(`Body Works: six lessons; ${assets.length} offline files; ${(manifest.totalBytes/1000000).toFixed(2)} MB. Khmer fonts self-hosted; no external runtime.`);
