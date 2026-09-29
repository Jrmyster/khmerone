"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE = "a, button, input, textarea, select, summary, [role='button'], [role='link']";

/** A mouse-only decorative cursor; the system pointer remains the fallback. */
export function HDCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;
    const root = document.documentElement;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    let frame = 0;
    let releaseTimer: ReturnType<typeof setTimeout> | undefined;
    let x = 0;
    let y = 0;

    const hide = () => {
      root.classList.remove("hd-cursor-enabled");
      cursor.classList.remove("is-visible", "is-hovering", "is-pressed");
    };
    const move = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== "mouse") { hide(); return; }
      x = event.clientX;
      y = event.clientY;
      root.classList.add("hd-cursor-enabled");
      cursor.classList.add("is-visible");
      cursor.classList.toggle("is-hovering", event.target instanceof Element && Boolean(event.target.closest(INTERACTIVE)));
      if (!frame) frame = requestAnimationFrame(() => {
        cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
        frame = 0;
      });
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || !finePointer.matches) return;
      if (releaseTimer) clearTimeout(releaseTimer);
      cursor.classList.add("is-pressed");
    };
    const up = () => {
      if (releaseTimer) clearTimeout(releaseTimer);
      releaseTimer = setTimeout(() => cursor.classList.remove("is-pressed"), 130);
    };
    const exit = (event: PointerEvent) => {
      if (!event.relatedTarget) hide();
    };
    const mediaChange = () => { if (!finePointer.matches) hide(); };
    const visibilityChange = () => { if (document.hidden) hide(); };

    document.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerdown", down);
    document.addEventListener("pointerup", up);
    document.addEventListener("pointercancel", up);
    document.addEventListener("pointerout", exit);
    document.addEventListener("visibilitychange", visibilityChange);
    window.addEventListener("blur", hide);
    finePointer.addEventListener("change", mediaChange);
    return () => {
      cancelAnimationFrame(frame);
      if (releaseTimer) clearTimeout(releaseTimer);
      hide();
      document.removeEventListener("pointermove", move);
      document.removeEventListener("pointerdown", down);
      document.removeEventListener("pointerup", up);
      document.removeEventListener("pointercancel", up);
      document.removeEventListener("pointerout", exit);
      document.removeEventListener("visibilitychange", visibilityChange);
      window.removeEventListener("blur", hide);
      finePointer.removeEventListener("change", mediaChange);
    };
  }, []);

  return <div ref={cursorRef} className="hd-cursor" aria-hidden="true">
    <span className="hd-cursor-target" />
    <span className="hd-cursor-art">
      <svg viewBox="0 0 40 48" xmlns="http://www.w3.org/2000/svg" focusable="false">
        <defs>
          <linearGradient id="cursor-metal" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#ffffff" /><stop offset=".37" stopColor="#bdcbd5" /><stop offset=".7" stopColor="#41546a" /><stop offset="1" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="cursor-core" x1="0" y1="0" x2=".8" y2="1">
            <stop stopColor="#d7f7ff" /><stop offset=".42" stopColor="var(--accent-primary)" /><stop offset="1" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
        <path d="M2 2L3.4 38L12 30.9L18.4 45L25.2 42L18.7 28.8L31.8 28.2Z" fill="url(#cursor-metal)" stroke="#122238" strokeWidth="1.3" strokeLinejoin="round" />
        <path d="M5.6 7.1L6.2 32.4L12.8 26.6L20.1 40.9L22.2 39.9L15.1 25.5L26 25.1Z" fill="url(#cursor-core)" />
        <path d="M4.9 5.3L5.8 34L12.4 28.5" fill="none" stroke="#ffffff" strokeWidth="1.1" strokeOpacity=".83" strokeLinecap="round" />
      </svg>
    </span>
  </div>;
}
