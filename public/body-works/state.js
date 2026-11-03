import { lessons, courseVersion } from './lessons.js';
export const storageKey = 'khmerone-body-works-v1';
export function selectLesson(id) { return lessons.find(lesson => lesson.id === id) || lessons[0]; }
export function grade(question, choice) { return Number.isInteger(choice) && choice >= 0 && choice < question.choices.length && choice === question.answer; }
export function emptyProgress() { return { version: courseVersion, passed: [], last: lessons[0].id }; }
export function parseProgress(raw) {
  try {
    const data = JSON.parse(raw || 'null');
    if (!data || data.version !== courseVersion) return emptyProgress();
    const allowed = new Set(lessons.flatMap(lesson => lesson.questions.map(question => question.id)));
    return { version: courseVersion, passed: Array.isArray(data.passed) ? [...new Set(data.passed.filter(id => typeof id === 'string' && allowed.has(id)))] : [], last: selectLesson(data.last).id };
  } catch { return emptyProgress(); }
}
export function recordAnswer(progress, question, choice) {
  const safe = parseProgress(JSON.stringify(progress));
  const actual = lessons.flatMap(lesson => lesson.questions).find(item => item.id === question?.id);
  if (actual && grade(actual, choice) && !safe.passed.includes(actual.id)) safe.passed.push(actual.id);
  return safe;
}
export function completedLessons(progress) { return lessons.filter(lesson => lesson.questions.every(question => progress.passed.includes(question.id))).map(lesson => lesson.id); }
export function searchEntries() {
  const strings = value => typeof value === 'string' ? [value] : Array.isArray(value) ? value.flatMap(strings) : value && typeof value === 'object' ? Object.values(value).flatMap(strings) : [];
  return lessons.map(lesson => ({ href: '/body-works/index.html?lesson=' + lesson.id, title: lesson.title.en + ' · ' + lesson.title.km, fields: strings([lesson.title, lesson.goal, lesson.hook, lesson.sections, lesson.sequence, lesson.vocabulary, lesson.think, lesson.questions]) }));
}
