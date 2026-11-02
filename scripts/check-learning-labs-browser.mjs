// Exercise the actual pinned browser runtimes, not mock libraries.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || '/tmp/khmerone-browser-check/node_modules/playwright/index.mjs').href);
const root = resolve('public');
const types = {'.html':'text/html','.htm':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server = createServer(async(req,res) => {
  try {
    let path = decodeURIComponent(new URL(req.url,'http://localhost').pathname);
    if (path.endsWith('/')) path += 'index.html';
    const file = resolve(root,'.'+path);
    if (!file.startsWith(root+'/')) {res.writeHead(403);res.end();return;}
    const content = await readFile(file);
    res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});
    res.end(content);
  } catch {res.writeHead(404);res.end('Not found');}
});
await new Promise(resolve => server.listen(4173,'127.0.0.1',resolve));
const browser = await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context = await browser.newContext({viewport:{width:1280,height:900}});
const page = await context.newPage();
const errors = [];
page.on('pageerror',error => {errors.push(error.message);console.error('BROWSER ERROR:',error.message);});
const base = 'http://127.0.0.1:4173/learning-labs/index.html?lang=en';
const results = 'learning-labs-test-results';
await mkdir(results,{recursive:true});
async function open(id) {
  console.log('Opening activity:', id || 'catalog');
  await page.goto(base+(id?'#'+id:''));
  // An iframe's text is not part of the parent textContent. Wait on actual UI,
  // not an arbitrary character count that incorrectly rejects short lessons.
  await page.locator(id?'#activity':'.card').first().waitFor();
}
async function readyText(selector, text) {
  await page.waitForFunction(([selector,text]) => document.querySelector(selector)?.textContent.includes(text),[selector,text]);
}
try {
  await open('');
  assert.equal(await page.locator('.card').count(),12);
  await page.screenshot({path:results+'/catalog-desktop.png',fullPage:true});
  console.log('PASS: catalog');

  await open('math');
  await page.locator('#math-board svg').waitFor();
  await page.selectOption('#math-mode','triangle');
  await readyText('#math-values','180');
  console.log('PASS: math');

  await open('molecules');
  const molecule = page.frameLocator('#molecule-frame');
  await molecule.locator('canvas').waitFor();
  assert.equal(await molecule.locator('#error').innerText(),'');
  await page.getByRole('button',{name:'2',exact:true}).click();
  await readyText('.feedback','Correct');
  console.log('PASS: molecules');

  await open('code');
  for (const [mission,message] of [['first-plant','plant is watered'],['garden-loop','All three plants'],['turn-the-corner','Both plants']]) {
    await page.selectOption('#mission',mission);
    await page.locator('#example-code').click();
    await page.locator('#run-code').click();
    await readyText('#code-status',message);
  }
  console.log('PASS: three Blockly missions');

  await open('vocabulary');
  await page.locator('#reveal').click();
  await page.locator('[data-rating="3"]').click();
  await readyText('main','9 cards');
  await page.reload();
  await readyText('main','9 cards');
  console.log('PASS: vocabulary and saved schedule');

  await open('evidence');
  const evidence = page.frameLocator('iframe.science-frame').frameLocator('iframe');
  await evidence.getByRole('radio').first().check();
  await evidence.getByRole('button',{name:'Check answer'}).click();
  await evidence.locator('.ko-feedback').filter({hasText:'Correct'}).waitFor();
  console.log('PASS: H5P evidence quiz');

  await open('reading');
  const reading = page.frameLocator('.reading-frame');
  await reading.locator('.bloom-page').first().waitFor({state:'attached'});
  assert.equal(await reading.locator('.loadErrorMessage').count(),0);
  console.log('PASS: Bloom reader');

  await open('eye');
  await page.locator('[data-preset="myopia"]').click();
  await readyText('#eye-feedback','in front');
  await page.locator('#language').click();
  assert.equal(await page.locator('html').getAttribute('lang'),'km');
  await page.locator('#eye-diagram').waitFor();
  await page.setViewportSize({width:390,height:844});
  await page.screenshot({path:results+'/eye-mobile-khmer.png',fullPage:true});
  assert.ok(await page.evaluate(() => document.documentElement.scrollWidth<=window.innerWidth+1));
  console.log('PASS: eye, Khmer toggle and mobile width');

  await open('');
  await page.locator('#download-pack').click();
  await page.waitForFunction(() => document.getElementById('pack-status')?.textContent.startsWith('Saved.'),null,{timeout:120000});
  await context.setOffline(true);
  for (const [id,selector] of [['math','#math-board svg'],['molecules','#molecule-frame'],['code','.blocklySvg'],['vocabulary','#reveal'],['evidence','iframe.science-frame'],['reading','.reading-frame'],['eye','#eye-diagram']]) {
    await open(id);
    await page.locator(selector).waitFor();
    assert.ok(!(await page.locator('main').innerText()).includes('could not load'));
  }
  await open('molecules');
  await page.frameLocator('#molecule-frame').locator('canvas').waitFor();
  assert.equal(await page.frameLocator('#molecule-frame').locator('#error').innerText(),'');
  await open('evidence');
  await page.frameLocator('iframe.science-frame').frameLocator('iframe').getByRole('radio').first().waitFor();
  await open('reading');
  await page.frameLocator('.reading-frame').locator('.bloom-page').first().waitFor({state:'attached'});
  assert.deepEqual(errors,[]);
  console.log('PASS: all seven local activities offline; no uncaught browser errors.');
} catch (error) {
  await page.screenshot({path:results+'/failure.png',fullPage:true}).catch(() => {});
  const snapshots = [];
  for (const frame of page.frames()) {
    try {snapshots.push({url:frame.url(),text:await frame.locator('body').innerText()});} catch { /* A frame may detach during failure. */ }
  }
  await writeFile(results+'/diagnostic.json',JSON.stringify({error:String(error),errors,snapshots},null,2));
  console.error('Diagnostic:',JSON.stringify({errors,snapshots}));
  throw error;
} finally {
  await browser.close();
  await new Promise(resolve => server.close(resolve));
}
