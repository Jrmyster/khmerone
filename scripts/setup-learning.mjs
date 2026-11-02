#!/usr/bin/env node
// Run from the source folder after `pnpm exec wrangler login`.
// Provisions only the named learning resources. Does not deploy the app or change secrets.
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
const root=resolve(import.meta.dirname,'..');process.chdir(root);
const wrangler=resolve(root,'node_modules/wrangler/bin/wrangler.js');
if(!existsSync(wrangler))throw new Error('Run pnpm install first.');
const configPath=resolve(root,'.learning-setup/wrangler.json');mkdirSync(resolve(root,'.learning-setup'),{recursive:true});
const config={name:'khmerone',compatibility_date:'2026-05-15'};
writeFileSync(configPath,JSON.stringify(config,null,2));
const run=(args,capture=false)=>{const result=spawnSync(process.execPath,[wrangler,...args,'--config',configPath],{cwd:root,encoding:'utf8',stdio:capture?['inherit','pipe','pipe']:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});if(result.error)throw result.error;if(result.status!==0){if(capture)process.stderr.write(result.stderr||result.stdout);throw new Error('Cloudflare command failed. Resolve the message above, then run setup again. Existing resources are reused.');}return result.stdout||'';};
try{
 const old=existsSync('learning-infra.json')?JSON.parse(readFileSync('learning-infra.json','utf8')):{};
 const databaseName=old.databaseName||'khmerone-learning',bucketName=old.bucketName||'khmerone-learning-files';
 console.log('Checking your Cloudflare account and learning database…');
 const list=()=>JSON.parse(run(['d1','list','--json'],true));
 let databases=list();let database=databases.find(d=>d.name===databaseName);
 if(!database){run(['d1','create',databaseName,'--location','apac','--update-config=false']);database=list().find(d=>d.name===databaseName);}
 if(!database?.uuid)throw new Error('Database ID was not returned. Do not deploy until learning-infra.json contains the correct database ID.');
 // Save the D1 identity before R2 setup so a retry cannot accidentally lose it.
 writeFileSync('learning-infra.json',JSON.stringify({databaseId:database.uuid,databaseName,...(old.bucketName?{bucketName:old.bucketName}:{})},null,2)+'\n');
 if(!process.argv.includes('--without-files')){
  console.log('Checking the private attachment bucket…');
  const buckets=run(['r2','bucket','list'],true);
  if(!buckets.split(/\r?\n/).some(line=>line.trim().replace(/^name:\s*/, '')===bucketName))run(['r2','bucket','create',bucketName]);
  writeFileSync('learning-infra.json',JSON.stringify({databaseId:database.uuid,databaseName,bucketName},null,2)+'\n');
 }
 Object.assign(config,{d1_databases:[{binding:'LEARNING_DB',database_name:databaseName,database_id:database.uuid,migrations_dir:resolve(root,'migrations')}]});writeFileSync(configPath,JSON.stringify(config,null,2));
 console.log('Applying the resource exchange migration…');run(['d1','migrations','apply','LEARNING_DB','--remote']);
 console.log('\nStorage setup complete. Next: pnpm build. Then add the Translator and editor secrets using docs/learning-deployment.md.');
}catch(e){console.error('\n'+e.message);process.exitCode=1;}
