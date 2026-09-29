"use client";

import type { Locale } from "@/types/app";

/** Copy into a React child app; no stylesheet dependency. */
export function KhmerOneBar({ locale = "en", homeUrl = "https://khmerone.com/", dark = false }: {
  locale?: Locale; homeUrl?: string; dark?: boolean;
}) {
  const label = locale === "km" ? "ត្រឡប់ទៅ KhmerOne" : "Back to KhmerOne";
  return <nav aria-label="KhmerOne Network" style={{ background: dark ? "#102826" : "#075e57", color: "#fff", fontFamily: "var(--font-kantumruy), system-ui, sans-serif", fontSize: 13 }}>
    <div style={{ maxWidth: 1184, margin: "auto", minHeight: 32, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "4px 24px" }}>
      <span style={{ fontWeight: 700, letterSpacing: ".055em" }}>KHMERONE <span style={{ opacity: .72, fontWeight: 500 }}>NETWORK</span></span>
      <a href={homeUrl} style={{ color: "#fff", textDecoration: "none", fontWeight: 600, whiteSpace: "nowrap" }} aria-label={label}>{locale === "km" ? "កម្មវិធីទាំងអស់" : "All apps"} <span aria-hidden="true">↗</span></a>
    </div>
  </nav>;
}
