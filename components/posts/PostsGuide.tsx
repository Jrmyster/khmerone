'use client';
import { useState } from 'react';
import { postsTopics } from '@/data/posts';
import { ContentReview } from '@/components/shared/ContentReview';

export function PostsGuide() {
  const [lang, setLang] = useState<'km' | 'en'>('km');
  const t = (en: string, km: string) => lang === 'km' ? km : en;

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
        <p className="gs-eyebrow">{t('19 · Ministry of Posts and Telecommunications', '១៩ · ក្រសួងប្រៃសណីយ៍ និងទូរគមនាគមន៍')}</p>
        <h1>{t('Postal and internet services', 'សេវាប្រៃសណីយ៍ និងអ៊ីនធឺណិត')}</h1>
        <p>{t('Find the postcode for a delivery, track a parcel or get help with an internet connection.', 'រកលេខកូដប្រៃសណីយ៍សម្រាប់ផ្ញើបញ្ញើ តាមដានកញ្ចប់ ឬរកជំនួយពេលមានបញ្ហាអ៊ីនធឺណិត។')}</p>
      </div>
      <aside className="gs-route-note">
        <h2>{t('Sending school materials?', 'តើអ្នកកំពុងផ្ញើសម្ភារៈសិក្សាមែនទេ?')}</h2>
        <ol>
          <li><a href="#postcode">{t('Check the school’s postcode', 'ផ្ទៀងផ្ទាត់លេខកូដប្រៃសណីយ៍របស់សាលា')}</a></li>
          <li><a href="#parcel">{t('Follow the shipment after posting', 'តាមដានបញ្ញើក្រោយពេលផ្ញើ')}</a></li>
        </ol>
      </aside>
    </section>
    <section className="gs-finder">
      <div className="gs-section-heading"><h2>{t('Service guides', 'មគ្គុទ្ទេសក៍សេវា')}</h2></div>
      <div className="gs-grid">{postsTopics.map(topic =>
        <article className="gs-card gs-card-body" id={topic.id} key={topic.id}>
          <h3>{topic.title[lang]}</h3>
          <p>{topic.action[lang]}</p>
          <div className="gs-links"><a href={topic.url}>{topic.source[lang]} ↗</a></div>
          <h4>{t('Suggested improvement', 'សំណើកែលម្អ')}</h4>
          <p>{topic.proposal[lang]}</p>
        </article>
      )}</div>
    </section>
    <section className="gs-plan" id="plan-checklist">
      <h2>{t('Internet quote checklist', 'បញ្ជីសំណួរអំពីតម្លៃអ៊ីនធឺណិត')}</h2>
      <p>{t('Use the same questions with each provider. Tick what you have confirmed or take a printed copy.', 'សួរក្រុមហ៊ុននីមួយៗនូវសំណួរដូចគ្នា។ គូសធីកចំណុចដែលបានបញ្ជាក់ ឬបោះពុម្ពបញ្ជីនេះយកទៅជាមួយ។')}</p>
      <div className="gs-checklist">{[
        t('Can the provider connect this home or school?', 'តើក្រុមហ៊ុនអាចតភ្ជាប់សេវាដល់ផ្ទះ ឬសាលានេះបានទេ?'),
        t('What is the total over 12 months, including tax, equipment and installation?', 'តើចំណាយសរុបក្នុងរយៈពេល ១២ ខែមានប៉ុន្មាន បើគិតទាំងពន្ធ ឧបករណ៍ និងថ្លៃដំឡើង?'),
        t('When does the promotional price end, and what will I pay next?', 'តើតម្លៃពិសេសផុតកំណត់ពេលណា ហើយបន្ទាប់មកត្រូវបង់ប៉ុន្មាន?'),
        t('Who handles outages and how do I follow up?', 'តើនរណាទទួលដោះស្រាយបញ្ហាដាច់សេវា ហើយខ្ញុំអាចតាមដានដោយរបៀបណា?'),
      ].map((question, index) => <label key={index}><input type="checkbox" /><span>{question}</span></label>)}</div>
      <div className="gs-plan-actions"><button onClick={() => window.print()}>{t('Print checklist', 'បោះពុម្ពបញ្ជីសំណួរ')}</button></div>
    </section>
    <footer className="gs-footer">
      <p>{t('Independent Khmer One guide. Official sources checked on 31 October 2026.', 'មគ្គុទ្ទេសក៍ឯករាជ្យរបស់ខ្មែរ វ័ន។ បានពិនិត្យប្រភពផ្លូវការនៅថ្ងៃទី៣១ ខែតុលា ឆ្នាំ២០២៦។')}</p>
      <ContentReview lang={lang} />
    </footer>
  </main>;
}
