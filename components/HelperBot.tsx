"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { AppCategory, type FilterKey, type Locale } from "@/types/app";

interface HelperBotProps {
  locale: Locale;
  query: string;
  resultCount: number;
  onSelectFilter: (filter: FilterKey) => void;
  onFocusSearch: () => void;
}

const shortcuts: { filter: FilterKey; en: string; km: string }[] = [
  { filter: "all", en: "All apps", km: "កម្មវិធីទាំងអស់" },
  { filter: AppCategory.Languages, en: "Languages", km: "ភាសា" },
  { filter: AppCategory.Stem, en: "STEM", km: "ស្ទែម" },
  { filter: AppCategory.Health, en: "Health", km: "សុខភាព" },
];

const words = {
  en: {
    name: "KhmerOne helper bot", open: "Open learning shortcuts", close: "Close learning shortcuts",
    title: "Where shall we explore?", search: "Search learning apps", matches: "matching apps",
    searching: "Searching Khmer learning resources…", noMatches: "No match yet. Try another word.",
  },
  km: {
    name: "មនុស្សយន្តជំនួយ KhmerOne", open: "បើកផ្លូវកាត់សិក្សា", close: "បិទផ្លូវកាត់សិក្សា",
    title: "តោះ ស្វែងយល់ពីអ្វី?", search: "ស្វែងរកកម្មវិធីសិក្សា", matches: "កម្មវិធីដែលត្រូវគ្នា",
    searching: "កំពុងស្វែងរកកម្មវិធីសិក្សា…", noMatches: "មិនទាន់រកឃើញទេ។ សាកពាក្យផ្សេង។",
  },
};

export function HelperBot({ locale, query, resultCount, onSelectFilter, onFocusSearch }: HelperBotProps) {
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const spinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searching = query.trim().length > 0;
  const t = words[locale];

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShowBubble(searching));
    const timer = searching ? setTimeout(() => setShowBubble(false), 3200) : null;
    return () => { cancelAnimationFrame(frame); if (timer) clearTimeout(timer); };
  }, [searching, query]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useEffect(() => () => { if (spinTimer.current) clearTimeout(spinTimer.current); }, []);

  const toggle = () => {
    setOpen((current) => !current);
    setShowBubble(false);
    setSpinning(true);
    if (spinTimer.current) clearTimeout(spinTimer.current);
    spinTimer.current = setTimeout(() => setSpinning(false), 650);
  };

  return <div className={`helper-bot fixed left-6 bottom-8 z-50 ${searching ? "is-searching" : ""}`}>
    {showBubble && !open && <div className="bot-bubble rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-3 text-cyan-200 shadow-lg backdrop-blur-md" role="status">
      <span className="bot-bubble-label">KHMERONE // SEARCH</span>
      <p>{resultCount ? t.searching : t.noMatches}</p>
      <small>{resultCount} {t.matches}</small>
    </div>}

    {open && <section id="helper-bot-shortcuts" className="bot-drawer rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-4 shadow-lg backdrop-blur-md" aria-label={t.title}>
      <div className="bot-drawer-head"><span className="bot-drawer-title">{t.title}</span><button type="button" className="bot-close" onClick={() => setOpen(false)} aria-label={t.close}><X size={17} /></button></div>
      <button type="button" className="bot-search-shortcut" onClick={() => { setOpen(false); onFocusSearch(); }}><Search size={17} aria-hidden="true" />{t.search}</button>
      <div className="bot-shortcuts">{shortcuts.map((item) => <button type="button" key={item.filter} onClick={() => { onSelectFilter(item.filter); setOpen(false); }}>{item[locale]}</button>)}</div>
    </section>}

    <span className="bot-shadow" aria-hidden="true" />
    <button type="button" className={`bot-button ${spinning ? "bot-spin" : ""}`} onClick={toggle} aria-label={`${t.name}: ${open ? t.close : t.open}`} aria-expanded={open} aria-controls="helper-bot-shortcuts" title={open ? t.close : t.open}>
      <svg viewBox="0 0 112 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="bot-shell" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#233e5b"/><stop offset="1" stopColor="#111d31"/></linearGradient>
          <linearGradient id="bot-face" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#142b43"/><stop offset="1" stopColor="#081523"/></linearGradient>
          <filter id="bot-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="3"/></filter>
        </defs>
        <path d="M56 24V11" fill="none" stroke="#75dded" strokeWidth="3" strokeLinecap="round"/>
        <circle className="bot-antenna-glow" cx="56" cy="8" r="8" fill="#00f0ff" filter="url(#bot-glow)"/>
        <circle className="bot-antenna-tip" cx="56" cy="8" r="4" fill="#8afaff"/>
        <rect x="6" y="54" width="16" height="23" rx="6" fill="#18334b" stroke="#36cce4" strokeWidth="2"/>
        <rect x="90" y="54" width="16" height="23" rx="6" fill="#18334b" stroke="#36cce4" strokeWidth="2"/>
        <rect x="19" y="23" width="74" height="74" rx="24" fill="url(#bot-shell)" stroke="#63e5f3" strokeWidth="2.5"/>
        <rect x="25" y="34" width="62" height="48" rx="15" fill="url(#bot-face)" stroke="#2a8199" strokeWidth="1.5"/>
        <ellipse cx="40" cy="54" rx="9" ry="10" fill="#00f0ff" opacity=".34" filter="url(#bot-glow)"/>
        <ellipse cx="72" cy="54" rx="9" ry="10" fill="#00f0ff" opacity=".34" filter="url(#bot-glow)"/>
        <rect className="bot-eye" x="36" y="48" width="9" height="12" rx="4.5" fill="#7cf7ff"/>
        <rect className="bot-eye" x="67" y="48" width="9" height="12" rx="4.5" fill="#7cf7ff"/>
        <path className="bot-mouth" d="M45 69Q56 78 67 69" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="20" cy="43" r="2" fill="#fbbf24"/><circle cx="92" cy="43" r="2" fill="#fbbf24"/>
        <path d="M36 97v7m40-7v7" stroke="#4fb9cc" strokeWidth="4" strokeLinecap="round"/>
        <rect x="31" y="103" width="50" height="21" rx="9" fill="#172a41" stroke="#4fb9cc" strokeWidth="2"/>
        <circle cx="56" cy="113" r="4" fill="#fbbf24"/><path d="M40 124v3m32-3v3" stroke="#4fb9cc" strokeWidth="4" strokeLinecap="round"/>
        <path className="bot-spark" d="M9 29v6m-3-3h6M99 20v6m-3-3h6" fill="none" stroke="#00f0ff" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </button>
  </div>;
}
