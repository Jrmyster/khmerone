"use client";

import { useEffect, useMemo, useState } from "react";
import { apps } from "@/data/apps";
import { crewConcepts, pathways } from "@/data/engagement";
import type { CyberProgress } from "@/types/engagement";

const KEY = "khmerone-cyber-progress-v1";
const EMPTY: CyberProgress = { exploredAppIds: [], completedStepIds: [], crewInterestId: null };
const appIds = new Set(apps.map((app) => app.id));
const stepIds = new Set(pathways.flatMap((pathway) => pathway.steps.map((step) => step.id)));
const crewIds = new Set(crewConcepts.map((crew) => crew.id));

function cleanIds(value: unknown, allowed: Set<string>) {
  return Array.isArray(value) ? [...new Set(value.filter((id): id is string => typeof id === "string" && allowed.has(id)))] : [];
}

function readProgress(): CyberProgress {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) || "null");
    if (!value || typeof value !== "object") return EMPTY;
    return {
      exploredAppIds: cleanIds(value.exploredAppIds, appIds),
      completedStepIds: cleanIds(value.completedStepIds, stepIds),
      crewInterestId: typeof value.crewInterestId === "string" && crewIds.has(value.crewInterestId) ? value.crewInterestId : null,
    };
  } catch { return EMPTY; }
}

export function useCyberProgress() {
  const [progress, setProgress] = useState<CyberProgress>(EMPTY);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => { setProgress(readProgress()); setReady(true); });
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (ready) {
      try { localStorage.setItem(KEY, JSON.stringify(progress)); } catch { /* Keep the current session usable when storage is unavailable. */ }
    }
  }, [progress, ready]);

  const status = useMemo(() => {
    const finished = pathways.filter((pathway) => pathway.steps.every((step) => progress.completedStepIds.includes(step.id)));
    const xp = progress.exploredAppIds.length * 10 + progress.completedStepIds.length * 20 + finished.length * 50;
    return {
      xp,
      level: Math.floor(xp / 120) + 1,
      levelPercent: (xp % 120) / 120 * 100,
      finishedIds: finished.map((pathway) => pathway.id),
      badges: {
        apprentice: progress.exploredAppIds.length + progress.completedStepIds.length > 0,
        runner: finished.some((pathway) => pathway.id === "web"),
        pioneer: Boolean(progress.crewInterestId && finished.length > 0),
      },
    };
  }, [progress]);

  const exploreApp = (id: string) => {
    if (!appIds.has(id)) return;
    setProgress((current) => current.exploredAppIds.includes(id) ? current : { ...current, exploredAppIds: [...current.exploredAppIds, id] });
  };
  const toggleStep = (id: string) => {
    if (!stepIds.has(id)) return;
    setProgress((current) => ({ ...current, completedStepIds: current.completedStepIds.includes(id) ? current.completedStepIds.filter((step) => step !== id) : [...current.completedStepIds, id] }));
  };
  const selectCrew = (id: string) => {
    if (!crewIds.has(id)) return;
    setProgress((current) => ({ ...current, crewInterestId: current.crewInterestId === id ? null : id }));
  };

  return { progress, status, ready, exploreApp, toggleStep, selectCrew };
}
