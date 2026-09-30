/** Start-to-start interval; the final 8.5 seconds are happy floating idle. */
export const BOT_STUDY_INTERVAL = 11000;

export const BOT_STUDY_BEATS = [
  { phase: "reading", duration: 2000 },
  { phase: "snap", duration: 120 },
  { phase: "satisfied", duration: 100 },
  { phase: "return", duration: 280 },
  { phase: "idle", duration: 8500 },
] as const;

export type BotStudyPhase = typeof BOT_STUDY_BEATS[number]["phase"];
