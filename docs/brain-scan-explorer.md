# Brain Scan Explorer

Route: `/brain-scan-explorer/index.html`. Listed under Educational Tools and indexed in public search. The microscope, Learning Labs, ministries, appearance customization and existing release commands are retained.

## Learning scope
Five view choices: linked multiplanar view, axial, coronal, sagittal and volume rendering. Sliders use the actual reoriented voxel dimensions; they do not claim calibrated anatomical labels. Display windowing changes presentation, not source values. Three bilingual questions introduce anatomical planes, reference datasets and display contrast. Khmer translations are drafts for teacher review.

A learner explicitly loads the reference MRI. No patient images are requested, file-upload controls are absent, and library/page drop loading is disabled. Only the fixed same-origin packaged volume is accepted. Notes stay in the browser unless explicitly exported as plain text. No diagnostic or treatment output is provided.

## Source and licenses
NiiVue 0.69.0 uses BSD-2-Clause with bundled notices. Its self-contained encoded ESM is decoded as data at build time, not evaluated. The reference `mni152.nii.gz` comes from niivue/niivue-demo-images at fixed commit f6f98294c1fa89a3a32e8a44eab92368374150a0; Git blob hash 2dc3166aeffab7f4c08d35b2f17a9325634388ca and exact byte size are checked before inclusion. The upstream README identifies it as derived from ICBM 152 nonlinear atlases (2009). It is not an individual patient record or representative of every age/population. MNI/McGill attribution, license and the requested Fonov references are included. Noto Sans Khmer 5.2.5 is self-hosted with its OFL notice and pinned archive integrity.

## Build and offline
`node scripts/prepare-brain-scan-explorer.mjs` prepares runtime, fonts, reference data and a SHA-256 asset manifest. The normal build invokes it. No upstream installation scripts are executed. The explorer's isolated service worker downloads only its explicit pack on request. A staged download is published only after all hashes match; failures preserve the old complete pack. Other website caches are not deleted. WebGL2 remains required offline, and browsers may evict storage.

## Validation and release
Unit tests cover source allowlisting, bounded indices/window calculations, quizzes, bilingual data and local notes. The separate read-only browser workflow exercises the real viewer and reference pixels, controls, contrast, mobile/Khmer layout, notes and exports, error handling and offline reload. Inspect the actual workflow results before claiming success. Full-site CI must also pass. This source integration does not deploy to Cloudflare or alter any production binding, database, secret or paid service. Use the existing authenticated guarded production release after review.
