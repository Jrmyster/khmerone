import { AppCategory, type AppEntry } from '@/types/app';

export const codapApp: AppEntry = {
  id: 'codap-evidence-lab',
  title: { en: 'CODAP · Evidence & Data Lab', km: 'CODAP · ភស្តុតាង និងទិន្នន័យ' },
  category: AppCategory.Stem,
  categoryLabel: { en: 'Science & data literacy', km: 'វិទ្យាសាស្ត្រ និងចំណេះដឹងទិន្នន័យ' },
  tagline: { en: 'Turn a question into a graph—and a careful conclusion.', km: 'បម្លែងសំណួរទៅជាក្រាហ្វ និងសេចក្ដីសន្និដ្ឋានដោយប្រុងប្រយ័ត្ន។' },
  description: {
    en: 'Use CODAP to explore a sun-versus-shade investigation with clearly labeled synthetic practice data. Follow Khmer/English guidance, make graphs, compare paired measurements and distinguish a pattern from a supported claim. Download the data and a printable worksheet for class.',
    km: 'ប្រើ CODAP ដើម្បីស្វែងយល់ការស៊ើបអង្កេតក្រោមពន្លឺថ្ងៃ និងម្លប់ ជាមួយទិន្នន័យសិប្បនិម្មិតសម្រាប់អនុវត្ត។ អនុវត្តតាមការណែនាំខ្មែរ/អង់គ្លេស បង្កើតក្រាហ្វ ប្រៀបធៀបការវាស់ជាគូ និងសន្និដ្ឋានតាមភស្តុតាង។ ទាញយកទិន្នន័យ និងបោះពុម្ពសន្លឹកកិច្ចការ។',
  },
  audience: { en: 'Secondary students, teachers & beginning researchers', km: 'សិស្សមធ្យមសិក្សា គ្រូ និងអ្នកចាប់ផ្ដើមស្រាវជ្រាវ' },
  grades: ['lower-secondary', 'high-school', 'vocational-adult'],
  hasBilingualToggle: true,
  features: [
    { en: 'Interactive CODAP graphs and tables', km: 'ក្រាហ្វ និងតារាងអន្តរកម្ម CODAP' },
    { en: 'Khmer/English evidence investigation', km: 'ការស៊ើបអង្កេតភស្តុតាងជាខ្មែរ/អង់គ្លេស' },
    { en: 'Practice CSV, observation template and print worksheet', km: 'ទិន្នន័យ CSV គំរូកត់ត្រា និងសន្លឹកកិច្ចការ' },
  ],
  tags: ['CODAP', 'science', 'evidence', 'data', 'research', 'statistics', 'graphs', 'experiments', 'sun', 'shade', 'temperature', 'វិទ្យាសាស្ត្រ', 'ភស្តុតាង', 'ទិន្នន័យ', 'ស្រាវជ្រាវ'],
  icon: 'lab',
  url: '/codap-lab.html',
  offlineReady: false,
  notice: {
    en: 'Internet needed for hosted CODAP. Lesson guidance is bilingual; CODAP controls are in English. Practice data are invented. Khmer text awaits teacher review.',
    km: 'ត្រូវការអ៊ីនធឺណិតសម្រាប់ CODAP។ ការណែនាំមានពីរភាសា ប៉ុន្តែឧបករណ៍ CODAP ជាអង់គ្លេស។ ទិន្នន័យអនុវត្តត្រូវបានបង្កើតឡើង។ អត្ថបទខ្មែរមិនទាន់បានពិនិត្យដោយគ្រូ។',
  },
};
