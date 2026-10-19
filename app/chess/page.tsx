import type { Metadata } from "next";
import { ChessLab } from "@/components/ChessLab";
import "./chess.css";

export const metadata: Metadata = {
  title: "Chess Lab | Khmer One",
  description: "Learn international chess in Khmer and English. Explore an interactive 3D board, practice beginner puzzles, and play the computer or a friend on the same device.",
  alternates: { canonical: "/chess" },
};

export default function ChessPage() { return <ChessLab />; }
