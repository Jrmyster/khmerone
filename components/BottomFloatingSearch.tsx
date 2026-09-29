"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Search, X } from "lucide-react";
import { DynamicSearchPrompt } from "@/components/DynamicSearchBar";
import type { SearchPrompt } from "@/data/searchPrompts";
import type { Locale } from "@/types/app";

interface BottomFloatingSearchProps {
  locale: Locale;
  query: string;
  onQueryChange: (value: string) => void;
  prompt: SearchPrompt;
  fading: boolean;
  searchFocused: boolean;
  onFocusChange: (focused: boolean) => void;
  onSelectPrompt: (prompt: SearchPrompt) => void;
}

export function BottomFloatingSearch({ locale, query, onQueryChange, prompt, fading, searchFocused, onFocusChange, onSelectPrompt }: BottomFloatingSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [keyboard, setKeyboard] = useState({ open: false, own: false, inset: 0 });
  const placeholder = locale === "km"
    ? "ស្វែងរកកម្មវិធី មេរៀន ឬឧបករណ៍..."
    : "Search apps, subjects, or tools...";
  const label = locale === "km" ? "ស្វែងរកក្នុងបណ្ដាញ KhmerOne" : "Search the KhmerOne network";
  const clearLabel = locale === "km" ? "លុបពាក្យស្វែងរក" : "Clear search";

  const revealResults = () => {
    const directory = document.getElementById("directory");
    if (!directory) return;
    const bounds = directory.getBoundingClientRect();
    if (bounds.top > window.innerHeight * .6 || bounds.bottom < window.innerHeight * .35) {
      directory.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (document.querySelector("dialog[open]")) return;
      const target = event.target;
      const editing = target instanceof HTMLElement &&
        (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));
      const commandK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      const slash = event.key === "/" && !event.altKey && !event.metaKey && !event.ctrlKey && !editing;
      if (commandK || slash) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeydown);
    return () => window.removeEventListener("keydown", onKeydown);
  }, []);

  useEffect(() => {
    const viewport = window.visualViewport;
    let expandedHeight = viewport?.height ?? window.innerHeight;
    let frame = 0;
    const update = () => {
      const height = viewport?.height ?? window.innerHeight;
      const focused = document.activeElement;
      const editing = focused instanceof HTMLElement &&
        (focused.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(focused.tagName));
      if (!editing) expandedHeight = Math.max(expandedHeight, height);
      const inset = viewport ? Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop) : 0;
      const open = window.matchMedia("(max-width: 900px)").matches && editing &&
        (inset > 120 || expandedHeight - height > 150);
      const next = { open, own: open && focused === inputRef.current, inset: open ? Math.round(inset) : 0 };
      setKeyboard((current) => current.open === next.open && current.own === next.own && current.inset === next.inset ? current : next);
      document.documentElement.classList.toggle("mobile-keyboard-open", open);
    };
    const scheduleUpdate = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    const resetHeight = () => { expandedHeight = viewport?.height ?? window.innerHeight; scheduleUpdate(); };
    viewport?.addEventListener("resize", scheduleUpdate);
    viewport?.addEventListener("scroll", scheduleUpdate);
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("orientationchange", resetHeight);
    document.addEventListener("focusin", scheduleUpdate);
    document.addEventListener("focusout", scheduleUpdate);
    update();
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", scheduleUpdate);
      viewport?.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("orientationchange", resetHeight);
      document.removeEventListener("focusin", scheduleUpdate);
      document.removeEventListener("focusout", scheduleUpdate);
      document.documentElement.classList.remove("mobile-keyboard-open");
    };
  }, []);

  return <form className={`bottom-floating-search ${keyboard.open ? keyboard.own ? "search-keyboard-open" : "search-keyboard-hidden" : ""}`} style={{ "--keyboard-inset": `${keyboard.inset}px` } as CSSProperties} role="search" onSubmit={(event) => { event.preventDefault(); revealResults(); }}>
    <div className="floating-search-pill">
      <Search size={21} className="floating-search-icon" aria-hidden="true" />
      <div className="floating-search-input-wrap"><input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => {
          onQueryChange(event.target.value);
          if (!query && event.target.value.trim()) document.getElementById("directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        onFocus={() => { onFocusChange(true); revealResults(); }}
        onBlur={() => onFocusChange(false)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            if (query) onQueryChange("");
            else event.currentTarget.blur();
          }
        }}
        aria-label={label}
        aria-controls="directory"
        placeholder={searchFocused ? placeholder : ""}
        autoComplete="off"
      />{!query && !searchFocused && <DynamicSearchPrompt locale={locale} prompt={prompt} fading={fading} onSelect={onSelectPrompt} floating />}</div>
      {query ? <button type="button" className="floating-search-clear" aria-label={clearLabel} onClick={() => { onQueryChange(""); inputRef.current?.focus(); }}><X size={16} aria-hidden="true" /></button>
        : <kbd className="floating-search-hint" title="Cmd+K, Ctrl+K, or /">/</kbd>}
    </div>
  </form>;
}
