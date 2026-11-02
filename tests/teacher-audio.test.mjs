import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { AUDIO_VOICES, audioSsml, validAudioInput } from "../lib/teacher-audio.ts";
import { handleTeacherAudio } from "../lib/teacher-audio-server.ts";

const input = { text: "សួស្តីកូនៗ!", voice: AUDIO_VOICES[0], speed: "normal" };
const environment = () => ({ AZURE_SPEECH_KEY: "test-secret", AZURE_SPEECH_REGION: "southeastasia", SPEECH_RATE_LIMITER: { limit: async () => ({ success: true }) } });
const request = (body = input, headers = {}) => new Request("https://khmerone.com/api/teacher-audio", {
  method: "POST", headers: { "Content-Type": "application/json", Origin: "https://khmerone.com", ...headers }, body: JSON.stringify(body),
});
const mustNotFetch = async () => { assert.fail("invalid or unavailable requests must not reach Azure"); };

test("validates text, XML characters, voice allowlist and speaking speed", () => {
  assert.equal(validAudioInput(input), true);
  for (const patch of [{ text: " " }, { text: "ក".repeat(2001) }, { text: "x\u0000" }, { text: "\ud800" }, { voice: '<voice name="bad">' }, { speed: "fast" }]) {
    assert.equal(validAudioInput({ ...input, ...patch }), false);
  }
  assert.equal(validAudioInput({ ...input, text: "ក".repeat(2000) }), true);
  assert.equal(validAudioInput({ ...input, text: "Hello\nសួស្តី 🧪" }), true);
  assert.equal(validAudioInput(null), false);
});

test("treats supplied SSML as literal text and preserves Khmer", () => {
  const ssml = audioSsml({ ...input, text: '<audio src="https://evil.example/">&\'សួស្តី</audio>', speed: "slower" });
  assert.ok(ssml.includes('&lt;audio src=&quot;https://evil.example/&quot;&gt;&amp;&apos;សួស្តី&lt;/audio&gt;'));
  assert.ok(ssml.includes('rate="-20%"'));
  assert.ok(!ssml.includes("<audio"));
});

test("returns MP3 for both voices and speeds with secret only in upstream header", async () => {
  for (const voice of AUDIO_VOICES) for (const speed of ["normal", "slower"]) {
    let calls = 0;
    const response = await handleTeacherAudio(request({ ...input, voice, speed }), environment(), async (url, options) => {
      calls++;
      assert.equal(url, "https://southeastasia.tts.speech.microsoft.com/cognitiveservices/v1");
      assert.equal(options.headers["Ocp-Apim-Subscription-Key"], "test-secret");
      assert.equal(options.headers["X-Microsoft-OutputFormat"], "audio-24khz-48kbitrate-mono-mp3");
      assert.equal(options.redirect, "manual");
      assert.ok(options.body.includes(`name="${voice}"`));
      assert.ok(options.body.includes(`rate="${speed === "slower" ? "-20%" : "0%"}"`));
      return new Response(new Uint8Array([73, 68, 51, 42]), { headers: { "Content-Type": "audio/mpeg" } });
    });
    assert.equal(calls, 1);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("Content-Type"), "audio/mpeg");
    assert.match(response.headers.get("Cache-Control"), /no-store/);
    assert.match(response.headers.get("Content-Disposition"), new RegExp(`${speed}\\.mp3`));
    assert.equal(JSON.stringify([...response.headers]).includes("test-secret"), false);
    assert.deepEqual([...new Uint8Array(await response.arrayBuffer())], [73, 68, 51, 42]);
  }
});

test("rejects methods, cross-origin traffic and incorrect content types", async () => {
  const get = await handleTeacherAudio(new Request("https://khmerone.com/api/teacher-audio"), environment(), mustNotFetch);
  assert.equal(get.status, 405); assert.equal(get.headers.get("Allow"), "POST");
  for (const headers of [{ Origin: "https://other.example" }, { "Sec-Fetch-Site": "cross-site" }]) {
    assert.equal((await handleTeacherAudio(request(input, headers), environment(), mustNotFetch)).status, 403);
  }
  assert.equal((await handleTeacherAudio(request(input, { "Content-Type": "text/plain" }), environment(), mustNotFetch)).status, 415);
});

