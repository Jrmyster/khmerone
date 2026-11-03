# How Your Body Works

Entry: `/body-works/index.html`. Six short introductory Khmer/English lessons cover cells and homeostasis; heart/lungs and oxygen; digestion/absorption; nervous-system signals and movement; kidneys/hormones; and immunity/cooperation. Estimated learner time is about 20–25 minutes including twelve questions, not a measured duration. No timed or physical exercise is required.

## Learning behavior
Each lesson has three short explanations, a clearly identified simplified connection strip, two vocabulary definitions, an explanation prompt and two retryable multiple-choice questions. A lesson is complete when both questions have been answered correctly at least once. Completion is a learning milestone, not a medical qualification. Learners can visit lessons in any order and review completed questions. Optional links connect to the microscope, brain explorer and Learning Labs, but are not required to finish the course.

Progress uses `khmerone-body-works-v1` in localStorage. Stored data includes only the content version, known question IDs and last lesson. There are no names, medical histories, accounts or analytics. Corrupt/stale records recover safely; blocked storage retains the current tab's activity with an explicit unsaved warning. Reset requires a confirmation dialog and affects only this course. Language changes retain in-session answer choices. Back/forward navigation and direct allowlisted lesson links work independently of saved progress.

## Content and license
Lesson text is a simplified adaptation of the individually linked OpenStax Anatomy and Physiology 2e sections. The course retains attribution, identifies its changes and uses CC BY-NC-SA 4.0 for educational text. See `public/body-works/CONTENT-LICENSE.txt`. No textbook illustrations or logos are reproduced. The English scientific explanations are introductory, not a complete anatomy curriculum or individual medical advice. Khmer text remains a draft for teacher and subject-matter review; no approval or OpenStax endorsement is implied.

## Integration and search
`data/body-works.ts` adds one Educational Tools card without replacing existing entries. `scripts/generate-course-search.mjs` first runs the established complete public search generator, then adds six direct bilingual lesson destinations with their full explanation, vocabulary, prompts and feedback text. Build/test scripts use this wrapper so existing sources remain included. The existing top-level navigation grouping is unchanged.

## Build and offline
`node scripts/prepare-body-works.mjs` verifies a pinned Noto Sans Khmer 5.2.5 package, selects two Khmer font weights plus the OFL license, and hashes the entire course pack. No upstream install scripts or third-party JavaScript runtimes are added. `pnpm run build` includes preparation. Local development needs a successful preparation for bundled fonts and explicit offline downloading.

The course has its own service-worker scope and explicit download action. Every asset is checked before committing a staged cache; incomplete or corrupted updates preserve a prior complete course pack. Other site caches are untouched. This pack excludes the optional linked explorers, the rest of Khmer One and external reading sites. Browser cache eviction can still remove saved content. Printing uses the browser's print function and retains the lesson's attribution.

## Verification and release
Run `node --test tests/body-works.test.mjs` for content, state, security boundaries and lesson-index tests. The read-only Body Works validation workflow checks every lesson/answer, reload persistence, language switching, mobile widths, fonts, keyboard, reset isolation, blocked storage, corruption recovery and cold offline reopening in Chromium. Full-site CI remains separate and must also pass. Check actual workflow results before asserting success. Actual iPhone/Safari device testing and review of Khmer terminology are separate tasks.

This source addition does not deploy Cloudflare, change bindings, migrate data or change paid services. Publish with the existing authenticated guarded production release process.
