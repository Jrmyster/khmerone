import type { LocalizedText, Locale } from "@/types/app";

const text = (en: string, km: string): LocalizedText => ({ en, km });
export type ToolkitSubject = "english" | "mathematics" | "science";
export type ResourceKind = "lesson" | "worksheet" | "quiz" | "rubric" | "activity";
export interface ToolkitQuestion { prompt: LocalizedText; choices: LocalizedText[]; correct: number; explanation: LocalizedText }
export interface ToolkitUnit {
  id: string; subject: ToolkitSubject; title: LocalizedText; grades: string;
  objective: LocalizedText; explanation: LocalizedText; vocabulary: LocalizedText[];
  materials: LocalizedText; activity: LocalizedText; questions: ToolkitQuestion[];
}
const question = (prompt: LocalizedText, choices: LocalizedText[], correct: number, explanation: LocalizedText): ToolkitQuestion => ({ prompt, choices, correct, explanation });
export const toolkitUnits: ToolkitUnit[] = [
  {
    id: "school-vocabulary", subject: "english", title: text("School vocabulary", "វាក្យសព្ទអំពីសាលារៀន"), grades: "G1–6",
    objective: text("Name five classroom objects in English and use ‘This is a…’ in a complete sentence.", "ប្រាប់ឈ្មោះវត្ថុក្នុងថ្នាក់ប្រាំជាភាសាអង់គ្លេស និងប្រើ ‘This is a…’ ក្នុងប្រយោគពេញលេញ។"),
    explanation: text("A noun names a person, place, or thing. Use ‘This is a book’ for one nearby book. Use ‘This is an eraser’ because eraser begins with a vowel sound.", "នាមគឺជាពាក្យសម្រាប់ហៅមនុស្ស ទីកន្លែង ឬវត្ថុ។ ប្រើ ‘This is a book’ សម្រាប់សៀវភៅមួយនៅជិត។ ប្រើ ‘This is an eraser’ ព្រោះ eraser ចាប់ផ្ដើមដោយសំឡេងស្រៈ។"),
    vocabulary: [text("book — សៀវភៅ", "book — សៀវភៅ"), text("pencil — ខ្មៅដៃ", "pencil — ខ្មៅដៃ"), text("chair — កៅអី", "chair — កៅអី"), text("ruler — បន្ទាត់", "ruler — បន្ទាត់"), text("eraser — ជ័រលុប", "eraser — ជ័រលុប")],
    materials: text("Five classroom objects, paper, and pencils. Draw objects if physical items are unavailable.", "វត្ថុក្នុងថ្នាក់ប្រាំ ក្រដាស និងខ្មៅដៃ។ គូររូបវត្ថុជំនួស ប្រសិនបើគ្មានវត្ថុពិត។"),
    activity: text("In groups of four, draw five objects. One learner points; another names the object and says ‘This is a…’. Swap roles until everyone has spoken. Finish by labeling each drawing.", "ក្នុងក្រុមបួននាក់ គូរវត្ថុប្រាំ។ សិស្សម្នាក់ចង្អុល ហើយម្នាក់ទៀតប្រាប់ឈ្មោះវត្ថុ និងនិយាយ ‘This is a…’។ ប្ដូរតួនាទីរហូតដល់គ្រប់គ្នាបាននិយាយ។ ចុងក្រោយ សរសេរឈ្មោះលើរូបនីមួយៗ។"),
    questions: [
      question(text("Which word means សៀវភៅ?", "តើពាក្យណាមានន័យថា សៀវភៅ?"), [text("book", "book"), text("chair", "chair"), text("pencil", "pencil")], 0, text("Book means សៀវភៅ.", "Book មានន័យថា សៀវភៅ។")),
      question(text("Choose the correct sentence.", "ជ្រើសរើសប្រយោគត្រឹមត្រូវ។"), [text("This is an pencil.", "This is an pencil."), text("This is a pencil.", "This is a pencil."), text("This a is pencil.", "This a is pencil.")], 1, text("Use ‘a’ before the consonant sound in pencil.", "ប្រើ ‘a’ នៅមុខសំឡេងព្យញ្ជនៈក្នុងពាក្យ pencil។")),
      question(text("What do we sit on?", "តើយើងអង្គុយលើអ្វី?"), [text("a ruler", "a ruler"), text("an eraser", "an eraser"), text("a chair", "a chair")], 2, text("We sit on a chair.", "យើងអង្គុយលើកៅអី។")),
      question(text("Which object helps measure length?", "តើវត្ថុណាជួយវាស់ប្រវែង?"), [text("a ruler", "a ruler"), text("a book", "a book"), text("an eraser", "an eraser")], 0, text("A ruler measures length.", "បន្ទាត់ប្រើសម្រាប់វាស់ប្រវែង។")),
      question(text("Complete: This is ___ eraser.", "បំពេញ៖ This is ___ eraser."), [text("a", "a"), text("an", "an"), text("are", "are")], 1, text("Use ‘an’ before the vowel sound in eraser.", "ប្រើ ‘an’ នៅមុខសំឡេងស្រៈក្នុងពាក្យ eraser។")),
    ],
  },
  {
    id: "present-simple", subject: "english", title: text("Present simple: daily routines", "បច្ចុប្បន្នកាលធម្មតា៖ សកម្មភាពប្រចាំថ្ងៃ"), grades: "G7–12",
    objective: text("Describe daily routines using present simple statements, negatives, and questions.", "ពិពណ៌នាសកម្មភាពប្រចាំថ្ងៃ ដោយប្រើប្រយោគស្រប បដិសេធ និងសំណួរក្នុងបច្ចុប្បន្នកាលធម្មតា។"),
    explanation: text("Use present simple for habits. Add -s or -es with he, she, or it: ‘She studies.’ Use does/does not with the base verb: ‘Does she study?’ ‘She does not study.’ Use do/do not with I, you, we, and they.", "ប្រើបច្ចុប្បន្នកាលធម្មតាសម្រាប់ទម្លាប់។ បន្ថែម -s ឬ -es ជាមួយ he, she ឬ it៖ ‘She studies.’ ប្រើ does/does not ជាមួយកិរិយាសព្ទដើម៖ ‘Does she study?’ ‘She does not study.’ ប្រើ do/do not ជាមួយ I, you, we និង they។"),
    vocabulary: [text("study — សិក្សា", "study — សិក្សា"), text("walk — ដើរ", "walk — ដើរ"), text("every day — រាល់ថ្ងៃ", "every day — រាល់ថ្ងៃ")],
    materials: text("Paper and pencils; a board is optional.", "ក្រដាស និងខ្មៅដៃ។ អាចប្រើក្ដារខៀនបើមាន។"),
    activity: text("Pairs interview each other with ‘Do you… every day?’ Write three sentences about your partner using he or she. Exchange papers and check verb endings. Invite volunteers to read one sentence aloud.", "សិស្សជាគូសម្ភាសគ្នាដោយសួរ ‘Do you… every day?’ សរសេរប្រយោគបីអំពីដៃគូ ដោយប្រើ he ឬ she។ ប្ដូរក្រដាស និងពិនិត្យចុងកិរិយាសព្ទ។ អញ្ជើញអ្នកស្ម័គ្រចិត្តអានប្រយោគមួយ។"),
    questions: [
      question(text("Complete: She ___ to school every day.", "បំពេញ៖ She ___ to school every day."), [text("walk", "walk"), text("walks", "walks"), text("walking", "walking")], 1, text("Use walks with she in the present simple.", "ប្រើ walks ជាមួយ She ក្នុងបច្ចុប្បន្នកាលធម្មតា។")),
      question(text("Choose the correct negative.", "ជ្រើសរើសប្រយោគបដិសេធត្រឹមត្រូវ។"), [text("He does not plays football.", "He does not plays football."), text("He do not play football.", "He do not play football."), text("He does not play football.", "He does not play football.")], 2, text("After does not, use the base verb play.", "នៅក្រោយ does not ប្រើកិរិយាសព្ទដើម play។")),
      question(text("Complete: ___ they study English?", "បំពេញ៖ ___ they study English?"), [text("Do", "Do"), text("Does", "Does"), text("Is", "Is")], 0, text("Use Do with they.", "ប្រើ Do ជាមួយ they។")),
      question(text("Complete: Dara ___ his homework after school.", "បំពេញ៖ Dara ___ his homework after school."), [text("do", "do"), text("does", "does"), text("doing", "doing")], 1, text("Dara is a singular subject, so use does.", "Dara ជាប្រធានឯកវចនៈ ដូច្នេះប្រើ does។")),
      question(text("Which phrase describes a habit?", "តើឃ្លាណាពិពណ៌នាទម្លាប់?"), [text("right now", "right now"), text("yesterday", "yesterday"), text("every morning", "every morning")], 2, text("Every morning expresses a repeated routine.", "Every morning បង្ហាញទម្លាប់ដែលកើតឡើងដដែលៗ។")),
    ],
  },
  {
    id: "fractions", subject: "mathematics", title: text("Fractions and equal parts", "ប្រភាគ និងចំណែកស្មើគ្នា"), grades: "G3–6",
    objective: text("Represent fractions as equal parts and add fractions with the same denominator.", "បង្ហាញប្រភាគជាចំណែកស្មើគ្នា និងបូកប្រភាគដែលមានភាគបែងដូចគ្នា។"),
    explanation: text("The denominator counts the equal parts in a whole. The numerator counts the selected parts. To add fractions with the same denominator, add the numerators and keep the denominator. Simplify when possible.", "ភាគបែងបង្ហាញចំនួនចំណែកស្មើគ្នានៃវត្ថុទាំងមូល។ ភាគយកបង្ហាញចំនួនចំណែកដែលបានជ្រើសរើស។ ដើម្បីបូកប្រភាគដែលមានភាគបែងដូចគ្នា បូកភាគយក និងរក្សាភាគបែង។ សម្រួលប្រភាគបើអាចធ្វើបាន។"),
    vocabulary: [text("numerator — ភាគយក", "numerator — ភាគយក"), text("denominator — ភាគបែង", "denominator — ភាគបែង"), text("equal parts — ចំណែកស្មើគ្នា", "equal parts — ចំណែកស្មើគ្នា")],
    materials: text("Scrap paper and pencils. No cutting tools are needed.", "ក្រដាសប្រើរួច និងខ្មៅដៃ។ មិនចាំបាច់មានឧបករណ៍កាត់ទេ។"),
    activity: text("Fold a paper rectangle into four equal parts. Shade one part and label 1/4. Shade two parts on a second drawing and label 2/4 = 1/2. Groups design one fraction drawing for another group to identify.", "បត់ក្រដាសចតុកោណជាបួនចំណែកស្មើគ្នា។ ផាត់មួយចំណែក និងសរសេរ 1/4។ លើរូបទីពីរ ផាត់ពីរចំណែក និងសរសេរ 2/4 = 1/2។ ក្រុមនីមួយៗគូររូបប្រភាគមួយ ឱ្យក្រុមផ្សេងកំណត់តម្លៃ។"),
    questions: [
      question(text("One of four equal parts is…", "មួយចំណែកក្នុងចំណោមបួនចំណែកស្មើគ្នាគឺ…"), [text("1/4", "1/4"), text("4/1", "4/1"), text("1/3", "1/3")], 0, text("There are four equal parts and one is selected.", "មានបួនចំណែកស្មើគ្នា ហើយជ្រើសរើសមួយ។")),
      question(text("What is 1/4 + 2/4?", "តើ 1/4 + 2/4 ស្មើប៉ុន្មាន?"), [text("3/8", "3/8"), text("3/4", "3/4"), text("2/4", "2/4")], 1, text("Add 1 + 2; keep denominator 4.", "បូក 1 + 2 ហើយរក្សាភាគបែង 4។")),
      question(text("Which fraction equals 1/2?", "តើប្រភាគណាស្មើ 1/2?"), [text("1/4", "1/4"), text("3/4", "3/4"), text("2/4", "2/4")], 2, text("Divide the numerator and denominator of 2/4 by 2.", "ចែកភាគយក និងភាគបែងនៃ 2/4 នឹង 2។")),
      question(text("What is the denominator of 3/5?", "តើភាគបែងនៃ 3/5 ជាលេខអ្វី?"), [text("5", "5"), text("3", "3"), text("8", "8")], 0, text("The bottom number is the denominator.", "លេខនៅខាងក្រោមគឺភាគបែង។")),
      question(text("What is 2/3 + 1/3?", "តើ 2/3 + 1/3 ស្មើប៉ុន្មាន?"), [text("3/6", "3/6"), text("1", "1"), text("2/3", "2/3")], 1, text("3/3 is one whole.", "3/3 ស្មើនឹងមួយទាំងមូល។")),
    ],
  },
  {
    id: "percentages", subject: "mathematics", title: text("Percentages in everyday life", "ភាគរយក្នុងជីវិតប្រចាំថ្ងៃ"), grades: "G7–12",
    objective: text("Calculate a percentage of an amount and find the price after a discount.", "គណនាភាគរយនៃបរិមាណ និងរកតម្លៃក្រោយបញ្ចុះតម្លៃ។"),
    explanation: text("Percent means ‘per hundred’. Find p% of an amount by multiplying by p/100. For a discount, subtract the discount amount from the original price. Example: 10% of 20,000 KHR is 2,000 KHR; the discounted price is 18,000 KHR.", "ភាគរយមានន័យថា «ក្នុងមួយរយ»។ រក p% នៃបរិមាណដោយគុណនឹង p/100។ សម្រាប់ការបញ្ចុះតម្លៃ ដកចំនួនបញ្ចុះពីតម្លៃដើម។ ឧទាហរណ៍៖ 10% នៃ 20,000 រៀល គឺ 2,000 រៀល ហើយតម្លៃក្រោយបញ្ចុះគឺ 18,000 រៀល។"),
    vocabulary: [text("percent — ភាគរយ", "percent — ភាគរយ"), text("discount — ការបញ្ចុះតម្លៃ", "discount — ការបញ្ចុះតម្លៃ"), text("original price — តម្លៃដើម", "original price — តម្លៃដើម")],
    materials: text("Paper and pencils; calculators are optional for checking.", "ក្រដាស និងខ្មៅដៃ។ អាចប្រើម៉ាស៊ីនគិតលេខសម្រាប់ផ្ទៀងផ្ទាត់។"),
    activity: text("Groups create a pretend market with three prices in KHR and discounts of 10%, 20%, or 25%. Another group calculates the new prices and explains its method. Compare answers and discuss whether the displayed discount amount or final price is clearer.", "ក្រុមនីមួយៗបង្កើតផ្សារសន្មតដោយកំណត់តម្លៃបីជារៀល និងបញ្ចុះ 10%, 20% ឬ 25%។ ក្រុមផ្សេងគណនាតម្លៃថ្មី និងពន្យល់វិធីគណនា។ ប្រៀបធៀបចម្លើយ និងពិភាក្សាថាតើការបង្ហាញចំនួនបញ្ចុះ ឬតម្លៃចុងក្រោយងាយយល់ជាង។"),
    questions: [
      question(text("What is 25% of 80?", "តើ 25% នៃ 80 ស្មើប៉ុន្មាន?"), [text("20", "20"), text("25", "25"), text("40", "40")], 0, text("80 × 25/100 = 20.", "80 × 25/100 = 20។")),
      question(text("A 20,000 KHR item has a 10% discount. What is the final price?", "ទំនិញតម្លៃ 20,000 រៀល បញ្ចុះ 10%។ តើតម្លៃចុងក្រោយប៉ុន្មាន?"), [text("2,000 KHR", "2,000 រៀល"), text("18,000 KHR", "18,000 រៀល"), text("19,000 KHR", "19,000 រៀល")], 1, text("20,000 − 2,000 = 18,000 KHR.", "20,000 − 2,000 = 18,000 រៀល។")),
      question(text("Write 50% as a fraction in simplest form.", "សរសេរ 50% ជាប្រភាគសាមញ្ញបំផុត។"), [text("1/5", "1/5"), text("5/10", "5/10"), text("1/2", "1/2")], 2, text("50/100 simplifies to 1/2; 5/10 is equivalent but not simplest.", "50/100 សម្រួលបាន 1/2។ 5/10 មានតម្លៃស្មើគ្នា ប៉ុន្តែមិនមែនជាទម្រង់សាមញ្ញបំផុតទេ។")),
      question(text("What is 20% of 15,000 KHR?", "តើ 20% នៃ 15,000 រៀល ស្មើប៉ុន្មាន?"), [text("3,000 KHR", "3,000 រៀល"), text("300 KHR", "300 រៀល"), text("12,000 KHR", "12,000 រៀល")], 0, text("15,000 × 0.20 = 3,000 KHR.", "15,000 × 0.20 = 3,000 រៀល។")),
      question(text("Six of 24 learners are absent. What percentage is absent?", "សិស្ស 6 នាក់ក្នុងចំណោម 24 នាក់អវត្តមាន។ តើអវត្តមានប៉ុន្មានភាគរយ?"), [text("6%", "6%"), text("25%", "25%"), text("40%", "40%")], 1, text("6/24 × 100 = 25%.", "6/24 × 100 = 25%។")),
    ],
  },
  {
    id: "circuits", subject: "science", title: text("Circuits and Ohm’s law", "សៀគ្វីអគ្គិសនី និងច្បាប់អូម"), grades: "G7–12",
    objective: text("Identify a complete circuit and calculate voltage, current, or resistance using V = I × R.", "កំណត់សៀគ្វីបិទ និងគណនាតង់ស្យុង ចរន្ត ឬរេស៊ីស្តង់ដោយប្រើ V = I × R។"),
    explanation: text("An electric current needs a complete conducting path. Voltage is measured in volts (V), current in amperes (A), and resistance in ohms (Ω). For an ideal ohmic resistor, V = I × R. Use paper circuit diagrams for this activity; never use mains electricity or short-circuit a battery.", "ចរន្តអគ្គិសនីត្រូវការផ្លូវចម្លងបិទពេញលេញ។ តង់ស្យុងវាស់ជាវ៉ុល (V) ចរន្តជាអំពែរ (A) និងរេស៊ីស្តង់ជាអូម (Ω)។ សម្រាប់រេស៊ីស្ត័រអូមអុីកឧត្ដមគតិ V = I × R។ សកម្មភាពនេះប្រើរូបសៀគ្វីលើក្រដាស។ កុំប្រើចរន្តភ្លើងផ្ទះ ឬធ្វើឱ្យថ្មឆ្លងសៀគ្វី។"),
    vocabulary: [text("voltage — តង់ស្យុង", "voltage — តង់ស្យុង"), text("current — ចរន្ត", "current — ចរន្ត"), text("resistance — រេស៊ីស្តង់", "resistance — រេស៊ីស្តង់")],
    materials: text("Paper, pencils, and drawn battery, switch, wire, and resistor symbols. This is a paper simulation.", "ក្រដាស ខ្មៅដៃ និងនិមិត្តសញ្ញាថ្ម កុងតាក់ ខ្សែ និងរេស៊ីស្ត័រ។ នេះជាការក្លែងធ្វើលើក្រដាស។"),
    activity: text("Groups draw a battery, switch, and resistor in a single loop. Label an open and closed switch. Assign 6 V and 3 Ω; calculate 2 A. Change resistance to 6 Ω and calculate 1 A. Explain why current decreases when resistance increases at fixed voltage.", "ក្រុមនីមួយៗគូរថ្ម កុងតាក់ និងរេស៊ីស្ត័រក្នុងរង្វង់តែមួយ។ សម្គាល់កុងតាក់បើក និងបិទ។ កំណត់ 6 V និង 3 Ω ហើយគណនាបាន 2 A។ ប្ដូររេស៊ីស្តង់ទៅ 6 Ω ហើយគណនាបាន 1 A។ ពន្យល់ថាហេតុអ្វីចរន្តថយចុះ ពេលរេស៊ីស្តង់កើនឡើងនៅតង់ស្យុងថេរ។"),
    questions: [
      question(text("An open switch usually…", "កុងតាក់បើកជាទូទៅ…"), [text("breaks the conducting path", "ផ្ដាច់ផ្លូវចម្លង"), text("doubles the voltage", "បង្កើនតង់ស្យុងទ្វេដង"), text("removes all resistance", "លុបរេស៊ីស្តង់ទាំងអស់")], 0, text("An open switch interrupts a simple series circuit.", "កុងតាក់បើកផ្ដាច់សៀគ្វីស៊េរីសាមញ្ញ។")),
      question(text("What is current when V = 6 V and R = 3 Ω?", "តើចរន្តប៉ុន្មាន ពេល V = 6 V និង R = 3 Ω?"), [text("18 A", "18 A"), text("2 A", "2 A"), text("0.5 A", "0.5 A")], 1, text("I = V/R = 6/3 = 2 A.", "I = V/R = 6/3 = 2 A។")),
      question(text("What is voltage when I = 2 A and R = 4 Ω?", "តើតង់ស្យុងប៉ុន្មាន ពេល I = 2 A និង R = 4 Ω?"), [text("2 V", "2 V"), text("6 V", "6 V"), text("8 V", "8 V")], 2, text("V = I × R = 2 × 4 = 8 V.", "V = I × R = 2 × 4 = 8 V។")),
      question(text("Which unit measures resistance?", "តើឯកតាណាវាស់រេស៊ីស្តង់?"), [text("ohm (Ω)", "អូម (Ω)"), text("volt (V)", "វ៉ុល (V)"), text("ampere (A)", "អំពែរ (A)")], 0, text("Resistance is measured in ohms.", "រេស៊ីស្តង់វាស់ជាអូម។")),
      question(text("At fixed voltage, doubling resistance makes current…", "នៅតង់ស្យុងថេរ បើរេស៊ីស្តង់កើនទ្វេដង ចរន្តនឹង…"), [text("double", "កើនទ្វេដង"), text("halve", "ថយពាក់កណ្ដាល"), text("stay the same", "នៅដដែល")], 1, text("I = V/R, so doubling R halves I.", "I = V/R ដូច្នេះបង្កើន R ទ្វេដង ធ្វើឱ្យ I ថយពាក់កណ្ដាល។")),
    ],
  },
  {
    id: "water-cycle", subject: "science", title: text("The water cycle", "វដ្ដទឹក"), grades: "G3–9",
    objective: text("Explain evaporation, condensation, precipitation, and collection using a labeled diagram.", "ពន្យល់រំហួត កំណកញើស កំណកធ្លាក់ និងការប្រមូលទឹក ដោយប្រើរូបភាពដែលមានស្លាក។"),
    explanation: text("Sunlight supplies energy that helps liquid water evaporate into water vapor. Cooling water vapor can condense into liquid droplets that form clouds. Water returns as precipitation, such as rain, then collects, flows, or enters the ground. The cycle has many paths rather than one fixed sequence.", "ពន្លឺព្រះអាទិត្យផ្ដល់ថាមពលដែលជួយឱ្យទឹករាវហួតជាចំហាយទឹក។ ចំហាយទឹកត្រជាក់អាចកកជាដំណក់ទឹករាវដែលបង្កើតពពក។ ទឹកត្រឡប់មកវិញជាកំណកធ្លាក់ ដូចជាភ្លៀង ហើយប្រមូលផ្ដុំ ហូរ ឬជ្រាបចូលដី។ វដ្ដនេះមានផ្លូវជាច្រើន មិនមែនលំដាប់ថេរតែមួយទេ។"),
    vocabulary: [text("evaporation — រំហួត", "evaporation — រំហួត"), text("condensation — កំណកញើស", "condensation — កំណកញើស"), text("precipitation — កំណកធ្លាក់", "precipitation — កំណកធ្លាក់")],
    materials: text("Paper and pencils; local observations of rain, puddles, and clouds.", "ក្រដាស ខ្មៅដៃ និងការសង្កេតភ្លៀង ថ្លុកទឹក និងពពកនៅមូលដ្ឋាន។"),
    activity: text("Groups draw a river or pond, the sun, clouds, and rain. Add arrows and process labels. Describe where a raindrop might travel next. Compare a dry-season and rainy-season observation without assuming all water follows the same path.", "ក្រុមនីមួយៗគូរទន្លេ ឬស្រះ ព្រះអាទិត្យ ពពក និងភ្លៀង។ បន្ថែមព្រួញ និងឈ្មោះដំណើរការ។ ពិពណ៌នាផ្លូវបន្ទាប់របស់ដំណក់ភ្លៀង។ ប្រៀបធៀបការសង្កេតរដូវប្រាំង និងរដូវវស្សា ដោយមិនសន្មតថាទឹកទាំងអស់មានផ្លូវដូចគ្នា។"),
    questions: [
      question(text("Liquid water becoming water vapor is…", "ទឹករាវប្ដូរជាចំហាយទឹកគឺ…"), [text("evaporation", "រំហួត"), text("precipitation", "កំណកធ្លាក់"), text("collection", "ការប្រមូលទឹក")], 0, text("Evaporation changes liquid water to vapor.", "រំហួតប្ដូរទឹករាវទៅជាចំហាយ។")),
      question(text("Cooling water vapor forming droplets is…", "ចំហាយទឹកត្រជាក់បង្កើតដំណក់ទឹកគឺ…"), [text("evaporation", "រំហួត"), text("condensation", "កំណកញើស"), text("runoff", "ទឹកហូរលើផ្ទៃដី")], 1, text("Condensation changes vapor to liquid droplets.", "កំណកញើសប្ដូរចំហាយទៅជាដំណក់ទឹករាវ។")),
      question(text("Rain is an example of…", "ភ្លៀងជាឧទាហរណ៍នៃ…"), [text("evaporation", "រំហួត"), text("condensation only", "កំណកញើសតែប៉ុណ្ណោះ"), text("precipitation", "កំណកធ្លាក់")], 2, text("Precipitation is water falling from clouds.", "កំណកធ្លាក់គឺទឹកដែលធ្លាក់ពីពពក។")),
      question(text("What supplies much of the energy for evaporation?", "តើអ្វីផ្ដល់ថាមពលច្រើនសម្រាប់រំហួត?"), [text("the sun", "ព្រះអាទិត្យ"), text("the moon", "ព្រះចន្ទ"), text("a ruler", "បន្ទាត់")], 0, text("Solar energy helps water evaporate.", "ថាមពលព្រះអាទិត្យជួយឱ្យទឹកហួត។")),
      question(text("After rain, water can…", "ក្រោយភ្លៀង ទឹកអាច…"), [text("only stay on roads", "នៅលើផ្លូវតែប៉ុណ្ណោះ"), text("flow into rivers or soak into soil", "ហូរចូលទន្លេ ឬជ្រាបចូលដី"), text("stop moving forever", "ឈប់ផ្លាស់ទីជារៀងរហូត")], 1, text("Water can collect, flow, infiltrate, or evaporate again.", "ទឹកអាចប្រមូលផ្ដុំ ហូរ ជ្រាបចូលដី ឬហួតម្ដងទៀត។")),
    ],
  },
];

