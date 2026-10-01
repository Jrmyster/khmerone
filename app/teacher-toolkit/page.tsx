import type { Metadata } from "next";
import { TeacherToolkit } from "@/components/TeacherToolkit";
import "./toolkit.css";

export const metadata: Metadata = {
  title: "Teacher Toolkit Cambodia | Khmer One",
  description: "Create bilingual lesson plans, worksheets, quizzes, rubrics, and classroom activities. Edit, print, and prepare materials offline.",
  alternates: { canonical: "/teacher-toolkit" },
};
export default function TeacherToolkitPage() { return <TeacherToolkit />; }
