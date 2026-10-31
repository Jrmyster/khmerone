import test from 'node:test';
import assert from 'node:assert/strict';
import { safetyChecklist, safetyTopics, safetySources, safetyNotice, safetyPlanText, mineSafety, safetyChecked } from '../data/communitySafety.ts';

test('offline safety guides retain caution, source provenance and the selected checklist state in both languages', () => {
  for (const locale of ['en', 'km']) {
    const text = safetyPlanText(locale, [0, 3]);
    assert.ok(text.includes(safetyNotice[locale]));
    assert.ok(text.includes(safetyChecked));
    for (const [i, item] of safetyChecklist.entries()) assert.ok(text.includes(`${[0, 3].includes(i) ? '☑' : '☐'} ${item[locale]}`));
    for (const item of mineSafety) assert.ok(text.includes(item[locale]));
    for (const source of Object.values(safetySources)) assert.ok(text.includes(source.url));
    assert.ok(text.includes(locale === 'en' ? 'not been reviewed' : 'មិនទាន់បានពិនិត្យ'));
    assert.equal((safetyPlanText(locale).match(/☑/g) || []).length, 0);
  }
});

test('all safety topics have bilingual steps and benefits with trusted HTTPS sources', () => {
  const hosts = new Set(['vps.akp.gov.kh', 'cmac.gov.kh', 'www.redcross.org', 'mod.gov.kh']);
  assert.equal(new Set(safetyTopics.map(topic => topic.id)).size, 4);
  for (const topic of safetyTopics) {
    for (const item of [topic.title, topic.summary, topic.benefit, ...topic.steps]) {
      assert.ok(item.en.trim()); assert.match(item.km, /[\u1780-\u17ff]/);
    }
    assert.ok(topic.sources.length);
    for (const source of topic.sources) { const url = new URL(source.url); assert.equal(url.protocol, 'https:'); assert.ok(hosts.has(url.hostname)); }
  }
});
