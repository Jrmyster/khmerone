import { bi } from './learning';

export const interiorTopics = [
  {
    id: 'civil-registration',
    title: bi('Register a birth or correct a civil record', 'ចុះបញ្ជីកំណើត ឬកែតម្រូវកំណត់ត្រាអត្រានុកូលដ្ឋាន'),
    question: bi('Ask the commune or sangkat registrar which office holds the record and what to bring for an initial registration, a copy or a correction.', 'សួរមន្ត្រីអត្រានុកូលដ្ឋានឃុំ ឬសង្កាត់ថា ការិយាល័យណារក្សាកំណត់ត្រា និងត្រូវយកអ្វីខ្លះសម្រាប់ចុះបញ្ជីដំបូង សុំច្បាប់ចម្លង ឬកែតម្រូវ។'),
    proposal: bi('Give families separate Khmer checklists for first registration, copies and corrections. A parent who spots a spelling difference could ask about it before travelling, saving a second trip and reducing later mismatches in school records.', 'ផ្តល់បញ្ជីត្រៀមឯកសារជាភាសាខ្មែរដាច់ដោយឡែកសម្រាប់ការចុះបញ្ជីដំបូង ការសុំច្បាប់ចម្លង និងការកែតម្រូវ។ បើឪពុកម្តាយឃើញឈ្មោះសរសេរខុសគ្នា ពួកគាត់អាចសួរមុនចេញដំណើរ ដើម្បីកាត់បន្ថយការធ្វើដំណើរម្តងទៀត និងភាពមិនស៊ីគ្នាក្នុងឯកសារសាលា។'),
    source: bi('Ministry of Interior digital services directory', 'បញ្ជីសេវាសាធារណៈឌីជីថលរបស់ក្រសួងមហាផ្ទៃ'),
    url: 'https://interior.gov.kh/tech_application_suite',
  },
  {
    id: 'identity-card',
    title: bi('Apply for, renew or replace a Khmer ID card', 'ស្នើសុំ បន្តសុពលភាព ឬសុំជំនួសអត្តសញ្ញាណប័ណ្ណសញ្ជាតិខ្មែរ'),
    question: bi('Ask the identification office where to apply for your situation, whether you must appear in person and how to check if your card is ready to collect.', 'សួរការិយាល័យអត្តសញ្ញាណកម្មថា ត្រូវដាក់ពាក្យនៅទីណាសម្រាប់ករណីរបស់អ្នក តើត្រូវទៅផ្ទាល់ឬទេ និងតើអាចពិនិត្យថាប័ណ្ណរួចរាល់ដោយរបៀបណា។'),
    proposal: bi('Offer a phone enquiry ទន្ទឹមនឹងdigital status checks. Workers could confirm a card is ready before taking time off, and people without smartphones could get the same information.', 'ផ្តល់មធ្យោបាយសាកសួរតាមទូរសព្ទ alongside ការពិនិត្យស្ថានភាពតាមប្រព័ន្ធឌីជីថល។ កម្មករអាចបញ្ជាក់ថាប័ណ្ណរួចរាល់មុនសុំច្បាប់ឈប់ពីការងារ ហើយអ្នកគ្មានទូរសព្ទឆ្លាតវៃក៏អាចទទួលព័ត៌មានដូចគ្នា។'),
    source: bi('GDI guidance on checking card status', 'ការណែនាំរបស់អគ្គនាយកដ្ឋានអត្តសញ្ញាណកម្មអំពីការពិនិត្យស្ថានភាពប័ណ្ណ'),
    url: 'https://news.gdi.gov.kh/posts/23273',
  },
  {
    id: 'one-window',
    title: bi('Find a One Window Service Office', 'ស្វែងរកការិយាល័យច្រកចេញចូលតែមួយ'),
    question: bi('Use the directory to identify a local office. Confirm it handles your service, its opening hours, the official fee if any, and how to obtain a receipt.', 'ប្រើបញ្ជីទំនាក់ទំនងដើម្បីរកការិយាល័យមូលដ្ឋាន។ សួរថាការិយាល័យនោះផ្តល់សេវាដែលអ្នកត្រូវការឬទេ ម៉ោងបើក តម្លៃផ្លូវការប្រសិនបើមាន និងរបៀបទទួលបង្កាន់ដៃ។'),
    proposal: bi('Post dated service lists, fees and collection instructions at local counters and online. Residents could plan travel costs and compare a quoted amount with the posted fee. Staff could direct visitors to the correct counter earlier.', 'បង្ហាញបញ្ជីសេវា តម្លៃ និងរបៀបមកទទួលឯកសារដោយមានកាលបរិច្ឆេទ នៅបញ្ជរសេវា និងលើអ៊ីនធឺណិត។ ពលរដ្ឋអាចគ្រោងចំណាយលើការធ្វើដំណើរ និងផ្ទៀងផ្ទាត់តម្លៃដែលបានប្រាប់ជាមួយតម្លៃដែលបានបង្ហាញ។ មន្ត្រីក៏អាចណែនាំអ្នកមកប្រើសេវាទៅបញ្ជរត្រឹមត្រូវបានឆាប់។'),
    source: bi('One Window Service Office contacts', 'ទំនាក់ទំនងការិយាល័យច្រកចេញចូលតែមួយ'),
    url: 'https://www.owso.gov.kh/en/contacts-us/',
  },
];
