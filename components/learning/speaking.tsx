'use client';
import { useEffect, useRef, useState } from 'react';
import { Mic, Square, Trash2 } from 'lucide-react';
import { api, bytesBase64, recordingToWav } from '@/lib/learning/browser';
import { AudioMaker, Notice, tr, type LangProps } from './common';
type Feedback = {
    scores: Record<string, number | null>;
    words: {
        word: string;
        accuracy: number | null;
        error: string;
    }[];
    text?: string;
};
export function Speaking({ lang }: LangProps) {
    const [reference, setReference] = useState('Good morning. I am ready to learn.'), [recordedReference, setRecordedReference] = useState(''), [recording, setRecording] = useState(false), [seconds, setSeconds] = useState(0), [blob, setBlob] = useState<Blob | null>(null), [url, setUrl] = useState(''), [consent, setConsent] = useState(false), [busy, setBusy] = useState(false), [error, setError] = useState(''), [feedback, setFeedback] = useState<Feedback | null>(null);
    const recorder = useRef<MediaRecorder | null>(null), stream = useRef<MediaStream | null>(null), timer = useRef<ReturnType<typeof setInterval> | null>(null), alive = useRef(true);
    useEffect(() => { alive.current = true; return () => { alive.current = false; if (recorder.current?.state === 'recording')
        recorder.current.stop(); stream.current?.getTracks().forEach(t => t.stop()); if (timer.current)
        clearInterval(timer.current); }; }, []);
    useEffect(() => () => { if (url)
        URL.revokeObjectURL(url); }, [url]);
    function clear() { setBlob(null); setUrl(''); setConsent(false); setFeedback(null); setError(''); }
    function stop() { if (recorder.current?.state === 'recording')
        recorder.current.stop(); stream.current?.getTracks().forEach(t => t.stop()); if (timer.current)
        clearInterval(timer.current); setRecording(false); }
    async function record() { clear(); setError(''); setBusy(true); try {
        if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined')
            throw new Error('Recording needs a browser with microphone support on HTTPS. Try current Chrome, Edge or Safari.');
        const media = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (!alive.current) {
            media.getTracks().forEach(t => t.stop());
            return;
        }
        stream.current = media;
        const rec = new MediaRecorder(media);
        recorder.current = rec;
        const chunks: Blob[] = [];
        rec.ondataavailable = e => { if (e.data.size)
            chunks.push(e.data); };
        rec.onstop = () => { if (!alive.current)
            return; const recordingBlob = new Blob(chunks, { type: rec.mimeType }); setBlob(recordingBlob); setUrl(URL.createObjectURL(recordingBlob)); setRecordedReference(reference); setRecording(false); };
        rec.onerror = () => { stop(); setError('Recording failed. Check microphone permissions and try again.'); };
        rec.start();
        setSeconds(0);
        setRecording(true);
        let s = 0;
        timer.current = setInterval(() => { setSeconds(++s); if (s >= 25)
            stop(); }, 1000);
    }
    catch (e) {
        setError(e instanceof DOMException && e.name === 'NotAllowedError' ? 'Microphone access was not allowed. Enable it in your browser’s site settings and try again.' : (e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    async function assess() { if (!blob)
        return; setBusy(true); setError(''); try {
        const wav = await recordingToWav(blob);
        const result = await api<Feedback>('assess', { audio: await bytesBase64(wav), reference: recordedReference, consent });
        setFeedback(result);
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    return <div className="learn-two"><section className="learn-panel"><span className="learn-eyebrow">{tr(lang, '01 · Listen to a model', '០១ · ស្តាប់គំរូ')}</span><h2>{tr(lang, 'Say it with confidence', 'និយាយដោយទំនុកចិត្ត')}</h2><label>{tr(lang, 'Choose a practice phrase', 'ជ្រើសរើសឃ្លាហាត់')}<select disabled={recording || busy} value="" onChange={e => { setReference(e.target.value); clear(); }}><option value="" disabled>{tr(lang, 'Pick a phrase…', 'ជ្រើសរើសឃ្លា…')}</option>{['Good morning. I am ready to learn.', 'Could you explain that again, please?', 'The plant needs sunlight and water.', 'I would like to borrow this book.'].map(s => <option key={s}>{s}</option>)}</select></label><label>{tr(lang, 'Or write a short English phrase', 'ឬសរសេរឃ្លាអង់គ្លេសខ្លី')}<textarea rows={4} maxLength={300} value={reference} disabled={recording || busy} onChange={e => { setReference(e.target.value); clear(); }}/></label><AudioMaker text={reference} language="en" lang={lang}/><p className="learn-fine">{tr(lang, 'English feedback only. Listen to Khmer in the Dictionary or Audio Maker.', 'មតិកែលម្អសម្រាប់ភាសាអង់គ្លេសតែប៉ុណ្ណោះ។ ស្តាប់ខ្មែរក្នុងវចនានុក្រម ឬកម្មវិធីសំឡេង។')}</p></section><section className="learn-panel"><span className="learn-eyebrow">{tr(lang, '02 · Record and reflect', '០២ · ថត និងពិនិត្យ')}</span><h2>{tr(lang, 'Your turn', 'វេនរបស់អ្នក')}</h2><p>{tr(lang, 'Record up to 25 seconds. Listen back before choosing to send it for feedback.', 'ថតរហូតដល់ ២៥ វិនាទី។ ស្តាប់វិញមុនសម្រេចផ្ញើសម្រាប់មតិកែលម្អ។')}</p><div className={`learn-recorder ${recording ? 'is-recording' : ''}`}><Mic size={38}/><strong>{recording ? `${seconds}s / 25s` : tr(lang, 'Ready when you are', 'ត្រៀមនៅពេលអ្នករួចរាល់')}</strong></div><div className="learn-row">{recording ? <button className="learn-primary" onClick={stop}><Square size={16}/>{tr(lang, 'Stop recording', 'បញ្ឈប់ការថត')}</button> : <button className="learn-primary" disabled={busy || !reference.trim() || !/^[\x20-\x7E\r\n]+$/.test(reference)} onClick={record}><Mic size={16}/>{tr(lang, 'Record my voice', 'ថតសំឡេងខ្ញុំ')}</button>}{blob && !recording && <button disabled={busy} onClick={clear}><Trash2 size={16}/>{tr(lang, 'Delete recording', 'លុបសំឡេងថត')}</button>}</div>{url && <><audio preload="none" controls src={url} onPlay={() => window.dispatchEvent(new Event('khmerone:narration-start'))}/><label className="learn-checkbox"><input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)}/>{tr(lang, 'Send this recording and phrase to Microsoft Azure for pronunciation feedback.', 'ផ្ញើសំឡេងថត និងឃ្លានេះទៅ Microsoft Azure ដើម្បីទទួលមតិកែលម្អការបញ្ចេញសំឡេង។')}</label><button disabled={!consent || busy || recording} onClick={assess}>{tr(lang, busy ? 'Getting feedback…' : 'Assess my pronunciation', busy ? 'កំពុងទទួលមតិ…' : 'វាយតម្លៃការបញ្ចេញសំឡេង')}</button></>}<p className="learn-fine">{tr(lang, 'Khmer One keeps recordings only in this page’s memory. They are cleared when you leave. Feedback is a practice aid, not an exam grade.', 'Khmer One រក្សាសំឡេងថតតែក្នុងអង្គចងចាំទំព័រនេះ។ វាត្រូវលុបនៅពេលអ្នកចាកចេញ។ មតិកែលម្អជាជំនួយហាត់ មិនមែនពិន្ទុប្រឡងទេ។')}</p>{error && <Notice error>{error}</Notice>}</section>{feedback && <section className="learn-panel learn-full"><h2>{tr(lang, 'Your practice feedback', 'មតិកែលម្អការហាត់របស់អ្នក')}</h2><div className="learn-scores">{Object.entries(feedback.scores).map(([key, v]) => <div key={key}><strong>{v === null ? '—' : Math.round(v)}</strong><span>{key}</span></div>)}</div><div className="learn-word-feedback">{feedback.words.map((w, i) => <span key={i} className={w.error === 'None' ? '' : 'needs-practice'}><strong>{w.word}</strong><small>{w.accuracy === null ? '—' : Math.round(w.accuracy)} / 100 · {w.error === 'None' ? tr(lang, 'Recognised', 'បានស្គាល់') : w.error}</small></span>)}</div><p className="learn-fine">{tr(lang, 'Scores can change with accent, microphone quality and background noise. Focus on one phrase and try again.', 'ពិន្ទុអាចប្រែតាមសំនៀង គុណភាពមីក្រូហ្វូន និងសំឡេងរំខាន។ ផ្ដោតលើឃ្លាមួយ ហើយសាកម្ដងទៀត។')}</p></section>}</div>;
}
