export type BotCareerStage = "idle" | "drill" | "weld" | "textbook" | "doctor" | "telescope";
export type BotCareerPhase = "idle" | "retrieve" | "extend" | "active" | "snap" | "collapse" | "stow";
export interface BotCareerBeat {
  stage: BotCareerStage;
  phase: BotCareerPhase;
  duration: number;
}

/** Gear transitions are separate from the full, visible activity durations. */
export const BOT_CAREER_BEATS: readonly BotCareerBeat[] = [
  { stage: "drill", phase: "retrieve", duration: 450 },
  { stage: "drill", phase: "active", duration: 2000 },
  { stage: "drill", phase: "stow", duration: 450 },
  { stage: "drill", phase: "idle", duration: 3000 },
  { stage: "weld", phase: "retrieve", duration: 600 },
  { stage: "weld", phase: "active", duration: 2500 },
  { stage: "weld", phase: "stow", duration: 600 },
  { stage: "weld", phase: "idle", duration: 3000 },
  { stage: "textbook", phase: "retrieve", duration: 450 },
  { stage: "textbook", phase: "active", duration: 2000 },
  { stage: "textbook", phase: "snap", duration: 300 },
  { stage: "textbook", phase: "stow", duration: 450 },
  { stage: "textbook", phase: "idle", duration: 3000 },
  { stage: "doctor", phase: "retrieve", duration: 450 },
  { stage: "doctor", phase: "active", duration: 4000 },
  { stage: "doctor", phase: "stow", duration: 450 },
  { stage: "telescope", phase: "retrieve", duration: 450 },
  { stage: "telescope", phase: "extend", duration: 400 },
  { stage: "telescope", phase: "active", duration: 3000 },
  { stage: "telescope", phase: "collapse", duration: 400 },
  { stage: "telescope", phase: "stow", duration: 450 },
  { stage: "idle", phase: "idle", duration: 1000 },
];

export const BOT_CAREER_INITIAL_IDLE = 3000;
export const BOT_CAREER_IDLE: BotCareerBeat = { stage: "idle", phase: "idle", duration: BOT_CAREER_INITIAL_IDLE };

/** One pending timeout, never an interval plus overlapping stage timers.
 * The effect that owns this sequence calls the returned disposer on pause/unmount.
 */
export function startBotCareerSequence(onBeat: (beat: BotCareerBeat) => void): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let disposed = false;
  let index = -1;

  const advance = () => {
    if (disposed) return;
    index = (index + 1) % BOT_CAREER_BEATS.length;
    const beat = BOT_CAREER_BEATS[index];
    // Schedule before notifying so a callback may safely dispose the sequence.
    timer = setTimeout(advance, beat.duration);
    onBeat(beat);
  };
  timer = setTimeout(advance, BOT_CAREER_INITIAL_IDLE);
  onBeat(BOT_CAREER_IDLE);

  return () => {
    disposed = true;
    clearTimeout(timer);
  };
}
