import type { Metadata } from 'next';
import { CommunitySafety } from '@/components/community-safety/CommunitySafety';
import '../public-services/services.css';
import './safety.css';

export const metadata: Metadata = {
  title: 'Defence & Community Safety | Khmer One',
  description: 'Khmer and English civilian guides to mine awareness, household emergency planning, official defence information and support referrals.',
  alternates: { canonical: '/community-safety' },
};
export default function Page() { return <CommunitySafety />; }
