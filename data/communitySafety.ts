export type SafetyLocale = 'en' | 'km';
export type SafetyText = Record<SafetyLocale, string>;
const bi = (en: string, km: string): SafetyText => ({ en, km });
export const safetyChecked = '2026-10-31';
export const safetyNotice = bi('Independent Khmer One learning guide. Not a Ministry of National Defence service, live alert feed or emergency reporting channel. Follow current instructions from local authorities.', 'មគ្គុទ្ទេសក៍សិក្សាឯករាជ្យខ្មែរ វ័ន។ មិនមែនជាសេវាក្រសួងការពារជាតិ ប្រព័ន្ធព្រមានផ្ទាល់ ឬបណ្តាញរាយការណ៍អាសន្នទេ។ អនុវត្តតាមការណែនាំបច្ចុប្បន្នពីអាជ្ញាធរមូលដ្ឋាន។');
export const mineSafety = [
  bi('Do not approach, touch or move a suspicious object. Never try to open, burn or dismantle it.', 'កុំចូលជិត ប៉ះ ឬផ្លាស់ទីវត្ថុគួរឱ្យសង្ស័យ។ កុំព្យាយាមបើក ដុត ឬដោះវា។'),
  bi('Do not enter land suspected of containing mines or unexploded ordnance.', 'កុំចូលដីដែលសង្ស័យថាមានមីន ឬគ្រាប់មិនទាន់ផ្ទុះ។'),
  bi('Report it to local authorities or a nearby demining operator. Children should tell a trusted adult immediately.', 'រាយការណ៍ទៅអាជ្ញាធរមូលដ្ឋាន ឬអង្គភាពដោះមីននៅជិត។ កុមារគួរប្រាប់មនុស្សពេញវ័យដែលទុកចិត្តភ្លាមៗ។'),
];
export const safetySources = {
  mines: { label: bi('Government mine-safety message · AKP', 'សាររដ្ឋាភិបាលអំពីសុវត្ថិភាពមីន · AKP'), url: 'https://vps.akp.gov.kh/post/detail/362948' },
  cmac: { label: bi('CMAC · Risk education and victim assistance', 'CMAC · អប់រំហានិភ័យ និងជំនួយជនរងគ្រោះ'), url: 'https://cmac.gov.kh/what-we-do/eore-and-victim-assistance/' },
  plan: { label: bi('American Red Cross · General household planning', 'កាកបាទក្រហមអាមេរិក · ការធ្វើផែនការគ្រួសារទូទៅ'), url: 'https://www.redcross.org/get-help/how-to-prepare-for-emergencies/make-a-plan.html' },
  defence: { label: bi('Ministry of National Defence · General enquiries', 'ក្រសួងការពារជាតិ · ទំនាក់ទំនងទូទៅ'), url: 'https://mod.gov.kh/contact/' },
};
export const safetyTopics = [
  { id: 'mine-awareness', title: bi('Mine & unexploded-ordnance awareness', 'ការយល់ដឹងអំពីមីន និងគ្រាប់មិនទាន់ផ្ទុះ'), summary: bi('Learn simple protective habits and where to report concerns.', 'រៀនទម្លាប់ការពារងាយៗ និងកន្លែងរាយការណ៍ការព្រួយបារម្ភ។'),
    steps: mineSafety,
    benefit: bi('Helps children, farmers and families recognise when to seek trained help, reducing avoidable exposure to explosive hazards.', 'ជួយកុមារ កសិករ និងគ្រួសារដឹងពេលត្រូវស្វែងរកអ្នកជំនាញ ដើម្បីកាត់បន្ថយការប្រឈមនឹងគ្រោះថ្នាក់គ្រឿងផ្ទុះ។'),
    sources: [safetySources.mines, safetySources.cmac] },
  { id: 'family-plan', title: bi('Prepare together before an emergency', 'ត្រៀមខ្លួនរួមគ្នាមុនពេលអាសន្ន'), summary: bi('Agree how your household will reconnect and help each other.', 'ព្រមព្រៀងពីរបៀបទាក់ទងគ្នាឡើងវិញ និងជួយគ្នាក្នុងគ្រួសារ។'),
    steps: [bi('Discuss local risks and follow local instructions about sheltering or evacuation.', 'ពិភាក្សាហានិភ័យមូលដ្ឋាន និងអនុវត្តការណែនាំអំពីការស្នាក់នៅកន្លែងសុវត្ថិភាព ឬការជម្លៀស។'), bi('Choose meeting places and a contact outside your area; keep contact details on paper.', 'ជ្រើសកន្លែងជួប និងអ្នកទំនាក់ទំនងក្រៅតំបន់ ហើយកត់លេខទំនាក់ទំនងលើក្រដាស។'), bi('Plan assistance for children, older people and people with disabilities. Practise the plan together.', 'រៀបចំជំនួយសម្រាប់កុមារ មនុស្សចាស់ និងជនមានពិការភាព។ ហាត់ផែនការរួមគ្នា។')],
    benefit: bi('Clear roles and accessible plans can reduce confusion and help families reconnect when services are disrupted.', 'តួនាទីច្បាស់ និងផែនការដែលគ្រប់គ្នាអាចប្រើបាន អាចកាត់បន្ថយភាពច្របូកច្របល់ និងជួយគ្រួសារទាក់ទងគ្នាពេលសេវារអាក់រអួល។'),
    sources: [safetySources.plan] },
  { id: 'official-information', title: bi('Find official defence information', 'ស្វែងរកព័ត៌មានការពារជាតិផ្លូវការ'), summary: bi('Use the ministry website for public announcements and general enquiries.', 'ប្រើគេហទំព័រក្រសួងសម្រាប់សេចក្តីប្រកាស និងទំនាក់ទំនងទូទៅ។'),
    steps: [bi('Open the Ministry of National Defence website and check the date and issuing institution of a notice.', 'បើកគេហទំព័រក្រសួងការពារជាតិ ហើយពិនិត្យកាលបរិច្ឆេទ និងស្ថាប័នចេញសេចក្តីជូនដំណឹង។'), bi('Confirm a forwarded message against its original source before sharing it.', 'ផ្ទៀងផ្ទាត់សារដែលបានបញ្ជូនបន្តជាមួយប្រភពដើម មុនចែករំលែក។'), bi('The ministry contact page is for general enquiries. For an immediate hazard, contact local authorities or the relevant emergency service.', 'ទំព័រទំនាក់ទំនងក្រសួងសម្រាប់សំណួរទូទៅ។ ចំពោះគ្រោះថ្នាក់បន្ទាន់ ទាក់ទងអាជ្ញាធរមូលដ្ឋាន ឬសេវាអាសន្នពាក់ព័ន្ធ។')],
    benefit: bi('Source checking can reduce rumours and help residents distinguish public information from urgent local instructions.', 'ការផ្ទៀងផ្ទាត់ប្រភពអាចកាត់បន្ថយព័ត៌មានចចាមអារ៉ាម និងជួយបែងចែកព័ត៌មានទូទៅពីការណែនាំបន្ទាន់មូលដ្ឋាន។'),
    sources: [safetySources.defence] },
  { id: 'support', title: bi('Find support after an injury or disruption', 'ស្វែងរកជំនួយក្រោយរបួស ឬការរំខានជីវភាព'), summary: bi('Connect with rehabilitation, disability, veterans and household-assistance resources.', 'ភ្ជាប់ទៅធនធានស្តារនីតិសម្បទា ពិការភាព អតីតយុទ្ធជន និងជំនួយគ្រួសារ។'),
    steps: [bi('Use the Support Services Navigator to find a relevant provider.', 'ប្រើមគ្គុទ្ទេសក៍សេវាជំនួយ ដើម្បីរកអ្នកផ្តល់សេវាពាក់ព័ន្ធ។'), bi('Ask the provider about availability, accessibility, eligibility and referral requirements before travelling.', 'សួរអ្នកផ្តល់សេវាអំពីសេវាដែលមាន ភាពងាយស្រួលចូលប្រើ លក្ខខណ្ឌ និងការបញ្ជូន មុនធ្វើដំណើរ។')],
    benefit: bi('Clear referrals can help affected people and caregivers reach support and participate in community life.', 'ការបញ្ជូនច្បាស់អាចជួយអ្នករងផលប៉ះពាល់ និងអ្នកថែទាំរកជំនួយ និងចូលរួមក្នុងជីវិតសហគមន៍។'),
    sources: [safetySources.cmac] },
];
export const safetyChecklist = [
  bi('Discuss the emergencies most likely in our community.', 'ពិភាក្សាអំពីគ្រោះអាសន្នដែលអាចកើតក្នុងសហគមន៍យើង។'),
  bi('Agree on meeting places and an out-of-area contact.', 'ព្រមព្រៀងកន្លែងជួប និងអ្នកទំនាក់ទំនងក្រៅតំបន់។'),
  bi('Keep important contact details on paper as well as on a phone.', 'រក្សាព័ត៌មានទំនាក់ទំនងសំខាន់លើក្រដាស និងក្នុងទូរស័ព្ទ។'),
  bi('Arrange help for children, older people and people with disabilities.', 'រៀបចំជំនួយសម្រាប់កុមារ មនុស្សចាស់ និងជនមានពិការភាព។'),
  bi('Discuss local shelter or evacuation instructions and practise our plan.', 'ពិភាក្សាការណែនាំមូលដ្ឋានអំពីទីជម្រក ឬការជម្លៀស ហើយហាត់ផែនការយើង។'),
  bi('Review the do-not-touch message and who to tell about suspected mines or unexploded ordnance.', 'រំឭកសារកុំប៉ះ និងអ្នកដែលត្រូវប្រាប់អំពីមីន ឬគ្រាប់មិនទាន់ផ្ទុះដែលសង្ស័យ។'),
];
export function safetyPlanText(locale: SafetyLocale, checked: readonly number[] = []) {
  const tr = (en: string, km: string) => locale === 'km' ? km : en;
  return [tr('Khmer One · Household safety checklist', 'ខ្មែរ វ័ន · បញ្ជីសុវត្ថិភាពគ្រួសារ'), safetyNotice[locale], '',
    ...safetyChecklist.map((item, i) => `${checked.includes(i) ? '☑' : '☐'} ${item[locale]}`), '',
    tr('Mine and unexploded-ordnance awareness', 'ការយល់ដឹងអំពីមីន និងគ្រាប់មិនទាន់ផ្ទុះ'), ...mineSafety.map(item => item[locale]), '',
    tr('Write privately on your printed copy:', 'សរសេរជាឯកជនលើច្បាប់បោះពុម្ពរបស់អ្នក៖'),
    tr('Meeting places: ____________________', 'កន្លែងជួប៖ ____________________'),
    tr('Family / local authority contacts: ____________________', 'ទំនាក់ទំនងគ្រួសារ / អាជ្ញាធរមូលដ្ឋាន៖ ____________________'),
    tr('Assistance arrangements: ____________________', 'ការរៀបចំជំនួយ៖ ____________________'), '',
    ...Object.values(safetySources).map(source => `${source.label[locale]}: ${source.url}`),
    `${tr('Sources checked', 'បានពិនិត្យប្រភព')}: ${safetyChecked}`,
    tr('Khmer translation has not been reviewed by a teacher or safety specialist.', 'ការបកប្រែខ្មែរមិនទាន់បានពិនិត្យដោយគ្រូ ឬអ្នកជំនាញសុវត្ថិភាព។')].join('\n');
}
