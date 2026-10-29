'use client';
import { useEffect, useRef, useState, type Dispatch, type SetStateAction } from 'react';
import { Download, Play, LoaderCircle } from 'lucide-react';
import { api, download } from '@/lib/learning/browser';
import { voices, isQuiz, scoreQuiz, type Language, type Quiz } from '@/lib/learning/contracts';
export type LangProps = {
    lang: Language;
};
export const tr = (lang: Language, en: string, km: string) => lang === 'km' ? km : en;
export function Notice({ children, error = false }: {
    children: React.ReactNode;
    error?: boolean;
}) { return <p className={`learn-notice ${error ? 'is-error' : ''}`} role={error ? 'alert' : 'status'}>{children}</p>; }
export function ReviewNote({ lang }: LangProps) { return <p className="learn-fine">{tr(lang, 'Khmer starter text is a draft. A teacher should review it before classroom use.', 'អត្ថបទខ្មែរដំបូងជាសេចក្ដីព្រាង។ គ្រូគួរពិនិត្យមុនប្រើក្នុងថ្នាក់។')}</p>; }
// Browser storage is unavailable during SSR. Hydrate once, then report persistence errors.
/* eslint-disable react-hooks/set-state-in-effect */
export function useLocal<T>(key: string, initial: T, valid: (x: unknown) => boolean): [
    T,
    Dispatch<SetStateAction<T>>,
    string
] { const [value, setValue] = useState(initial), [loaded, setLoaded] = useState(false), [error, setError] = useState(''); const check = useRef(valid); useEffect(() => { try {
    const s = localStorage.getItem(key);
    if (s) {
        const p = JSON.parse(s);
        if (check.current(p))
            setValue(p);
    }
}
catch {
    setError('Local saving is unavailable in this browser. Export a copy to keep your work.');
} setLoaded(true); }, [key]); useEffect(() => { if (loaded)
    try {
        localStorage.setItem(key, JSON.stringify(value));
    }
    catch {
        setError('Local saving is unavailable. Export a copy to keep your work.');
    } }, [key, value, loaded]); return [value, setValue, error]; }
