import { audioSsml, validAudioInput } from "./teacher-audio.ts";

export type SpeechEnvironment = {
  AZURE_SPEECH_KEY?: string;
  AZURE_SPEECH_REGION?: string;
  SPEECH_RATE_LIMITER?: { limit(options: { key: string }): Promise<{ success: boolean }> };
};
const PRIVATE_HEADERS = { "Cache-Control": "no-store, private", "X-Content-Type-Options": "nosniff" };
const errorResponse = (code: string, status: number, extra: Record<string, string> = {}) =>
  Response.json({ error: code }, { status, headers: { ...PRIVATE_HEADERS, ...extra } });

async function limitedBytes(body: ReadableStream<Uint8Array> | null, limit: number): Promise<Uint8Array<ArrayBuffer>> {
  if (!body) return new Uint8Array(0);
  const reader = body.getReader();
  const chunks: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > limit) { await reader.cancel(); throw new RangeError("body_limit"); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  const result = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { result.set(chunk, offset); offset += chunk.length; }
  return result;
}

/** Called only by the Worker, with runtime secrets. Never logs or persists text/audio. */
export async function handleTeacherAudio(request: Request, env: SpeechEnvironment, fetchSpeech: typeof fetch = fetch): Promise<Response> {
  if (request.method !== "POST") return errorResponse("method_not_allowed", 405, { Allow: "POST" });
  const origin = request.headers.get("Origin");
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get("Sec-Fetch-Site") === "cross-site") {
    return errorResponse("origin_not_allowed", 403);
  }
  if (request.headers.get("Content-Type")?.split(";")[0].trim().toLowerCase() !== "application/json") {
    return errorResponse("json_required", 415);
  }
  if (Number(request.headers.get("Content-Length")) > 16384) return errorResponse("text_too_long", 413);
  let input: unknown;
  try { input = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(await limitedBytes(request.body, 16384))); }
  catch (error) { return errorResponse(error instanceof RangeError ? "text_too_long" : "invalid_input", error instanceof RangeError ? 413 : 400); }
  if (!validAudioInput(input)) return errorResponse("invalid_input", 400);
  const region = env.AZURE_SPEECH_REGION;
  if (!env.AZURE_SPEECH_KEY || !region || !/^[a-z0-9-]{1,40}$/.test(region) || !env.SPEECH_RATE_LIMITER) {
    return errorResponse("not_configured", 503);
  }
  try {
    // Cloudflare supplies this header in production; missing IPs share a bucket.
    const { success } = await env.SPEECH_RATE_LIMITER.limit({ key: `teacher-audio:${request.headers.get("CF-Connecting-IP") || "unknown"}` });
    if (!success) return errorResponse("rate_limited", 429, { "Retry-After": "60" });
  } catch { return errorResponse("temporarily_unavailable", 503); }
  try {
    const response = await fetchSpeech(`https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`, {
      method: "POST",
      redirect: "manual",
      signal: AbortSignal.any([request.signal, AbortSignal.timeout(25000)]),
      headers: {
        "Ocp-Apim-Subscription-Key": env.AZURE_SPEECH_KEY,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3",
        "User-Agent": "KhmerOneTeacherAudioMaker",
      },
      body: audioSsml(input),
    });
    if (!response.ok) {
      await response.body?.cancel();
      if (response.status === 429) return errorResponse("speech_busy", 429, { "Retry-After": "60" });
      if (response.status === 401 || response.status === 403) return errorResponse("not_configured", 503, { "X-Audio-Diagnostic": `azure_http_${response.status}` });
      return errorResponse("speech_failed", 502, { "X-Audio-Diagnostic": `azure_http_${response.status}` });
    }
    const contentType = response.headers.get("Content-Type") || "";
    if (!/^(audio\/|application\/octet-stream)/i.test(contentType)) {
      await response.body?.cancel();
      return errorResponse("speech_failed", 502);
    }
    const audio = await limitedBytes(response.body, 4 * 1024 * 1024);
    if (!audio.length) return errorResponse("speech_failed", 502);
    const voice = input.voice === "km-KH-SreymomNeural" ? "sreymom" : "piseth";
    return new Response(audio, {
      headers: { ...PRIVATE_HEADERS, "Content-Type": "audio/mpeg", "Content-Disposition": `attachment; filename="khmer-lesson-${voice}-${input.speed}.mp3"` },
    });
  } catch (error) {
    const timeout = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    return errorResponse(timeout ? "speech_timeout" : "speech_failed", timeout ? 504 : 502, { "X-Audio-Diagnostic": timeout ? "fetch_timeout" : error instanceof TypeError ? "fetch_type_error" : "fetch_failed" });
  }
}
