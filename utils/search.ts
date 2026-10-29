import { gradeLabels } from "../data/apps";
import { rotatingSearchPrompts } from "../data/searchPrompts";
import type { AppEntry } from "../types/app";
import type { CrewConcept, SkillPathway } from "../types/engagement";
import { isKhmerOneAlias } from "../lib/khmerUtils";
import { normalizeSearchText, matchesSearchFields, searchScore } from "../lib/search";
export { normalizeSearchText } from "../lib/search";

/** Keep letters, numbers and combining marks, including Khmer script. */
const matchesFields = matchesSearchFields;

export function searchAppCatalog(entries: AppEntry[], query: string): AppEntry[] {
  if (isKhmerOneAlias(query)) return entries;
  const normalizedQuery = normalizeSearchText(query);
  const featured = normalizedQuery ? rotatingSearchPrompts.find((item) =>
    [item.query, item.en, item.km].some((text) => normalizeSearchText(text) === normalizedQuery)) : undefined;
  return entries.map((app, index) => ({ app, index, score: !query.trim() ? 1 : searchScore([app.title.en, app.title.km], [
    app.id, app.url ?? "", app.category, app.icon,
    app.title.en, app.title.km,
    app.tagline.en, app.tagline.km,
    app.description.en, app.description.km,
    app.categoryLabel.en, app.categoryLabel.km,
    app.audience.en, app.audience.km,
    app.gradeBadge?.en ?? "", app.gradeBadge?.km ?? "",
    app.notice?.en ?? "", app.notice?.km ?? "",
    ...app.grades.flatMap((grade) => [grade, gradeLabels[grade].en, gradeLabels[grade].km]),
    ...app.features.flatMap((feature) => [feature.en, feature.km]),
    ...(app.tags ?? []),
  ], query) + (app.id === featured?.appId ? 2000 : 0) }))
    .filter(result => result.score > 0).sort((a, b) => b.score - a.score || a.index - b.index).map(result => result.app);
}

export function searchSkillPathways(entries: SkillPathway[], query: string): SkillPathway[] {
  return entries.filter((pathway) => matchesFields([
    pathway.id, pathway.icon, pathway.relatedAppId ?? "",
    pathway.title.en, pathway.title.km, pathway.promise.en, pathway.promise.km,
    ...pathway.steps.flatMap((step) => [step.id, step.title.en, step.title.km, step.detail.en, step.detail.km]),
  ], query));
}

export function searchCrewConcepts(entries: CrewConcept[], query: string): CrewConcept[] {
  return entries.filter((crew) => matchesFields([
    crew.id, crew.provinceId, crew.interest,
    crew.title.en, crew.title.km, crew.province.en, crew.province.km,
    crew.project.en, crew.project.km,
  ], query));
}
