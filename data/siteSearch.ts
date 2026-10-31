import { governmentPaths, governmentTopics, governmentChecklist } from './governmentServices';
import { typingLessons } from '../lib/typing-game';
import { supportServices, supportCategories, visitChecklist } from './socialSupport';
import { apps, gradeLabels } from './apps';
import { terms, stories, announcements, sampleQuiz, bi, subjectLabels } from './learning';
import { pathways, crewConcepts } from './engagement';
import { gateLessons, codingLessons } from './computerEngineering';
import { toolkitUnits, resourceKinds, buildTeachingResource, defaultToolkitSettings } from './teacherToolkit';
import { engineeringCopy } from '../locales/computerEngineering';
import { toolkitCopy } from '../locales/teacherToolkit';
import { teacherAudioCopy } from '../locales/teacherAudio';
import { searchScore, textValues } from '../lib/search';
import type { AppCategory, GradeLevel, LocalizedText } from '../types/app';
import type { Resource } from '../lib/learning/contracts';
import publicPages from './publicSearch.generated.json';
import { searchAppCatalog } from '../utils/search';
import type { AppEntry } from '../types/app';

export type SearchKind = 'app' | 'page' | 'term' | 'story' | 'lesson' | 'template' | 'pathway' | 'crew' | 'resource';
export type SearchDocument = {
  id: string; href: string; kind: SearchKind; title: LocalizedText; summary: LocalizedText;
  fields: string[]; category?: AppCategory; grades?: GradeLevel[];
};
export const searchKindLabels: Record<SearchKind, LocalizedText> = {
  app: bi('App', 'កម្មវិធី'), page: bi('Page', 'ទំព័រ'), term: bi('STEM word', 'ពាក្យស្ទែម'),
  story: bi('Story', 'រឿង'), lesson: bi('Lesson', 'មេរៀន'), template: bi('Template', 'គំរូ'),
  pathway: bi('Skill path', 'ផ្លូវជំនាញ'), crew: bi('Learning crew', 'ក្រុមសិក្សា'), resource: bi('School resource', 'ធនធានសាលា'),
};

function withParent(parentId: string, document: Omit<SearchDocument, 'category' | 'grades'>): SearchDocument {
  const parent = apps.find(app => app.id === parentId);
  return { ...document, category: parent?.category, grades: parent?.grades, fields: [...document.fields, ...textValues(parent?.title)] };
}

// Read directly from the content that renders the site; additions to these collections
// are searchable on the next build without maintaining a second vocabulary list.
export const siteSearchDocuments: SearchDocument[] = [
  ...governmentPaths.map(path => withParent('government-services', { id: `government-${path.id}`, href: `/public-services#task-${path.id}`, kind: 'page', title: path.title, summary: path.summary, fields: textValues(path) })),
  ...supportServices.map(service => withParent('social-support', { id: `support-${service.id}`, href: `/social-support#service-${service.id}`, kind: 'page', title: service.name, summary: service.description, fields: [...textValues(service), ...textValues(supportCategories.filter(category => service.categories.includes(category.id)))] })),
  { id: 'page-home', href: '/', kind: 'page', title: bi('Khmer One', 'ខ្មែរ វ័ន'), summary: bi('Free bilingual learning tools for Cambodia.', 'ឧបករណ៍សិក្សាឥតគិតថ្លៃសម្រាប់កម្ពុជា។'), fields: ['KhmerOne Khmer One Cambodia education school students teachers offline STEM health finance enterprise'] },
  { id: 'page-learning', href: '/learning', kind: 'page', title: bi('Learning studio', 'កន្លែងសិក្សា'), summary: bi('Eight tools to listen, learn, create and share.', 'ឧបករណ៍ប្រាំបីសម្រាប់ស្តាប់ រៀន បង្កើត និងចែករំលែក។'), fields: ['learning studio tools dictionary speaking quizzes stories announcements translation classroom exchange'] },
  { id: 'page-search', href: '/search', kind: 'page', title: bi('Search Khmer One', 'ស្វែងរកក្នុងខ្មែរ វ័ន'), summary: bi('Find apps, words, stories, lessons and school resources.', 'ស្វែងរកកម្មវិធី ពាក្យ រឿង មេរៀន និងធនធានសាលា។'), fields: ['search find browse discover ស្វែងរក'] },
  ...apps.map((app): SearchDocument => ({ id: `app-${app.id}`, href: app.url || '/#directory', kind: 'app', title: app.title, summary: app.description,
    fields: [...textValues(app), ...app.grades.flatMap(grade => textValues(gradeLabels[grade]))], category: app.category, grades: app.grades })),
  ...terms.map(term => withParent('learning-dictionary', { id: `term-${term.id}`, href: `/learning/dictionary?term=${term.id}`, kind: 'term', title: term.term, summary: term.definition,
    fields: [...textValues(term), ...textValues(subjectLabels[term.subject])] })),
  ...stories.map(story => withParent('learning-stories', { id: `story-${story.id}`, href: `/learning/stories?story=${story.id}`, kind: 'story', title: story.title, summary: story.paragraphs[0], fields: textValues(story) })),
  ...announcements.map((template, i) => withParent('learning-announcements', { id: `announcement-${i}`, href: `/learning/announcements?template=${i}`, kind: 'template', title: template.title, summary: template.text, fields: textValues(template) })),
  ...toolkitUnits.map(unit => withParent('teacher-toolkit', { id: `toolkit-${unit.id}`, href: `/teacher-toolkit?unit=${unit.id}`, kind: 'lesson', title: unit.title, summary: unit.explanation,
    fields: [...textValues(unit), ...resourceKinds.flatMap(kind => ['en', 'km'].flatMap(locale => {
      const resource = buildTeachingResource({ ...defaultToolkitSettings, unitId: unit.id }, kind, locale as 'en' | 'km');
      return [resource.body, resource.answerKey];
    }))] })),
  ...Object.entries(gateLessons).map(([gate, lesson]) => withParent('computer-engineering', { id: `gate-${gate}`, href: `/computer-engineering?gate=${gate}`, kind: 'lesson', title: lesson.name, summary: lesson.rule, fields: textValues(lesson) })),
  ...Object.entries(codingLessons).map(([language, lesson]) => withParent('computer-engineering', { id: `code-${language}`, href: `/computer-engineering?language=${language}`, kind: 'lesson', title: bi(language === 'javascript' ? 'JavaScript' : language === 'python' ? 'Python' : language.toUpperCase(), language === 'javascript' ? 'JavaScript' : language === 'python' ? 'Python' : language.toUpperCase()), summary: bi('Explore the explanation and try the code example.', 'ស្វែងយល់ការពន្យល់ និងសាកល្បងឧទាហរណ៍កូដ។'), fields: textValues(lesson) })),
  ...pathways.map(path => ({ id: `pathway-${path.id}`, href: `/#pathway-${path.id}`, kind: 'pathway' as const, title: path.title, summary: path.promise, fields: textValues(path) })),
  ...crewConcepts.map(crew => ({ id: `crew-${crew.id}`, href: `/#crew-${crew.id}`, kind: 'crew' as const, title: crew.title, summary: crew.project, fields: textValues(crew) })),
];

