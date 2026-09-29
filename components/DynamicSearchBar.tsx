"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { rotatingSearchPrompts, type SearchPrompt } from "@/data/searchPrompts";
import type { Locale } from "@/types/app";

/** One shared timer keeps the directory and floating search prompts in sync. */
export function useRotatingSearchPrompt(query: string, focused: boolean) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (focused || query.length > 0) return;
    const timer = setInterval(() => {
      setFading(true);
      timeoutRef.current = setTimeout(() => {
        setIndex((current) => (current + 1) % rotatingSearchPrompts.length);
        setFading(false);
      }, 280);
    }, 6000);
    return () => {
      clearInterval(timer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setFading(false);
    };
  }, [focused, query]);

  return { prompt: rotatingSearchPrompts[index], fading };
}

export function DynamicSearchPrompt({ locale, prompt, fading, onSelect, floating = false }: {
  locale: Locale;
  prompt: SearchPrompt;
  fading: boolean;
  onSelect: (prompt: SearchPrompt) => void;
  floating?: boolean;
}) {
  return <button type="button" className={`rotating-search-prompt ${floating ? "floating-search-prompt" : ""} ${fading ? "is-fading" : ""}`} onClick={() => onSelect(prompt)} aria-label={`${locale === "km" ? "ស្វែងរក៖ " : "Search suggestion: "}${prompt[locale]}`} title={prompt[locale]}>
    <Sparkles size={15} aria-hidden="true" /><span>{prompt[locale]}</span>
  </button>;
}
