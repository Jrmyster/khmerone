import type { Metadata, Viewport } from "next";
import { Kantumruy_Pro } from "next/font/google";
import "./globals.css";

const kantumruy = Kantumruy_Pro({ subsets: ["khmer", "latin"], display: "swap", variable: "--font-kantumruy" });

export const metadata: Metadata = {
  metadataBase: new URL("https://khmerone.com"),
  title: "KhmerOne — Learning, connected",
  description: "Discover bilingual learning apps for Cambodian students, teachers, families and lifelong learners.",
  applicationName: "KhmerOne",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/favicon.svg" },
  openGraph: { type: "website", title: "KhmerOne — Learning, connected", description: "One starting point for Cambodian learning apps.", url: "https://khmerone.com" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0B0F19" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" data-theme="dark"><body className={kantumruy.variable}>{children}</body></html>;
}