/* eslint-enable react-hooks/set-state-in-effect */
export function AudioMaker(props: Parameters<typeof AudioControls>[0]) {
    return <AudioControls key={props.language + props.text} {...props}/>;
}
function AudioControls({ text, language, lang = language, name = 'khmerone-audio' }: {
    text: string;
    language: Language;
    lang?: Language;
    name?: string;
}) {
    const [speed, setSpeed] = useState('normal'), [choice, setChoice] = useState(0), [url, setUrl] = useState(''), [busy, setBusy] = useState(false), [error, setError] = useState('');
    const audio = useRef<HTMLAudioElement>(null);
    const sequence = useRef(0);
    function clearResult() { sequence.current++; setBusy(false); setUrl(''); setError(''); }
    useEffect(() => () => { sequence.current++; }, []);
    useEffect(() => () => { if (url)
        URL.revokeObjectURL(url); }, [url]);
    async function generate() { const n = ++sequence.current; setBusy(true); setError(''); try {
        const blob = await api<Blob>('speech', { text, language, voice: voices[language][choice], speed });
        if (sequence.current === n)
            setUrl(URL.createObjectURL(blob));
    }
    catch (e) {
        if (sequence.current === n)
            setError((e as Error).message);
    }
    finally {
        if (sequence.current === n)
            setBusy(false);
    } }
    return <div className="learn-audio"><div className="learn-row"><label>{tr(lang, 'Voice', 'សំឡេង')}<select value={choice} onChange={e => {setChoice(+e.target.value);clearResult();}}><option value={0}>{language === 'km' ? 'Sreymom · ស្រីមុំ' : 'Jenny'}</option><option value={1}>{language === 'km' ? 'Piseth · ពិសិដ្ឋ' : 'James'}</option></select></label><label>{tr(lang, 'Speed', 'ល្បឿន')}<select value={speed} onChange={e => {setSpeed(e.target.value);clearResult();}}><option value="normal">{tr(lang, 'Normal', 'ធម្មតា')}</option><option value="slower">{tr(lang, 'Slower', 'យឺត')}</option></select></label><button className="learn-primary" onClick={generate} disabled={busy || !text.trim() || text.length > 2000}>{busy ? <LoaderCircle className="learn-spin" size={17}/> : <Play size={17}/>} {tr(lang, busy ? 'Creating audio…' : 'Create audio', busy ? 'កំពុងបង្កើតសំឡេង…' : 'បង្កើតសំឡេង')}</button></div>{error && <Notice error>{error}</Notice>}{url && <div className="learn-row"><audio ref={audio} controls src={url} onPlay={() => window.dispatchEvent(new Event('khmerone:narration-start'))}/><a className="learn-button" href={url} download={`${name}.mp3`}><Download size={16}/>{tr(lang, 'Download MP3', 'ទាញយក MP3')}</a></div>}</div>;
}
export function QuizEditor({ quiz, onChange, lang }: LangProps & {
    quiz: Quiz;
    onChange: (q: Quiz) => void;
}) { const field = (i: number, changes: Partial<Quiz['questions'][number]>) => onChange({ ...quiz, questions: quiz.questions.map((q, j) => j === i ? { ...q, ...changes } : q) }); return <div className="learn-stack"><div className="learn-row"><label className="learn-grow">{tr(lang, 'Quiz title', 'ចំណងជើងសំណួរ')}<input value={quiz.title} maxLength={100} onChange={e => onChange({ ...quiz, title: e.target.value })}/></label><label>{tr(lang, 'Passage language', 'ភាសាអត្ថបទ')}<select value={quiz.language} onChange={e => onChange({ ...quiz, language: e.target.value as Language })}><option value="en">English</option><option value="km">ខ្មែរ</option></select></label></div><label>{tr(lang, 'Passage to read aloud', 'អត្ថបទសម្រាប់អាន')}<textarea rows={5} maxLength={2000} value={quiz.passage} onChange={e => onChange({ ...quiz, passage: e.target.value })}/><span className="learn-fine">{quiz.passage.length}/2,000</span></label>{quiz.questions.map((q, i) => <fieldset key={i} className="learn-question"><legend>{tr(lang, 'Question', 'សំណួរ')} {i + 1}</legend><label>{tr(lang, 'Question text', 'អត្ថបទសំណួរ')}<input value={q.prompt} maxLength={300} onChange={e => field(i, { prompt: e.target.value })}/></label>{q.options.map((option, j) => <div className="learn-option-edit" key={j}><input type="radio" aria-label={`${tr(lang, 'Correct answer', 'ចម្លើយត្រឹមត្រូវ')} ${j + 1}`} name={`correct-${i}`} checked={q.correct === j} onChange={() => field(i, { correct: j })}/><input aria-label={`${tr(lang, 'Choice', 'ជម្រើស')} ${j + 1}`} maxLength={150} value={option} onChange={e => field(i, { options: q.options.map((o, k) => j === k ? e.target.value : o) })}/>{q.options.length > 2 && <button type="button" aria-label={`Remove choice ${j + 1}`} onClick={() => field(i, { options: q.options.filter((_, k) => k !== j), correct: q.correct === j ? 0 : q.correct > j ? q.correct - 1 : q.correct })}>×</button>}</div>)}<div className="learn-row">{q.options.length < 4 && <button onClick={() => field(i, { options: [...q.options, ''] })}>{tr(lang, 'Add choice', 'បន្ថែមជម្រើស')}</button>}{quiz.questions.length > 1 && <button onClick={() => onChange({ ...quiz, questions: quiz.questions.filter((_, j) => j !== i) })}>{tr(lang, 'Remove question', 'លុបសំណួរ')}</button>}</div></fieldset>)}<button disabled={quiz.questions.length >= 20} onClick={() => onChange({ ...quiz, questions: [...quiz.questions, { prompt: '', options: ['', ''], correct: 0 }] })}>{tr(lang, 'Add question', 'បន្ថែមសំណួរ')}</button><p className="learn-fine">{tr(lang, 'Select the circle beside each correct answer. Up to 20 questions.', 'ជ្រើសរើសរង្វង់ជិតចម្លើយត្រឹមត្រូវ។ រហូតដល់ ២០ សំណួរ។')}</p></div>; }
export function QuizAttempt(props: LangProps & {quiz:Quiz}) { return <QuizAttemptSession key={JSON.stringify(props.quiz)} {...props}/>; }
function QuizAttemptSession({ quiz, lang }: LangProps & {
    quiz: Quiz;
}) { const [answers, setAnswers] = useState<number[]>([]), [done, setDone] = useState(false); return <div className="learn-stack">{quiz.questions.map((q, i) => <fieldset className="learn-question" key={i}><legend>{i + 1}. {q.prompt}</legend>{q.options.map((o, j) => <label className={`learn-answer ${done && q.correct === j ? 'is-correct' : ''}`} key={j}><input type="radio" name={`attempt-${i}`} checked={answers[i] === j} disabled={done} onChange={() => setAnswers(a => { const copy = [...a]; copy[i] = j; return copy; })}/><span>{o}{done && q.correct === j ? ' ✓' : ''}</span></label>)}{done && answers[i] !== q.correct && <p>{tr(lang, 'Correct answer: ', 'ចម្លើយត្រឹមត្រូវ៖ ')}{q.options[q.correct]}</p>}</fieldset>)}{done ? <Notice>{tr(lang, 'Your result', 'លទ្ធផលរបស់អ្នក')}: <strong>{scoreQuiz(quiz, answers)} / {quiz.questions.length}</strong></Notice> : <button className="learn-primary" disabled={!quiz.questions.every((_, i) => Number.isInteger(answers[i]))} onClick={() => setDone(true)}>{tr(lang, 'Check answers', 'ពិនិត្យចម្លើយ')}</button>}{done && <button onClick={() => { setAnswers([]); setDone(false); }}>{tr(lang, 'Try again', 'សាកម្ដងទៀត')}</button>}</div>; }
export function QuizFiles({ quiz, onImport, lang }: LangProps & {
    quiz: Quiz;
    onImport: (q: Quiz) => void;
}) { const [error, setError] = useState(''); return <><div className="learn-row"><button disabled={!isQuiz(quiz)} onClick={() => download('khmerone-quiz.json', JSON.stringify(quiz, null, 2), 'application/json')}><Download size={16}/>{tr(lang, 'Export quiz', 'នាំចេញសំណួរ')}</button><label className="learn-button">{tr(lang, 'Import quiz', 'នាំចូលសំណួរ')}<input type="file" accept=".json,application/json" className="learn-file" onChange={async (e) => { setError(''); const f = e.target.files?.[0]; e.target.value = ''; if (!f)
    return; try {
    if (f.size > 100000)
        throw new Error('Quiz files must be smaller than 100 KB.');
    const q = JSON.parse(await f.text());
    if (!isQuiz(q))
        throw new Error('This is not a valid Khmer One quiz.');
    onImport(q);
}
catch (x) {
    setError((x as Error).message);
} }}/></label></div>{error && <Notice error>{error}</Notice>}</>; }
