import type { Metadata } from 'next';
import { ministryDirectory } from '@/data/ministry-guides/directory';
import { Ministries } from '@/components/ministries/Ministries';
import '../public-services/services.css';
import './ministries.css';

export const metadata: Metadata = {
  title: 'Ministry Tools | Khmer One',
  description: 'Khmer and English tools for families, classrooms and communities, organised by Cambodian ministry.',
  alternates: { canonical: '/ministries' },
};

export default async function Page({ searchParams }: { searchParams: Promise<{ lang?: string }> }) {
  const { lang } = await searchParams;
  return <Ministries directory={ministryDirectory} initialLang={lang === 'en' ? 'en' : 'km'} />;
}
