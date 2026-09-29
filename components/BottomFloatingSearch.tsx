"use client";

import { useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import type { Locale } from "@/types/app";

interface BottomFloatingSearchProps {
  locale: Locale;
  query: string;
  onQueryChange: (value: string) => void;
}

export function BottomFloatingSearch({ locale, query, onQueryChange }: BottomFloatingSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
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

  return <form className="bottom-floating-search" role="search" onSubmit={(event) => { event.preventDefault(); revealResults(); }}>
    <div className="floating-search-pill">
      <Search size={21} className="floating-search-icon" aria-hidden="true" />
      <input
        ref={inputRef}
        type="search"
        value={query}
        onChange={(event) => {
          onQueryChange(event.target.value);
          if (!query && event.target.value.trim()) document.getElementById("directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        onFocus={revealResults}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            if (query) onQueryChange("");
            else event.currentTarget.blur();
          }
        }}
        aria-label={label}
        aria-controls="directory"
        placeholder={placeholder}
        autoComplete="off"
      />
      {query ? <button type="button" className="floating-search-clear" aria-label={clearLabel} onClick={() => { onQueryChange(""); inputRef.current?.focus(); }}><X size={16} aria-hidden="true" /></button>
        : <kbd className="floating-search-hint" title="Cmd+K, Ctrl+K, or /">/</kbd>}
    </div>
  </form>;
}
