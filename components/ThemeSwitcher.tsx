"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Check, Palette, X } from "lucide-react";
import { rainbowAccents, themePresets, type AccentId, type ThemeId } from "@/data/themes";
import type { Locale } from "@/types/app";

interface ThemeSwitcherProps {
  locale: Locale;
  theme: ThemeId;
  accent: AccentId;
  onThemeChange: (theme: ThemeId) => void;
  onAccentChange: (accent: AccentId) => void;
}

export function ThemeSwitcher({ locale, theme, accent, onThemeChange, onAccentChange }: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);
  const t = locale === "km" ? {
    button: "ជ្រើសពណ៌ និងរចនាប័ទ្ម", title: "ក្ដារលាយពណ៌ ROYGBIV", presets: "ផ្ទៃរចនាប័ទ្ម", accents: "ពណ៌ឥន្ទធនូ ROYGBIV",
    default: "ពណ៌ដើមរបស់រចនាប័ទ្ម", close: "បិទការជ្រើសពណ៌",
  } : {
    button: "Artist theme palette", title: "Painter's ROYGBIV Palette", presets: "Studio theme canvas", accents: "ROYGBIV rainbow paints",
    default: "Use preset accent", close: "Close theme palette",
  };

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (event.target instanceof Node && !controlRef.current?.contains(event.target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { setOpen(false); controlRef.current?.querySelector("button")?.focus(); }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => { document.removeEventListener("pointerdown", onPointerDown); document.removeEventListener("keydown", onKeyDown); };
  }, [open]);

  const currentColor = rainbowAccents.find((item) => item.id === accent)?.color ?? themePresets.find((item) => item.id === theme)?.color;

  return <div className="theme-control" ref={controlRef}>
    <button type="button" className="icon-button theme-trigger" aria-label={t.button} title={t.button} aria-expanded={open} aria-controls="theme-picker" onClick={() => setOpen((value) => !value)}>
      <Palette size={20} aria-hidden="true" /><span className="theme-trigger-dot" style={{ backgroundColor: currentColor }} aria-hidden="true" />
    </button>
    {open && <>
      <button type="button" className="theme-picker-backdrop" tabIndex={-1} aria-label={t.close} onClick={() => setOpen(false)} />
      <div className="theme-picker" id="theme-picker" role="dialog" aria-label={t.button}>
        <div className="theme-picker-head"><div className="theme-picker-heading"><Palette size={20} aria-hidden="true" /><strong>{t.title}</strong></div><div className="palette-thumb-hole" aria-hidden="true" /><button type="button" className="theme-picker-close" aria-label={t.close} onClick={() => setOpen(false)}><X size={19} aria-hidden="true" /></button></div>
        <div className="theme-picker-section" role="group" aria-label={t.accents}>
          <h2>{t.accents}</h2>
          <div className="paint-dollops">{rainbowAccents.map((option) => <button type="button" key={option.id} className={`paint-dollop ${accent === option.id ? "selected" : ""}`} style={{ "--paint-color": option.color } as CSSProperties} aria-label={`${option.letter} — ${option[locale]}`} title={`${option.letter} — ${option[locale]}`} aria-pressed={accent === option.id} onClick={() => onAccentChange(option.id)}><span className="paint-dollop-core" aria-hidden="true">{option.letter}</span></button>)}</div>
          <div className="palette-selected-color" aria-live="polite">{accent === "default" ? t.default : rainbowAccents.find((option) => option.id === accent)?.[locale]}</div>
          <button type="button" className={`theme-accent-default ${accent === "default" ? "selected" : ""}`} aria-pressed={accent === "default"} onClick={() => onAccentChange("default")}><span className="accent-dot" style={{ backgroundColor: themePresets.find((item) => item.id === theme)?.color }} aria-hidden="true" />{t.default}</button>
        </div>
        <div className="theme-picker-section" role="group" aria-label={t.presets}>
          <h2>{t.presets}</h2>
          <div className="theme-preset-grid">{themePresets.map((preset) => <button type="button" key={preset.id} className={`theme-preset ${theme === preset.id ? "selected" : ""}`} aria-pressed={theme === preset.id} onClick={() => onThemeChange(preset.id)}>
            <span className="theme-preset-swatch" style={{ backgroundColor: preset.background }} aria-hidden="true"><span style={{ backgroundColor: preset.color }} /></span>
            <span>{preset[locale]}</span>{theme === preset.id && <Check size={16} aria-hidden="true" />}
          </button>)}</div>
        </div>
      </div>
    </>}
  </div>;
}
