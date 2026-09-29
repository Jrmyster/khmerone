"use client";

import { useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import { AppCategory, type FilterKey, type Locale } from "@/types/app";

interface MascotBotProps {
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

type Point = { x: number; y: number };
type Gaze = { left: Point; right: Point };
const centered = (): Gaze => ({ left: { x: 0, y: 0 }, right: { x: 0, y: 0 } });

export function MascotBot({ locale, query, resultCount, onSelectFilter, onFocusSearch }: MascotBotProps) {
  const [open, setOpen] = useState(false);
  const [spinning, setSpinning] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [lookingAtUser, setLookingAtUser] = useState(false);
  const [blinking, setBlinking] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const faceRef = useRef<SVGGElement>(null);
  const leftPupilRef = useRef<SVGGElement>(null);
  const rightPupilRef = useRef<SVGGElement>(null);
  const targetGaze = useRef<Gaze>(centered());
  const currentGaze = useRef<Gaze>(centered());
  const directLook = useRef(false);
  const wakeGaze = useRef<() => void>(() => {});
  const spinTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searching = query.trim().length > 0;
  const t = words[locale];

  useEffect(() => {
    const frame = requestAnimationFrame(() => setShowGreeting(true));
    const timer = setTimeout(() => setShowGreeting(false), 2500);
    return () => { cancelAnimationFrame(frame); clearTimeout(timer); };
  }, []);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setShowBubble(searching);
      if (searching) setShowGreeting(false);
    });
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

  useEffect(() => {
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const draw = () => {
      frame = 0;
      const goal = directLook.current ? centered() : targetGaze.current;
      let movement = 0;
      for (const eye of ["left", "right"] as const) {
        const current = currentGaze.current[eye];
        current.x += (goal[eye].x - current.x) * .1;
        current.y += (goal[eye].y - current.y) * .1;
        movement = Math.max(movement, Math.abs(goal[eye].x - current.x), Math.abs(goal[eye].y - current.y));
      }
      const left = currentGaze.current.left;
      const right = currentGaze.current.right;
      leftPupilRef.current?.setAttribute("transform", `translate(${left.x.toFixed(2)} ${left.y.toFixed(2)})`);
      rightPupilRef.current?.setAttribute("transform", `translate(${right.x.toFixed(2)} ${right.y.toFixed(2)})`);
      faceRef.current?.setAttribute("transform", `translate(${((left.x + right.x) * .13).toFixed(2)} ${((left.y + right.y) * .13).toFixed(2)})`);
      if (movement > .025) frame = requestAnimationFrame(draw);
    };

    const wake = () => {
      if (reducedMotion.matches) {
        currentGaze.current = centered();
        leftPupilRef.current?.setAttribute("transform", "translate(0 0)");
        rightPupilRef.current?.setAttribute("transform", "translate(0 0)");
        faceRef.current?.setAttribute("transform", "translate(0 0)");
      } else if (!frame) frame = requestAnimationFrame(draw);
    };
    wakeGaze.current = wake;

    const pointToward = (event: PointerEvent, eyeX: number, eyeY: number, rect: DOMRect): Point => {
      const dx = event.clientX - (rect.left + rect.width * eyeX / 112);
      const dy = event.clientY - (rect.top + rect.height * eyeY / 130);
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(Math.hypot(dx, dy) * .05, 4.2);
      return { x: Math.cos(angle) * distance, y: Math.sin(angle) * distance };
    };
    const followPointer = (event: PointerEvent) => {
      if (!finePointer.matches || reducedMotion.matches || event.pointerType !== "mouse") return;
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return;
      targetGaze.current = {
        left: pointToward(event, 40.5, 54, rect),
        right: pointToward(event, 71.5, 54, rect),
      };
      if (!directLook.current) wake();
    };
    const lookForward = () => { targetGaze.current = centered(); wake(); };
    const leaveViewport = (event: MouseEvent) => { if (!event.relatedTarget) lookForward(); };

    window.addEventListener("pointermove", followPointer, { passive: true });
    window.addEventListener("mouseout", leaveViewport);
    window.addEventListener("blur", lookForward);
    finePointer.addEventListener("change", lookForward);
    reducedMotion.addEventListener("change", lookForward);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      wakeGaze.current = () => {};
      window.removeEventListener("pointermove", followPointer);
      window.removeEventListener("mouseout", leaveViewport);
      window.removeEventListener("blur", lookForward);
      finePointer.removeEventListener("change", lookForward);
      reducedMotion.removeEventListener("change", lookForward);
    };
  }, []);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (callback: () => void, delay: number) => {
      const timer = setTimeout(() => { timers.delete(timer); callback(); }, delay);
      timers.add(timer);
    };
    const schedule = () => later(glance, 6000 + Math.random() * 4000);
    const glance = () => {
      directLook.current = true;
      setLookingAtUser(true);
      wakeGaze.current();
      later(() => setBlinking(true), 250);
      later(() => setBlinking(false), 390);
      later(() => setBlinking(true), 490);
      later(() => setBlinking(false), 630);
      later(() => {
        directLook.current = false;
        setLookingAtUser(false);
        wakeGaze.current();
        schedule();
      }, 1600);
    };
    schedule();
    return () => { for (const timer of timers) clearTimeout(timer); };
  }, []);

  const toggle = () => {
    setOpen((current) => !current);
    setShowBubble(false);
    setShowGreeting(false);
    setSpinning(true);
    if (spinTimer.current) clearTimeout(spinTimer.current);
    spinTimer.current = setTimeout(() => setSpinning(false), 650);
  };

  return <div className={`helper-bot fixed left-6 bottom-8 z-50 ${searching ? "is-searching" : ""} ${lookingAtUser ? "bot-looking" : ""}`}>
    {showGreeting && !searching && !open && <div className="bot-bubble bot-greeting" role="status" lang="km"><p>សួស្តី</p></div>}
    {showBubble && searching && !open && <div className="bot-bubble rounded-2xl border border-cyan-500/30 bg-slate-900/90 p-3 text-cyan-200 shadow-lg backdrop-blur-md" role="status">
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
      <svg ref={svgRef} viewBox="0 0 112 130" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
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
        <rect x="19" y="23" width="74" height="74" rx="24" fill="url(#bot-shell)" stroke="#38bdf8" strokeWidth="2.5"/>
        <g ref={faceRef}>
          <rect x="25" y="34" width="62" height="48" rx="15" fill="url(#bot-face)" stroke="#2a8199" strokeWidth="1.5"/>
          <ellipse cx="40.5" cy="54" rx="9" ry="10" fill="#38bdf8" opacity=".34" filter="url(#bot-glow)"/>
          <ellipse cx="71.5" cy="54" rx="9" ry="10" fill="#38bdf8" opacity=".34" filter="url(#bot-glow)"/>
          <circle cx="40.5" cy="54" r="9" fill="#102638" stroke="#2a8199" strokeWidth="1.4"/>
          <circle cx="71.5" cy="54" r="9" fill="#102638" stroke="#2a8199" strokeWidth="1.4"/>
          <g className={`bot-gaze ${blinking ? "bot-gaze-blinking" : ""}`}>
            <g ref={leftPupilRef} className="bot-pupil"><circle cx="40.5" cy="54" r="3.5" fill="#7cf7ff"/><circle cx="39.5" cy="52.8" r="1" fill="#fff" opacity=".9"/></g>
            <g ref={rightPupilRef} className="bot-pupil"><circle cx="71.5" cy="54" r="3.5" fill="#7cf7ff"/><circle cx="70.5" cy="52.8" r="1" fill="#fff" opacity=".9"/></g>
            <path className="bot-blink-line" d="M35 54h11m20 0h11" fill="none" stroke="#7cf7ff" strokeWidth="2.5" strokeLinecap="round"/>
          </g>
          <path className="bot-mouth" d="M45 69Q56 78 67 69" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinecap="round"/>
        </g>
        <g transform="rotate(-9 56 26)">
          <path d="M26 32Q29 14 52 12Q75 11 84 27L82 35Q56 30 29 37Z" fill="#875632" stroke="#c18a55" strokeWidth="1.8" strokeLinejoin="round"/>
          <path d="M32 31Q50 20 78 28M54 13Q58 20 56 31" fill="none" stroke="#c99962" strokeWidth="1.2" opacity=".85"/>
          <path d="M75 30Q90 28 105 35Q108 37 104 40Q90 42 76 36Z" fill="#694027" stroke="#b17a49" strokeWidth="1.5" strokeLinejoin="round"/>
          <path d="M80 33Q93 32 102 37" fill="none" stroke="#d2a06c" strokeWidth="1" opacity=".8"/>
          <circle cx="53" cy="13" r="2" fill="#b98450"/>
        </g>
        <circle cx="20" cy="43" r="2" fill="#fbbf24"/><circle cx="92" cy="43" r="2" fill="#fbbf24"/>
        <circle cx="98" cy="75" r="2.5" fill="#f8fafc" stroke="#a5f3fc" strokeWidth="1"/>
        <path d="M95 77Q94 87 99 87Q104 87 103 77" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M106 77v5m-2.5-2.5h5" fill="none" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M36 97v7m40-7v7" stroke="#4fb9cc" strokeWidth="4" strokeLinecap="round"/>
        <rect x="27" y="103" width="58" height="21" rx="9" fill="#172a41" stroke="#4fb9cc" strokeWidth="2"/>
        <path d="M45 97L58 104M73 97L63 104" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeLinecap="round"/>
        <path d="M57 105L64 105L67 118L61 123L56 119Z" fill="#b91c1c" stroke="#f87171" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M54 101L58 98L64 101L62 107L57 107Z" fill="#ef4444" stroke="#fca5a5" strokeWidth="1" strokeLinejoin="round"/>
        <path d="M60 108L63 118" stroke="#fca5a5" strokeWidth="1" opacity=".75"/>
        <rect x="31" y="106" width="24" height="15" rx="4" fill="#0b2131" stroke="#fbbf24" strokeWidth="1"/>
        <text x="43" y="117.3" fill="#f8fafc" fontFamily="system-ui, sans-serif" fontSize="10" fontWeight="800" textAnchor="middle">bot</text>
        <path d="M40 124v3m32-3v3" stroke="#4fb9cc" strokeWidth="4" strokeLinecap="round"/>
        <path className="bot-spark" d="M9 29v6m-3-3h6M99 20v6m-3-3h6" fill="none" stroke="#00f0ff" strokeWidth="1.6" strokeLinecap="round"/>
      </svg>
    </button>
  </div>;
}
