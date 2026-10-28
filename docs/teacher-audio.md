# Khmer Teacher Audio Maker

Page: `/teacher-audio`. API: `POST /api/teacher-audio`.

The bilingual page starts in Khmer. It supports Azure's `km-KH-SreymomNeural` and
`km-KH-PisethNeural`, normal or 20% slower speech, three editable classroom
templates, playback, and MP3 download. Changing text or voice/speed clears the
previous result so the download cannot silently refer to older settings.
Playback pauses Khmer One's background music. No account is needed.

## Cloudflare configuration

Use the existing `khmerone` Worker. Keep `AZURE_SPEECH_KEY` as its runtime Secret.
Never add the key to Git, Vite client variables, source code, or build logs.
`AZURE_SPEECH_REGION=southeastasia` is declared in `vite.config.ts`; it must match
the region of the Azure Speech resource that owns the key.

The same configuration declares the `SPEECH_RATE_LIMITER` binding: five requests
per IP per 60 seconds, using namespace `2026102801`. Cloudflare rate limits are
per location and approximate, not a global billing cap. If this namespace is
already used by another Worker on your account, choose a different positive
integer before deploying. Missing credentials or rate binding fail closed with
503. An exhausted Azure quota returns a friendly retry message; retries do not
override a quota and may require waiting for the quota to reset.

The Worker calls Azure using runtime bindings directly before the Vinext handler.
Do not replace `build/sites-worker.ts` with a standalone speech-only Worker: it
also serves the rest of Khmer One. The build emits `dist/server/wrangler.json`.

After installing the pinned dependencies, run:

```sh
node --test tests/teacher-audio.test.mjs
pnpm exec tsc --noEmit
pnpm run build
pnpm run deploy:cloudflare:check
pnpm run deploy:cloudflare
```

The isolated speech tests use Node 22.18+ (or Node 24) to load TypeScript without
downloading a test runner. Deployment requires Cloudflare authentication, or the
existing Git-connected Cloudflare build can deploy a reviewed repository change.

## Privacy and limits

The endpoint accepts at most 16 KiB of JSON and 2,000 Unicode code points of text.
It allowlists voices and speeds, rejects invalid XML characters, escapes text as
SSML, blocks cross-origin browser requests, times out Azure calls at 25 seconds,
and caps returned audio at 4 MiB. MP3 responses and errors use `Cache-Control:
no-store, private`. No text or audio is written to logs, browser storage, D1, R2,
or a cache by this feature. Text is sent to Microsoft Azure for synthesis; this
is not a claim about provider retention policies. Cloudflare maintains temporary
request counters for rate limiting. Saved downloads remain on the user's device.

No real Azure call is made by automated tests. Before classroom release, verify
both voices with a short Khmer sentence on the deployed Worker, test both speeds,
listen for pronunciation, and download/play an MP3 on a phone. Confirm that the
runtime Secret remains present after deployment and that client assets contain
no credentials. Check production Worker logs for errors without logging payloads.

References:
- https://learn.microsoft.com/en-us/azure/ai-services/speech-service/rest-text-to-speech
- https://developers.cloudflare.com/workers/runtime-apis/bindings/rate-limit/

## Verification for this source package

2026-10-28: all 26 project tests passed on Node 24.15.0, including the 10 speech
endpoint tests for both voices/speeds, SSML escaping, input limits, throttling,
missing settings, provider errors, and MP3 response handling. Full TypeScript
checking and the production build passed after dependencies were installed.
Wrangler's deployment dry run accepted the bundle and rate-limit/region bindings;
its attempt to write a log outside the workspace was denied. A targeted lint
check identified an existing mount-time state update in BackgroundAudio.tsx.
Browser verification was blocked by a localhost permission/approval failure.
Live Azure synthesis and deployment remain unverified. This package is source
code, not a deployed release.
