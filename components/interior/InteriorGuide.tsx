'use client';
import { useState } from 'react';
import { ContentReview } from '@/components/shared/ContentReview';
import { interiorTopics } from '@/data/interior';

export function InteriorGuide() {
  const [lang, setLang] = useState<'km' | 'en'>('km');
  const t = (en: string, km: string) => lang === 'km' ? km : en;
  const questions = [
    t('Which office or counter will handle my request?', 'តើការិយាល័យ ឬបញ្ជរណាទទួលសំណើរបស់ខ្ញុំ?'),
    t('Which originals or copies should I bring?', 'តើខ្ញុំត្រូវយកឯកសារដើម ឬច្បាប់ចម្លងអ្វីខ្លះ?'),
    t('What are the opening hours and official fee, if any?', 'តើការិយាល័យបើកម៉ោងប៉ុន្មាន ហើយមានតម្លៃផ្លូវការប៉ុន្មាន បើមាន?'),
    t('How can I check progress before returning?', 'តើខ្ញុំអាចសួរអំពីដំណើរការមុនត្រឡប់មកវិញដោយរបៀបណា?'),
  ];
  return <main className="gs-shell" lang={lang}>
    <header className="gs-top">
      <a className="gs-brand" href="/">KHMER ONE</a>
      <div className="gs-controls" role="group" aria-label={t('Language', 'ភាសា')}>
        <button lang="km" aria-pressed={lang === 'km'} onClick={() => setLang('km')}>ខ្មែរ</button>
        <button lang="en" aria-pressed={lang === 'en'} onClick={() => setLang('en')}>English</button>
      </div>
    </header>
    <section className="gs-hero">
      <div>
        <p className="gs-eyebrow">{t('21 · Ministry of Interior', '២១ · ក្រសួងមហាផ្ទៃ')}</p>
        <h1>{t('Plan a local service visit', 'ត្រៀមទៅប្រើសេវារដ្ឋបាលមូលដ្ឋាន')}</h1>
        <p>{t('Find a starting point for a civil record, a Khmer ID card or a local administrative service.', 'ស្វែងរកកន្លែងចាប់ផ្តើមសម្រាប់ឯកសារអត្រានុកូលដ្ឋាន អត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ ឬសេវារដ្ឋបាលមូលដ្ឋាន។')}</p>
        <a className="gs-primary" href="#visit-checklist">{t('Prepare a visit checklist', 'ត្រៀមបញ្ជីសំណួរសម្រាប់ទៅប្រើសេវា')}</a>
      </div>
      <aside className="gs-route-note">
        <h2>{t('Before you travel', 'មុនពេលចេញដំណើរ')}</h2>
        <p>{t('Use the official contact for your service to confirm current requirements. This independent Khmer One guide collects no identity details.', 'សូមទាក់ទងស្ថាប័នផ្លូវការដែលផ្តល់សេវា ដើម្បីបញ្ជាក់តម្រូវការបច្ចុប្បន្ន។ មគ្គុទ្ទេសក៍ឯករាជ្យរបស់ខ្មែរ វ័ននេះមិនប្រមូលព័ត៌មានអត្តសញ្ញាណទេ។')}</p>
      </aside>
    </section>
    <section className="gs-finder">
      <div className="gs-section-heading"><h2>{t('Choose a service', 'ជ្រើសរើសសេវា')}</h2></div>
      <div className="gs-grid">{interiorTopics.map(topic =>
        <article className="gs-card gs-card-body" id={topic.id} key={topic.id}>
          <h3>{topic.title[lang]}</h3>
          <p>{topic.question[lang]}</p>
          <h4>{t('Suggested improvement', 'សំណើកែលម្អ')}</h4>
          <p>{topic.proposal[lang]}</p>
          <div className="gs-links"><a href={topic.url}>{topic.source[lang]} ↗</a></div>
        </article>
      )}</div>
    </section>
    <section className="gs-plan" id="visit-checklist">
      <h2>{t('My local service visit checklist', 'បញ្ជីសំណួរសម្រាប់ទៅប្រើសេវាមូលដ្ឋាន')}</h2>
      <p>{t('Tick each question once you have an answer. You can also print a blank copy and take it to the office.', 'គូសធីកសំណួរនីមួយៗពេលទទួលបានចម្លើយ។ អ្នកក៏អាចបោះពុម្ពបញ្ជីទទេយកទៅការិយាល័យបានដែរ។')}</p>
      <div className="gs-checklist">{questions.map((question, index) =>
        <label key={index}><input type="checkbox" /><span>{question}</span></label>
      )}</div>
      <div className="gs-plan-actions"><button onClick={() => window.print()}>{t('Print checklist', 'បោះពុម្ពបញ្ជីសំណួរ')}</button></div>
    </section>
    <footer className="gs-footer">
      <a href="/inspection">{t('Get help documenting a public service concern', 'មើលរបៀបកត់ត្រាបញ្ហាអំពីសេវាសាធារណៈ')}</a>
      <p>{t('Official sources checked on 31 October 2026.', 'បានពិនិត្យប្រភពផ្លូវការនៅថ្ងៃទី៣១ ខែតុលា ឆ្នាំ២០២៦។')}</p>
      <ContentReview lang={lang} />
    </footer>
  </main>;
}
