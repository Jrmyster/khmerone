import { bi } from './types';

export type VerifiedPlace = {
  n: 1 | 9 | 11;
  lat: number;
  lon: number;
  title: ReturnType<typeof bi>;
  detail: ReturnType<typeof bi>;
  url: string;
  checked: string;
};

const schoolWaterReport = 'https://www.ppai.org/wp-content/uploads/2025/10/PWF-Impact-Report-2025-PromoCares.pdf';
const ramsarSites = 'https://rsis.ramsar.org/sites/default/files/rsiswp_search/exports/Ramsar-Sites-annotated-summary-Cambodia.pdf';

// Source review date; current access and condition are separate from documentary verification.
const checked = '2026-10-31';

export const verifiedPlaces: VerifiedPlace[] = [
  {
    n: 1, lat: 13.636392, lon: 104.241252, checked,
    title: bi('Tasiem Primary School, Siem Reap', 'សាលាបឋមសិក្សាតាសៀម ខេត្តសៀមរាប'),
    detail: bi('Planet Water Foundation identified the school and mapped a 2025 school water project. Ask the school about current learning resources and permission to visit.', 'មូលនិធិ Planet Water បានបង្ហាញទីតាំងសាលា និងគម្រោងទឹកសម្រាប់សាលាឆ្នាំ២០២៥។ សូមសួរសាលាអំពីសម្ភារៈសិក្សាដែលមានបច្ចុប្បន្ន និងសុំការអនុញ្ញាតមុនទៅទស្សនា។'),
    url: schoolWaterReport,
  },
  {
    n: 1, lat: 13.439231, lon: 104.36746, checked,
    title: bi('Khnar Topchey Primary School, Siem Reap', 'សាលាបឋមសិក្សាខ្នារទ័ពជ័យ ខេត្តសៀមរាប'),
    detail: bi('The project partner lists this school in its 2025 water and hygiene education report. Contact the school to confirm which materials or activities are available.', 'ដៃគូគម្រោងបានរាយឈ្មោះសាលានេះក្នុងរបាយការណ៍ឆ្នាំ២០២៥ ស្ដីពីទឹក និងការអប់រំអនាម័យ។ សូមសួរសាលាថាតើមានសម្ភារៈ ឬសកម្មភាពអ្វីខ្លះនៅបច្ចុប្បន្ន។'),
    url: schoolWaterReport,
  },
  {
    n: 9, lat: 13.75112, lon: 103.12611, checked,
    title: bi('Kantrong water and sanitation project', 'គម្រោងទឹក និងអនាម័យ Kantrong'),
    detail: bi('Clear Cambodia and charity: water documented this community project in July 2025. Ask the caretaker about access, maintenance and the latest water-quality check before using it.', 'អង្គការ Clear Cambodia និង charity: water បានកត់ត្រាគម្រោងសហគមន៍នេះក្នុងខែកក្កដា ឆ្នាំ២០២៥។ មុនប្រើប្រាស់ សូមសួរអ្នកថែទាំអំពីលទ្ធភាពចូលប្រើ ការថែទាំ និងការត្រួតពិនិត្យគុណភាពទឹកចុងក្រោយ។'),
    url: 'https://www.charitywater.org/projects/546-26',
  },
  {
    n: 9, lat: 11.9064, lon: 105.4615, checked,
    title: bi('TK2 bridge project, Tuol Kleang village', 'គម្រោងស្ពាន TK2 ភូមិទួលឃ្លាំង'),
    detail: bi('Approximate project location from the rural development ministry’s assessment of a bridge damaged by the 2020 floods. Ask the commune about current road access and repair status.', 'ទីតាំងគម្រោងប្រហាក់ប្រហែល យោងតាមការវាយតម្លៃរបស់ក្រសួងអភិវឌ្ឍន៍ជនបទលើស្ពានដែលខូចដោយសារទឹកជំនន់ឆ្នាំ២០២០។ សូមសួរឃុំអំពីស្ថានភាពផ្លូវ និងការជួសជុលបច្ចុប្បន្ន។'),
    url: 'https://documents1.worldbank.org/curated/en/099915002172225728/pdf/20220210000ESMP000KH0SEADRM0II00Final0.pdf',
  },
  {
    n: 9, lat: 12.25385, lon: 104.66729, checked,
    title: bi('Kampong Chhnang post office', 'ការិយាល័យប្រៃសណីយ៍ខេត្តកំពង់ឆ្នាំង'),
    detail: bi('Cambodia Post lists this public service point in Khsam commune. The pin follows the operator’s directory. Check collection hours directly before travelling.', 'ប្រៃសណីយ៍កម្ពុជារាយទីតាំងសេវានេះនៅសង្កាត់ខ្សាម។ ទីតាំងនៅលើផែនទីយោងតាមបញ្ជីរបស់ប្រៃសណីយ៍។ សូមបញ្ជាក់ម៉ោងទទួលបញ្ញើមុនធ្វើដំណើរ។'),
    url: 'https://cambodiapost.com.kh/location',
  },
  {
    n: 11, lat: 11.55063, lon: 104.94377, checked,
    title: bi('Trash is Nice, Phnom Penh', 'Trash is Nice ភ្នំពេញ'),
    detail: bi('Approximate Treellion Park landmark published by the plastic recycler. Contact the operator for the currently available drop-off point and accepted plastics before bringing any material.', 'ទីសម្គាល់ប្រហាក់ប្រហែលនៅសួន Treellion ដែលអ្នកកែច្នៃប្លាស្ទិកបានផ្សព្វផ្សាយ។ សូមសួរអំពីទីតាំងទទួលបច្ចុប្បន្ន និងប្រភេទប្លាស្ទិកដែលទទួល មុននឹងយកសម្ភារៈទៅ។'),
    url: 'https://trashisnice.wixsite.com/preciousplastic',
  },
  {
    n: 11, lat: 11.54447, lon: 104.92527, checked,
    title: bi('iOne electronics repair centre, Phnom Penh', 'មជ្ឈមណ្ឌលជួសជុលឧបករណ៍អេឡិចត្រូនិក iOne ភ្នំពេញ'),
    detail: bi('The approximate pin follows the service centre’s map on Mao Tse Tung Boulevard. Ask about your Apple device model, the diagnostic fee and an appointment.', 'ទីតាំងប្រហាក់ប្រហែលយោងតាមផែនទីរបស់មជ្ឈមណ្ឌលនៅលើមហាវិថីម៉ៅសេទុង។ សូមសួរអំពីម៉ូដែលឧបករណ៍ Apple របស់អ្នក ថ្លៃពិនិត្យ និងការណាត់ជួប។'),
    url: 'https://www.ione.com.kh/service-center/',
  },
  {
    n: 11, lat: 12.63083, lon: 104.51528, checked,
    title: bi('Stung Sen wetland, Kampong Thom', 'តំបន់ដីសើមស្ទឹងសែន ខេត្តកំពង់ធំ'),
    detail: bi('The Ramsar registry gives this representative point for a seasonally flooded freshwater forest. Ask local managers about paths and access before planning a visit or cleanup.', 'បញ្ជីរ៉ាមសារបង្ហាញចំណុចតំណាងសម្រាប់ព្រៃលិចទឹកតាមរដូវនេះ។ សូមសួរអ្នកគ្រប់គ្រងមូលដ្ឋានអំពីផ្លូវ និងការចូលទៅ មុនរៀបចំដំណើរទស្សនកិច្ច ឬសកម្មភាពសម្អាត។'),
    url: ramsarSites,
  },
  {
    n: 11, lat: 13.73417, lon: 106, checked,
    title: bi('Mekong wetland north of Stung Treng', 'តំបន់ដីសើមទន្លេមេគង្គភាគខាងជើងស្ទឹងត្រែង'),
    detail: bi('This Ramsar reference point represents a long river reach with channels and islands. It is an area marker. Ask local managers where public visits are permitted.', 'ចំណុចយោងរ៉ាមសារនេះតំណាងឱ្យតំបន់ទន្លេដ៏វែង ដែលមានដៃទន្លេ និងកោះ។ សូមសួរអ្នកគ្រប់គ្រងមូលដ្ឋានថាអាចទៅទស្សនានៅកន្លែងណាខ្លះ។'),
    url: ramsarSites,
  },
];
