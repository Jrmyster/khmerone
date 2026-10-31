import type { LocalizedText } from '@/types/app';
import { bi } from './types';

export type LearningResource = {
  title: LocalizedText;
  detail: LocalizedText;
  label: LocalizedText;
  url: string;
};

export const peopleResources: Partial<Record<number, LearningResource[]>> = {
  1: [
    {
      title: bi('Grade 7 science: explain a diagram', 'វិទ្យាសាស្ត្រ ថ្នាក់ទី៧៖ ពន្យល់រូបគំនូស'),
      detail: bi('Choose a diagram from the grade 7 science textbook. Cover its labels and have pairs identify three parts. Ask each learner to explain the function of one part in Khmer. Add an English term from the STEM dictionary.', 'ជ្រើសរើសរូបគំនូសមួយពីសៀវភៅវិទ្យាសាស្ត្រថ្នាក់ទី៧។ បិទបាំងស្លាកឈ្មោះ ហើយឱ្យសិស្សធ្វើការជាគូដើម្បីប្រាប់ឈ្មោះផ្នែកបី។ ឱ្យសិស្សម្នាក់ៗពន្យល់មុខងារនៃផ្នែកមួយជាភាសាខ្មែរ រួចបន្ថែមពាក្យអង់គ្លេសពីវចនានុក្រមស្ទែម។'),
      label: bi('Open the Sala Digital grade 7 textbook', 'បើកសៀវភៅថ្នាក់ទី៧ នៅសាលាឌីជីថល'), url: 'https://sala.moeys.gov.kh/kh/library/00000646',
    },
    {
      title: bi('Grade 6 Khmer: support an answer with evidence', 'ភាសាខ្មែរ ថ្នាក់ទី៦៖ រកភស្តុតាងសម្រាប់ចម្លើយ'),
      detail: bi('Choose a short reading from the grade 6 Khmer book. Partners suggest a title and underline the sentence that supports it. Share the page number, your own questions and a model answer with another teacher through School Connect Exchange.', 'ជ្រើសរើសអត្ថបទខ្លីមួយពីសៀវភៅភាសាខ្មែរថ្នាក់ទី៦។ ឱ្យសិស្សធ្វើការជាគូ ស្នើចំណងជើង និងគូសបន្ទាត់ក្រោមប្រយោគដែលគាំទ្រជម្រើសរបស់ពួកគេ។ ចែករំលែកលេខទំព័រ សំណួរដែលអ្នកតែង និងចម្លើយគំរូជាមួយគ្រូម្នាក់ទៀតតាមកម្មវិធីផ្លាស់ប្តូរធនធានរវាងសាលា។'),
      label: bi('Open grade 6 Khmer on Sala Digital', 'បើកសៀវភៅភាសាខ្មែរថ្នាក់ទី៦ នៅសាលាឌីជីថល'), url: 'https://sala.moeys.gov.kh/kh/library/00007880',
    },
  ],
  2: [
    {
      title: bi('Listen in Khmer: what is diabetes?', 'ស្តាប់ជាភាសាខ្មែរ៖ តើជំងឺទឹកនោមផ្អែមជាអ្វី?'),
      detail: bi('Harborview Medical Center created this patient lesson in 2020. Choose the Cambodian narration on EthnoMed. The publisher credits the hospital as author and does not name an individual clinical reviewer for the recording.', 'មជ្ឈមណ្ឌលវេជ្ជសាស្ត្រ Harborview បានរៀបចំមេរៀននេះសម្រាប់អ្នកជំងឺក្នុងឆ្នាំ២០២០។ ជ្រើសរើសសំឡេងភាសាខ្មែរនៅលើ EthnoMed។ អ្នកបោះពុម្ពផ្សាយដាក់ឈ្មោះមន្ទីរពេទ្យជាអ្នកនិពន្ធ ហើយមិនបញ្ជាក់ឈ្មោះអ្នកជំនាញដែលពិនិត្យសំឡេងនេះទេ។'),
      label: bi('Open the Harborview audio lesson', 'បើកមេរៀនសំឡេងរបស់ Harborview'), url: 'https://ethnomed.org/resource/what-is-diabetes/',
    },
    {
      title: bi('Listen in Khmer: the hepatitis B story', 'ស្តាប់ជាភាសាខ្មែរ៖ ស្វែងយល់ពីជំងឺរលាកថ្លើមប្រភេទបេ'),
      detail: bi('St Vincent’s Hospital Melbourne developed this talking book with its primary health network. In the hepatitis B resources, choose the Khmer talking book and press Read Aloud. The hospital identifies the development team, without listing a separate clinical review date for the Khmer audio.', 'មន្ទីរពេទ្យ St Vincent’s នៅទីក្រុងមែលប៊ន និងបណ្តាញសុខភាពបឋមរបស់ខ្លួនបានបង្កើតសៀវភៅមានសំឡេងនេះ។ ក្នុងផ្នែកជំងឺរលាកថ្លើមប្រភេទបេ ជ្រើសសៀវភៅសំឡេងភាសាខ្មែរ រួចចុច Read Aloud។ មន្ទីរពេទ្យបញ្ជាក់ក្រុមដែលបានរៀបចំ ប៉ុន្តែមិនបញ្ជាក់កាលបរិច្ឆេទពិនិត្យផ្នែកវេជ្ជសាស្ត្រដាច់ដោយឡែកសម្រាប់សំឡេងខ្មែរទេ។'),
      label: bi('Choose the Khmer talking book', 'ជ្រើសសៀវភៅមានសំឡេងភាសាខ្មែរ'), url: 'https://www.svhm.org.au/health-professionals/specialist-clinics/g/gastroenterology/resources',
    },
    {
      title: bi('Phnom Penh: National Maternal and Child Health Center', 'ភ្នំពេញ៖ មជ្ឈមណ្ឌលជាតិគាំពារមាតា និងទារក'),
      detail: bi('For general enquiries the centre lists 023 724 257 and 023 725 973. Ask which service to visit and whether you need an appointment before travelling to Street 47 in Srah Chak.', 'សម្រាប់ព័ត៌មានទូទៅ មជ្ឈមណ្ឌលផ្តល់លេខ ០២៣ ៧២៤ ២៥៧ និង ០២៣ ៧២៥ ៩៧៣។ សួរថាត្រូវទៅផ្នែកណា និងត្រូវណាត់ជួបឬទេ មុនធ្វើដំណើរទៅផ្លូវលេខ៤៧ ក្នុងសង្កាត់ស្រះចក។'),
      label: bi('Check the centre’s current contacts', 'មើលទំនាក់ទំនងបច្ចុប្បន្នរបស់មជ្ឈមណ្ឌល'), url: 'https://nmchc.gov.kh/en/contact-us/',
    },
    {
      title: bi('Siem Reap: Angkor Hospital for Children', 'សៀមរាប៖ មន្ទីរពេទ្យកុមារអង្គរ'),
      detail: bi('The hospital’s patient information page lists 063 963 409. Ask about the child’s appointment, outpatient hours or the documents to bring before arranging transport.', 'ទំព័រព័ត៌មានសម្រាប់អ្នកជំងឺរបស់មន្ទីរពេទ្យផ្តល់លេខ ០៦៣ ៩៦៣ ៤០៩។ សួរអំពីការណាត់ជួបសម្រាប់កុមារ ម៉ោងពិនិត្យជំងឺក្រៅ ឬឯកសារដែលត្រូវយកទៅ មុនរៀបចំការធ្វើដំណើរ។'),
      label: bi('Check patient information', 'មើលព័ត៌មានសម្រាប់អ្នកជំងឺ'), url: 'https://angkorhospital.org/what-we-do/patient-information/',
    },
  ],
  4: [
    {
      title: bi('Find a business mentor', 'ស្វែងរកអ្នកណែនាំអាជីវកម្ម'),
      detail: bi('SHE Investments describes mentoring and coaching in its membership programme. Ask about fees, language and the next intake. Bring one decision to discuss, such as how to set a price that covers material and transport costs.', 'កម្មវិធីសមាជិករបស់ SHE Investments មានការណែនាំ និងការបង្វឹកអាជីវកម្ម។ សួរអំពីតម្លៃ ភាសា និងពេលទទួលសមាជិកថ្មី។ ត្រៀមប្រធានបទមួយទៅពិភាក្សា ដូចជារបៀបកំណត់តម្លៃលក់ឱ្យគ្រប់ថ្លៃវត្ថុធាតុដើម និងដឹកជញ្ជូន។'),
      label: bi('Read about SHE membership and mentoring', 'ស្វែងយល់ពីសមាជិកភាព និងការណែនាំរបស់ SHE'), url: 'https://sheinvestments.com/membership/',
    },
  ],
  5: [
    {
      title: bi('Project coordination and software development', 'សម្របសម្រួលគម្រោង និងអភិវឌ្ឍកម្មវិធី'),
      detail: bi('The Digital Economy and Business Committee listed both roles with a 6 November 2026 deadline. Source checked 31 October 2026. Confirm the current openings and apply through the committee’s careers page.', 'គណៈកម្មាធិការសេដ្ឋកិច្ច និងធុរកិច្ចឌីជីថលបានបង្ហាញមុខតំណែងទាំងពីរ ដោយកំណត់ថ្ងៃផុតកំណត់ត្រឹមថ្ងៃទី៦ ខែវិច្ឆិកា ឆ្នាំ២០២៦។ បានពិនិត្យប្រភពថ្ងៃទី៣១ ខែតុលា ឆ្នាំ២០២៦។ ពិនិត្យមុខតំណែងដែលកំពុងជ្រើសរើស និងដាក់ពាក្យតាមទំព័រការងាររបស់គណៈកម្មាធិការ។'),
      label: bi('Check the committee’s vacancies', 'ពិនិត្យតំណែងការងាររបស់គណៈកម្មាធិការ'), url: 'https://digitaleconomy.gov.kh/en/careers',
    },
    {
      title: bi('Building maintenance technician', 'អ្នកបច្ចេកទេសថែទាំអគារ'),
      detail: bi('Cambodia Airports published a junior technician role covering electrical systems, cooling and plumbing. The posted deadline was 15 November 2026. Source checked 31 October 2026. Confirm the deadline and requirements on the employer’s site.', 'ក្រុមហ៊ុន Cambodia Airports បានផ្សាយតំណែងអ្នកបច្ចេកទេសថែទាំប្រព័ន្ធអគ្គិសនី ម៉ាស៊ីនត្រជាក់ និងបណ្ដាញទឹក។ ថ្ងៃផុតកំណត់ដែលបានប្រកាសគឺថ្ងៃទី១៥ ខែវិច្ឆិកា ឆ្នាំ២០២៦។ បានពិនិត្យប្រភពថ្ងៃទី៣១ ខែតុលា ឆ្នាំ២០២៦។ សូមបញ្ជាក់ថ្ងៃផុតកំណត់ និងលក្ខខណ្ឌនៅលើគេហទំព័រនិយោជក។'),
      label: bi('Check airport job listings', 'ពិនិត្យតំណែងការងារនៅអាកាសយានដ្ឋាន'), url: 'https://corp.cambodia-airports.aero/en/jobs-offers/phnom-penh',
    },
    {
      title: bi('Ask about learning on the job', 'សាកសួរអំពីការរៀនជំនាញនៅកន្លែងធ្វើការ'),
      detail: bi('The Ministry of Tourism describes dual vocational training and apprenticeship development in hospitality. Ask a training institute whether it has a current placement, who supervises it, and the written hours and pay terms. The programme announcement is not a vacancy.', 'ក្រសួងទេសចរណ៍ពិពណ៌នាអំពីការបណ្តុះបណ្តាលវិជ្ជាជីវៈនៅសាលាផង និងនៅកន្លែងធ្វើការផង ព្រមទាំងការហាត់ការងារក្នុងវិស័យបដិសណ្ឋារកិច្ច។ សួរគ្រឹះស្ថានថាតើមានកន្លែងហាត់ការឥឡូវនេះឬទេ នរណាទទួលខុសត្រូវ និងម៉ោងនិងប្រាក់ឧបត្ថម្ភសរសេរក្នុងកិច្ចព្រមព្រៀងយ៉ាងដូចម្តេច។ សេចក្តីប្រកាសនេះមិនមែនជាដំណឹងជ្រើសរើសបុគ្គលិកទេ។'),
      label: bi('Read the ministry’s dual training programme description', 'មើលការពិពណ៌នាកម្មវិធីបណ្តុះបណ្តាលរបស់ក្រសួង'), url: 'https://www.ctprs.gov.kh/en/news/ministry-of-tourism-promotes-implementation-of-dual-vocational-education-and-training-dual-vet-program-in-cambodia',
    },
    {
      title: bi('Report a fraudulent online job offer', 'រាយការណ៍ការឆបោកតាមការផ្តល់ការងារអនឡាញ'),
      detail: bi('Confirm the employer using contact details from a source other than the advertisement. If someone uses a job advertisement to defraud you online, keep the message, account name and payment reference privately for the National Police reporting form.', 'ផ្ទៀងផ្ទាត់និយោជកតាមទំនាក់ទំនងដែលរកបានពីប្រភពផ្សេងក្រៅពីដំណឹងជ្រើសរើសបុគ្គលិក។ បើមានអ្នកប្រើការផ្សាយជ្រើសរើសបុគ្គលិកដើម្បីឆបោកអ្នកតាមអនឡាញ សូមរក្សាសារ ឈ្មោះគណនី និងលេខយោងទូទាត់ជាឯកជន សម្រាប់បំពេញពាក្យបណ្តឹងរបស់នគរបាលជាតិ។'),
      label: bi('National Police online scam reporting', 'ដាក់ពាក្យបណ្តឹងអំពើឆបោកអនឡាញទៅនគរបាលជាតិ'), url: 'https://hotline.police.gov.kh/',
    },
  ],
  6: [
    {
      title: bi('Dance: Royal Ballet of Cambodia', 'របាំ៖ របាំព្រះរាជទ្រព្យ'),
      detail: bi('Look at the movements, costume and accompanying music in UNESCO’s record. Describe one gesture in your own words, then ask a teacher of dance what that gesture conveys.', 'មើលចលនា សម្លៀកបំពាក់ និងតន្ត្រីអមក្នុងឯកសាររបស់យូណេស្កូ។ ពិពណ៌នាក្បាច់មួយដោយពាក្យរបស់អ្នក រួចសួរគ្រូរបាំអំពីអត្ថន័យនៃក្បាច់នោះ។'),
      label: bi('View the UNESCO ballet record', 'មើលឯកសាររបាំរបស់យូណេស្កូ'), url: 'https://ich.unesco.org/en/RL/royal-ballet-of-cambodia-00060',
    },
    {
      title: bi('Music and stories: Chapei Dang Veng', 'តន្ត្រី និងរឿងរ៉ាវ៖ ចាប៉ីដងវែង'),
      detail: bi('Listen for the relationship between the performer’s voice and the lute. Write one question about how performers choose a story for their audience.', 'ស្តាប់ទំនាក់ទំនងរវាងសំឡេងអ្នកច្រៀង និងសំឡេងចាប៉ី។ សរសេរសំណួរមួយអំពីរបៀបដែលអ្នកសម្តែងជ្រើសរើសរឿងឱ្យសមនឹងអ្នកស្តាប់។'),
      label: bi('Explore the UNESCO chapei record', 'មើលឯកសារចាប៉ីរបស់យូណេស្កូ'), url: 'https://ich.unesco.org/en/RL/chapei-dang-veng-01165',
    },
    {
      title: bi('Community theatre: Lkhon Khol Wat Svay Andet', 'ល្ខោនសហគមន៍៖ ល្ខោនខោលវត្តស្វាយអណ្ដែត'),
      detail: bi('Explore how one community around Wat Svay Andet stages masked theatre. Note the roles of performers, narrators and musicians. Ask a local practitioner how performances in your area differ.', 'ស្វែងយល់ពីរបៀបដែលសហគមន៍ជុំវិញវត្តស្វាយអណ្ដែតសម្តែងល្ខោនពាក់របាំងមុខ។ កត់តួនាទីរបស់អ្នកសម្តែង អ្នកពោល និងអ្នកភ្លេង។ សួរអ្នកសិល្បៈក្នុងតំបន់ថាការសម្តែងនៅតំបន់អ្នកខុសគ្នាត្រង់ណា។'),
      label: bi('View the Wat Svay Andet record', 'មើលឯកសារអំពីល្ខោនខោលវត្តស្វាយអណ្ដែត'), url: 'https://ich.unesco.org/en/USL/lkhon-khol-wat-svay-andet-01374',
    },
    {
      title: bi('Craft: weaving a krama', 'សិប្បកម្ម៖ ការត្បាញក្រមា'),
      detail: bi('Use the original documentation to see how a krama is made and used. Sketch your own pattern and credit the source of your inspiration. Ask permission before sharing a weaver’s photograph or design.', 'ប្រើឯកសារដើមដើម្បីស្វែងយល់ពីរបៀបផលិត និងប្រើក្រមា។ គូរលំនាំផ្ទាល់ខ្លួន និងបញ្ជាក់ប្រភពគំនិត។ សុំការអនុញ្ញាតមុនចែករំលែករូបថត ឬលំនាំរបស់អ្នកតម្បាញ។'),
      label: bi('View the UNESCO krama film', 'មើលវីដេអូអំពីក្រមារបស់យូណេស្កូ'), url: 'https://ich.unesco.org/en/video/72423',
    },
  ],
  7: [
    {
      title: bi('Practise listening across beliefs', 'ហាត់ស្តាប់គ្នារវាងអ្នកមានជំនឿផ្សេងៗ'),
      detail: bi('Invite pairs to name a community need they both care about, such as helping an older neighbour read a phone message. Each person restates the other’s idea before suggesting a shared activity. Participation and speaking about beliefs are voluntary.', 'សូមឱ្យអ្នកចូលរួមធ្វើការជាគូ ហើយលើកឡើងពីតម្រូវការសហគមន៍ដែលអ្នកទាំងពីរយកចិត្តទុកដាក់ ដូចជាជួយមនុស្សចាស់អានសារទូរសព្ទ។ ម្នាក់ៗរៀបរាប់គំនិតរបស់ដៃគូឡើងវិញ មុនស្នើសកម្មភាពរួម។ ការចូលរួម និងការនិយាយអំពីជំនឿជាជម្រើសរបស់ម្នាក់ៗ។'),
      label: bi('Read about Cambodia’s Interfaith Action for Community', 'ស្វែងយល់អំពីក្រុមសកម្មភាពអន្តរសាសនាសម្រាប់សហគមន៍នៅកម្ពុជា'), url: 'https://admin.uri.org/who-we-are/cooperation-circle/interfaith-action-community',
    },
  ],
};
