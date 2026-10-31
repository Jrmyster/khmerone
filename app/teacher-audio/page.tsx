import type { Metadata } from "next";
import { TeacherAudioMaker } from "@/components/TeacherAudioMaker";
import "./audio.css";

export const metadata: Metadata = {
  title: "Khmer Teacher Audio Maker | Khmer One",
  description: "Turn Khmer classroom text into speech with Sreymom or Piseth. Listen and download your lesson as an MP3.",
  alternates: { canonical: "/teacher-audio" },
};

export default function TeacherAudioPage() { return <TeacherAudioMaker />; }
