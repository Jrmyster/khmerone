function TempleSilhouette({ fill }: { fill: string }) {
  return <g fill={fill}>
    <path d="M9 85H111L106 78H14Z" />
    <path d="M16 76H104L99 67H21Z" />
    <path d="M25 65H95L90 57H30Z" />
    <path d="M29 57V45H32V40L35 34L38 23L41 34L44 40V45H47V57Z" />
    <path d="M73 57V45H76V40L79 34L82 23L85 34L88 40V45H91V57Z" />
    <path d="M50 57V40H53V33L56 26L60 10L64 26L67 33V40H70V57Z" />
    <path d="M17 66V60H25V66ZM95 66V60H103V66Z" />
  </g>;
}

/** Decorative Angkor Wat mark. The parent home link supplies the accessible name. */
export function AngkorWatIcon() {
  return <span className="angkor-icon" aria-hidden="true">
    <svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <defs>
        <linearGradient id="angkor-gold" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fef08a" /><stop offset=".52" stopColor="#f59e0b" /><stop offset="1" stopColor="#b45309" />
        </linearGradient>
        <linearGradient id="angkor-sky" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#bae6fd" /><stop offset=".52" stopColor="#38bdf8" /><stop offset="1" stopColor="#0284c7" />
        </linearGradient>
      </defs>
      <g className="angkor-layer angkor-layer-gold"><TempleSilhouette fill="url(#angkor-gold)" /></g>
      <g className="angkor-layer angkor-layer-sky"><TempleSilhouette fill="url(#angkor-sky)" /></g>
      <path className="angkor-detail" d="M16 79H104M24 68H96M32 57H88" fill="none" stroke="#fff3bc" strokeWidth="1.2" strokeLinecap="round" opacity=".55" />
      <path d="M56 76V69C56 64 64 64 64 69V76Z" fill="#152032" opacity=".9" />
      <circle className="angkor-beacon" cx="60" cy="8" r="2.8" fill="#fff8d5" />
    </svg>
  </span>;
}
