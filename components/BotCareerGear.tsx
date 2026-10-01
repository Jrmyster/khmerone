/** SVG layers share the mascot's 112 × 130 coordinate system. */
export function BotCareerGear() {
  return <>
    <defs>
      <linearGradient id="bot-tool-metal" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#e0f2fe"/><stop offset=".45" stopColor="#64748b"/><stop offset=".65" stopColor="#dbeafe"/><stop offset="1" stopColor="#334155"/></linearGradient>
      <linearGradient id="bot-torch-fire" x1="0" y1="1" x2="0" y2="0"><stop stopColor="#38bdf8"/><stop offset=".4" stopColor="#e0f2fe"/><stop offset=".7" stopColor="#fb923c"/><stop offset="1" stopColor="#fbbf24" stopOpacity=".3"/></linearGradient>
      <linearGradient id="bot-coat-white" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#cbd5e1"/></linearGradient>
      <linearGradient id="bot-telescope-brass" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fef08a"/><stop offset=".45" stopColor="#d97706"/><stop offset=".7" stopColor="#fbbf24"/><stop offset="1" stopColor="#875632"/></linearGradient>
    </defs>

    <g className="bot-career-arm bot-career-arm-left"><image href="/bot-study/arm-left.webp" x="-3" y="64" width="37" height="36" /></g>
    <g className="bot-career-arm bot-career-arm-right"><image href="/bot-study/arm-right.webp" x="78" y="64" width="37" height="36" /></g>

    <g className="bot-career-tool bot-drill">
      <path d="M29 99L26 114Q25 118 30 119H41L43 115L38 96Z" fill="#0284c7" stroke="#7dd3fc" strokeWidth="1.5"/>
      <rect x="25" y="115" width="20" height="7" rx="2" fill="#172a41" stroke="#fbbf24" strokeWidth="1.3"/>
      <path d="M14 86H39Q46 86 46 92V100H17Z" fill="#fbbf24" stroke="#fef08a" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M37 88v9m-4-9v9m-4-9v9" stroke="#875632" strokeWidth="1.6"/>
      <rect x="8" y="87" width="9" height="12" rx="2" fill="url(#bot-tool-metal)" stroke="#7dd3fc"/>
      <g className="bot-drill-bit"><path d="M-1 93H9" stroke="#e0f2fe" strokeWidth="3" strokeLinecap="round"/><path d="M1 91l2 4m2-4l2 4" stroke="#64748b" strokeWidth="1.2"/></g>
      <circle cx="41" cy="91" r="2" fill="#38bdf8"/>
      <path className="bot-drill-spark" d="M-1 85v3m-4 5h-3m8 7-2 3" stroke="#fde68a" strokeWidth="1.4" strokeLinecap="round"/>
      <circle className="bot-drill-spark bot-spark-delayed" cx="-4" cy="97" r="1.2" fill="#38bdf8"/>
    </g>

    <g className="bot-welding-mask">
      <path d="M24 33Q56 23 88 33L85 79Q56 96 27 79Z" fill="#18334b" stroke="#fbbf24" strokeWidth="2" strokeLinejoin="round"/>
      <rect x="34" y="43" width="44" height="24" rx="5" fill="#061423" stroke="#7dd3fc" strokeWidth="2"/>
      <path d="M39 48h34m-32 5h28" stroke="#38bdf8" opacity=".45"/>
      <path d="M38 74h36m-30 5h24" stroke="#fbbf24" strokeWidth="1.5"/>
      <circle cx="26" cy="34" r="3" fill="url(#bot-tool-metal)"/>
    </g>
    <g className="bot-career-tool bot-torch">
      <path d="M90 113Q110 125 106 130" fill="none" stroke="#f97316" strokeWidth="2"/>
      <path d="M89 110L89 91L97 85L97 80" fill="none" stroke="url(#bot-tool-metal)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="85" y="95" width="9" height="17" rx="3" fill="#0284c7" stroke="#7dd3fc" strokeWidth="1.2"/>
      <circle cx="91" cy="93" r="3" fill="#f59e0b" stroke="#fef08a"/>
      <g className="bot-torch-flame">
        <ellipse cx="97" cy="69" rx="8" ry="12" fill="#38bdf8" opacity=".4" filter="url(#bot-glow)"/>
        <path d="M97 80Q87 70 97 51Q107 70 97 80Z" fill="url(#bot-torch-fire)"/>
        <path d="M97 80Q93 73 97 65Q101 73 97 80Z" fill="#eff6ff"/>
      </g>
      <g className="bot-weld-particles" fill="#fbbf24"><circle cx="87" cy="63" r="1.3"/><circle cx="107" cy="59" r="1"/><circle cx="104" cy="72" r="1.2"/></g>
    </g>

    <g className="bot-career-tool bot-textbook">
      <g className="bot-book-closed">
        <image href="/bot-study/book-closed.webp" x="34" y="68" width="46" height="54" />
        <g transform="rotate(-8 57 91)" fill="#ffe4a0" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700" letterSpacing=".25">
          <text x="58" y="86" fontSize="4.2">QUANTUM</text><text x="58" y="92" fontSize="3.6">MECHANICS</text>
        </g>
      </g>
      <g className="bot-book-open">
        <image href="/bot-study/book-open.webp" x="16" y="69" width="80" height="48" />
        <g fill="#624322" textAnchor="middle" fontFamily="Georgia, serif" fontSize="4.1" fontWeight="700">
          <text x="38" y="88" transform="rotate(7 38 88)">E=mc²</text><text x="75" y="94" transform="rotate(-7 75 94)">Ĥψ=Eψ</text>
        </g>
      </g>
    </g>
    <g className="bot-snap-badge">
      <path d="M0 45l7-4 4-7 7 5 10-1-2 8 4 6-9 3-5 7-7-6-8 1Z" fill="#fbbf24" stroke="#fef08a" strokeWidth="1"/>
      <text x="15" y="50" fill="#102638" fontFamily="system-ui, sans-serif" textAnchor="middle" fontSize="6.5" fontWeight="900">SNAP!</text>
    </g>

    <g className="bot-doctor-outfit">
      <path d="M34 91L25 96L21 119L29 121L30 129H82L83 121L91 119L87 96L77 91L65 100H47Z" fill="url(#bot-coat-white)" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M39 92L47 100L43 110L56 124L56 104L69 110L65 100L73 92" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1.2" strokeLinejoin="round"/>
      <path d="M55 103L60 103L62 113L57 118L54 114Z" fill="#ef4444" stroke="#fca5a5"/>
      <path d="M41 94Q35 111 45 114Q55 111 49 99M69 94Q76 108 68 112L65 119" fill="none" stroke="#0e7490" strokeWidth="2" strokeLinecap="round"/>
      <circle cx="65" cy="120" r="4" fill="url(#bot-tool-metal)" stroke="#38bdf8" strokeWidth="1.5"/>
      <circle cx="41" cy="94" r="1.5" fill="#334155"/><circle cx="69" cy="94" r="1.5" fill="#334155"/>
      <rect x="26" y="111" width="28" height="13" rx="2" fill="#fbbf24" stroke="#fde68a"/>
      <text x="40" y="120" fill="#0b2131" fontFamily="system-ui, sans-serif" fontSize="7.8" fontWeight="800" textAnchor="middle" textLength="24" lengthAdjust="spacingAndGlyphs">Rasmey</text>
      <path d="M73 115h7v8h-7Z" fill="none" stroke="#94a3b8"/>
    </g>
    <g className="bot-doctor-pulse">
      <circle cx="56" cy="-10" r="9" fill="#102638" stroke="#7dd3fc" strokeWidth="1.5"/>
      <path d="M56-15v10m-5-5h10" stroke="#34d399" strokeWidth="3" strokeLinecap="round"/>
      <path d="M72-10h4l2-3 3 6 2-3h6" fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round"/>
    </g>

    <g className="bot-career-tool bot-telescope">
      <g className="bot-telescope-rig">
        {/* The eyepiece pivots around the right eye at (71.5, 54). */}
        <path d="M68 51h12v6H68Z" fill="#0e7490" stroke="#7dd3fc" strokeWidth="1.3"/>
        <ellipse cx="68" cy="54" rx="2" ry="4" fill="#061423" stroke="#38bdf8"/>
        <rect x="78" y="47" width="22" height="14" rx="3" fill="url(#bot-telescope-brass)" stroke="#fef08a" strokeWidth="1.4"/>
        <path d="M83 48v12m5-12v12" stroke="#7dd3fc" strokeWidth="2"/>
        <path d="M80 50h15" stroke="#fef9c3" strokeWidth="1" opacity=".8"/>
        <g className="bot-telescope-tube">
          <rect x="95" y="46" width="10" height="16" rx="2" fill="#0284c7" stroke="#7dd3fc" strokeWidth="1.4"/>
          <ellipse cx="105" cy="54" rx="3" ry="10" fill="#18334b" stroke="#fbbf24" strokeWidth="2"/>
          <ellipse cx="105.5" cy="54" rx="1.7" ry="7.5" fill="#38bdf8"/>
          <path d="M105 49v5" stroke="#e0f2fe" strokeWidth="1.2" strokeLinecap="round"/>
          <g className="bot-telescope-stars" fill="#e0f2fe" stroke="#7dd3fc" strokeWidth=".7">
            <path className="bot-scope-star" d="M105 27l1.5 4 4 1.5-4 1.5-1.5 4-1.5-4-4-1.5 4-1.5Z"/>
            <path className="bot-scope-star bot-scope-star-second" d="M114 36l1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/>
            <circle className="bot-scope-star bot-scope-star-third" cx="112" cy="24" r="1.4" fill="#fbbf24" stroke="none"/>
          </g>
        </g>
        {/* A hand supports the instrument while it tilts toward the sky. */}
        <path d="M83 68Q85 63 90 61" fill="none" stroke="var(--accent-primary)" strokeWidth="4" strokeLinecap="round"/>
        <circle cx="90" cy="62" r="3" fill="#18334b" stroke="#7dd3fc" strokeWidth="1.2"/>
      </g>
    </g>
  </>;
}
