#!/usr/bin/env node
// Default: configuration/page checks. --services also makes three short Azure calls.
// Never creates rooms or listings, accepts secrets, or prints provider response bodies.
const args=process.argv.slice(2);
if(args.some(a=>a.startsWith('-')&&a!=='--services'))throw new Error('Only --services is supported.');
const live=args.includes('--services');
const origin=args.find(a=>!a.startsWith('-'))||'https://khmerone.jaredrobertw.workers.dev';
if(!/^https:\/\//.test(origin))throw new Error('Use the HTTPS production address.');
let failed=false;
for(const path of ['/learning','/learning/dictionary','/learning/speaking','/learning/quiz-maker','/learning/stories','/learning/announcements','/learning/translation','/learning/live-quiz','/learning/exchange','/teacher-audio']){
 try{const r=await fetch(new URL(path,origin),{signal:AbortSignal.timeout(20000)});if(!r.ok)failed=true;console.log(`${r.status} ${path}`);await r.body?.cancel();}catch(e){failed=true;console.error(`${path}: ${e.message}`);}
}
try{const r=await fetch(new URL('/api/learning/status',origin),{signal:AbortSignal.timeout(20000)});if(!r.ok)throw new Error(`HTTP ${r.status}`);const s=await r.json();for(const [name,ready] of Object.entries(s)){console.log(`${ready?'CONFIGURED':'SETUP NEEDED'} ${name}`);if(!ready)failed=true;}}catch(e){failed=true;console.error(`Service setup: ${e.message}`);}
if(live){
 const checks=[
  ['English audio','speech',{text:'Cell.',language:'en',speed:'normal'}],
  ['Khmer audio','speech',{text:'សួស្តី',language:'km',speed:'normal'}],
  ['English to Khmer translation','translate',{text:'Good morning!',from:'en',to:'km'}],
 ];
 for(const [label,path,body] of checks){
  try{
   const r=await fetch(new URL('/api/learning/'+path,origin),{method:'POST',headers:{'Content-Type':'application/json',Origin:new URL(origin).origin},body:JSON.stringify(body),signal:AbortSignal.timeout(45000)});
   if(!r.ok){const data=await r.json().catch(()=>({}));const code=typeof data.error==='string'&&/^[a-z0-9_]{1,80}$/.test(data.error)?data.error:'request_failed';throw new Error(`HTTP ${r.status}: ${code}`);}
   if(path==='speech'){
    if(!r.headers.get('Content-Type')?.startsWith('audio/')||!(await r.arrayBuffer()).byteLength)throw new Error('No audio returned');
   }else{const data=await r.json();if(typeof data.text!=='string'||!data.text.trim())throw new Error('No translation returned');}
   console.log(`PASS ${label}: live service returned a result`);
  }catch(e){failed=true;console.error(`FAIL ${label}: ${e.message}`);}
 }
}else console.log('Configuration checks do not test Azure. Use pnpm run verify:learning --services for live audio and translation checks.');
if(failed)process.exitCode=1;
