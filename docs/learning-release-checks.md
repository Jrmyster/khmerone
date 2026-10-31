# Learning suite release checks

## Implemented

All eight proposed tools have working source implementations and are linked from the main app catalog and `/learning` hub:

| Tool | Included in this release |
|---|---|
| Talking STEM Dictionary | 50 bilingual terms across five subjects, definitions and examples, search, topic filters, matching practice, speech, local corrections, offline text packs |
| English Speaking Practice | Model speech, microphone recording capped at 25 seconds, local replay, explicit submission consent, English pronunciation and word feedback |
| Listening Quiz Maker | Passage editor, up to 20 questions, 2–4 choices, correct-answer selection, student attempts and scores, speech, validated JSON import/export, local drafts |
| Bilingual Story Library | Three original stories, side-by-side paragraphs, paragraph speech, comprehension questions, reading progress, offline text packs |
| School Announcement Maker | Three bilingual templates, editable text, voice/speed selection, playback, MP3 and text downloads |
| Lesson Translation Workbench | English↔Khmer Azure translation, editable result, review marker reset on edits, full-text printable/exportable handout, narration |
| Live Classroom Quiz | Host/learner roles, eight-character code, 40-player capacity, server scoring, answer hiding until reveal, duplicate-answer rejection, polling, tab session recovery, two-hour expiry |
| School Connect Exchange | Search and province/type filters, school/subject metadata, coordinate overview and street-map links, editor submissions, pending/approved/rejected states, private attachment review, publication and withdrawal |

Includes Cloudflare resource setup and post-deployment verification scripts. The existing Audio Maker retains native navigation and manual redirects; safe diagnostic headers and accurate service-error wording are restored in source.

## Checks passed in this workspace

- `pnpm run lint`: no errors or warnings.
- `tsc --noEmit`: passed.
- `pnpm test`: **41 tests passed** across the existing project and the learning suite.
- Real workerd integration test: two players in a Durable Object room; host permissions; hidden answers; duplicate-answer protection; separate player scores; D1 pending/approved/rejected behavior; R2 public/private/editor-only retrieval; original and new speech routes.
- `pnpm build`: production build passed.
- `pnpm run test:production`: real workerd server-rendering checks passed for `/learning`, all eight tool pages, and `/teacher-audio`; an unknown tool returns 404.
- `pnpm run deploy:cloudflare:check`: deployment dry run passed, including the QuizRoom export, SQLite class migration, original speech limiter and two new limiters.
- CI now runs the full test suite and production-rendering check on Node 24.

Speech, translation and assessment provider responses in automated tests are mocks. These tests verify request formatting and response handling, not the user's live Azure resources.

## Deployment and audio correction (2026-10-29)

The owner deployed the learning suite to `khmerone.jaredrobertw.workers.dev`, version `5f015eb5-8a88-443a-ac73-acb498fd6207`. D1, R2, Durable Objects, rate limiters, and the new Translator/editor secrets are configured. Page and configuration checks passed.

Live acceptance checks then found two failures: learning speech returned `502` with `provider_http_400`, and translation returned `provider_configuration`. The learning speech request omitted Azure's required `User-Agent`; the original Audio Maker already sends it. This patch restores that header. The Workers-runtime provider mock now rejects missing application headers and covers all four learning voices at both speeds. The regression failed before the fix and passed afterward. All 41 tests, TypeScript, lint, the production build, production page rendering, and the deployment dry run passed with the fix.

The correction is prepared for deployment from the owner's authenticated PowerShell session. Live audio success after the correction remains to be checked. The translation credential rejection is a separate unresolved configuration issue; see the troubleshooting steps in [the deployment guide](learning-deployment.md).

`verify:learning` now labels binding checks CONFIGURED, rather than READY. Its optional `--services` mode makes real English/Khmer audio and translation requests and requires nonempty results.

## Remaining acceptance checks

1. Publish the correction and run `pnpm run verify:learning --services`. Verify the existing Translator resource's key and region if authentication is still rejected. Listen to the generated audio and review the translation separately.
2. Test real pronunciation feedback, a two-device quiz, and an approved resource attachment.
3. Complete desktop/mobile browser checks, keyboard use, downloads and real microphone recording. Browser visual and interactive QA remains **unverified**. Server-rendering checks are not a replacement for these checks.
4. Ask a Khmer teacher to review the seed definitions, translations and templates. The interface marks these as drafts and does not claim teacher approval.
