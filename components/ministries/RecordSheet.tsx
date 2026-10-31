'use client';
import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Locale } from '@/types/app';
import { download } from '@/lib/learning/browser';
import { getSheet, maxRows, readSheet, rowResults, validRow, type Row, type SheetKey } from '@/lib/ministry-tools/records';

const resultLabels = {
  market: {en:'Net per kg (riel)', km:'ប្រាក់ក្នុងមួយគីឡូក្រាមក្រោយដកថ្លៃដឹក (រៀល)'},
  solar: {en:'Installed riel/kWp', km:'តម្លៃដំឡើង (រៀល/kWp)'},
  cash: {en:'Cash balance (riel)', km:'សាច់ប្រាក់នៅសល់ (រៀល)'},
  stock: {en:'Units on hand', km:'ចំនួនស្តុកនៅសល់'},
};

export function RecordSheet({ kind, lang }: { kind: SheetKey; lang: Locale }) {
  const sheet = getSheet(kind);
  const empty = () => Object.fromEntries(sheet.fields.map(f => [f.key, f.choices?.[0].value || '']));
  const [rows,setRows] = useState<Row[]>([]);
  const [draft,setDraft] = useState<Row>(empty);
  const [edit,setEdit] = useState<number | null>(null);
  const [message,setMessage] = useState<'invalid' | 'loaded' | ''>('');
  const t = (en:string, km:string) => lang === 'km' ? km : en;
  const numbers = rowResults(kind,rows);
  const resultLabel = resultLabels[kind as keyof typeof resultLabels]?.[lang];
  const clear = () => {setDraft(empty()); setEdit(null); setMessage('');};
  function save(event: FormEvent) {
    event.preventDefault();
    const entry = Object.fromEntries(sheet.fields.map(f=>[f.key,draft[f.key].trim()]));
    if (!validRow(kind,entry) || (rows.length >= maxRows && edit === null)) {setMessage('invalid');return;}
    const next = edit === null ? [...rows, entry] : rows.map((r,i) => edit === i ? entry : r);
    setRows(next.sort((a,b) => a.date.localeCompare(b.date)));
    clear();
  }
  async function load(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      if (file.size > 2000000) throw new Error();
      const loaded = readSheet(kind, await file.text());
      setRows(loaded.sort((a,b)=>a.date.localeCompare(b.date)));
      clear(); setMessage('loaded');
    } catch { setMessage('invalid'); }
  }
  return <section className="mg-box mg-fields" id={'sheet-' + kind}>
    <h2>{sheet.title[lang]}</h2><p>{sheet.description[lang]}</p>
    <p className="gs-small">{t('Rows stay in this tab. Save the file to keep your work or share it with a teammate. Reopen a saved file in an empty sheet.', 'ទិន្នន័យរក្សាក្នុងផ្ទាំងនេះ។ ទាញយកឯកសារដើម្បីរក្សាទុក ឬចែករំលែកជាមួយក្រុម។ បើកឯកសារដែលបានរក្សាទុកនៅលើសន្លឹកទទេ។')}</p>
    {kind === 'repairs' && <details><summary>{t('School bathroom inspection checklist', 'បញ្ជីត្រួតពិនិត្យបង្គន់សាលា')}</summary><ul>
      <li>{t('Count open, usable stalls and note any blocked or inaccessible entrance.', 'រាប់បន្ទប់ដែលបើកប្រើបាន និងកត់ច្រកចូលដែលមានឧបសគ្គ។')}</li>
      <li>{t('Check water availability at the start and end of the school day. Try the tap and check for soap.', 'ពិនិត្យទឹកនៅពេលចូល និងចេញពីសាលា។ សាកបើករ៉ូប៊ីណេ និងពិនិត្យសាប៊ូ។')}</li>
      <li>{t('Ask the maintenance team to check drainage and record the next inspection date.', 'ស្នើក្រុមថែទាំពិនិត្យប្រព័ន្ធបង្ហូរទឹក និងកត់ថ្ងៃពិនិត្យបន្ទាប់។')}</li>
    </ul></details>}
    <form onSubmit={save}>
      <div className="mg-grid">{sheet.fields.map(f => <label key={f.key}>{f.label[lang]}
        {f.type === 'choice'
          ? <select value={draft[f.key]} onChange={e=>setDraft({...draft,[f.key]:e.target.value})}>{f.choices!.map(c=><option key={c.value} value={c.value}>{c.label[lang]}</option>)}</select>
          : <input type={f.type} required={!f.optional} maxLength={250} min={f.type === 'number' ? 0 : undefined} max={f.type === 'number' ? 1e12 : undefined} step={f.type === 'number' ? 'any' : undefined} value={draft[f.key]} onChange={e=>setDraft({...draft,[f.key]:e.target.value})} />}
      </label>)}</div>
      <div className="mg-actions"><button type="submit" disabled={edit === null && rows.length >= maxRows}>{edit === null ? t('Add entry','បន្ថែមទិន្នន័យ') : t('Save changes','រក្សាទុកការកែប្រែ')}</button>
        {edit !== null && <button type="button" onClick={clear}>{t('Cancel edit','បោះបង់ការកែប្រែ')}</button>}</div>
    </form>
    {rows.length > 0 && <div className="mg-table-scroll" tabIndex={0} role="region" aria-label={sheet.title[lang]}>
      <table><caption>{sheet.title[lang]} · {rows.length}</caption><thead><tr>{sheet.fields.map(f=><th key={f.key}>{f.label[lang]}</th>)}
        {resultLabel && <th>{resultLabel}</th>}<th>{t('Actions','សកម្មភាព')}</th></tr></thead>
        <tbody>{rows.map((r,i)=><tr key={i}>{sheet.fields.map(f=><td key={f.key}>{f.type === 'choice' ? f.choices?.find(c=>c.value===r[f.key])?.label[lang] : r[f.key]}</td>)}
          {resultLabel && <td>{numbers[i]?.toLocaleString(lang,{maximumFractionDigits:2})}</td>}
          <td><button type="button" disabled={edit !== null} onClick={()=>{setDraft({...r}); setEdit(i);}}>{t('Edit','កែប្រែ')}</button>
            <button type="button" disabled={edit !== null} onClick={()=>setRows(rows.filter((_,j)=>j!==i))}>{t('Remove','លុប')}</button></td></tr>)}</tbody>
      </table></div>}
    {kind === 'cleanup' && <output>{t('Total weighed (kg)','ទម្ងន់ដែលបានថ្លឹងសរុប (គីឡូក្រាម)')} · {rows.reduce((v,r)=>v+(r.method==='weighed' ? +r.kg : 0),0).toLocaleString(lang)}</output>}
    {kind === 'repairs' && <output>{t('Open or in progress','ត្រូវដោះស្រាយ ឬកំពុងជួសជុល')} · {rows.filter(r=>r.status!=='checked').length}</output>}
    <div className="mg-actions"><button disabled={!rows.length} onClick={()=>download('khmer-one-' + kind + '.json', JSON.stringify({format:'khmer-one-sheet-v1',sheet:kind,rows},null,2),'application/json')}>{t('Save sheet file','ទាញយកសន្លឹក')}</button>
      {!rows.length && <label>{t('Reopen saved sheet','បើកសន្លឹកដែលបានរក្សាទុក')}<input type="file" accept=".json,application/json" onChange={load}/></label>}</div>
    <p role="status">{message === 'invalid' ? t('Check the values or choose a saved file for this sheet.', 'ពិនិត្យតម្លៃ ឬជ្រើសឯកសារដែលត្រូវនឹងសន្លឹកនេះ។') : message === 'loaded' ? t('Sheet opened.', 'បានបើកសន្លឹក។') : ''}</p>
  </section>;
}
