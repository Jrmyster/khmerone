export type SupportLocale = 'en' | 'km';
export type SupportText = Record<SupportLocale, string>;
const bi = (en: string, km: string): SupportText => ({ en, km });

export const supportCategories = [
  { id: 'assistance', label: bi('Household assistance', 'ជំនួយគ្រួសារ'), guide: bi('Ask your Commune/Sangkat office or village chief about requesting an IDPoor interview. An assessment is needed; this page cannot decide eligibility.', 'សួរសាលាឃុំ/សង្កាត់ ឬមេភូមិអំពីការស្នើសុំសម្ភាសន៍ IDPoor។ ត្រូវមានការវាយតម្លៃ។ ទំព័រនេះមិនអាចសម្រេចសិទ្ធិទទួលជំនួយបានទេ។') },
  { id: 'disability', label: bi('Disability & rehabilitation', 'ពិការភាព និងស្តារនីតិសម្បទា'), guide: bi('Ask the provider about an assessment, assistive devices, referral requirements, fees and accessible transport before travelling.', 'មុនធ្វើដំណើរ សួរអ្នកផ្តល់សេវាអំពីការវាយតម្លៃ ឧបករណ៍ជំនួយ លិខិតបញ្ជូន ថ្លៃសេវា និងមធ្យោបាយធ្វើដំណើរដែលសមស្រប។') },
  { id: 'older', label: bi('Older people', 'មនុស្សចាស់'), guide: bi('Ask HelpAge about community groups and programmes in your area, or ask local social affairs staff where to find appropriate support.', 'សួរ HelpAge អំពីក្រុមសហគមន៍ និងកម្មវិធីក្នុងតំបន់របស់អ្នក ឬសួរមន្ត្រីសង្គមកិច្ចមូលដ្ឋានអំពីជំនួយសមស្រប។') },
  { id: 'veterans', label: bi('Veterans & families', 'អតីតយុទ្ធជន និងគ្រួសារ'), guide: bi('Contact the Ministry or your provincial social affairs department for the correct veterans service. Ask which records are needed; no benefit amount or approval is promised here.', 'ទាក់ទងក្រសួង ឬមន្ទីរសង្គមកិច្ចខេត្ត ដើម្បីរកសេវាអតីតយុទ្ធជន។ សួរថាត្រូវការឯកសារអ្វីខ្លះ។ ទំព័រនេះមិនធានាចំនួនជំនួយ ឬការអនុម័តទេ។') },
  { id: 'children', label: bi('Children & families', 'កុមារ និងគ្រួសារ'), guide: bi('Children and young people can contact Child Helpline Cambodia on 1280. Ask a qualified support worker about family support and protection referrals.', 'កុមារ និងយុវជនអាចទាក់ទងខ្សែទូរសព្ទជំនួយកុមារកម្ពុជា តាមលេខ 1280។ សួរអ្នកជំនាញអំពីជំនួយគ្រួសារ និងការបញ្ជូនទៅសេវាការពារ។') },
  { id: 'youth', label: bi('Youth support', 'ការគាំទ្រយុវជន'), guide: bi('For youth rehabilitation or reintegration referrals, ask the Ministry or provincial social affairs department. Child Helpline also offers a place for young people to talk.', 'សម្រាប់សេវាស្តារនីតិសម្បទា ឬសមាហរណកម្មយុវជន សួរក្រសួង ឬមន្ទីរសង្គមកិច្ចខេត្ត។ យុវជនក៏អាចនិយាយជាមួយខ្សែទូរសព្ទជំនួយកុមារ។') },
] as const;
export type SupportCategory = typeof supportCategories[number]['id'];
export type SupportService = {
  id: string; name: SupportText; description: SupportText; nextStep: SupportText;
  reach: SupportText; categories: SupportCategory[]; kind: 'government' | 'ngo';
  url: string; source: string; checked: string; phone?: string; phoneLabel?: string;
};
export const supportServices: SupportService[] = [
  { id: 'mosvy', name: bi('Ministry of Social Affairs, Veterans and Youth Rehabilitation', 'ក្រសួងសង្គមកិច្ច អតីតយុទ្ធជន និងយុវនីតិសម្បទា'), kind: 'government', categories: ['assistance','disability','older','veterans','children','youth'],
    description: bi('Official starting point for social affairs, veterans and youth rehabilitation information and referrals.', 'កន្លែងចាប់ផ្តើមផ្លូវការសម្រាប់ព័ត៌មាន និងការបញ្ជូនទៅសេវាសង្គមកិច្ច អតីតយុទ្ធជន និងយុវនីតិសម្បទា។'),
    nextStep: bi('Ask which provincial department handles your request and confirm its contact details before visiting.', 'សួរថាមន្ទីរខេត្តណាទទួលបន្ទុកសំណើរបស់អ្នក ហើយបញ្ជាក់ព័ត៌មានទំនាក់ទំនងមុនទៅជួប។'),
    reach: bi('National ministry · Phnom Penh office', 'ក្រសួងថ្នាក់ជាតិ · ការិយាល័យនៅភ្នំពេញ'), url: 'https://mosvy.gov.kh/', source: 'https://mosvy.gov.kh/en/mission-2', checked: '2026-10-31', phone: '+85523726086', phoneLabel: '023 726 086' },
  { id: 'idpoor', name: bi('IDPoor · Ministry of Planning', 'IDPoor · ក្រសួងផែនការ'), kind: 'government', categories: ['assistance','disability','older','children','veterans','youth'],
    description: bi('Learn how households can request a poverty assessment through local authorities or the Public IDPoor app.', 'ស្វែងយល់ពីរបៀបស្នើសុំការវាយតម្លៃភាពក្រីក្ររបស់គ្រួសារ តាមអាជ្ញាធរមូលដ្ឋាន ឬកម្មវិធី Public IDPoor។'),
    nextStep: bi('Ask your Commune/Sangkat Working Group or village chief for an interview, or follow the official app instructions. Requesting an interview does not guarantee assistance.', 'ស្នើសុំសម្ភាសន៍ពីក្រុមការងារឃុំ/សង្កាត់ ឬមេភូមិ ឬធ្វើតាមការណែនាំកម្មវិធីផ្លូវការ។ ការស្នើសុំសម្ភាសន៍មិនធានាថានឹងទទួលជំនួយទេ។'),
    reach: bi('Local Commune/Sangkat pathway', 'តាមឃុំ/សង្កាត់មូលដ្ឋាន'), url: 'https://idpoor.gov.kh/en/faq/', source: 'https://idpoor.gov.kh/en/faq/', checked: '2026-10-31' },
  { id: 'exceed', name: bi('Exceed Worldwide · Cambodia', 'Exceed Worldwide · កម្ពុជា'), kind: 'ngo', categories: ['disability','veterans','children','older'],
    description: bi('Physical rehabilitation, prosthetics and orthotics, with community support for people with disabilities.', 'សេវាស្តារនីតិសម្បទារាងកាយ អវយវៈសិប្បនិម្មិត និងឧបករណ៍ទ្រទ្រង់ ព្រមទាំងការគាំទ្រសហគមន៍សម្រាប់ជនមានពិការភាព។'),
    nextStep: bi('Ask for the appropriate rehabilitation clinic and appointment process. Confirm eligibility and costs; free and paid options differ.', 'សួររកមណ្ឌលស្តារនីតិសម្បទាសមស្រប និងរបៀបណាត់ជួប។ បញ្ជាក់លក្ខខណ្ឌ និងថ្លៃសេវា ព្រោះជម្រើសឥតគិតថ្លៃ និងបង់ប្រាក់ខុសគ្នា។'),
    reach: bi('Cambodia programme · confirm nearest clinic', 'កម្មវិធីនៅកម្ពុជា · សួររកមណ្ឌលជិតបំផុត'), url: 'https://www.exceed-worldwide.org/cambodia', source: 'https://www.exceed-worldwide.org/cambodia', checked: '2026-10-31', phone: '+85523881494', phoneLabel: '023 881 494' },
  { id: 'helpage', name: bi('HelpAge Cambodia', 'អង្គការមនុស្សចាស់កម្ពុជា'), kind: 'ngo', categories: ['older'],
    description: bi('Works with older people and community groups on wellbeing, participation and social support.', 'ធ្វើការជាមួយមនុស្សចាស់ និងក្រុមសហគមន៍លើសុខុមាលភាព ការចូលរួម និងការគាំទ្រសង្គម។'),
    nextStep: bi('Ask whether an older people’s association or relevant programme is available in your area. Confirm any referral before travelling.', 'សួរថាមានសមាគមមនុស្សចាស់ ឬកម្មវិធីសមស្របក្នុងតំបន់របស់អ្នកឬទេ។ បញ្ជាក់ការបញ្ជូនមុនធ្វើដំណើរ។'),
    reach: bi('Battambang office · ask about local coverage', 'ការិយាល័យនៅបាត់ដំបង · សួរអំពីតំបន់សេវា'), url: 'https://helpagecambodia.org/', source: 'https://helpagecambodia.org/', checked: '2026-10-31', phone: '+85553953797', phoneLabel: '053 953 797' },
  { id: 'child-helpline', name: bi('Child Helpline Cambodia', 'ខ្សែទូរសព្ទជំនួយកុមារកម្ពុជា'), kind: 'ngo', categories: ['children','youth'],
    description: bi('Free phone counselling for children and young people. The provider lists 1280 as available 24 hours throughout Cambodia.', 'ការប្រឹក្សាតាមទូរសព្ទឥតគិតថ្លៃសម្រាប់កុមារ និងយុវជន។ អ្នកផ្តល់សេវាបញ្ជាក់ថាលេខ 1280 ដំណើរការ ២៤ ម៉ោងទូទាំងកម្ពុជា។'),
    nextStep: bi('Call 1280 to talk with a counsellor. This is a counselling line, not an emergency dispatch service.', 'ហៅលេខ 1280 ដើម្បីនិយាយជាមួយអ្នកប្រឹក្សា។ នេះជាខ្សែប្រឹក្សា មិនមែនជាសេវាបញ្ជូនក្រុមសង្គ្រោះបន្ទាន់ទេ។'),
    reach: bi('Phone support across Cambodia', 'ជំនួយតាមទូរសព្ទទូទាំងកម្ពុជា'), url: 'https://www.childhelplinecambodia.org/', source: 'https://www.childhelplinecambodia.org/', checked: '2026-10-31', phone: '1280', phoneLabel: '1280' },
  { id: 'dac', name: bi('Disability Action Council', 'ក្រុមប្រឹក្សាសកម្មភាពជនពិការ'), kind: 'government', categories: ['disability'],
    description: bi('Official disability rights, policy and accessibility information. A starting point for finding the responsible organisation.', 'ព័ត៌មានផ្លូវការអំពីសិទ្ធិជនមានពិការភាព គោលនយោបាយ និងភាពងាយស្រួលប្រើប្រាស់។ ជាកន្លែងចាប់ផ្តើមរកស្ថាប័នទទួលបន្ទុក។'),
    nextStep: bi('Ask where to find disability identification guidance or an appropriate local referral. This is not a clinic or benefit-approval service.', 'សួររកការណែនាំអំពីការកំណត់អត្តសញ្ញាណពិការភាព ឬការបញ្ជូនមូលដ្ឋាន។ នេះមិនមែនជាគ្លីនិក ឬសេវាអនុម័តជំនួយទេ។'),
    reach: bi('National information · Phnom Penh office', 'ព័ត៌មានថ្នាក់ជាតិ · ការិយាល័យនៅភ្នំពេញ'), url: 'https://dac.gov.kh/en/', source: 'https://dac.gov.kh/en/', checked: '2026-10-31', phone: '+85523727428', phoneLabel: '023 727 428' },
];

