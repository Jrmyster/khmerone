# Shared Khmer One experience

## Plan and implementation

1. **Navigation:** put the same responsive Home / Tools / Search / Low data / Feedback toolbar in the root layout, with native links. Generate the standalone Engine Lab toolbar from the same `lib/site-navigation.ts` source. Tool-specific controls stay within their tools. Tool menu supports keyboard navigation and Escape. No external catalog app is modified.
2. **Low data:** save a device preference under `khmerone-low-data`; respect the browser Save-Data preference on first visit. Render decorative images, mascot and animated scenery only after the preference is known. Keep instructional diagrams and text. Audio has `preload=none` and generation/playback requires a click; ambient audio already requires a click. Switching on cannot undo bytes previously downloaded. The setting also applies to Engine Lab; its instructional interactive model is retained.
3. **Review labels:** show pending-teacher-review labels on Khmer content and specific dictionary/story/toolkit items. Never treat publication, local corrections or a translation author checkbox as teacher approval. `data/contentReviews.ts` starts empty because no teacher approvals were supplied. A reviewed record includes the exact text snapshot, teacher name and date. `matchingReview` invalidates the label when the text changes. Downloads retain conservative draft notices; a local exporter check is explicitly distinguished from teacher review.
4. **Feedback:** toolbar opens an accessible native dialog with category, message and a restricted page reference. POST to the existing learning service; validate lengths, same-origin requests, rate limit and use parameterized D1 writes. Retain an idempotency UUID across failed retries. Do not send arbitrary URL query strings, search terms or fragments. Store no IP address or contact information. A private `/feedback-inbox` uses the existing editor key (memory only), cursor pagination and a Resolve action. Feedback never enters public search or service-worker caches.

## Recording a real teacher review

Only add a review after the named teacher has checked the entire specified Khmer text. Obtain permission to display the teacher's name. Record the review in `data/contentReviews.ts` and deploy through normal source review.

- `dictionary:<id>` snapshot: Khmer term, definition and example joined with newline.
- `story:<id>` snapshot: Khmer title, paragraph texts, then `JSON.stringify(story.quiz.km)`, joined with newline.
- `toolkit:<unit-id>:km:<kind>` snapshot: title, body, answer key joined with newline. Customized output invalidates a prior snapshot.

Do not copy example approvals into production. Empty registry = no teacher-reviewed labels. Review of interface text is separate from review of an individual lesson.

## Release

Apply `migrations/0002_feedback.sql` to the existing learning D1 database **before** deploying. The schema is additive and keeps existing resources intact. Existing editor credentials are reused; no new secrets are needed.

From the existing authenticated Windows checkout (with its `learning-infra.json` retained):

```powershell
pnpm install --frozen-lockfile
pnpm run setup:learning
pnpm run build
pnpm run deploy:cloudflare:check
pnpm run deploy:cloudflare
```

`setup:learning` reuses named storage and applies pending migrations; deploy retains dashboard variables through `--keep-vars`. Never deploy a clean cloud checkout with missing `learning-infra.json`: it lacks the live database and bucket bindings. The current cloud workspace has no Wrangler authentication; deployment must wait for an authenticated environment.

## Acceptance checks

- Home, all learning tools, Audio Maker, Toolkit, Computer Engineering, Search and standalone Engine Lab show the same navigation destinations; check phone-width layout and keyboard focus.
- Enable low data, reload, verify decorative image/audio requests do not occur; generate audio explicitly to confirm availability. Toggle off to restore pictures. Storage-disabled browsers remain usable for the page session.
- Current content shows pending review. A test review matches only the exact snapshot; edits invalidate it. Machine translation never gains teacher approval from its author checkbox.
- Submit a report; retry with the same ID; confirm one D1 row. Unauthorized inbox reads and resolving must fail. Resolve an authorized report and confirm it leaves the open queue. Error/offline submissions preserve message text for retry.
- Run TypeScript, lint, unit tests, real Workers-runtime tests, production build and deployment dry run. No paid Azure calls are needed for this change.

## Verification completed

52 tests passed, including real D1/Workers feedback submission, retry deduplication, private inbox access and resolution. TypeScript and full ESLint passed. The production build, rendering checks across all React tools (including shared navigation and deferred media), and Wrangler deployment dry run passed. The generated standalone Engine Lab toolbar matches the shared source. Browser interaction and mobile visual QA remain unverified: the managed preview could not be opened, and the browser policy subsequently blocked observation. No live Azure calls were made. The remote feedback migration and production deployment are pending Cloudflare authentication and the existing infrastructure bindings.