export const resourceKinds: ResourceKind[] = ["lesson", "worksheet", "quiz", "rubric", "activity"];
export const subjects: ToolkitSubject[] = ["english", "mathematics", "science"];
export const subjectLabels = { english: text("English", "ភាសាអង់គ្លេស"), mathematics: text("Mathematics", "គណិតវិទ្យា"), science: text("Science", "វិទ្យាសាស្ត្រ") };
export const resourceLabels = { lesson: text("Lesson plan", "ផែនការមេរៀន"), worksheet: text("Worksheet", "សន្លឹកកិច្ចការ"), quiz: text("Quiz", "សំណួរតេស្ត"), rubric: text("Rubric", "តារាងវាយតម្លៃ"), activity: text("Classroom activity", "សកម្មភាពក្នុងថ្នាក់") };
export interface ToolkitSettings { unitId: string; grade: number; duration: number; students: number; title: string; objective: string; notes: string }
export const defaultToolkitSettings: ToolkitSettings = { unitId: "present-simple", grade: 7, duration: 45, students: 32, title: "", objective: "", notes: "" };

export function lessonTimings(duration: number): number[] {
  const total = Math.max(10, Math.round(duration));
  const first = [0.15, 0.2, 0.3, 0.25].map((weight) => Math.floor(total * weight));
  return [...first, total - first.reduce((sum, value) => sum + value, 0)];
}

