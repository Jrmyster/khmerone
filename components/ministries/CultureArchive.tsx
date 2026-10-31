'use client';
import { useState, type FormEvent } from 'react';
import type { Locale } from '@/types/app';
import type { CultureEntry, CultureDraft } from '@/lib/ministry-tools/culture';
import { api, download } from '@/lib/learning/browser';
const blank: CultureDraft = {title:'',kind:'oral-history',region:'',credit:'',story:'',url:'',reuse:'view'};
type Receipt = {id:string;managementKey:string};
export function CultureArchive({lang}:{lang:Locale}) {
  const t=(en:string,km:string)=>lang==='km'?km:en;
  const [draft,setDraft]=useState({...blank}), [consent,setConsent]=useState(false), [receipt,setReceipt]=useState<Receipt|null>(null);
  const [sent,setSent]=useState(false), [editor,setEditor]=useState(''), [manage,setManage]=useState('');
  const [publicRows,setPublicRows]=useState<CultureEntry[]>([]), [pending,setPending]=useState<CultureEntry[]>([]);
  const [more,setMore]=useState<string|null>(null), [reviewMore,setReviewMore]=useState<string|null>(null);
  const [busy,setBusy]=useState(false), [notice,setNotice]=useState<'error'|'unavailable'|'conflict'|'sent'|'empty'|'queue'|'withdrawn'|'reviewed'|''>('');
  const kinds = {'oral-history':t('Oral history','ប្រវត្តិផ្ទាល់មាត់'),music:t('Music','តន្ត្រី'),dance:t('Dance','របាំ'),craft:t('Craft','សិប្បកម្ម'),story:t('Regional story','រឿងក្នុងតំបន់')};
  const scope=(v:string)=>v==='classroom' ? t('Classroom reuse with credit','អនុញ្ញាតឱ្យប្រើក្នុងថ្នាក់ដោយផ្តល់កិត្តិយស') : t('Display in this archive only','អនុញ្ញាតតែការបង្ហាញក្នុងបណ្ណសារនេះ');
  async function run(action:()=>Promise<void>) {
    if (busy) return;
    setBusy(true);setNotice('');
    try { await action(); } catch (error) {
      const code = error instanceof Error ? error.cause : undefined;
      setNotice(code === 'archive_unavailable' || code === 'limiter_not_configured' ? 'unavailable' : code === 'archive_state_changed' ? 'conflict' : 'error');
    } finally {setBusy(false);}
  }
  async function load(review:boolean,after:string|null=null) {
    const query=new URLSearchParams();
    if(review)query.set('review','1');
    if(after)query.set('after',after);
    const data=await api<{items:CultureEntry[];next:string|null}>('culture?'+query,undefined,review ? editor : undefined);
    if(review){setPending(v=>after?[...v,...data.items]:data.items);setReviewMore(data.next);}
    else {setPublicRows(v=>after?[...v,...data.items]:data.items);setMore(data.next);}
    if(!data.items.length&&!after)setNotice(review?'queue':'empty');
  }
  function submit(event:FormEvent) {
    event.preventDefault();
    if(!consent||sent)return;
    const r=receipt || {id:crypto.randomUUID(),managementKey:crypto.randomUUID()};
    setReceipt(r);
    void run(async()=>{await api('culture/submit',{...draft,...r,consent});setSent(true);setNotice('sent');});
  }
  async function withdraw(code:string) {
    const [id,managementKey]=code.trim().split('/');
    await api('culture/withdraw',{id,managementKey});
    setPublicRows(rows=>rows.filter(row=>row.id!==id));setPending(rows=>rows.filter(row=>row.id!==id));
    if(receipt?.id===id){setSent(false);setReceipt(null);setConsent(false);}
    setManage('');setNotice('withdrawn');
  }
  function card(row:CultureEntry) {
    return <article className="mg-resource" key={row.id}><h3>{row.title}</h3>
      <p>{row.region} · {kinds[row.kind as keyof typeof kinds]}</p><p className="mg-preserve">{row.story}</p>
      <p>{t('Credit','អ្នកផ្តល់ស្នាដៃ')} · {row.credit}</p><p>{scope(row.reuse)}</p>
      {row.url&&<a href={row.url} rel="noopener noreferrer nofollow">{t('Contributor’s source','ប្រភពរបស់អ្នកផ្តល់ស្នាដៃ')}</a>}</article>;
  }
  return <section className="mg-box mg-fields" id="community-archive">
    <h2>{t('Community contributions','ស្នាដៃពីសហគមន៍')}</h2>
    <button disabled={busy} onClick={()=>run(()=>load(false))}>{t('Read approved contributions','អានស្នាដៃដែលបានអនុម័ត')}</button>
    {publicRows.map(card)}{more&&<button disabled={busy} onClick={()=>run(()=>load(false,more))}>{t('More entries','មើលបន្ថែម')}</button>}
    <details><summary>{t('Offer a story or demonstration','រួមចំណែករឿង ឬការបង្ហាញជំនាញ')}</summary>
      <p>{t('Use wording and credit agreed with the contributor. A site editor checks permission before public display. Save your private withdrawal code. Published copies already downloaded by others cannot be recalled.', 'ប្រើពាក្យពេចន៍ និងឈ្មោះដែលបានឯកភាពជាមួយអ្នកផ្តល់ស្នាដៃ។ អ្នកកែសម្រួលពិនិត្យការអនុញ្ញាតមុនផ្សាយ។ រក្សាលេខកូដដកស្នាដៃជាឯកជន។ ច្បាប់ចម្លងដែលអ្នកដទៃបានទាញយករួច មិនអាចប្រមូលត្រឡប់វិញបានទេ។')}</p>
      <form onSubmit={submit}><fieldset disabled={busy||sent}>
        {([['title',t('Title','ចំណងជើង'),120],['region',t('Province or region','ខេត្ត ឬតំបន់'),100],['credit',t('Public attribution agreed by the contributor','ឈ្មោះផ្តល់កិត្តិយសសម្រាប់បង្ហាញជាសាធារណៈ'),150]] as const).map(([key,label,max])=><label key={key}>{label}<input required maxLength={max} value={draft[key]} onChange={e=>setDraft({...draft,[key]:e.target.value})}/></label>)}
        <label>{t('Tradition','ប្រភេទស្នាដៃ')}<select value={draft.kind} onChange={e=>setDraft({...draft,kind:e.target.value})}>{Object.entries(kinds).map(([key,v])=><option key={key} value={key}>{v}</option>)}</select></label>
        <label>{t('Words approved for public display','អត្ថបទដែលបានអនុញ្ញាតឱ្យបង្ហាញជាសាធារណៈ')}<textarea required maxLength={2500} value={draft.story} onChange={e=>setDraft({...draft,story:e.target.value})}/></label>
        <label>{t('Optional public recording or demonstration link (HTTPS)','តំណសំឡេង ឬវីដេអូសាធារណៈ (HTTPS) អាចទុកទទេ')}<input type="url" pattern="https://.+" maxLength={800} value={draft.url} onChange={e=>setDraft({...draft,url:e.target.value})}/></label>
        <label>{t('Allowed use','របៀបប្រើដែលបានអនុញ្ញាត')}<select value={draft.reuse} onChange={e=>{setConsent(false);setDraft({...draft,reuse:e.target.value});}}><option value="view">{scope('view')}</option><option value="classroom">{scope('classroom')}</option></select></label>
        <label><input required type="checkbox" checked={consent} onChange={e=>setConsent(e.target.checked)}/> {t('I created this contribution or have the creators’ permission for this wording, attribution and use.', 'ខ្ញុំបានបង្កើតស្នាដៃនេះ ឬបានទទួលការអនុញ្ញាតពីម្ចាស់ស្នាដៃចំពោះអត្ថបទ ឈ្មោះ និងការប្រើប្រាស់នេះ។')}</label>
        <button type="submit" disabled={!consent}>{t('Send for review','ផ្ញើឱ្យពិនិត្យ')}</button>
      </fieldset></form>
      <button onClick={()=>download('culture-draft.json',JSON.stringify({entry:draft,permissionConfirmed:consent},null,2),'application/json')}>{t('Save a private draft','ទាញយកសេចក្តីព្រាងឯកជន')}</button>
      {receipt&&<p>{t('Private management code','លេខកូដគ្រប់គ្រងឯកជន')} <code>{receipt.id}/{receipt.managementKey}</code> <button onClick={()=>download('culture-private-code.txt',receipt.id+'/'+receipt.managementKey)}>{t('Save code','រក្សាលេខកូដ')}</button></p>}
    </details>
    <details><summary>{t('Withdraw a contribution','ដកស្នាដៃចេញ')}</summary>
      <label>{t('Private management code','លេខកូដគ្រប់គ្រងឯកជន')}<input type="password" autoComplete="off" value={manage} onChange={e=>setManage(e.target.value)}/></label>
      <button disabled={busy||!manage.trim()} onClick={()=>run(()=>withdraw(manage))}>{t('Withdraw from archive','ដកចេញពីបណ្ណសារ')}</button>
    </details>
    <details><summary>{t('Editor review','ការពិនិត្យរបស់អ្នកកែសម្រួល')}</summary>
      <label>{t('Editor key','កូនសោអ្នកកែសម្រួល')}<input type="password" autoComplete="off" value={editor} onChange={e=>{setEditor(e.target.value);setPending([]);setReviewMore(null);}}/></label>
      <button disabled={busy||!editor} onClick={()=>run(()=>load(true))}>{t('Review pending entries','ពិនិត្យស្នាដៃរង់ចាំ')}</button>
      <p>{t('Confirm the contributor, wording, credit, source and permission before approving.', 'បញ្ជាក់អ្នកផ្តល់ស្នាដៃ អត្ថបទ ឈ្មោះ ប្រភព និងការអនុញ្ញាត មុនអនុម័ត។')}</p>
      {pending.map(row=><div key={row.id}>{card(row)}{(['approve','reject'] as const).map(decision=><button key={decision} disabled={busy} onClick={()=>run(async()=>{await api('culture/moderate',{id:row.id,decision},editor);setPending(v=>v.filter(x=>x.id!==row.id));setNotice('reviewed');})}>{decision==='approve'?t('Approve publication','អនុម័តការផ្សាយ'):t('Reject','បដិសេធ')}</button>)}</div>)}
      {reviewMore&&<button disabled={busy} onClick={()=>run(()=>load(true,reviewMore))}>{t('More pending','មើលស្នាដៃរង់ចាំបន្ថែម')}</button>}
    </details>
    <p role="status">{({unavailable:t('Online archive submissions are unavailable here. You can still save your private draft.', 'នៅទីនេះមិនអាចបញ្ជូនស្នាដៃទៅបណ្ណសារតាមអនឡាញបានទេ។ អ្នកអាចរក្សាសេចក្ដីព្រាងផ្ទាល់ខ្លួនបាន។'),conflict:t('This entry has changed. Reload the archive before continuing.', 'ស្នាដៃនេះបានផ្លាស់ប្ដូរ។ សូមផ្ទុកបណ្ណសារឡើងវិញមុនបន្ត។'),error:t('Could not complete the archive request. Check access or save a private draft to try again.', 'មិនអាចបំពេញសំណើបានទេ។ ពិនិត្យការចូលប្រើ ឬរក្សាសេចក្តីព្រាងដើម្បីសាកពេលក្រោយ។'),sent:t('Received for editorial review. Keep your withdrawal code.','បានទទួលសម្រាប់ពិនិត្យ។ រក្សាលេខកូដដកស្នាដៃ។'),empty:t('No approved contributions yet.','មិនទាន់មានស្នាដៃដែលបានអនុម័តទេ។'),queue:t('No entries awaiting review.','មិនមានស្នាដៃរង់ចាំការពិនិត្យទេ។'),reviewed:t('Review saved.','បានរក្សាការពិនិត្យ។'),withdrawn:t('Contribution withdrawn.','បានដកស្នាដៃចេញ។'),'':''})[notice]}</p>
  </section>;
}
