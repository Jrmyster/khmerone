import { AppCategory, type AppEntry } from '@/types/app';

export const phetMathApp: AppEntry = {
  id: 'phet-math',
  title: { en: 'PhET · Additional Math Resources', km: 'PhET · ធនធានគណិតវិទ្យាបន្ថែម' },
  category: AppCategory.Simulations,
  categoryLabel: { en: 'Additional mathematics resources', km: 'ធនធានគណិតវិទ្យាបន្ថែម' },
  tagline: { en: 'Explore mathematics at your own level.', km: 'ស្វែងយល់ពីគណិតវិទ្យាតាមកម្រិតរបស់អ្នក។' },
  description: {
    en: 'A bilingual Khmer One guide to nine official PhET activities, from counting and fractions to algebra, graphs and calculus. Choose a suggested learning level. Activities open on PhET in a new tab and need internet; available simulation languages vary.',
    km: 'មគ្គុទ្ទេសក៍ Khmer One ពីរភាសាទៅកាន់សកម្មភាព PhET ផ្លូវការចំនួន ៩ ចាប់ពីការរាប់ និងប្រភាគ ដល់ពិជគណិត ក្រាប និងកាល់គុល។ ជ្រើសរើសកម្រិតរៀនដែលបានណែនាំ។ សកម្មភាពបើកនៅ PhET ក្នុងផ្ទាំងថ្មី និងត្រូវការអ៊ីនធឺណិត។ ភាសារបស់កម្មវិធីនីមួយៗអាចខុសគ្នា។',
  },
  audience: { en: 'Primary and secondary students, teachers & independent learners', km: 'សិស្សបឋមសិក្សា និងមធ្យមសិក្សា គ្រូ និងអ្នកសិក្សាដោយខ្លួនឯង' },
  grades: ['primary', 'lower-secondary', 'high-school', 'vocational-adult'],
  gradeBadge: { en: 'Primary to advanced · suggested levels', km: 'ពីបឋមដល់កម្រិតខ្ពស់ · កម្រិតណែនាំ' },
  hasBilingualToggle: true,
  features: [
    { en: 'Nine official PhET activity links', km: 'តំណសកម្មភាព PhET ផ្លូវការចំនួន ៩' },
    { en: 'Four suggested learning levels', km: 'កម្រិតរៀនណែនាំចំនួន ៤' },
    { en: 'Khmer / English guide and learning prompts', km: 'មគ្គុទ្ទេសក៍ និងសំណួរណែនាំជាខ្មែរ / អង់គ្លេស' },
  ],
  tags: ['PhET', 'additional resources', 'external', 'math', 'mathematics', 'STEM', 'arithmetic', 'counting', 'addition', 'multiplication', 'division', 'fractions', 'equations', 'algebra', 'graphing', 'quadratics', 'calculus', 'derivatives', 'integrals', 'គណិតវិទ្យា', 'ការរាប់', 'ប្រភាគ', 'ពិជគណិត', 'សមីការ', 'ក្រាប', 'ដេរីវេ', 'អាំងតេក្រាល'],
  icon: 'lab',
  url: '/phet-math',
  offlineReady: false,
};
