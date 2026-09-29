import type { CrewConcept, SkillPathway } from "@/types/engagement";

export const pathways: SkillPathway[] = [
  {
    id: "media", icon: "video", minutes: 20,
    title: { en: "Digital Media & Content", km: "មេឌៀឌីជីថល និងការបង្កើតមាតិកា" },
    promise: { en: "Tell a useful story with the phone you have.", km: "ប្រាប់រឿងមានប្រយោជន៍ដោយប្រើទូរស័ព្ទដែលអ្នកមាន។" },
    steps: [
      { id: "media-plan", title: { en: "Plan a 30-second story", km: "រៀបគម្រោងរឿង ៣០ វិនាទី" }, detail: { en: "Pick one school or community idea and write three key points.", km: "ជ្រើសគំនិតមួយអំពីសាលា ឬសហគមន៍ ហើយសរសេរចំណុចសំខាន់បី។" } },
      { id: "media-capture", title: { en: "Capture three clear shots", km: "ថតរូបភាពច្បាស់បីប្លង់" }, detail: { en: "Use steady framing and ask permission before filming people.", km: "រក្សាកាមេរ៉ាឱ្យនឹង និងសុំការអនុញ្ញាតមុនថតមនុស្ស។" } },
      { id: "media-caption", title: { en: "Add Khmer captions", km: "បន្ថែមចំណងជើងរងជាភាសាខ្មែរ" }, detail: { en: "Make the main message understandable without sound.", km: "ធ្វើឱ្យសារសំខាន់អាចយល់បានទោះគ្មានសំឡេង។" } },
    ],
  },
  {
    id: "web", icon: "code", minutes: 25,
    title: { en: "Web & App Basics", km: "មូលដ្ឋានគេហទំព័រ និងកម្មវិធី" },
    promise: { en: "Turn a simple idea into a page people can use.", km: "ប្រែក្លាយគំនិតសាមញ្ញទៅជាទំព័រដែលមនុស្សអាចប្រើបាន។" },
    steps: [
      { id: "web-sketch", title: { en: "Sketch one useful page", km: "គូរគ្រោងទំព័រមានប្រយោជន៍មួយ" }, detail: { en: "Choose a problem, a headline and one clear action.", km: "ជ្រើសបញ្ហា ចំណងជើង និងសកម្មភាពច្បាស់លាស់មួយ។" } },
      { id: "web-build", title: { en: "Build a heading and link", km: "បង្កើតចំណងជើង និងតំណភ្ជាប់" }, detail: { en: "Try basic HTML in a text editor or learning tool.", km: "សាកល្បង HTML មូលដ្ឋានក្នុងកម្មវិធីសរសេរអត្ថបទ ឬឧបករណ៍សិក្សា។" } },
      { id: "web-test", title: { en: "Test it on a phone", km: "សាកល្បងលើទូរស័ព្ទ" }, detail: { en: "Check that text, links and buttons are easy to use.", km: "ពិនិត្យថាអត្ថបទ តំណ និងប៊ូតុងងាយប្រើ។" } },
    ],
  },
  {
    id: "hardware", icon: "cpu", minutes: 20,
    title: { en: "Electronics & Safe Repair", km: "អេឡិចត្រូនិក និងការជួសជុលប្រកបដោយសុវត្ថិភាព" },
    promise: { en: "Understand small devices before trying to fix them.", km: "យល់ពីឧបករណ៍តូចៗ មុនពេលសាកជួសជុល។" },
    steps: [
      { id: "hardware-parts", title: { en: "Identify three parts", km: "ស្គាល់គ្រឿងបីប្រភេទ" }, detail: { en: "Find a battery, switch and LED in a low-voltage example.", km: "ស្វែងរកថ្ម កុងតាក់ និងអំពូល LED ក្នុងឧទាហរណ៍តង់ស្យុងទាប។" } },
      { id: "hardware-circuit", title: { en: "Draw a simple circuit", km: "គូរសៀគ្វីសាមញ្ញ" }, detail: { en: "Trace how energy would move from battery to light.", km: "តាមដានថាមពលពីថ្មទៅអំពូល។" } },
      { id: "hardware-safety", title: { en: "Make a safety checklist", km: "ធ្វើបញ្ជីពិនិត្យសុវត្ថិភាព" }, detail: { en: "Keep to battery-powered practice; leave mains repair to trained adults.", km: "អនុវត្តតែលើឧបករណ៍ប្រើថ្ម។ ទុកការជួសជុលអគ្គិសនីបណ្ដាញឱ្យអ្នកជំនាញ។" } },
    ], relatedAppId: "school-connect-cambodia",
  },
  {
    id: "business", icon: "briefcase", minutes: 20,
    title: { en: "Business & Language Skills", km: "ជំនាញអាជីវកម្ម និងភាសា" },
    promise: { en: "Make a plan, explain it clearly and learn from feedback.", km: "រៀបផែនការ ពន្យល់ឱ្យច្បាស់ ហើយរៀនពីមតិយោបល់។" },
    steps: [
      { id: "business-cost", title: { en: "List costs and a fair price", km: "រាយថ្លៃដើម និងតម្លៃសមរម្យ" }, detail: { en: "Use a small service idea and include materials and time.", km: "ប្រើគំនិតសេវាកម្មតូចមួយ ហើយគិតសម្ភារៈ និងពេលវេលា។" } },
      { id: "business-pitch", title: { en: "Practice a short English pitch", km: "ហាត់និយាយណែនាំជាអង់គ្លេសខ្លីៗ" }, detail: { en: "Say what you offer, who it helps and why it matters.", km: "ប្រាប់ថាអ្នកផ្ដល់អ្វី ជួយអ្នកណា និងហេតុអ្វីវាសំខាន់។" } },
      { id: "business-feedback", title: { en: "Ask for one useful suggestion", km: "សុំមតិយោបល់មានប្រយោជន៍មួយ" }, detail: { en: "Try your idea with a trusted peer or teacher.", km: "សាកគំនិតជាមួយមិត្តភក្តិ ឬគ្រូដែលអ្នកទុកចិត្ត។" } },
    ], relatedAppId: "finlitkh",
  },
];

