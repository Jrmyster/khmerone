import type { Metadata } from 'next';
import { SocialSupportNavigator } from '@/components/social-support/SocialSupportNavigator';
import './support.css';
export const metadata: Metadata = {
  title: 'Support Services Navigator | Khmer One',
  description: 'Find Cambodian social support, disability and rehabilitation resources, older people’s services, veterans guidance and child and youth support in Khmer and English.',
  alternates: { canonical: '/social-support' },
};
export default function Page() { return <SocialSupportNavigator />; }
