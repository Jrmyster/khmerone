import type { Metadata } from 'next';
import { LearningApp } from '@/components/learning/LearningApp';
import './learning.css';
export const metadata: Metadata = { title: 'Learning Studio | Khmer One', description: 'Eight bilingual tools for learning, teaching and connecting Cambodian classrooms.', alternates: { canonical: '/learning' } };
export default function LearningPage() { return <LearningApp />; }
