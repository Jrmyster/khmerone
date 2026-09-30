"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Sparkles } from "lucide-react";
import { rotatingSearchPrompts, type SearchPrompt } from "@/data/searchPrompts";
import type { Locale } from "@/types/app";

/** Both inputs and their suggestions share one dismissal boundary. */
export function useSearchDismissal(query: string, onQueryChange: (value: string) => void, onFocusChange: (focused: boolean) => void) {
  const [searchOpen, setSearchOpen] = useState(false);
  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => {
    setSearchOpen(false);
    onFocusChange(false);
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.closest("[data-search-surface]")) active.blur();
  }, [onFocusChange]);
  const dismissSearch = useCallback(() => {
    onQueryChange("");
    closeSearch();
  }, [onQueryChange, closeSearch]);

  useEffect(() => {
    const closeOutside = (event: Event) => {
      if (event.target instanceof Node && !Array.from(document.querySelectorAll("[data-search-surface]")).some((surface) => surface.contains(event.target as Node))) {
        closeSearch();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || (!searchOpen && !query) || document.querySelector("dialog[open]")) return;
      event.preventDefault();
      dismissSearch();
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("focusin", closeOutside);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("focusin", closeOutside);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [query, searchOpen, closeSearch, dismissSearch]);

  return { searchOpen, openSearch, closeSearch, dismissSearch };
}

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
