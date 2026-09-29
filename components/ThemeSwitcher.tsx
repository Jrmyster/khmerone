"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Palette, X } from "lucide-react";
import { rainbowAccents, themePresets, type AccentId, type ThemeId } from "@/data/themes";
import type { Locale } from "@/types/app";

interface ThemeSwitcherProps {
  locale: Locale;
  theme: ThemeId;
  accent: AccentId;
  onAccentChange: (accent: AccentId) => void;
}

const paintPositions = [
  { x: 39, y: 18, mobileX: 33, mobileY: 19 },
  { x: 53, y: 12, mobileX: 51, mobileY: 10 },
  { x: 68, y: 15, mobileX: 70, mobileY: 17 },
  { x: 82, y: 29, mobileX: 84, mobileY: 35 },
  { x: 71, y: 74, mobileX: 71, mobileY: 74 },
  { x: 36, y: 82, mobileX: 36, mobileY: 82 },
  { x: 14, y: 56, mobileX: 14, mobileY: 56 },
] as const;

export function ThemeSwitcher({ locale, theme, accent, onAccentChange }: ThemeSwitcherProps) {
  const [open, setOpen] = useState(false);
  const controlRef = useRef<HTMLDivElement>(null);
  const t = locale === "km" ? {
    button: "ជ្រើសពណ៌", title: "ក្ដារលាយពណ៌ ROYGBIV", accents: "ពណ៌ឥន្ទធនូ ROYGBIV",
    default: "ពណ៌ដើម", close: "បិទការជ្រើសពណ៌",
  } : {
    button: "Artist color palette", title: "Painter's ROYGBIV Palette", accents: "ROYGBIV rainbow paints",
    default: "Original accent", close: "Close color palette",
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
          <div className="palette-wheel">
            <svg className="wood-palette-art" viewBox="0 0 480 320" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
              <defs>
                <linearGradient id="wood-tone" x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#edbc73"/><stop offset=".3" stopColor="#bb7c3f"/><stop offset=".68" stopColor="#a56231"/><stop offset="1" stopColor="#6e371b"/></linearGradient>
                <linearGradient id="wood-rim" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ffe0a2"/><stop offset=".5" stopColor="#a36336"/><stop offset="1" stopColor="#4c200f"/></linearGradient>
                <pattern id="wood-grain" width="48" height="29" patternUnits="userSpaceOnUse"><path d="M-8 8C15 1 31 5 56 0M-9 19C16 12 35 17 58 11M-4 29C15 25 30 28 55 22" fill="none" stroke="#683014" strokeOpacity=".24" strokeWidth="1.4"/><path d="M0 12C18 8 37 11 49 7M1 24C18 20 34 24 49 18" fill="none" stroke="#ffe0a2" strokeOpacity=".22" strokeWidth="1"/></pattern>
                <mask id="palette-hole"><rect width="480" height="320" fill="white"/><ellipse cx="229" cy="166" rx="31" ry="25" fill="black"/></mask>
              </defs>
              <path className="wood-board" d="M70 70C140 5 280 -10 390 22C450 42 480 72 464 118C452 150 405 156 378 165C348 175 340 190 367 214C394 242 385 278 326 301C280 320 190 317 125 302C55 286 18 236 17 180C14 135 32 96 70 70Z" fill="url(#wood-tone)" stroke="url(#wood-rim)" strokeWidth="7" mask="url(#palette-hole)"/>
              <path d="M70 70C140 5 280 -10 390 22C450 42 480 72 464 118C452 150 405 156 378 165C348 175 340 190 367 214C394 242 385 278 326 301C280 320 190 317 125 302C55 286 18 236 17 180C14 135 32 96 70 70Z" fill="url(#wood-grain)" mask="url(#palette-hole)"/>
              <path d="M66 82C145 19 300 7 399 36" fill="none" stroke="#ffe4ac" strokeOpacity=".5" strokeWidth="3" strokeLinecap="round"/>
              <ellipse cx="229" cy="166" rx="32" ry="26" fill="none" stroke="#542a16" strokeWidth="5"/>
              <path d="M199 166a30 24 0 0 1 58 -9" fill="none" stroke="#f5cb89" strokeOpacity=".8" strokeWidth="3"/>
            </svg>
            {rainbowAccents.map((option, index) => <button type="button" key={option.id} className={`paint-dollop ${accent === option.id ? "selected" : ""}`} style={{ "--paint-color": option.color, "--paint-x": `${paintPositions[index].x}%`, "--paint-y": `${paintPositions[index].y}%`, "--paint-x-mobile": `${paintPositions[index].mobileX}%`, "--paint-y-mobile": `${paintPositions[index].mobileY}%`, "--paint-delay": `${index * .35}s` } as CSSProperties} aria-label={`${option.letter} — ${option[locale]}`} title={`${option.letter} — ${option[locale]}`} aria-pressed={accent === option.id} onClick={() => onAccentChange(option.id)}><span className="paint-dollop-core" aria-hidden="true">{option.letter}</span></button>)}
          </div>
          <div className="palette-selected-color" aria-live="polite">{accent === "default" ? t.default : rainbowAccents.find((option) => option.id === accent)?.[locale]}</div>
          <button type="button" className={`theme-accent-default ${accent === "default" ? "selected" : ""}`} aria-pressed={accent === "default"} onClick={() => onAccentChange("default")}><span className="accent-dot" style={{ backgroundColor: themePresets.find((item) => item.id === theme)?.color }} aria-hidden="true" />{t.default}</button>
        </div>
      </div>
    </>}
  </div>;
}
