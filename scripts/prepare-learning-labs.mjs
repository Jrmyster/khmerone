// Fetch only pinned, integrity-verified browser runtimes. No package scripts run.
// Optional third-party audio is intentionally excluded from this deployment.
import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { join, dirname, resolve, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { gunzipSync } from 'node:zlib';
import { fileURLToPath } from 'node:url';

const base = resolve(dirname(fileURLToPath(import.meta.url)), '../public/learning-labs');
const manifest = JSON.parse(await readFile(join(base,'vendor-manifest.json'),'utf8'));
const destinations = {'jsxgraph':'jsxgraph','blockly':'blockly','3dmol':'3dmol','ts-fsrs':'fsrs','h5p-standalone':'h5p','bloom-player':'bloom','@fontsource/noto-sans-khmer':'font'};
function selected(packageName,path) {
  if (/\.(mp3|ogg|wav|mp4|map)$/i.test(path)) return null;
  if (packageName === 'jsxgraph') return /^distrib\/(jsxgraphcore\.js|jsxgraph\.css)$/.test(path) ? path.slice(8) : /^LICENSE(\.MIT|\.LGPL)?$/.test(path) ? path : null;
  if (packageName === 'blockly') return path === 'msg/en.js' ? 'en.js' : /^(blockly_compressed\.js|LICENSE)$/.test(path) || /^media\/[^/]+\.(svg|png|cur|gif)$/.test(path) ? path : null;
  if (packageName === '3dmol') return path === 'build/3Dmol-min.js' ? '3Dmol-min.js' : path === 'LICENSE' ? path : null;
  if (packageName === 'ts-fsrs') return path === 'dist/index.umd.js' ? 'index.umd.js' : path === 'LICENSE' ? path : null;
  if (packageName === 'h5p-standalone') return /^dist\/.*\.(js|css|woff|woff2|svg|gif|txt)$/.test(path) ? path.slice(5) : path === 'LICENSE' ? path : null;
  if (packageName === 'bloom-player') return /^dist\/[^/]+\.(js|css|htm|html|txt)$/.test(path) ? path.slice(5) : /^LICENSE(\.txt)?$/.test(path) ? 'LICENSE.txt' : null;
  if (packageName === '@fontsource/noto-sans-khmer') return /^LICENSE(\.txt)?$/.test(path) ? 'LICENSE' : null;
  return null;
}
function tarEntries(buffer) {
  const files = [];
  for (let offset=0;offset+512<=buffer.length;) {
    const header=buffer.subarray(offset,offset+512);
    if (header.every(byte=>byte===0)) break;
    const str=(a,b)=>header.subarray(a,b).toString('utf8').replace(/\0.*$/s,'');
    const name=str(0,100),prefix=str(345,500),type=str(156,157);
    const size=parseInt(str(124,136).trim() || '0',8);
    if (!Number.isSafeInteger(size)||size<0||offset+512+size>buffer.length) throw new Error('Invalid package archive');
    const full=(prefix?prefix+'/':'')+name;
    if ((type==='0'||type==='') && full.startsWith('package/')) {
      const path=full.slice(8);
      if (path.split('/').includes('..')||path.startsWith('/')||path.includes('\\')) throw new Error('Unsafe package path');
      files.push({path,bytes:buffer.subarray(offset+512,offset+512+size)});
    }
    offset+=512+Math.ceil(size/512)*512;
  }
  return files;
}
await rm(join(base,'vendor'),{recursive:true,force:true});
for (const pkg of manifest) {
  const target=destinations[pkg.package];
  if (!target||!new URL(pkg.url).href.startsWith('https://registry.npmjs.org/')) throw new Error('Unexpected package source');
  let archive;
  for (let attempt=0;attempt<3;attempt++) {
    try {const response=await fetch(pkg.url,{signal:AbortSignal.timeout(90000)});if(!response.ok)throw new Error(`HTTP ${response.status}`);archive=Buffer.from(await response.arrayBuffer());break;}
    catch(error){if(attempt===2)throw error;}
  }
  const integrity='sha512-'+createHash('sha512').update(archive).digest('base64');
  if (integrity!==pkg.integrity) throw new Error(`Integrity failure: ${pkg.package}`);
  const entries=tarEntries(gunzipSync(archive,{maxOutputLength:250*1024*1024}));
  let count=0;
  for (const entry of entries) {
    const path=selected(pkg.package,entry.path);
    if (!path) continue;
    const output=join(base,'vendor',target,path);
    await mkdir(dirname(output),{recursive:true});await writeFile(output,entry.bytes);count++;
  }
  if (!count) throw new Error(`No browser files found: ${pkg.package}`);
  console.log(`${pkg.package}@${pkg.version}: ${count} runtime and notice files`);
}
for (const file of ['vendor/jsxgraph/jsxgraphcore.js','vendor/jsxgraph/jsxgraph.css','vendor/blockly/blockly_compressed.js','vendor/blockly/en.js','vendor/3dmol/3Dmol-min.js','vendor/fsrs/index.umd.js','vendor/h5p/main.bundle.js','vendor/h5p/frame.bundle.js','vendor/h5p/styles/h5p.css','vendor/bloom/bloomplayer.htm','vendor/font/LICENSE']) await readFile(join(base,file));
const assets=[];
async function scan(directory) {
  for (const entry of await readdir(directory,{withFileTypes:true})) {
    if (entry.name === '.gitignore') continue;
    const path=join(directory,entry.name);
    if(entry.isDirectory()) {await scan(path);continue;}
    const name=relative(base,path).replaceAll('\\','/');
    if(['sw.js','offline-assets.json'].includes(name))continue;
    const bytes=await readFile(path);
    assets.push({path:name,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
  }
}
await scan(base);assets.sort((a,b)=>a.path.localeCompare(b.path));
const version=createHash('sha256').update(JSON.stringify(assets)).digest('hex').slice(0,16);
await writeFile(join(base,'offline-assets.json'),JSON.stringify({version,totalBytes:assets.reduce((sum,a)=>sum+a.bytes,0),assets},null,2)+'\n');
console.log(`Offline pack ${version}: ${assets.length} files; optional audio excluded.`);
