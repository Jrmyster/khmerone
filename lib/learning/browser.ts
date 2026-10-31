import { escapeHtml } from './contracts.ts';
export const errorMessages: Record<string, string> = { speech_not_configured: 'Speech is not connected yet. Ask the site owner to finish speech setup.', translation_not_configured: 'Translation needs its own Azure Translator connection. Ask the site owner to finish setup.', rooms_not_configured: 'Live rooms are not connected yet. The site owner needs to enable classroom storage.', exchange_not_configured: 'The resource exchange is not connected yet. The site owner needs to finish storage setup.', uploads_not_configured: 'File uploads are not connected yet. You can share an HTTPS resource link instead.', editor_not_configured: 'Editor access has not been set up yet.', editor_required: 'That editor key was not accepted.', limiter_not_configured: 'The service is waiting for the site owner to finish setup.', rate_limited: 'Too many requests at once. Wait a minute and try again.', service_busy: 'The speech or translation service is busy. Wait a minute and try again.', service_timeout: 'The service took too long. Try again with a shorter passage.', service_failed: 'The service could not complete this request. Try again shortly.', provider_configuration: 'The provider did not accept the site connection. Ask the site owner to check its key and region.', speech_not_recognized: 'No clear speech was recognised. Record again in a quieter place.', room_started: 'This quiz has already started. Join the next room.', room_full: 'This room has reached its 40-player limit.', room_expired: 'This room has expired. Ask the host to create a new one.', not_found: 'This item or room was not found.', already_answered: 'You have already answered this question.', round_closed: 'This question has closed. Wait for the next one.', invalid_quiz: 'Check the quiz: it needs a title and 1–20 questions, each with 2–4 nonempty choices.', invalid_resource: 'Check all required fields, the HTTPS link and any coordinates.', invalid_recording: 'Record a clear English phrase of 1–25 seconds and agree to send it for feedback.', invalid_audio: 'This recording could not be read. Please record again.', too_large: 'This file or passage is too large.', consent_required: 'Please agree to send this recording for feedback first.', invalid_input: 'Check your text and choices, then try again.', invalid_file: 'Choose a PDF, PNG, JPEG or plain text file no larger than 2 MB.', invalid_reference: 'Use a short English phrase of up to 300 characters.', invalid_voice: 'Choose one of the available voices.', invalid_language: 'Choose English or Khmer.' };
export async function api<T>(path: string, body?: unknown, token?: string, responseType: 'json' | 'blob' = 'json'): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 45000);
    try {
        const res = await fetch('/api/learning/' + path, { method: body === undefined ? 'GET' : 'POST', headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json' }), ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: body === undefined ? undefined : JSON.stringify(body), signal: controller.signal });
        if (!res.ok) {
            const e = await res.json().catch(() => ({ error: 'service_failed' })) as {
                error: string;
            };
            throw new Error(errorMessages[e.error] || `Request could not finish (${res.status}). Please try again.`, { cause: e.error });
        }
        return (responseType === 'blob' || res.headers.get('Content-Type')?.startsWith('audio/') ? await res.blob() : await res.json()) as T;
    }
    catch (e) {
        if (e instanceof TypeError)
            throw new Error('Cannot reach Khmer One. Check your connection, then try again.');
        if (e instanceof DOMException && e.name === 'AbortError')
            throw new Error(errorMessages.service_timeout);
        throw e;
    }
    finally {
        clearTimeout(timer);
    }
}
export function download(name: string, data: Blob | string, type = 'text/plain;charset=utf-8') { const url = URL.createObjectURL(data instanceof Blob ? data : new Blob([data], { type })); const a = document.createElement('a'); a.href = url; a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(url), 30000); }
export function offlineHtml(title: string, sections: {
    title: string;
    text: string;
}[], note = 'Draft Khmer text: review with a teacher before classroom use.') {
    return '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'"><title>' + escapeHtml(title) + '</title><style>body{font-family:system-ui,sans-serif;max-width:760px;margin:auto;padding:32px;color:#102f35;line-height:1.8}h1{line-height:1.3}section{border-top:1px solid #ccd;padding:16px 0}p{white-space:pre-wrap}small{color:#53646b}@media print{body{padding:0}}</style><body><small>KHMER ONE · OFFLINE READING PACK</small><h1>' + escapeHtml(title) + '</h1><p>' + escapeHtml(note) + '</p>' + sections.map(s => '<section><h2>' + escapeHtml(s.title) + '</h2><p>' + escapeHtml(s.text) + '</p></section>').join('') + '<small>Text-only pack. Audio generation and online activities need an internet connection.</small></body></html>';
}
export async function bytesBase64(blob: Blob) { const bytes = new Uint8Array(await blob.arrayBuffer()); let s = ''; for (let i = 0; i < bytes.length; i += 8192)
    s += String.fromCharCode(...bytes.subarray(i, i + 8192)); return btoa(s); }
export async function recordingToWav(blob: Blob): Promise<Blob> {
    const context = new AudioContext();
    let decoded: AudioBuffer;
    try {
        decoded = await context.decodeAudioData(await blob.arrayBuffer());
    }
    finally {
        await context.close();
    }
    if (decoded.duration < 0.15 || decoded.duration > 26)
        throw new Error('Record a phrase between 1 and 25 seconds.');
    const count = Math.min(25 * 16000, Math.ceil(decoded.duration * 16000));
    const offline = new OfflineAudioContext(1, count, 16000);
    const source = offline.createBufferSource();
    source.buffer = decoded;
    source.connect(offline.destination);
    source.start();
    const rendered = await offline.startRendering();
    const pcm = rendered.getChannelData(0);
    const buf = new ArrayBuffer(44 + pcm.length * 2), v = new DataView(buf);
    const write = (at: number, s: string) => { for (let i = 0; i < s.length; i++)
        v.setUint8(at + i, s.charCodeAt(i)); };
    write(0, 'RIFF');
    v.setUint32(4, 36 + pcm.length * 2, true);
    write(8, 'WAVEfmt ');
    v.setUint32(16, 16, true);
    v.setUint16(20, 1, true);
    v.setUint16(22, 1, true);
    v.setUint32(24, 16000, true);
    v.setUint32(28, 32000, true);
    v.setUint16(32, 2, true);
    v.setUint16(34, 16, true);
    write(36, 'data');
    v.setUint32(40, pcm.length * 2, true);
    pcm.forEach((x, i) => v.setInt16(44 + i * 2, Math.round(Math.max(-1, Math.min(1, x)) * (x < 0 ? 32768 : 32767)), true));
    return new Blob([buf], { type: 'audio/wav' });
}
