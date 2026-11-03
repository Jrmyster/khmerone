// Original teaching copy. Khmer is a draft for teacher review.
export const bi = (en, km) => ({ en, km });
export const dataset = {
  id: 'mni152', name: 'MNI152 reference MRI', file: 'assets/mni152.nii.gz',
  source: 'https://github.com/niivue/niivue-demo-images/blob/f6f98294c1fa89a3a32e8a44eab92368374150a0/README.md',
  original: 'https://raw.githubusercontent.com/niivue/niivue-demo-images/f6f98294c1fa89a3a32e8a44eab92368374150a0/mni152.nii.gz',
  gitBlob: '2dc3166aeffab7f4c08d35b2f17a9325634388ca', bytes: 4336029,
  atlas: 'https://www.bic.mni.mcgill.ca/ServicesAtlases/ICBM152NLin2009',
  attribution: 'MNI / McConnell Brain Imaging Centre, McGill University; teaching derivative distributed by NiiVue.',
};
// NiiVue 0.69.0 SLICE_TYPE values. Runtime assertions are part of browser QA.
export const views = [
  { id: 'all', type: 3, name: bi('All views', 'គ្រប់ទិដ្ឋភាព'), title: bi('One location, several perspectives', 'ទីតាំងមួយ ទិដ្ឋភាពច្រើន'),
    detail: bi('The crosshair links the slice views to the same location in the volume. Move a slider or select a point in a slice, then compare the other views.', 'បន្ទាត់កាត់ភ្ជាប់ទិដ្ឋភាពផ្សេងៗទៅទីតាំងដូចគ្នាក្នុងរូបភាពបីវិមាត្រ។ ផ្លាស់ទីរបាររំកិល ឬជ្រើសចំណុចក្នុងរូបភាពកាត់ រួចប្រៀបធៀបទិដ្ឋភាពផ្សេង។') },
  { id: 'axial', type: 0, name: bi('Axial', 'កាត់ផ្ដេក'), title: bi('Axial · move from bottom to top', 'កាត់ផ្ដេក · ពីក្រោមទៅលើ'),
    detail: bi('An axial slice separates upper and lower portions. Use the inferior–superior slider to step through this direction. Watch the L and R markers rather than guessing left and right.', 'រូបភាពកាត់ផ្ដេកបែងចែកផ្នែកខាងលើ និងខាងក្រោម។ ប្រើរបាររំកិលពីក្រោមទៅលើ ដើម្បីស្វែងយល់ទិសនេះ។ មើលសញ្ញា L និង R ដើម្បីដឹងឆ្វេង និងស្តាំ។') },
  { id: 'coronal', type: 1, name: bi('Coronal', 'កាត់មុខ–ក្រោយ'), title: bi('Coronal · move from back to front', 'កាត់មុខ–ក្រោយ · ពីក្រោយទៅមុខ'),
    detail: bi('A coronal slice separates front and back portions. Use the posterior–anterior slider. The structures change as the cutting plane moves through the volume.', 'រូបភាពកាត់នេះបែងចែកផ្នែកខាងមុខ និងខាងក្រោយ។ ប្រើរបាររំកិលពីក្រោយទៅមុខ។ រចនាសម្ព័ន្ធប្រែប្រួលពេលផ្លាស់ទីផ្ទៃកាត់ឆ្លងកាត់រូបភាពបីវិមាត្រ។') },
  { id: 'sagittal', type: 2, name: bi('Sagittal', 'កាត់ឆ្វេង–ស្តាំ'), title: bi('Sagittal · move from left to right', 'កាត់ឆ្វេង–ស្តាំ · ពីឆ្វេងទៅស្តាំ'),
    detail: bi('A sagittal slice separates left and right portions. Use the left–right slider. A slice through the midline is called midsagittal; not every sagittal slice is at the midline.', 'រូបភាពកាត់នេះបែងចែកផ្នែកខាងឆ្វេង និងខាងស្តាំ។ ប្រើរបាររំកិលពីឆ្វេងទៅស្តាំ។ ផ្ទៃកាត់តាមបន្ទាត់កណ្ដាលហៅថា midsagittal។ មិនមែនគ្រប់ផ្ទៃកាត់នេះសុទ្ធតែនៅកណ្ដាលទេ។') },
  { id: 'render', type: 4, name: bi('3D overview', 'ទិដ្ឋភាព 3D'), title: bi('A rendering of the same data', 'ទិដ្ឋភាពបង្កើតពីទិន្នន័យដដែល'),
    detail: bi('Drag to rotate, or use the turn buttons. This volume rendering is calculated from the MRI values; it is not a photograph of an exposed brain or a labeled anatomical segmentation.', 'អូសដើម្បីបង្វិល ឬប្រើប៊ូតុងបង្វិល។ ទិដ្ឋភាពនេះគណនាពីតម្លៃ MRI។ វាមិនមែនជារូបថតខួរក្បាលបើកចំហ ឬរូបភាពបែងចែកសរីរាង្គដែលមានស្លាកទេ។') },
];
export const questions = [
  { id: 'planes', prompt: bi('Which plane separates left and right portions?', 'តើផ្ទៃកាត់មួយណាបែងចែកផ្នែកឆ្វេង និងស្តាំ?'),
    choices: [bi('Axial', 'កាត់ផ្ដេក'), bi('Sagittal', 'កាត់ឆ្វេង–ស្តាំ'), bi('Coronal', 'កាត់មុខ–ក្រោយ')], answer: 1,
    explanation: bi('Sagittal planes separate left and right portions. Use the view buttons and sliders to compare all three directions.', 'ផ្ទៃកាត់ sagittal បែងចែកផ្នែកឆ្វេង និងស្តាំ។ ប្រើប៊ូតុងទិដ្ឋភាព និងរបាររំកិលដើម្បីប្រៀបធៀបទិសទាំងបី។') },
  { id: 'reference', prompt: bi('What are you exploring here?', 'តើអ្នកកំពុងស្វែងយល់អ្វីនៅទីនេះ?'),
    choices: [bi('A reference volume derived from averaged MRI data', 'រូបភាពយោងបីវិមាត្រដែលបានពីទិន្នន័យ MRI មធ្យម'), bi('Your own brain scan', 'រូបភាពស្កេនខួរក្បាលរបស់អ្នក'), bi('A tool that diagnoses a disease', 'ឧបករណ៍ធ្វើរោគវិនិច្ឆ័យ')], answer: 0,
    explanation: bi('This is a teaching reference, not an individual patient record. It does not represent every person, age or population.', 'នេះជារូបភាពយោងសម្រាប់សិក្សា មិនមែនកំណត់ត្រាអ្នកជំងឺម្នាក់ទេ។ វាមិនតំណាងឱ្យគ្រប់មនុស្ស គ្រប់វ័យ ឬគ្រប់ប្រជាជនទេ។') },
  { id: 'contrast', prompt: bi('What changes when you adjust the display contrast?', 'តើអ្វីផ្លាស់ប្ដូរពេលអ្នកកែភាពផ្ទុយពណ៌រូបភាព?'),
    choices: [bi('The tissue itself', 'ជាលិកាផ្ទាល់'), bi('The original MRI measurements', 'ទិន្នន័យវាស់ MRI ដើម'), bi('How existing values are mapped to shades on screen', 'របៀបបង្ហាញតម្លៃដែលមានស្រាប់ជាពណ៌ភ្លឺងងឹតលើអេក្រង់')], answer: 2,
    explanation: bi('Windowing changes the display, not the original voxel values. Brightness alone is not a diagnosis.', 'ការកែជួរបង្ហាញផ្លាស់ប្ដូរទិដ្ឋភាព មិនមែនតម្លៃទិន្នន័យដើមទេ។ ភាពភ្លឺងងឹតតែមួយមិនមែនជារោគវិនិច្ឆ័យទេ។') },
];
export function selectView(id) { return views.find(view => view.id === id) || views[0]; }
export function boundedIndex(value, dimension) {
  if (!Number.isInteger(dimension) || dimension < 1 || dimension > 1024) throw new RangeError('Invalid dimension');
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(0, Math.min(dimension - 1, Math.round(number))) : Math.floor((dimension - 1) / 2);
}
export function displayWindow(min, max, centerPercent, widthPercent) {
  if (![min, max, centerPercent, widthPercent].every(Number.isFinite) || max <= min) throw new RangeError('Invalid display range');
  const span = max - min;
  const center = min + span * Math.max(0, Math.min(100, centerPercent)) / 100;
  const width = span * Math.max(5, Math.min(200, widthPercent)) / 100;
  return [center - width / 2, center + width / 2];
}
export function gradeAnswer(question, choice) { return Number.isInteger(choice) && choice >= 0 && choice < question.choices.length && choice === question.answer; }
export function readNote(raw) {
  try { const value = JSON.parse(raw || 'null'); return typeof value === 'string' ? value.slice(0, 1500) : ''; }
  catch { return ''; }
}