test("enforces streamed byte limits without trusting Content-Length", async () => {
  const response = await handleTeacherAudio(request({ ...input, text: "ក".repeat(10000) }), environment(), mustNotFetch);
  assert.equal(response.status, 413);
  assert.equal((await handleTeacherAudio(request({ ...input, text: "ក".repeat(2001) }), environment(), mustNotFetch)).status, 400);
  const broken = new Request("https://khmerone.com/api/teacher-audio", { method: "POST", headers: { "Content-Type": "application/json" }, body: "{oops" });
  assert.equal((await handleTeacherAudio(broken, environment(), mustNotFetch)).status, 400);
});

test("missing secrets, region or limiter fail closed", async () => {
  for (const field of ["AZURE_SPEECH_KEY", "AZURE_SPEECH_REGION", "SPEECH_RATE_LIMITER"]) {
    const env = environment(); delete env[field];
    const response = await handleTeacherAudio(request(), env, mustNotFetch);
    assert.equal(response.status, 503);
    assert.deepEqual(await response.json(), { error: "not_configured" });
  }
  assert.equal((await handleTeacherAudio(request(), { ...environment(), AZURE_SPEECH_REGION: "bad.example/path" }, mustNotFetch)).status, 503);
});

test("uses the Cloudflare client address for throttling and fails closed on limiter errors", async () => {
  const env = environment();
  env.SPEECH_RATE_LIMITER.limit = async ({ key }) => { assert.equal(key, "teacher-audio:192.0.2.1"); return { success: false }; };
  const response = await handleTeacherAudio(request(input, { "CF-Connecting-IP": "192.0.2.1" }), env, mustNotFetch);
  assert.equal(response.status, 429); assert.equal(response.headers.get("Retry-After"), "60");
  env.SPEECH_RATE_LIMITER.limit = async () => { throw new Error("unavailable"); };
  assert.equal((await handleTeacherAudio(request(), env, mustNotFetch)).status, 503);
});

test("maps Azure errors without returning provider bodies or secrets", async () => {
  for (const [upstream, status, code] of [[401, 503, "not_configured"], [403, 503, "not_configured"], [429, 429, "speech_busy"], [500, 502, "speech_failed"]]) {
    const response = await handleTeacherAudio(request(), environment(), async () => new Response("private provider details test-secret", { status: upstream }));
    assert.equal(response.status, status); assert.deepEqual(await response.json(), { error: code });
    assert.match(response.headers.get("Cache-Control"), /no-store/);
  }
  const timeout = await handleTeacherAudio(request(), environment(), async () => { throw new DOMException("timed out", "TimeoutError"); });
  assert.deepEqual(await timeout.json(), { error: "speech_timeout" });
});

test("rejects empty, oversized and non-audio upstream success responses", async () => {
  for (const result of [new Response("<html>Error</html>", { headers: { "Content-Type": "text/html" } }), new Response(null, { headers: { "Content-Type": "audio/mpeg" } }), new Response(new Uint8Array(4 * 1024 * 1024 + 1), { headers: { "Content-Type": "audio/mpeg" } })]) {
    assert.equal((await handleTeacherAudio(request(), environment(), async () => result)).status, 502);
  }
});

test("Worker routes speech before the framework handler, and build declares its limiter", async () => {
  const worker = await readFile(new URL("../build/sites-worker.ts", import.meta.url), "utf8");
  assert.ok(worker.indexOf("return handleTeacherAudio(request, env)") < worker.indexOf("return runWithConnectorBinding"));
  const config = await readFile(new URL("../vite.config.ts", import.meta.url), "utf8");
  assert.match(config, /name: "SPEECH_RATE_LIMITER"/);
  assert.match(config, /simple: \{ limit: 5, period: 60 as const \}/);
});
