import { createServer } from 'node:http';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { questions } from '../public/brain-scan-explorer/lesson.js';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || '/tmp/khmerone-brain-check/node_modules/playwright/index.mjs').href);
const root = resolve('public'), origin = 'http://127.0.0.1:4175', base = origin + '/brain-scan-explorer/index.html';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain','.woff2':'font/woff2','.gz':'application/octet-stream'};
let corrupt = false;
const server = createServer(async(req,res) => {
  try {
    let path = decodeURIComponent(new URL(req.url,origin).pathname); if (path.endsWith('/')) path += 'index.html';
    const file = resolve(root,'.' + path); if (!file.startsWith(root + '/')) { res.writeHead(403); res.end(); return; }
    const bytes = await readFile(file); if (corrupt && path.endsWith('/mni152.nii.gz')) bytes[bytes.length-1] ^= 1;
    res.writeHead(200,{'Content-Type':mime[extname(file)] || 'application/octet-stream','Cache-Control':'no-store'}); res.end(bytes);
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(resolve => server.listen(4175,'127.0.0.1',resolve));
const browser = await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context = await browser.newContext({viewport:{width:1280,height:960},acceptDownloads:true});
const page = await context.newPage(), errors = [], requests = [], consoleErrors = [];
page.on('pageerror',error => errors.push(error.message)); page.on('request',request => requests.push(request.url()));
page.on('console',message => { if(message.type()==='error') consoleErrors.push(message.text()); });
await mkdir('brain-test-results',{recursive:true});
async function ready(target=page) {
  await target.waitForFunction(() => document.getElementById('brain-canvas')?.dataset.ready==='true' || !document.getElementById('error')?.hidden,null,{timeout:90000});
  assert.equal(await target.locator('#error').isVisible(),false,await target.locator('#error').innerText());
  assert.equal(await target.locator('#brain-canvas').getAttribute('data-ready'),'true');
}
async function pixels() {
  return page.evaluate(() => {
    const canvas=document.getElementById('brain-canvas'),gl=canvas.getContext('webgl2'),data=new Uint8Array(canvas.width*canvas.height*4);
    gl.readPixels(0,0,canvas.width,canvas.height,gl.RGBA,gl.UNSIGNED_BYTE,data);
    let gray=0,checksum=0;
    for(let i=0;i<data.length;i+=4) { const r=data[i],g=data[i+1],b=data[i+2]; if(r>35&&r<245&&Math.abs(r-g)<8&&Math.abs(g-b)<8)gray++; checksum=(Math.imul(checksum,31)+r+g+b)>>>0; }
    return {gray,checksum,width:canvas.width,height:canvas.height};
  });
}
async function actualImage() { await page.waitForTimeout(150); const result=await pixels(); assert.ok(result.gray>500,JSON.stringify(result)); return result; }
async function setRange(id,value) { await page.locator('#'+id).evaluate((element,value)=>{element.value=String(value);element.dispatchEvent(new Event('input',{bubbles:true}));},value); }
try {
  await page.goto(base+'?lang=en'); await page.waitForSelector('[data-view="axial"]');
  assert.ok(!requests.some(url=>url.endsWith('.nii.gz')||url.endsWith('/vendor/niivue.js')),'Viewer/data must be user initiated');
  await page.locator('#load-brain').click(); await ready(); const initial=await actualImage(); console.log('PASS reference pixels',JSON.stringify(initial));
  const dims=(await page.locator('#brain-canvas').getAttribute('data-dimensions')).split(',').map(Number); assert.equal(dims.length,3);assert.ok(dims.every(n=>n>20));
  await page.screenshot({path:'brain-test-results/desktop.png',fullPage:true});
  for(const id of ['axial','coronal','sagittal','render','all']) { await page.locator(`[data-view="${id}"]`).click(); await actualImage(); await page.locator('#canvas-wrap').screenshot({path:`brain-test-results/view-${id}.png`}); console.log('PASS view',id); }
  await page.locator('[data-view="axial"]').click(); const before=await actualImage(); const index=Math.floor(dims[2]*.65); await setRange('slice-z',index);assert.equal(Number(await page.locator('#brain-canvas').getAttribute('data-z')),index);assert.notEqual((await actualImage()).checksum,before.checksum);
  await page.locator('#slice-z').focus();await page.keyboard.press('ArrowRight');assert.equal(Number(await page.locator('#brain-canvas').getAttribute('data-z')),index+1);
  await page.locator('#zoom-in').click(); assert.ok(Number(await page.locator('#brain-canvas').getAttribute('data-zoom'))>1);await actualImage();await page.locator('#reset').click();
  await page.locator('.display-settings summary').click(); const contrastBefore=await actualImage(); await setRange('window-width',50);assert.notEqual((await actualImage()).checksum,contrastBefore.checksum);await page.locator('#reset').click();assert.equal(await page.locator('#window-width').inputValue(),'100');
  await page.locator('#crosshair').click();assert.equal(await page.locator('#crosshair').getAttribute('aria-pressed'),'false');await page.locator('#crosshair').click();
  await page.locator('[data-view="render"]').click();const rotationBefore=await actualImage();await page.locator('#turn-left').click();assert.notEqual((await actualImage()).checksum,rotationBefore.checksum);await page.locator('[data-view="all"]').click();
  for(const q of questions) {
    await page.locator('#check-answer').click();assert.match(await page.locator('#feedback').innerText(),/Choose/);
    await page.locator(`#quiz-options input[value="${(q.answer+1)%3}"]`).check();await page.locator('#check-answer').click();assert.equal(await page.locator('#feedback').getAttribute('data-correct'),'false');
    await page.locator(`#quiz-options input[value="${q.answer}"]`).check();await page.locator('#check-answer').click();assert.equal(await page.locator('#feedback').getAttribute('data-correct'),'true');await page.locator('#next-question').click();
  }
  const note='Slices change; <script>literal text</script>.';await page.locator('#note').fill(note);await page.reload();assert.equal(await page.locator('#note').inputValue(),note);await page.locator('#load-brain').click();await ready();
  const downloadPromise=page.waitForEvent('download');await page.locator('#export-note').click();const download=await downloadPromise;assert.ok((await readFile(await download.path(),'utf8')).includes(note));
  await page.locator('#language').click();assert.equal(await page.locator('html').getAttribute('lang'),'km');
  await page.evaluate(async()=>{await document.fonts.load('400 16px KhmerOneBrain','ខ្មែរ');await document.fonts.load('700 16px KhmerOneBrain','ខ្មែរ');await document.fonts.ready;});
  assert.ok(await page.evaluate(()=>document.fonts.check('400 16px KhmerOneBrain','ខ្មែរ')&&document.fonts.check('700 16px KhmerOneBrain','ខ្មែរ')));
  await page.setViewportSize({width:390,height:844});await page.locator('[data-view="axial"]').click();await actualImage();assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
  await page.screenshot({path:'brain-test-results/mobile-khmer.png',fullPage:true});await page.locator('#canvas-wrap').screenshot({path:'brain-test-results/mobile-viewer.png'});
  await page.locator('#expand').click();assert.equal(await page.locator('#expand').getAttribute('aria-expanded'),'true');await actualImage();await page.keyboard.press('Escape');assert.equal(await page.locator('#expand').getAttribute('aria-expanded'),'false');
  await page.locator('#language').click();await page.evaluate(async()=>{const cache=await caches.open('khmerone-unrelated-test');await cache.put('/keep-me',new Response('keep'));});
  await page.locator('#save-pack').click();await page.waitForFunction(()=>document.getElementById('pack-status')?.dataset.saved==='true',null,{timeout:120000});
  corrupt=true;await page.locator('#save-pack').click();await page.waitForFunction(()=>document.getElementById('pack-status')?.textContent.includes('not saved completely'),null,{timeout:120000});corrupt=false;
  assert.ok(await page.evaluate(async()=>Boolean(await (await caches.open('khmerone-unrelated-test')).match('/keep-me'))));
  await context.setOffline(true);await page.goto(base+'?lang=km&view=coronal');await page.locator('#load-brain').click();await ready();await actualImage();await page.evaluate(()=>document.fonts.ready);
  assert.ok(await page.evaluate(()=>document.fonts.check('700 16px KhmerOneBrain','ខ្មែរ')));assert.equal(await page.locator('#note').inputValue(),note);
  await page.goto(origin+'/brain-scan-explorer/?lang=en&view=sagittal');await page.locator('#load-brain').click();await ready();await actualImage();console.log('PASS complete offline reference and failed-update recovery');
  assert.deepEqual(errors,[]);assert.deepEqual(requests.filter(url=>/^https?:/.test(url)&&!url.startsWith(origin+'/')),[]);
  await context.setOffline(false);
  const noGL=await browser.newContext({serviceWorkers:'block'});await noGL.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type==='webgl2'?null:original.call(this,type,...args);};});const noGLPage=await noGL.newPage();await noGLPage.goto(base);await noGLPage.locator('#load-brain').click();await noGLPage.locator('#error').waitFor();assert.match(await noGLPage.locator('#error').innerText(),/WebGL2/);await noGLPage.locator('#check-answer').click();assert.match(await noGLPage.locator('#feedback').innerText(),/Choose/);await noGL.close();
  const blocked=await browser.newContext({serviceWorkers:'block'});await blocked.addInitScript(()=>{Storage.prototype.getItem=()=>{throw new Error('blocked');};Storage.prototype.setItem=()=>{throw new Error('blocked');};});const blockedPage=await blocked.newPage();await blockedPage.goto(base);await blockedPage.locator('#note').fill('Unsaved');assert.match(await blockedPage.locator('#note-status').innerText(),/Not saved/);await blocked.close();
  console.log('PASS: real reference MRI pixels, all five views, linked slider indices, keyboard slider, zoom, contrast/reset, rotation, quizzes, notes/export, Khmer fonts/mobile, expansion, offline, corrupt-pack recovery, unavailable graphics, blocked storage, no external learner requests.');
} catch(error) {
  await page.screenshot({path:'brain-test-results/failure.png',fullPage:true}).catch(()=>{});
  const diagnostic={error:String(error),errors,consoleErrors,requests,text:await page.locator('body').innerText().catch(()=>'' )};
  await writeFile('brain-test-results/failure.json',JSON.stringify(diagnostic,null,2));console.log('BRAIN_DIAGNOSTIC',JSON.stringify(diagnostic));throw error;
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
