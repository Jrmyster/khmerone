"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import type { Locale } from "@/types/app";

export function BackToTopButton({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > Math.max(520, window.innerHeight * .6));
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  if (!visible) return null;
  const label = locale === "km" ? "ត្រឡប់ទៅកំពូលទំព័រ" : "Back to top";
  return <button
    type="button"
    className="back-to-top"
    aria-label={label}
    title={label}
    onClick={() => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" })}
  ><ArrowUp size={21} strokeWidth={2.4} aria-hidden="true" /><span className="back-to-top-label">{locale === "km" ? "ឡើងលើ" : "Top"}</span></button>;
}
