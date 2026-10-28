'use client';
import { useEffect, useState } from 'react';
import { MapPin, Search, ExternalLink, Download, LockKeyhole } from 'lucide-react';
import { api, bytesBase64, download } from '@/lib/learning/browser';
import { provinces, isResource, type Resource } from '@/lib/learning/contracts';
import { Notice, tr, type LangProps } from './common';
const empty: Resource = { title: '', school: '', province: 'Phnom Penh', kind: 'material', subject: '', description: '', url: '', lat: null, lng: null };
export function Exchange({ lang }: LangProps) {
    const [items, setItems] = useState<Resource[]>([]), [pending, setPending] = useState<Resource[]>([]), [province, setProvince] = useState('all'), [kind, setKind] = useState('all'), [search, setSearch] = useState(''), [key, setKey] = useState(''), [editor, setEditor] = useState(false), [draft, setDraft] = useState<Resource>(empty), [busy, setBusy] = useState(false), [loading, setLoading] = useState(true), [error, setError] = useState(''), [message, setMessage] = useState(''), [file, setFile] = useState<File | null>(null), [fileVersion, setFileVersion] = useState(0);
    async function refresh() { setLoading(true); try {
        setItems((await api<{
            items: Resource[];
        }>('resources')).items);
        setError('');
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setLoading(false);
    } }
    useEffect(() => {
        let active=true;
        api<{items:Resource[]}>('resources').then(r=>{if(active)setItems(r.items);}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});
        return ()=>{active=false;};
    }, []);
    async function review() { setBusy(true); setError(''); try {
        setPending((await api<{
            items: Resource[];
        }>('resources?review=1', undefined, key)).items);
        setEditor(true);
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    async function submit() { setBusy(true); setError(''); setMessage(''); try {
        let attachmentId = draft.attachmentId;
        if (file) {
            if (file.size > 2 * 1024 * 1024)
                throw new Error('Choose a file no larger than 2 MB.');
            const r = await api<{
                id: string;
            }>('files', { name: file.name, type: file.type || 'text/plain', data: await bytesBase64(file) }, key);
            attachmentId = r.id;
            setDraft(d => ({ ...d, attachmentId }));
            setFile(null);
            setFileVersion(v => v + 1);
        }
        await api('resources', { ...draft, attachmentId }, key);
        setDraft(empty);
        setMessage(tr(lang, 'Submitted for review. Approve it below to make it public.', 'បានបញ្ជូនសម្រាប់ពិនិត្យ។ អនុម័តខាងក្រោមដើម្បីបង្ហាញជាសាធារណៈ។'));
        setPending((await api<{
            items: Resource[];
        }>('resources?review=1', undefined, key)).items);
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    async function moderate(id: string, status: string) { setBusy(true); setError(''); try {
        await api('moderate', { id, status }, key);
        setPending(p => p.filter(x => x.id !== id));
        await refresh();
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    async function reviewAttachment(id:string) {
        setBusy(true);setError('');
        try {const blob=await api<Blob>(`files/${id}?review=1`,undefined,key,'blob');const ext:Record<string,string>={'application/pdf':'pdf','image/png':'png','image/jpeg':'jpg','text/plain':'txt'};download(`school-resource.${ext[blob.type]||'bin'}`,blob);}
        catch(e){setError((e as Error).message);}finally{setBusy(false);}
    }
    const filtered = items.filter(r => (province === 'all' || r.province === province) && (kind === 'all' || r.kind === kind) && `${r.title} ${r.school} ${r.subject} ${r.description}`.toLowerCase().includes(search.toLowerCase()));
    const kindName = (k: string) => tr(lang, k === 'need' ? 'School need' : k === 'equipment' ? 'Equipment' : 'Teaching material', k === 'need' ? 'តម្រូវការសាលា' : k === 'equipment' ? 'សម្ភារៈ' : 'ធនធានបង្រៀន');
    return <><div className="learn-toolbar"><label className="learn-search"><Search size={18}/><input value={search} onChange={e => setSearch(e.target.value)} placeholder={tr(lang, 'Search resources, schools or subjects…', 'ស្វែងរកធនធាន សាលា ឬមុខវិជ្ជា…')} aria-label={tr(lang, 'Search resources', 'ស្វែងរកធនធាន')}/></label><label>{tr(lang, 'Province', 'ខេត្ត')}<select value={province} onChange={e => setProvince(e.target.value)}><option value="all">{tr(lang, 'All provinces', 'គ្រប់ខេត្ត')}</option>{provinces.map(p => <option key={p}>{p}</option>)}</select></label><label>{tr(lang, 'Type', 'ប្រភេទ')}<select value={kind} onChange={e => setKind(e.target.value)}><option value="all">{tr(lang, 'All types', 'គ្រប់ប្រភេទ')}</option>{['material', 'equipment', 'need'].map(k => <option key={k} value={k}>{kindName(k)}</option>)}</select></label><button onClick={refresh} disabled={loading}>{tr(lang, 'Refresh', 'ផ្ទុកឡើងវិញ')}</button></div>{error && <Notice error>{error}</Notice>}{message && <Notice>{message}</Notice>}<div className="learn-exchange"><section className="learn-stack">{loading ? <Notice>{tr(lang, 'Loading resources…', 'កំពុងផ្ទុកធនធាន…')}</Notice> : !filtered.length ? <div className="learn-panel learn-empty"><MapPin size={36}/><h2>{tr(lang, 'Space for your school', 'កន្លែងសម្រាប់សាលារបស់អ្នក')}</h2><p>{tr(lang, 'No approved listings match these filters yet. Trusted school editors can add a resource below.', 'មិនទាន់មានបញ្ជីអនុម័តត្រូវនឹងតម្រងទាំងនេះ។ អ្នកកែសម្រួលសាលាអាចបន្ថែមធនធានខាងក្រោម។')}</p></div> : filtered.map(r => <article className="learn-panel" key={r.id}><span className="learn-eyebrow">{kindName(r.kind)} · {r.subject}</span><h2>{r.title}</h2><p className="learn-fine">{r.school} · {r.province}</p><p className="learn-prewrap">{r.description}</p><div className="learn-row">{editor && <button disabled={busy} onClick={()=>moderate(r.id!,'rejected')}>{tr(lang,'Unpublish','ដកការផ្សព្វផ្សាយ')}</button>}{r.url && <a className="learn-button" href={r.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={15}/>{tr(lang, 'Open resource', 'បើកធនធាន')}</a>}{r.attachmentId && <a className="learn-button" href={`/api/learning/files/${r.attachmentId}`}><Download size={15}/>{tr(lang, 'Download attachment', 'ទាញយកឯកសារភ្ជាប់')}</a>}{r.lat !== null && r.lng !== null && <a href={`https://www.openstreetmap.org/?mlat=${r.lat}&mlon=${r.lng}#map=13/${r.lat}/${r.lng}`} target="_blank" rel="noopener noreferrer">{tr(lang, 'View location', 'មើលទីតាំង')}</a>}</div></article>)}</section><aside className="learn-panel learn-location"><span className="learn-eyebrow">{tr(lang, 'Location overview', 'ទិដ្ឋភាពទីតាំង')}</span><h3>{tr(lang, 'Connections across Cambodia', 'ការតភ្ជាប់ទូទាំងកម្ពុជា')}</h3><svg viewBox="0 0 320 340" role="img" aria-label="Schematic coordinate plot of listed school locations"><rect x="35" y="20" width="265" height="270" fill="#e6f0eb" rx="12"/>{[0, 1, 2, 3, 4, 5, 6].map(i => <g key={i}><path d={`M35 ${20 + i * 45}H300 M${35 + i * 44.16} 20V290`} stroke="#c7d9cf"/><text x="4" y={25 + i * 45} fontSize="10" fill="#486157">{15 - i}°N</text></g>)}<text x="35" y="310" fontSize="11" fill="#486157">102°E</text><text x="262" y="310" fontSize="11" fill="#486157">108°E</text>{filtered.filter(r => r.lat !== null && r.lng !== null).map(r => <g key={r.id}><circle cx={35 + (r.lng! - 102) / 6 * 265} cy={20 + (15 - r.lat!) / 6 * 270} r="7" fill="#087663" stroke="white" strokeWidth="2"><title>{r.school}: {r.title}</title></circle></g>)}</svg><p className="learn-fine">{tr(lang, 'Coordinate overview, not a boundary map. Only listings with coordinates appear. Open a listing’s location for a street map.', 'ទិដ្ឋភាពកូអរដោនេ មិនមែនផែនទីព្រំដែនទេ។ បង្ហាញតែបញ្ជីមានកូអរដោនេ។ បើកទីតាំងបញ្ជីដើម្បីមើលផែនទីផ្លូវ។')}</p></aside></div><section className="learn-panel learn-editor"><div className="learn-toolbar"><LockKeyhole size={20}/><h2 className="learn-grow">{tr(lang, 'School editor desk', 'កន្លែងអ្នកកែសម្រួលសាលា')}</h2>{editor && <button onClick={() => { setKey(''); setEditor(false); setPending([]); }}>{tr(lang, 'Lock editor', 'ចាក់សោកន្លែងកែ')}</button>}</div>{!editor ? <><p>{tr(lang, 'Use the editor key provided by the site owner. It stays in this tab’s memory and is never saved on this device.', 'ប្រើសោអ្នកកែសម្រួលដែលម្ចាស់គេហទំព័រផ្ដល់។ វារក្សាតែក្នុងអង្គចងចាំផ្ទាំងនេះ និងមិនរក្សាទុកលើឧបករណ៍ទេ។')}</p><div className="learn-row"><label className="learn-grow">{tr(lang, 'Editor key', 'សោអ្នកកែសម្រួល')}<input type="password" autoComplete="off" value={key} onChange={e => setKey(e.target.value)} maxLength={200}/></label><button className="learn-primary" disabled={busy || !key} onClick={review}>{tr(lang, 'Unlock editor', 'បើកកន្លែងកែ')}</button></div></> : <><form className="learn-stack" onSubmit={e => { e.preventDefault(); submit(); }}><div className="learn-two">{(['title', 'school', 'subject'] as const).map(f => <label key={f}>{tr(lang, f === 'title' ? 'Resource title' : f === 'school' ? 'School name' : 'Subject', f === 'title' ? 'ចំណងជើងធនធាន' : f === 'school' ? 'ឈ្មោះសាលា' : 'មុខវិជ្ជា')}<input required maxLength={f === 'subject' ? 60 : 120} value={draft[f]} onChange={e => setDraft({ ...draft, [f]: e.target.value })}/></label>)}<label>{tr(lang, 'Province', 'ខេត្ត')}<select value={draft.province} onChange={e => setDraft({ ...draft, province: e.target.value })}>{provinces.map(p => <option key={p}>{p}</option>)}</select></label><label>{tr(lang, 'Listing type', 'ប្រភេទបញ្ជី')}<select value={draft.kind} onChange={e => setDraft({ ...draft, kind: e.target.value as Resource['kind'] })}>{['material', 'equipment', 'need'].map(k => <option key={k} value={k}>{kindName(k)}</option>)}</select></label><label>{tr(lang, 'Resource link (optional, HTTPS)', 'តំណធនធាន (ស្រេចចិត្ត HTTPS)')}<input type="url" placeholder="https://" value={draft.url} maxLength={1000} onChange={e => setDraft({ ...draft, url: e.target.value })}/></label></div><label>{tr(lang, 'Description and how schools can use or offer help', 'ការពិពណ៌នា និងរបៀបសាលាអាចប្រើ ឬជួយ')}<textarea required rows={4} maxLength={1500} value={draft.description} onChange={e => setDraft({ ...draft, description: e.target.value })}/></label><div className="learn-two"><label>{tr(lang, 'Latitude (optional)', 'រយៈទទឹង (ស្រេចចិត្ត)')}<input type="number" min={9} max={15} step="any" value={draft.lat ?? ''} onChange={e => setDraft({ ...draft, lat: e.target.value === '' ? null : +e.target.value })}/></label><label>{tr(lang, 'Longitude (optional)', 'រយៈបណ្ដោយ (ស្រេចចិត្ត)')}<input type="number" min={102} max={108} step="any" value={draft.lng ?? ''} onChange={e => setDraft({ ...draft, lng: e.target.value === '' ? null : +e.target.value })}/></label></div><label>{tr(lang, 'Optional attachment · PDF, PNG, JPEG or TXT · 2 MB maximum', 'ឯកសារភ្ជាប់ស្រេចចិត្ត · PDF PNG JPEG ឬ TXT · អតិបរមា ២ MB')}<input key={fileVersion} type="file" accept=".pdf,.png,.jpg,.jpeg,.txt" onChange={e => setFile(e.target.files?.[0] || null)}/></label>{draft.attachmentId && <p>{tr(lang, 'Attachment uploaded and ready to submit.', 'ឯកសារភ្ជាប់បានផ្ទុក ហើយរួចរាល់សម្រាប់បញ្ជូន។')}</p>}<p className="learn-fine">{tr(lang, 'Publish only school information and materials you have permission to share. Do not include student names or private contact details.', 'ផ្សព្វផ្សាយតែព័ត៌មានសាលា និងសម្ភារៈដែលអ្នកមានសិទ្ធិចែករំលែក។ កុំបញ្ចូលឈ្មោះសិស្ស ឬព័ត៌មានទំនាក់ទំនងឯកជន។')}</p><button className="learn-primary" disabled={busy || !isResource(draft)}>{tr(lang, busy ? 'Saving…' : 'Submit for review', busy ? 'កំពុងរក្សាទុក…' : 'បញ្ជូនសម្រាប់ពិនិត្យ')}</button></form><hr /><div className="learn-toolbar"><h3 className="learn-grow">{tr(lang, 'Review queue', 'បញ្ជីរង់ចាំពិនិត្យ')} ({pending.length})</h3><button disabled={busy} onClick={review}>{tr(lang, 'Refresh queue', 'ផ្ទុកបញ្ជីឡើងវិញ')}</button></div>{pending.map(r => <article className="learn-question" key={r.id}><h3>{r.title}</h3><p>{r.school} · {r.province} · {r.subject} · {kindName(r.kind)}</p><p className="learn-prewrap">{r.description}</p>{r.url && <a href={r.url} target="_blank" rel="noopener noreferrer">{r.url}</a>}{r.attachmentId && <button disabled={busy} onClick={()=>reviewAttachment(r.attachmentId!)}><Download size={16}/>{tr(lang,'Download attachment for review','ទាញយកឯកសារភ្ជាប់សម្រាប់ពិនិត្យ')}</button>}<div className="learn-row"><button className="learn-primary" disabled={busy} onClick={() => moderate(r.id!, 'approved')}>{tr(lang, 'Approve and publish', 'អនុម័ត និងផ្សព្វផ្សាយ')}</button><button disabled={busy} onClick={() => moderate(r.id!, 'rejected')}>{tr(lang, 'Reject', 'បដិសេធ')}</button></div></article>)}{!pending.length && <p>{tr(lang, 'No listings waiting for review.', 'គ្មានបញ្ជីរង់ចាំពិនិត្យ។')}</p>}</>}</section></>;
}
