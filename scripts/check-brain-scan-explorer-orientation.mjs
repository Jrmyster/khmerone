// Additional regression checks from visual review: real orientation-label pixels,
// all four multiplanar panels, linked pointer selection, and blocked URL drops.
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
const {chromium} = await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || '/tmp/khmerone-brain-check/node_modules/playwright/index.mjs').href);
const root=resolve('public'),origin='http://127.0.0.1:4176';
const types={'.js':'text/javascript','.html':'text/html','.css':'text/css','.json':'application/json','.woff2':'font/woff2'};
const server=createServer(async(req,res)=>{try{const path=decodeURIComponent(new URL(req.url,origin).pathname),file=resolve(root,'.'+path);if(!file.startsWith(root+'/')){res.writeHead(403);res.end();return;}const bytes=await readFile(file);res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream'});res.end(bytes);}catch{res.writeHead(404);res.end('Not found');}});
await new Promise(resolve=>server.listen(4176,'127.0.0.1',resolve));
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const context=await browser.newContext({viewport:{width:1280,height:960}}),page=await context.newPage(),external=[];
page.on('request',r=>{if(/^https?:/.test(r.url())&&!r.url().startsWith(origin+'/'))external.push(r.url());});
await mkdir('brain-test-results',{recursive:true});
async function renderedPixels(){
 return page.evaluate(()=>{const c=document.getElementById('brain-canvas'),gl=c.getContext('webgl2'),p=new Uint8Array(c.width*c.height*4);gl.readPixels(0,0,c.width,c.height,gl.RGBA,gl.UNSIGNED_BYTE,p);let gold=0;const gray=[0,0,0,0];for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const i=(y*c.width+x)*4,r=p[i],g=p[i+1],b=p[i+2];if(r>150&&g>95&&r>g*1.12&&g>b*1.4)gold++;if(r>35&&r<245&&Math.abs(r-g)<8&&Math.abs(g-b)<8)gray[(y>=c.height/2?2:0)+(x>=c.width/2?1:0)]++;}return{gold,gray};});
}
try{
 await page.goto(origin+'/brain-scan-explorer/index.html?lang=en&view=all');await page.locator('#load-brain').click();await page.waitForFunction(()=>document.getElementById('brain-canvas')?.dataset.ready==='true',null,{timeout:90000});
 await page.waitForTimeout(200);let result=await renderedPixels();assert.ok(result.gray.every(n=>n>250),JSON.stringify(result));assert.ok(result.gold>150,JSON.stringify(result));
 await page.locator('#canvas-wrap').screenshot({path:'brain-test-results/orientation-all.png'});
 for(const view of ['axial','coronal','sagittal']){await page.locator(`[data-view="${view}"]`).click();await page.waitForTimeout(100);result=await renderedPixels();assert.ok(result.gold>80,`${view}: ${JSON.stringify(result)}`);await page.locator('#canvas-wrap').screenshot({path:`brain-test-results/orientation-${view}.png`});}
 await page.locator('[data-view="axial"]').click();const old=await page.locator('#slice-x').inputValue();const box=await page.locator('#brain-canvas').boundingBox();await page.mouse.click(box.x+box.width*.63,box.y+box.height*.46);assert.notEqual(await page.locator('#slice-x').inputValue(),old);await page.locator('#reset').click();
 const prevented=await page.locator('#brain-canvas').evaluate(canvas=>{const transfer=new DataTransfer();transfer.setData('text/uri-list','https://example.invalid/private-brain.nii.gz');transfer.files;const event=new DragEvent('drop',{bubbles:true,cancelable:true,dataTransfer:transfer});canvas.dispatchEvent(event);return event.defaultPrevented;});assert.equal(prevented,true);assert.deepEqual(external,[]);
 await page.setViewportSize({width:390,height:844});await page.waitForTimeout(100);result=await renderedPixels();assert.ok(result.gold>80,`mobile: ${JSON.stringify(result)}`);await page.locator('#canvas-wrap').screenshot({path:'brain-test-results/orientation-mobile.png'});
 console.log('PASS: visible orientation-label pixels in all slices and mobile, four rendered panels, linked pointer navigation, and blocked URL drop.');
}catch(error){await page.screenshot({path:'brain-test-results/orientation-failure.png',fullPage:true}).catch(()=>{});await writeFile('brain-test-results/orientation-failure.json',JSON.stringify({error:String(error),external,text:await page.locator('body').innerText()},null,2));throw error;}
finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