export const visitChecklist = [
  bi('Confirm the right office, opening hours, appointment and accessibility needs.', 'បញ្ជាក់ការិយាល័យត្រឹមត្រូវ ម៉ោងបើក ការណាត់ជួប និងតម្រូវការងាយស្រួលចូលប្រើ។'),
  bi('Ask which documents are required. Bring only what the provider confirms, such as identification, an Equity Card, a referral or relevant records.', 'សួរថាត្រូវការឯកសារអ្វីខ្លះ។ យកតែអ្វីដែលអ្នកផ្តល់សេវាបញ្ជាក់ ដូចជា អត្តសញ្ញាណប័ណ្ណ ប័ណ្ណសមធម៌ លិខិតបញ្ជូន ឬឯកសារពាក់ព័ន្ធ។'),
  bi('Ask about eligibility, costs and any available fee support before travelling.', 'សួរអំពីលក្ខខណ្ឌ ថ្លៃសេវា និងជំនួយថ្លៃសេវា មុនធ្វើដំណើរ។'),
  bi('Arrange transport and a trusted companion or communication assistance if needed.', 'រៀបចំមធ្យោបាយធ្វើដំណើរ និងអ្នកជឿទុកចិត្ត ឬជំនួយទំនាក់ទំនង ប្រសិនបើចាំបាច់។'),
  bi('At the visit, ask what happens next and how to follow up. Keep any official receipt.', 'ពេលទៅជួប សួរអំពីជំហានបន្ទាប់ និងរបៀបតាមដាន។ រក្សាទុកបង្កាន់ដៃផ្លូវការ។'),
];

