import { isText, isResource, isQuiz, voices } from './contracts.ts';
import { json, readJson, sameOrigin, requireEditor, HttpError, digest, randomToken, readBytes } from './http.ts';
export type LearningEnv = {
    AZURE_SPEECH_KEY?: string;
    AZURE_SPEECH_REGION?: string;
    AZURE_TRANSLATOR_KEY?: string;
    AZURE_TRANSLATOR_REGION?: string;
    LEARNING_ADMIN_KEY?: string;
    LEARNING_RATE_LIMITER?: {
        limit(o: {
            key: string;
        }): Promise<{
            success: boolean;
        }>;
    };
    LEARNING_DB?: D1Database;
    LEARNING_FILES?: R2Bucket;
    ROOM_RATE_LIMITER?: {
        limit(o: {
            key: string;
        }): Promise<{
            success: boolean;
        }>;
    };
    QUIZ_ROOMS?: DurableObjectNamespace;
};
const xml = (s: string) => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]!));
const object = (v: unknown): Record<string, unknown> => { if (!v || typeof v !== 'object' || Array.isArray(v))
    throw new HttpError(400, 'invalid_input'); return v as Record<string, unknown>; };
async function provider(response: Response) { if (!response.ok) {
    await response.body?.cancel();
    throw new HttpError(response.status === 429 ? 429 : 502, response.status === 429 ? 'service_busy' : response.status === 401 || response.status === 403 ? 'provider_configuration' : `provider_http_${response.status}`);
} return response; }
function speechConfig(env: LearningEnv) { if (!env.AZURE_SPEECH_KEY || !env.AZURE_SPEECH_REGION || !/^[a-z0-9-]{1,40}$/.test(env.AZURE_SPEECH_REGION))
    throw new HttpError(503, 'speech_not_configured'); }
