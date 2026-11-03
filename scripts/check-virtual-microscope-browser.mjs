import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { specimens } from '../public/virtual-microscope/specimens.js';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || '/tmp/khmerone-microscope-check/node_modules/playwright/index.mjs').href);
const root = resolve('public');
const mime = { '.html':'text/html', '.js':'text/javascript', '.css':'text/css', '.jpg':'image/jpeg', '.json':'application/json', '.txt':'text/plain', '.woff2':'font/woff2' };
let corruptImage = false;
const server = createServer(async(req,res) => {
  try {
    let path = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = resolve(root,'.'+path);
    if (!file.startsWith(root+'/')) { res.writeHead(403); res.end(); return; }
    let content = await readFile(file);
    if (corruptImage && path.endsWith('/muscle.jpg')) content = Buffer.from('Deliberately corrupted test download');
    res.writeHead(200, { 'Content-Type':mime[extname(file)] || 'application/octet-stream' }); res.end(content);
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(resolve => server.listen(4174,'127.0.0.1',resolve));
const browser = await chromium.launch();
const context = await browser.newContext({ viewport:{width:1280,height:900} });
const page = await context.newPage();
const errors = [], external = [];
page.on('pageerror',error => errors.push(error.message));
page.on('request',request => { if (/^https?:/.test(request.url()) && !request.url().startsWith('http://127.0.0.1:4174/')) external.push(request.url()); });
const base = 'http://127.0.0.1:4174/virtual-microscope/index.html';
await mkdir('microscope-test-results',{recursive:true});
async function ready(id) {
  await page.waitForFunction(id => document.getElementById('microscope-viewer')?.dataset.ready === 'true' && document.getElementById('microscope-viewer')?.dataset.specimen === id, id, {timeout:30000});
  assert.equal(await page.locator('#load-error').isVisible(),false);
  // A nonempty canvas prevents an early viewer-open event from passing with no image.
  await page.waitForFunction(() => [...document.querySelectorAll('#microscope-viewer canvas')].some(canvas => {
    const context = canvas.getContext('2d');
    if (!context || !canvas.width || !canvas.height) return false;
    const pixels = context.getImageData(Math.floor(canvas.width/2), Math.floor(canvas.height/2), 1, 1).data;
    return pixels[3] > 0 && pixels[0] + pixels[1] + pixels[2] > 100;
  }));
}
async function checkFonts() {
  const count = await page.evaluate(async () => {
    const normal = await document.fonts.load('400 16px "Khmer One Khmer"','មីក្រូទស្សន៍');
    const bold = await document.fonts.load('700 24px "Khmer One Khmer"','មីក្រូទស្សន៍');
    await document.fonts.ready;
    return normal.length + bold.length;
  });
  assert.equal(count,2,'Both self-hosted Khmer weights must load, including offline');
}
async function pointer() {
  return page.evaluate(async () => {
    const cache = await caches.open('khmerone-microscope-metadata-v1');
    return (await cache.match(new URL('offline-ready',location.href))).json();
  });
}
try {
  await page.goto(base+'?lang=en'); await ready('muscle'); await checkFonts();
  assert.equal(await page.locator('.slide-button').count(),3);
  await page.locator('#zoom-in').click();
  await page.waitForFunction(() => Number(document.getElementById('zoom-readout').dataset.zoom)>1.2);
  await page.locator('#labels').click(); assert.equal(await page.locator('.marker').count(),2);
  await page.locator('#viewer-panel').screenshot({path:'microscope-test-results/muscle-markers.png'});
  await page.locator('#labels').click(); assert.equal(await page.locator('.marker').count(),0);
  await page.locator('#microscope-viewer').focus(); await page.keyboard.press('0');
  await page.waitForFunction(() => Math.abs(Number(document.getElementById('zoom-readout').dataset.zoom)-1)<.05);
  await page.keyboard.press('+'); await page.waitForFunction(() => Number(document.getElementById('zoom-readout').dataset.zoom)>1.2);
  await page.keyboard.press('ArrowRight'); await page.locator('#rotate').click(); await page.locator('#reset').click();
  await page.locator('#note').fill('Long fibers; <script>not executable</script>');
  await page.reload(); await ready('muscle');
  assert.equal(await page.locator('#note').inputValue(),'Long fibers; <script>not executable</script>');
  for (const specimen of specimens) {
    await page.locator(`[data-slide="${specimen.id}"]`).click(); await ready(specimen.id);
    await page.locator('#check-answer').click(); assert.match(await page.locator('#feedback').innerText(),/Choose/);
    await page.locator(`input[value="${(specimen.answer+1)%3}"]`).check(); await page.locator('#check-answer').click();
    assert.equal(await page.locator('#feedback').getAttribute('data-correct'),'false');
    await page.locator(`input[value="${specimen.answer}"]`).check(); await page.locator('#check-answer').click();
    assert.equal(await page.locator('#feedback').getAttribute('data-correct'),'true');
    if (specimen.id !== 'muscle') assert.equal(await page.locator('#note').inputValue(),'');
    await page.locator('#viewer-panel').screenshot({path:`microscope-test-results/specimen-${specimen.id}.png`});
    console.log('PASS image pixels, quiz and note isolation:',specimen.id);
  }
  await page.locator('[data-slide="muscle"]').click(); await ready('muscle');
  await page.locator('#note').fill('I see long pink fibers, repeated bands and dark purple shapes.');
  const exported = page.waitForEvent('download'); await page.locator('#export-note').click();
  assert.equal((await exported).suggestedFilename(),'khmerone-microscope-muscle-en.txt');
  await page.screenshot({path:'microscope-test-results/desktop.png',fullPage:true});
  await page.locator('#language').click(); await checkFonts();
  assert.equal(await page.locator('html').getAttribute('lang'),'km');
  assert.match(await page.locator('h1').innerText(),/មីក្រូទស្សន៍/);
  assert.match(await page.locator('#note').inputValue(),/long pink fibers/);
  await page.setViewportSize({width:390,height:844});
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth<=innerWidth+1));
  await page.locator('#expand').click(); assert.equal(await page.locator('#expand').getAttribute('aria-expanded'),'true');
  await page.keyboard.press('Escape'); assert.equal(await page.locator('#expand').getAttribute('aria-expanded'),'false');
  await page.screenshot({path:'microscope-test-results/mobile-khmer.png',fullPage:true});
  await page.locator('#language').click(); await page.locator('#save-pack').click();
  await page.waitForFunction(() => document.getElementById('pack-status')?.dataset.saved==='true',null,{timeout:120000});
  const savedPointer = await pointer();
  corruptImage = true;
  await page.locator('#save-pack').click();
  await page.waitForFunction(() => document.getElementById('pack-status')?.textContent.includes('not saved completely'));
  assert.deepEqual(await pointer(),savedPointer,'A corrupt update must preserve the previously saved pack');
  corruptImage = false;
  await context.setOffline(true);
  for (const specimen of specimens) {
    await page.goto(base+'?lang=en&slide='+specimen.id); await ready(specimen.id);
    await page.locator('#zoom-in').click();
    await page.waitForFunction(() => Number(document.getElementById('zoom-readout').dataset.zoom)>1.2);
    console.log('PASS offline image and zoom:',specimen.id);
  }
  await page.goto('http://127.0.0.1:4174/virtual-microscope/?lang=km&slide=kidney');
  await ready('kidney'); await checkFonts();
  assert.deepEqual(errors,[]); assert.deepEqual(external,[]);
  await context.setOffline(false);
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => { Storage.prototype.getItem=()=>{throw new Error('blocked');}; Storage.prototype.setItem=()=>{throw new Error('blocked');}; });
  const blockedPage = await blocked.newPage(); await blockedPage.goto(base);
  await blockedPage.waitForFunction(() => document.getElementById('microscope-viewer')?.dataset.ready==='true');
  await blockedPage.locator('#note').fill('Unsaved observation');
  assert.match(await blockedPage.locator('#note-status').innerText(),/Not saved/); await blocked.close();
  console.log('PASS: real image pixels; zoom/keyboard; markers; quizzes; note isolation/reload/export; Khmer fonts online/offline; mobile layout; expansion; failed-pack rollback; offline specimens; blocked storage; no external learner requests.');
} catch (error) {
  await page.screenshot({path:'microscope-test-results/failure.png',fullPage:true}).catch(()=>{});
  const diagnostic = {error:String(error),errors,external,text:await page.locator('body').innerText().catch(()=>'')};
  await writeFile('microscope-test-results/failure.json',JSON.stringify(diagnostic,null,2)); console.log('DIAGNOSTIC',JSON.stringify(diagnostic)); throw error;
} finally { await browser.close(); await new Promise(resolve=>server.close(resolve)); }
