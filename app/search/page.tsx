import type { Metadata } from 'next';
import { SiteSearch } from '@/components/SiteSearch';

export const metadata: Metadata = {
  title: 'Search Khmer One — apps, words and lessons',
  description: 'Search Khmer One in English or Khmer: learning apps, STEM definitions, stories, teaching resources and coding lessons.',
  alternates: { canonical: '/search' },
};
export default function SearchPage() { return <SiteSearch/>; }
