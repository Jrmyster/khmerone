import { AppCategory, type AppEntry } from '@/types/app';
export const microscopeApp: AppEntry = {
  id: 'virtual-microscope',
  title: { en: 'Virtual Microscope', km: 'មីក្រូទស្សន៍និម្មិត' },
  category: AppCategory.Stem,
  categoryLabel: { en: 'Medical & life sciences', km: 'វិទ្យាសាស្ត្រវេជ្ជសាស្ត្រ និងជីវិត' },
  tagline: { en: 'Look closer at real tissue photographs.', km: 'ស្វែងយល់ជាលិកាតាមរូបថតមីក្រូទស្សន៍ពិត។' },
  description: { en: 'Zoom, pan and rotate teaching photographs of skeletal muscle, human blood and kidney tubules with OpenSeadragon. Compare tissue patterns, answer observation questions and save a private browser-local notebook. Download the separate microscope pack for offline use.', km: 'ពង្រីក អូស និងបង្វិលរូបថតសាច់ដុំ ឈាមមនុស្ស និងបំពង់តម្រងនោមដោយ OpenSeadragon។ ប្រៀបធៀបជាលិកា ឆ្លើយសំណួរ និងកត់ត្រាលើកម្មវិធីរុករក។ ទាញយកកញ្ចប់មីក្រូទស្សន៍ដោយឡែកសម្រាប់ប្រើក្រៅបណ្ដាញ។' },
  audience: { en: 'Secondary students, teachers & biology learners', km: 'សិស្សមធ្យមសិក្សា គ្រូ និងអ្នកសិក្សាជីវវិទ្យា' },
  grades: ['lower-secondary','high-school','vocational-adult'], hasBilingualToggle: true,
  features: [{ en: 'Three real, openly licensed specimens', km: 'សំណាកពិត៣មានអាជ្ញាបណ្ណបើកចំហ' }, { en: 'Touch and keyboard zoom controls', km: 'ពង្រីកដោយប៉ះ ឬក្ដារចុច' }, { en: 'Bilingual questions and local notes', km: 'សំណួរពីរភាសា និងកំណត់ត្រាលើឧបករណ៍' }],
  tags: ['microscope','OpenSeadragon','histology','biology','cells','blood','muscle','kidney','tissue','medical science','មីក្រូទស្សន៍','ជីវវិទ្យា','កោសិកា','ជាលិកា'],
  icon:'lab',url:'/virtual-microscope/index.html',offlineReady:false,
  notice:{en:'Save the microscope pack before going offline. Khmer text is not teacher-reviewed. Educational photographs only—not whole-slide scans or a diagnostic service.',km:'រក្សាទុកកញ្ចប់ជាមុនសម្រាប់ប្រើក្រៅបណ្ដាញ។ ខ្មែរមិនទាន់បានពិនិត្យដោយគ្រូ។ រូបថតសម្រាប់សិក្សា មិនមែនសេវារោគវិនិច្ឆ័យទេ។'}
};
