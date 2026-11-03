# CODAP Evidence & Data Lab

Entry point: `/codap-lab.html`.

This original Khmer One lesson wraps the official CODAP application with Khmer/English guidance, a synthetic practice dataset, a printable bilingual worksheet, and explicit links back to the home page. It adds no package dependencies.

## Data and teaching scope

`/codap/data/sun-shade-practice.csv` contains **12 invented matched pairs, 24 observations**, with the columns `condition`, `temperature_C`, and `pair`. These are illustrative values for graphing practice, **not measurements from Cambodia or any real study**. The page repeats this limitation at the lesson introduction, preview, and worksheet. The data deliberately include overlapping distributions and two pairs in which the shade value exceeds the sun value.

The lesson asks learners to predict, graph both conditions, compare spread and overlap, inspect matched pairs, identify limits, and design a fair measurement. It explicitly distinguishes a pattern in invented data from empirical evidence or causal proof. A fair air-temperature comparison should use matching calibrated instruments at the same time and height, with both sensors shielded from direct solar heating. Students record context separately.

The empty CSV download has the same column names and twelve unfilled sun/shade pairs. It does not supply fabricated observations. The bilingual worksheet records a prediction, comparison, limitation, and improved method. Worksheet responses remain in the current page only; switching language preserves them, while reloading the page clears them. Printing copies the current responses into expanding print fields.

## CODAP launch behavior

- No iframe exists and no request to CODAP occurs until a learner chooses to load an embedded workspace or opens the external link.
- Practice launches use `https://codap.concord.org/app/?v=3&lang=en-US&url=<absolute CSV URL>&inbounds=true`. The absolute CSV URL derives from the page origin and `/codap/data/sun-shade-practice.csv`.
- The public CSV must be served with an appropriate CORS header so the official cross-origin CODAP application can fetch it. Configuration is handled by the integration owner.
- Blank launches omit `url`. All CODAP menus and toolbars remain available.
- Replacing any previously started embedded workspace requires an explicit confirmation, even when selecting the same start mode. This avoids silently discarding unsaved work.
- “Open in new tab” opens the selected starting mode, never a copy of unsaved iframe changes. This distinction is visible beside the controls. Opening a new tab leaves the embedded workspace intact.
- CODAP is an external online application. Its interface remains English; the wrapper does not claim to translate it or provide an offline copy.
- The iframe load event is described only as a page response, not verified application readiness or successful CSV import. A timeout offers a direct fallback. A permanent new-tab link and CSV download are available if embedding or importing fails. The wrapper never reads cross-origin iframe content.

## Locale and accessibility

The page uses guarded `localStorage` access with the shared `khmerone-locale` key, honors `?khmerone_lang=km|en`, defaults to Khmer, and listens for the network-bar language event and storage changes. It is self-contained and uses installed Khmer font fallbacks without a font download.

Controls have visible focus, a minimum 44-pixel target, labels, and language state. The external workspace has a descriptive iframe title and a polite status region. A data table supplies a text alternative to the graph preview. On small screens a full-window CODAP tab is recommended; no workspace downloads automatically.

## Attribution and assets

Visible attribution links to [CODAP by The Concord Consortium](https://github.com/concord-consortium/codap) and `/licenses/codap-MIT.txt`. The integration owner supplies that license file. The page and CSV are original lesson material; CODAP is loaded from its official host and is not vendored here.

## Focused verification

Check the inline script with `node --check` after extracting it. Verify that all translation keys exist in both languages, the CSV matches the preview's 24 values, and no iframe is present before a launch action. In a browser check language switching, mobile overflow, the practice and blank URLs, replacement cancellation, the external-tab fallback, downloads, and printed responses. A live CODAP import requires the deployed CSV and its CORS headers.

## Publication target

The primary portal is the separately configured Cloudflare Worker `khmerone` at `https://khmerone.jaredrobertw.workers.dev`. Its existing learning-service bindings must be preserved; the older Sites project is a separate deployment. Use the repository's authenticated `release-production.mjs` workflow. A branch build or GitHub push is not proof of a production release.
