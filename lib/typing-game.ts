export const typingLessons = [
  { id: 'keys', number: '01', title: 'Find the keys', km: 'ស្គាល់គ្រាប់ចុច', description: 'One letter at a time. Start with F and J.', prompts: ['f', 'j', 'd', 'k', 's', 'l', 'a', 'g', 'h', 'fj'] },
  { id: 'words', number: '02', title: 'Little words', km: 'ពាក្យខ្លីៗ', description: 'Friendly words with just a few letters.', prompts: ['cat', 'sun', 'dog', 'pen', 'hat', 'red', 'bus', 'cup', 'map', 'fish'] },
  { id: 'school', number: '03', title: 'At school', km: 'នៅសាលារៀន', description: 'Meet the words around your classroom.', prompts: ['book', 'desk', 'bag', 'read', 'write', 'learn', 'pencil', 'paper', 'friend', 'school'] },
  { id: 'sentences', number: '04', title: 'Small sentences', km: 'ប្រយោគខ្លីៗ', description: 'Try capital letters, spaces and full stops.', prompts: ['I can read.', 'I have a pen.', 'The sun is hot.', 'This is my bag.', 'We go to school.', 'I like books.', 'My cat is small.', 'We can learn.', 'I help my friend.', 'I can type.'] },
] as const;
export type LessonId = typeof typingLessons[number]['id'];
export type TypingEdit = { value: string; attempts: number; mistakes: number; issue?: 'paste' | 'english' | 'length' };

// Accept one printable English character per edit, including selection replacement.
// Deletions do not erase the learner's mistake history or count as new attempts.
export function assessTypingEdit(previous: string, next: string, target: string): TypingEdit {
  const reject = (issue: TypingEdit['issue']): TypingEdit => ({ value: previous, attempts: 0, mistakes: 0, issue });
  if (next.length > target.length) return reject('length');
  if (/[^\x20-\x7e]/.test(next)) return reject('english');
  let start = 0;
  while (start < previous.length && start < next.length && previous[start] === next[start]) start++;
  let oldEnd = previous.length, newEnd = next.length;
  while (oldEnd > start && newEnd > start && previous[oldEnd - 1] === next[newEnd - 1]) { oldEnd--; newEnd--; }
  const inserted = next.slice(start, newEnd);
  if (inserted.length > 1) return reject('paste');
  return { value: next, attempts: inserted.length, mistakes: inserted.length && inserted !== target[start] ? 1 : 0 };
}
export function typingAccuracy(attempts: number, mistakes: number) { return attempts ? Math.round(Math.max(0, attempts - mistakes) / attempts * 100) : 0; }
export function typingStars(accuracy: number) { return accuracy >= 95 ? 3 : accuracy >= 80 ? 2 : 1; }
export function nextTypingKey(value: string, target: string) {
  if (!target.startsWith(value)) return 'Backspace';
  return target[value.length] || '';
}
export type TypingProgress = Partial<Record<LessonId, number>>;
export function parseTypingProgress(raw: string | null): TypingProgress {
  try {
    const value: unknown = JSON.parse(raw || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    return Object.fromEntries(typingLessons.flatMap(lesson => {
      const stars = (value as Record<string, unknown>)[lesson.id];
      return typeof stars === 'number' && Number.isInteger(stars) && stars >= 1 && stars <= 3 ? [[lesson.id, stars]] : [];
    }));
  } catch { return {}; }
}
