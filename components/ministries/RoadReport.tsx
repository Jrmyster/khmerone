'use client';
import { useState } from 'react';
import type { Locale } from '@/types/app';
import { download } from '@/lib/learning/browser';

export function RoadReport({ lang }: { lang: Locale }) {
  const t = (en: string, km: string) => lang === 'km' ? km : en;
  const [road, setRoad] = useState('');
  const [date, setDate] = useState('');
  const [observed, setObserved] = useState('');
  const [channel, setChannel] = useState('mpwt');
  const rural = channel === 'rural';
  const url = rural ? 'https://www.mrd.gov.kh/contact-us-kh/' : 'https://mpwt.gov.kh/en/press/30015';
  const source = rural ? t('Contact Rural Development about the responsible office', 'ទាក់ទងក្រសួងអភិវឌ្ឍន៍ជនបទដើម្បីសួរអំពីការិយាល័យទទួលខុសត្រូវ') : t('Open MPWT Road Care instructions', 'បើកការណែនាំរបស់ក្រសួងអំពីកម្មវិធីថែទាំផ្លូវ');
  const roadLabel = t('Road and nearby public landmark', 'ឈ្មោះផ្លូវ និងទីសម្គាល់សាធារណៈនៅក្បែរ');
  const dateLabel = t('Date observed', 'ថ្ងៃសង្កេតឃើញ');
  const issueLabel = t('Damage observed from a safe place', 'ការខូចខាតដែលបានសង្កេតពីកន្លែងមានសុវត្ថិភាព');
  return <section className="mg-box mg-fields" id="road-report">
    <h2>{t('Prepare a road maintenance report', 'រៀបចំរបាយការណ៍ស្តីពីការថែទាំផ្លូវ')}</h2>
    <p>{t('Save a copy of your observation, then use the official channel to submit it. The draft stays in this tab.', 'រក្សាទុកច្បាប់ចម្លងនៃការសង្កេត រួចប្រើមធ្យោបាយផ្លូវការដើម្បីបញ្ជូន។ សេចក្តីព្រាងស្ថិតនៅក្នុងផ្ទាំងនេះ។')}</p>
    <label>{t('Which channel do you need?', 'តើអ្នកត្រូវការមធ្យោបាយទំនាក់ទំនងណា?')}<select value={channel} onChange={e => setChannel(e.target.value)}>
      <option value="mpwt">{t('Report a damaged road or sign through Road Care', 'រាយការណ៍ផ្លូវ ឬស្លាកដែលខូចតាមកម្មវិធីថែទាំផ្លូវ')}</option>
      <option value="rural">{t('Ask who maintains a rural road', 'សាកសួរអំពីអ្នកទទួលខុសត្រូវថែទាំផ្លូវជនបទ')}</option>
    </select></label>
    <label>{roadLabel}<input value={road} maxLength={180} onChange={e => setRoad(e.target.value)} /></label>
    <label>{dateLabel}<input type="date" value={date} onChange={e => setDate(e.target.value)} /></label>
    <label>{issueLabel}<textarea rows={3} value={observed} maxLength={1200} onChange={e => setObserved(e.target.value)} /></label>
    <button disabled={!road.trim() || !observed.trim() || !date} onClick={() => download('road-observation.txt', [roadLabel, road, dateLabel, date, issueLabel, observed, source, url].join('\n'))}>{t('Save report draft', 'ទាញយកសេចក្តីព្រាងរបាយការណ៍')}</button>
    <a href={url} referrerPolicy="no-referrer">{source} →</a>
  </section>;
}
