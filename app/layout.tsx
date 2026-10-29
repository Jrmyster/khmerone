/* eslint-disable @next/next/no-css-tags -- Shared stylesheet also serves the standalone HTML tool. */
import type { Metadata, Viewport } from "next";
import { Kantumruy_Pro, Moul } from "next/font/google";
import { OptionalScenery } from "@/components/shared/OptionalScenery";
import { SiteNavigation } from "@/components/shared/SiteNavigation";
import { BackgroundAudio } from "@/src/components/BackgroundAudio";
import "./globals.css";
import "./search/search.css";

const kantumruy = Kantumruy_Pro({ subsets: ["khmer", "latin"], display: "swap", variable: "--font-kantumruy" });
const moul = Moul({ subsets: ["khmer"], weight: "400", display: "swap", variable: "--font-moul" });

export const metadata: Metadata = {
  metadataBase: new URL("https://khmerone.com"),
  title: "KhmerOne (ខ្មែរ វ័ន) — Learning, connected",
  description: "KhmerOne (ខ្មែរវ័ន / ខ្មែរ វ័ន) connects Cambodian students, teachers and families with bilingual learning apps.",
  applicationName: "KhmerOne | ខ្មែរ វ័ន",
  keywords: ["KhmerOne", "KhmerOne.com", "ខ្មែរវ័ន", "ខ្មែរ វ័ន", "Cambodian education", "Khmer learning apps"],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg" },
  openGraph: { type: "website", title: "KhmerOne (ខ្មែរ វ័ន) — Learning, connected", description: "One starting point for Cambodian learning apps.", url: "https://khmerone.com" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, maximumScale: 5, viewportFit: "cover", themeColor: "#0f172a" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html suppressHydrationWarning lang="en" data-theme="cyberpunk" data-accent="default"><head><link rel="stylesheet" href="/site-experience.css" /><script src="/site-experience.js" defer /></head><body className={`${kantumruy.variable} ${moul.variable}`}><SiteNavigation /><OptionalScenery />{children}<footer aria-label="Khmer interface review" style={{maxWidth:1200,margin:"16px auto",padding:"0 16px"}}><p className="ko-review">Khmer interface text · Not teacher-reviewed<small lang="km">អត្ថបទខ្មែរនៃចំណុចប្រទាក់មិនទាន់បានពិនិត្យដោយគ្រូ។</small></p></footer><BackgroundAudio /></body></html>;
}
