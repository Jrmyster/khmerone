export type Locale = "en" | "km";
export type LocalizedText = Record<Locale, string>;

export enum AppCategory {
  Stem = "stem",
  Health = "health",
  Languages = "languages",
  Finance = "finance",
  Simulations = "simulations",
  SocialStudies = "social-studies",
  Utilities = "utilities",
  WomenEnterprise = "women-enterprise",
}

export type GradeLevel = "primary" | "lower-secondary" | "high-school" | "vocational-adult";
export type AppIcon = "school" | "anatomy" | "finance" | "language" | "exam" | "baby" | "world" | "peace" | "speed" | "cancer" | "lab" | "enterprise";

export interface AppEntry {
  id: string;
  title: LocalizedText;
  category: AppCategory;
  categoryLabel: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  audience: LocalizedText;
  grades: GradeLevel[];
  hasBilingualToggle?: boolean;
  /** Optional compact badge for entries spanning every grade. */
  gradeBadge?: LocalizedText;
  features: LocalizedText[];
  /** Additional search terms in either language. */
  tags?: string[];
  notice?: LocalizedText;
  icon: AppIcon;
  /** Null means no verified launch address has been supplied. */
  url: string | null;
  /** Portal caching does not imply the linked app itself runs offline. */
  offlineReady: boolean;
}

export type FilterKey = "all" | AppCategory;
