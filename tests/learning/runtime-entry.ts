// Test entry only: all provider requests are deterministic mocks, never real Azure calls.
import { handleLearning, type LearningEnv } from '../../lib/learning/server';
import { handleTeacherAudio, type SpeechEnvironment } from '../../lib/teacher-audio-server';
export { QuizRoom } from '../../lib/learning/quiz-room';
const limiter = { limit: async () => ({ success: true }) };
const mockProvider: typeof fetch = async (url, init) => {
    const outgoing = new Request(url, init);
    if (outgoing.redirect !== 'manual') throw new Error('Expected manual redirect handling');
    if (outgoing.url === 'https://worldweather.wmo.int/en/json/348_en.json') {
        const date = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
        return Response.json({ city: { cityId: 348, timeZone: '+0700', forecast: {
            timeZone: 'Local', issueDate: date + ' 00:00:00',
            forecastDay: [{forecastDate: date, weather: 'Drizzle', minTemp: '24', maxTemp: '32'}],
        } } });
    }
    // Azure requires an application User-Agent for synthesis; workerd does not add one.
    // Match that contract so a missing header cannot pass with a permissive mock.
    const agent = outgoing.headers.get('User-Agent');
    if (!agent || agent.length >= 255)
        return new Response('Missing or invalid application header', { status: 400 });
    return new Response(new Uint8Array([73, 68, 51, 42]), { headers: { 'Content-Type': 'audio/mpeg' } }); };
const runtimeWorker = { fetch(request: Request, env: LearningEnv & SpeechEnvironment) { const runtime = { ...env, LEARNING_RATE_LIMITER: limiter, ROOM_RATE_LIMITER: limiter, SPEECH_RATE_LIMITER: limiter }; return new URL(request.url).pathname === '/api/teacher-audio' ? handleTeacherAudio(request, runtime, mockProvider) : handleLearning(request, runtime, mockProvider); } };

export default runtimeWorker;
