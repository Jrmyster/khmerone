export type InspectionLocale = 'en' | 'km';
export type InspectionText = Record<InspectionLocale, string>;
const bi = (en: string, km: string): InspectionText => ({ en, km });
export const inspectionChecked = '2026-10-31';
export const inspectionNotice = bi('Independent Khmer One preparation tool. It is not operated by the Ministry of Inspection and does not submit complaints, investigate allegations or decide legal rights. Confirm the correct process with the receiving institution.', 'ឧបករណ៍ត្រៀមខ្លួនឯករាជ្យខ្មែរ វ័ន។ វាមិនដំណើរការដោយក្រសួងអធិការកិច្ច មិនដាក់ពាក្យបណ្តឹង មិនស៊ើបអង្កេតការចោទប្រកាន់ និងមិនសម្រេចសិទ្ធិផ្លូវច្បាប់ទេ។ បញ្ជាក់នីតិវិធីត្រឹមត្រូវជាមួយស្ថាប័នទទួល។');
export const inspectionChannels = [
  { id: 'inspection', title: bi('Ministry of Inspection enquiries', 'សំណួរទៅក្រសួងអធិការកិច្ច'), type: bi('Government', 'រដ្ឋាភិបាល'),
    summary: bi('Ask the ministry which inspection or public-service concern it can receive and how to proceed.', 'សួរក្រសួងថាអាចទទួលបញ្ហាអធិការកិច្ច ឬសេវាសាធារណៈណាខ្លះ និងត្រូវធ្វើដូចម្តេច។'),
    steps: [bi('Start with the ministry information or the TRC service-code directory, which lists 1268 for Ministry of Inspection public reporting.', 'ចាប់ផ្តើមពីព័ត៌មានក្រសួង ឬបញ្ជីលេខសេវា TRC ដែលរាយលេខ 1268 សម្រាប់ការរាយការណ៍សាធារណៈរបស់ក្រសួងអធិការកិច្ច។'), bi('Ask about jurisdiction, current submission requirements and follow-up arrangements before sharing your case.', 'សួរអំពីសមត្ថកិច្ច តម្រូវការដាក់ពាក្យបច្ចុប្បន្ន និងការតាមដាន មុនចែករំលែកករណីរបស់អ្នក។')],
    links: [{ label: bi('Ministry of Inspection', 'ក្រសួងអធិការកិច្ច'), url: 'https://inspection.gov.kh/' }, { label: bi('TRC · Published service codes', 'TRC · លេខសេវាដែលបានផ្សព្វផ្សាយ'), url: 'https://www.trc.gov.kh/en/resources/emergency-numbers/' }],
    note: bi('1268 is listed as a public-reporting service code. Confirm its hours and scope; do not treat it as an emergency dispatch number.', '1268 ត្រូវបានរាយជាលេខសេវារាយការណ៍សាធារណៈ។ បញ្ជាក់ម៉ោង និងវិសាលភាពរបស់វា។ កុំចាត់ទុកវាជាលេខសង្គ្រោះបន្ទាន់។'),
    keywords: ['Inspection', 'inspection ministry', '1268', 'អធិការកិច្ច'] },
  { id: 'interior', title: bi('Ministry of Interior complaints', 'ពាក្យបណ្តឹងក្រសួងមហាផ្ទៃ'), type: bi('Government · Separate institution', 'រដ្ឋាភិបាល · ស្ថាប័នដាច់ដោយឡែក'),
    summary: bi('The Interior ministry has its own General Department of Inspection and online complaint system.', 'ក្រសួងមហាផ្ទៃមានអគ្គាធិការដ្ឋាន និងប្រព័ន្ធទទួលពាក្យបណ្តឹងអនឡាញរបស់ខ្លួន។'),
    steps: [bi('Check whether the matter concerns officials or services within the Ministry of Interior’s responsibility.', 'ពិនិត្យថាបញ្ហាពាក់ព័ន្ធនឹងមន្ត្រី ឬសេវាក្នុងការទទួលខុសត្រូវក្រសួងមហាផ្ទៃឬទេ។'), bi('Read the official portal’s requirements. It requests complaint information, personal information, identity confirmation and supporting records.', 'អានតម្រូវការប្រព័ន្ធផ្លូវការ។ វាស្នើព័ត៌មានបណ្តឹង ព័ត៌មានផ្ទាល់ខ្លួន ការបញ្ជាក់អត្តសញ្ញាណ និងឯកសារគាំទ្រ។')],
    links: [{ label: bi('Interior ministry · Official apps directory', 'ក្រសួងមហាផ្ទៃ · បញ្ជីកម្មវិធីផ្លូវការ'), url: 'https://www.interior.gov.kh/en/tech_application_suite' }, { label: bi('Interior ministry · Complaint portal', 'ក្រសួងមហាផ្ទៃ · ប្រព័ន្ធពាក្យបណ្តឹង'), url: 'https://css-gdin.interior.gov.kh/home' }],
    note: bi('This portal belongs to the Ministry of Interior, not the separate Ministry of Inspection. Check requirements directly; Khmer One cannot promise anonymity or acceptance.', 'ប្រព័ន្ធនេះជារបស់ក្រសួងមហាផ្ទៃ មិនមែនក្រសួងអធិការកិច្ចដែលជាស្ថាប័នដាច់ដោយឡែកទេ។ ពិនិត្យតម្រូវការដោយផ្ទាល់។ ខ្មែរ វ័ន មិនអាចធានាភាពអនាមិក ឬការទទួលពាក្យបានទេ។'),
    keywords: ['Interior', 'complaint', 'CSS', 'public service', 'មហាផ្ទៃ', 'បណ្តឹង'] },
  { id: 'corruption', title: bi('Ask about a suspected corruption concern', 'សួរអំពីបញ្ហាសង្ស័យពុករលួយ'), type: bi('Government · Anti-Corruption Unit', 'រដ្ឋាភិបាល · អង្គភាពប្រឆាំងអំពើពុករលួយ'),
    summary: bi('Find the Anti-Corruption Unit’s own information and contact channels.', 'រកព័ត៌មាន និងបណ្តាញទំនាក់ទំនងរបស់អង្គភាពប្រឆាំងអំពើពុករលួយ។'),
    steps: [bi('Describe what you directly observed, separating facts from assumptions and information supplied by others.', 'ពិពណ៌នាអ្វីដែលអ្នកបានឃើញដោយផ្ទាល់ ដោយបែងចែកការពិតពីការសន្និដ្ឋាន និងព័ត៌មានពីអ្នកផ្សេង។'), bi('Ask ACU about the appropriate reporting route and the handling of personal information before submitting records.', 'សួរ អ.ប.ព. អំពីបណ្តាញរាយការណ៍សមស្រប និងការគ្រប់គ្រងព័ត៌មានផ្ទាល់ខ្លួន មុនដាក់ឯកសារ។')],
    links: [{ label: bi('Anti-Corruption Unit · Official website', 'អង្គភាពប្រឆាំងអំពើពុករលួយ · គេហទំព័រផ្លូវការ'), url: 'https://www.acu.gov.kh/' }],
    note: bi('A service delay or disagreement alone does not establish corruption. This tool makes no finding about anyone’s conduct.', 'ការយឺតសេវា ឬការមិនយល់ស្របតែមួយមុខ មិនបញ្ជាក់អំពើពុករលួយទេ។ ឧបករណ៍នេះមិនវិនិច្ឆ័យការប្រព្រឹត្តរបស់នរណាម្នាក់ទេ។'),
    keywords: ['ACU', 'corruption', 'bribe', 'ពុករលួយ', 'អ.ប.ព.'] },
  { id: 'advice', title: bi('Get independent advice before reporting', 'ស្វែងរកការប្រឹក្សាឯករាជ្យមុនរាយការណ៍'), type: bi('Independent organisation · Not government', 'អង្គការឯករាជ្យ · មិនមែនរដ្ឋាភិបាល'),
    summary: bi('Transparency International lists an Advocacy and Legal Advice Centre in Cambodia for corruption concerns.', 'អង្គការតម្លាភាពអន្តរជាតិរាយមជ្ឈមណ្ឌលប្រឹក្សា និងជំនួយផ្នែកច្បាប់នៅកម្ពុជាសម្រាប់បញ្ហាពុករលួយ។'),
    steps: [bi('Use the published Cambodia contact page to ask about available advice and whether it covers your concern.', 'ប្រើទំព័រទំនាក់ទំនងកម្ពុជាដែលបានផ្សព្វផ្សាយ ដើម្បីសួរអំពីការប្រឹក្សាដែលមាន និងថាតើគ្របដណ្តប់បញ្ហាអ្នកឬទេ។'), bi('If you are concerned about retaliation or privacy, discuss those concerns with an adviser before deciding what to disclose.', 'បើអ្នកបារម្ភអំពីការសងសឹក ឬឯកជនភាព ពិភាក្សាជាមួយអ្នកប្រឹក្សាមុនសម្រេចចិត្តបង្ហាញព័ត៌មាន។')],
    links: [{ label: bi('Transparency International · Cambodia advice contacts', 'អង្គការតម្លាភាពអន្តរជាតិ · ទំនាក់ទំនងប្រឹក្សានៅកម្ពុជា'), url: 'https://www.transparency.org/en/report-corruption/cambodia' }],
    note: bi('This is an independent advice service, not a government complaint decision-maker. Confirm availability and confidentiality arrangements directly.', 'នេះជាសេវាប្រឹក្សាឯករាជ្យ មិនមែនអ្នកសម្រេចពាក្យបណ្តឹងរដ្ឋាភិបាលទេ។ បញ្ជាក់សេវា និងការរក្សាការសម្ងាត់ដោយផ្ទាល់។'),
    keywords: ['advice', 'ALAC', 'Transparency International', 'privacy', 'ប្រឹក្សា', 'តម្លាភាព'] },
];
export const inspectionFields = [
  { id: 'service', label: bi('Service or office concerned', 'សេវា ឬការិយាល័យពាក់ព័ន្ធ'), hint: bi('Use the office or service name; leave personal identifiers out.', 'ប្រើឈ្មោះការិយាល័យ ឬសេវា ហើយកុំដាក់ព័ត៌មានកំណត់អត្តសញ្ញាណបុគ្គល។'), max: 200 },
  { id: 'timeline', label: bi('Dates and sequence', 'កាលបរិច្ឆេទ និងលំដាប់ហេតុការណ៍'), hint: bi('Record the order of events. Mark dates as approximate when unsure.', 'កត់លំដាប់ហេតុការណ៍។ សម្គាល់ថាកាលបរិច្ឆេទប្រហែល បើមិនប្រាកដ។'), max: 600 },
  { id: 'expected', label: bi('What service or response did you expect?', 'តើអ្នករំពឹងសេវា ឬចម្លើយអ្វី?'), hint: bi('Refer to a published instruction, receipt or explanation if available.', 'យោងការណែនាំ បង្កាន់ដៃ ឬការពន្យល់ដែលមាន។'), max: 600 },
  { id: 'observed', label: bi('What happened?', 'តើមានអ្វីកើតឡើង?'), hint: bi('Describe direct observations. Separate them from assumptions or second-hand information.', 'ពិពណ៌នាអ្វីដែលបានឃើញផ្ទាល់។ បែងចែកពីការសន្និដ្ឋាន ឬព័ត៌មានពីអ្នកផ្សេង។'), max: 1600 },
  { id: 'records', label: bi('Records already available', 'ឯកសារដែលមានរួច'), hint: bi('List receipts, messages or reference numbers you hold. No uploads; keep originals separately.', 'រាយបង្កាន់ដៃ សារ ឬលេខយោងដែលមាន។ មិនផ្ទុកឯកសារនៅទីនេះទេ ហើយរក្សាឯកសារដើមដាច់ដោយឡែក។'), max: 600 },
  { id: 'request', label: bi('What response are you requesting?', 'តើអ្នកស្នើសុំការឆ្លើយតបអ្វី?'), hint: bi('For example: a written explanation, a status update or correction of a record.', 'ឧទាហរណ៍៖ ការពន្យល់ជាលាយលក្ខណ៍អក្សរ ព័ត៌មានវឌ្ឍនភាព ឬការកែឯកសារ។'), max: 600 },
  { id: 'followup', label: bi('Follow-up notes', 'កំណត់ត្រាតាមដាន'), hint: bi('After contacting the institution, record its reply and any agreed next step privately.', 'ក្រោយទាក់ទងស្ថាប័ន កត់ចម្លើយ និងជំហានបន្ទាប់ដែលបានព្រមព្រៀងជាឯកជន។'), max: 600 },
] as const;
export type InspectionField = typeof inspectionFields[number]['id'];
export type InspectionDraft = Record<InspectionField, string>;
export function emptyInspectionDraft(): InspectionDraft { return { service: '', timeline: '', expected: '', observed: '', records: '', request: '', followup: '' }; }
export function updateInspectionDraft(draft: InspectionDraft, key: InspectionField, value: string): InspectionDraft {
  const field = inspectionFields.find(item => item.id === key);
  if (!field) return draft;
  return { ...draft, [key]: value.slice(0, field.max) };
}
export const inspectionChecklist = [
  bi('I have separated direct observations from assumptions.', 'ខ្ញុំបានបែងចែកអ្វីដែលឃើញផ្ទាល់ពីការសន្និដ្ឋាន។'),
  bi('I have checked which institution can receive this concern.', 'ខ្ញុំបានពិនិត្យស្ថាប័នដែលអាចទទួលបញ្ហានេះ។'),
  bi('I will confirm the required form, documents and any applicable deadline.', 'ខ្ញុំនឹងបញ្ជាក់ទម្រង់ ឯកសារ និងកាលកំណត់ដែលអាចអនុវត្ត។'),
  bi('I will review personal information before sharing and keep a copy of what I submit.', 'ខ្ញុំនឹងពិនិត្យព័ត៌មានផ្ទាល់ខ្លួនមុនចែករំលែក និងរក្សាច្បាប់ចម្លងអ្វីដែលបានដាក់។'),
];
export function inspectionDraftText(draft: InspectionDraft, locale: InspectionLocale, checked: readonly number[] = []) {
  const tr = (en: string, km: string) => locale === 'km' ? km : en;
  return [tr('Khmer One · Service issue worksheet', 'ខ្មែរ វ័ន · សន្លឹកកត់ត្រាបញ្ហាសេវា'), tr('DRAFT ONLY · NOTHING HAS BEEN SUBMITTED', 'សេចក្តីព្រាងប៉ុណ្ណោះ · មិនទាន់បានដាក់បញ្ជូន'), inspectionNotice[locale], '',
    ...inspectionFields.flatMap(field => [field.label[locale], draft[field.id].trim() || '____________________', '']),
    ...inspectionChecklist.map((item, i) => `${checked.includes(i) ? '☑' : '☐'} ${item[locale]}`), '',
    ...inspectionChannels.flatMap(channel => [channel.title[locale], channel.type[locale], ...channel.links.map(link => `${link.label[locale]}: ${link.url}`)]),
    `${tr('Sources reviewed', 'បានពិនិត្យប្រភព')}: ${inspectionChecked}`,
    tr('Khmer text has not been teacher-reviewed. Store this file privately; it may contain your notes.', 'អត្ថបទខ្មែរមិនទាន់បានពិនិត្យដោយគ្រូ។ រក្សាឯកសារនេះជាឯកជន ព្រោះវាអាចមានកំណត់ត្រារបស់អ្នក។')].join('\n');
}
