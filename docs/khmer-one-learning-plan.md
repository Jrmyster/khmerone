# Khmer One learning suite — implementation plan

Implementation status: all eight source implementations are complete. Automated verification passed; live activation, browser checks and Khmer teacher review remain. See [release checks](learning-release-checks.md) and [deployment steps](learning-deployment.md).

## Goal
Add all eight proposed tools to the existing Khmer One portal, preserving its working Khmer Audio Maker, existing apps and Cloudflare deployment. Deliver a usable first release, not placeholder links. Khmer and English UI; mobile-first; keyboard-accessible; no student accounts required.

## Release sequence and acceptance criteria
1. **Foundation**: restore speech redirect/manual fix and native navigation; add a `/learning` hub, eight route cards, common error handling, bounded server requests and rate limits. Secrets remain server-side. Capability checks explain missing services without pretending calls succeeded.
2. **Talking STEM Dictionary**: 50 bilingual seed terms with definitions/examples, subject search, matching practice, English/Khmer audio, local corrections, and downloadable offline HTML topic packs. Seed translations are drafts pending a Khmer teacher's review, never labelled teacher-approved.
3. **English Speaking Practice**: English reference phrases, model audio, microphone recording with explicit permission, local playback, separate consented submission to Azure pronunciation assessment, per-word feedback. No Khmer pronunciation scores; no grading or recording retention.
4. **Listening Quiz Maker**: passage + editable multiple-choice questions, generate narration, student attempt and scoring, JSON export/import and local saving. JSON is validated; answers never evaluated as code.
5. **Bilingual Story Library**: original bilingual short stories, paragraph playback, comprehension questions, reading progress, and downloadable offline HTML. Draft translations clearly marked.
6. **School Announcement Maker**: editable event/schedule/parent templates in both languages; normal/slower playback and MP3 export.
7. **Lesson Translation Workbench**: English↔Khmer translation, side-by-side editing, separate teacher approval checkbox for the edited result, print/export, narration. Translation uses a separate Translator resource/key.
8. **Live Classroom Quiz**: host creates room from quiz, shares short code, students join with nicknames, host advances questions/reveals answers, server scores one answer per round, live results via polling. Durable Objects own state; host and player tokens isolate permissions; rooms expire and capacity is bounded.
9. **School Connect Resource Exchange**: searchable school/resource/needs listings, province and subject filters, schematic geographic map plus location links, public HTTPS resource links, school-editor submissions and moderation. D1 persists approved/pending entries. Editor secret is never sent to public clients; submitted listings are pending until approved. Optional R2 file upload is restricted to editor-authorized PDF/text/images with size and type checks; downloads force attachment.
10. **Release checks**: server validation/auth/room-state tests; TypeScript and production build; browser QA for navigation, quiz attempts, downloads, forms, and mobile layout. External Azure calls and production multi-user/storage tests require configured bindings and credentials and are reported separately.

## Infrastructure
- Existing `AZURE_SPEECH_KEY`, `AZURE_SPEECH_REGION` and `SPEECH_RATE_LIMITER` continue to serve the Audio Maker.
- New `AZURE_TRANSLATOR_KEY`, `AZURE_TRANSLATOR_REGION` for translations.
- `LEARNING_ADMIN_KEY`: long random server secret for trusted school editors/moderators. Not a student account or public invite code.
- `LEARNING_RATE_LIMITER`: shared per-IP cap on new paid operations and mutations, fail-closed when unavailable.
- `LEARNING_DB`: D1; migration creates resource exchange entries and attachment metadata.
- `LEARNING_FILES`: private R2 bucket; uploads and retrieval are authorized/approved through the Worker.
- `QUIZ_ROOMS`: SQLite Durable Object class `QuizRoom`; bounded rooms, hashed credentials, expiry cleanup.
- Deployment setup script provisions named resources only when absent, writes their non-secret IDs to an ignored local config, applies the migration, then the ordinary build/deploy path publishes.

## Offline and privacy boundaries
Offline packs are standalone HTML containing reviewed-by-user text and any explicitly included generated audio, not a promise that cloud speech/translation works offline. Shared listings intentionally persist public school information. Private drafts stay on-device until the user chooses a specific export or submission. Recordings are held only in browser memory and sent to Azure only after the learner clicks Assess; do not persist recordings or log lesson content/keys. Learning feedback is advisory, not an exam grade.

## Deployment and source control
Primary target remains `khmerone.jaredrobertw.workers.dev`. Recover source from the saved archive, compare against GitHub main, preserve all unrelated files, and include the known post-archive fixes. Produce a branch/PR and a complete source release with setup instructions. Do not claim the production deployment or new Azure resource configuration is complete unless verified. The original Sites deployment is separate; do not replace the user's configured Azure-backed Cloudflare site with it.
