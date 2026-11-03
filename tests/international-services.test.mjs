import test from 'node:test';
import assert from 'node:assert/strict';
import { internationalGuides, internationalChecklist, internationalNotice, internationalPlanText, internationalChecked, missionContacts } from '../data/internationalServices.ts';

test('international exports retain complete guidance, sources, caveats and checked state in both languages', () => {
  for (const guide of internationalGuides) for (const locale of ['en', 'km']) {
    const text = internationalPlanText(guide, locale, [1, 3]);
    for (const item of [guide.title, internationalNotice, ...guide.steps, ...guide.questions]) assert.ok(text.includes(item[locale]));
    for (const [i, item] of internationalChecklist.entries()) assert.ok(text.includes(`${[1, 3].includes(i) ? '☑' : '☐'} ${item[locale]}`));
    for (const link of guide.links) assert.ok(text.includes(link.url));
    assert.ok(text.includes(internationalChecked));
    assert.ok(text.includes(locale === 'en' ? 'not been teacher-reviewed' : 'មិនទាន់បានពិនិត្យដោយគ្រូ'));
    assert.equal((internationalPlanText(guide, locale).match(/☑/g) || []).length, 0);
  }
});

test('international guides and mission sources have bilingual text and bounded official source destinations', () => {
  const allowed = new Set(['www.mfaic.gov.kh', 'www.evisa.gov.kh', 'arrival.gov.kh', 'www.kh.emb-japan.go.jp', 'www.dfat.gov.au', 'cambodiaembassyinthailand.wordpress.com', 'protocol.kln.gov.my', 'www.cambodiaembassyuk.org']);
  assert.equal(new Set(internationalGuides.map(item => item.id)).size, 5);
  assert.equal(new Set(missionContacts.map(item => item.id)).size, 3);
  for (const guide of internationalGuides) {
    for (const item of [guide.title, guide.summary, guide.benefit, ...guide.steps, ...guide.questions]) { assert.ok(item.en.trim()); assert.match(item.km, /[\u1780-\u17ff]/); }
    assert.ok(guide.links.length);
  }
  for (const link of [...internationalGuides.flatMap(item => item.links), ...missionContacts]) {
    const url = new URL(link.url); assert.equal(url.protocol, 'https:'); assert.ok(allowed.has(url.hostname));
    assert.ok(link.label.en.trim()); assert.match(link.label.km, /[\u1780-\u17ff]/);
  }
});
