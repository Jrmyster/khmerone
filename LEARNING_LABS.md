# Khmer One Learning Labs

Entry point: `/learning-labs/index.html`. The existing educational directory is preserved byte-for-byte in `data/core-apps.ts`; `data/apps.ts` adds the two new entries from `data/learning-labs.ts`. Existing engineering, history, anatomy and other pages are not replaced.

## Activities
Six local open-source integrations: H5P Standalone (evidence quiz), JSXGraph (slope and triangles), 3Dmol.js (six molecules), Blockly (three Rasmey garden missions), ts-fsrs (ten bilingual science vocabulary cards), and Bloom Player (five-page science reader).

Five external resources: Microsoft's Web Development for Beginners, CircuitJS1, Pyodide, Kolibri, and Kiwix JS. They are clearly marked as external; they are not downloaded by the activity pack. Kolibri and Kiwix need separate setup for offline content.

A seventh local activity demonstrates simplified paraxial eye focusing. It links to `gkaguirrelab/gkaModelEye` as a **separate MATLAB research resource**. No MATLAB model execution, validated gkaModelEye data, full anatomical browser port, diagnosis, vision test, or prescription calculation is claimed. This provides an optometry foundation without pretending that the research repository already runs in a browser.

## Build
`node scripts/prepare-learning-labs.mjs` downloads the exact npm archives listed in `public/learning-labs/vendor-manifest.json`, verifies their SHA-512 integrity, selects browser files and license notices, and creates a SHA-256 offline manifest. It does not execute package install scripts. It intentionally excludes optional third-party audio. Run it before local development; the normal build command includes it automatically. The original Khmer font is retained from the recovered implementation and its OFL notice is supplied by the pinned font package.

## Offline behavior
The user must press Save activity pack and receive confirmation. The worker only controls `/learning-labs/` and does not replace the main site worker. Downloads are staged and hash-checked before success is reported. Browser storage can be cleared or evicted; external websites, full MATLAB, and the rest of Khmer One are not covered by this pack. Vocabulary review dates remain on the current browser/device; there is no account synchronization.

## Validation
`node --test tests/learning-labs.test.mjs` checks triangle geometry, bounded coding execution, mission solutions, molecular bonds/formulas, vocabulary and catalog integrity, and the simplified eye calculation.

The read-only `Learning Labs validation` workflow also downloads pinned browser libraries and runs `scripts/check-learning-labs-browser.mjs` with Playwright. It exercises the activities, Khmer/mobile layout, saved review dates and offline reloads. See the actual workflow result before asserting browser or deployment success. The legacy site CI remains separate.

Khmer translations are drafts and require teacher review before being treated as authoritative classroom terminology.
