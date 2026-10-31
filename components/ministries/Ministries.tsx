'use client';
import { useState } from 'react';
import { ContentReview } from '@/components/shared/ContentReview';
import { AudioMaker } from '@/components/learning/common';
import { download, offlineHtml } from '@/lib/learning/browser';
import type { MinistryGuide } from '@/data/ministry-guides/types';
import type { Locale } from '@/types/app';
import { CalculatorPanel } from './Calculators';
import { LandChecklist, CvDraft, BudgetChart } from './Activity';
import { RoadReport } from './RoadReport';
import { LocalMap } from './LocalMap';
import { RecordSheet } from './RecordSheet';
import { CultureArchive } from './CultureArchive';
import { WeatherPanel } from './WeatherPanel';
import type { SheetKey } from '@/lib/ministry-tools/records';
import type { DirectoryEntry } from '@/data/ministry-guides/directory';
import type { LearningResource } from '@/data/ministry-guides/peopleResources';
import type { VerifiedPlace } from '@/data/ministry-guides/verifiedPlaces';

const recordsByMinistry: Partial<Record<number, SheetKey[]>> = {
  8: ['market', 'season'], 9: ['repairs'], 11: ['cleanup'], 12: ['solar'], 14: ['stock', 'cash'], 15: ['cash'],
};

function CalendarReminder({ lang }: { lang: Locale }) {
  const [day, setDay] = useState('');
  const t = (en: string, km: string) => lang === 'km' ? km : en;
  function save() {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return;
    const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const event = ['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Khmer One//Visit//EN','BEGIN:VEVENT',
      'UID:' + crypto.randomUUID() + '@khmerone', 'DTSTAMP:' + stamp, 'DTSTART;VALUE=DATE:' + day.replaceAll('-', ''),
      'SUMMARY:' + t('Visit reminder', 'រំឭកថ្ងៃណាត់ជួប'), 'BEGIN:VALARM','TRIGGER:-P1D','ACTION:DISPLAY',
      'DESCRIPTION:Visit reminder','END:VALARM','END:VEVENT','END:VCALENDAR',''].join('\r\n');
    download('visit-reminder.ics', event, 'text/calendar;charset=utf-8');
  }
  return <section className="mg-box mg-fields"><h2>{t('Add a visit to your calendar', 'បន្ថែមថ្ងៃណាត់ជួបទៅប្រតិទិន')}</h2>
    <label>{t('Appointment or vaccination date confirmed with your clinic', 'ថ្ងៃណាត់ជួប ឬចាក់វ៉ាក់សាំងដែលបានបញ្ជាក់ជាមួយគ្លីនិក')}<input type="date" value={day} onChange={e => setDay(e.target.value)} /></label>
    <button disabled={!day} onClick={save}>{t('Download calendar reminder', 'ទាញយកឯកសាររំឭកសម្រាប់ប្រតិទិន')}</button>
    <p>{t('Open the file in your calendar and check its reminder settings.', 'បើកឯកសារនៅក្នុងប្រតិទិន រួចពិនិត្យការកំណត់ការរំឭក។')}</p>
  </section>;
}