export function buildTeachingResource(settings: ToolkitSettings, kind: ResourceKind, locale: Locale) {
  const unit = toolkitUnits.find((item) => item.id === settings.unitId) ?? toolkitUnits[0];
  const choose = (en: string, km: string) => locale === "km" ? km : en;
  const objective = settings.objective.trim() || unit.objective[locale];
  const title = settings.title.trim() || unit.title[locale];
  const vocabulary = unit.vocabulary.map((item) => `• ${item[locale]}`).join("\n");
  const questions = unit.questions.map((item, index) => `${index + 1}. ${item.prompt[locale]}\n${item.choices.map((choice, i) => `   ${String.fromCharCode(65 + i)}. ${choice[locale]}`).join("\n")}${kind === "worksheet" ? "\n   __________________________________________________" : ""}`).join("\n\n");
  let body = "";
  if (kind === "lesson") {
    const timings = lessonTimings(settings.duration);
    const steps = [
      [choose("Connect", "ភ្ជាប់បទពិសោធន៍"), choose("Ask learners what they already know. Invite examples from home or school; accept Khmer discussion before practicing new terms.", "សួរសិស្សអំពីអ្វីដែលពួកគេដឹង។ សុំឧទាហរណ៍ពីផ្ទះ ឬសាលា ហើយអនុញ្ញាតឱ្យពិភាក្សាជាភាសាខ្មែរមុនអនុវត្តពាក្យថ្មី។")],
      [choose("Explain and model", "ពន្យល់ និងបង្ហាញគំរូ"), unit.explanation[locale]],
      [choose("Practice together", "អនុវត្តរួមគ្នា"), unit.activity[locale]],
      [choose("Apply independently", "អនុវត្តដោយខ្លួនឯង"), choose("Use questions 1–4 from the matching worksheet. Ask learners to explain one answer to a partner before checking.", "ប្រើសំណួរ 1–4 ពីសន្លឹកកិច្ចការដែលត្រូវគ្នា។ សុំឱ្យសិស្សពន្យល់ចម្លើយមួយដល់ដៃគូមុនផ្ទៀងផ្ទាត់។")],
      [choose("Reflect and check", "ឆ្លុះបញ្ចាំង និងពិនិត្យ"), choose("Use question 5 as an exit ticket. Ask: What did you learn? What remains confusing? Use responses to plan the next lesson.", "ប្រើសំណួរទី 5 ជាការត្រួតពិនិត្យចុងមេរៀន។ សួរ៖ តើអ្នកបានរៀនអ្វី? តើអ្វីមិនទាន់យល់? ប្រើចម្លើយសម្រាប់រៀបចំមេរៀនបន្ទាប់។")],
    ];
    body = `${choose("LEARNING OBJECTIVE", "គោលបំណងសិក្សា")}\n${objective}\n\n${choose("MATERIALS", "សម្ភារៈ")}\n${unit.materials[locale]}\n\n${choose("KEY WORDS", "ពាក្យគន្លឹះ")}\n${vocabulary}\n\n${steps.map(([name, detail], i) => `${i + 1}. ${name} — ${timings[i]} ${choose("minutes", "នាទី")}\n${detail}`).join("\n\n")}\n\n${choose("DIFFERENTIATION", "ការសម្របតាមសមត្ថភាព")}\n${choose("Support: model the first answer, pair learners, and allow drawings or oral responses. Extend: ask learners to create a new example, solve it, and explain their reasoning.", "ជួយ៖ បង្ហាញចម្លើយទីមួយ ដាក់សិស្សជាគូ និងអនុញ្ញាតការគូររូប ឬចម្លើយផ្ទាល់មាត់។ ពង្រីក៖ សុំឱ្យសិស្សបង្កើតឧទាហរណ៍ថ្មី ដោះស្រាយ និងពន្យល់ហេតុផល។")}`;
  } else if (kind === "worksheet" || kind === "quiz") {
    body = `${choose("Name", "ឈ្មោះ")}: ____________________   ${choose("Date", "កាលបរិច្ឆេទ")}: ______________\n\n${kind === "quiz" ? choose("Choose one answer for each question. Each question is worth 1 point. Total: 5 points.", "ជ្រើសរើសចម្លើយមួយសម្រាប់សំណួរនីមួយៗ។ សំណួរមួយមាន 1 ពិន្ទុ។ សរុប៖ 5 ពិន្ទុ។") : choose("Answer each question. Show your working or explain your answer where appropriate.", "ឆ្លើយសំណួរនីមួយៗ។ បង្ហាញវិធីគណនា ឬពន្យល់ចម្លើយតាមការចាំបាច់។")}\n\n${questions}${kind === "worksheet" ? "\n\n" + choose("Your own example: Create one new example about this topic and explain it.\n__________________________________________________\n__________________________________________________", "ឧទាហរណ៍ផ្ទាល់ខ្លួន៖ បង្កើតឧទាហរណ៍ថ្មីមួយអំពីប្រធានបទនេះ និងពន្យល់។\n__________________________________________________\n__________________________________________________") : ""}`;
  } else if (kind === "rubric") {
    const criteria = [choose("Accuracy", "ភាពត្រឹមត្រូវ"), choose("Explanation and reasoning", "ការពន្យល់ និងហេតុផល"), choose("Application to a new example", "ការអនុវត្តលើឧទាហរណ៍ថ្មី")];
    body = `${choose("ASSESSMENT GOAL", "គោលបំណងវាយតម្លៃ")}\n${objective}\n\n${choose("Score each criterion from 1 to 4. Total: 12 points. Assess individual understanding, not confidence or language fluency unrelated to the objective.", "ដាក់ពិន្ទុលក្ខណៈនីមួយៗពី 1 ដល់ 4។ សរុប៖ 12 ពិន្ទុ។ វាយតម្លៃការយល់ដឹងរបស់សិស្ស មិនមែនភាពក្លាហាន ឬភាពស្ទាត់ជំនាញភាសាដែលមិនទាក់ទងនឹងគោលបំណងទេ។")}\n\n${criteria.map((criterion, i) => `${i + 1}. ${criterion}\n4 — ${choose("Accurate and independent; explains choices clearly.", "ត្រឹមត្រូវ និងធ្វើដោយខ្លួនឯង ពន្យល់ជម្រើសច្បាស់។")}\n3 — ${choose("Mostly accurate; minor prompts or corrections needed.", "ភាគច្រើនត្រឹមត្រូវ ត្រូវការការជួយ ឬកែតិចតួច។")}\n2 — ${choose("Partial understanding; several prompts needed.", "យល់មួយផ្នែក ត្រូវការការជួយជាច្រើន។")}\n1 — ${choose("Beginning; needs a modeled example and guided practice.", "កម្រិតដំបូង ត្រូវការគំរូ និងការអនុវត្តដោយមានការណែនាំ។")}\n${choose("Score", "ពិន្ទុ")}: ___ / 4`).join("\n\n")}\n\n${choose("Total", "សរុប")}: ___ / 12\n${choose("One strength", "ចំណុចខ្លាំងមួយ")}: __________________________\n${choose("One next step", "ជំហានបន្ទាប់មួយ")}: _________________________`;
  } else {
    body = `${choose("GOAL", "គោលបំណង")}\n${objective}\n\n${choose("MATERIALS", "សម្ភារៈ")}\n${unit.materials[locale]}\n\n${choose("GROUP SETUP", "ការរៀបចំក្រុម")}\n${choose(`Make ${Math.ceil(settings.students / 4)} groups of up to four. Share roles: facilitator, recorder, checker, and presenter. Rotate roles; adapt the final group as needed.`, `បង្កើត ${Math.ceil(settings.students / 4)} ក្រុម ដែលមានសិស្សមិនលើសបួននាក់។ ចែកតួនាទី៖ អ្នកសម្របសម្រួល អ្នកកត់ត្រា អ្នកផ្ទៀងផ្ទាត់ និងអ្នកបង្ហាញ។ ប្ដូរតួនាទី និងសម្របក្រុមចុងក្រោយតាមតម្រូវការ។`)}\n\n${choose("INSTRUCTIONS", "សេចក្ដីណែនាំ")}\n${unit.activity[locale]}\n\n${choose("CHECK FOR LEARNING", "ពិនិត្យការសិក្សា")}\n${choose("Each learner gives one explanation independently. Invite a second group to check the result. Ask everyone to write or say one thing they would change next time.", "សិស្សម្នាក់ៗពន្យល់មួយដោយខ្លួនឯង។ អញ្ជើញក្រុមទីពីរផ្ទៀងផ្ទាត់លទ្ធផល។ សុំឱ្យគ្រប់គ្នាសរសេរ ឬនិយាយអ្វីមួយដែលពួកគេនឹងកែលម្អលើកក្រោយ។")}`;
  }
  if (settings.notes.trim()) body += `\n\n${choose("CLASSROOM NOTES", "កំណត់ចំណាំក្នុងថ្នាក់")}\n${settings.notes.trim()}`;
  const answerKey = kind === "worksheet" || kind === "quiz" ? unit.questions.map((item, i) => `${i + 1}. ${kind === "quiz" ? String.fromCharCode(65 + item.correct) + ". " : ""}${item.choices[item.correct][locale]} — ${item.explanation[locale]}`).join("\n\n") + (kind === "worksheet" ? "\n\n" + choose("Own example: answers vary. Check that the example and explanation are consistent with the topic.", "ឧទាហរណ៍ផ្ទាល់ខ្លួន៖ ចម្លើយអាចខុសគ្នា។ ពិនិត្យថាឧទាហរណ៍ និងការពន្យល់ត្រូវនឹងប្រធានបទ។") : "") : "";
  return { title, body, answerKey, unit };
}
