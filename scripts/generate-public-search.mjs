// Regenerate the text index of self-contained public HTML pages before every build.
import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import ts from 'typescript';

const decode = value => value.replace(/&(?:#(x[\da-f]+|\d+)|(amp|lt|gt|quot|apos|nbsp));/gi, (match, numeric, named) => {
  if (numeric) { const code = numeric[0].toLowerCase() === 'x' ? parseInt(numeric.slice(1), 16) : Number(numeric); return code > 0 && code <= 0x10ffff ? String.fromCodePoint(code) : ' '; }
  return ({ amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' })[named.toLowerCase()];
});
const pages = [];
const normalizedPath = file => file.replace(/\\/g, '/');
const toolComponents = { dictionary: 'reading', stories: 'reading', speaking: 'speaking', 'quiz-maker': 'creation', announcements: 'creation', translation: 'creation', 'live-quiz': 'live-quiz', exchange: 'exchange' };
const sourceCache = new Map();
async function sourceFile(file) {
  if (!sourceCache.has(file)) sourceCache.set(file, ts.createSourceFile(file, await readFile(file, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX));
  return sourceCache.get(file);
}
function propertyName(node) { return node.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) ? node.name.text : ''; }
function readableStrings(source) {
  const strings = [];
  function visit(node) {
    if (ts.isJsxText(node)) strings.push(decode(node.text));
    if (ts.isStringLiteralLike(node)) {
      const parent = node.parent;
      if (ts.isJsxAttribute(parent) && ['title', 'alt', 'placeholder', 'aria-label'].includes(propertyName(parent))) strings.push(node.text);
      if (ts.isCallExpression(parent) && ts.isIdentifier(parent.expression) && ['tr', 'bi', 'text', 'choose'].includes(parent.expression.text)) strings.push(node.text);
      if (ts.isPropertyAssignment(parent) && parent.initializer === node) {
        let localized = false;
        for (let ancestor = parent; ancestor; ancestor = ancestor.parent) if (ts.isPropertyAssignment(ancestor) && ['en', 'km'].includes(propertyName(ancestor))) localized = true;
        if (localized || ['title', 'description'].includes(propertyName(parent))) strings.push(node.text);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
  return strings.map(text => text.replace(/\s+/g, ' ').trim()).filter(Boolean);
}
async function pageText(file, route, seen = new Set()) {
  file = normalizedPath(resolve(file));
  if (seen.has(file)) return [];
  seen.add(file);
  const source = await sourceFile(file);
  const fields = readableStrings(source);
  for (const statement of source.statements) {
    if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
    const name = statement.moduleSpecifier.text;
    const base = name.startsWith('@/') ? name.slice(2) : name.startsWith('.') ? resolve(dirname(file), name) : '';
    if (!base) continue;
    const path = normalizedPath(resolve(base));
    if (!/\/(components|locales)\//.test(path) || /\/components\/ui\//.test(path)) continue;
    if (path.includes('/components/learning/')) {
      const selected = toolComponents[route.split('/')[2]];
      if (!['LearningApp', 'common', selected].some(component => component && path.endsWith('/' + component))) continue;
    }
    for (const extension of ['.tsx', '.ts']) {
      try { await access(path + extension); fields.push(...await pageText(path + extension, route, seen)); break; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    }
  }
  return fields;
}
for (const file of (await readdir('app', { recursive: true })).map(normalizedPath).filter(file => /(^|\/)page\.tsx$/.test(file)).sort()) {
  if (file === 'feedback-inbox/page.tsx') continue; // Private editor utility, never a public search destination.
  if (file.includes('[brandAlias]')) continue; // Aliases resolve to the already indexed home page.
  const route = '/' + file.replace(/(^|\/)page\.tsx$/, '');
  const routes = route === '/learning/[tool]' ? Object.keys(toolComponents).map(tool => '/learning/' + tool) : [route];
  if (routes.some(path => path.includes('['))) throw new Error(`Add concrete public destinations for ${route} to the search generator.`);
  for (const href of routes) {
    const fields = [...new Set(await pageText('app/' + file, href))];
    const source = await sourceFile(normalizedPath(resolve('app/' + file)));
    let title = href === '/' ? 'Khmer One' : href.split('/').pop().replace(/-/g, ' ');
    function findTitle(node) { if (ts.isPropertyAssignment(node) && propertyName(node) === 'title' && ts.isStringLiteralLike(node.initializer)) title = node.initializer.text; ts.forEachChild(node, findTitle); }
    findTitle(source);
    pages.push({ href, title, fields });
  }
}
for (const file of (await readdir('public', { recursive: true })).filter(file => file.endsWith('.html')).sort()) {
  const html = (await readFile('public/' + file, 'utf8')).replace(/<!-- ko-navigation -->[^]*?<!-- \/ko-navigation -->/g, ''); // Shared controls are not lesson text.
  const text = decode(html.replace(/<!--[^]*?-->/g, ' ').replace(/<(script|style)\b[^>]*>[^]*?<\/\1>/gi, ' ').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
  const fields = [text];
  // The engine lab stores both languages in JavaScript objects. Index their text
  // values too, including the examples that are revealed after changing a tab.
  for (const match of html.matchAll(/<script\b[^>]*>([^]*?)<\/script>/gi)) {
    const source = ts.createSourceFile(file + '.js', match[1], ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    function visit(node) {
      if (ts.isStringLiteralLike(node) && ts.isPropertyAssignment(node.parent) && node.parent.initializer === node) fields.push(node.text);
      ts.forEachChild(node, visit);
    }
    visit(source);
  }
  const title = decode(/<title[^>]*>([^]*?)<\/title>/i.exec(html)?.[1] || file.replace(/\.html$/, ''));
  pages.push({ href: '/' + file.replace(/\\/g, '/'), title, fields: [...new Set(fields)].filter(Boolean) });
}
await writeFile('data/publicSearch.generated.json', JSON.stringify(pages, null, 2) + '\n', 'utf8');
console.log(`Indexed public text from ${pages.length} page destinations, including embedded HTML learning copy.`);
