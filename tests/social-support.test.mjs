import test from 'node:test';
import assert from 'node:assert/strict';
import { supportCategories, supportServices, filterSupportServices, visitChecklist, visitPlanText } from '../data/socialSupport.ts';

test('support filters combine topic with either language and handle missing matches', () => {
  assert.equal(filterSupportServices('', 'all').length, 6);
  assert.ok(filterSupportServices('មនុស្សចាស់', 'older').some(s => s.id === 'helpage'));
  assert.deepEqual(filterSupportServices('Exceed', 'disability').map(s => s.id), ['exceed']);
  assert.deepEqual(filterSupportServices('Exceed', 'youth'), []);
  assert.deepEqual(filterSupportServices('  ID\u200BPoor  ', 'assistance').map(s => s.id), ['idpoor']);
  assert.deepEqual(filterSupportServices('no-such-provider-123', 'all'), []);
  for (const category of supportCategories) assert.ok(filterSupportServices('', category.id).length, category.id);
});

test('every published provider has bilingual guidance, a dated HTTPS source and safe phone links', () => {
  assert.equal(new Set(supportServices.map(s => s.id)).size, supportServices.length);
  for (const service of supportServices) {
    for (const field of ['name', 'description', 'nextStep', 'reach']) {
      assert.ok(service[field].en.trim()); assert.match(service[field].km, /[\u1780-\u17ff]/);
    }
    assert.equal(new URL(service.source).protocol, 'https:');
    assert.equal(new URL(service.url).protocol, 'https:');
    assert.match(service.checked, /^\d{4}-\d{2}-\d{2}$/);
    if (service.phone) assert.match(service.phone, /^(?:\+855\d{8,9}|1280)$/);
    for (const category of service.categories) assert.ok(supportCategories.some(item => item.id === category));
  }
});

test('offline visit plans retain contact, source date, caveat and complete preparation checklist', () => {
  for (const service of supportServices) for (const locale of ['en', 'km']) {
    const plan = visitPlanText(service, locale);
    assert.ok(plan.includes(service.name[locale])); assert.ok(plan.includes(service.url)); assert.ok(plan.includes(service.checked));
    for (const item of visitChecklist) assert.ok(plan.includes(item[locale]));
    assert.ok(plan.includes(locale === 'en' ? 'independent guide' : 'ឯករាជ្យ'));
  }
});
