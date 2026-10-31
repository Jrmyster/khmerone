'use client';

import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Check, ClipboardList, HeartHandshake, Phone, Search, Volume2, X } from 'lucide-react';
import { ContentReview } from '@/components/shared/ContentReview';
import { supportCategories, supportServices, visitChecklist, filterSupportServices, visitPlanText, type SupportCategory, type SupportLocale } from '@/data/socialSupport';

export function SocialSupportNavigator() {
  const [locale, setLocale] = useState<SupportLocale>('km');
  const [category, setCategory] = useState<SupportCategory | 'all'>('all');
  const [query, setQuery] = useState('');
  const [large, setLarge] = useState(false);
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState<number[]>([]);
  const [status, setStatus] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const planHeading = useRef<HTMLHeadingElement>(null);
  const tr = (en: string, km: string) => locale === 'km' ? km : en;
  const results = filterSupportServices(query, category);
  const service = supportServices.find(item => item.id === selected);
  const topic = supportCategories.find(item => item.id === category);

  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => { document.documentElement.lang = previous; };
  }, [locale]);
  useEffect(() => { if (selected) planHeading.current?.focus(); }, [selected]);
  useEffect(() => () => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); }, []);

  function stopReading() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }
  function changeLanguage(next: SupportLocale) { stopReading(); setLocale(next); setStatus(''); }
  function readIntro() {
    if (speaking) { stopReading(); return; }
    if (!('speechSynthesis' in window)) { setStatus(tr('Read-aloud is unavailable on this device. All guidance is also written below.', 'ឧបករណ៍នេះមិនមានមុខងារអានឮទេ។ ការណែនាំទាំងអស់មានជាអត្ថបទខាងក្រោម។')); return; }
    const voice = window.speechSynthesis.getVoices().find(item => item.lang.toLowerCase().startsWith(locale));
    if (!voice) { setStatus(tr('No matching voice is installed. You can read the guidance or print a visit plan.', 'មិនមានសំឡេងសម្រាប់ភាសានេះលើឧបករណ៍ទេ។ អ្នកអាចអានការណែនាំ ឬបោះពុម្ពផែនការទៅជួប។')); return; }
    const text = tr('Find a starting point for support. Choose a topic, contact a provider, then prepare for your visit. Khmer One is an independent guide. Confirm services and costs before travelling.', 'ស្វែងរកកន្លែងចាប់ផ្តើមទទួលជំនួយ។ ជ្រើសប្រធានបទ ទាក់ទងអ្នកផ្តល់សេវា ហើយត្រៀមសម្រាប់ទៅជួប។ ខ្មែរ វ័ន ជាមគ្គុទ្ទេសក៍ឯករាជ្យ។ សូមបញ្ជាក់សេវា និងថ្លៃសេវា មុនធ្វើដំណើរ។');
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice; utterance.lang = voice.lang; utterance.rate = .85;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => { setSpeaking(false); setStatus(tr('Audio could not play. Please use the written guidance.', 'មិនអាចចាក់សំឡេងបានទេ។ សូមអានការណែនាំជាអត្ថបទ។')); };
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance); setSpeaking(true); setStatus('');
  }
  function downloadPlan() {
    if (!service) return;
    const url = URL.createObjectURL(new Blob(['\uFEFF' + visitPlanText(service, locale)], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a'); link.href = url; link.download = `khmer-one-${service.id}-${locale}-visit-plan.txt`; link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function reset() { setCategory('all'); setQuery(''); }

  return <main className={`ss-shell${large ? ' ss-large' : ''}`} lang={locale}>
    <a className="ss-skip" href="#ss-results">{tr('Skip to services', 'រំលងទៅសេវា')}</a>
    <header className="ss-top"><a href="/" className="ss-wordmark">KHMER ONE <span>/ {tr('Community care', 'ការគាំទ្រសហគមន៍')}</span></a><div className="ss-settings"><button type="button" aria-pressed={large} onClick={() => setLarge(!large)}>A+ <span>{tr('Larger text', 'អក្សរធំ')}</span></button><div role="group" aria-label={tr('Language', 'ភាសា')}><button type="button" lang="km" aria-pressed={locale === 'km'} onClick={() => changeLanguage('km')}>ខ្មែរ</button><button type="button" lang="en" aria-pressed={locale === 'en'} onClick={() => changeLanguage('en')}>English</button></div></div></header>
    <section className="ss-hero" aria-labelledby="ss-title"><div><p className="ss-eyebrow">{tr('SOCIAL AFFAIRS · VETERANS · YOUTH', 'សង្គមកិច្ច · អតីតយុទ្ធជន · យុវជន')}</p><h1 id="ss-title">{tr('A starting point for support.', 'កន្លែងចាប់ផ្តើមស្វែងរកជំនួយ។')}</h1><p className="ss-intro">{tr('Find people and organisations to contact. Understand your next step. Prepare for a visit with confidence.', 'ស្វែងរកមនុស្ស និងស្ថាប័នដែលអាចទាក់ទងបាន។ ស្វែងយល់ជំហានបន្ទាប់ និងត្រៀមខ្លួនមុនទៅជួប។')}</p><div className="ss-hero-actions"><a href="#ss-topics" className="ss-primary">{tr('Find support', 'ស្វែងរកជំនួយ')} ↓</a><button type="button" onClick={readIntro} aria-pressed={speaking}><Volume2 size={18} aria-hidden="true" />{speaking ? tr('Stop reading', 'បញ្ឈប់ការអាន') : tr('Listen to introduction', 'ស្តាប់សេចក្តីណែនាំ')}</button></div><p className="ss-status" role="status">{status}</p></div><aside className="ss-steps"><HeartHandshake size={38} strokeWidth={1.4} aria-hidden="true" /><h2>{tr('One step at a time', 'ម្តងមួយជំហាន')}</h2><ol><li>{tr('Choose the support you need.', 'ជ្រើសជំនួយដែលអ្នកត្រូវការ។')}</li><li>{tr('Contact the provider first.', 'ទាក់ទងអ្នកផ្តល់សេវាជាមុន។')}</li><li>{tr('Prepare your visit checklist.', 'ត្រៀមបញ្ជីសម្រាប់ទៅជួប។')}</li></ol><p>{tr('No account or personal documents needed here.', 'មិនត្រូវការគណនី ឬឯកសារផ្ទាល់ខ្លួននៅទីនេះទេ។')}</p></aside></section>
    <div className="ss-boundary"><strong>{tr('An independent Khmer One guide', 'មគ្គុទ្ទេសក៍ឯករាជ្យរបស់ខ្មែរ វ័ន')}</strong><p>{tr('We are not a government office and do not approve benefits or submit applications. Sources were checked on 31 October 2026; availability, fees and eligibility must be confirmed with each provider.', 'យើងមិនមែនជាការិយាល័យរដ្ឋាភិបាល ហើយមិនអនុម័តជំនួយ ឬដាក់ពាក្យស្នើសុំទេ។ ប្រភពបានពិនិត្យថ្ងៃទី ៣១ តុលា ២០២៦។ សូមបញ្ជាក់សេវា ថ្លៃសេវា និងលក្ខខណ្ឌជាមួយអ្នកផ្តល់សេវានីមួយៗ។')}</p></div>
    <section id="ss-topics" className="ss-finder" aria-labelledby="ss-find-title"><h2 id="ss-find-title">{tr('What kind of support?', 'តើត្រូវការជំនួយប្រភេទណា?')}</h2><div className="ss-topics" role="group" aria-label={tr('Support topic', 'ប្រធានបទជំនួយ')}><button type="button" aria-pressed={category === 'all'} onClick={() => setCategory('all')}>{tr('All support', 'ជំនួយទាំងអស់')}</button>{supportCategories.map(item => <button type="button" key={item.id} aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.label[locale]}</button>)}</div><label className="ss-search-label" htmlFor="ss-search">{tr('Search in Khmer or English', 'ស្វែងរកជាភាសាខ្មែរ ឬអង់គ្លេស')}</label><div className="ss-search"><Search size={20} aria-hidden="true" /><input id="ss-search" type="search" value={query} autoComplete="off" maxLength={150} onChange={event => setQuery(event.target.value)} placeholder={tr('Try IDPoor, rehabilitation, older people…', 'សាកល្បង IDPoor ស្តារនីតិសម្បទា មនុស្សចាស់…')} /></div>{topic && <p className="ss-guidance">{topic.guide[locale]}</p>}</section>
    <section id="ss-results" className="ss-results" aria-labelledby="ss-results-title"><div className="ss-section-heading"><h2 id="ss-results-title">{tr('Places to start', 'កន្លែងចាប់ផ្តើម')}</h2><p role="status" aria-live="polite">{results.length} {tr('resources', 'ធនធាន')}</p></div><div className="ss-grid">{results.map(item => <article className="ss-card" id={`service-${item.id}`} key={item.id}><span className="ss-kind">{item.kind === 'government' ? tr('Government information', 'ព័ត៌មានរដ្ឋាភិបាល') : tr('Non-government organisation', 'អង្គការមិនមែនរដ្ឋាភិបាល')}</span><h3>{item.name[locale]}</h3><p>{item.description[locale]}</p><p className="ss-reach">{item.reach[locale]}</p><div className="ss-next"><strong>{tr('Your next step', 'ជំហានបន្ទាប់របស់អ្នក')}</strong><p>{item.nextStep[locale]}</p></div><div className="ss-card-actions"><a href={item.url} target="_blank" rel="noopener noreferrer" aria-label={`${tr('Visit website', 'ទៅគេហទំព័រ')} · ${item.name[locale]} · ${tr('new tab', 'ផ្ទាំងថ្មី')}`}>{tr('Visit website', 'ទៅគេហទំព័រ')}<ArrowUpRight size={17} aria-hidden="true" /></a>{item.phone && <a href={`tel:${item.phone}`} aria-label={`${tr('Call', 'ហៅ')} ${item.name[locale]} ${item.phoneLabel}`}><Phone size={16} aria-hidden="true" />{item.phoneLabel}</a>}</div><button type="button" className="ss-plan-button" aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setChecked([]); }}><ClipboardList size={17} aria-hidden="true" />{tr('Prepare a visit', 'ត្រៀមទៅជួប')}</button><p className="ss-source"><a href={item.source} target="_blank" rel="noopener noreferrer">{tr('Provider source', 'ប្រភពពីអ្នកផ្តល់សេវា')} ↗</a> · {tr('Checked', 'បានពិនិត្យ')} {item.checked}</p></article>)}</div>{results.length === 0 && <div className="ss-empty"><h3>{tr('No matching resources', 'រកមិនឃើញធនធានត្រូវគ្នា')}</h3><p>{tr('Try a shorter search or choose a different topic. This is a starter directory, not a complete list of services.', 'សាកស្វែងរកដោយពាក្យខ្លី ឬជ្រើសប្រធានបទផ្សេង។ នេះជាបញ្ជីចាប់ផ្តើម មិនមែនសេវាទាំងអស់ទេ។')}</p><button type="button" onClick={reset}>{tr('Show all resources', 'បង្ហាញធនធានទាំងអស់')}</button></div>}</section>
    {service && <section className="ss-plan" aria-labelledby="ss-plan-title"><div className="ss-section-heading"><h2 ref={planHeading} tabIndex={-1} id="ss-plan-title">{tr('Your visit plan', 'ផែនការទៅជួបរបស់អ្នក')}</h2><button type="button" aria-label={tr('Close visit plan', 'បិទផែនការទៅជួប')} onClick={() => { setSelected(''); setChecked([]); document.getElementById(`service-${service.id}`)?.querySelector('button')?.focus(); }}><X size={20} /></button></div><h3>{service.name[locale]}</h3><p>{service.nextStep[locale]}</p><p className="ss-print-contact">{service.phoneLabel} · {service.url}</p><p>{tr('Preparation suggestions, not official document requirements. Ask the provider what applies to you.', 'នេះជាយោបល់សម្រាប់ត្រៀមខ្លួន មិនមែនបញ្ជីឯកសារផ្លូវការទេ។ សួរអ្នកផ្តល់សេវាថាអ្វីខ្លះអនុវត្តចំពោះអ្នក។')}</p><div className="ss-checklist">{visitChecklist.map((item, index) => <label key={index}><input type="checkbox" checked={checked.includes(index)} onChange={event => setChecked(previous => event.target.checked ? [...previous, index] : previous.filter(value => value !== index))} /><span>{item[locale]}</span></label>)}</div><p className="ss-progress" role="status"><Check size={17} aria-hidden="true" />{checked.length} / {visitChecklist.length} {tr('preparation steps checked', 'ជំហានត្រៀមបានធីក')}</p><div className="ss-plan-actions"><button type="button" className="ss-primary" onClick={() => window.print()}>{tr('Print visit plan', 'បោះពុម្ពផែនការ')}</button><button type="button" onClick={downloadPlan}>{tr('Download text plan', 'ទាញយកផែនការអត្ថបទ')}</button></div><p className="ss-small">{tr('Your choices stay in this open page and reset when it reloads. Download a plan to keep the guidance offline; external services require a connection. No documents are uploaded.', 'ជម្រើសរបស់អ្នកនៅតែក្នុងទំព័រដែលបើកនេះ ហើយកំណត់ឡើងវិញពេលផ្ទុកទំព័រឡើងវិញ។ ទាញយកផែនការដើម្បីអានក្រៅបណ្ដាញ។ សេវាខាងក្រៅត្រូវការអ៊ីនធឺណិត។ មិនមានការបង្ហោះឯកសារទេ។')}</p><p className="ss-small">{tr('Source checked', 'បានពិនិត្យប្រភព')} {service.checked} · {tr('Confirm current details before travelling.', 'បញ្ជាក់ព័ត៌មានបច្ចុប្បន្នមុនធ្វើដំណើរ។')}</p></section>}
    <aside className="ss-help"><div><h2>{tr('A young person needs someone to talk to?', 'យុវជនត្រូវការនរណាម្នាក់ដើម្បីនិយាយជាមួយ?')}</h2><p>{tr('Child Helpline Cambodia lists free 24-hour counselling on 1280. For immediate danger, seek urgent local help; this directory is not monitored.', 'ខ្សែទូរសព្ទជំនួយកុមារកម្ពុជាផ្តល់ការប្រឹក្សាឥតគិតថ្លៃ ២៤ ម៉ោង តាមលេខ 1280។ បើមានគ្រោះថ្នាក់ភ្លាមៗ ស្វែងរកជំនួយបន្ទាន់ក្នុងតំបន់។ បញ្ជីនេះមិនមានអ្នកតាមដានសំណើបន្ទាន់ទេ។')}</p></div><a href="tel:1280"><Phone size={20} aria-hidden="true" />1280</a></aside>
    <footer className="ss-footer"><p>{tr('Found an outdated link? Use Feedback in the top navigation. Report the service name and the correction only; leave out personal circumstances, identity documents and children’s names.', 'រកឃើញតំណហួសសម័យ? ប្រើប៊ូតុងមតិកែលម្អនៅខាងលើ។ ផ្ញើតែឈ្មោះសេវា និងចំណុចកែតម្រូវ។ កុំផ្ញើស្ថានភាពផ្ទាល់ខ្លួន ឯកសារអត្តសញ្ញាណ ឬឈ្មោះកុមារ។')}</p><ContentReview lang={locale} /></footer>
  </main>;
}
