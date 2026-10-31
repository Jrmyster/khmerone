import { type Quiz, isQuiz, isText } from './contracts.ts';
import { HttpError } from './http.ts';
export type Player = {
    name: string;
    hash: string;
    score: number;
    answers: Record<number, number>;
};
export type Room = {
    quiz: Quiz;
    hostHash: string;
    players: Record<string, Player>;
    index: number;
    phase: 'lobby' | 'question' | 'reveal' | 'finished';
    expires: number;
};
export function createRoom(quiz: unknown, hostHash: string, now = Date.now()): Room { if (!isQuiz(quiz))
    throw new HttpError(400, 'invalid_quiz'); return { quiz, hostHash, players: {}, index: -1, phase: 'lobby', expires: now + 2 * 60 * 60 * 1000 }; }
export function joinRoom(room: Room, id: string, hash: string, name: unknown) { if (room.phase !== 'lobby')
    throw new HttpError(409, 'room_started'); if (Object.keys(room.players).length >= 40)
    throw new HttpError(409, 'room_full'); if (!isText(name, 24))
    throw new HttpError(400, 'nickname_required'); room.players[id] = { name, hash, score: 0, answers: {} }; }
export function answerRoom(room: Room, id: string, index: unknown, answer: unknown) { const p = room.players[id]; if (!p)
    throw new HttpError(401, 'join_required'); if (room.phase !== 'question' || index !== room.index)
    throw new HttpError(409, 'round_closed'); const q = room.quiz.questions[room.index]; if (!Number.isInteger(answer) || Number(answer) < 0 || Number(answer) >= q.options.length)
    throw new HttpError(400, 'invalid_answer'); if (Object.hasOwn(p.answers, room.index))
    throw new HttpError(409, 'already_answered'); p.answers[room.index] = Number(answer); if (answer === q.correct)
    p.score++; }
export function advanceRoom(room: Room) { if (room.phase === 'finished')
    return; if (room.phase === 'question') {
    room.phase = 'reveal';
    return;
} if (room.index + 1 >= room.quiz.questions.length) {
    room.phase = 'finished';
    return;
} room.index++; room.phase = 'question'; }
export function roomView(room: Room, host: boolean, id?: string) { const q = room.quiz.questions[room.index]; const revealed = room.phase === 'reveal' || room.phase === 'finished'; return { title: room.quiz.title, phase: room.phase, index: room.index, total: room.quiz.questions.length, expires: room.expires, participants: Object.keys(room.players).length, answered: Object.values(room.players).filter(p => Object.hasOwn(p.answers, room.index)).length, question: q ? { prompt: q.prompt, options: q.options, ...(revealed ? { correct: q.correct } : {}) } : null, ...(host ? { players: Object.entries(room.players).map(([key, p]) => ({ id: key, name: p.name, score: revealed ? p.score : null })) } : { self: id ? { name: room.players[id]?.name, score: revealed ? room.players[id]?.score : null, answered: !!room.players[id] && Object.hasOwn(room.players[id].answers, room.index) } : null }) }; }
