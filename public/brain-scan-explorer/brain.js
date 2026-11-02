import { dataset, views, questions, selectView, boundedIndex, displayWindow, gradeAnswer, readNote } from './lesson.js';
import { viewerOptions } from './viewer-options.js';

const $ = id => document.getElementById(id);
const copy = {
  tools: ['Educational Tools','ឧបករណ៍អប់រំ'], microscope: ['Virtual Microscope','មីក្រូទស្សន៍និម្មិត'], search: ['Search','ស្វែងរក'],
  eyebrow: ['MEDICAL & LIFE SCIENCES','វិទ្យាសាស្ត្រវេជ្ជសាស្ត្រ និងជីវិត'], title: ['Brain Scan Explorer','ស្វែងយល់រូបភាពស្កេនខួរក្បាល'],
  intro: ['One reference brain. Three ways to look inside.','រូបភាពខួរក្បាលយោងមួយ។ ទិសកាត់បីដើម្បីស្វែងយល់ខាងក្នុង។'],
  review: ['Educational use only—not a diagnostic tool. Khmer text is a draft for teacher review.','សម្រាប់ការអប់រំ មិនមែនឧបករណ៍រោគវិនិច្ឆ័យទេ។ អត្ថបទខ្មែរជាសេចក្ដីព្រាងសម្រាប់គ្រូពិនិត្យ។'],
  reference: ["A reference volume derived from averaged MRI data—not an individual patient's scan.",'រូបភាពយោងបីវិមាត្រដែលបានពីទិន្នន័យ MRI មធ្យម មិនមែនរូបភាពអ្នកជំងឺម្នាក់ទេ។'],
  viewerTitle: ['Explore the volume','ស្វែងយល់រូបភាពបីវិមាត្រ'], expand: ['Expand view','ពង្រីកផ្ទាំងមើល'], collapse: ['Close expanded view','បិទផ្ទាំងពង្រីក'],
  loadTitle: ['Ready to look inside?','ត្រៀមស្វែងយល់ខាងក្នុងហើយឬនៅ?'], loadIntro: ['Load the reference MRI when you are ready. The viewer and scan stay on this website; no account is needed.','ចុចដើម្បីផ្ទុករូបភាព MRI យោង។ កម្មវិធីមើល និងរូបភាពនៅក្នុងគេហទំព័រនេះ។ មិនត្រូវការគណនីទេ។'],
  load: ['Load reference MRI','ផ្ទុករូបភាព MRI យោង'], retry: ['Reload and retry','ផ្ទុកទំព័រ និងព្យាយាមម្ដងទៀត'], reset: ['Reset view','កំណត់ទិដ្ឋភាពឡើងវិញ'],
  zoomIn: ['+ Zoom','+ ពង្រីក'], zoomOut: ['− Zoom','− បង្រួម'], crosshair: ['Crosshair','បន្ទាត់កាត់'], turnLeft: ['Turn 3D left','បង្វិល 3D ទៅឆ្វេង'], turnRight: ['Turn 3D right','បង្វិល 3D ទៅស្តាំ'],
  help: ['Select a point in a slice to move the crosshair. Use the sliders for precise movement. In 3D, drag to rotate or use the turn buttons.','ជ្រើសចំណុចក្នុងរូបភាពកាត់ដើម្បីផ្លាស់ទីបន្ទាត់កាត់។ ប្រើរបាររំកិលសម្រាប់ផ្លាស់ទីច្បាស់លាស់។ ក្នុង 3D អូស ឬប្រើប៊ូតុងដើម្បីបង្វិល។'],
  orientation: ['Orientation: L = left, R = right, A = front, P = back, S = top, I = bottom. L/R refer to the brain, not your hands. This viewer uses neurological display convention.','ទិស៖ L = ឆ្វេង, R = ស្តាំ, A = មុខ, P = ក្រោយ, S = លើ, I = ក្រោម។ L/R ជាទិសរបស់ខួរក្បាល មិនមែនដៃអ្នកទេ។ កម្មវិធីនេះប្រើរបៀបបង្ហាញ neurological។'],
  sliceTitle: ['Move through the volume','ផ្លាស់ទីតាមរូបភាពបីវិមាត្រ'], xLabel: ['Sagittal · left → right','កាត់ឆ្វេង–ស្តាំ · ពីឆ្វេងទៅស្តាំ'], yLabel: ['Coronal · back → front','កាត់មុខ–ក្រោយ · ពីក្រោយទៅមុខ'], zLabel: ['Axial · bottom → top','កាត់ផ្ដេក · ពីក្រោមទៅលើ'],
  sliceHint: ["Positions count voxel centers along the viewer's reoriented axes. They are not millimeters or anatomical labels.",'លេខទីតាំងរាប់ចំណុចកណ្ដាល voxel តាមអ័ក្សរបស់កម្មវិធី។ វាមិនមែនជាមីលីម៉ែត្រ ឬស្លាកកាយវិភាគទេ។'],
  display: ['Display contrast','ភាពផ្ទុយពណ៌រូបភាព'], center: ['Window center','ចំណុចកណ្ដាលជួរបង្ហាញ'], width: ['Window width','ទទឹងជួរបង្ហាញ'],
  contrastNote: ['These controls change the display, not the underlying MRI values. Reset restores the original display range.','ឧបករណ៍ទាំងនេះកែទិដ្ឋភាព មិនមែនតម្លៃ MRI ដើមទេ។ ប៊ូតុងកំណត់ឡើងវិញស្ដារជួរបង្ហាញដើម។'],
  learn: ['OBSERVE → COMPARE → EXPLAIN','សង្កេត → ប្រៀបធៀប → ពន្យល់'], challengeTitle: ['Try an observation','សាកល្បងសង្កេត'],
  challenge: ['Move one slice slider slowly. Describe what changes and what stays continuous. Then switch direction and find the same crosshair location.','ផ្លាស់ទីរបាររំកិលមួយយឺតៗ។ ពិពណ៌នាអ្វីដែលប្រែប្រួល និងអ្វីដែលនៅតជាប់គ្នា។ បន្ទាប់មកប្ដូរទិស និងរកទីតាំងបន្ទាត់កាត់ដូចគ្នា។'],
  checkTitle: ['Check your understanding','ពិនិត្យការយល់របស់អ្នក'], check: ['Check answer','ពិនិត្យចម្លើយ'], next: ['Next question','សំណួរបន្ទាប់'],
  aboutTitle: ['What this image can—and cannot—show','អ្វីដែលរូបភាពនេះអាច និងមិនអាចបង្ហាញ'],
  about: ["MRI data forms a three-dimensional grid of values. A slice displays one cross-section; volume rendering combines values into a 3D view. This teaching reference is not a diagnosis, a live brain, or a map of someone's thoughts. It does not represent every person's anatomy.",'ទិន្នន័យ MRI ជាក្រឡាតម្លៃបីវិមាត្រ។ រូបភាពកាត់បង្ហាញផ្ទៃកាត់មួយ។ ទិដ្ឋភាព 3D បង្កើតពីតម្លៃទាំងនោះ។ រូបភាពយោងនេះមិនមែនជារោគវិនិច្ឆ័យ ខួរក្បាលផ្ទាល់ ឬផែនទីគំនិតរបស់មនុស្សទេ។ វាមិនតំណាងឱ្យកាយវិភាគរបស់គ្រប់មនុស្សទេ។'],
  privacy: ['Patient-file uploads and drag-and-drop loading are disabled. No personal health data is requested.','មិនអនុញ្ញាតឱ្យផ្ទុក ឬអូសឯកសារអ្នកជំងឺចូលទេ។ មិនស្នើសុំទិន្នន័យសុខភាពផ្ទាល់ខ្លួនទេ។'],
  sourceTitle: ['Sources and licenses','ប្រភព និងអាជ្ញាបណ្ណ'], notebook: ['YOUR OBSERVATION NOTEBOOK','សៀវភៅកំណត់ត្រាការសង្កេត'], noteTitle: ['Describe what you see.','ពិពណ៌នាអ្វីដែលអ្នកឃើញ។'],
  noteHelp: ['Keep observations separate from explanations. Your note stays in this browser. Do not enter personal medical information.','បែងចែកការសង្កេតពីការពន្យល់។ កំណត់ត្រារក្សាទុកលើកម្មវិធីរុករកនេះ។ កុំបញ្ចូលព័ត៌មានវេជ្ជសាស្ត្រផ្ទាល់ខ្លួន។'],
  noteLabel: ['My observation','ការសង្កេតរបស់ខ្ញុំ'], export: ['Download note','ទាញយកកំណត់ត្រា'], offlineTitle: ['Take the explorer offline','ប្រើកម្មវិធីក្រៅបណ្ដាញ'],
  offlineInfo: ['Save the viewer, reference MRI, lessons and Khmer fonts while connected. This pack is separate from the microscope and Learning Labs. Other pages and external source sites are not included.','រក្សាទុកកម្មវិធី MRI មេរៀន និងពុម្ពអក្សរខ្មែរពេលមានអ៊ីនធឺណិត។ កញ្ចប់នេះដាច់ពីមីក្រូទស្សន៍ និង Learning Labs។ ទំព័រផ្សេង និងប្រភពខាងក្រៅមិនរួមបញ្ចូលទេ។'],
  save: ['Save brain explorer pack','រក្សាទុកកញ្ចប់សិក្សាខួរក្បាល'],
  footer: ['A reference MRI for learning—not a diagnostic service. WebGL2 is required for interactive viewing. Browser storage may be cleared or evicted.','រូបភាព MRI យោងសម្រាប់សិក្សា មិនមែនសេវារោគវិនិច្ឆ័យទេ។ ត្រូវការ WebGL2 សម្រាប់មើលរូបភាពអន្តរកម្ម។ ឃ្លាំងកម្មវិធីរុករកអាចត្រូវសម្អាត ឬលុបបាន។'],
  labs: ['Back to Learning Labs','ត្រឡប់ទៅសកម្មភាពសិក្សា'],
};
const params = new URLSearchParams(location.search);
let language = params.get('lang');
try { language ||= localStorage.getItem('khmerone-locale'); } catch { /* Optional preference. */ }
language = language === 'km' ? 'km' : 'en';
let view = selectView(params.get('view') || (innerWidth < 600 ? 'axial' : 'all'));
const noteKey = 'khmerone-brain-scan-note-v1';
let note = '', storageAvailable = true;
try { note = readNote(localStorage.getItem(noteKey)); } catch { storageAvailable = false; }
$('note').value = note;
let nv, loaded = false, loading = false, expanded = false, questionIndex = 0, packBusy = false, packBytes = 0;
let dimensions = [1, 1, 1], originalRange = [0, 1], scale = 1, azimuth = 110, elevation = 15;
const t = (en, km) => language === 'km' ? km : en;
const text = value => value[language];
function updateURL() {
  const url = new URL(location.href);
  url.search = new URLSearchParams({ lang: language, view: view.id }).toString();
  history.replaceState(null, '', url);
}
function noteStatus() { $('note-status').textContent = storageAvailable ? t('Private to this browser.','ឯកជនលើកម្មវិធីរុករកនេះ។') : t('Browser storage is unavailable. Download your note to keep it.','មិនអាចរក្សាទុកលើកម្មវិធីរុករកបាន។ សូមទាញយកកំណត់ត្រា។'); }
function renderQuestion() {
  const question = questions[questionIndex];
  $('question-number').textContent = t(`Question ${questionIndex + 1} of ${questions.length}`,`សំណួរ ${questionIndex + 1} / ${questions.length}`);
  const legend = document.createElement('legend'); legend.textContent = text(question.prompt);
  $('quiz-options').replaceChildren(legend);
  question.choices.forEach((choice, index) => {
    const label = document.createElement('label'); label.className = 'answer';
    const input = document.createElement('input'); input.type = 'radio'; input.name = 'brain-answer'; input.value = String(index);
    const span = document.createElement('span'); span.textContent = text(choice); label.append(input, span); $('quiz-options').append(label);
  });
  $('feedback').textContent = ''; delete $('feedback').dataset.correct;
}
function setView(next) {
  view = next;
  if (loaded) nv.setSliceType(view.type);
  for (const button of $('view-buttons').children) button.setAttribute('aria-pressed', String(button.dataset.view === view.id));
  $('lesson-title').textContent = text(view.title); $('lesson-detail').textContent = text(view.detail);
  const rendering = view.id === 'render' || view.id === 'all';
  $('turn-left').disabled = !loaded || !rendering; $('turn-right').disabled = !loaded || !rendering;
  $('brain-canvas').dataset.view = view.id;
  updateURL();
}
function syncPosition() {
  if (!loaded) return;
  const position = nv.frac2vox(nv.scene.crosshairPos);
  ['x', 'y', 'z'].forEach((axis, index) => {
    const value = boundedIndex(position[index], dimensions[index]);
    $(`slice-${axis}`).value = String(value); $(`value-${axis}`).textContent = `${value + 1} / ${dimensions[index]}`;
    $('brain-canvas').dataset[axis] = String(value);
  });
}
function applyPosition() {
  if (!loaded) return;
  const desired = ['x', 'y', 'z'].map((axis, index) => boundedIndex($(`slice-${axis}`).value, dimensions[index]));
  nv.scene.crosshairPos = nv.vox2frac(desired);
  nv.moveCrosshairInVox(0, 0, 0);
  syncPosition();
}
function translate() {
  document.documentElement.lang = language;
  document.title = t('Brain Scan Explorer · Khmer One','ស្វែងយល់រូបភាពស្កេនខួរក្បាល · Khmer One');
  for (const element of document.querySelectorAll('[data-i18n]')) element.textContent = copy[element.dataset.i18n][language === 'km' ? 1 : 0];
  $('language').textContent = language === 'km' ? 'English' : 'ភាសាខ្មែរ';
  $('language').setAttribute('aria-label', t('Switch to Khmer','ប្ដូរទៅភាសាអង់គ្លេស'));
  $('expand').textContent = copy[expanded ? 'collapse' : 'expand'][language === 'km' ? 1 : 0];
  $('brain-canvas').setAttribute('aria-label', t('Interactive reference MRI','រូបភាព MRI យោងអន្តរកម្ម'));
  $('view-buttons').setAttribute('aria-label', t('View direction','ទិសនៃទិដ្ឋភាព'));
  $('view-buttons').replaceChildren(...views.map(item => {
    const button = document.createElement('button'); button.type = 'button'; button.dataset.view = item.id; button.textContent = text(item.name);
    button.addEventListener('click', () => setView(item)); return button;
  }));
  renderQuestion(); setView(view); noteStatus(); syncPosition();
  if (loaded) $('viewer-status').textContent = t('Reference MRI ready. Explore without uploading any files.','រូបភាព MRI យោងរួចរាល់។ ស្វែងយល់ដោយមិនផ្ទុកឯកសារផ្ទាល់ខ្លួន។');
  if (packBytes) $('pack-size').textContent = `${(packBytes / 1000000).toFixed(1)} MB · MNI152`;
}
function enableControls(enabled) {
  for (const button of document.querySelectorAll('[data-control]')) button.disabled = !enabled;
  $('slice-controls').disabled = !enabled; $('contrast-controls').disabled = !enabled;
}
function fail(message) {
  loaded = false; loading = false; $('brain-canvas').dataset.ready = 'false'; enableControls(false);
  $('error').textContent = message; $('error').hidden = false; $('retry').hidden = false;
  $('loading-status').textContent = ''; $('load-brain').disabled = true;
  $('start-panel').hidden = true; nv?.cleanup();
}
async function loadBrain() {
  if (loading || loaded) return;
  loading = true; $('load-brain').disabled = true; $('error').hidden = true;
  $('loading-status').textContent = t('Loading viewer and reference MRI…','កំពុងផ្ទុកកម្មវិធី និងរូបភាព MRI យោង…');
  let timer;
  try {
    const canvas = $('brain-canvas');
    if (!canvas.getContext('webgl2', { preserveDrawingBuffer: true, alpha: false })) {
      fail(t('Interactive viewing needs WebGL2, which is unavailable here. The lesson and questions still work. Try another supported browser or device.','ការមើលអន្តរកម្មត្រូវការ WebGL2 ដែលមិនមាននៅទីនេះ។ មេរៀន និងសំណួរនៅតែប្រើបាន។ សូមសាកល្បងកម្មវិធីរុករក ឬឧបករណ៍ផ្សេង។')); return;
    }
    const { Niivue } = await import('./vendor/niivue.js');
    nv = new Niivue(viewerOptions());
    nv.onLocationChange = syncPosition;
    await nv.attachToCanvas(canvas);
    nv.setRadiologicalConvention(false); nv.setHighResolutionCapable(1); nv.setDragMode(nv.dragModes.none);
    nv.setIsOrientationTextVisible(true); nv.setShowAllOrientationMarkers(true);
    const controller = new AbortController(); timer = setTimeout(() => controller.abort(), 60000);
    const response = await fetch(new URL(dataset.file, import.meta.url), { signal: controller.signal });
    if (!response.ok) throw new Error('MRI download failed');
    const buffer = await response.arrayBuffer();
    if (buffer.byteLength !== dataset.bytes) throw new Error('Unexpected MRI file');
    clearTimeout(timer);
    await nv.loadFromArrayBuffer(buffer, 'mni152.nii.gz');
    if (nv.volumes.length !== 1) throw new Error('Reference volume missing');
    const volume = nv.volumes[0];
    dimensions = Array.from(volume.dimsRAS).slice(1, 4);
    if (dimensions.length !== 3 || dimensions.some(n => !Number.isInteger(n) || n < 2 || n > 1024)) throw new Error('Unexpected volume dimensions');
    originalRange = [volume.cal_min, volume.cal_max];
    displayWindow(...originalRange, 50, 100);
    ['x','y','z'].forEach((axis,index) => { $(`slice-${axis}`).max = String(dimensions[index] - 1); $(`slice-${axis}`).value = String(Math.floor((dimensions[index] - 1) / 2)); });
    loaded = true; loading = false; $('start-panel').hidden = true; $('brain-canvas').dataset.ready = 'true';
    $('brain-canvas').dataset.dimensions = dimensions.join(','); enableControls(true); resetView(); translate();
  } catch (error) {
    console.error('Brain reference could not load', error);
    fail(t('The reference MRI could not load. Check your connection and browser graphics support, or save the complete offline pack first. The lesson and questions remain available.','មិនអាចផ្ទុករូបភាព MRI យោងបាន។ សូមពិនិត្យអ៊ីនធឺណិត និងការគាំទ្រក្រាហ្វិក ឬរក្សាទុកកញ្ចប់ក្រៅបណ្ដាញពេញលេញជាមុន។ មេរៀន និងសំណួរនៅតែប្រើបាន។'));
  } finally { clearTimeout(timer); }
}
function contrast() {
  const center = Number($('window-center').value), width = Number($('window-width').value);
  $('center-value').textContent = `${center}%`; $('width-value').textContent = `${width}%`;
  if (!loaded) return;
  const [min, max] = displayWindow(...originalRange, center, width);
  nv.volumes[0].cal_min = min; nv.volumes[0].cal_max = max; nv.updateGLVolume();
  $('brain-canvas').dataset.window = `${min},${max}`;
}
function resetView() {
  if (!loaded) return;
  scale = 1; azimuth = 110; elevation = 15;
  nv.setPan2Dxyzmm([0, 0, 0, 1]); nv.setScale(1); nv.setRenderAzimuthElevation(azimuth, elevation);
  ['x','y','z'].forEach((axis,index) => { $(`slice-${axis}`).value = String(Math.floor((dimensions[index] - 1) / 2)); });
  applyPosition(); $('window-center').value = '50'; $('window-width').value = '100'; contrast();
  nv.setCrosshairWidth(1); $('crosshair').setAttribute('aria-pressed','true'); setView(view);
  $('brain-canvas').dataset.zoom = '1';
}
function zoom(factor) {
  if (!loaded) return;
  scale = Math.max(0.5, Math.min(3, scale * factor));
  nv.setPan2Dxyzmm([0, 0, 0, scale]); nv.setScale(scale); $('brain-canvas').dataset.zoom = String(scale);
}
function turn(delta) { if (!loaded) return; azimuth += delta; nv.setRenderAzimuthElevation(azimuth, elevation); }
function expand(value) {
  expanded = value; document.querySelector('.viewer-panel').classList.toggle('expanded', value); document.body.classList.toggle('viewer-expanded', value);
  $('expand').setAttribute('aria-expanded', String(value)); $('expand').textContent = copy[value ? 'collapse' : 'expand'][language === 'km' ? 1 : 0];
  requestAnimationFrame(() => { if (loaded) nv.resizeListener(); });
}
$('load-brain').addEventListener('click', loadBrain);
$('retry').addEventListener('click', () => location.reload());
$('reset').addEventListener('click', resetView); $('zoom-in').addEventListener('click', () => zoom(1.2)); $('zoom-out').addEventListener('click', () => zoom(1/1.2));
$('turn-left').addEventListener('click', () => turn(-15)); $('turn-right').addEventListener('click', () => turn(15));
$('crosshair').addEventListener('click', () => { const visible = $('crosshair').getAttribute('aria-pressed') !== 'true'; nv.setCrosshairWidth(visible ? 1 : 0); $('crosshair').setAttribute('aria-pressed', String(visible)); });
for (const axis of ['x','y','z']) $(`slice-${axis}`).addEventListener('input', applyPosition);
$('window-center').addEventListener('input', contrast); $('window-width').addEventListener('input', contrast);
$('expand').addEventListener('click', () => expand(!expanded));
document.addEventListener('keydown', event => { if (event.key === 'Escape' && expanded) { expand(false); $('expand').focus(); } });
// Only the packaged reference is accepted. Capture drops before library handlers.
for (const type of ['drop','dragover']) document.addEventListener(type, event => { event.preventDefault(); event.stopImmediatePropagation(); }, true);
$('language').addEventListener('click', () => { language = language === 'km' ? 'en' : 'km'; try { localStorage.setItem('khmerone-locale', language); } catch { /* Session preference still works. */ } translate(); });
$('check-answer').addEventListener('click', () => {
  const selected = $('quiz-options').querySelector('input:checked');
  if (!selected) { $('feedback').textContent = t('Choose an answer first.','សូមជ្រើសរើសចម្លើយជាមុន។'); return; }
  const question = questions[questionIndex], correct = gradeAnswer(question, Number(selected.value));
  $('feedback').dataset.correct = String(correct); $('feedback').textContent = (correct ? t('Correct. ','ត្រឹមត្រូវ។ ') : t('Try again. ','សាកល្បងម្ដងទៀត។ ')) + text(question.explanation);
});
$('next-question').addEventListener('click', () => { questionIndex = (questionIndex + 1) % questions.length; renderQuestion(); });
$('note').addEventListener('input', () => {
  note = $('note').value.slice(0,1500);
  try { localStorage.setItem(noteKey, JSON.stringify(note)); storageAvailable = true; $('note-status').textContent = t('Saved in this browser.','បានរក្សាទុកលើកម្មវិធីរុករកនេះ។'); }
  catch { storageAvailable = false; $('note-status').textContent = t('Not saved to browser storage. Download your note to keep it.','មិនបានរក្សាទុកលើកម្មវិធីរុករក។ សូមទាញយកកំណត់ត្រាដើម្បីរក្សាវា។'); }
});
$('export-note').addEventListener('click', () => {
  const contents = ['Khmer One · Brain Scan Explorer', dataset.name, note, dataset.attribution, dataset.atlas, t('Educational observations only.','ការសង្កេតសម្រាប់អប់រំតែប៉ុណ្ណោះ។')].join('\n\n');
  const url = URL.createObjectURL(new Blob(['\uFEFF' + contents], {type:'text/plain;charset=utf-8'}));
  const link = document.createElement('a'); link.href = url; link.download = `khmerone-brain-observation-${language}.txt`; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
async function activeWorker() {
  if (!isSecureContext || !('serviceWorker' in navigator)) throw new Error('Service worker unavailable');
  const registration = await navigator.serviceWorker.register(new URL('sw.js',import.meta.url), {scope:'./'});
  if (registration.active) return registration.active;
  const worker = registration.installing || registration.waiting;
  if (!worker) throw new Error('Worker unavailable');
  await new Promise((resolve,reject) => {
    const timeout = setTimeout(() => { worker.removeEventListener('statechange',changed); reject(new Error('Activation timeout')); },20000);
    function changed() { if (worker.state === 'activated' || worker.state === 'redundant') { clearTimeout(timeout); worker.removeEventListener('statechange',changed); if (worker.state === 'activated') resolve(); else reject(new Error('Installation failed')); } }
    worker.addEventListener('statechange',changed); changed();
  });
  return worker;
}
async function savePack() {
  if (packBusy) return;
  packBusy = true; $('save-pack').disabled = true; $('pack-status').textContent = t('Saving reference MRI and viewer…','កំពុងរក្សាទុករូបភាព MRI យោង និងកម្មវិធី…');
  try {
    const worker = await activeWorker();
    await new Promise((resolve,reject) => {
      const channel = new MessageChannel(); let timeout;
      const tick = () => { clearTimeout(timeout); timeout = setTimeout(() => { channel.port1.close(); reject(new Error('Download timeout')); },90000); };
      tick(); channel.port1.onmessage = ({data}) => {
        if (data.progress) { tick(); $('pack-status').textContent = t(`Saving ${data.progress} / ${data.total} files…`,`កំពុងរក្សាទុក ${data.progress} / ${data.total} ឯកសារ…`); }
        if (typeof data.ok === 'boolean') { clearTimeout(timeout); channel.port1.close(); if (data.ok) resolve(); else reject(new Error(data.error || 'Download failed')); }
      };
      worker.postMessage({type:'DOWNLOAD_BRAIN_PACK'},[channel.port2]);
    });
    $('pack-status').textContent = t('Saved. Reopen this explorer offline, then press Load reference MRI. Browser storage may be cleared or evicted.','បានរក្សាទុក។ បើកកម្មវិធីនេះក្រៅបណ្ដាញ រួចចុចផ្ទុករូបភាព MRI យោង។ ឃ្លាំងផ្ទុកអាចត្រូវសម្អាត ឬលុបបាន។');
    $('pack-status').dataset.saved = 'true';
  } catch {
    $('pack-status').textContent = t('The new pack was not saved completely. Check your connection, HTTPS and storage, then retry. A previously saved complete pack is kept.','កញ្ចប់ថ្មីមិនបានរក្សាទុកពេញលេញ។ សូមពិនិត្យអ៊ីនធឺណិត HTTPS និងឃ្លាំងផ្ទុក រួចព្យាយាមម្ដងទៀត។ កញ្ចប់ពេញលេញចាស់នៅតែរក្សាទុក។');
    delete $('pack-status').dataset.saved;
  } finally { packBusy = false; $('save-pack').disabled = false; }
}
$('save-pack').addEventListener('click',savePack);
$('brain-canvas').addEventListener('webglcontextlost', event => { event.preventDefault(); fail(t('The graphics context was lost. Reload to try again; your lesson and saved note remain available.','ក្រាហ្វិកបានផ្អាក។ ផ្ទុកទំព័រឡើងវិញដើម្បីសាកល្បង។ មេរៀន និងកំណត់ត្រាដែលបានរក្សាទុកនៅតែមាន។')); });
translate();
activeWorker().catch(() => {});
(async () => { try { const response = await fetch(new URL('offline-assets.json',import.meta.url)); if (!response.ok) return; const manifest = await response.json(); packBytes = manifest.totalBytes; if (Number.isFinite(packBytes)) $('pack-size').textContent = `${(packBytes/1000000).toFixed(1)} MB · MNI152`; } catch { /* Size is advisory. */ } })();
