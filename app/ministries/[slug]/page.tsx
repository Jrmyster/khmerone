import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Ministries } from '@/components/ministries/Ministries';
import { ministryGuides } from '@/data/ministry-guides';
import '../../public-services/services.css';
import '../ministries.css';

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ lang?: string }> };
async function findGuide({ params }: Props) {
  const { slug } = await params;
  return ministryGuides.find(item => item.slug === slug);
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const guide = await findGuide(props);
  return guide ? { title: guide.title.en + ' | Khmer One', description: guide.benefit.en, alternates: { canonical: '/ministries/' + guide.slug } } : {};
}

export default async function Page(props: Props) {
  const guide = await findGuide(props);
  if (!guide) notFound();
  const { lang } = await props.searchParams;
  return <Ministries key={guide.slug} guide={guide} initialLang={lang === 'en' ? 'en' : 'km'} />;
}
