import type { Metadata } from 'next';
import { InteriorGuide } from '@/components/interior/InteriorGuide';
import '../public-services/services.css';

export const metadata: Metadata = {
  title: 'Ministry of Interior Service Guide | Khmer One',
  description: 'Prepare for civil registration, Khmer ID and local One Window services in Khmer or English.',
  alternates: { canonical: '/interior' },
};

export default function Page() {
  return <InteriorGuide />;
}
