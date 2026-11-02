'use client';
import { useState } from 'react';
import { download } from '@/lib/learning/browser';
import type { Locale } from '@/types/app';

export function LandChecklist({ lang }: { lang: Locale }) {
  const t = (en: string, km: string) => lang === 'km' ? km : en;
  const [kind, setKind] = useState('land');
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const questions = [
    t('Confirm which local office handles this request.', 'បញ្ជាក់ថាការិយាល័យមូលដ្ឋានណាទទួលសំណើនេះ។'),
    kind === 'land'
      ? t('Ask which existing record, plan or reference the cadastral office needs to identify the land.', 'សួរការិយាល័យសុរិយោដីថាត្រូវការឯកសារ ប្លង់ ឬលេខយោងណាខ្លះដើម្បីកំណត់ទីតាំងដី។')
      : t('Describe the proposed work and ask which drawings, site information and approvals apply.', 'ពិពណ៌នាការងារដែលគ្រោងធ្វើ ហើយសួរអំពីប្លង់ ព័ត៌មានទីតាំង និងការអនុញ្ញាតដែលត្រូវការ។'),
    t('Ask which originals to show, which copies to leave and who can act for an absent applicant.', 'សួរថាត្រូវបង្ហាញឯកសារដើមអ្វីខ្លះ ទុកច្បាប់ចម្លងអ្វីខ្លះ និងអ្នកណាអាចតំណាងអ្នកដាក់ពាក្យបាន។'),
    t('Confirm the official fee, receipt and follow-up date.', 'បញ្ជាក់តម្លៃផ្លូវការ បង្កាន់ដៃ និងកាលបរិច្ឆេទសាកសួរបន្ត។'),
  ];
  return <section className="mg-box mg-fields" id="document-checklist"><h2>{t('Prepare a document checklist', 'ត្រៀមបញ្ជីឯកសារ')}</h2>
    <label>{t('What is your enquiry?', 'តើអ្នកចង់សួរអំពីអ្វី?')}<select value={kind} onChange={e => setKind(e.target.value)}>
      <option value="land">{t('Land records', 'កំណត់ត្រាដីធ្លី')}</option><option value="build">{t('Building or repairs', 'ការសាងសង់ ឬជួសជុល')}</option>
    </select></label><div className="gs-checklist">{questions.map((q, i) => <label key={i}><input type="checkbox" checked={!!checks[kind+i]} onChange={e => setChecks({...checks,[kind+i]:e.target.checked})} />{q}</label>)}</div>
    <button onClick={() => download('visit-checklist.txt', questions.map((q,i) => (checks[kind+i] ? '☑ ' : '☐ ') + q).join('\n'))}>{t('Download checklist', 'ទាញយកបញ្ជីឯកសារ')}</button>
  </section>;
}

export function CvDraft({ lang }: { lang: Locale }) {
  const t = (en: string, km: string) => lang === 'km' ? km : en;
  const [values, setValues] = useState(['','','','']);
  const labels = [t('Role you are applying for','មុខតំណែងដែលចង់ដាក់ពាក្យ'), t('Skills and languages','ជំនាញ និងភាសា'), t('Education and training','ការសិក្សា និងការបណ្តុះបណ្តាល'), t('Experience and an example of your work','បទពិសោធន៍ និងឧទាហរណ៍ការងារ')];
  return <section className="mg-box mg-fields"><h2>{t('Build a CV draft', 'បង្កើតប្រវត្តិរូបសង្ខេប')}</h2><p>{t('Add personal contact details privately after downloading.', 'បន្ថែមព័ត៌មានទំនាក់ទំនងផ្ទាល់ខ្លួនក្រោយពេលទាញយក។')}</p>
    {labels.map((label,i) => <label key={i}>{label}<textarea rows={2} maxLength={1500} value={values[i]} onChange={e => setValues(values.map((v,j) => i===j ? e.target.value : v))} /></label>)}
    <button disabled={!values.some(v => v.trim())} onClick={() => download('cv-' + lang + '.txt', labels.map((label,i) => label + '\n' + values[i]).join('\n\n'))}>{t('Download CV draft', 'ទាញយកប្រវត្តិរូបសង្ខេប')}</button>
  </section>;
}

export function BudgetChart({ lang }: { lang: Locale }) {
  const t = (en: string, km: string) => lang === 'km' ? km : en;
  const [part,setPart] = useState('');
  const [total,setTotal] = useState('');
  const valid = part.trim() !== '' && Number(part) >= 0 && Number(total) > 0 && Number(part) <= Number(total);
  return <section className="mg-box mg-fields"><h2>{t('Visualise a public budget share', 'បង្ហាញចំណែកថវិកាសាធារណៈ')}</h2>
    <p><a href="https://data.mef.gov.kh/datasets/pd_6880bfb23a4a460001a321ef">{t('Open the 2026 expenditure table by ministry and programme', 'បើកតារាងចំណាយឆ្នាំ២០២៦តាមក្រសួង និងកម្មវិធី')}</a></p>
    <p>{t('Pick a programme and its ministry total. Copy both planned amounts in the same unit. The bar shows the programme’s share of that ministry’s budget.', 'ជ្រើសកម្មវិធីមួយ និងចំណាយសរុបរបស់ក្រសួងនោះ។ បញ្ចូលចំនួនគ្រោងទុកទាំងពីរជាឯកតាដូចគ្នា។ របារបង្ហាញចំណែករបស់កម្មវិធីក្នុងថវិកាក្រសួង។')}</p>
    <label>{t('Programme allocation', 'ថវិកាកម្មវិធី')}<input type="number" min="0" step="any" value={part} onChange={e=>setPart(e.target.value)} /></label>
    <label>{t('Ministry allocation', 'ថវិកាសរុបរបស់ក្រសួង')}<input type="number" min="0" step="any" value={total} onChange={e=>setTotal(e.target.value)} /></label>
    {valid && <output><progress aria-label={t('Share of ministry budget','ចំណែកថវិកាក្រសួង')} value={Number(part)} max={Number(total)} /> {(100*Number(part)/Number(total)).toLocaleString(lang,{maximumFractionDigits:2})}%</output>}
  </section>;
}
