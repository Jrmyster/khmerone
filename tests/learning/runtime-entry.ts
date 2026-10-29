// Test entry only: all provider requests are deterministic mocks, never real Azure calls.
import { handleLearning, type LearningEnv } from '../../lib/learning/server';
import { handleTeacherAudio, type SpeechEnvironment } from '../../lib/teacher-audio-server';
export { QuizRoom } from '../../lib/learning/quiz-room';
const limiter = { limit: async () => ({ success: true }) };
const mockProvider: typeof fetch = async (_url, init) => { if (init?.redirect !== 'manual')
    throw new Error('Cloudflare requires manual redirects');
    // Azure requires an application User-Agent for synthesis; workerd does not add one.
    // Match that contract so a missing header cannot pass with a permissive mock.
    const agent = new Headers(init.headers).get('User-Agent');
    if (!agent || agent.length >= 255)
        return new Response('Missing or invalid application header', { status: 400 });
    return new Response(new Uint8Array([73, 68, 51, 42]), { headers: { 'Content-Type': 'audio/mpeg' } }); };
const runtimeWorker = { fetch(request: Request, env: LearningEnv & SpeechEnvironment) { const runtime = { ...env, LEARNING_RATE_LIMITER: limiter, ROOM_RATE_LIMITER: limiter, SPEECH_RATE_LIMITER: limiter }; return new URL(request.url).pathname === '/api/teacher-audio' ? handleTeacherAudio(request, runtime, mockProvider) : handleLearning(request, runtime, mockProvider); } };

export default runtimeWorker;