type Props = { guide?: MinistryGuide; directory?: DirectoryEntry[]; initialLang?: Locale; resources?: LearningResource[]; places?: VerifiedPlace[] };
export function Ministries({ guide, directory = [], initialLang = 'km', resources = [], places = [] }: Props) {
  const [lang, setLang] = useState<Locale>(initialLang);
  const [query, setQuery] = useState('');
  const [notes, setNotes] = useState<Record<number, string>>({});
  const t = (en: string, km: string) => lang === 'km' ? km : en;
  const suffix = lang === 'en' ? '?lang=en' : '';
  const normalized = query.trim().toLowerCase().replace(/[០-៩]/g, d => String(d.charCodeAt(0) - 0x17e0));
  const matches = directory.filter(item => [String(item.n), item.title.en, item.title.km, item.ministry.en, item.ministry.km].join(' ').toLowerCase().includes(normalized));
  function savePack(item: MinistryGuide) {
    const sections = [
      {title: item.ministry[lang], text:item.benefit[lang]},
      {title:t('Steps', 'ជំហាន'), text:item.steps.map((s, i) => (i + 1) + '. ' + s[lang]).join('\n')},
      ...resources.map(r => ({ title: r.title[lang], text: r.detail[lang] + '\n' + r.url })),
      ...places.map(p => ({ title: p.title[lang], text: [p.detail[lang], p.lat + ', ' + p.lon, p.checked, p.url].join('\n') })),
      ...item.prompts.map((p, i) => ({title:p[lang], text:notes[i] || '________________'})),
      {title:t('Sources and tools', 'ប្រភព និងឧបករណ៍'), text:item.links.map(link => link.label[lang] + '\n' + new URL(link.url, location.origin).href).join('\n\n')},
    ];
    download(item.slug + '-' + lang + '.html', offlineHtml(item.title[lang], sections, t('Khmer One independent guide. Sources checked 31 October 2026.', 'មគ្គុទ្ទេសក៍ឯករាជ្យរបស់ខ្មែរ វ័ន។ បានពិនិត្យប្រភពនៅថ្ងៃទី៣១ ខែតុលា ឆ្នាំ២០២៦។')), 'text/html;charset=utf-8');
  }

  return <main className="gs-shell mg-shell" lang={lang}>
    <header className="gs-top">
      <a className="gs-brand" href="/">KHMER ONE <span>{t('Ministry guides', 'មគ្គុទ្ទេសក៍តាមក្រសួង')}</span></a>
      <div className="gs-controls" role="group" aria-label={t('Language', 'ភាសា')}>
        <button lang="km" aria-pressed={lang === 'km'} onClick={() => setLang('km')}>ខ្មែរ</button>
        <button lang="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
      </div>
    </header>
    {guide ? <>
      <div className="mg-intro">
        <a href={'/ministries' + suffix}>← {t('All ministry guides', 'មគ្គុទ្ទេសក៍គ្រប់ក្រសួង')}</a>
        <p className="gs-eyebrow">{guide.n} · {guide.ministry[lang]}</p>
        <h1>{guide.title[lang]}</h1>
        <p className="mg-summary">{guide.benefit[lang]}</p>
        {guide.n === 4 && <a href="/" onClick={e => { e.preventDefault(); window.location.replace('/'); }}>{t('Quick exit to Khmer One home', 'ចាកចេញរហ័សទៅទំព័រដើម')}</a>}
      </div>
      <section className="mg-box"><h2>{t('Where to start', 'ចាប់ផ្តើមពីទីនេះ')}</h2>
        <ol>{guide.steps.map((step, i) => <li key={i}>{step[lang]}</li>)}</ol>
        <details><summary>{t('Listen to these steps', 'ស្តាប់ជំហានទាំងនេះ')}</summary>
          <AudioMaker language={lang} text={guide.steps.map(x => x[lang]).join('\n')} name={guide.slug} />
        </details>
      </section>
      <section className="mg-box"><h2>{t('Sources and tools', 'ប្រភព និងឧបករណ៍')}</h2>
        <div className="gs-links">{guide.links.map(link => <a key={link.url} href={link.url} referrerPolicy="no-referrer">{link.label[lang]} →</a>)}</div>
      </section>
      {[10,12,14,15].includes(guide.n) && <CalculatorPanel n={guide.n} lang={lang} />}
      {resources.length > 0 && <section className="mg-box"><h2>{guide.n === 16 ? t('Plan a visit with a local operator', 'រៀបចំដំណើរជាមួយប្រតិបត្តិករក្នុងមូលដ្ឋាន') : t('Resources you can use', 'ធនធានដែលអ្នកអាចប្រើបាន')}</h2>
        <div className="mg-resource-list">{resources.map(resource => <article key={resource.url + resource.title.en}>
          <h3>{resource.title[lang]}</h3>{resource.detail[lang].split('\n\n').map((part, index) => <p key={index}>{part}</p>)}
          <a href={resource.url} referrerPolicy="no-referrer">{resource.label[lang]} →</a>
        </article>)}</div>
      </section>}
      {[1,9,11].includes(guide.n) && <LocalMap lang={lang} places={places} />}
      {recordsByMinistry[guide.n]?.map(kind => <RecordSheet key={kind} kind={kind} lang={lang} />)}
      {guide.n === 6 && <CultureArchive lang={lang} />}
      {guide.n === 10 && <WeatherPanel lang={lang} />}
      {guide.n === 17 && <RoadReport lang={lang} />}
      {guide.n === 18 && <LandChecklist lang={lang} />}
      {guide.n === 15 && <BudgetChart lang={lang} />}
      {guide.n === 5 && <CvDraft lang={lang} />}
      {guide.n === 2 && <CalendarReminder lang={lang} />}
      <section className="gs-plan mg-fields" id="worksheet">
        <p className="gs-eyebrow">{guide.ministry[lang]}</p><h2>{guide.title[lang]} · {t('Worksheet', 'សន្លឹកកិច្ចការ')}</h2>
        <p>{t('Write here or print a blank copy. Notes stay in this tab and clear on reload. A downloaded guide includes your notes.', 'អ្នកអាចសរសេរនៅទីនេះ ឬបោះពុម្ពសន្លឹកទទេ។ កំណត់ត្រារក្សាទុកក្នុងផ្ទាំងនេះ ហើយនឹងបាត់ពេលផ្ទុកឡើងវិញ។ ឯកសារដែលទាញយកមានកំណត់ត្រារបស់អ្នក។')}</p>
        {guide.prompts.map((prompt, i) => <label key={i}>{prompt[lang]}
          <textarea maxLength={2400} rows={3} value={notes[i] || ''} onChange={e => setNotes({...notes, [i]: e.target.value})} />
          <span className="mg-print-answer">{notes[i]}</span>
        </label>)}
        <div className="mg-actions"><button onClick={() => window.print()}>{t('Print worksheet', 'បោះពុម្ពសន្លឹកកិច្ចការ')}</button>
          <button onClick={() => savePack(guide)}>{t('Save guide for offline reading', 'រក្សាទុកមគ្គុទ្ទេសក៍សម្រាប់អានក្រៅបណ្ដាញ')}</button>
          <button disabled={!Object.values(notes).some(Boolean)} onClick={() => setNotes({})}>{t('Clear notes', 'សម្អាតកំណត់ត្រា')}</button></div>
      </section>
    </> : <>
      <section className="mg-intro"><p className="gs-eyebrow">KHMER ONE</p>
        <h1>{t('Ministry Tools', 'ឧបករណ៍តាមក្រសួង')}</h1>
        <p>{t('Choose a guide to find a service, practise a skill or prepare a community project. Browse by ministry name or number.', 'ជ្រើសរើសមគ្គុទ្ទេសក៍ដើម្បីស្វែងរកសេវា អនុវត្តជំនាញ ឬរៀបចំគម្រោងសហគមន៍។ រកមើលតាមឈ្មោះ ឬលេខក្រសួង។')}</p>
      </section>
      <section aria-label={t('Guide directory', 'បញ្ជីមគ្គុទ្ទេសក៍')}>
        <label className="mg-search-label">{t('Find a ministry by name, number or tool', 'ស្វែងរកក្រសួងតាមឈ្មោះ លេខ ឬឧបករណ៍')}<input className="mg-search" type="search" value={query} onChange={e => setQuery(e.target.value)} /></label>
        <p role="status">{matches.length} / {directory.length}</p>
        <div className="mg-grid">{matches.map(item => <a className="mg-card" key={item.n} href={item.url + (item.url.startsWith('/ministries/') ? suffix : '')}>
          <span className="gs-eyebrow">{item.n} · {item.ministry[lang]}</span><h3>{item.title[lang]}</h3><p>{item.benefit[lang]}</p>
        </a>)}</div>
      </section>
    </>}
    <footer className="gs-footer"><p>{t('Independent Khmer One resource · Sources checked 31 October 2026', 'ធនធានឯករាជ្យរបស់ខ្មែរ វ័ន · បានពិនិត្យប្រភពនៅថ្ងៃទី៣១ ខែតុលា ឆ្នាំ២០២៦')}</p><ContentReview lang={lang} /></footer>
  </main>;
}
