import test from 'node:test';
import assert from 'node:assert/strict';
import { release } from '../scripts/release-production.mjs';

const production = 'https://khmerone.jaredrobertw.workers.dev';
const old = 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa';
const candidate = 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb';
const db = 'dddddddd-dddd-4ddd-bddd-dddddddddddd';
const preview = 'https://bbbbbbbb-khmerone.jaredrobertw.workers.dev';
const bindings = [
  {name:'LEARNING_DB',type:'d1',id:db},
  {name:'LEARNING_FILES',type:'r2_bucket',bucket_name:'owner-existing-files',jurisdiction:'eu'},
  {name:'LEARNING_ADMIN_KEY',type:'secret_text'},
  {name:'QUIZ_ROOMS',type:'durable_object_namespace',namespace_id:'original-rooms',class_name:'QuizRoom'},
];

function scenario() {
  const actions = [];
  let current = old;
  const deps = {
    built:{name:'khmerone',vars:{AZURE_SPEECH_REGION:'build-default'},assets:{directory:'../client'}},
    migrationDir:'archive-migration-directory',
    status:() => ({id:'deployment-' + current,versions:[{version_id:current,percentage:100}]}),
    view:() => ({resources:{bindings:structuredClone(bindings)}}),
    check:(origin,options) => { actions.push({name:'check',origin,options}); },
    configure:config => { actions.push({name:'configure',config}); },
    upload:() => { actions.push({name:'upload'}); return {worker_name:'khmerone',version_id:candidate,preview_url:preview}; },
    migrate:() => { actions.push({name:'migrate'}); },
    promote:id => { actions.push({name:'promote',id}); current=id; },
    log:()=>{},
  };
  return {deps,actions};
}

test('owner release checks the existing production account and service settings without writes', async () => {
  const {deps,actions} = scenario();
  await release({...deps,checkOnly:true});
  assert.deepEqual(actions.map(a=>a.origin),[production,'https://aaaaaaaa-khmerone.jaredrobertw.workers.dev']);
});

test('owner release reuses exact storage and tests the migrated version before switching traffic', async () => {
  const {deps,actions} = scenario();
  await release(deps);
  assert.deepEqual(actions.map(a=>a.name),['check','check','configure','upload','check','migrate','check','promote','check']);
  const {config} = actions[2];
  assert.deepEqual(config.d1_databases,[{binding:'LEARNING_DB',database_id:db,migrations_dir:deps.migrationDir}]);
  assert.deepEqual(config.r2_buckets,[{binding:'LEARNING_FILES',bucket_name:'owner-existing-files',jurisdiction:'eu'}]);
  assert.deepEqual(config.vars,{}); assert.equal(config.keep_vars,true);
  assert.deepEqual(actions[6],{name:'check',origin:preview,options:{directory:true,archive:true}});
  assert.equal(actions[7].id,candidate);
  assert.deepEqual(actions[8],{name:'check',origin:production,options:{directory:true,archive:true}});
});

test('foreign workers, unknown storage, stale local IDs and split traffic stop before upload', async () => {
  for (const change of [
    deps=>{deps.built.name='other';},
    deps=>{deps.view=()=>({resources:{bindings:[]}});},
    deps=>{deps.built.d1_databases=[{binding:'LEARNING_DB',database_id:old}];},
    deps=>{deps.built.r2_buckets=[{binding:'LEARNING_FILES',bucket_name:'wrong-files'}];},
    deps=>{deps.status=()=>({id:'split',versions:[{version_id:old,percentage:50},{version_id:candidate,percentage:50}]});},
    deps=>{deps.check=()=>{throw new Error('wrong account');};},
  ]) {
    const {deps,actions} = scenario(); change(deps);
    await assert.rejects(release(deps)); assert.equal(actions.length,0);
  }
});

test('a wrong preview host, changes to incumbent bindings or a failed candidate check prevent migration and promotion', async () => {
  for (const change of [
    deps=>{deps.upload=()=>({worker_name:'khmerone',version_id:candidate,preview_url:'https://bbbbbbbb-khmerone.someone-else.workers.dev'});},
    deps=>{deps.view=id=>({resources:{bindings:id===old ? bindings : bindings.slice(0,-1)}});},
    deps=>{deps.check=origin=>{if(origin===preview)throw new Error('unhealthy candidate');};},
  ]) {
    const {deps,actions}=scenario(); change(deps);
    await assert.rejects(release(deps)); assert.ok(!actions.some(a=>a.name==='migrate'||a.name==='promote'));
  }
});

test('a concurrent deployment, migration failure or unavailable archive prevents promotion', async () => {
  for (const change of [
    deps=>{let reads=0; const initial=deps.status; deps.status=()=>({...initial(),id:++reads<3?'initial':'changed'});},
    deps=>{deps.migrate=()=>{throw new Error('migration failed');};},
    deps=>{deps.check=(_origin,options)=>{if(options?.archive)throw new Error('archive missing');};},
  ]) {
    const {deps,actions}=scenario(); change(deps);
    await assert.rejects(release(deps)); assert.ok(!actions.some(a=>a.name==='promote'));
  }
});
