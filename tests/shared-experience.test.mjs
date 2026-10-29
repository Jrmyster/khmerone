import test from 'node:test';
import assert from 'node:assert/strict';
import { matchingReview } from '../lib/content-review.ts';
import { handleLearning } from '../lib/learning/server.ts';
import { validateFeedback } from '../lib/learning/feedback.ts';
import { builtInTools, siteNavigationHtml } from '../lib/site-navigation.ts';
import { readFileSync } from 'node:fs';
test('review is tied to exact text and an identified teacher/date',()=>{
 const review={text:'សួស្តី',teacher:'Test teacher',reviewedAt:'2026-10-29'};
 assert.equal(matchingReview(review.text,review),review);
 assert.equal(matchingReview(review.text+'!',review),undefined);
 assert.equal(matchingReview(review.text),undefined);
 assert.equal(matchingReview(review.text,{...review,teacher:''}),undefined);
 assert.equal(matchingReview(review.text,{...review,reviewedAt:'2026-02-30'}),undefined);
});
test('feedback bounds text and excludes arbitrary query strings and external URLs',()=>{
 const input={id:crypto.randomUUID(),category:'translation',message:'Please check this word.',page:'/learning/dictionary?term=stem-1'};
 assert.equal(validateFeedback(input).message,input.message);
 for(const patch of [{page:'https://evil.test/'},{page:'//evil.test'},{page:'/learning?token=secret'},{message:'  '},{message:'x'.repeat(2001)},{category:'spam'},{website:'bot'},{id:'bad'}])assert.throws(()=>validateFeedback({...input,...patch}),/invalid_feedback/);
});
test('all built-in tools share native navigation with the standalone lab',()=>{
 assert.equal(builtInTools.length,14);
 assert.equal(new Set(builtInTools.map(x=>x[2])).size,14);
 const html=readFileSync('public/engine-lab.html','utf8');assert.ok(html.includes(siteNavigationHtml));
 for(const [, ,url] of builtInTools)assert.ok(siteNavigationHtml.includes(`href="${url}"`));
 assert.ok(siteNavigationHtml.includes('href="/"'));
});

test('feedback rejects cross-origin and rate-limited submissions before storage',async()=>{
 const body={id:crypto.randomUUID(),category:'link',page:'/',message:'This link is broken.'};
 const req=(origin='https://khmerone.test')=>new Request('https://khmerone.test/api/learning/feedback',{method:'POST',headers:{'Content-Type':'application/json',Origin:origin},body:JSON.stringify(body)});
 const db={prepare:()=>assert.fail('rejected request must not reach storage')};
 assert.equal((await handleLearning(req('https://other.test'),{LEARNING_DB:db})).status,403);
 assert.equal((await handleLearning(req(),{LEARNING_DB:db,LEARNING_RATE_LIMITER:{limit:async()=>({success:false})}})).status,429);
 assert.equal((await handleLearning(req(),{LEARNING_RATE_LIMITER:{limit:async()=>({success:true})}})).status,503);
});
