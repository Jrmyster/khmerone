/** Shared matching for site search, the dictionary, and school resources. */
export function normalizeText(value = ''): string {
  return value.normalize('NFKC').toLowerCase()
    .replace(/[\u17e0-\u17e9]/g, c => String(c.charCodeAt(0) - 0x17e0))
    .replace(/\p{Cf}/gu, '')
    // Fold Latin accents, while retaining Khmer dependent vowels and signs.
    .normalize('NFD').replace(/(\p{Script=Latin})\p{M}+/gu, '$1').normalize('NFC')
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}

export const normalizeSearchText = (value = '') => normalizeText(value).replace(/\s/g, '');
export const searchTokens = (query: string) => [...new Set(normalizeText(query.slice(0, 240)).split(' ').filter(Boolean))];

function containsToken(field: string, token: string): boolean {
  // Khmer words do not require spaces. Invisible word-break characters are ignored.
  if (/\p{Script=Khmer}/u.test(token)) return field.replace(/\s/g, '').includes(token);
  return field.split(' ').some(word => word === token ||
    (token.length >= 2 && word.startsWith(token)) ||
    (/^[a-z]{4,}s$/.test(token) && !token.endsWith('ss') && word === token.slice(0, -1)));
}

export function matchesSearchFields(fields: readonly string[], query: string): boolean {
  if (!query.trim()) return true;
  const tokens = searchTokens(query);
  if (!tokens.length) return false;
  const normalized = fields.map(normalizeText);
  return tokens.every(token => normalized.some(field => containsToken(field, token)));
}

export function searchScore(titles: readonly string[], fields: readonly string[], query: string): number {
  if (!matchesSearchFields([...titles, ...fields], query)) return 0;
  const tokens = searchTokens(query);
  const phrase = normalizeSearchText(query);
  const titleScore = Math.max(0, ...titles.map(title => {
    const normalized = normalizeSearchText(title);
    if (normalized === phrase) return 1000;
    if (normalized.startsWith(phrase)) return 600;
    if (matchesSearchFields([title], query)) return 400;
    return tokens.filter(token => containsToken(normalizeText(title), token)).length * 60;
  }));
  return 1 + titleScore;
}

export function searchExcerpt(fields: readonly string[], query: string, fallback: string, length = 190): string {
  const tokens = searchTokens(query);
  const field = fields.find(text => matchesSearchFields([text], query)) ||
    fields.find(text => tokens.some(token => containsToken(normalizeText(text), token))) || fallback;
  const clean = field.replace(/\s+/g, ' ').trim();
  const position = Math.max(0, ...tokens.map(token => clean.toLowerCase().indexOf(token)));
  let start = Math.max(0, position - 45);
  if (start && /^[a-z]/i.test(clean.slice(start))) {
    const boundary = clean.indexOf(' ', start);
    if (boundary > start && boundary < position) start = boundary + 1;
  }
  return (start ? '…' : '') + clean.slice(start, start + length) + (clean.length > start + length ? '…' : '');
}

/** Collect content values, never object property names or private browser drafts. */
export function textValues(value: unknown): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(textValues);
  if (value && typeof value === 'object') return Object.entries(value).filter(([key]) => key !== 'id').flatMap(([, item]) => textValues(item));
  return [];
}
