import { createRoom, joinRoom, answerRoom, advanceRoom, roomView, type Room } from './room.ts';
import { readJson, json, HttpError, digest, randomToken } from './http.ts';
export class QuizRoom {
    private state: DurableObjectState;
    constructor(state: DurableObjectState) { this.state = state; }
    async fetch(request: Request): Promise<Response> {
        return this.state.blockConcurrencyWhile(async () => {
            try {
                const path = new URL(request.url).pathname;
                let room = await this.state.storage.get<Room>('room');
                if (path === '/init' && request.method === 'POST') {
                    if (room && room.expires > Date.now())
                        throw new HttpError(409, 'room_exists');
                    const b = await readJson(request,100000) as {
                        quiz: unknown;
                        hostHash: string;
                    };
                    room = createRoom(b.quiz, b.hostHash);
                    await this.state.storage.put('room', room);
                    await this.state.storage.setAlarm(room.expires);
                    return json({ ok: true }, 201);
                }
                if (!room || room.expires < Date.now())
                    throw new HttpError(404, 'room_expired');
                if (path === '/join' && request.method === 'POST') {
                    const b = await readJson(request) as {
                        name: unknown;
                    };
                    const id = crypto.randomUUID(), token = randomToken();
                    joinRoom(room, id, await digest(token), b.name);
                    await this.state.storage.put('room', room);
                    return json({ id, token }, 201);
                }
                const token = request.headers.get('Authorization')?.replace(/^Bearer /, '') || '';
                if (token.length > 200)
                    throw new HttpError(401, 'join_required');
                const hash = await digest(token), host = hash === room.hostHash;
                const id = Object.keys(room.players).find(id => room!.players[id].hash === hash);
                if (!host && !id)
                    throw new HttpError(401, 'join_required');
                if (path === '/state' && request.method === 'GET')
                    return json(roomView(room, host, id));
                if (request.method !== 'POST')
                    throw new HttpError(405, 'method_not_allowed');
                if (path === '/answer' && id) {
                    const b = await readJson(request) as {
                        index: unknown;
                        answer: unknown;
                    };
                    answerRoom(room, id, b.index, b.answer);
                }
                else if (path === '/advance' && host)
                    advanceRoom(room);
                else if (path === '/close' && host)
                    room.phase = 'finished';
                else
                    throw new HttpError(403, 'host_required');
                await this.state.storage.put('room', room);
                return json(roomView(room, host, id));
            }
            catch (e) {
                return json({ error: e instanceof HttpError ? e.code : 'room_failed' }, e instanceof HttpError ? e.status : 500);
            }
        });
    }
    async alarm() { await this.state.storage.deleteAll(); }
}
