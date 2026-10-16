# Khmer One Chess Lab

`/chess` teaches **international chess**, in Khmer and English. It is a first
release for beginners, with ten guided lessons, four authored puzzles, untimed
computer play, and two-player play on one device. It does not implement Ouk
Chatrang, online matchmaking, ratings, or an AI chat tutor.

## Entry points and language

The app registry in `data/apps.ts` makes the lab searchable and adds it to the
Simulations filter. The Chess & Strategic Thinking pathway links from Power
Skills, passing `?lang=km` or `?lang=en`. The page honors this parameter and the
existing `khmerone-locale` setting, defaulting to Khmer for a new visitor.

Translations are in `locales/chess.ts`; explanations, positions and solutions
are in `data/chessLessons.ts`. Khmer piece names include English names in the
lesson selector to distinguish international chess from traditional Khmer
chess. A Khmer-speaking chess educator should review the educational wording
before a broad classroom rollout.

## Rules and rendering

`chess.js` owns legal moves and game outcomes. The 3D board is a presentation
of that same position, not a second rules implementation. Three.js and
OrbitControls load on demand. The pieces are original procedural geometry;
there are no remote model/CDN dependencies. The renderer caps device pixel
ratio, renders only on changes, respects reduced motion for moves, and disposes
its resources on unmount. A 2D board supports keyboard and touch interactions
and is the automatic fallback when WebGL is unavailable. Select a piece and
then a destination; promotion offers all four legal choices.

The computer always plays Black. The three difficulty presets limit Stockfish
skill, depth and search time; they are not advertised as calibrated Elo ratings.
Each search has a separate worker and is terminated when its position, mode or
difficulty changes, so takebacks cannot apply a stale computer move.

## Progress and storage

Lesson and puzzle completion is saved under `khmerone-chess-progress-v1`.
The last play-mode game is saved as PGN under `khmerone-chess-session-v1`;
opening Play restores it. PGN retains the starting position and repetition
history. Takeback removes the computer reply and the learner's preceding move,
or just the pending human move when the computer is still thinking.

Completing a lesson, a puzzle, or a full game marks the matching Cyber-XP step
idempotently. The homepage reads these on the next visit. Progress is local to
the browser, with no accounts, user data uploads, or paid inference calls.

## Engine and build

`scripts/prepare-chess-engine.mjs` copies the pinned Stockfish.js 19.0.0 lite,
single-threaded loader and WASM from the installed package. This release meets
the repository's minimum-release-age policy. Engine binaries are generated
under ignored `public/chess/`, not committed. The script also writes GPLv3,
third-party licenses, and a link to the exact release's corresponding source.
Do not rename or update the WASM independently of its loader.

The existing `pnpm run build` prepares the engine, builds the Cloudflare Worker,
then writes both the Teacher Toolkit and Chess Lab offline manifests. `predev`
also prepares the engine. Deploy the existing Worker normally; the lab needs no
new bindings, secrets, or backend services.

## Offline use

Choose **Make available offline** while connected. The service worker fetches
the build's JS, CSS, fonts, engine and license assets before saving the public
`/chess` page. The page is committed to the cache last, and the UI reports
failure if any download fails. Navigating directly to `/chess` then works
offline; the portal homepage and network links are not included. There is no
claim that the whole Khmer One site is available offline.

## Validation

Run `node --experimental-strip-types --test tests/*.test.mjs`,
`pnpm exec tsc --noEmit`, `pnpm run lint`, and `pnpm run build`.
The chess tests validate every authored solution, the actual mating and fork
positions, castling restrictions, en passant, all promotions, illegal input,
repetition-preserving saves, and offline preparation failure behavior.

Browser checks should cover both languages, lesson completion, promotion,
computer reply and takeback, saved-game restoration, 2D keyboard navigation,
3D piece picking/camera controls, narrow-screen layout, and an offline reload
after preparation. Check the network panel to verify the WASM loads from the
same origin. The service worker's offline manifest exists only after a build.