export const crewConcepts: CrewConcept[] = [
  { id: "kampong-chhnang-tech", provinceId: "kampong-chhnang", interest: "web", title: { en: "Kampong Chhnang Tech Crew", km: "ក្រុមបច្ចេកវិទ្យាកំពង់ឆ្នាំង" }, province: { en: "Kampong Chhnang", km: "កំពង់ឆ្នាំង" }, project: { en: "Prototype a school resource page.", km: "សាកបង្កើតទំព័រធនធានសម្រាប់សាលា។" } },
  { id: "phnom-penh-creators", provinceId: "phnom-penh", interest: "media", title: { en: "Phnom Penh Digital Creators", km: "អ្នកបង្កើតមាតិកាឌីជីថលភ្នំពេញ" }, province: { en: "Phnom Penh", km: "ភ្នំពេញ" }, project: { en: "Make bilingual videos about local opportunities.", km: "បង្កើតវីដេអូពីរភាសាអំពីឱកាសក្នុងសហគមន៍។" } },
  { id: "siem-reap-makers", provinceId: "siem-reap", interest: "hardware", title: { en: "Siem Reap Makers", km: "ក្រុមអ្នកបង្កើតសៀមរាប" }, province: { en: "Siem Reap", km: "សៀមរាប" }, project: { en: "Sketch safe, battery-powered classroom gadgets.", km: "គូរគម្រោងឧបករណ៍ថ្នាក់រៀនដែលប្រើថ្ម និងមានសុវត្ថិភាព។" } },
  { id: "battambang-enterprise", provinceId: "battambang", interest: "business", title: { en: "Battambang Enterprise Circle", km: "ក្រុមគំនិតអាជីវកម្មបាត់ដំបង" }, province: { en: "Battambang", km: "បាត់ដំបង" }, project: { en: "Pitch a practical community service idea.", km: "បង្ហាញគំនិតសេវាកម្មមានប្រយោជន៍សម្រាប់សហគមន៍។" } },
];
