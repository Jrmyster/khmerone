import { gradeLabels } from "../data/apps";
import type { AppEntry } from "../types/app";
import type { CrewConcept, SkillPathway } from "../types/engagement";

/** Keep letters, numbers and combining marks, including Khmer script. */
export function normalizeSearchText(value: string = ""): string {
  return value.normalize("NFKC").toLocaleLowerCase().replace(/[\s\p{P}\p{S}]+/gu, "");
}

function matchesFields(fields: string[], query: string): boolean {
  const trimmed = query.normalize("NFKC").trim();
  if (!trimmed) return true;
  const content = normalizeSearchText(fields.join(" "));
  const compactQuery = normalizeSearchText(trimmed);
  if (!compactQuery) return true;
  if (content.includes(compactQuery)) return true;
  return trimmed.split(/\s+/u).map(normalizeSearchText).filter(Boolean)
    .every((token) => content.includes(token));
}

export function searchAppCatalog(entries: AppEntry[], query: string): AppEntry[] {
  return entries.filter((app) => matchesFields([
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
  ], query));
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
