// Browser checks run against the actual pinned runtimes, not mock libraries.
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const { chromium } = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || '/tmp/khmerone-browser-check/node_modules/playwright/index.mjs').href);
const root=resolve('public');
const types={'.html':'text/html','.htm':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{try{let path=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(path.endsWith('/'))path+='index.html';const file=resolve(root,'.'+path);if(!file.startsWith(root+'/')){res.writeHead(403);res.end();return;}const content=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(content);}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(resolve=>server.listen(4173,'127.0.0.1',resolve));
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1280,height:900}});
const page=await context.newPage();
const errors=[];page.on('pageerror',error=>errors.push(error.message));
const base='http://127.0.0.1:4173/learning-labs/index.html?lang=en';
await mkdir('learning-labs-test-results',{recursive:true});
async function open(id){await page.goto(base+(id?'#'+id:''));await page.waitForFunction(()=>document.getElementById('main')?.textContent.length>100);}
try {
  await open('');await page.waitForSelector('.card');assert.equal(await page.locator('.card').count(),12);
  await page.screenshot({path:'learning-labs-test-results/catalog-desktop.png',fullPage:true});
  await open('math');await page.waitForSelector('#math-board svg');await page.selectOption('#math-mode','triangle');assert.match(await page.locator('#math-values').innerText(),/180/);
  await open('molecules');const molecule=page.frameLocator('#molecule-frame');await molecule.locator('canvas').waitFor();assert.equal(await molecule.locator('#error').innerText(),'');await page.getByRole('button',{name:'2',exact:true}).click();assert.match(await page.locator('.feedback').innerText(),/Correct/);
  await open('code');await page.locator('#example-code').click();await page.locator('#run-code').click();await page.waitForFunction(()=>document.getElementById('code-status')?.textContent.includes('plant is watered'));await page.selectOption('#mission','garden-loop');await page.locator('#example-code').click();await page.locator('#run-code').click();await page.waitForFunction(()=>document.getElementById('code-status')?.textContent.includes('All three plants'));
  await open('vocabulary');await page.locator('#reveal').click();await page.locator('[data-rating="3"]').click();assert.match(await page.locator('main').innerText(),/9 cards/);await page.reload();assert.match(await page.locator('main').innerText(),/9 cards/);
  await open('evidence');const evidence=page.frameLocator('iframe.science-frame').frameLocator('iframe');await evidence.getByRole('radio').first().check();await evidence.getByRole('button',{name:'Check answer'}).click();assert.match(await evidence.locator('.ko-feedback').innerText(),/Correct/);
  await open('reading');const reading=page.frameLocator('.reading-frame');await reading.locator('.bloom-page').first().waitFor();await page.waitForTimeout(700);assert.equal(await reading.locator('.loadErrorMessage').count(),0);
  await open('eye');await page.locator('[data-preset="myopia"]').click();assert.match(await page.locator('#eye-feedback').innerText(),/in front/);await page.locator('#language').click();assert.equal(await page.locator('html').getAttribute('lang'),'km');await page.locator('#eye-diagram').waitFor();
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'learning-labs-test-results/eye-mobile-khmer.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1));
  await open('');await page.locator('#download-pack').click();await page.waitForFunction(()=>document.getElementById('pack-status')?.textContent.startsWith('Saved.'),null,{timeout:120000});
  await context.setOffline(true);
  for(const [id,selector] of [['math','#math-board svg'],['molecules','#molecule-frame'],['code','.blocklySvg'],['vocabulary','#reveal'],['evidence','iframe.science-frame'],['reading','.reading-frame'],['eye','#eye-diagram']]) {await open(id);await page.locator(selector).waitFor();assert.ok(!(await page.locator('main').innerText()).includes('could not load'));}
  await open('molecules');await page.frameLocator('#molecule-frame').locator('canvas').waitFor();assert.equal(await page.frameLocator('#molecule-frame').locator('#error').innerText(),'');
  await open('evidence');await page.frameLocator('iframe.science-frame').frameLocator('iframe').getByRole('radio').first().waitFor();
  await open('reading');await page.frameLocator('.reading-frame').locator('.bloom-page').first().waitFor();
  assert.deepEqual(errors,[]);
  console.log('PASS: 12 cards; seven local activities; interactive checks; Khmer/mobile; saved review; full-pack offline reload.');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
