"use client";

import { useEffect, useRef, useState } from "react";
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
    button: "ជ្រើសពណ៌ និងរចនាប័ទ្ម", title: "ពណ៌របស់អ្នក", presets: "ផ្ទៃ និងរចនាប័ទ្ម", accents: "ពណ៌លេចធ្លោ",
    default: "ពណ៌ដើមរបស់រចនាប័ទ្ម", close: "បិទការជ្រើសពណ៌",
  } : {
    button: "Choose colors and theme", title: "Make it yours", presets: "Background palettes", accents: "Rainbow accents",
    default: "Preset accent", close: "Close theme picker",
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
    {open && <div className="theme-picker" id="theme-picker" role="dialog" aria-label={t.button}>
      <div className="theme-picker-head"><strong>{t.title}</strong><button type="button" className="theme-picker-close" aria-label={t.close} onClick={() => setOpen(false)}><X size={18} aria-hidden="true" /></button></div>
      <div className="theme-picker-section" role="group" aria-label={t.presets}>
        <h2>{t.presets}</h2>
        <div className="theme-preset-grid">{themePresets.map((preset) => <button type="button" key={preset.id} className={`theme-preset ${theme === preset.id ? "selected" : ""}`} aria-pressed={theme === preset.id} onClick={() => onThemeChange(preset.id)}>
          <span className="theme-preset-swatch" style={{ backgroundColor: preset.background }} aria-hidden="true"><span style={{ backgroundColor: preset.color }} /></span>
          <span>{preset[locale]}</span>{theme === preset.id && <Check size={16} aria-hidden="true" />}
        </button>)}</div>
      </div>
      <div className="theme-picker-section" role="group" aria-label={t.accents}>
        <h2>{t.accents}</h2>
        <div className="theme-accent-grid">
          <button type="button" className={`theme-accent theme-accent-default ${accent === "default" ? "selected" : ""}`} aria-pressed={accent === "default"} onClick={() => onAccentChange("default")}><span className="accent-dot" style={{ backgroundColor: themePresets.find((item) => item.id === theme)?.color }} aria-hidden="true" />{t.default}</button>
          {rainbowAccents.map((option) => <button type="button" key={option.id} className={`theme-accent ${accent === option.id ? "selected" : ""}`} aria-pressed={accent === option.id} onClick={() => onAccentChange(option.id)}><span className="accent-dot" style={{ backgroundColor: option.color }} aria-hidden="true" />{option[locale]}</button>)}
        </div>
      </div>
    </div>}
  </div>;
}
