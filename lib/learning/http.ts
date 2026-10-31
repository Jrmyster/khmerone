export class HttpError extends Error {
    status: number;
    code: string;
    constructor(status: number, code: string) { super(code); this.status = status; this.code = code; }
}
export const json = (data: unknown, status = 200) => Response.json(data, { status, headers: { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' } });
export async function readBytes(request: Request, max: number) {
    if (Number(request.headers.get('content-length')) > max)
        throw new HttpError(413, 'too_large');
    const reader = request.body?.getReader();
    if (!reader)
        return new Uint8Array(0);
    const chunks: Uint8Array[] = [];
    let length = 0;
    try {
        while (true) {
            const { value, done } = await reader.read();
            if (done)
                break;
            length += value.length;
            if (length > max) {
                await reader.cancel();
                throw new HttpError(413, 'too_large');
            }
            chunks.push(value);
        }
    }
    finally {
        reader.releaseLock();
    }
    const out = new Uint8Array(length);
    let n = 0;
    for (const c of chunks) {
        out.set(c, n);
        n += c.length;
    }
    return out;
}
export async function readJson(request: Request, max = 20000): Promise<unknown> {
    if (request.headers.get('Content-Type')?.split(';')[0] !== 'application/json')
        throw new HttpError(415, 'json_required');
    const bytes = await readBytes(request, max);
    try {
        return JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(bytes));
    }
    catch {
        throw new HttpError(400, 'invalid_input');
    }
}
export function sameOrigin(request: Request) { const o = request.headers.get('Origin'); if ((o && o !== new URL(request.url).origin) || request.headers.get('Sec-Fetch-Site') === 'cross-site')
    throw new HttpError(403, 'origin_not_allowed'); }
export async function digest(text: string) { return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))), b => b.toString(16).padStart(2, '0')).join(''); }
export const randomToken = () => crypto.randomUUID() + crypto.randomUUID();
export async function requireEditor(request: Request, secret?: string) {
    if (!secret || secret.length < 32)
        throw new HttpError(503, 'editor_not_configured');
    const token = request.headers.get('Authorization')?.replace(/^Bearer /, '') || '';
    if (token.length > 200 || await digest(token) !== await digest(secret))
        throw new HttpError(401, 'editor_required');
}
