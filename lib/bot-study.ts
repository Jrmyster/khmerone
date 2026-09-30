/** One timer advances these beats. Hidden tabs and reduced motion reset to idle. */
export const BOT_STUDY_BEATS = [
  { phase: "idle", duration: 8000 },
  { phase: "reach", duration: 650 },
  { phase: "retrieve", duration: 750 },
  { phase: "open", duration: 450 },
  { phase: "reading", duration: 2000 },
  { phase: "snap", duration: 180 },
  { phase: "satisfied", duration: 650 },
  { phase: "return", duration: 900 },
  { phase: "settle", duration: 450 },
] as const;

export type BotStudyPhase = typeof BOT_STUDY_BEATS[number]["phase"];
