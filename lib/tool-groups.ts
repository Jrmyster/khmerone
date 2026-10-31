// One grouping for the homepage, app catalog, and both versions of the navigation.
export const toolGroups = [
  {
    id: 'educational-tools',
    title: { en: 'Educational Tools', km: 'ឧបករណ៍អប់រំ' },
    description: { en: 'Practise a subject, prepare a lesson or explore a simulation.', km: 'អនុវត្តមុខវិជ្ជា ត្រៀមមេរៀន ឬសាកល្បងកម្មវិធីក្លែងធ្វើ។' },
    tools: [
      ['Keyboard Garden', 'រៀនវាយអក្សរ', '/typing'],
      ['Learning studio', 'កន្លែងសិក្សា', '/learning'],
      ['STEM dictionary', 'វចនានុក្រម STEM', '/learning/dictionary'],
      ['Speaking practice', 'ហាត់និយាយ', '/learning/speaking'],
      ['Listening quizzes', 'សំណួរស្តាប់', '/learning/quiz-maker'],
      ['Story library', 'បណ្ណាល័យរឿង', '/learning/stories'],
      ['Announcements', 'សេចក្ដីជូនដំណឹង', '/learning/announcements'],
      ['Translation', 'ការបកប្រែ', '/learning/translation'],
      ['Live quiz', 'សំណួរផ្ទាល់', '/learning/live-quiz'],
      ['School exchange', 'ការចែករំលែកសាលា', '/learning/exchange'],
      ['Audio Maker', 'កម្មវិធីសំឡេង', '/teacher-audio'],
      ['Teacher Toolkit', 'ឧបករណ៍គ្រូ', '/teacher-toolkit'],
      ['Computer Engineering', 'វិស្វកម្មកុំព្យូទ័រ', '/computer-engineering'],
      ['Engine Lab', 'មន្ទីរពិសោធន៍ម៉ាស៊ីន', '/engine-lab.html'],
    ],
  },
  {
    id: 'ministry-tools',
    title: { en: 'Ministry Tools', km: 'ឧបករណ៍តាមក្រសួង' },
    description: { en: 'Find Cambodian public services, community guides and practical worksheets.', km: 'ស្វែងរកសេវាសាធារណៈកម្ពុជា មគ្គុទ្ទេសក៍សហគមន៍ និងសន្លឹកកិច្ចការ។' },
    tools: [
      ['Browse by ministry', 'រកមើលតាមក្រសួង', '/ministries'],
      ['Posts and telecommunications', 'ប្រៃសណីយ៍ និងទូរគមនាគមន៍', '/posts-and-telecommunications'],
      ['Ministry of Interior', 'ក្រសួងមហាផ្ទៃ', '/interior'],
      ['Inspection & accountability', 'អធិការកិច្ច និងគណនេយ្យភាព', '/inspection'],
      ['International services', 'សេវាអន្តរជាតិ', '/international-services'],
      ['Community safety', 'សុវត្ថិភាពសហគមន៍', '/community-safety'],
      ['Government services', 'សេវារដ្ឋាភិបាល', '/public-services'],
      ['Support services', 'សេវាជំនួយ', '/social-support'],
    ],
  },
] as const;

const ministryUrls = new Set<string>(toolGroups[1].tools.map(tool => tool[2]));
export function toolGroupId(url: string | null) {
  return url && (ministryUrls.has(url) || url.startsWith('/ministries/')) ? 'ministry-tools' : 'educational-tools';
}
