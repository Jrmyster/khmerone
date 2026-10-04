# Khmer One — Four-stroke engine lab

`engine-lab.html` is the complete application. Its HTML, CSS, educational content, procedural geometry, and JavaScript are contained in one file. No build tool, backend, model files, textures, or installation is required.

## Run

Upload `engine-lab.html` to any static web host and open its URL. For local development, serve the folder over HTTP rather than relying on `file://` module behavior:

```powershell
cd "C:\path\to\your\folder"
python -m http.server 8000
```

Open `http://localhost:8000/engine-lab.html`. Use any existing static development server if Python is unavailable.

The app starts in Khmer and is paused until the learner presses Play. To open in English, append `?lang=en`:

```text
https://your-portal.example/learning/engine-lab.html?lang=en
```

## Embed in Khmer One

Host the HTML file within the portal or on an approved static host, then use an iframe. Replace the example path with the uploaded file's real URL:

```html
<iframe
  src="/learning/engine-lab.html"
  title="Khmer One: interactive four-stroke engine laboratory"
  loading="lazy"
  style="display:block;width:100%;height:1120px;border:0;border-radius:12px;"
></iframe>
```

The app adapts to its iframe's width. Keep iframe scrolling enabled: bilingual descriptions and stacked tablet/mobile controls can make the page taller than 1120px. The app needs no camera, microphone, location, storage, or account access.

## Dependencies and network

- Three.js **0.170.0** and the matching OrbitControls addon load from `https://cdn.jsdelivr.net`. Both use the pinned release in the import map.
- Noto Sans Khmer optionally loads from `https://fonts.googleapis.com` and `https://fonts.gstatic.com`. It loads without blocking startup; Khmer system fonts are the fallback.
- All geometry is procedural: there are no external mesh, image, or texture downloads.
- A CDN or WebGL failure produces a reload message while keeping the bilingual component explanations accessible.

A portal with a Content Security Policy must permit the app's inline module/import map and inline stylesheet (using appropriate hashes or a nonce in production), `cdn.jsdelivr.net` for modules, and the Google font domains if retaining the optional font. The app's embedding host must also be permitted by the portal's `frame-src` policy. Set the app host's `frame-ancestors` policy to the actual Khmer One origin when embedding across origins.

For offline classrooms, download this exact Three.js module and addon version, change the two import-map URLs to local paths, and remove or self-host the optional font. The delivered CDN edition requires internet access to initialize its 3D view.

## Learner controls

| Control | Action |
| --- | --- |
| Drag with the left mouse button / one finger | Orbit the camera |
| Mouse wheel / two-finger pinch | Zoom |
| Right mouse drag / two-finger drag | Pan |
| Arrow keys with the 3D canvas focused | Pan |
| Click/tap an engine part | Select, highlight, and gently focus on it |
| Component buttons | Select any part, including parts hidden from the current angle |
| Labels | Show clickable part names on the model |
| Reset view | Restore the starting camera position |
| Play / Pause | Start or stop the cycle |
| Speed | Choose 0.25×, 0.5×, 1×, 1.5×, or 2× |
| Cycle position | Pause and inspect any crank angle from 0° to 720° |
| Stroke buttons / Next stroke | Pause at the beginning of a stroke |
| Exploded view | Smoothly separate or reassemble the components |
| Space with the canvas focused | Play / Pause |
| R with the canvas focused | Reset view |
| ខ្មែរ / English | Switch interface language; part explanations stay bilingual |

At 1×, one complete cycle takes eight seconds. This is a slowed teaching animation rather than a realistic engine RPM.

## Mechanical and educational model

The engine is a simplified single-cylinder, spark-ignition petrol engine. The piston follows the slider-crank equation, with fixed crank radius `r` and connecting-rod length `L`:

```text
crankX  = r × sin(θ)
crankY  = crankCenterY + r × cos(θ)
pistonY = crankY + sqrt(L² − crankX²)
```

The connecting rod pivots between the calculated crankpin and piston pin. The crankshaft makes two revolutions per 720° cycle; the camshaft makes one. The cam lobes and valve followers illustrate timing and are schematic rather than manufacturing profiles.

| Crank angle | Stroke | Piston | Valves |
| --- | --- | --- | --- |
| 0°–180° | Intake | Down | Intake opens; exhaust closed |
| 180°–360° | Compression | Up | Both closed |
| 360°–540° | Power | Down | Both closed; ignition at 360° |
| 540°–720° | Exhaust | Up | Exhaust opens; intake closed |

The valves seat at stroke boundaries and reach maximum lift in the middle of their respective strokes. The spark is briefly visible around 360°. In this idealized model, there is no valve overlap or ignition advance. Cooling, lubrication, the camshaft drive, and realistic gas thermodynamics are omitted for clarity.

Blue, purple, amber, and red chamber colors identify the four strokes. The colored arrows show intake and exhaust flow. Chamber colors and flow indicators are hidden during disassembly because separated parts no longer form a sealed chamber. The mechanism continues to animate in exploded view so learners can trace the motion.

The app respects reduced-motion preferences for camera focusing and disassembly. Engine playback always starts paused. Keyboard-accessible part buttons provide an alternative to visual raycasting; descriptions contain Khmer and English text and do not rely on color alone.

## Implementation reference

- [NASA: Ideal Otto cycle](https://www.grc.nasa.gov/www/k-12/airplane/otto.html)
- [Three.js: OrbitControls](https://threejs.org/docs/pages/OrbitControls.html)
- [Three.js: Raycaster](https://threejs.org/docs/pages/Raycaster.html)

Edit `PARTS` to revise bilingual component names and descriptions, `STROKES` to revise cycle explanations, and `text` to revise interface translations. The `motion` object holds the illustrative dimensions. Keep the core Three.js and addon versions aligned if updating the CDN release.
