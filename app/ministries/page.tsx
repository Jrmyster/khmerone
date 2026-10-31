import type { Metadata } from 'next';
import { ministryGuides } from '@/data/ministry-guides';
import { Ministries } from '@/components/ministries/Ministries';
import '../public-services/services.css';
import './ministries.css';

export const metadata: Metadata = {
  title: 'Ministry guides | Khmer One',
  description: 'Khmer and English tools for families, classrooms and communities, organised by Cambodian ministry.',
  alternates: { canonical: '/ministries' },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  const directory = ministryGuides.map(({ n, slug, title, ministry, benefit }) => ({ n, slug, title, ministry, benefit }));
  return <Ministries directory={directory} initialLang={lang === 'en' ? 'en' : 'km'} />;
}
