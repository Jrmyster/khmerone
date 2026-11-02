import test from 'node:test';
import assert from 'node:assert/strict';
import { governmentPaths, governmentTopics, governmentChecklist, findGovernmentPaths, governmentPlanText } from '../data/governmentServices.ts';

test('government finder combines bilingual service and institution searches with topic filters', () => {
  assert.equal(findGovernmentPaths('', 'all').length, 8);
  assert.deepEqual(findGovernmentPaths('  ID\u200BPoor ', 'support').map(p => p.id), ['assistance']);
  assert.deepEqual(findGovernmentPaths('កំណើត', 'family').map(p => p.id), ['birth']);
  assert.deepEqual(findGovernmentPaths('Ministry Commerce', 'work').map(p => p.id), ['business']);
  assert.deepEqual(findGovernmentPaths('Commerce', 'family'), []);
  assert.deepEqual(findGovernmentPaths('no-such-service-123', 'all'), []);
  for (const topic of governmentTopics) assert.ok(findGovernmentPaths('', topic.id).length);
});

test('each service guide has bilingual preparation, official links and a dated source', () => {
  assert.equal(new Set(governmentPaths.map(p => p.id)).size, governmentPaths.length);
  for (const path of governmentPaths) {
    for (const field of [path.title, path.summary, ...path.institutions, ...path.steps, ...path.questions]) {
      assert.ok(field.en.trim()); assert.match(field.km, /[\u1780-\u17ff]/);
    }
    assert.equal(new URL(path.source).protocol, 'https:');
    assert.match(path.checked, /^\d{4}-\d{2}-\d{2}$/);
    assert.ok(path.links.some(link => link.official));
    for (const link of path.links) {
      if (link.official) assert.match(new URL(link.url).hostname, /\.gov\.kh$/);
      else assert.equal(link.url, '/social-support');
    }
  }
});

test('downloaded guides retain all preparation, institution, source and independence information', () => {
  for (const path of governmentPaths) for (const locale of ['en', 'km']) {
    const text = governmentPlanText(path, locale);
    for (const item of [path.title, ...path.institutions, ...path.steps, ...path.questions, ...governmentChecklist]) assert.ok(text.includes(item[locale]));
    for (const link of path.links) assert.ok(text.includes(link.url));
    assert.ok(text.includes(path.source)); assert.ok(text.includes(path.checked));
    assert.ok(text.includes(locale === 'en' ? 'independent guide' : 'ឯករាជ្យ'));
  }
});