async function limitedResponse(r: Response, max: number) { return readBytes(new Request('https://internal/', { method: 'POST', body: r.body, duplex: 'half' } as RequestInit), max); }
async function paid(request: Request, env: LearningEnv) { if (!env.LEARNING_RATE_LIMITER)
    throw new HttpError(503, 'limiter_not_configured'); if (!(await env.LEARNING_RATE_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') || 'unknown' })).success)
    throw new HttpError(429, 'rate_limited'); }
export async function handleLearning(request: Request, env: LearningEnv, fetcher: typeof fetch = fetch): Promise<Response> {
    try {
        const url = new URL(request.url), path = url.pathname.replace(/^\/api\/learning\/?/, '');
        sameOrigin(request);
        if (path === 'status' && request.method === 'GET')
            return json({ speech: !!(env.AZURE_SPEECH_KEY && env.AZURE_SPEECH_REGION && env.LEARNING_RATE_LIMITER), translation: !!(env.AZURE_TRANSLATOR_KEY && env.AZURE_TRANSLATOR_REGION && env.LEARNING_RATE_LIMITER), rooms: !!(env.QUIZ_ROOMS && env.LEARNING_RATE_LIMITER && env.ROOM_RATE_LIMITER), exchange: !!env.LEARNING_DB, uploads: !!(env.LEARNING_DB && env.LEARNING_FILES), editor: !!(env.LEARNING_ADMIN_KEY && env.LEARNING_ADMIN_KEY.length >= 32) });
        if (path.startsWith('rooms/')) {
            if (!env.QUIZ_ROOMS)
                throw new HttpError(503, 'rooms_not_configured');
            const match = /^rooms\/([A-Z2-9]{8})\/(state|join|answer|advance|close)$/.exec(path);
            if (!match)
                throw new HttpError(404, 'not_found');
            if (request.method !== (match[2] === 'state' ? 'GET' : 'POST'))
                throw new HttpError(405, 'method_not_allowed');
            // Reads are authenticated by the room; all mutations share a bounded per-IP bucket.
            if (request.method === 'POST') {
                if (!env.ROOM_RATE_LIMITER)
                    throw new HttpError(503, 'limiter_not_configured');
                if (!(await env.ROOM_RATE_LIMITER.limit({ key: request.headers.get('CF-Connecting-IP') || 'unknown' })).success)
                    throw new HttpError(429, 'rate_limited');
            }
            const headers = new Headers(request.headers);
            const body = request.method === 'POST' ? await readBytes(request, 20000) : undefined;
            return env.QUIZ_ROOMS.get(env.QUIZ_ROOMS.idFromName(match[1])).fetch(new Request(`https://room/${match[2]}`, { method: request.method, headers, body }));
        }
        if (path === 'resources' && request.method === 'GET') {
            if (!env.LEARNING_DB)
                throw new HttpError(503, 'exchange_not_configured');
            const pending = url.searchParams.get('review') === '1';
            if (pending)
                await requireEditor(request, env.LEARNING_ADMIN_KEY);
            // Search reads only approved content, with a stable cursor instead of a
            // silent 200-listing limit. Review queues never enter this public index.
            if (!pending && url.searchParams.get('index') === '1') {
                const after = url.searchParams.get('after') || '';
                if (after && !/^[a-f0-9-]{36}$/.test(after)) throw new HttpError(400, 'invalid_input');
                const result = await env.LEARNING_DB.prepare("SELECT id,title,school,province,kind,subject,description,url,lat,lng,attachment_id AS attachmentId,status,created_at AS createdAt FROM learning_resources WHERE status='approved' AND id > ? ORDER BY id LIMIT 201").bind(after).all();
                const items = result.results.slice(0, 200);
                return json({ items, nextCursor: result.results.length > 200 ? items[items.length - 1].id : null });
            }
            const resourceId = url.searchParams.get('id');
            if (!pending && resourceId) {
                if (!/^[a-f0-9-]{36}$/.test(resourceId)) throw new HttpError(400, 'invalid_input');
                const result = await env.LEARNING_DB.prepare("SELECT id,title,school,province,kind,subject,description,url,lat,lng,attachment_id AS attachmentId,status,created_at AS createdAt FROM learning_resources WHERE status='approved' AND id=?").bind(resourceId).all();
                return json({ items: result.results });
            }
            const result = await env.LEARNING_DB.prepare('SELECT id,title,school,province,kind,subject,description,url,lat,lng,attachment_id AS attachmentId,status,created_at AS createdAt FROM learning_resources WHERE status = ? ORDER BY created_at DESC LIMIT 200').bind(pending ? 'pending' : 'approved').all();
            return json({ items: result.results });
        }
        if (/^files\/[a-f0-9-]{36}$/.test(path) && request.method === 'GET') {
            if (!env.LEARNING_DB || !env.LEARNING_FILES)
                throw new HttpError(503, 'uploads_not_configured');
            const id = path.slice(6);
            const review = url.searchParams.get('review') === '1';
            if (review) await requireEditor(request, env.LEARNING_ADMIN_KEY);
            const file = await env.LEARNING_DB.prepare(review ? "SELECT name,type FROM learning_files WHERE id=?" : "SELECT f.name,f.type FROM learning_files f JOIN learning_resources r ON r.attachment_id=f.id WHERE f.id=? AND r.status='approved' LIMIT 1").bind(id).first<{
                name: string;
                type: string;
            }>();
            if (!file)
                throw new HttpError(404, 'not_found');
            const blob = await env.LEARNING_FILES.get(`learning/${id}`);
            if (!blob)
                throw new HttpError(404, 'not_found');
            return new Response(blob.body, { headers: { 'Content-Type': file.type, 'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.name)}`, 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-store', 'Content-Security-Policy': "sandbox" } });
        }
        if (request.method !== 'POST')
            throw new HttpError(405, 'method_not_allowed');
        await paid(request, env);
        const b = object(await readJson(request, path === 'assess' || path === 'files' ? 3000000 : path === 'rooms' ? 100000 : 24000));
        if (path === 'speech') {
            if (!isText(b.text, 2000) || !['en', 'km'].includes(String(b.language)) || !['normal', 'slower'].includes(String(b.speed)))
                throw new HttpError(400, 'invalid_input');
            const lang = b.language as 'en' | 'km', voice = String(b.voice || voices[lang][0]);
            if (!(voices[lang] as readonly string[]).includes(voice))
                throw new HttpError(400, 'invalid_voice');
            speechConfig(env);
            const result = await provider(await fetcher(`https://${env.AZURE_SPEECH_REGION}.tts.speech.microsoft.com/cognitiveservices/v1`, { method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(25000), headers: { 'Ocp-Apim-Subscription-Key': env.AZURE_SPEECH_KEY!, 'Content-Type': 'application/ssml+xml', 'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3', 'User-Agent': 'KhmerOneLearningStudio' }, body: `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${lang === 'km' ? 'km-KH' : 'en-US'}"><voice name="${voice}"><prosody rate="${b.speed === 'slower' ? '-20%' : '0%'}">${xml(b.text)}</prosody></voice></speak>` }));
            if (!/^(audio\/|application\/octet-stream)/i.test(result.headers.get('Content-Type') || ''))
                throw new HttpError(502, 'invalid_audio');
            const bytes = await limitedResponse(result, 4 * 1024 * 1024);
            if (!bytes.length)
                throw new HttpError(502, 'empty_audio');
            return new Response(bytes, { headers: { 'Content-Type': 'audio/mpeg', 'Content-Disposition': 'attachment; filename="khmerone-lesson.mp3"', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
        }
        if (path === 'translate') {
            if (!isText(b.text, 4000) || !['en', 'km'].includes(String(b.from)) || !['en', 'km'].includes(String(b.to)) || b.from === b.to)
                throw new HttpError(400, 'invalid_input');
            if (!env.AZURE_TRANSLATOR_KEY || !env.AZURE_TRANSLATOR_REGION)
                throw new HttpError(503, 'translation_not_configured');
            const r = await provider(await fetcher(`https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${b.from}&to=${b.to}`, { method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(25000), headers: { 'Ocp-Apim-Subscription-Key': env.AZURE_TRANSLATOR_KEY, 'Ocp-Apim-Subscription-Region': env.AZURE_TRANSLATOR_REGION, 'Content-Type': 'application/json' }, body: JSON.stringify([{ Text: b.text }]) }));
            const data = JSON.parse(new TextDecoder().decode(await limitedResponse(r, 128000)));
            const text = data?.[0]?.translations?.[0]?.text;
            if (typeof text !== 'string' || text.length > 12000)
                throw new HttpError(502, 'provider_response');
            return json({ text, reviewed: false });
        }
        if (path === 'assess') {
            speechConfig(env);
            if (b.consent !== true || !isText(b.reference, 300) || !/^[\x20-\x7E\r\n]+$/.test(b.reference) || typeof b.audio !== 'string' || b.audio.length > 1500000 || !/^[A-Za-z0-9+/]*={0,2}$/.test(b.audio))
                throw new HttpError(400, 'invalid_recording');
            let bytes: Uint8Array<ArrayBuffer>;
            try {
                bytes = Uint8Array.from(atob(b.audio), c => c.charCodeAt(0));
            }
            catch {
                throw new HttpError(400, 'invalid_recording');
            }
            const view = new DataView(bytes.buffer);
            const tag = (a: number, z: number) => String.fromCharCode(...bytes.slice(a, z));
            if (bytes.length < 44 || bytes.length % 2 !== 0 || view.getUint32(4, true) !== bytes.length - 8 || view.getUint32(28, true) !== 32000 || view.getUint16(32, true) !== 2 || tag(0, 4) !== 'RIFF' || tag(8, 12) !== 'WAVE' || tag(12, 16) !== 'fmt ' || view.getUint32(16, true) !== 16 || view.getUint16(20, true) !== 1 || view.getUint16(22, true) !== 1 || view.getUint32(24, true) !== 16000 || view.getUint16(34, true) !== 16 || tag(36, 40) !== 'data' || view.getUint32(40, true) !== bytes.length - 44 || (bytes.length - 44) / 32000 > 25 || (bytes.length - 44) < 1600)
                throw new HttpError(400, 'invalid_recording');
            const assessment = btoa(JSON.stringify({ ReferenceText: b.reference, GradingSystem: 'HundredMark', Granularity: 'Phoneme', Dimension: 'Comprehensive', EnableMiscue: true }));
            const r = await provider(await fetcher(`https://${env.AZURE_SPEECH_REGION}.stt.speech.microsoft.com/speech/recognition/conversation/cognitiveservices/v1?language=en-US&format=detailed`, { method: 'POST', redirect: 'manual', signal: AbortSignal.timeout(30000), headers: { 'Ocp-Apim-Subscription-Key': env.AZURE_SPEECH_KEY!, 'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000', 'Pronunciation-Assessment': assessment }, body: bytes }));
            const data = JSON.parse(new TextDecoder().decode(await limitedResponse(r, 256000)));
            if (data.RecognitionStatus !== 'Success' || !data.NBest?.[0])
                throw new HttpError(422, 'speech_not_recognized');
            const best = data.NBest[0];
            const a = best.PronunciationAssessment || best;
            const score = (v: unknown) => typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(100, v)) : null;
            return json({ scores: { accuracy: score(a.AccuracyScore), fluency: score(a.FluencyScore), completeness: score(a.CompletenessScore), pronunciation: score(a.PronScore) }, words: (Array.isArray(best.Words) ? best.Words : []).slice(0, 100).map((w: Record<string, unknown>) => { const p = (w.PronunciationAssessment || w) as Record<string, unknown>; return { word: typeof w.Word === 'string' ? w.Word.slice(0, 80) : '', accuracy: score(p.AccuracyScore), error: ['None', 'Omission', 'Insertion', 'Mispronunciation'].includes(String(p.ErrorType)) ? p.ErrorType : 'None' }; }) });
        }
        if (path === 'rooms') {
            if (!env.QUIZ_ROOMS)
                throw new HttpError(503, 'rooms_not_configured');
            if (!isQuiz(b.quiz))
                throw new HttpError(400, 'invalid_quiz');
            for (let i = 0; i < 3; i++) {
                const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789', code = Array.from(crypto.getRandomValues(new Uint8Array(8)), x => alphabet[x % 32]).join('');
                const token = randomToken();
                const response = await env.QUIZ_ROOMS.get(env.QUIZ_ROOMS.idFromName(code)).fetch('https://room/init', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ quiz: b.quiz, hostHash: await digest(token) }) });
                if (response.status === 409)
                    continue;
                if (!response.ok)
                    throw new HttpError(502, 'room_failed');
                return json({ code, token, role: 'host' }, 201);
            }
            throw new HttpError(503, 'room_failed');
        }
        if (path === 'files') {
            await requireEditor(request, env.LEARNING_ADMIN_KEY);
            if (!env.LEARNING_FILES || !env.LEARNING_DB)
                throw new HttpError(503, 'uploads_not_configured');
            if (!isText(b.name, 100) || typeof b.data !== 'string' || b.data.length > 2800000 || !['application/pdf', 'image/png', 'image/jpeg', 'text/plain'].includes(String(b.type)))
                throw new HttpError(400, 'invalid_file');
            let bytes: Uint8Array<ArrayBuffer>;
            try {
                bytes = Uint8Array.from(atob(b.data), c => c.charCodeAt(0));
            }
            catch {
                throw new HttpError(400, 'invalid_file');
            }
            if (!bytes.length || bytes.length > 2 * 1024 * 1024)
                throw new HttpError(413, 'too_large');
            const type = String(b.type);
            if ((type === 'application/pdf' && new TextDecoder().decode(bytes.slice(0, 5)) !== '%PDF-') || (type === 'image/png' && bytes.slice(0, 8).join(',') !== '137,80,78,71,13,10,26,10') || (type === 'image/jpeg' && !(bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)))
                throw new HttpError(400, 'invalid_file');
            if (type === 'text/plain') {
                try {
                    new TextDecoder('utf-8', { fatal: true }).decode(bytes);
                }
                catch {
                    throw new HttpError(400, 'invalid_file');
                }
            }
            const id = crypto.randomUUID(), name = String(b.name).replace(/[\r\n\\/]/g, '_');
            await env.LEARNING_FILES.put(`learning/${id}`, bytes, { httpMetadata: { contentType: type } });
            try {
                await env.LEARNING_DB.prepare('INSERT INTO learning_files(id,name,type,size,created_at) VALUES(?,?,?,?,?)').bind(id, name, type, bytes.length, new Date().toISOString()).run();
            }
            catch (e) {
                await env.LEARNING_FILES.delete(`learning/${id}`);
                throw e;
            }
            return json({ id, name }, 201);
        }
        if (path === 'resources') {
            await requireEditor(request, env.LEARNING_ADMIN_KEY);
            if (!env.LEARNING_DB)
                throw new HttpError(503, 'exchange_not_configured');
            if (!isResource(b))
                throw new HttpError(400, 'invalid_resource');
            if (b.attachmentId && !await env.LEARNING_DB.prepare('SELECT id FROM learning_files WHERE id=?').bind(b.attachmentId).first())
                throw new HttpError(400, 'invalid_file');
            const id = crypto.randomUUID();
            await env.LEARNING_DB.prepare('INSERT INTO learning_resources(id,title,school,province,kind,subject,description,url,lat,lng,attachment_id,status,created_at) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id, b.title, b.school, b.province, b.kind, b.subject, b.description, b.url, b.lat, b.lng, b.attachmentId || null, 'pending', new Date().toISOString()).run();
            return json({ id, status: 'pending' }, 201);
        }
        if (path === 'moderate') {
            await requireEditor(request, env.LEARNING_ADMIN_KEY);
            if (!env.LEARNING_DB)
                throw new HttpError(503, 'exchange_not_configured');
            if (!isText(b.id, 36) || !['approved', 'rejected'].includes(String(b.status)))
                throw new HttpError(400, 'invalid_input');
            const r = await env.LEARNING_DB.prepare('UPDATE learning_resources SET status=? WHERE id=?').bind(b.status, b.id).run();
            if (!r.meta.changes)
                throw new HttpError(404, 'not_found');
            return json({ ok: true });
        }
        throw new HttpError(404, 'not_found');
    }
    catch (e) {
        if (e instanceof HttpError)
            return json({ error: e.code }, e.status);
        if (e instanceof Error && ['TimeoutError', 'AbortError'].includes(e.name))
            return json({ error: 'service_timeout' }, 504);
        return json({ error: 'service_failed' }, 502);
    }
}
