interface EngineeringCopy {
  home: string; name: string; kicker: string; title: string; intro: string;
  language: string; logic: string; programming: string; objectives: string;
  logicIntro: string; bits: string; chooseGate: string; input: string; output: string;
  on: string; off: string; toggle: string; table: string; current: string; rule: string;
  application: string; predict: string; reset: string; bridge: string; bridgeBody: string;
  programIntro: string; purpose: string; anatomy: string; tryIt: string; challenge: string;
  copy: string; copied: string; copyFallback: string; preview: string; previewHint: string;
  heading: string; color: string; gold: string; cyan: string; count: string; countAction: string;
  pythonOutput: string; reveal: string; pythonNotice: string; source: string; next: string;
  footer: string; back: string;
}
export const engineeringCopy: Record<"en" | "km", EngineeringCopy> = {
  en: {
    home: "Back to Khmer One", name: "Computer Engineering & Code", kicker: "KHMER ONE / LEARNING LAB 01",
    title: "Small signals. Big ideas.", intro: "Discover how a computer makes decisions, then create your first web page. No installation, account, or previous coding experience needed.",
    language: "Language", logic: "Logic gates", programming: "Programming basics", objectives: "Toggle · Predict · Build",
    logicIntro: "Logic gates turn binary inputs into a binary output. Explore all five gates; the highlighted truth-table row follows your switches.",
    bits: "A bit is either 0 or 1. Here, 0 means OFF and 1 means ON. Real circuits represent bits using ranges of electrical voltage, not a single universal voltage.",
    chooseGate: "Choose a gate", input: "Input", output: "Output", on: "ON", off: "OFF", toggle: "Toggle input",
    table: "Truth table", current: "Current inputs", rule: "The rule", application: "Where it is useful",
    predict: "Before toggling a switch, predict whether the output will change. Then check the table.", reset: "Reset inputs",
    bridge: "From gates to a processor", bridgeBody: "Transistors act as tiny switches. Connected gates form circuits that add numbers, compare values, and control data. Registers store bits, and a CPU follows instructions. A gate is one building block, not an entire computer.",
    programIntro: "HTML supplies structure, CSS supplies presentation, and JavaScript supplies behavior. Python is a separate programming language for many kinds of software, including automation and server-side applications.",
    purpose: "What it does", anatomy: "Read the code", tryIt: "Try the example", challenge: "Your next challenge",
    copy: "Copy code", copied: "Copied", copyFallback: "Clipboard unavailable. Select the code below and copy it manually.",
    preview: "Live example", previewHint: "These controls demonstrate the supplied examples. They are not a general-purpose code editor.",
    heading: "Heading text", color: "Heading color", gold: "Gold", cyan: "Cyan", count: "Button clicks", countAction: "Click me",
    pythonOutput: "Example output", reveal: "Show the next loop step", pythonNotice: "This is a walkthrough of the fixed example, not a Python interpreter. Run copied code in a Python 3 environment. range(1, 4) includes 1, 2, and 3; it stops before 4.",
    source: "Read the official guide", next: "Keep experimenting in Khmer Lab Tech", footer: "Learn one idea, test it, and explain it to a friend.", back: "Back to lessons",
  },
  km: {
    home: "ត្រឡប់ទៅខ្មែរវ័ន", name: "វិស្វកម្មកុំព្យូទ័រ និងកូដ", kicker: "ខ្មែរវ័ន / បន្ទប់សិក្សា ០១",
    title: "សញ្ញាតូចៗ បង្កើតគំនិតធំៗ។", intro: "ស្វែងយល់ពីរបៀបដែលកុំព្យូទ័រសម្រេចចិត្ត រួចបង្កើតគេហទំព័រដំបូងរបស់អ្នក។ មិនចាំបាច់ដំឡើងកម្មវិធី បង្កើតគណនី ឬចេះសរសេរកូដពីមុនទេ។",
    language: "ភាសា", logic: "ទ្វារឡូជីខល", programming: "មូលដ្ឋានសរសេរកម្មវិធី", objectives: "ប្ដូរ · ទាយ · បង្កើត",
    logicIntro: "ទ្វារឡូជីខលបម្លែងសញ្ញាបញ្ចូលជាប៊ីត ទៅជាសញ្ញាចេញជាប៊ីត។ សាកល្បងទ្វារទាំងប្រាំ។ ជួរដែលបន្លិចក្នុងតារាងត្រូវនឹងកុងតាក់របស់អ្នក។",
    bits: "ប៊ីតមានតម្លៃ 0 ឬ 1។ នៅទីនេះ 0 មានន័យថាបិទ ហើយ 1 មានន័យថាបើក។ សៀគ្វីពិតប្រើចន្លោះតង់ស្យុងអគ្គិសនីដើម្បីតំណាងប៊ីត មិនមែនតង់ស្យុងតែមួយសម្រាប់គ្រប់សៀគ្វីទេ។",
    chooseGate: "ជ្រើសរើសទ្វារ", input: "សញ្ញាបញ្ចូល", output: "សញ្ញាចេញ", on: "បើក", off: "បិទ", toggle: "ប្ដូរសញ្ញាបញ្ចូល",
    table: "តារាងតម្លៃពិត", current: "សញ្ញាបញ្ចូលបច្ចុប្បន្ន", rule: "ក្បួន", application: "ការប្រើប្រាស់ជាក់ស្ដែង",
    predict: "មុនប្ដូរកុងតាក់ សាកទាយថាសញ្ញាចេញនឹងប្រែប្រួលឬអត់។ រួចពិនិត្យតារាង។", reset: "កំណត់សញ្ញាបញ្ចូលឡើងវិញ",
    bridge: "ពីទ្វារឡូជីខលទៅអង្គដំណើរការ", bridgeBody: "ត្រង់ស៊ីស្ទ័រដើរតួជាកុងតាក់តូចៗ។ ទ្វារដែលភ្ជាប់គ្នាបង្កើតសៀគ្វីសម្រាប់បូកលេខ ប្រៀបធៀបតម្លៃ និងគ្រប់គ្រងទិន្នន័យ។ រេជីស្ទ័ររក្សាទុកប៊ីត ហើយ CPU អនុវត្តសេចក្ដីបញ្ជា។ ទ្វារមួយគឺជាផ្នែកមួយ មិនមែនជាកុំព្យូទ័រទាំងមូលទេ។",
    programIntro: "HTML បង្កើតរចនាសម្ព័ន្ធ CSS រៀបចំរូបរាង ហើយ JavaScript បន្ថែមសកម្មភាព។ Python ជាភាសាសរសេរកម្មវិធីដាច់ដោយឡែក សម្រាប់ការងារជាច្រើន រួមទាំងស្វ័យប្រវត្តិកម្ម និងកម្មវិធីនៅម៉ាស៊ីនមេ។",
    purpose: "តួនាទី", anatomy: "អានកូដ", tryIt: "សាកល្បងឧទាហរណ៍", challenge: "លំហាត់បន្ទាប់របស់អ្នក",
    copy: "ចម្លងកូដ", copied: "បានចម្លង", copyFallback: "មិនអាចចម្លងដោយស្វ័យប្រវត្តិបានទេ។ សូមជ្រើសកូដខាងក្រោម ហើយចម្លងដោយខ្លួនឯង។",
    preview: "ឧទាហរណ៍អន្តរកម្ម", previewHint: "ឧបករណ៍ទាំងនេះបង្ហាញឧទាហរណ៍ដែលបានផ្ដល់។ វាមិនមែនជាកម្មវិធីកែសម្រួលកូដទូទៅទេ។",
    heading: "អត្ថបទចំណងជើង", color: "ពណ៌ចំណងជើង", gold: "មាស", cyan: "ខៀវ", count: "ចំនួនចុចប៊ូតុង", countAction: "ចុចខ្ញុំ",
    pythonOutput: "លទ្ធផលឧទាហរណ៍", reveal: "បង្ហាញជំហានបន្ទាប់នៃរង្វិលជុំ", pythonNotice: "នេះជាការពន្យល់ឧទាហរណ៍ដែលបានកំណត់ មិនមែនជាកម្មវិធីដំណើរការ Python ទេ។ ដំណើរការកូដដែលបានចម្លងក្នុងបរិស្ថាន Python 3។ range(1, 4) រួមមាន 1, 2 និង 3 ហើយឈប់មុន 4។",
    source: "អានមគ្គុទ្ទេសក៍ផ្លូវការ", next: "បន្តសាកល្បងក្នុង Khmer Lab Tech", footer: "រៀនគំនិតមួយ សាកល្បងវា ហើយពន្យល់ទៅមិត្តរបស់អ្នក។", back: "ត្រឡប់ទៅមេរៀន",
  },
};
