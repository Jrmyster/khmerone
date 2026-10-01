"use client";

import { useEffect, useRef } from "react";

type Star = { x: number; y: number; radius: number; opacity: number; phase: number; speed: number };
type Spore = {
  x: number; y: number; radius: number; speed: number; drift: number;
  phase: number; opacity: number; color: string;
};

/** Draw the expensive gas clouds and spiral arms only when the viewport changes. */
function paintNebula(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.translate(width * .51, height * .39);
  ctx.rotate(-.38);
  ctx.scale(1, .62);
  const radius = Math.min(Math.max(width * .52, 220), 750);

  const cloud = (x: number, y: number, r: number, center: string, middle: string) => {
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
    gradient.addColorStop(0, center);
    gradient.addColorStop(.42, middle);
    gradient.addColorStop(1, "rgba(2,4,10,0)");
    ctx.fillStyle = gradient;
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  };
  cloud(-radius * .27, -radius * .1, radius * .78, "rgba(56,189,248,.19)", "rgba(56,189,248,.07)");
  cloud(radius * .32, radius * .1, radius * .82, "rgba(236,72,153,.18)", "rgba(99,102,241,.06)");
  cloud(0, 0, radius * .45, "rgba(193,163,255,.35)", "rgba(168,85,247,.11)");

  for (let arm = 0; arm < 2; arm++) {
    ctx.beginPath();
    for (let i = 0; i <= 120; i++) {
      const progress = i / 120;
      const angle = progress * Math.PI * 2.15 + arm * Math.PI + .3;
      const distance = 10 + progress * radius * .96;
      const x = Math.cos(angle) * distance;
      const y = Math.sin(angle) * distance * .58;
      if (!i) ctx.moveTo(x, y); else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = arm ? "rgba(236,72,153,.12)" : "rgba(56,189,248,.16)";
    ctx.lineWidth = Math.max(14, radius * .055);
    ctx.shadowBlur = 22;
    ctx.shadowColor = arm ? "#ec4899" : "#38bdf8";
    ctx.stroke();
  }
  ctx.shadowBlur = 0;
  cloud(0, 0, radius * .14, "rgba(232,240,255,.42)", "rgba(180,123,245,.16)");
  ctx.restore();
}

function EdgeVine({ side }: { side: "left" | "right" }) {
  const stem = `jungle-stem-${side}`;
  const leaf = `jungle-leaf-${side}`;
  return <svg className={`cyber-jungle-vine cyber-jungle-vine-${side}`} viewBox="0 0 180 900" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id={stem} x1="0" x2="0" y1="0" y2="1"><stop stopColor="var(--vine-cool, #38bdf8)" /><stop offset=".48" stopColor="#10b981" /><stop offset="1" stopColor="var(--vine-dawn, #38bdf8)" /></linearGradient>
      <linearGradient id={leaf} x1="0" x2="1" y1="1" y2="0"><stop stopColor="#047857" /><stop offset=".65" stopColor="var(--leaf-dew, #10b981)" /><stop offset="1" stopColor="var(--leaf-light, #f59e0b)" /></linearGradient>
    </defs>
    <g className="cyber-jungle-vine-lines" fill="none" stroke={`url(#${stem})`} strokeLinecap="round">
      <path d="M-16 -24 C74 50 7 119 63 203 S22 318 60 416 S12 563 69 690 S27 798 83 931" strokeWidth="2.4" />
      <path d="M-9 68 C64 43 105 61 138 1 M49 217 C104 186 127 148 149 130 M42 360 C91 356 127 319 151 280 M54 540 C100 501 120 486 151 473 M49 725 C97 725 126 688 154 656 M65 851 C113 837 122 805 161 788" strokeWidth="1.2" />
      <path d="M8 128 H37 M61 288 H109 M27 446 H53 M64 625 H113 M53 768 H92" strokeWidth=".8" strokeDasharray="3 6" />
    </g>
    <g className="cyber-jungle-leaves" fill={`url(#${leaf})`} stroke="var(--vine-dawn, #38bdf8)" strokeWidth=".7">
      <path d="M63 195 Q86 165 111 167 Q99 190 63 195Z" /><path d="M48 344 Q86 310 118 318 Q100 345 48 344Z" />
      <path d="M68 413 Q85 438 112 437 Q94 410 68 413Z" /><path d="M56 539 Q79 512 111 519 Q91 541 56 539Z" />
      <path d="M70 688 Q92 663 121 670 Q101 693 70 688Z" /><path d="M65 850 Q86 818 119 820 Q101 847 65 850Z" />
    </g>
    <g className="cyber-jungle-nodes" fill="var(--leaf-light, #f59e0b)" stroke="var(--vine-dawn, #38bdf8)" strokeWidth="1.4">
      <circle cx="138" cy="1" r="3" /><circle cx="149" cy="130" r="3" /><circle cx="151" cy="280" r="2.5" />
      <circle cx="151" cy="473" r="3" /><circle cx="154" cy="656" r="2.5" /><circle cx="161" cy="788" r="3" />
    </g>
  </svg>;
}

export function CosmicJungleBackground() {
  const layerRef = useRef<HTMLDivElement>(null);
  const nebulaRef = useRef<HTMLCanvasElement>(null);
  const particleRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const nebula = nebulaRef.current;
    const particlesCanvas = particleRef.current;
    const nebulaCtx = nebula?.getContext("2d", { alpha: true });
    const ctx = particlesCanvas?.getContext("2d", { alpha: true });
    if (!layer || !nebula || !particlesCanvas || !nebulaCtx || !ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let width = 0;
    let height = 0;
    let stars: Star[] = [];
    let spores: Spore[] = [];
    let frame = 0;
    let previous = 0;
    let pulseTimer = 0;

    const createStar = (): Star => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: .3 + Math.random() * 1.45,
      opacity: .2 + Math.random() * .53,
      phase: Math.random() * Math.PI * 2,
      speed: .5 + Math.random() * 1.5,
    });
    const createSpore = (randomY = true): Spore => ({
      x: Math.random() * width,
      y: randomY ? Math.random() * height : height + 8,
      radius: .7 + Math.random() * 1.4,
      speed: .12 + Math.random() * .28,
      drift: (Math.random() - .5) * .22,
      phase: Math.random() * Math.PI * 2,
      opacity: .22 + Math.random() * .3,
      color: Math.random() < .55 ? "56, 189, 248" : "16, 185, 129",
    });

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, coarsePointer.matches ? 1 : 1.5);
      nebula.width = width;
      nebula.height = height;
      paintNebula(nebulaCtx, width, height);
      particlesCanvas.width = Math.round(width * pixelRatio);
      particlesCanvas.height = Math.round(height * pixelRatio);
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      stars = Array.from({ length: coarsePointer.matches ? 155 : 190 }, createStar);
      spores = Array.from({ length: coarsePointer.matches ? 11 : 26 }, () => createSpore());
      draw(performance.now(), 0);
    };

    const draw = (time: number, step: number) => {
      ctx.clearRect(0, 0, width, height);
      for (const star of stars) {
        const alpha = star.opacity * (.72 + .28 * Math.sin(time * .001 * star.speed + star.phase));
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,246,255,${alpha})`;
        if (star.radius > 1.35) { ctx.shadowColor = "#38bdf8"; ctx.shadowBlur = 7; }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      for (let i = 0; i < spores.length; i++) {
        const p = spores[i];
        p.y -= p.speed * step;
        p.x += p.drift * step;
        if (p.y < -9 || p.x < -9 || p.x > width + 9) spores[i] = createSpore(false);
        const spore = spores[i];
        const alpha = spore.opacity * (.8 + .2 * Math.sin(time * .0013 + spore.phase));
        ctx.beginPath();
        ctx.arc(spore.x, spore.y, spore.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${spore.color}, ${alpha})`;
        ctx.shadowColor = `rgba(${spore.color}, .45)`;
        ctx.shadowBlur = 7;
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    };

    const animate = (time: number) => {
      if (time - previous >= (coarsePointer.matches ? 50 : 33)) {
        draw(time, Math.min((time - previous) / 16.67, 2));
        previous = time;
      }
      frame = requestAnimationFrame(animate);
    };

    const syncMotion = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (!reducedMotion.matches && !document.hidden) {
        previous = performance.now();
        frame = requestAnimationFrame(animate);
      } else draw(performance.now(), 0);
    };

    const onScroll = () => {
      if (reducedMotion.matches) return;
      layer.classList.add("is-pulsing");
      window.clearTimeout(pulseTimer);
      pulseTimer = window.setTimeout(() => layer.classList.remove("is-pulsing"), 700);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      layer.classList.toggle("is-near-edge", event.clientX < 105 || event.clientX > width - 105);
    };
    const onPointerOut = (event: PointerEvent) => { if (!event.relatedTarget) layer.classList.remove("is-near-edge"); };

    resize();
    syncMotion();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerout", onPointerOut);
    document.addEventListener("visibilitychange", syncMotion);
    reducedMotion.addEventListener("change", syncMotion);
    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(pulseTimer);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerout", onPointerOut);
      document.removeEventListener("visibilitychange", syncMotion);
      reducedMotion.removeEventListener("change", syncMotion);
    };
  }, []);

  return <div ref={layerRef} className="cosmic-jungle-background" aria-hidden="true">
    <canvas ref={nebulaRef} className="cosmic-jungle-nebula" />
    <div className="khmer-sunrise-horizon" />
    <div className="khmer-sunrise-rays" />
    <canvas ref={particleRef} className="cosmic-jungle-particles" />
    <div className="cyber-jungle-grid" />
    <div className="cyber-jungle-mist" />
    <div className="cyber-jungle-beam cyber-jungle-beam-left" />
    <div className="cyber-jungle-beam cyber-jungle-beam-right" />
    <EdgeVine side="left" /><EdgeVine side="right" />
  </div>;
}