// Include interface copy and built-in examples as well as catalog descriptions.
for (const [path, extra] of [
  ['/computer-engineering', engineeringCopy], ['/teacher-toolkit', toolkitCopy], ['/teacher-audio', teacherAudioCopy],
  ['/learning/quiz-maker', sampleQuiz],
  ['/typing', typingLessons],
  ['/public-services', { governmentPaths, governmentTopics, governmentChecklist }],
  ['/social-support', { supportServices, supportCategories, visitChecklist }],
] as const) {
  const document = siteSearchDocuments.find(document => document.href === path);
  if (document) document.fields.push(...textValues(extra));
}

for (const page of publicPages) {
  const document = siteSearchDocuments.find(document => document.href === page.href);
  if (document) document.fields.push(...page.fields);
  else siteSearchDocuments.push({ id: `public-${page.href}`, href: page.href, kind: 'page', title: bi(page.title, page.title), summary: bi(page.fields[0] || page.title, page.fields[0] || page.title), fields: page.fields });
}

export function resourceSearchDocuments(resources: Resource[]): SearchDocument[] {
  return resources.filter(resource => resource.status === 'approved' && resource.id).map(resource => ({
    id: `resource-${resource.id}`, href: `/learning/exchange?resource=${encodeURIComponent(resource.id!)}`, kind: 'resource',
    title: bi(resource.title, resource.title), summary: bi(resource.description, resource.description),
    fields: [resource.title, resource.school, resource.province, resource.subject, resource.description, resource.kind,
      resource.kind === 'need' ? 'School need តម្រូវការសាលា' : resource.kind === 'equipment' ? 'Equipment សម្ភារៈ' : 'Teaching material ធនធានបង្រៀន'],
  }));
}

export function searchSite(query: string, documents = siteSearchDocuments): SearchDocument[] {
  if (!query.trim()) return [];
  return documents.map((document, index) => ({ document, index, score: searchScore(textValues(document.title), [...textValues(document.summary), ...document.fields], query) }))
    .filter(result => result.score > 0).sort((a, b) => b.score - a.score || a.index - b.index).map(result => result.document);
}

export function searchSiteApps(query: string, entries: AppEntry[] = apps, matches = searchSite(query)): AppEntry[] {
  const catalog = searchAppCatalog(entries, query);
  const seen = new Set(catalog.map(app => app.id));
  const contentIds = new Set(matches.filter(result => result.kind === 'app').map(result => result.id.slice(4)));
  return [...catalog, ...entries.filter(app => contentIds.has(app.id) && !seen.has(app.id))];
}
