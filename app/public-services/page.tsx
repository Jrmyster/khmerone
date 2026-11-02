import type { Metadata } from 'next';
import { GovernmentServicesFinder } from '@/components/government/GovernmentServicesFinder';
import './services.css';
export const metadata: Metadata = { title: 'Government Services Finder | Khmer One', description: 'Khmer and English guides to Cambodian public services: business registration, birth records, training, assistance, driving licences and documents.', alternates: { canonical: '/public-services' } };
export default function Page() { return <GovernmentServicesFinder />; }
