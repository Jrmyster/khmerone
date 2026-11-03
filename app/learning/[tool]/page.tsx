import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { learningTools } from '@/data/learning';
import { LearningApp } from '@/components/learning/LearningApp';
import '../learning.css';
export async function generateMetadata({ params }: {
    params: Promise<{
        tool: string;
    }>;
}): Promise<Metadata> { const { tool } = await params; const item = learningTools.find(t => t.id === tool); return { title: item ? `${item.title.en} | Khmer One` : 'Learning Studio | Khmer One', description: item?.summary.en, alternates: { canonical: `/learning/${tool}` } }; }
export default async function LearningToolPage({ params }: {
    params: Promise<{
        tool: string;
    }>;
}) { const { tool } = await params; const item = learningTools.find(t => t.id === tool); if (!item)
    notFound(); return <LearningApp tool={item.id}/>; }
