// Reproducible viewer, fonts and licensed teaching photographs.
// Downloads are allowlisted; upstream install scripts are never executed.
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { resolve, dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { specimens } from '../public/virtual-microscope/specimens.js';
const base = resolve(dirname(fileURLToPath(import.meta.url)), '../public/virtual-microscope');
const viewerURL = 'https://github.com/openseadragon/openseadragon/releases/download/v6.1.1/openseadragon-bin-6.1.1.tar.gz';
const viewerSHA256 = 'bfd1e323669c56917306011b118d478a48a9527e1544e45469f420a409d198bf';
const fontURL = 'https://registry.npmjs.org/@fontsource/noto-sans-khmer/-/noto-sans-khmer-5.2.5.tgz';
const fontIntegrity = 'sha512-jguA0+b/wd8uJWUrqp1GEZiJ668wXDriup/RwZETrpEE5UESPihS+xIKDKplF/6oJn4c3jlDKT8WRKbSKHPsgA==';
// Hashes captured from the original, dimension-checked CC0 images in validation.
const sourceHashes = {
  muscle: 'a97d7f3013afe96d0ae6028c26183507d35183ccb6df7e94d2de9fc5f905ba7c',
  blood: 'e2d9199874c5483dcee224cdb79ba19b7fa776d8efeb995a114bd2085e0c6dfd',
  kidney: 'b4ba208e7ec00099622fa689f6c27857a323b67c6c00a0c4cc5dac6488b6a5c2',
};
const hash = (bytes, algorithm = 'sha256') => createHash(algorithm).update(bytes).digest('hex');
async function download(url, maxBytes) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(60000), headers: { 'User-Agent': 'KhmerOne-Education/1.0 (+https://khmerone.com)' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${url}`);
      if (Number(response.headers.get('content-length')) > maxBytes) throw new Error('Oversized download');
      const chunks = []; let size = 0;
      for await (const chunk of response.body) { size += chunk.length; if (size > maxBytes) throw new Error('Oversized download'); chunks.push(chunk); }
      return Buffer.concat(chunks);
    } catch (error) { if (attempt === 2) throw error; await new Promise(resolve => setTimeout(resolve, 2000 * (attempt + 1))); }
  }
}
function unpack(buffer) {
  const files = [];
  for (let offset = 0; offset + 512 <= buffer.length;) {
    const header = buffer.subarray(offset, offset + 512);
    if (header.every(byte => byte === 0)) break;
    const str = (a, b) => header.subarray(a, b).toString('utf8').replace(/\0.*$/s, '');
    const name = str(0, 100), size = parseInt(str(124, 136).trim() || '0', 8), type = str(156, 157);
    if (!Number.isSafeInteger(size) || size < 0 || offset + 512 + size > buffer.length) throw new Error('Invalid tar archive');
    if (type === '0' || type === '') files.push({ name, bytes: buffer.subarray(offset + 512, offset + 512 + size) });
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return files;
}
function jpegDimensions(buffer) {
  if (buffer[0] !== 255 || buffer[1] !== 216) throw new Error('Expected JPEG');
  let offset = 2;
  while (offset + 9 < buffer.length) {
    if (buffer[offset] !== 255) throw new Error('Invalid JPEG marker');
    while (buffer[offset] === 255) offset++;
    const marker = buffer[offset++];
    if (marker === 217 || marker === 218) break;
    if (marker === 1 || (marker >= 208 && marker <= 215)) continue;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) throw new Error('Invalid JPEG segment');
    if ([192,193,194,195,197,198,199,201,202,203,205,206,207].includes(marker)) return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3) };
    offset += length;
  }
  throw new Error('JPEG dimensions unavailable');
}
await mkdir(join(base, 'vendor'), { recursive: true });
await mkdir(join(base, 'assets'), { recursive: true });
const archive = await download(viewerURL, 2000000);
if (hash(archive) !== viewerSHA256) throw new Error('OpenSeadragon release integrity mismatch');
const entries = unpack(gunzipSync(archive, { maxOutputLength: 15000000 }));
for (const [input, output] of [['openseadragon.min.js','openseadragon.js'], ['LICENSE.txt','LICENSE.txt']]) {
  const entry = entries.find(file => file.name.split('/').pop() === input);
  if (!entry) throw new Error(`Missing ${input} in pinned release`);
  await writeFile(join(base, 'vendor', output), entry.bytes);
}
await rm(join(base, 'vendor', '.release.tar.gz'), { force: true });
// Keep Khmer shaping consistent on devices that lack a suitable local font.
const fontArchive = await download(fontURL, 5000000);
if ('sha512-' + createHash('sha512').update(fontArchive).digest('base64') !== fontIntegrity) throw new Error('Khmer font package integrity mismatch');
const fontEntries = unpack(gunzipSync(fontArchive, { maxOutputLength: 15000000 }));
for (const weight of [400, 700]) {
  const font = fontEntries.find(file => file.name.endsWith(`/files/noto-sans-khmer-khmer-${weight}-normal.woff2`));
  if (!font || font.bytes.subarray(0,4).toString() !== 'wOF2') throw new Error(`Missing Khmer ${weight} font`);
  await writeFile(join(base, 'vendor', `khmer-${weight}.woff2`), font.bytes);
}
const fontLicense = fontEntries.find(file => /\/LICENSE(?:\.txt)?$/.test(file.name));
if (!fontLicense || !fontLicense.bytes.toString('utf8').includes('SIL OPEN FONT LICENSE')) throw new Error('Font license missing');
await writeFile(join(base, 'vendor', 'FONT-LICENSE.txt'), fontLicense.bytes);
for (const specimen of specimens) {
  if (specimen.license !== 'CC0-1.0' || new URL(specimen.original).hostname !== 'upload.wikimedia.org' || !/^assets\/[a-z]+\.jpg$/.test(specimen.image) || !sourceHashes[specimen.id]) throw new Error('Unreviewed image source');
  let bytes;
  try { bytes = await readFile(join(base, specimen.image)); if (hash(bytes) !== sourceHashes[specimen.id]) bytes = null; } catch { /* Initial build. */ }
  bytes ||= await download(specimen.original, 9000000);
  const dimensions = jpegDimensions(bytes);
  if (dimensions.width !== specimen.width || dimensions.height !== specimen.height) throw new Error(`Image dimensions changed: ${specimen.id}`);
  if (hash(bytes) !== sourceHashes[specimen.id]) throw new Error(`Image SHA256 mismatch: ${specimen.id}`);
  await writeFile(join(base, specimen.image), bytes);
  console.log(JSON.stringify({ specimen: specimen.id, bytes: bytes.length, sha256: hash(bytes), ...dimensions }));
}
const assets = [];
async function scan(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const file = join(directory, entry.name);
    if (entry.isDirectory()) { await scan(file); continue; }
    const path = relative(base, file).replaceAll('\\', '/');
    if (path === 'offline-assets.json' || path === 'sw.js') continue;
    const bytes = await readFile(file);
    assets.push({ path, bytes: bytes.length, sha256: hash(bytes) });
  }
}
await scan(base); assets.sort((a,b) => a.path.localeCompare(b.path));
const version = hash(JSON.stringify(assets)).slice(0,16);
const manifest = { version, totalBytes: assets.reduce((sum,a) => sum+a.bytes,0), assets };
await writeFile(join(base,'offline-assets.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Virtual microscope ${version}: ${assets.length} files, ${(manifest.totalBytes/1000000).toFixed(1)} MB. Images CC0; OpenSeadragon 6.1.1 BSD-3-Clause; Noto Sans Khmer OFL-1.1.`);
