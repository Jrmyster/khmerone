import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyInspectionDraft, updateInspectionDraft, inspectionDraftText, inspectionFields, inspectionChannels, inspectionChecklist, inspectionNotice, inspectionChecked } from '../data/inspection.ts';

test('draft edits are bounded and isolated, and clearing creates an empty independent record', () => {
  const original = emptyInspectionDraft();
  for (const field of inspectionFields) {
    const updated = updateInspectionDraft(original, field.id, 'x'.repeat(field.max + 100));
    assert.equal(updated[field.id].length, field.max);
    assert.equal(original[field.id], '');
    for (const other of inspectionFields.filter(item => item.id !== field.id)) assert.equal(updated[other.id], '');
  }
  const first = emptyInspectionDraft(); first.observed = 'Test note';
  assert.equal(emptyInspectionDraft().observed, '');
});

test('worksheet export preserves literal multilingual notes, draft status and provenance without inventing missing facts', () => {
  const note = 'Test only: <script>example</script> & "quoted"\nកំណត់ត្រាសាកល្បង';
  const draft = updateInspectionDraft(emptyInspectionDraft(), 'observed', note);
  for (const locale of ['en', 'km']) {
    const text = inspectionDraftText(draft, locale, [0, 2]);
    assert.ok(text.includes(note));
    assert.ok(text.includes(inspectionNotice[locale]));
    assert.ok(text.includes(locale === 'en' ? 'NOTHING HAS BEEN SUBMITTED' : 'មិនទាន់បានដាក់បញ្ជូន'));
    assert.ok(text.includes('____________________'));
    for (const [i, item] of inspectionChecklist.entries()) assert.ok(text.includes(`${[0, 2].includes(i) ? '☑' : '☐'} ${item[locale]}`));
    for (const channel of inspectionChannels) for (const link of channel.links) assert.ok(text.includes(link.url));
    assert.ok(text.includes(inspectionChecked));
    assert.ok(text.includes(locale === 'en' ? 'not been teacher-reviewed' : 'មិនទាន់បានពិនិត្យដោយគ្រូ'));
  }
  assert.equal(draft.observed, note);
  assert.ok(!inspectionDraftText(emptyInspectionDraft(), 'en').includes(note));
});

test('all channels distinguish institution and scope, with bilingual content and trusted source links', () => {
  const hosts = new Set(['inspection.gov.kh', 'www.trc.gov.kh', 'www.interior.gov.kh', 'css-gdin.interior.gov.kh', 'www.acu.gov.kh', 'www.transparency.org']);
  assert.equal(new Set(inspectionChannels.map(item => item.id)).size, 4);
  for (const channel of inspectionChannels) {
    for (const item of [channel.title, channel.type, channel.summary, channel.note, ...channel.steps]) { assert.ok(item.en.trim()); assert.match(item.km, /[\u1780-\u17ff]/); }
    for (const link of channel.links) { const url = new URL(link.url); assert.equal(url.protocol, 'https:'); assert.ok(hosts.has(url.hostname)); }
  }
  for (const field of inspectionFields) { assert.ok(field.label.en); assert.match(field.label.km, /[\u1780-\u17ff]/); }
});
