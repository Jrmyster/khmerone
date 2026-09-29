import type { LocalizedText } from "@/types/app";

export type PathwayId = "media" | "web" | "hardware" | "business";
export interface SkillStep { id: string; title: LocalizedText; detail: LocalizedText; }
export interface SkillPathway {
  id: PathwayId;
  title: LocalizedText;
  promise: LocalizedText;
  icon: "video" | "code" | "cpu" | "briefcase";
  minutes: number;
  steps: SkillStep[];
  relatedAppId?: string;
}
export interface CrewConcept {
  id: string;
  title: LocalizedText;
  province: LocalizedText;
  provinceId: string;
  interest: PathwayId;
  project: LocalizedText;
}
export interface CyberProgress {
  exploredAppIds: string[];
  completedStepIds: string[];
  crewInterestId: string | null;
}
