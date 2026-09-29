export interface SearchPrompt {
  appId: string;
  en: string;
  km: string;
  query: string;
}

export const rotatingSearchPrompts: SearchPrompt[] = [
  {
    appId: "school-connect-cambodia",
    en: "Try: 'Explain Grade 10 Physics circuits & Ohm's law on School Connect Cambodia'",
    km: "សាកល្បង៖ 'ពន្យល់ពីសៀគ្វីអគ្គិសនី រូបវិទ្យាថ្នាក់ទី១០ លើ School Connect Cambodia'",
    query: "Grade 10 Physics circuits Ohm's law",
  },
  {
    appId: "finlitkh",
    en: "Try: 'How does the stock market & investment compound interest work on FinLit?'",
    km: "សាកល្បង៖ 'តើទីផ្សារភាគហ៊ុន និងការប្រាក់សមាសធ្វើការយ៉ាងដូចម្តេចលើ FinLit?'",
    query: "How stock market works compound interest",
  },
  {
    appId: "chhouk-baby",
    en: "Try: 'Find essential vaccination schedules & care milestones on Chhouk Baby'",
    km: "សាកល្បង៖ 'ស្វែងរកកាលវិភាគចាក់វ៉ាក់សាំង និងការថែទាំទារកលើ Chhouk Baby'",
    query: "Vaccination schedule baby health care",
  },
  {
    appId: "anatomykh",
    en: "Try: 'Explore 3D human heart structures & blood circulation on AnatomyKH'",
    km: "សាកល្បង៖ 'រៀនពីទម្រង់បេះដូង និងប្រព័ន្ធលំហូរឈាមបែប 3D លើ AnatomyKH'",
    query: "3D human heart structure blood flow",
  },
  {
    appId: "khmer-vocation",
    en: "Try: 'Practice conversational English phrases for hospitality on Khmer Vocational'",
    km: "សាកល្បង៖ 'ហាត់និយាយឃ្លាភាសាអង់គ្លេសសម្រាប់ការងារសេវាកម្មលើ Khmer Vocational'",
    query: "English conversation practice hospitality",
  },
];
