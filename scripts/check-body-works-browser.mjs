import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { lessons } from '../public/body-works/lessons.js';
const {chromium} = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || '/tmp/khmerone-course-check/node_modules/playwright/index.mjs').href);
const root = resolve('public'), origin = 'http://127.0.0.1:4176';
const mime = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.txt':'text/plain','.woff2':'font/woff2'};
let corruptDownload = false;
const server = createServer(async (req,res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url,origin).pathname); if (pathname.endsWith('/')) pathname += 'index.html';
    const path = resolve(root,'.' + pathname); if (!path.startsWith(root + '/')) { res.writeHead(403); res.end(); return; }
    const bytes = corruptDownload && pathname === '/body-works/lessons.js' ? Buffer.from('/* deliberate corrupted response */') : await readFile(path);
    res.writeHead(200,{'Content-Type':mime[extname(path)] || 'application/octet-stream'}); res.end(bytes);
  } catch { res.writeHead(404); res.end('Not found'); }
});
await new Promise(resolve => server.listen(4176,'127.0.0.1',resolve));
const browser = await chromium.launch();
const context = await browser.newContext({viewport:{width:1280,height:900}});
const page = await context.newPage(), errors = [], external = [];
page.on('pageerror',error => errors.push(error.message));
page.on('request',request => { if (/^https?:/.test(request.url()) && !request.url().startsWith(origin + '/')) external.push(request.url()); });
const base = origin + '/body-works/index.html';
await mkdir('body-works-test-results',{recursive:true});
async function ready(id) { await page.waitForFunction(id => document.querySelector('.lesson-link[aria-current="step"]')?.dataset.lesson === id,id); }
async function answer(question,index) { await page.locator(`input[name="${question.id}"][value="${index}"]`).check(); await page.locator(`[data-check="${question.id}"]`).click(); }
try {
  await page.goto(base + '?lang=en&lesson=cells'); await ready('cells');
  assert.equal(await page.locator('.lesson-link').count(),6); assert.equal(await page.locator('#progress').getAttribute('value'),'0');
  await page.locator('[data-check="cells-1"]').click(); assert.match(await page.locator('#feedback-cells-1').innerText(),/Choose/);
  const first = lessons[0].questions[0]; await answer(first,(first.answer + 1) % 3);
  assert.equal(await page.locator('#feedback-cells-1').getAttribute('data-correct'),'false');
  await answer(first,first.answer); await page.locator('#language').click();
  assert.equal(await page.locator('html').getAttribute('lang'),'km');
  assert.equal(await page.locator(`input[name="cells-1"][value="${first.answer}"]`).isChecked(),true);
  assert.equal(await page.locator('#feedback-cells-1').getAttribute('data-correct'),'true');
  for (const weight of [400,700]) assert.ok(await page.evaluate(async weight => (await document.fonts.load(`${weight} 18px CourseKhmer`,'កោសិកា')).length > 0,weight));
  await page.locator('#language').click();
  for (const lesson of lessons) {
    await page.locator(`[data-lesson="${lesson.id}"]`).click(); await ready(lesson.id);
    assert.equal(await page.locator('#sections > section').count(),3);
    assert.equal(await page.locator('#sources li').count(),lesson.sources.length);
    assert.match(await page.locator('#explore').getAttribute('href'),/lang=en/);
    for (const question of lesson.questions) {
      await answer(question,(question.answer + 1) % 3); assert.equal(await page.locator(`#feedback-${question.id}`).getAttribute('data-correct'),'false');
      await answer(question,question.answer); assert.equal(await page.locator(`#feedback-${question.id}`).getAttribute('data-correct'),'true');
    }
    assert.match(await page.locator('#lesson-status').innerText(),/Lesson complete/);
    console.log('PASS lesson, bilingual data, retries and completion:',lesson.id);
  }
  assert.equal(await page.locator('#progress').evaluate(node => node.value),6); assert.equal(await page.locator('#completion').isVisible(),true);
  await page.reload(); await ready('defense'); assert.equal(await page.locator('#progress').evaluate(node => node.value),6);
  await page.locator('#previous').click(); await ready('balance'); await page.goBack(); await ready('defense');
  await page.goto(base + '?lang=en&lesson=invalid&url=https://evil.invalid/'); await ready('cells');
  assert.equal(new URL(page.url()).searchParams.has('url'),false);
  await page.screenshot({path:'body-works-test-results/desktop.png',fullPage:true});
  await page.setViewportSize({width:390,height:844}); await page.locator('#language').click();
  assert.equal(await page.locator('html').getAttribute('lang'),'km');
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.screenshot({path:'body-works-test-results/mobile-khmer.png',fullPage:true});
  await page.locator('#lesson-title').scrollIntoViewIfNeeded(); await page.screenshot({path:'body-works-test-results/mobile-lesson.png'});
  await page.locator('#language').click();
  await page.evaluate(() => { localStorage.setItem('khmerone-unrelated-sentinel','keep'); });
  await page.locator('#reset-progress').click(); await page.locator('#cancel-reset').click(); assert.equal(await page.locator('#progress').evaluate(node => node.value),6);
  await page.locator('#reset-progress').click(); await page.locator('#confirm-reset').click(); await ready('cells');
  assert.equal(await page.locator('#progress').evaluate(node => node.value),0);
  assert.equal(await page.evaluate(() => localStorage.getItem('khmerone-unrelated-sentinel')),'keep');
  await page.locator('input[name="cells-1"]').first().focus(); await page.keyboard.press('ArrowDown');
  assert.equal(await page.locator('input[name="cells-1"]:checked').count(),1);
  await page.evaluate(async () => { const cache = await caches.open('khmerone-unrelated-cache'); await cache.put('/keep',new Response('keep')); });
  await page.locator('#save-pack').click(); await page.waitForFunction(() => document.getElementById('pack-status').dataset.state === 'saved',null,{timeout:90000});
  const pointer = await page.evaluate(async () => { const cache = await caches.open('khmerone-body-works-metadata-v1'); return (await cache.match(location.origin + '/body-works/offline-ready')).text(); });
  corruptDownload = true; await page.locator('#save-pack').click(); await page.waitForFunction(() => document.getElementById('pack-status').dataset.state === 'error',null,{timeout:90000}); corruptDownload = false;
  assert.equal(await page.evaluate(async () => { const cache = await caches.open('khmerone-body-works-metadata-v1'); return (await cache.match(location.origin + '/body-works/offline-ready')).text(); }),pointer);
  assert.equal(await page.evaluate(async () => (await (await caches.open('khmerone-unrelated-cache')).match('/keep')).text()),'keep');
  await context.setOffline(true);
  for (const lesson of lessons) {
    await page.goto(base + '?lang=km&lesson=' + lesson.id); await ready(lesson.id);
    assert.equal(await page.locator('#lesson-title').innerText(),lesson.title.km);
    for (const question of lesson.questions) { await answer(question,question.answer); assert.equal(await page.locator(`#feedback-${question.id}`).getAttribute('data-correct'),'true'); }
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  }
  for (const weight of [400,700]) assert.ok(await page.evaluate(async weight => (await document.fonts.load(`${weight} 18px CourseKhmer`,'កោសិកា')).length > 0,weight));
  assert.equal(await page.locator('#progress').evaluate(node => node.value),6);
  await page.goto(origin + '/body-works/?lang=en&lesson=signals'); await ready('signals');
  assert.deepEqual(errors,[]); assert.deepEqual(external,[]);
  await context.setOffline(false);
  const blocked = await browser.newContext();
  await blocked.addInitScript(() => { Storage.prototype.getItem = () => { throw new Error('blocked'); }; Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
  const blockedPage = await blocked.newPage(); await blockedPage.goto(base + '?lang=en'); await blockedPage.waitForSelector('.question');
  assert.match(await blockedPage.locator('#storage-status').innerText(),/not saved/);
  for (const question of lessons[0].questions) { await blockedPage.locator(`input[name="${question.id}"][value="${question.answer}"]`).check(); await blockedPage.locator(`[data-check="${question.id}"]`).click(); }
  assert.equal(await blockedPage.locator('#progress').evaluate(node => node.value),1);
  assert.match(await blockedPage.locator('#storage-status').innerText(),/not saved/); await blocked.close();
  console.log('PASS: all six lessons and twelve answers; progress/reload; translated feedback; Khmer fonts; 390px layout; keyboard; reset isolation; corrupt-update recovery; all lessons cold offline; blocked storage; no external learner requests.');
} catch (error) {
  await page.screenshot({path:'body-works-test-results/failure.png',fullPage:true}).catch(() => {});
  await writeFile('body-works-test-results/failure.json',JSON.stringify({error:String(error),errors,external,text:await page.locator('body').innerText().catch(() => '')},null,2)); throw error;
} finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
