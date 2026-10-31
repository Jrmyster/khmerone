import test, { after } from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { realpathSync } from 'node:fs';
import { mkdtemp, rm, readdir, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { matchesSearchFields, normalizeSearchText, searchExcerpt, textValues } from '../lib/search.ts';
import { fetchPublishedResources } from '../lib/search-resources.ts';

const require = createRequire(realpathSync(resolve('node_modules/wrangler/package.json')));
const { build } = require('esbuild');
const temporary = await mkdtemp(join(tmpdir(), 'khmerone-search-'));
after(() => rm(temporary, { recursive: true, force: true }));
const outfile = join(temporary, 'index.mjs');
await build({ stdin: { contents: `export * from './data/siteSearch'; export {ministryGuides} from './data/ministry-guides'; export * from './utils/search'; export {apps} from './data/apps'; export {learningTools,terms,stories} from './data/learning'; export {toolkitUnits} from './data/teacherToolkit';`, resolveDir: process.cwd() }, bundle: true, platform: 'node', format: 'esm', outfile });
const { siteSearchDocuments: documents, searchSite, searchSiteApps, resourceSearchDocuments, searchAppCatalog, apps, learningTools, terms, stories, toolkitUnits, ministryGuides } = await import(pathToFileURL(outfile).href);

test('English and Khmer search preserve vowels, ignore invisible spacing, and understand digits', () => {
  assert.equal(normalizeSearchText('កោសិកា'), normalizeSearchText('កោសិ\u200bកា'));
  assert.ok(matchesSearchFields(['កោសិកា'], 'កោ សិ កា'));
  assert.ok(matchesSearchFields(['ថ្នាក់ទី១០–១២'], 'ថ្នាក់ទី10'));
  assert.ok(matchesSearchFields(['Café and chemistry'], 'CAFE'));
  assert.ok(matchesSearchFields(['Cell', 'The smallest structural and functional unit of living things.'], 'FUNCTIONAL, smallest'));
  assert.ok(matchesSearchFields(['Cell'], 'cells'));
  assert.equal(matchesSearchFields(['excellent'], 'cell'), false);
  assert.equal(matchesSearchFields(['co', 'operation'], 'cooperation'), false);
  assert.equal(matchesSearchFields(['Cell'], '!!!'), false);
  assert.ok(matchesSearchFields(['Cell'], ''));
});

test('every catalog app, local page and public HTML page has a search destination', async () => {
  assert.equal(new Set(documents.map(document => document.id)).size, documents.length);
  for (const app of apps) assert.ok(documents.some(document => document.id === `app-${app.id}`), app.id);
  const destinations = new Set(documents.map(document => new URL(document.href, 'https://khmerone.test').pathname));
  for (const file of await readdir('app', { recursive: true })) {
    const normalized = file.replace(/\\/g, '/');
    if (normalized === 'feedback-inbox/page.tsx') { assert.ok(!destinations.has('/feedback-inbox')); continue; }
    if (!/(^|\/)page\.tsx$/.test(normalized) || normalized.includes('[brandAlias]')) continue;
    if (normalized.includes('[tool]')) { for (const tool of learningTools) assert.ok(destinations.has('/learning/' + tool.id), tool.id); }
    else if (normalized === 'ministries/[slug]/page.tsx') {
      assert.deepEqual(ministryGuides.map(item => item.n), Array.from({length:18}, (_, i) => i + 1));
      assert.equal(new Set(ministryGuides.map(item => item.slug)).size, 18);
      for (const item of ministryGuides) {
        assert.ok(destinations.has('/ministries/' + item.slug), item.slug);
        for (const locale of ['en','km']) assert.ok(searchSite(item.title[locale]).some(result => result.id === 'ministry-' + item.n), item.slug);
      }
    }
    else assert.ok(destinations.has('/' + normalized.replace(/(^|\/)page\.tsx$/, '')), normalized);
  }
  for (const file of (await readdir('public', { recursive: true })).filter(file => file.endsWith('.html'))) assert.ok(destinations.has('/' + file.replace(/\\/g, '/')), file);
  const generated = JSON.parse(await readFile('data/publicSearch.generated.json', 'utf8'));
  for (const page of generated) {
    const document=documents.find(document=>document.href===page.href);
    assert.ok(document, page.href);
    for(const field of page.fields)assert.ok(document.fields.includes(field), `Missing page text: ${page.href}`);
  }
});

test('all STEM definitions/examples and complete stories are indexed in both languages', () => {
  for (const term of terms) {
    const document = documents.find(document => document.id === `term-${term.id}`);
    for (const field of textValues(term)) assert.ok(document.fields.includes(field), `Missing ${term.id}: ${field}`);
    for (const locale of ['en', 'km']) assert.ok(searchSite(term.term[locale]).some(result => result.id === document.id));
    assert.equal(new URL(document.href, 'https://test').searchParams.get('term'), term.id);
  }
  for (const story of stories) {
    const document = documents.find(document => document.id === `story-${story.id}`);
    for (const field of textValues(story)) assert.ok(document.fields.includes(field), `Missing ${story.id}: ${field}`);
    assert.equal(new URL(document.href, 'https://test').searchParams.get('story'), story.id);
  }
  for (const unit of toolkitUnits) {
    const document = documents.find(document => document.id === `toolkit-${unit.id}`);
    for (const field of textValues(unit)) assert.ok(document.fields.includes(field), `Missing ${unit.id}: ${field}`);
  }
});

test('exact titles rank before incidental mentions and body-only words produce direct links', () => {
  assert.equal(searchSite('cell')[0].id, 'term-stem-1');
  assert.equal(searchSite('python')[0].id, 'code-python');
  assert.equal(searchSite('PHOTOSYNTHESIS!!!')[0].title.en, 'Photosynthesis');
  assert.ok(searchSite('wooden board').some(result => result.href === '/learning/stories?story=bridge'));
  assert.ok(searchSite('condense droplets').some(result => result.href === '/teacher-toolkit?unit=water-cycle'));
  assert.ok(searchSite('compression').some(result => result.href === '/engine-lab.html'));
  assert.ok(searchSiteApps('compression').some(result => result.id === 'engine-lab'), 'Home search must include words from inside a page, not just app metadata');
  assert.ok(searchAppCatalog(apps, 'lesson translation').some(result => result.id === 'learning-translation'));
  assert.deepEqual(searchSite(''), []);
  assert.deepEqual(searchSite('!!!'), []);
});

test('resource indexing excludes drafts, rejected records and private metadata', () => {
  const resource = { id: 'test', title: 'School microscope', description: 'Observe plant cells', school: 'Test school', province: 'Kampot', subject: 'Biology', kind: 'equipment', status: 'approved', privateNote: 'private-token-do-not-index' };
  const indexed = resourceSearchDocuments([resource, { ...resource, id: 'draft', status: 'pending' }, { ...resource, id: 'rejected', status: 'rejected' }]);
  assert.equal(indexed.length, 1);
  assert.equal(searchSite('plant cells', indexed)[0].title.en, 'School microscope');
  assert.equal(searchSite('private-token-do-not-index', indexed).length, 0);
  assert.equal(searchSite('Kampot microscope', indexed).length, 1);
});

test('public resource loading follows cursors, filters private records and propagates failures', async t => {
  const calls = [];
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.push(url); assert.equal(options.cache, 'no-store');
    return Response.json(calls.length === 1 ? { items: [{ id: 'one', status: 'approved' }, { id: 'hidden', status: 'pending' }], nextCursor: 'cursor-one' } : { items: [{ id: 'two', status: 'approved' }], nextCursor: null });
  });
  assert.deepEqual((await fetchPublishedResources()).map(item => item.id), ['one', 'two']);
  assert.equal(calls[1], '/api/learning/resources?index=1&after=cursor-one');
  assert.ok(calls.every(url => !url.includes('review')));
  globalThis.fetch = async () => new Response('', { status: 503 });
  await assert.rejects(fetchPublishedResources(), /unavailable/);
});

test('snippets find matching text and stay bounded without interpreting HTML', () => {
  const snippet = searchExcerpt(['A prefix. '.repeat(40) + 'Chlorophyll helps plants.'], 'chlorophyll', 'Fallback');
  assert.match(snippet, /Chlorophyll/); assert.ok(snippet.length <= 192);
  assert.equal(searchExcerpt(['<script>plant</script>'], 'plant', 'Fallback'), '<script>plant</script>');
});