export function filterSupportServices(query: string, category: SupportCategory | 'all'): SupportService[] {
  const words = query.normalize('NFKC').toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '').trim().split(/\s+/).filter(Boolean);
  return supportServices.filter(service => {
    if (category !== 'all' && !service.categories.includes(category)) return false;
    const content = [service.name, service.description, service.reach, service.nextStep, ...supportCategories.filter(c => service.categories.includes(c.id)).map(c => c.label)]
      .flatMap(value => Object.values(value)).join(' ').normalize('NFKC').toLowerCase().replace(/[\u200B-\u200D\uFEFF]/g, '');
    return words.every(word => content.includes(word));
  });
}

export function visitPlanText(service: SupportService, locale: SupportLocale): string {
  return ['Khmer One · ' + (locale === 'km' ? 'ផែនការទៅជួបសេវា' : 'Service visit plan'), service.name[locale], service.description[locale], service.nextStep[locale], service.phoneLabel || '', service.url, '', ...visitChecklist.map((item, i) => `${i + 1}. ${item[locale]}`), '', (locale === 'km' ? 'បានពិនិត្យប្រភព៖ ' : 'Source checked: ') + service.checked, locale === 'km' ? 'សូមបញ្ជាក់ព័ត៌មានជាមួយអ្នកផ្តល់សេវាមុនធ្វើដំណើរ។ Khmer One ជាមគ្គុទ្ទេសក៍ឯករាជ្យ។' : 'Confirm details with the provider before travelling. Khmer One is an independent guide.'].filter(Boolean).join('\n');
}
