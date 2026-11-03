import { AppCategory, type AppEntry } from '@/types/app';

export const learningLabs: AppEntry[] = [
  {
    id: 'learning-labs',
    title: { en: 'Learning Labs · Explore & Experiment', km: 'សកម្មភាពសិក្សា · ស្វែងយល់ និងពិសោធន៍' },
    category: AppCategory.Stem,
    categoryLabel: { en: 'Educational tools', km: 'ឧបករណ៍អប់រំ' },
    tagline: { en: 'Learn by doing, in Khmer and English.', km: 'រៀនតាមការអនុវត្ត ជាខ្មែរ និងអង់គ្លេស។' },
    description: { en: 'Interactive math, 3D molecules, block coding with Rasmey, scientific evidence, spaced vocabulary practice, an illustrated science reader, and simplified eye optics. Save the local activity pack before going offline. Five additional resources open external websites.', km: 'គណិតវិទ្យាអន្តរកម្ម ម៉ូលេគុល 3D កូដប្លុកជាមួយរស្មី ភស្តុតាងវិទ្យាសាស្ត្រ វាក្យសព្ទ សៀវភៅវិទ្យាសាស្ត្រ និងអុបទិកភ្នែកសាមញ្ញ។ រក្សាទុកកញ្ចប់ជាមុនសម្រាប់ប្រើក្រៅបណ្ដាញ។ ធនធានបន្ថែម៥បើកគេហទំព័រខាងក្រៅ។' },
    audience: { en: 'Students, teachers & independent learners', km: 'សិស្ស គ្រូ និងអ្នករៀនដោយខ្លួនឯង' },
    grades: ['primary', 'lower-secondary', 'high-school', 'vocational-adult'],
    hasBilingualToggle: true,
    features: [{ en: 'Seven local learning activities', km: 'សកម្មភាពសិក្សាក្នុងគេហទំព័រចំនួន៧' }, { en: 'Explicit offline download with integrity checks', km: 'ទាញយកសម្រាប់ប្រើក្រៅបណ្ដាញ' }, { en: 'Open-source credits and external resource guides', km: 'ប្រភពកូដ និងធនធានខាងក្រៅ' }],
    tags: ['learning labs', 'H5P', 'JSXGraph', '3Dmol', 'Blockly', 'FSRS', 'Bloom', 'Python', 'Pyodide', 'Kolibri', 'Kiwix', 'circuits', 'math', 'chemistry', 'coding', 'reading', 'science', 'offline', 'វិទ្យាសាស្ត្រ', 'គណិតវិទ្យា'],
    icon: 'lab', url: '/learning-labs/index.html', offlineReady: false,
    notice: { en: 'Save the activity pack on this device first. External resources are not included. Khmer translations are drafts for teacher review.', km: 'រក្សាទុកកញ្ចប់សកម្មភាពលើឧបករណ៍នេះជាមុន។ ធនធានខាងក្រៅមិនរួមបញ្ចូលទេ។ ការបកប្រែខ្មែរជាសេចក្ដីព្រាងសម្រាប់គ្រូពិនិត្យ។' },
  },
  {
    id: 'eye-optics',
    title: { en: 'Eye Optics · Optometry Foundation', km: 'អុបទិកភ្នែក · មូលដ្ឋានចក្ខុវិទ្យា' },
    category: AppCategory.Simulations,
    categoryLabel: { en: 'Physics & vision science', km: 'រូបវិទ្យា និងវិទ្យាសាស្ត្រចក្ខុវិស័យ' },
    tagline: { en: 'Explore focusing and find the gkaModelEye research project.', km: 'ស្វែងយល់ការផ្ដោតពន្លឺ និងគម្រោងស្រាវជ្រាវ gkaModelEye។' },
    description: { en: 'An original, simplified optical teaching model with adjustable eye length and lens power. Separately links to gkaguirrelab/gkaModelEye, the MATLAB anatomical research model; that model is not executed in the browser.', km: 'គំរូអុបទិកសាមញ្ញសម្រាប់សិក្សា ដែលអាចប្ដូរប្រវែងភ្នែក និងកម្លាំងកែវ។ ភ្ជាប់ដោយឡែកទៅ gkaguirrelab/gkaModelEye ក្នុង MATLAB ដែលមិនដំណើរការក្នុងកម្មវិធីរុករក។' },
    audience: { en: 'Secondary students, teachers & vision-science learners', km: 'សិស្សមធ្យមសិក្សា គ្រូ និងអ្នកសិក្សាចក្ខុវិទ្យា' },
    grades: ['lower-secondary', 'high-school', 'vocational-adult'],
    hasBilingualToggle: true,
    features: [{ en: 'Interactive simplified ray diagram', km: 'ដ្យាក្រាមកាំពន្លឺអន្តរកម្មសាមញ្ញ' }, { en: 'Research repository and MATLAB setup link', km: 'ឃ្លាំងកូដស្រាវជ្រាវ និងការដំឡើង MATLAB' }],
    tags: ['eye', 'optometry', 'gkaModelEye', 'optics', 'lens', 'retina', 'refraction', 'ភ្នែក'],
    icon: 'lab', url: '/learning-labs/index.html#eye', offlineReady: false,
    notice: { en: 'Educational model only—not a vision test, diagnosis or prescription calculator.', km: 'គំរូសម្រាប់អប់រំតែប៉ុណ្ណោះ មិនមែនជាតេស្តចក្ខុវិស័យ រោគវិនិច្ឆ័យ ឬឧបករណ៍គណនាវ៉ែនតាទេ។' },
  },
];
