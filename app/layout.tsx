import type { Metadata, Viewport } from "next";
import { Kantumruy_Pro, Moul } from "next/font/google";
import { CosmicJungleBackground } from "@/components/CosmicJungleBackground";
import "./globals.css";

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
  return <html lang="en" data-theme="cyberpunk" data-accent="default"><body className={`${kantumruy.variable} ${moul.variable}`}><CosmicJungleBackground />{children}</body></html>;
}
