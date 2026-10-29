// Checks server rendering in the real Workers runtime after `pnpm build`.
// No browser, microphone, live Azure request or remote Cloudflare write is involved.
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {realpathSync,readdirSync} from 'node:fs';
import {resolve} from 'node:path';
const require=createRequire(realpathSync('node_modules/wrangler/package.json'));
const {Miniflare}=require('miniflare');
const root=resolve('dist/server');
const files=['index.js',...readdirSync(root,{recursive:true}).filter(f=>/\.(m?js)$/.test(f)&&f!=='index.js')];
const mf=new Miniflare({modules:files.map(f=>({type:'ESModule',path:resolve(root,f)})),modulesRoot:root,compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],durableObjects:{QUIZ_ROOMS:{className:'QuizRoom',useSQLite:true}}});
const pages={'/typing':'Keyboard Garden','/':'KHMER ONE','/search':'Search Khmer One','/teacher-toolkit':'toolkit-output','/computer-engineering':'ce-gate','/feedback-inbox':'Feedback inbox','/learning':'Small discoveries.','/learning/dictionary':'Talking STEM Dictionary','/learning/speaking':'English Speaking Practice','/learning/quiz-maker':'Listening Quiz Maker','/learning/stories':'Bilingual Story Library','/learning/announcements':'School Announcement Maker','/learning/translation':'Lesson Translation Workbench','/learning/live-quiz':'Live Classroom Quiz','/learning/exchange':'School Connect Exchange','/teacher-audio':'teacher-audio-shell'};
try{
 const search=await mf.dispatchFetch('https://khmerone.test/search?q=photosynthesis');assert.equal(search.status,200);assert.ok((await search.text()).includes('Search Khmer One'));console.log('PASS /search');
 for(const [path,expected] of Object.entries(pages)){
  const response=await mf.dispatchFetch('https://khmerone.test'+path);
  assert.equal(response.status,200,path);const html=await response.text();assert.ok(html.includes(expected),`${path}: expected visible content`);assert.ok(!html.includes('Internal Server Error'),path);assert.ok(html.includes('id="ko-site-shell"'),path+': shared navigation');assert.ok(html.includes('/site-experience.js'),path+': enhancement script');assert.ok(!/<img[^>]+(?:museum-of-obsolete|cambodia-tomorrow)/.test(html),path+': no decorative requests before preferences');assert.ok(!/<audio[^>]+src="\/audio/.test(html),path+': no ambient request before click');console.log(`PASS ${path}`);
 }
 const missing=await mf.dispatchFetch('https://khmerone.test/learning/not-a-tool');assert.equal(missing.status,404);await missing.body?.cancel();console.log('PASS unknown tool returns 404');
}finally{await mf.dispose();}
