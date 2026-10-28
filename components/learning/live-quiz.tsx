'use client';
import { useEffect, useState } from 'react';
import { Users, Copy, Radio } from 'lucide-react';
import { sampleQuiz } from '@/data/learning';
import { api } from '@/lib/learning/browser';
import { isQuiz, type Quiz } from '@/lib/learning/contracts';
import { Notice, QuizEditor, QuizFiles, tr, useLocal, type LangProps } from './common';
type Session = {
    code: string;
    token: string;
    role: 'host' | 'player';
};
type RoomView = {
    title: string;
    phase: 'lobby' | 'question' | 'reveal' | 'finished';
    index: number;
    total: number;
    expires: number;
    participants: number;
    answered: number;
    question: {
        prompt: string;
        options: string[];
        correct?: number;
    } | null;
    players?: {
        id: string;
        name: string;
        score: number | null;
    }[];
    self?: {
        name: string;
        score: number | null;
        answered: boolean;
    };
};
export function LiveQuiz({ lang }: LangProps) {
    const [quiz, setQuiz, saveError] = useLocal<Quiz>('khmerone-quiz-draft', sampleQuiz, isQuiz), [tab, setTab] = useState('join'), [code, setCode] = useState(''), [name, setName] = useState(''), [session, setSession] = useState<Session | null>(null), [room, setRoom] = useState<RoomView | null>(null), [busy, setBusy] = useState(false), [error, setError] = useState(''), [message, setMessage] = useState('');
    useEffect(() => { try {
        const value = JSON.parse(sessionStorage.getItem('khmerone-room') || 'null');
        if (value && /^[A-Z2-9]{8}$/.test(value.code) && typeof value.token === 'string' && ['host', 'player'].includes(value.role))
            // eslint-disable-next-line react-hooks/set-state-in-effect -- Restore this tab's authenticated room after hydration.
            setSession(value);
    }
    catch { /* A new room works without session storage. */ } }, []);
    useEffect(() => { if (!session)
        return; let cancelled = false, timer: ReturnType<typeof setTimeout>; async function poll() { try {
        const r = await api<RoomView>(`rooms/${session!.code}/state`, undefined, session!.token);
        if (!cancelled) {
            setRoom(r);
            setError('');
        }
    }
    catch (e) {
        if (!cancelled)
            setError((e as Error).message);
    }
    finally {
        if (!cancelled)
            timer = setTimeout(poll, 2500);
    } } poll(); return () => { cancelled = true; clearTimeout(timer); }; }, [session]);
    function keep(s: Session) { setRoom(null); setSession(s); try {
        sessionStorage.setItem('khmerone-room', JSON.stringify(s));
    }
    catch {
        setMessage('Keep this tab open. This browser cannot restore a room after reload.');
    } }
    async function enter(host: boolean) { setBusy(true); setError(''); try {
        if (host) {
            const r = await api<Session>('rooms', { quiz });
            keep(r);
        }
        else {
            const r = await api<{
                token: string;
            }>(`rooms/${code}/join`, { name });
            keep({ code, token: r.token, role: 'player' });
        }
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    async function action(path: string, body: unknown = {}) { if (!session)
        return; setBusy(true); setError(''); try {
        setRoom(await api<RoomView>(`rooms/${session.code}/${path}`, body, session.token));
    }
    catch (e) {
        setError((e as Error).message);
    }
    finally {
        setBusy(false);
    } }
    function leave() { setSession(null); setRoom(null); setError(''); setMessage(''); try {
        sessionStorage.removeItem('khmerone-room');
    }
    catch { /* No stored session. */ } }
    return <div className="learn-panel">{error && <Notice error>{error}</Notice>}{message && <Notice>{message}</Notice>}{saveError && <Notice error>{saveError}</Notice>}{!session ? <><div className="learn-segment"><button className={tab === 'join' ? 'is-selected' : ''} onClick={() => setTab('join')}>{tr(lang, 'Join a quiz', 'ចូលរួមសំណួរ')}</button><button className={tab === 'host' ? 'is-selected' : ''} onClick={() => setTab('host')}>{tr(lang, 'Host a quiz', 'ដឹកនាំសំណួរ')}</button></div>{tab === 'join' ? <div className="learn-join"><Users size={48}/><h2>{tr(lang, 'Your class is waiting', 'ថ្នាក់របស់អ្នកកំពុងរង់ចាំ')}</h2><label>{tr(lang, 'Eight-character room code', 'លេខកូដបន្ទប់ ៨ តួ')}<input autoCapitalize="characters" autoComplete="off" spellCheck={false} placeholder="ABCD2345" maxLength={8} value={code} onChange={e => setCode(e.target.value.toUpperCase().replace(/[^A-Z2-9]/g, ''))}/></label><label>{tr(lang, 'Nickname (no full name needed)', 'ឈ្មោះហៅក្រៅ (មិនត្រូវការឈ្មោះពេញ)')}<input maxLength={24} autoComplete="off" value={name} onChange={e => setName(e.target.value)}/></label><button className="learn-primary" disabled={busy || code.length !== 8 || !name.trim()} onClick={() => enter(false)}>{tr(lang, busy ? 'Joining…' : 'Join room', busy ? 'កំពុងចូល…' : 'ចូលបន្ទប់')}</button></div> : <div className="learn-stack"><h2>{tr(lang, 'Make room for the whole class', 'បង្កើតបន្ទប់សម្រាប់ថ្នាក់ទាំងមូល')}</h2><p>{tr(lang, 'Up to 40 learners. Rooms last two hours. The host controls when answers are revealed.', 'រហូតដល់ ៤០ នាក់។ បន្ទប់មានរយៈពេលពីរម៉ោង។ អ្នកដឹកនាំគ្រប់គ្រងពេលបង្ហាញចម្លើយ។')}</p><QuizFiles quiz={quiz} onImport={setQuiz} lang={lang}/><QuizEditor quiz={quiz} onChange={setQuiz} lang={lang}/><button className="learn-primary" disabled={busy || !isQuiz(quiz)} onClick={() => enter(true)}><Radio size={18}/>{tr(lang, busy ? 'Creating room…' : 'Create live room', busy ? 'កំពុងបង្កើត…' : 'បង្កើតបន្ទប់ផ្ទាល់')}</button></div>}</> : <><div className="learn-toolbar"><div className="learn-grow"><span className="learn-eyebrow">{tr(lang, 'Room code', 'លេខកូដបន្ទប់')}</span><strong className="learn-room-code">{session.code}</strong></div><button onClick={async () => { try {
        await navigator.clipboard.writeText(session.code);
        setMessage(tr(lang, 'Room code copied.', 'បានចម្លងលេខកូដ។'));
    }
    catch {
        setMessage(tr(lang, 'Select the room code and copy it.', 'ជ្រើសរើសលេខកូដ ហើយចម្លងវា។'));
    } }}><Copy size={16}/>{tr(lang, 'Copy code', 'ចម្លងលេខកូដ')}</button>{session.role === 'host' && room?.phase !== 'finished' && <button disabled={busy} onClick={() => action('close')}>{tr(lang, 'End quiz', 'បញ្ចប់សំណួរ')}</button>}{<button onClick={leave}>{tr(lang, 'Leave room', 'ចាកចេញពីបន្ទប់')}</button>}</div>{!room ? <Notice>{tr(lang, 'Connecting to your room…', 'កំពុងភ្ជាប់បន្ទប់…')}</Notice> : <><h2>{room.title}</h2><p className="learn-fine">{room.participants}/40 {tr(lang, 'learners', 'អ្នករៀន')} · {tr(lang, 'Room closes', 'បន្ទប់បិទ')} {new Date(room.expires).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>{room.phase === 'lobby' ? <div className="learn-empty"><Users size={40}/><h3>{tr(lang, 'Gather your class', 'ប្រមូលផ្ដុំថ្នាក់របស់អ្នក')}</h3><p>{tr(lang, 'Share this code. Learners choose Join a quiz on this page.', 'ចែករំលែកលេខកូដនេះ។ អ្នករៀនជ្រើសរើសចូលរួមសំណួរលើទំព័រនេះ។')}</p></div> : room.phase === 'finished' ? <Notice>{tr(lang, 'Quiz finished. Thank you for taking part!', 'សំណួរបានបញ្ចប់។ អរគុណដែលបានចូលរួម!')}</Notice> : <div className="learn-question"><span className="learn-eyebrow">{tr(lang, 'Question', 'សំណួរ')} {room.index + 1}/{room.total}</span><h3>{room.question?.prompt}</h3>{room.question?.options.map((o, i) => <button className={`learn-live-answer ${room.question?.correct === i ? 'is-correct' : ''}`} disabled={busy || session.role === 'host' || room.phase !== 'question' || !!room.self?.answered} key={i} onClick={() => action('answer', { index: room.index, answer: i })}><span>{String.fromCharCode(65 + i)}</span>{o}{room.question?.correct === i ? ' ✓' : ''}</button>)}<p>{room.answered}/{room.participants} {tr(lang, 'answered', 'បានឆ្លើយ')}</p>{room.self?.answered && room.phase === 'question' && <Notice>{tr(lang, 'Answer received. Wait for the host to reveal the result.', 'បានទទួលចម្លើយ។ រង់ចាំអ្នកដឹកនាំបង្ហាញលទ្ធផល។')}</Notice>}</div>}{session.role === 'host' && room.phase !== 'finished' && <button className="learn-primary" disabled={busy || (room.phase === 'lobby' && room.participants === 0)} onClick={() => action('advance')}>{tr(lang, room.phase === 'lobby' ? 'Start quiz' : room.phase === 'question' ? 'Reveal answer' : room.index + 1 === room.total ? 'Show final results' : 'Next question', room.phase === 'lobby' ? 'ចាប់ផ្ដើមសំណួរ' : room.phase === 'question' ? 'បង្ហាញចម្លើយ' : room.index + 1 === room.total ? 'បង្ហាញលទ្ធផលចុងក្រោយ' : 'សំណួរបន្ទាប់')}</button>}{room.players && <div className="learn-participants">{room.players.map(p => <span key={p.id}>{p.name}{p.score !== null && <strong>{p.score}/{room.total}</strong>}</span>)}</div>}{room.self?.score !== null && room.self?.score !== undefined && <Notice>{tr(lang, 'Your score', 'ពិន្ទុរបស់អ្នក')}: {room.self.score}/{room.total}</Notice>}</>}</>}</div>;
}
