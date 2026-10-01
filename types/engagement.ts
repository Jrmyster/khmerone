import type { LocalizedText } from "@/types/app";

export type PathwayId = "media" | "web" | "hardware" | "business";
export type CrewInterestId = "physics" | "chemistry" | "biology" | "mathematics" | "environmental-science" | "web-development" | "robotics-drones" | "ai-coding" | "frugal-engineering" | "english-conversation" | "public-speaking" | "khmer-literature" | "digital-art-design" | "video-media" | "music-production" | "sustainable-agriculture" | "health-hygiene" | "life-skills" | "sports";
export interface CrewInterestGroup {
  id: string;
  label: LocalizedText;
  interests: { id: CrewInterestId; label: LocalizedText }[];
}
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
  interests: CrewInterestId[];
  project: LocalizedText;
}
export interface CyberProgress {
  exploredAppIds: string[];
  completedStepIds: string[];
  crewInterestId: string | null;
}
