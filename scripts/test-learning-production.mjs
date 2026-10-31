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
 const posts = await mf.dispatchFetch('https://khmerone.test/posts-and-telecommunications');
 assert.equal(posts.status, 200);
 const postsHtml = await posts.text();
 for (const marker of ['១៩ · ក្រសួងប្រៃសណីយ៍', 'id="plan-checklist"', 'id="internet-plans"', 'id="outages"', 'https://postcode.gov.kh/', 'https://www.cambodiapost.com.kh/tracking/search']) {
   assert.ok(postsHtml.includes(marker), marker);
 }
 console.log('PASS /posts-and-telecommunications');
 const interior = await mf.dispatchFetch('https://khmerone.test/interior');
 assert.equal(interior.status, 200);
 const interiorHtml = await interior.text();
 for (const marker of ['ក្រសួងមហាផ្ទៃ', 'id="civil-registration"', 'id="identity-card"', 'id="one-window"', 'id="visit-checklist"', 'https://www.owso.gov.kh/en/contacts-us/']) {
   assert.ok(interiorHtml.includes(marker), marker);
 }
 console.log('PASS /interior');
 const inspection=await mf.dispatchFetch('https://khmerone.test/inspection');assert.equal(inspection.status,200);const inspectionHtml=await inspection.text();for(const marker of ['id="ig-title"','id="ig-observed"','id="ig-preview-title"','https://css-gdin.interior.gov.kh/home','href="/public-services"','id="ko-site-shell"','lang="km"'])assert.ok(inspectionHtml.includes(marker),marker);assert.ok(!inspectionHtml.includes('Internal Server Error'));console.log('PASS /inspection');
 const international=await mf.dispatchFetch('https://khmerone.test/international-services');assert.equal(international.status,200);const internationalHtml=await international.text();for(const marker of ['id="is-title"','id="is-country"','id="guide-study"','https://arrival.gov.kh/','href="/public-services"','id="ko-site-shell"','lang="km"'])assert.ok(internationalHtml.includes(marker),marker);assert.ok(!internationalHtml.includes('Internal Server Error'));console.log('PASS /international-services');
 const safety=await mf.dispatchFetch('https://khmerone.test/community-safety');assert.equal(safety.status,200);const safetyHtml=await safety.text();for(const marker of ['id="cs-title"','id="cs-plan"','https://mod.gov.kh/contact/','href="/social-support"','id="ko-site-shell"','lang="km"'])assert.ok(safetyHtml.includes(marker),marker);assert.ok(!safetyHtml.includes('Internal Server Error'));console.log('PASS /community-safety');
 const government=await mf.dispatchFetch('https://khmerone.test/public-services');assert.equal(government.status,200);const governmentHtml=await government.text();assert.ok(governmentHtml.includes('id="gs-title"'));assert.ok(governmentHtml.includes('https://registrationservices.gov.kh/home-en/'));assert.ok(governmentHtml.includes('href="/social-support"'));assert.ok(governmentHtml.includes('id="ko-site-shell"'));assert.ok(governmentHtml.includes('lang="km"'));assert.ok(!governmentHtml.includes('Internal Server Error'));console.log('PASS /public-services');
 const support=await mf.dispatchFetch('https://khmerone.test/social-support');assert.equal(support.status,200);const supportHtml=await support.text();assert.ok(supportHtml.includes('id="ss-title"'));assert.ok(supportHtml.includes('tel:1280'));assert.ok(supportHtml.includes('https://idpoor.gov.kh/en/faq/'));assert.ok(supportHtml.includes('id="ko-site-shell"'));assert.ok(supportHtml.includes('lang="km"'));assert.ok(!supportHtml.includes('Internal Server Error'));console.log('PASS /social-support');
 const search=await mf.dispatchFetch('https://khmerone.test/search?q=photosynthesis');assert.equal(search.status,200);assert.ok((await search.text()).includes('Search Khmer One'));console.log('PASS /search');
 for(const [path,expected] of Object.entries(pages)){
  const response=await mf.dispatchFetch('https://khmerone.test'+path);
  assert.equal(response.status,200,path);const html=await response.text();assert.ok(html.includes(expected),`${path}: expected visible content`);assert.ok(!html.includes('Internal Server Error'),path);assert.ok(html.includes('id="ko-site-shell"'),path+': shared navigation');assert.ok(html.includes('/site-experience.js'),path+': enhancement script');assert.ok(!/<img[^>]+(?:museum-of-obsolete|cambodia-tomorrow)/.test(html),path+': no decorative requests before preferences');assert.ok(!/<audio[^>]+src="\/audio/.test(html),path+': no ambient request before click');console.log(`PASS ${path}`);
 }
 const missing=await mf.dispatchFetch('https://khmerone.test/learning/not-a-tool');assert.equal(missing.status,404);await missing.body?.cancel();console.log('PASS unknown tool returns 404');
}finally{await mf.dispose();}
