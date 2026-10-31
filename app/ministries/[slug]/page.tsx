import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Ministries } from '@/components/ministries/Ministries';
import { ministryGuides } from '@/data/ministry-guides';
import { resourcesFor } from '@/data/ministry-guides/resources';
import { verifiedPlaces } from '@/data/ministry-guides/verifiedPlaces';
import '../../public-services/services.css';
import '../ministries.css';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> };
async function findGuide({ params }: Props) {
  const { slug } = await params;
  return ministryGuides.find(item => item.slug === slug);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const guide = await findGuide(props);
  return guide ? { title: guide.title.en + ' | Khmer One', description: guide.benefit.en, ...(guide.n === 4 ? { referrer: 'no-referrer' as const } : {}), alternates: { canonical: '/ministries/' + guide.slug } } : {};
}

export default async function Page(props: Props) {
  const guide = await findGuide(props);
  if (!guide) notFound();
  const { lang } = await props.searchParams;
  return <Ministries key={guide.slug} guide={guide} resources={resourcesFor(guide.n)} places={verifiedPlaces.filter(p => p.n === guide.n)} initialLang={lang === 'en' ? 'en' : 'km'} />;
}
