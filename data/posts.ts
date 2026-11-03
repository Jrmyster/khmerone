import { bi } from './learning';

export const postsTopics = [
  {
    id: 'postcode',
    title: bi('Find a postcode', 'ស្វែងរកលេខកូដប្រៃសណីយ៍'),
    action: bi('Look up the destination commune or sangkat and confirm the address with the recipient before sending.', 'ស្វែងរកឃុំ ឬសង្កាត់គោលដៅ ហើយផ្ទៀងផ្ទាត់អាសយដ្ឋានជាមួយអ្នកទទួលមុនពេលផ្ញើ។'),
    proposal: bi('Give each commune office a printable postcode card with a sample parcel label in Khmer. A village seller could copy the format onto a package even without internet access, reducing delays caused by incomplete addresses.', 'ផ្តល់បណ្ណលេខកូដប្រៃសណីយ៍ដែលអាចបោះពុម្ពបានដល់ការិយាល័យឃុំនីមួយៗ ដោយមានគំរូស្លាកបញ្ញើជាភាសាខ្មែរ។ អ្នកលក់នៅភូមិអាចយកគំរូនេះទៅសរសេរលើកញ្ចប់ ទោះគ្មានអ៊ីនធឺណិតក៏ដោយ ដើម្បីកាត់បន្ថយការយឺតយ៉ាវដោយសារអាសយដ្ឋានមិនពេញលេញ។'),
    source: bi('Cambodia Postcode', 'លេខកូដប្រៃសណីយ៍កម្ពុជា'), url: 'https://postcode.gov.kh/',
  },
  {
    id: 'parcel',
    title: bi('Track a parcel', 'តាមដានបញ្ញើ'),
    action: bi('Open Cambodia Post tracking and enter the code from your receipt. Keep the receipt so the post office can identify the shipment if an update is unclear.', 'បើកទំព័រតាមដានបញ្ញើរបស់ប្រៃសណីយ៍កម្ពុជា រួចបញ្ចូលលេខកូដលើបង្កាន់ដៃ។ រក្សាបង្កាន់ដៃទុក ដើម្បីឱ្យមន្ត្រីប្រៃសណីយ៍អាចរកបញ្ញើឃើញ ប្រសិនបើព័ត៌មានតាមដានមិនច្បាស់។'),
    proposal: bi('Offer optional Khmer text messages when a parcel is ready for pickup. Include the collection office and opening hours so a rural family can plan one trip and avoid losing a day of work.', 'ផ្តល់ជម្រើសទទួលសារជាភាសាខ្មែរពេលបញ្ញើរួចរាល់សម្រាប់មកទទួល។ បញ្ជាក់ទីតាំងការិយាល័យ និងម៉ោងបើក ដើម្បីឱ្យគ្រួសារនៅជនបទអាចរៀបចំដំណើរតែមួយលើក និងជៀសវាងការខាតពេលធ្វើការ។'),
    source: bi('Cambodia Post tracking', 'តាមដានបញ្ញើនៅប្រៃសណីយ៍កម្ពុជា'), url: 'https://www.cambodiapost.com.kh/tracking/search',
  },
  {
    id: 'internet-plans',
    title: bi('Compare internet offers', 'ប្រៀបធៀបគម្រោងអ៊ីនធឺណិត'),
    action: bi('Ask each provider for the monthly price, installation charge, equipment cost, taxes and contract length. Check whether the advertised price changes after a promotion.', 'សួរក្រុមហ៊ុននីមួយៗអំពីតម្លៃប្រចាំខែ ថ្លៃដំឡើង ថ្លៃឧបករណ៍ ពន្ធ និងរយៈពេលកិច្ចសន្យា។ ពិនិត្យថាតើតម្លៃនឹងផ្លាស់ប្តូរឬទេ ក្រោយពេលផុតការផ្តល់ជូនពិសេស។'),
    proposal: bi('Have providers show the first-year total on a standard Khmer price sheet. A school comparing two offers could see when a lower monthly price is outweighed by installation and equipment charges, and budget for a full school year.', 'ឱ្យក្រុមហ៊ុនបង្ហាញចំណាយសរុបសម្រាប់ឆ្នាំដំបូងលើតារាងតម្លៃគំរូរួមជាភាសាខ្មែរ។ សាលារៀនអាចមើលឃើញថាតើថ្លៃដំឡើង និងថ្លៃឧបករណ៍ធ្វើឱ្យគម្រោងដែលមានតម្លៃប្រចាំខែទាប បែរជាចំណាយច្រើនជាងគម្រោងមួយទៀតឬទេ ហើយអាចរៀបចំថវិកាសម្រាប់មួយឆ្នាំសិក្សា។'),
    source: bi('TRC guidance on internet service offers', 'សេចក្តីណែនាំរបស់និយ័តករទូរគមនាគមន៍កម្ពុជាអំពីសេវាអ៊ីនធឺណិត'),
    url: 'https://www.trc.gov.kh/km/media/news-releases/14-news-release',
  },
  {
    id: 'outages',
    title: bi('Follow up on an internet outage', 'សាកសួរអំពីបញ្ហាដាច់អ៊ីនធឺណិត'),
    action: bi('Tell your provider when the outage started and which area is affected. Ask for a ticket number. If the issue remains unresolved, follow the telecom regulator’s complaint link or call 6789 during working hours.', 'ជូនដំណឹងទៅក្រុមហ៊ុនអំពីពេលចាប់ផ្តើមដាច់សេវា និងតំបន់ដែលរងផលប៉ះពាល់។ សុំលេខយោងសម្រាប់តាមដាន។ បើបញ្ហានៅតែមិនទាន់ដោះស្រាយ សូមប្រើតំណបណ្តឹងរបស់និយ័តករទូរគមនាគមន៍កម្ពុជា ឬហៅលេខ ៦៧៨៩ ក្នុងម៉ោងធ្វើការ។'),
    proposal: bi('Publish monthly outage hours by commune using aggregated reports. Repeated interruptions near a school or health centre would be visible to repair teams, and residents could check whether service improved after repairs.', 'ផ្សព្វផ្សាយចំនួនម៉ោងដាច់សេវាប្រចាំខែតាមឃុំ ដោយប្រើរបាយការណ៍បូកសរុប។ ក្រុមជួសជុលអាចសម្គាល់តំបន់ជិតសាលារៀន ឬមណ្ឌលសុខភាពដែលដាច់សេវាញឹកញាប់ ហើយពលរដ្ឋអាចមើលថាតើសេវាប្រសើរឡើងក្រោយជួសជុលឬទេ។'),
    source: bi('Telecom regulator complaint contacts', 'ទំនាក់ទំនងសម្រាប់បណ្តឹងរបស់និយ័តករទូរគមនាគមន៍កម្ពុជា'),
    url: 'https://www.trc.gov.kh/en/contactusform/',
  },
];
