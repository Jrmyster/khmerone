export type Language = 'en' | 'km';
export type Bilingual = Record<Language, string>;
export type Question = {
    prompt: string;
    options: string[];
    correct: number;
};
export type Quiz = {
    title: string;
    passage: string;
    language: Language;
    questions: Question[];
};
export type Resource = {
    id?: string;
    title: string;
    school: string;
    province: string;
    kind: 'material' | 'equipment' | 'need';
    subject: string;
    description: string;
    url: string;
    lat: number | null;
    lng: number | null;
    attachmentId?: string;
    status?: string;
};
export const voices = { km: ['km-KH-SreymomNeural', 'km-KH-PisethNeural'], en: ['en-US-JennyNeural', 'en-US-GuyNeural'] } as const;
export const provinces = ['Banteay Meanchey', 'Battambang', 'Kampong Cham', 'Kampong Chhnang', 'Kampong Speu', 'Kampong Thom', 'Kampot', 'Kandal', 'Kep', 'Koh Kong', 'Kratie', 'Mondulkiri', 'Oddar Meanchey', 'Pailin', 'Phnom Penh', 'Preah Sihanouk', 'Preah Vihear', 'Prey Veng', 'Pursat', 'Ratanakiri', 'Siem Reap', 'Stung Treng', 'Svay Rieng', 'Takeo', 'Tboung Khmum'];
export function isText(v: unknown, max: number): v is string { return typeof v === 'string' && v.trim().length > 0 && Array.from(v).length <= max && !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/.test(v) && Array.from(v).every(c => { const n = c.codePointAt(0)!; return n < 0xD800 || n > 0xDFFF; }); }
export function isQuiz(v: unknown): v is Quiz {
    if (!v || typeof v !== 'object')
        return false;
    const q = v as Quiz;
    return isText(q.title, 100) && typeof q.passage === 'string' && q.passage.length <= 2000 && ['en', 'km'].includes(q.language) && Array.isArray(q.questions) && q.questions.length >= 1 && q.questions.length <= 20 && q.questions.every(x => x && isText(x.prompt, 300) && Array.isArray(x.options) && x.options.length >= 2 && x.options.length <= 4 && x.options.every(o => isText(o, 150)) && Number.isInteger(x.correct) && x.correct >= 0 && x.correct < x.options.length);
}
export function httpsUrl(v: unknown): boolean { if (v === '')
    return true; try {
    const u = new URL(String(v));
    return u.protocol === 'https:' && !u.username && !u.password && u.hostname !== 'localhost' && !/^\d+\.\d+\.\d+\.\d+$/.test(u.hostname);
}
catch {
    return false;
} }
export function isResource(v: unknown): v is Resource {
    if (!v || typeof v !== 'object')
        return false;
    const r = v as Resource;
    return isText(r.title, 120) && isText(r.school, 120) && provinces.includes(r.province) && ['material', 'equipment', 'need'].includes(r.kind) && isText(r.subject, 60) && isText(r.description, 1500) && typeof r.url === 'string' && r.url.length <= 1000 && httpsUrl(r.url) && ((r.lat === null && r.lng === null) || (typeof r.lat === 'number' && Number.isFinite(r.lat) && r.lat >= 9 && r.lat <= 15 && typeof r.lng === 'number' && Number.isFinite(r.lng) && r.lng >= 102 && r.lng <= 108)) && (!r.attachmentId || /^[a-f0-9-]{36}$/.test(r.attachmentId));
}
export function escapeHtml(text: string) { return text.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!)); }
export function scoreQuiz(q: Quiz, answers: number[]) { return q.questions.reduce((s, x, i) => s + Number(answers[i] === x.correct), 0); }
