import type { Metadata } from 'next';
import { InspectionGuide } from '@/components/inspection/InspectionGuide';
import '../public-services/services.css';
import './inspection.css';

export const metadata: Metadata = {
  title: 'Inspection & Service Accountability | Khmer One',
  description: 'Khmer and English guidance for documenting public-service concerns, finding official complaint channels and preparing a private printable worksheet.',
  alternates: { canonical: '/inspection' },
};
export default function Page() { return <InspectionGuide />; }
