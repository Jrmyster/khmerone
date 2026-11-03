import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { lessons, courseVersion } from '../public/body-works/lessons.js';
import { selectLesson, grade, emptyProgress, parseProgress, recordAnswer, completedLessons, searchEntries } from '../public/body-works/state.js';
const allQuestions = lessons.flatMap(lesson => lesson.questions);
test('body course has six short lessons and twelve unique questions',() => {
  assert.deepEqual(lessons.map(lesson => lesson.id),['cells','oxygen','digestion','signals','balance','defense']);
  assert.equal(allQuestions.length,12); assert.equal(new Set(allQuestions.map(question => question.id)).size,12);
  lessons.forEach((lesson,index) => { assert.equal(lesson.number,index + 1); assert.equal(lesson.minutes,3); assert.equal(lesson.sections.length,3); assert.equal(lesson.vocabulary.length,2); assert.equal(lesson.questions.length,2); });
});
test('all learning copy, vocabulary, prompts and feedback are bilingual',() => {
  for (const lesson of lessons) for (const language of ['en','km']) {
    for (const field of ['title','goal','hook','sequenceNote','think']) assert.ok(lesson[field][language]?.trim());
    for (const section of lesson.sections) { assert.ok(section.title[language]); assert.ok(section.text[language]); }
    for (const item of lesson.vocabulary) { assert.ok(item.term[language]); assert.ok(item.definition[language]); }
    for (const item of lesson.sequence) assert.ok(item[language]);
    for (const question of lesson.questions) { assert.ok(question.prompt[language]); assert.ok(question.explanation[language]); assert.equal(question.choices.length,3); question.choices.forEach(choice => assert.ok(choice[language])); }
  }
});
test('each lesson credits specific OpenStax sections and only links existing local explorers',() => {
  for (const lesson of lessons) {
    assert.ok(lesson.sources.length >= 2);
    for (const source of lesson.sources) { const url = new URL(source.url); assert.equal(url.protocol,'https:'); assert.equal(url.hostname,'openstax.org'); assert.ok(url.pathname.startsWith('/books/anatomy-and-physiology-2e/pages/')); assert.ok(source.title); }
    assert.match(lesson.explore.url,/^\/(virtual-microscope|brain-scan-explorer|learning-labs)\/index\.html(?:[?#].*)?$/);
  }
});
test('scoring only accepts a bounded integer and the correct answer',() => {
  for (const question of allQuestions) {
    assert.ok(Number.isInteger(question.answer) && question.answer >= 0 && question.answer < question.choices.length);
    question.choices.forEach((_,index) => assert.equal(grade(question,index),index === question.answer));
    for (const choice of [-1,3,Infinity,NaN,null,'0',0.5]) assert.equal(grade(question,choice),false);
  }
});
test('progress parsing rejects malformed and stale content, duplicates and unknown IDs',() => {
  for (const raw of [null,'bad','null','[]','1','{}',JSON.stringify({version:'old',passed:['cells-1']})]) assert.deepEqual(parseProgress(raw),emptyProgress());
  assert.deepEqual(parseProgress(JSON.stringify({version:courseVersion,passed:['cells-1','cells-1','private',null,3],last:'../../private'})),{version:courseVersion,passed:['cells-1'],last:'cells'});
  for (const id of [null,'https://evil.test','__proto__','']) assert.equal(selectLesson(id).id,'cells');
});
test('wrong answers cannot complete a lesson; correct answers accumulate without mutating input',() => {
  const initial = emptyProgress(), first = allQuestions[0];
  assert.deepEqual(recordAnswer(initial,first,(first.answer + 1) % 3),initial);
  const once = recordAnswer(initial,first,first.answer); assert.deepEqual(initial.passed,[]); assert.equal(once.passed.length,1);
  assert.equal(recordAnswer(once,first,first.answer).passed.length,1);
  assert.deepEqual(completedLessons(once),[]);
  const second = allQuestions[1], finished = recordAnswer(once,second,second.answer);
  assert.deepEqual(completedLessons(finished),['cells']);
  assert.deepEqual(completedLessons(recordAnswer(finished,first,(first.answer + 1) % 3)),['cells']);
});
test('forged question data cannot override the canonical answer',() => {
  const real = allQuestions[0];
  assert.deepEqual(recordAnswer(emptyProgress(),{id:real.id,answer:0,choices:['fake']},0),emptyProgress());
  assert.deepEqual(recordAnswer(emptyProgress(),{id:'fake'},0),emptyProgress());
});
test('all twelve answers complete precisely six lessons and persist on reload',() => {
  const progress = allQuestions.reduce((state,question) => recordAnswer(state,question,question.answer),emptyProgress());
  assert.equal(progress.passed.length,12); assert.equal(completedLessons(parseProgress(JSON.stringify(progress))).length,6);
});
test('search entries expose all six direct lessons and their bilingual explanation text',() => {
  const entries = searchEntries(); assert.equal(entries.length,6); assert.equal(new Set(entries.map(entry => entry.href)).size,6);
  entries.forEach((entry,index) => {
    assert.equal(entry.href,'/body-works/index.html?lesson=' + lessons[index].id);
    for (const language of ['en','km']) { assert.ok(entry.fields.includes(lessons[index].sections[0].text[language])); assert.ok(entry.fields.includes(lessons[index].questions[0].explanation[language])); }
  });
});
test('course retains review/license notices and avoids personal-data collection or script injection',async () => {
  const base = new URL('../public/body-works/',import.meta.url);
  const html = await readFile(new URL('index.html',base),'utf8');
  const script = await readFile(new URL('course.js',base),'utf8');
  const license = await readFile(new URL('CONTENT-LICENSE.txt',base),'utf8');
  assert.match(html,/drafts for teacher review/); assert.match(html,/CC BY-NC-SA 4.0/); assert.match(license,/OpenStax/);
  assert.doesNotMatch(html,/<input[^>]+type="(?:file|email)"/); assert.doesNotMatch(script,/innerHTML|fetch\(['"]https?:/);
  assert.match(script,/showModal/); assert.match(script,/localStorage\.setItem\(storageKey/);
});
