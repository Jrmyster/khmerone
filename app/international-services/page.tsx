import type { Metadata } from 'next';
import { InternationalServices } from '@/components/international/InternationalServices';
import '../public-services/services.css';
import './international.css';

export const metadata: Metadata = {
  title: 'International Services | Khmer One',
  description: 'Khmer and English guides to consular contacts, travel preparation, Cambodia entry services, international scholarships and community cooperation.',
  alternates: { canonical: '/international-services' },
};
export default function Page() { return <InternationalServices />; }
