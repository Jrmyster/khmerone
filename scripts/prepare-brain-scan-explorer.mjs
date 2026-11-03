// Prepare a fixed reference MRI and browser-only runtime. No upstream install scripts.
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, resolve, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { dataset } from '../public/brain-scan-explorer/lesson.js';
const base = resolve(dirname(fileURLToPath(import.meta.url)), '../public/brain-scan-explorer');
const version = '0.69.0';
const archiveURL = 'https://registry.npmjs.org/@niivue/niivue/-/niivue-0.69.0.tgz';
const pinnedIntegrity = 'sha512-YMjQvJgD1W2b7DuoxkwlC4VxbrgIePRJ5qyQzXKxi2v2MBVg285P/CIQyg46oDDGDIcaNlbd+MhtO/edMbXJkA==';
const fontURL = 'https://registry.npmjs.org/@fontsource/noto-sans-khmer/-/noto-sans-khmer-5.2.5.tgz';
const fontIntegrity = 'sha512-jguA0+b/wd8uJWUrqp1GEZiJ668wXDriup/RwZETrpEE5UESPihS+xIKDKplF/6oJn4c3jlDKT8WRKbSKHPsgA==';
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const integrity = bytes => 'sha512-' + createHash('sha512').update(bytes).digest('base64');
async function download(url, maximum) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const response = await fetch(url, {signal:AbortSignal.timeout(90000)});
      if (!response.ok) throw new Error(`Download HTTP ${response.status}: ${url}`);
      const chunks = []; let length = 0;
      for await (const chunk of response.body) { length += chunk.length; if (length > maximum) throw new Error('Download too large'); chunks.push(chunk); }
      return Buffer.concat(chunks);
    } catch (error) { if (attempt === 2) throw error; await new Promise(resolve => setTimeout(resolve,1000 * (attempt + 1))); }
  }
}
function unpack(archive) {
  const buffer = gunzipSync(archive, {maxOutputLength:200000000}), entries = [];
  for (let offset = 0; offset + 512 <= buffer.length;) {
    const header = buffer.subarray(offset,offset + 512);
    if (header.every(byte => byte === 0)) break;
    const str = (a,b) => header.subarray(a,b).toString().replace(/\0.*$/s,'');
    const prefix = str(345,500), name = (prefix ? prefix + '/' : '') + str(0,100), type = str(156,157);
    const size = parseInt(str(124,136).trim() || '0',8);
    if (!Number.isSafeInteger(size) || size < 0 || offset + 512 + size > buffer.length) throw new Error('Invalid package archive');
    if (name.split('/').includes('..') || name.startsWith('/') || name.includes('\\')) throw new Error('Invalid package path');
    if (type === '0' || type === '') entries.push({name, bytes:buffer.subarray(offset + 512,offset + 512 + size)});
    offset += 512 + Math.ceil(size / 512) * 512;
  }
  return entries;
}
await mkdir(join(base,'vendor'),{recursive:true}); await mkdir(join(base,'assets'),{recursive:true});
const archive = await download(archiveURL,60000000);
if (integrity(archive) !== pinnedIntegrity) throw new Error('NiiVue archive integrity mismatch');
console.log('NIIVUE_PIN', JSON.stringify({version, integrity:integrity(archive), tarball:archiveURL}));
const entries = unpack(archive);
const encoded = entries.find(e => e.name === 'package/build/index.min.js');
if (!encoded) throw new Error('Missing self-contained NiiVue browser module');
// Decode the published HTML-embedding ESM as data, never eval.
const wrapper = encoded.bytes.toString('utf8');
const match = wrapper.match(/^\s*export\s+const\s+esm\s*=\s*("(?:[^"\\]|\\.)*")\s*;?\s*$/s);
if (!match) throw new Error('Unexpected NiiVue encoded ESM format');
const moduleSource = decodeURIComponent(JSON.parse(match[1]));
if (!moduleSource.includes('Niivue') || /\bfrom\s*["'](?:@|\.\/|\.\.\/)/.test(moduleSource)) throw new Error('NiiVue module is not self-contained');
await writeFile(join(base,'vendor','niivue.js'),moduleSource);
// npm omits the repository-root LICENSE. Retain the exact upstream v0.69.0 notice.
const license = await readFile(join(base,'NIIVUE-LICENSE.txt'),'utf8');
const licenseGitHash = createHash('sha1').update(`blob ${Buffer.byteLength(license)}\0`).update(license).digest('hex');
if (licenseGitHash !== 'a592d66dc5dbde86b58200ef9145f9b3e12b55f7') throw new Error('Upstream license changed');
const notices = moduleSource.match(/\/\*![\s\S]*?\*\//g) || [];
await writeFile(join(base,'vendor','NIIVUE-LICENSE.txt'),license + '\n\nBundled module notices (also retained in the unmodified module):\n\n' + notices.join('\n\n'));
console.log('NIIVUE_MODULE',JSON.stringify({bytes:Buffer.byteLength(moduleSource),retainedNotices:notices.length}));
const fontArchive = await download(fontURL,5000000);
if (integrity(fontArchive) !== fontIntegrity) throw new Error('Font integrity mismatch');
const fonts = unpack(fontArchive);
for (const weight of [400,700]) {
  const font = fonts.find(e => e.name.endsWith(`/files/noto-sans-khmer-khmer-${weight}-normal.woff2`));
  if (!font || font.bytes.subarray(0,4).toString() !== 'wOF2') throw new Error('Missing Khmer font');
  await writeFile(join(base,'vendor',`khmer-${weight}.woff2`),font.bytes);
}
const fontLicense = fonts.find(e => /\/LICENSE(?:\.txt)?$/.test(e.name));
if (!fontLicense || !fontLicense.bytes.toString().includes('SIL OPEN FONT LICENSE')) throw new Error('Missing font license');
await writeFile(join(base,'vendor','FONT-LICENSE.txt'),fontLicense.bytes);
let scan;
try { scan = await readFile(join(base,dataset.file)); } catch { /* Initial build. */ }
const gitHash = bytes => createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
if (!scan || scan.length !== dataset.bytes || gitHash(scan) !== dataset.gitBlob) scan = await download(dataset.original,10000000);
if (scan.length !== dataset.bytes || gitHash(scan) !== dataset.gitBlob) throw new Error('Reference MRI Git blob mismatch');
const nifti = gunzipSync(scan,{maxOutputLength:100000000});
const littleEndian = nifti.readInt32LE(0) === 348;
const i16 = offset => littleEndian ? nifti.readInt16LE(offset) : nifti.readInt16BE(offset);
const f32 = offset => littleEndian ? nifti.readFloatLE(offset) : nifti.readFloatBE(offset);
if ((!littleEndian && nifti.readInt32BE(0) !== 348) || nifti.subarray(344,347).toString() !== 'n+1' || i16(40) < 3 || i16(40) > 4) throw new Error('Expected single-file NIfTI reference');
const dimensions = [i16(42),i16(44),i16(46)], bits = i16(72), offset = f32(108);
if (dimensions.some(n => n < 2 || n > 1024) || ![8,16,32,64].includes(bits) || !Number.isInteger(offset) || offset < 352 || offset + dimensions.reduce((a,b) => a*b,1) * bits/8 > nifti.length) throw new Error('Invalid reference dimensions or payload');
await writeFile(join(base,dataset.file),scan);
console.log('MRI_REFERENCE', JSON.stringify({sha256:hash(scan),bytes:scan.length,dimensions,bits,gitBlob:gitHash(scan)}));
const assets = [];
async function walk(directory) {
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    if (entry.name.startsWith('.')) continue;
    const file = join(directory,entry.name);
    if (entry.isDirectory()) { await walk(file); continue; }
    const path = relative(base,file).replaceAll('\\','/');
    if (['offline-assets.json','sw.js'].includes(path)) continue;
    const bytes = await readFile(file); assets.push({path,bytes:bytes.length,sha256:hash(bytes)});
  }
}
await walk(base); assets.sort((a,b) => a.path.localeCompare(b.path));
const manifest = {version:hash(JSON.stringify(assets)).slice(0,16),totalBytes:assets.reduce((sum,a) => sum + a.bytes,0),assets};
await writeFile(join(base,'offline-assets.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(`Brain explorer: ${assets.length} files, ${(manifest.totalBytes/1000000).toFixed(1)} MB. Reference MRI verified; no upstream scripts executed.`);
