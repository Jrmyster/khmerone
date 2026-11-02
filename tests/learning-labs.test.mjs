import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { triangleInfo, compileProgram } from '../public/learning-labs/logic.js';
import { eyeFocus } from '../public/learning-labs/eye-optics.js';
const load = async file => JSON.parse(await readFile(new URL('../public/learning-labs/'+file,import.meta.url),'utf8'));
function blocks(items) {
  let next = null;
  for (const [index,item] of [...items.entries()].reverse()) {
    const following = next;
    next = {id:String(index),type:'ko_'+item.type,isEnabled:()=>true,getFieldValue:()=>item.times,getInputTargetBlock:()=>blocks(item.body||[]),getNextBlock:()=>following};
  }
  return next;
}
test('triangle: angles and area',()=>{const result=triangleInfo([[0,0],[3,0],[0,4]]);assert.equal(result.area,6);assert.ok(result.angles.some(a=>Math.abs(a-90)<1e-9));assert.ok(Math.abs(result.angles.reduce((a,b)=>a+b,0)-180)<1e-9);});
test('triangle: collinear or coincident points have no area',()=>{assert.equal(triangleInfo([[0,0],[1,1],[2,2]]),null);assert.equal(triangleInfo([[0,0],[0,0],[2,2]]),null);});
test('bounded compiler: loops preserve order',()=>{assert.deepEqual(compileProgram(blocks([{type:'repeat',times:3,body:[{type:'move'},{type:'water'}]}])).map(a=>a.type),['move','water','move','water','move','water']);});
test('bounded compiler: rejects huge, invalid and cyclic programs',()=>{assert.throws(()=>compileProgram(blocks([{type:'repeat',times:900,body:[]}])));assert.throws(()=>compileProgram(blocks([{type:'unknown'}])));const cycle={id:'cycle',type:'ko_move',isEnabled:()=>true,getNextBlock:()=>cycle};assert.throws(()=>compileProgram(cycle),/budget/);});
test('eye: normal, longer and shorter eye focus',()=>{assert.equal(eyeFocus().position,'on');assert.equal(eyeFocus({retinaMm:25}).position,'before');assert.equal(eyeFocus({retinaMm:20.5}).position,'behind');});
test('eye: negative lens moves focus farther back',()=>{assert.ok(eyeFocus({correction:-3}).focalMm>eyeFocus().focalMm);assert.ok(eyeFocus({correction:3}).focalMm<eyeFocus().focalMm);});
test('eye: rejects invalid model inputs',()=>{for(const power of [NaN,Infinity,0,-1])assert.throws(()=>eyeFocus({power}),RangeError);assert.throws(()=>eyeFocus({retinaMm:0}),RangeError);});
test('every coding mission example waters its plants without leaving the grid',async()=>{const {missions}=await load('data/missions.json');assert.equal(missions.length,3);const dirs=['north','east','south','west'];const deltas=[[0,-1],[1,0],[0,1],[-1,0]];for(const m of missions){const robot={...m.start};const watered=new Set();const actions=compileProgram(blocks(m.suggestedProgram)).map(a=>a.type);assert.deepEqual(actions,m.solutionActions);for(const action of actions){if(action==='right')robot.direction=dirs[(dirs.indexOf(robot.direction)+1)%4];if(action==='move'){const [x,y]=deltas[dirs.indexOf(robot.direction)];robot.x+=x;robot.y+=y;}assert.ok(robot.x>=0&&robot.x<m.gridSize&&robot.y>=0&&robot.y<m.gridSize,m.id);if(action==='water'&&m.plants.some(p=>p.x===robot.x&&p.y===robot.y))watered.add(`${robot.x},${robot.y}`);}assert.equal(watered.size,m.plants.length,m.id);}});
test('six molecules have symmetric bonds and correct formula counts',async()=>{const {molecules}=await load('data/molecules.json');assert.equal(molecules.length,6);for(const m of molecules){const counts={};m.atoms.forEach((atom,i)=>{counts[atom.elem]=(counts[atom.elem]||0)+1;assert.ok([atom.x,atom.y,atom.z].every(Number.isFinite));assert.equal(atom.bonds.length,atom.bondOrder.length);atom.bonds.forEach((j,k)=>{assert.notEqual(i,j);const other=m.atoms[j];assert.ok(other);assert.equal(other.bondOrder[other.bonds.indexOf(i)],atom.bondOrder[k]);});});const expected={};for(const [,element,n]of m.asciiFormula.matchAll(/([A-Z][a-z]?)(\d*)/g))expected[element]=Number(n||1);assert.deepEqual(counts,expected,m.id);assert.ok(m.question.choices.some(c=>c.id===m.question.correctChoiceId));}});
test('vocabulary has ten unique, bilingual cards',async()=>{const {cards}=await load('data/vocabulary.json');assert.equal(cards.length,10);assert.equal(new Set(cards.map(c=>c.id)).size,10);for(const c of cards)for(const l of ['en','km'])for(const key of ['term','definition','example'])assert.ok(c[l][key]?.trim());});
test('catalog preserves six local engines and five external resources',async()=>{const {resources}=await import('../public/learning-labs/catalog.js');assert.equal(resources.length,11);assert.equal(resources.filter(r=>r.local).length,6);assert.equal(new Set(resources.map(r=>r.id)).size,11);for(const r of resources){assert.match(r.repo,/^[\w.-]+\/[\w.-]+$/);if(!r.local)assert.equal(new URL(r.url).protocol,'https:');for(const l of ['en','km'])assert.ok(r.title[l]&&r.desc[l]);}});
