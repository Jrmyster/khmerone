import type { Metadata } from "next";
import { PhetMathResources } from "@/components/PhetMathResources";
import "./phet-math.css";

export const metadata: Metadata = {
  title: "PhET · Additional Math Resources | Khmer One",
  description: "Explore nine official PhET mathematics simulations with Khmer and English guidance, suggested learning levels, and short activities from arithmetic to calculus. Internet required for external resources.",
  alternates: { canonical: "/phet-math" },
};

export default function PhetMathPage() {
  return <PhetMathResources />;
}
