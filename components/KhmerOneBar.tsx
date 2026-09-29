"use client";

import type { Locale } from "@/types/app";

/** Copy into a React child app; no stylesheet dependency. */
export function KhmerOneBar({ locale = "en", homeUrl = "https://khmerone.com/", dark = true }: {
  locale?: Locale; homeUrl?: string; dark?: boolean;
}) {
  const label = locale === "km" ? "ត្រឡប់ទៅ KhmerOne" : "Back to KhmerOne";
  return <nav aria-label="KhmerOne Network" style={{ background: dark ? "#080e18" : "#e9f8fa", color: dark ? "#c7e9f2" : "#06485c", borderBottom: dark ? "1px solid rgba(0,240,255,.22)" : "1px solid rgba(6,182,212,.35)", fontFamily: "var(--font-kantumruy), system-ui, sans-serif", fontSize: 13 }}>
    <div style={{ maxWidth: 1184, margin: "auto", minHeight: 32, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "4px 24px" }}>
      <span style={{ fontWeight: 800, letterSpacing: ".09em" }}><span style={{ color: dark ? "#00f0ff" : "#006d80" }}>◆</span> KHMERONE <span style={{ opacity: .72, fontWeight: 500 }}>NETWORK</span></span>
      <a href={homeUrl} style={{ color: dark ? "#c7e9f2" : "#06485c", textDecoration: "none", fontWeight: 700, whiteSpace: "nowrap" }} aria-label={label}>{locale === "km" ? "កម្មវិធីទាំងអស់" : "All apps"} <span aria-hidden="true">↗</span></a>
    </div>
  </nav>;
}
