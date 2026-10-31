'use client';
import { useEffect, useState } from 'react';
import { ArrowUpRight, ShieldCheck, TriangleAlert } from 'lucide-react';
import { ContentReview } from '@/components/shared/ContentReview';
import { mineSafety, safetyChecked, safetyChecklist, safetyNotice, safetyPlanText, safetySources, safetyTopics, type SafetyLocale } from '@/data/communitySafety';

export function CommunitySafety() {
  const [locale, setLocale] = useState<SafetyLocale>('km');
  const [large, setLarge] = useState(false);
  const [checked, setChecked] = useState<number[]>([]);
  const tr = (en: string, km: string) => locale === 'km' ? km : en;
  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => { document.documentElement.lang = previous; };
  }, [locale]);

  function download() {
    const url = URL.createObjectURL(new Blob(['\uFEFF' + safetyPlanText(locale, checked)], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = `khmer-one-household-safety-${locale}.txt`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return <main className={`gs-shell cs-shell${large ? ' gs-large' : ''}`} lang={locale}>
    <a className="gs-skip" href="#cs-topics">{tr('Skip to guides', 'រំលងទៅមគ្គុទ្ទេសក៍')}</a>
    <header className="gs-top">
      <a className="gs-brand" href="/">KHMER ONE <span>{tr('Defence & community safety', 'ការពារជាតិ និងសុវត្ថិភាពសហគមន៍')}</span></a>
      <div className="gs-controls">
        <button type="button" aria-pressed={large} onClick={() => setLarge(!large)}>A+ {tr('Larger text', 'អក្សរធំ')}</button>
        <div role="group" aria-label={tr('Language', 'ភាសា')}>
          <button type="button" lang="km" aria-pressed={locale === 'km'} onClick={() => setLocale('km')}>ខ្មែរ</button>
          <button type="button" lang="en" aria-pressed={locale === 'en'} onClick={() => setLocale('en')}>English</button>
        </div>
      </div>
    </header>
    <section className="gs-hero" aria-labelledby="cs-title">
      <div><p className="gs-eyebrow">{tr('NATIONAL DEFENCE · CIVILIAN PREPAREDNESS', 'ការពារជាតិ · ការត្រៀមខ្លួនរបស់ប្រជាពលរដ្ឋ')}</p>
        <h1 id="cs-title">{tr('Safer families. Stronger communities.', 'គ្រួសារមានសុវត្ថិភាព។ សហគមន៍រឹងមាំ។')}</h1>
        <p>{tr('Learn protective habits, prepare with your household and find reliable public information.', 'រៀនទម្លាប់ការពារ ត្រៀមខ្លួនជាមួយគ្រួសារ និងស្វែងរកព័ត៌មានសាធារណៈដែលអាចទុកចិត្តបាន។')}</p>
        <a className="gs-primary" href="#cs-plan">{tr('Prepare a household checklist', 'ត្រៀមបញ្ជីសម្រាប់គ្រួសារ')} ↓</a>
      </div>
      <aside className="gs-route-note"><ShieldCheck size={38} aria-hidden="true" /><h2>{tr('Learn. Prepare. Help each other.', 'រៀន។ ត្រៀមខ្លួន។ ជួយគ្នា។')}</h2>
        <ul><li>{tr('Mine-risk awareness', 'ការយល់ដឹងអំពីហានិភ័យមីន')}</li><li>{tr('Household readiness', 'ការត្រៀមខ្លួនរបស់គ្រួសារ')}</li><li>{tr('Trusted information and support', 'ព័ត៌មាន និងជំនួយដែលទុកចិត្តបាន')}</li></ul>
      </aside>
    </section>
    <p className="gs-independent">{safetyNotice[locale]}</p>
    <section className="cs-alert" aria-labelledby="cs-alert-title">
      <TriangleAlert size={28} aria-hidden="true" /><div><h2 id="cs-alert-title">{tr('Suspect a mine or unexploded object?', 'សង្ស័យថាមានមីន ឬវត្ថុមិនទាន់ផ្ទុះ?')}</h2>
        <ul>{mineSafety.map((item, i) => <li key={i}>{item[locale]}</li>)}</ul>
        <a href={safetySources.mines.url} target="_blank" rel="noopener noreferrer">{tr('Read the government safety message', 'អានសារសុវត្ថិភាពរដ្ឋាភិបាល')} ↗</a>
      </div>
    </section>
    <section id="cs-topics" className="gs-finder" aria-labelledby="cs-topics-title">
      <div className="gs-section-heading"><h2 id="cs-topics-title">{tr('Four ways to prepare', 'វិធីត្រៀមខ្លួនបួនយ៉ាង')}</h2><p>{tr('For families, schools and community helpers', 'សម្រាប់គ្រួសារ សាលារៀន និងអ្នកជួយសហគមន៍')}</p></div>
      <div className="gs-grid">{safetyTopics.map((topic, index) => <article className="gs-card cs-card" id={`topic-${topic.id}`} key={topic.id}>
        <p className="gs-eyebrow">0{index + 1}</p><h3>{topic.title[locale]}</h3><p>{topic.summary[locale]}</p>
        <ul>{topic.steps.map((step, i) => <li key={i}>{step[locale]}</li>)}</ul>
        <div className="cs-benefit"><h4>{tr('How this helps', 'អត្ថប្រយោជន៍')}</h4><p>{topic.benefit[locale]}</p></div>
        <div className="gs-links">{topic.sources.map(source => <a key={source.url} href={source.url} target="_blank" rel="noopener noreferrer"><span>{source.label[locale]}</span><ArrowUpRight size={18} aria-hidden="true" /><span className="gs-sr-only">{tr('Opens in a new tab', 'បើកក្នុងផ្ទាំងថ្មី')}</span></a>)}</div>
        {topic.id === 'support' && <a className="gs-primary" href="/social-support">{tr('Open support directory', 'បើកបញ្ជីសេវាជំនួយ')}</a>}
      </article>)}</div>
    </section>
    <section className="gs-plan" id="cs-plan" aria-labelledby="cs-plan-title">
      <div className="gs-section-heading"><h2 id="cs-plan-title">{tr('Our household readiness checklist', 'បញ្ជីត្រៀមខ្លួនរបស់គ្រួសារយើង')}</h2><button type="button" onClick={() => setChecked([])} disabled={!checked.length}>{tr('Reset ticks', 'សម្អាតសញ្ញាធីក')}</button></div>
      <p>{tr('Discuss each item together. Ticks track your preparation; they do not certify that a place or situation is safe.', 'ពិភាក្សាចំណុចនីមួយៗរួមគ្នា។ សញ្ញាធីកតាមដានការត្រៀមខ្លួន មិនបញ្ជាក់ថាទីកន្លែង ឬស្ថានភាពមានសុវត្ថិភាពទេ។')}</p>
      <div className="gs-checklist">{safetyChecklist.map((item, i) => <label key={i}><input type="checkbox" checked={checked.includes(i)} onChange={event => setChecked(values => event.target.checked ? [...values, i] : values.filter(value => value !== i))} /><span>{item[locale]}</span></label>)}</div>
      <p className="gs-progress" role="status">{checked.length}/{safetyChecklist.length} {tr('items discussed', 'ចំណុចបានពិភាក្សា')}</p>
      <div className="gs-plan-actions"><button type="button" className="gs-primary" onClick={() => window.print()}>{tr('Print checklist', 'បោះពុម្ពបញ្ជី')}</button><button type="button" onClick={download}>{tr('Download text guide', 'ទាញយកមគ្គុទ្ទេសក៍អត្ថបទ')}</button></div>
      <p className="gs-small">{tr('Ticks reset when you reload. No names, contacts or locations are collected here. Write your private plan on the printed copy. Downloaded text can be read offline; external links require internet.', 'សញ្ញាធីកកំណត់ឡើងវិញពេលផ្ទុកទំព័រឡើងវិញ។ មិនប្រមូលឈ្មោះ ទំនាក់ទំនង ឬទីតាំងនៅទីនេះទេ។ សរសេរផែនការឯកជនលើច្បាប់បោះពុម្ព។ អត្ថបទទាញយកអាចអានក្រៅបណ្ដាញ តែតំណខាងក្រៅត្រូវការអ៊ីនធឺណិត។')}</p>
      <div className="cs-print-guide"><h3>{tr('Mine and unexploded-ordnance awareness', 'ការយល់ដឹងអំពីមីន និងគ្រាប់មិនទាន់ផ្ទុះ')}</h3><ul>{mineSafety.map((item, i) => <li key={i}>{item[locale]}</li>)}</ul>
        <p>{tr('Meeting places: ____________________', 'កន្លែងជួប៖ ____________________')}</p><p>{tr('Family / local authority contacts: ____________________', 'ទំនាក់ទំនងគ្រួសារ / អាជ្ញាធរមូលដ្ឋាន៖ ____________________')}</p><p>{tr('Assistance arrangements: ____________________', 'ការរៀបចំជំនួយ៖ ____________________')}</p>
        <p>{safetyNotice[locale]}</p>{Object.values(safetySources).map(source => <p key={source.url}>{source.label[locale]}: {source.url}</p>)}
      </div>
      <p className="gs-small">{tr('Sources checked', 'បានពិនិត្យប្រភព')}: {safetyChecked}. {tr('Khmer translation has not been reviewed by a teacher or safety specialist.', 'ការបកប្រែខ្មែរមិនទាន់បានពិនិត្យដោយគ្រូ ឬអ្នកជំនាញសុវត្ថិភាព។')}</p>
    </section>
    <section className="gs-directory"><div><h2>{tr('Looking for another public service?', 'កំពុងរកសេវាសាធារណៈផ្សេងទៀត?')}</h2><p>{tr('Find the responsible institution and prepare your next step.', 'ស្វែងរកស្ថាប័នទទួលបន្ទុក និងត្រៀមជំហានបន្ទាប់។')}</p></div><a href="/public-services">{tr('Government Services Finder', 'មគ្គុទ្ទេសក៍សេវារដ្ឋាភិបាល')} →</a></section>
    <footer className="gs-footer"><p>{tr('Use Feedback for website corrections only. It is not monitored for emergencies; do not send incident locations or private case details.', 'ប្រើមតិកែលម្អសម្រាប់កែគេហទំព័រប៉ុណ្ណោះ។ វាមិនត្រូវបានត្រួតពិនិត្យសម្រាប់អាសន្នទេ។ កុំផ្ញើទីតាំងហេតុការណ៍ ឬព័ត៌មានករណីឯកជន។')}</p><ContentReview lang={locale} /></footer>
  </main>;
}
