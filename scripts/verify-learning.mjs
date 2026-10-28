#!/usr/bin/env node
// Read-only post-deploy checks. Does not create Azure calls, rooms or listings.
const origin=process.argv[2]||'https://khmerone.jaredrobertw.workers.dev';
if(!/^https:\/\//.test(origin))throw new Error('Use the HTTPS production address.');
let failed=false;
for(const path of ['/learning','/learning/dictionary','/learning/speaking','/learning/quiz-maker','/learning/stories','/learning/announcements','/learning/translation','/learning/live-quiz','/learning/exchange','/teacher-audio']){
 try{const r=await fetch(new URL(path,origin),{signal:AbortSignal.timeout(20000)});if(!r.ok)failed=true;console.log(`${r.status} ${path}`);await r.body?.cancel();}catch(e){failed=true;console.error(`${path}: ${e.message}`);}
}
try{const r=await fetch(new URL('/api/learning/status',origin));if(!r.ok)throw new Error(`HTTP ${r.status}`);const s=await r.json();for(const [name,ready] of Object.entries(s)){console.log(`${ready?'READY':'SETUP NEEDED'} ${name}`);if(!ready)failed=true;}}catch(e){failed=true;console.error(`Service setup: ${e.message}`);}
if(failed)process.exitCode=1;
