# Virtual Microscope

Entry: `/virtual-microscope/index.html`. Added to the established Educational Tools catalog and public search without replacing any existing apps or Learning Labs. Optional query parameters `lang=en|km` and `slide=muscle|blood|kidney` are allowlisted. The page has native Home, Educational Tools, Search and Learning Labs links.

## Scope
A real OpenSeadragon 6.1.1 browser viewer with three openly licensed teaching photographs: skeletal muscle, human blood and kidney tubules. These are not whole-slide datasets and do not supply calibrated physical dimensions. View zoom is relative to fitting the photograph on screen. Source acquisition magnifications are reported separately. The app never fabricates micrometer scale bars or treats screen zoom as optical magnification.

Students can pan, zoom, rotate/reset, expand the viewer, toggle two inspected muscle landmarks, answer bilingual observation questions, keep per-specimen notes and export their note as plain text. There are deliberately no unverified point annotations on the blood or kidney images. Guidance identifies patterns to look for. Khmer text is an unreviewed draft. This is not diagnostic or treatment software.

## Provenance and typography
Each specimen in `public/virtual-microscope/specimens.js` contains author, original JPEG URL, source page, license, dimensions and the source-reported acquisition magnification. Images are from the Berkshire Community College Bioscience Image Library under CC0 1.0. File-specific licensing pages were checked before selection. Original image pixels are not recolored or altered; classroom markers are separate viewer overlays. All three source images have pinned SHA-256 hashes in the preparation script.

OpenSeadragon is BSD-3-Clause and its release license ships with the runtime. The release archive is pinned to the SHA-256 digest published by GitHub for 6.1.1. Noto Sans Khmer 400/700 Khmer subsets are self-hosted from the integrity-pinned @fontsource/noto-sans-khmer 5.2.5 archive; its SIL Open Font License is retained. Fonts ship in the offline pack, so glyph shaping does not depend on device-installed Khmer fonts or third-party font servers. No audio assets are added.

## Build
`pnpm run build:microscope` prepares the pinned viewer, fonts and three images, validates image hashes and JPEG dimensions, and creates the SHA-256 offline manifest. The normal production build runs this automatically. Build-time downloads are from explicitly listed public sources; upstream install scripts are not executed. Generated assets and runtime are ignored by git and ESLint; application source remains linted. Development needs one successful preparation while online.

## Privacy and offline behavior
Notes use the local key `khmerone-microscope-notes-v1`, with a limit of 1,000 characters per specimen. They never leave the browser unless the learner explicitly downloads a plain-text note. This is browser-local storage, not an encrypted personal account; people sharing that browser can see its notes. Missing, blocked, malformed or full browser storage produces a recovery message, not a false saved status. Do not enter personal medical information.

The microscope has its own optional offline pack and service-worker scope. Download progress and success are explicit. Every file is hashed before a staged cache is activated; failed updates do not replace the previously saved pack. Browser storage can still be evicted. No other Khmer One caches are removed. The pack excludes other website pages and external source websites. The student-facing application does not fetch images or fonts from third-party servers: prepared assets are served with the site.

## Tests and release
`node --test tests/virtual-microscope.test.mjs` checks metadata, bilingual text, landmark bounds, scoring, note bounds and security boundaries. The read-only Virtual Microscope validation workflow runs the actual viewer with real JPEGs in Chromium: nonempty image pixels, zoom, keyboard, overlays, quizzes, local persistence, note export, both Khmer font weights online and offline, mobile layout, expanded view, blocked local storage, corrupt-download preservation of a previous pack, and offline reload for every specimen. Screenshots are retained in workflow artifacts. Actual iPhone/Safari device testing is not included in this workflow.

Existing full-site CI must also pass before merging. CI is not a production deployment. Use the existing authenticated guarded Cloudflare release process; this feature adds no database migration or storage binding.
