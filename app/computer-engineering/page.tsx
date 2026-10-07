import type { Metadata } from "next";
import { ComputerEngineeringLab } from "@/components/ComputerEngineeringLab";
import "./engineering.css";

export const metadata: Metadata = {
  title: "Computer Engineering & Code | Khmer One",
  description: "Bilingual Khmer and English digital logic lessons: AND, OR, NOT, NAND, XOR, interactive truth tables, and beginner HTML, CSS, JavaScript, and Python examples.",
  alternates: { canonical: "/computer-engineering" },
};

export default function ComputerEngineeringPage() { return <ComputerEngineeringLab />; }
