import { AppCategory, type AppEntry } from '@/types/app';
export const bodyWorksApp: AppEntry = {
  id: 'body-works',
  title: { en: 'How Your Body Works', km: 'របៀបដែលរាងកាយរបស់អ្នកដំណើរការ' },
  category: AppCategory.Stem,
  categoryLabel: { en: 'Medical & life sciences · Short course', km: 'វិទ្យាសាស្ត្រវេជ្ជសាស្ត្រ និងជីវិត · វគ្គខ្លី' },
  tagline: { en: 'One body. Many systems working together.', km: 'រាងកាយមួយ មានប្រព័ន្ធជាច្រើនធ្វើការរួមគ្នា។' },
  description: { en: 'Six short Khmer–English lessons: cells, heart and lungs, digestion, nerves and movement, kidneys and hormones, and immunity. Twelve retryable questions with explanations, locally saved progress and a small optional offline pack. Connected to the Virtual Microscope and Brain Scan Explorer.', km: 'មេរៀនខ្លី៦ជាខ្មែរ និងអង់គ្លេស៖ កោសិកា បេះដូងនិងសួត ការរំលាយ ប្រសាទនិងចលនា តម្រងនោមនិងអ័រម៉ូន និងភាពស៊ាំ។ សំណួរ១២មានការពន្យល់ វឌ្ឍនភាពលើឧបករណ៍ និងកញ្ចប់ក្រៅបណ្ដាញ។ ភ្ជាប់ទៅមីក្រូទស្សន៍ និងរូបភាពខួរក្បាល។' },
  audience: { en: 'Secondary students, teachers & introductory biology learners', km: 'សិស្សមធ្យមសិក្សា គ្រូ និងអ្នកចាប់ផ្ដើមសិក្សាជីវវិទ្យា' },
  grades: ['lower-secondary','high-school','vocational-adult'], hasBilingualToggle: true,
  features: [{ en: 'Six short lessons and twelve questions', km: 'មេរៀនខ្លី៦ និងសំណួរ១២' }, { en: 'Local progress and offline course download', km: 'វឌ្ឍនភាពលើឧបករណ៍ និងកញ្ចប់ក្រៅបណ្ដាញ' }, { en: 'Credited OpenStax adaptations and linked explorers', km: 'មេរៀនកែសម្រួលពី OpenStax មានប្រភព និងកម្មវិធីភ្ជាប់' }],
  tags: ['body','anatomy','physiology','biology','cells','heart','lungs','digestion','nerves','kidneys','hormones','immunity','OpenStax','course','រាងកាយ','កោសិកា','បេះដូង','ជីវវិទ្យា'],
  icon: 'lab', url: '/body-works/index.html', offlineReady: false,
  notice: { en: 'Save the course pack before going offline. Introductory education only; Khmer text is not teacher-reviewed. Adapted lesson content: CC BY-NC-SA 4.0.', km: 'រក្សាទុកកញ្ចប់មុនប្រើក្រៅបណ្ដាញ។ សម្រាប់ការអប់រំមូលដ្ឋាន។ ខ្មែរមិនទាន់បានពិនិត្យដោយគ្រូ។ មាតិកាកែសម្រួល៖ CC BY-NC-SA 4.0។' },
};
