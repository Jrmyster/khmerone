import { bi, type MinistryGuide } from './types';

export const economy: MinistryGuide[] = [
  {
    n: 13, slug: 'maker-and-small-industry',
    ministry: bi('Industry, Science, Technology and Innovation', 'ឧស្សាហកម្ម វិទ្យាសាស្ត្រ បច្ចេកវិទ្យា និងនវានុវត្តន៍'),
    title: bi('Maker and Small-Industry Hub', 'មជ្ឈមណ្ឌលអ្នកច្នៃប្រឌិត និងឧស្សាហកម្មខ្នាតតូច'),
    benefit: bi('A workshop can test a design on two samples before committing a whole batch of materials. Students can repeat the same test and compare their results with a local maker.', 'សិប្បកម្មអាចសាកល្បងគំរូពីរមុននឹងប្រើវត្ថុធាតុដើមសម្រាប់ផលិតមួយលើកធំ។ សិស្សអាចធ្វើតេស្តដូចគ្នា ហើយប្រៀបធៀបលទ្ធផលជាមួយអ្នកច្នៃប្រឌិតក្នុងមូលដ្ឋាន។'),
    steps: [
      bi('Ask a local maker what breaks or gets wasted. Choose one measurable goal, such as keeping a small cardboard box from bending under a load.', 'សួរអ្នកផលិតក្នុងមូលដ្ឋានថា អ្វីខូចញឹកញាប់ ឬខ្ជះខ្ជាយច្រើន។ ជ្រើសរើសគោលដៅមួយដែលអាចវាស់បាន ដូចជាធ្វើប្រអប់ក្រដាសតូចមួយឱ្យទ្រទម្ងន់ដោយមិនកោង។'),
      bi('Engineering challenge. Span a gap between two books with a flat sheet of paper. Fold a second, identical sheet into accordion pleats and span the same gap. Add coins of the same size one at a time at the centre. Compare how many each bridge holds before it sags.', 'លំហាត់វិស្វកម្ម៖ ដាក់ក្រដាសរាបមួយសន្លឹកឆ្លងចន្លោះរវាងសៀវភៅពីរក្បាល។ បត់ក្រដាសមួយសន្លឹកទៀតដែលដូចគ្នាជាផ្នត់ឆ្លាស់ទៅមក រួចដាក់ឆ្លងចន្លោះដដែល។ ដាក់កាក់ដែលមានទំហំដូចគ្នាម្តងមួយៗនៅចំកណ្តាល។ ប្រៀបធៀបចំនួនកាក់ដែលស្ពាននីមួយៗអាចទ្របានមុនពេលយារ។'),
      bi('Repair challenge. Straighten a torn cardboard box corner, fold a scrap of cardboard around it and tape it in place. Compare it with an unpatched torn corner under the same small load. What else besides the patch might change your result?', 'លំហាត់ជួសជុល៖ តម្រង់ជ្រុងប្រអប់កាតុងដែលរហែក បត់បំណែកកាតុងមួយឱបជ្រុងនោះ ហើយបិទស្កុតឱ្យជាប់។ ដាក់ទម្ងន់តិចដូចគ្នា លើជ្រុងដែលបានជួសជុល និងជ្រុងរហែកដែលមិនបានជួសជុល រួចប្រៀបធៀប។ តើមានអ្វីផ្សេងទៀតដែលអាចប៉ះពាល់ដល់លទ្ធផល?'),
      bi('Estimate the material cost per usable item. If you plan to sell it, consult the KhmerSME guide about standards and licences for your product.', 'ប៉ាន់ស្មានថ្លៃវត្ថុធាតុដើមសម្រាប់ផលិតផលប្រើបានមួយឯកតា។ បើចង់លក់ សូមមើលមគ្គុទ្ទេសក៍ KhmerSME អំពីស្តង់ដារ និងអាជ្ញាបណ្ណសម្រាប់ផលិតផលនោះ។'),
    ],
    links: [
      { label: bi('Khmer One Computer Engineering Lab', 'មន្ទីរពិសោធន៍វិស្វកម្មកុំព្យូទ័ររបស់ខ្មែរ វ័ន'), url: '/computer-engineering' },
      { label: bi('CADT Makerspace, Phnom Penh', 'មជ្ឈមណ្ឌលច្នៃប្រឌិត CADT ភ្នំពេញ'), url: 'https://cadt.edu.kh/innovation/makerspace/' },
      { label: bi('Institute of Technology of Cambodia laboratory directory', 'បញ្ជីមន្ទីរពិសោធន៍របស់វិទ្យាស្ថានបច្ចេកវិទ្យាកម្ពុជា'), url: 'https://tic.itc.edu.kh/laboratories' },
      { label: bi('KhmerSME product innovation resources', 'ធនធាន KhmerSME ស្តីពីនវានុវត្តន៍ផលិតផល'), url: 'https://www.khmersme.gov.kh/en/innovation/innovation-in-products-services/' },
      { label: bi('KhmerSME business licences and standards', 'អាជ្ញាបណ្ណអាជីវកម្ម និងស្តង់ដារនៅ KhmerSME'), url: 'https://www.khmersme.gov.kh/en/laws-and-regulations/business-licenses/' },
    ],
    prompts: [
      bi('Problem and measurable goal', 'បញ្ហា និងគោលដៅដែលអាចវាស់បាន'),
      bi('One change between my two prototypes', 'ចំណុចខុសគ្នាមួយរវាងគំរូទាំងពីរ'),
      bi('Results, cost per usable item and next test', 'លទ្ធផល ថ្លៃដើមក្នុងមួយឯកតាដែលប្រើបាន និងតេស្តបន្ទាប់'),
    ],
  },
  {
    n: 14, slug: 'small-business',
    ministry: bi('Commerce', 'ពាណិជ្ជកម្ម'),
    title: bi('Small-Business Starter Kit', 'ឧបករណ៍សម្រាប់ចាប់ផ្តើមអាជីវកម្មខ្នាតតូច'),
    benefit: bi('A market seller who includes packaging, transport and unsold goods in a price estimate can see whether a sale actually covers costs before expanding the business.', 'អ្នកលក់នៅផ្សារដែលគិតទាំងថ្លៃវេចខ្ចប់ ដឹកជញ្ជូន និងទំនិញលក់មិនអស់ អាចដឹងថាចំណូលពីការលក់គ្រប់ចំណាយឬទេ មុននឹងពង្រីកអាជីវកម្ម។'),
    steps: [
      bi('Pick one product and describe who would buy it. Ask a potential customer about the size, quality and price they need.', 'ជ្រើសផលិតផលមួយ ហើយពិពណ៌នាថាអ្នកណាអាចទិញវា។ សួរអតិថិជនអំពីទំហំ គុណភាព និងតម្លៃដែលពួកគេត្រូវការ។'),
      bi('For a practice batch, add materials, packaging, transport and your time. Divide by the number you expect to sell. If a batch costs 40,000 riel and you sell eight items, each must bring in 5,000 riel to cover that batch.', 'សម្រាប់ការសាកល្បងមួយលើក សូមបូកថ្លៃវត្ថុធាតុដើម ការវេចខ្ចប់ ការដឹកជញ្ជូន និងពេលធ្វើការ។ ចែកនឹងចំនួនដែលរំពឹងថាលក់បាន។ បើចំណាយ ៤០ ០០០ រៀល ហើយលក់បាន ៨ ឯកតា នោះត្រូវបាន ៥ ០០០ រៀលក្នុងមួយឯកតា ដើម្បីទូទាត់ចំណាយលើកនេះ។'),
      bi('Take a clear daylight photo showing the actual item. Write an honest reply to a customer asking about size or a return. In a practice ledger, record stock received, units sold, cash received and stock left.', 'ថតរូបទំនិញពិតឱ្យច្បាស់ដោយប្រើពន្លឺថ្ងៃ។ សាកសរសេរចម្លើយស្មោះត្រង់ជូនអតិថិជនដែលសួរអំពីទំហំ ឬការប្រគល់ទំនិញត្រឡប់។ ក្នុងបញ្ជីគំរូ កត់ទំនិញចូល ចំនួនលក់បាន ប្រាក់ទទួល និងទំនិញនៅសល់។'),
      bi('Draft a receipt with the date, item, quantity and total. Use the government registration portal to check the steps for your type of business.', 'សាកសរសេរបង្កាន់ដៃដែលមានកាលបរិច្ឆេទ មុខទំនិញ ចំនួន និងតម្លៃសរុប។ មើលថ្នាលចុះបញ្ជីរបស់រដ្ឋ ដើម្បីផ្ទៀងផ្ទាត់ជំហានសម្រាប់ប្រភេទអាជីវកម្មរបស់អ្នក។'),
    ],
    links: [
      { label: bi('Official business registration portal', 'ថ្នាលចុះបញ្ជីអាជីវកម្មផ្លូវការ'), url: 'https://registrationservices.gov.kh/home-en/' },
      { label: bi('KhmerSME business preparation guide', 'មគ្គុទ្ទេសក៍ KhmerSME សម្រាប់ត្រៀមអាជីវកម្ម'), url: 'https://www.khmersme.gov.kh/en/starting-a-business/make-your-business-legal/' },
    ],
    prompts: [
      bi('Product, customer and what the customer said', 'ផលិតផល អតិថិជន និងយោបល់របស់អតិថិជន'),
      bi('Batch costs, units likely to sell and price per unit', 'ចំណាយក្នុងមួយលើក ចំនួនដែលអាចលក់បាន និងតម្លៃក្នុងមួយឯកតា'),
      bi('Stock received, units sold, cash received and stock left', 'ទំនិញចូល ចំនួនលក់បាន ប្រាក់ទទួល និងទំនិញនៅសល់'),
      bi('Example receipt or registration question', 'គំរូបង្កាន់ដៃ ឬសំណួរអំពីការចុះបញ្ជី'),
    ],
  },
  {
    n: 15, slug: 'money-and-public-budgets',
    ministry: bi('Economy and Finance', 'សេដ្ឋកិច្ច និងហិរញ្ញវត្ថុ'),
    title: bi('Money and Public Budget Learning', 'ការសិក្សាអំពីប្រាក់ និងថវិកាសាធារណៈ'),
    benefit: bi('Families can practise setting money aside for irregular expenses. In class, students can distinguish an approved budget from actual spending before asking how community services were funded.', 'គ្រួសារអាចហាត់ទុកប្រាក់សម្រាប់ចំណាយមិនទៀងទាត់។ ក្នុងថ្នាក់ សិស្សអាចបែងចែកថវិកាដែលបានអនុម័តពីចំណាយជាក់ស្តែង មុននឹងសួរថាសេវាសហគមន៍ទទួលថវិកាដោយរបៀបណា។'),
    steps: [
      bi('Try an example household budget of 100,000 riel. Reserve 60,000 for essentials and 20,000 for emergencies. Decide how to use the remaining 20,000.', 'សាករៀបចំថវិកាគ្រួសារគំរូចំនួន ១០០ ០០០ រៀល។ ទុក ៦០ ០០០ រៀលសម្រាប់តម្រូវការចាំបាច់ និង ២០ ០០០ រៀលសម្រាប់គ្រាអាសន្ន។ សម្រេចថាត្រូវប្រើប្រាក់នៅសល់ ២០ ០០០ រៀលយ៉ាងដូចម្តេច។'),
      bi('Try a loan example with no fees. A 100,000 riel loan at 10% simple annual interest for one year costs 10,000 riel in interest. Mark when income arrives and instalments fall due to spot a cash shortfall.', 'សាកគណនាកម្ចីគំរូដែលគ្មានថ្លៃសេវា។ ប្រាក់កម្ចី ១០០ ០០០ រៀល ដែលមានការប្រាក់សាមញ្ញ ១០% ក្នុងមួយឆ្នាំ នឹងមានការប្រាក់ ១០ ០០០ រៀលសម្រាប់រយៈពេលមួយឆ្នាំ។ កត់ថ្ងៃទទួលចំណូល និងថ្ងៃត្រូវបង់សង ដើម្បីរកពេលដែលអាចខ្វះសាច់ប្រាក់។'),
      bi('Read the ministry and programme table for FY2026. The education ministry’s programme 02 has an approved allocation of 116,712 million riel, or 116.712 billion riel. Use the unit in the column definition to check that conversion.', 'អានតារាងថវិកាតាមក្រសួង និងកម្មវិធីសម្រាប់ឆ្នាំ២០២៦។ កម្មវិធីទី២ របស់ក្រសួងអប់រំ យុវជន និងកីឡា មានថវិកាអនុម័តចំនួន ១១៦ ៧១២ លានរៀល ឬ ១១៦ ប៊ីលាន និង ៧១២ លានរៀល។ ប្រើឯកតាក្នុងសេចក្តីពន្យល់ជួរឈរ ដើម្បីផ្ទៀងផ្ទាត់ការបម្លែងនេះ។'),
      bi('Choose one public service. Write what the plan tells you about its funding and what record would help you check actual spending or results.', 'ជ្រើសសេវាសាធារណៈមួយ។ កត់ថាផែនការបង្ហាញអ្វីខ្លះអំពីថវិកាសេវានោះ និងឯកសារអ្វីអាចជួយផ្ទៀងផ្ទាត់ចំណាយ ឬលទ្ធផលជាក់ស្តែង។'),
    ],
    links: [
      { label: bi('FY2026 approved allocations by ministry and programme', 'ថវិកាអនុម័តតាមក្រសួង និងកម្មវិធី ឆ្នាំ២០២៦'), url: 'https://data.mef.gov.kh/datasets/pd_6880bfb23a4a460001a321ef' },
      { label: bi('Cambodia Budget in Brief FY2026', 'ថវិកាសង្ខេបកម្ពុជា ឆ្នាំ២០២៦'), url: 'https://data.mef.gov.kh/datasets/pd_699bfdf69eaed400071a6cbe' },
      { label: bi('Ministry of Economy and Finance annual budgets', 'ថវិកាប្រចាំឆ្នាំរបស់ក្រសួងសេដ្ឋកិច្ច និងហិរញ្ញវត្ថុ'), url: 'https://mef.gov.kh/documents-category/annual-budget/' },
    ],
    prompts: [
      bi('My example allocation and remaining balance', 'ការបែងចែកប្រាក់គំរូ និងប្រាក់នៅសល់'),
      bi('Example loan cost, repayment dates and cash available', 'ថ្លៃកម្ចីគំរូ ថ្ងៃត្រូវបង់សង និងសាច់ប្រាក់ដែលមាន'),
      bi('Public budget table, year, unit and figure', 'តារាងថវិកាសាធារណៈ ឆ្នាំ ឯកតា និងតួលេខ'),
      bi('A question about actual spending or results', 'សំណួរអំពីចំណាយ ឬលទ្ធផលជាក់ស្តែង'),
    ],
  },
  {
    n: 16, slug: 'community-tourism',
    ministry: bi('Tourism', 'ទេសចរណ៍'),
    title: bi('Community Tourism and Hospitality Hub', 'មជ្ឈមណ្ឌលទេសចរណ៍សហគមន៍ និងបដិសណ្ឋារកិច្ច'),
    benefit: bi('A village guide and a homestay host can agree in advance on visitor numbers, local payments and photography. Guests know what to expect and residents can decide how they participate.', 'មគ្គុទ្ទេសក៍ភូមិ និងម្ចាស់ផ្ទះស្នាក់អាចឯកភាពគ្នាជាមុនអំពីចំនួនភ្ញៀវ ការបង់ប្រាក់ឱ្យអ្នកផ្តល់សេវាមូលដ្ឋាន និងការថតរូប។ ភ្ញៀវដឹងថានឹងមានអ្វីខ្លះ ហើយពលរដ្ឋអាចសម្រេចថាចង់ចូលរួមយ៉ាងដូចម្តេច។'),
    steps: [
      bi('Choose one community activity from the tourism handbook. Check availability, local guide fees and what visitors should bring directly with the host.', 'ជ្រើសសកម្មភាពទេសចរណ៍សហគមន៍មួយពីសៀវភៅណែនាំ។ សួរម្ចាស់ផ្ទះដោយផ្ទាល់អំពីពេលអាចទទួលភ្ញៀវ ថ្លៃមគ្គុទ្ទេសក៍មូលដ្ឋាន និងអ្វីដែលភ្ញៀវគួរយកមក។'),
      bi('Practise welcoming a guest in two languages. Try “Welcome to our village” and “May I take a photo?” Wait for permission before photographing someone.', 'ហាត់ស្វាគមន៍ភ្ញៀវជាពីរភាសា។ សាកនិយាយថា «សូមស្វាគមន៍មកកាន់ភូមិយើង» និង «តើខ្ញុំអាចថតរូបបានទេ?»។ រង់ចាំការយល់ព្រមមុនថតរូបនរណាម្នាក់។'),
      bi('With the host’s permission, draft a visitor card for a homestay, craft workshop or community guide. Ask the host to check its wording and add a date for the next update.', 'ដោយមានការយល់ព្រមពីម្ចាស់ផ្ទះ សាករៀបចំបណ្ណព័ត៌មានភ្ញៀវសម្រាប់ផ្ទះស្នាក់ សិប្បកម្ម ឬមគ្គុទ្ទេសក៍សហគមន៍។ សុំឱ្យអ្នកទទួលភ្ញៀវផ្ទៀងផ្ទាត់អត្ថបទ ហើយកំណត់ថ្ងៃធ្វើបច្ចុប្បន្នភាពបន្ទាប់។'),
      bi('Build a half-day itinerary with travel time, water, a rest stop and the locally agreed price. Ask what would make the route accessible to the visitor.', 'រៀបចំកម្មវិធីកន្លះថ្ងៃ ដោយគិតពេលធ្វើដំណើរ ទឹកផឹក កន្លែងសម្រាក និងតម្លៃដែលសហគមន៍បានឯកភាព។ សួរថាតើត្រូវរៀបចំអ្វីខ្លះដើម្បីឱ្យភ្ញៀវអាចធ្វើដំណើរតាមផ្លូវនោះបាន។'),
    ],
    links: [
      { label: bi('Chi Phat community guides and homestays, Koh Kong', 'មគ្គុទ្ទេសក៍ និងផ្ទះស្នាក់សហគមន៍ជីផាត ខេត្តកោះកុង'), url: 'https://www.chi-phat.org/' },
      { label: bi('Contact the Banteay Chhmar community tourism team', 'ទាក់ទងក្រុមទេសចរណ៍សហគមន៍បន្ទាយឆ្មារ'), url: 'https://www.visitbanteaychhmar.org/contact-us/' },
      { label: bi('Rokhak basket weaving workshop, Siem Reap', 'សិប្បកម្មត្បាញកន្ត្រក Rokhak ខេត្តសៀមរាប'), url: 'https://rokhak.org/' },
      { label: bi('Official Cambodia tourism handbook', 'សៀវភៅណែនាំទេសចរណ៍ផ្លូវការរបស់កម្ពុជា'), url: 'https://data.mef.gov.kh/datasets/pd_6a55e140e5154a0007a32e65' },
      { label: bi('Ministry of Tourism hospitality training', 'ការបណ្តុះបណ្តាលបដិសណ្ឋារកិច្ចរបស់ក្រសួងទេសចរណ៍'), url: 'https://www.ctprs.gov.kh/en' },
    ],
    prompts: [
      bi('Activity, host and arrangements to confirm', 'សកម្មភាព អ្នកទទួលភ្ញៀវ និងចំណុចត្រូវបញ្ជាក់'),
      bi('Welcome and permission phrases in both languages', 'ឃ្លាស្វាគមន៍ និងសុំការអនុញ្ញាតជាពីរភាសា'),
      bi('Host-approved visitor card and next review date', 'បណ្ណព័ត៌មានដែលអ្នកទទួលភ្ញៀវបានយល់ព្រម និងកាលបរិច្ឆេទពិនិត្យឡើងវិញ'),
      bi('Route, costs, rest stops and access needs', 'ផ្លូវធ្វើដំណើរ ចំណាយ កន្លែងសម្រាក និងតម្រូវការសម្រាប់ការធ្វើដំណើរ'),
    ],
  },
  {
    n: 17, slug: 'safe-travel-and-transport',
    ministry: bi('Public Works and Transport', 'សាធារណការ និងដឹកជញ្ជូន'),
    title: bi('Safe Travel and Transport Guide', 'មគ្គុទ្ទេសក៍សុវត្ថិភាពក្នុងការធ្វើដំណើរ និងដឹកជញ្ជូន'),
    benefit: bi('Students can discuss a familiar route with an adult and identify a difficult crossing. A clear description of a damaged road or missing sign gives maintenance staff a better starting point for inspection.', 'សិស្សអាចពិភាក្សាជាមួយមនុស្សពេញវ័យអំពីផ្លូវដែលធ្វើដំណើរញឹកញាប់ និងសម្គាល់កន្លែងដែលពិបាកឆ្លង។ ការពិពណ៌នាច្បាស់អំពីផ្លូវខូច ឬស្លាកសញ្ញាដែលបាត់ ជួយមន្ត្រីថែទាំកំណត់កន្លែងត្រូវចុះពិនិត្យ។'),
    steps: [
      bi('Find the children-crossing sign in the ministry’s road-safety lesson. Sketch a school route with an adult and mark a crossing where parked vehicles or a bend could hide a pedestrian. Choose a crossing with a clear view in both directions.', 'រកស្លាកសញ្ញាកុមារឆ្លងកាត់ក្នុងមេរៀនសុវត្ថិភាពចរាចរណ៍របស់ក្រសួង។ គូរផ្លូវទៅសាលាជាមួយមនុស្សពេញវ័យ ហើយសម្គាល់កន្លែងឆ្លងដែលយានយន្តចត ឬផ្លូវកោងអាចបាំងអ្នកថ្មើរជើង។ ជ្រើសកន្លែងឆ្លងដែលអាចមើលឃើញច្បាស់ទាំងពីរទិស។'),
      bi('Before leaving, check that motorcycle riders and passengers have correctly fastened helmets, or that vehicle occupants have fastened their seat belts where fitted.', 'មុនចេញដំណើរ សូមពិនិត្យថាអ្នកបើកម៉ូតូ និងអ្នករួមដំណើរបានពាក់មួកសុវត្ថិភាព និងរឹតខ្សែត្រឹមត្រូវ ឬអ្នកជិះរថយន្តបានពាក់ខ្សែក្រវាត់សុវត្ថិភាពនៅកៅអីដែលមានខ្សែក្រវាត់។'),
      bi('For a trip in Phnom Penh, use the City Bus Authority route map to find the nearest stops at both ends. Check the route direction before boarding.', 'សម្រាប់ការធ្វើដំណើរនៅភ្នំពេញ ប្រើផែនទីខ្សែរត់របស់រដ្ឋាករស្វយ័តដឹកជញ្ជូនសាធារណៈរថយន្តក្រុង ដើម្បីរកចំណតក្បែរកន្លែងចេញដំណើរ និងកន្លែងត្រូវទៅដល់។ ពិនិត្យទិសដៅមុនឡើងរថយន្ត។'),
      bi('For a damaged road or sign, note the road name, a nearby landmark and the type of damage from a safe place. Use the ministry’s Road Care instructions for official reporting.', 'បើឃើញផ្លូវ ឬស្លាកសញ្ញាខូច សូមកត់ឈ្មោះផ្លូវ ទីតាំងងាយស្គាល់នៅក្បែរ និងប្រភេទការខូចខាតពីកន្លែងដែលមានសុវត្ថិភាព។ អនុវត្តតាមការណែនាំរបស់ក្រសួងអំពីកម្មវិធីថែទាំផ្លូវ ដើម្បីរាយការណ៍ជាផ្លូវការ។'),
    ],
    links: [
      { label: bi('MPWT road-safety lesson on the children-crossing sign', 'មេរៀនសុវត្ថិភាពចរាចរណ៍របស់ក្រសួងអំពីស្លាកសញ្ញាកុមារឆ្លងកាត់'), url: 'https://mpwt.gov.kh/en/press/49500' },
      { label: bi('Phnom Penh City Bus Authority daily route map', 'ផែនទីខ្សែរត់ប្រចាំថ្ងៃរបស់រថយន្តក្រុងភ្នំពេញ'), url: 'https://citybus.phnompenh.gov.kh/en/daily' },
      { label: bi('MPWT Road Care reporting instructions', 'ការណែនាំរបស់ក្រសួងអំពីការរាយការណ៍តាមកម្មវិធីថែទាំផ្លូវ'), url: 'https://mpwt.gov.kh/en/press/30015' },
      { label: bi('Official driving licence and test guidance', 'ព័ត៌មានផ្លូវការអំពីបណ្ណបើកបរ និងការប្រឡង'), url: 'https://mpwt.gov.kh/en/public-services/driver-s-license' },
    ],
    prompts: [
      bi('Route, difficult crossing and another option', 'ផ្លូវ កន្លែងពិបាកឆ្លង និងជម្រើសផ្សេង'),
      bi('Before-travel checks for the chosen vehicle', 'ចំណុចត្រូវពិនិត្យមុនធ្វើដំណើរតាមយានជំនិះដែលបានជ្រើស'),
      bi('Road landmark and maintenance issue to describe', 'ទីតាំងងាយស្គាល់ និងបញ្ហាផ្លូវដែលចង់រាយការណ៍'),
    ],
  },
  {
    n: 18, slug: 'housing-and-land',
    ministry: bi('Land Management, Urban Planning and Construction', 'រៀបចំដែនដី នគរូបនីយកម្ម និងសំណង់'),
    title: bi('Housing and Land Information Guide', 'មគ្គុទ្ទេសក៍ព័ត៌មានលំនៅឋាន និងដីធ្លី'),
    benefit: bi('A family preparing to repair a home can check the responsible office before paying for drawings. Asking about access, heat and flooding early gives residents and builders time to adapt the design before work starts.', 'គ្រួសារដែលត្រៀមជួសជុលផ្ទះអាចសួររកការិយាល័យទទួលបន្ទុកមុនចំណាយប្រាក់លើការគូរប្លង់។ ការសួរអំពីភាពងាយស្រួលចេញចូល កម្ដៅ និងទឹកជំនន់ជាមុន ផ្តល់ពេលឱ្យម្ចាស់ផ្ទះ និងអ្នកសាងសង់កែសម្រួលប្លង់មុនចាប់ផ្តើមការងារ។'),
    steps: [
      bi('Choose the request first. For a land record or boundary question, ask the cadastral office which service applies. For proposed building work, ask the responsible planning or construction office which plan and permission apply at that location.', 'កំណត់សំណើជាមុនសិន។ ចំពោះឯកសារដី ឬព្រំដី សូមសួរការិយាល័យសុរិយោដីថាត្រូវប្រើសេវាណា។ ចំពោះគម្រោងសាងសង់ សូមសួរការិយាល័យនគរូបនីយកម្ម ឬសំណង់ដែលទទួលបន្ទុកថា មានប្លង់ និងលិខិតអនុញ្ញាតអ្វីខ្លះដែលអនុវត្តចំពោះទីតាំងនោះ។'),
      bi('Before a visit, confirm the office, required originals or copies, official fees, receipts and how to follow up. Keep identity details and land document numbers off this worksheet. The competent authority must verify ownership and permits.', 'មុនទៅសូមបញ្ជាក់ការិយាល័យ ឯកសារដើម ឬច្បាប់ចម្លងដែលត្រូវយកទៅ ថ្លៃសេវាផ្លូវការ បង្កាន់ដៃ និងវិធីតាមដាន។ កុំកត់ព័ត៌មានអត្តសញ្ញាណ និងលេខបណ្ណដីក្នុងសន្លឹកនេះ។ ការផ្ទៀងផ្ទាត់កម្មសិទ្ធិ និងលិខិតអនុញ្ញាតជាសមត្ថកិច្ចរបស់អាជ្ញាធរ។'),
      bi('Walk through a sketch with the people who will use the building. Can someone with limited mobility reach the entrance, toilet and exit? Mark obstacles to discuss with the designer.', 'ពិនិត្យប្លង់ព្រាងជាមួយអ្នកដែលនឹងប្រើអគារ។ តើអ្នកដែលពិបាកក្នុងការធ្វើចលនាអាចទៅដល់ច្រកចូល បង្គន់ និងច្រកចេញបានទេ? សម្គាល់ឧបសគ្គដើម្បីពិភាក្សាជាមួយអ្នករចនាប្លង់។'),
      bi('Ask residents where floodwater collected before and which rooms get hottest. Ask a qualified designer about drainage, safe access during floods, shade and ventilation for this site.', 'សួរអ្នករស់នៅទីនោះថា ទឹកជំនន់ធ្លាប់ដក់នៅទីណា និងបន្ទប់ណាក្តៅបំផុត។ ពិគ្រោះជាមួយអ្នកជំនាញរៀបចំប្លង់អំពីការបង្ហូរទឹក ផ្លូវចេញចូលពេលទឹកជំនន់ ម្លប់ និងខ្យល់ចេញចូលដែលសមស្របនឹងទីតាំងនេះ។'),
    ],
    links: [
      { label: bi('Ministry cadastral services', 'សេវាសុរិយោដីរបស់ក្រសួង'), url: 'https://mlmupc.gov.kh/cadastral-services/' },
      { label: bi('Ministry public services and construction portal directory', 'បញ្ជីសេវាសាធារណៈ និងសេវាសំណង់របស់ក្រសួង'), url: 'https://mlmupc.gov.kh/' },
    ],
    prompts: [
      bi('Request, responsible office and next procedural step', 'សំណើ ការិយាល័យទទួលបន្ទុក និងជំហានបន្ទាប់'),
      bi('Documents to confirm, official fee and receipt questions', 'ឯកសារត្រូវផ្ទៀងផ្ទាត់ ថ្លៃសេវាផ្លូវការ និងសំណួរអំពីបង្កាន់ដៃ'),
      bi('Access barriers identified by future users', 'ឧបសគ្គចេញចូលដែលអ្នកប្រើប្រាស់បានសម្គាល់'),
      bi('Flood and heat observations to discuss with the designer', 'ការសង្កេតអំពីទឹកជំនន់ និងកម្ដៅដើម្បីពិភាក្សាជាមួយអ្នករចនាប្លង់'),
    ],
  },
];
