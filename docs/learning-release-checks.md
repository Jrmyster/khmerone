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

## Still required before calling the production rollout complete

1. Authenticate Wrangler to the user's Cloudflare account. `wrangler whoami` reported **not authenticated** in this workspace. No production deployment was attempted.
2. Provision/bind the D1 database and private R2 bucket and apply the migration with `pnpm run setup:learning`.
3. Add the Translator key/region and editor secret, build and deploy using [the deployment guide](learning-deployment.md). Existing Speech secrets must remain on the Worker.
4. Test one real operation against each live Azure service, a two-device quiz, and an approved resource attachment. Confirm quotas and budget alerts in the user's accounts.
5. Complete desktop/mobile browser checks, keyboard use, downloads and real microphone recording. The managed preview service returned a URL but refused connections; a local execution-profile repair did not restore the browser route. Browser visual and interactive QA is therefore **unverified**. Server-rendering checks are not a replacement for these checks.
6. Ask a Khmer teacher to review the seed definitions, translations and templates. The interface marks these as drafts and does not claim teacher approval.

The new features are implemented in source. They have not been activated at the user's production Cloudflare address by this release preparation.
