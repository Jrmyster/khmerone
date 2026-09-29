"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { ChevronDown } from "lucide-react";
import type { Locale } from "@/types/app";

/** Copy into a React child app; styling is self-contained. */
export function KhmerOneBar({ locale = "en", homeUrl = "https://khmerone.com/", dark = true }: {
  locale?: Locale; homeUrl?: string; dark?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const label = locale === "km" ? "ត្រឡប់ទៅ KhmerOne" : "Back to KhmerOne";
  const menuLabel = locale === "km" ? "បើកម៉ឺនុយបណ្ដាញ" : "Open network menu";
  const linkText = locale === "km" ? "កម្មវិធីទាំងអស់" : "All apps";
  const colors = {
    "--network-bg": dark ? "#080e18" : "#e9f8fa",
    "--network-fg": dark ? "#c7e9f2" : "#06485c",
    "--network-accent": dark ? "#00f0ff" : "#006d80",
    "--network-border": dark ? "rgba(0,240,255,.22)" : "rgba(6,182,212,.35)",
  } as CSSProperties;

  useEffect(() => {
    if (!open) return;
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !navRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", closeOutside);
    return () => document.removeEventListener("pointerdown", closeOutside);
  }, [open]);

  return <nav ref={navRef} className="khmerone-network-bar" aria-label="KhmerOne Network" style={colors} onKeyDown={(event) => { if (event.key === "Escape") setOpen(false); }}>
    <style>{`
      .khmerone-network-bar{position:relative;z-index:60;background:var(--network-bg);color:var(--network-fg);border-bottom:1px solid var(--network-border);font:700 13px/1.4 var(--font-kantumruy),system-ui,sans-serif}
      .khmerone-network-inner{max-width:1184px;min-height:44px;margin:auto;padding:0 24px;display:flex;align-items:center;justify-content:space-between;gap:12px}
      .khmerone-network-brand{font-weight:800;letter-spacing:.09em;white-space:nowrap}
      .khmerone-network-mark{color:var(--network-accent)}
      .khmerone-network-link,.khmerone-network-toggle{min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:6px;color:var(--network-fg);font:inherit;text-decoration:none;white-space:nowrap}
      .khmerone-network-link:hover,.khmerone-network-toggle:hover{color:var(--network-accent)}
      .khmerone-network-toggle{display:none;border:0;background:transparent;padding:0 10px;cursor:pointer}
      .khmerone-network-menu{display:none}
      @media(max-width:640px){
        .khmerone-network-inner{height:44px;min-height:44px;padding:0 16px}
        .khmerone-network-link{display:none}
        .khmerone-network-toggle{display:inline-flex}
        .khmerone-network-menu{position:absolute;top:43px;right:12px;display:block;min-width:175px;padding:6px;border:1px solid var(--network-border);border-radius:12px;background:var(--network-bg);box-shadow:0 14px 30px rgba(0,0,0,.25)}
        .khmerone-network-menu a{min-height:44px;display:flex;align-items:center;padding:8px 12px;color:var(--network-fg);text-decoration:none;border-radius:8px}
        .khmerone-network-menu a:hover{background:var(--network-border)}
      }
      @media(max-width:350px){.khmerone-network-brand span:last-child{display:none}}
    `}</style>
    <div className="khmerone-network-inner">
      <span className="khmerone-network-brand"><span className="khmerone-network-mark">◆</span> KHMERONE <span style={{ opacity: .72, fontWeight: 500 }}>NETWORK</span></span>
      <a className="khmerone-network-link" href={homeUrl} aria-label={label}>{linkText} <span aria-hidden="true">↗</span></a>
      <button type="button" className="khmerone-network-toggle" aria-label={menuLabel} aria-controls="khmerone-network-menu" aria-expanded={open} onClick={() => setOpen((value) => !value)}>{locale === "km" ? "ម៉ឺនុយ" : "Menu"}<ChevronDown size={16} aria-hidden="true" /></button>
    </div>
    {open && <div className="khmerone-network-menu" id="khmerone-network-menu"><a href={homeUrl} onClick={() => setOpen(false)}>{linkText} <span aria-hidden="true">↗</span></a></div>}
  </nav>;
}
