"use client";

import { useEffect, useState } from "react";
import { BOT_CAREER_IDLE, startBotCareerSequence, type BotCareerBeat } from "@/lib/bot-careers";

export function useBotCareerLoop(paused: boolean, onBeat: (beat: BotCareerBeat) => void) {
  const [beat, setBeat] = useState<BotCareerBeat>(BOT_CAREER_IDLE);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let dispose: (() => void) | undefined;
    const show = (next: BotCareerBeat) => { setBeat(next); onBeat(next); };
    const restart = () => {
      dispose?.();
      dispose = undefined;
      if (paused || document.hidden || motion.matches) show(BOT_CAREER_IDLE);
      else dispose = startBotCareerSequence(show);
    };
    restart();
    document.addEventListener("visibilitychange", restart);
    motion.addEventListener("change", restart);
    return () => {
      dispose?.();
      document.removeEventListener("visibilitychange", restart);
      motion.removeEventListener("change", restart);
    };
  }, [paused, onBeat]);

  return beat;
}
