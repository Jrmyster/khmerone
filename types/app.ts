export type Locale = "en" | "km";
export type LocalizedText = Record<Locale, string>;

export enum AppCategory {
  Stem = "stem",
  Health = "health",
  Languages = "languages",
  Finance = "finance",
  Simulations = "simulations",
  SocialStudies = "social-studies",
}

export type GradeLevel = "primary" | "lower-secondary" | "high-school" | "vocational-adult";
export type AppIcon = "school" | "anatomy" | "finance" | "language" | "baby" | "world" | "peace";

export interface AppEntry {
  id: string;
  title: LocalizedText;
  category: AppCategory;
  categoryLabel: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  audience: LocalizedText;
  grades: GradeLevel[];
  features: LocalizedText[];
  icon: AppIcon;
  /** Null means no verified launch address has been supplied. */
  url: string | null;
  /** Portal caching does not imply the linked app itself runs offline. */
  offlineReady: boolean;
}

export type FilterKey = "all" | AppCategory;
