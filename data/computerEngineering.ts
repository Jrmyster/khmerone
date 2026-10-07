import type { LocalizedText } from "@/types/app";
import type { GateId } from "@/lib/digital-logic";

interface GateLesson { name: LocalizedText; rule: LocalizedText; application: LocalizedText; expression: string; }
export const gateLessons: Record<GateId, GateLesson> = {
  AND: {
    name: { en: "AND · Both must be on", km: "AND · ទាំងពីរត្រូវបើក" }, expression: "Y = A ∧ B",
    rule: { en: "The output is 1 only when A AND B are both 1. One missing condition keeps the output at 0.", km: "សញ្ញាចេញស្មើ 1 លុះត្រាតែ A និង B សុទ្ធតែស្មើ 1។ បើលក្ខខណ្ឌមួយមិនត្រូវ សញ្ញាចេញស្មើ 0។" },
    application: { en: "A machine may run only when its power switch AND safety guard are enabled. This models the decision; a real safety system needs more than one simple gate.", km: "ម៉ាស៊ីនអាចដំណើរការបាននៅពេលកុងតាក់ថាមពល និងឧបករណ៍ការពារសុវត្ថិភាពបើកទាំងពីរ។ នេះជាគំរូសម្រេចចិត្តប៉ុណ្ណោះ។ ប្រព័ន្ធសុវត្ថិភាពពិតត្រូវការច្រើនជាងទ្វារសាមញ្ញមួយ។" },
  },
  OR: {
    name: { en: "OR · Either is enough", km: "OR · មួយក៏គ្រប់គ្រាន់" }, expression: "Y = A ∨ B",
    rule: { en: "The output is 1 when A OR B is 1, including when both are 1. This is inclusive OR, not 'one or the other only'.", km: "សញ្ញាចេញស្មើ 1 នៅពេល A ឬ B ស្មើ 1 រួមទាំងពេលទាំងពីរស្មើ 1។ OR មិនកំណត់ថាមានតែមួយប៉ុណ្ណោះទេ។" },
    application: { en: "An alarm can turn on when a door sensor OR a window sensor is active. Both sensors active also trigger it.", km: "សំឡេងរោទិ៍អាចបើកនៅពេលឧបករណ៍ចាប់សញ្ញាទ្វារ ឬបង្អួចសកម្ម។ បើទាំងពីរសកម្ម សំឡេងរោទិ៍ក៏បើកដែរ។" },
  },
  NOT: {
    name: { en: "NOT · Flip the bit", km: "NOT · បញ្ច្រាសប៊ីត" }, expression: "Y = ¬A",
    rule: { en: "NOT has one input. It inverts that input: 0 becomes 1, and 1 becomes 0. Input B is not used.", km: "NOT មានសញ្ញាបញ្ចូលមួយ។ វាបញ្ច្រាសតម្លៃ៖ 0 ក្លាយជា 1 ហើយ 1 ក្លាយជា 0។ វាមិនប្រើសញ្ញាបញ្ចូល B ទេ។" },
    application: { en: "A 'not ready' indicator can be the inverse of a ready signal. If ready = 1, not ready = 0.", km: "សញ្ញា «មិនទាន់រួចរាល់» អាចជាតម្លៃបញ្ច្រាសនៃសញ្ញា «រួចរាល់»។ បើរួចរាល់ = 1 នោះមិនទាន់រួចរាល់ = 0។" },
  },
  NAND: {
    name: { en: "NAND · AND, then invert", km: "NAND · AND រួចបញ្ច្រាស" }, expression: "Y = ¬(A ∧ B)",
    rule: { en: "NAND is the opposite of AND. It outputs 0 only when A and B are both 1; every other input pair produces 1.", km: "NAND ផ្ដល់លទ្ធផលផ្ទុយពី AND។ មានតែគូ 1 និង 1 ប៉ុណ្ណោះដែលផ្ដល់ 0។ គូផ្សេងទៀតផ្ដល់ 1។" },
    application: { en: "NAND is a universal gate: combinations of NAND gates can build any Boolean logic function. Tie its two inputs together and NAND(A, A) works as NOT(A). NAND circuits can also form latches that store a bit.", km: "NAND ជាទ្វារសកល៖ ការផ្សំទ្វារ NAND អាចបង្កើតអនុគមន៍ឡូជីខលប៊ូលីនណាមួយ។ ភ្ជាប់សញ្ញាបញ្ចូលទាំងពីរជាមួយគ្នា នោះ NAND(A, A) ដូចជា NOT(A)។ សៀគ្វី NAND ក៏អាចបង្កើត latch សម្រាប់រក្សាប៊ីតមួយ។" },
  },
  XOR: {
    name: { en: "XOR · Different inputs", km: "XOR · សញ្ញាបញ្ចូលខុសគ្នា" }, expression: "Y = A ⊕ B",
    rule: { en: "Exclusive OR gives 1 only when the two inputs differ. Unlike OR, 1 XOR 1 is 0.", km: "XOR ផ្ដល់ 1 លុះត្រាតែសញ្ញាបញ្ចូលទាំងពីរខុសគ្នា។ ខុសពី OR តម្លៃ 1 XOR 1 ស្មើ 0។" },
    application: { en: "A half-adder uses XOR for the sum bit and AND for the carry bit. Adding 1 + 1 gives binary 10: sum = 0, carry = 1. XOR also helps check parity in data.", km: "សៀគ្វីបូកពាក់កណ្ដាលប្រើ XOR សម្រាប់ប៊ីតផលបូក និង AND សម្រាប់ប៊ីតយកទៅបូកបន្ទាប់ (carry)។ 1 + 1 ផ្ដល់លេខគោលពីរ 10៖ ប៊ីតផលបូក = 0 និង carry = 1។ XOR ក៏ជួយពិនិត្យ parity ក្នុងទិន្នន័យ។" },
  },
};

export const languageIds = ["html", "css", "javascript", "python"] as const;
export type ProgrammingId = typeof languageIds[number];
interface CodingLesson {
  name: string; expansion: string; type: LocalizedText; purpose: LocalizedText;
  explanations: LocalizedText[]; challenge: LocalizedText; code: string; guide: string;
}
export const codingLessons: Record<ProgrammingId, CodingLesson> = {
  html: {
    name: "HTML", expansion: "HyperText Markup Language", type: { en: "Structure · markup language", km: "រចនាសម្ព័ន្ធ · ភាសាសម្គាល់" },
    purpose: { en: "HTML describes the meaning and structure of a page: headings, paragraphs, images, and links. It is a markup language, rather than a programming language with loops and decisions.", km: "HTML ពិពណ៌នាអត្ថន័យ និងរចនាសម្ព័ន្ធទំព័រ៖ ចំណងជើង កថាខណ្ឌ រូបភាព និងតំណភ្ជាប់។ វាជាភាសាសម្គាល់ មិនមែនភាសាសរសេរកម្មវិធីដែលមានរង្វិលជុំ និងការសម្រេចចិត្តទេ។" },
    code: '<!doctype html>\n<html lang="km">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>My first page</title>\n  </head>\n  <body>\n    <h1>សួស្តីកម្ពុជា!</h1>\n    <p>I am learning to build a website.</p>\n    <a href="https://khmerone.com">Khmer One</a>\n  </body>\n</html>',
    explanations: [
      { en: "<!doctype html> selects modern HTML; lang and UTF-8 help browsers and assistive tools understand the text.", km: "<!doctype html> ជ្រើស HTML ទំនើប។ lang និង UTF-8 ជួយកម្មវិធីរុករក និងឧបករណ៍ជំនួយឱ្យយល់អត្ថបទ។" },
      { en: "<h1> marks the main heading; <p> marks a paragraph. Closing tags finish an element.", km: "<h1> សម្គាល់ចំណងជើងសំខាន់ ហើយ <p> សម្គាល់កថាខណ្ឌ។ ស្លាកបិទបញ្ចប់ធាតុមួយ។" },
      { en: "href gives a link its destination. Save the example as index.html and open it in a browser.", km: "href កំណត់ទិសដៅតំណភ្ជាប់។ រក្សាទុកឧទាហរណ៍ជា index.html ហើយបើកក្នុងកម្មវិធីរុករក។" },
    ], challenge: { en: "Change the heading to your school name. Add a second paragraph about your favorite subject.", km: "ប្ដូរចំណងជើងទៅឈ្មោះសាលារបស់អ្នក។ បន្ថែមកថាខណ្ឌទីពីរអំពីមុខវិជ្ជាដែលអ្នកចូលចិត្ត។" },
    guide: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content",
  },
  css: {
    name: "CSS", expansion: "Cascading Style Sheets", type: { en: "Presentation · style sheet language", km: "រូបរាង · ភាសារៀបចំរចនាប័ទ្ម" },
    purpose: { en: "CSS controls colors, spacing, fonts, and layout. Responsive rules help the same page work on a phone and a laptop. CSS styles HTML; it does not replace it.", km: "CSS គ្រប់គ្រងពណ៌ ចន្លោះ ពុម្ពអក្សរ និងប្លង់។ ក្បួនឆ្លើយតបជួយឱ្យទំព័រមួយដំណើរការលើទូរស័ព្ទ និងកុំព្យូទ័រយួរដៃ។ CSS តុបតែង HTML មិនជំនួសវាទេ។" },
    code: 'body {\n  background: #0b1329;\n  color: #edf7fb;\n  padding: 16px;\n  line-height: 1.7;\n}\n\nh1 {\n  color: #fbbf24;\n}\n\n@media (min-width: 640px) {\n  body { padding: 32px; }\n}',
    explanations: [
      { en: "body and h1 are selectors: they choose which HTML elements to style.", km: "body និង h1 ជាឧបករណ៍ជ្រើសរើសធាតុ HTML ដែលត្រូវតុបតែង។" },
      { en: "Inside braces, each declaration pairs a property with a value. A semicolon ends it.", km: "ក្នុងវង់ក្រចកអង្កាញ់ សេចក្ដីប្រកាសនីមួយៗភ្ជាប់លក្ខណៈសម្បត្តិជាមួយតម្លៃ។ សញ្ញា ; បញ្ចប់សេចក្ដីប្រកាស។" },
      { en: "The media query increases padding on wider screens. Put these rules in a <style> element in the HTML <head>, or link an external style sheet.", km: "Media query បង្កើនចន្លោះលើអេក្រង់ធំ។ ដាក់ក្បួនទាំងនេះក្នុងធាតុ <style> នៅក្នុង <head> របស់ HTML ឬភ្ជាប់ឯកសារ CSS ខាងក្រៅ។" },
    ], challenge: { en: "Switch the heading color. Which color remains easier to read against the dark background?", km: "ប្ដូរពណ៌ចំណងជើង។ តើពណ៌មួយណាងាយអានជាងលើផ្ទៃខាងក្រោយងងឹត?" },
    guide: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Styling_basics",
  },
  javascript: {
    name: "JavaScript", expansion: "", type: { en: "Behavior · programming language", km: "សកម្មភាព · ភាសាសរសេរកម្មវិធី" },
    purpose: { en: "JavaScript responds to user actions. It can power buttons, calculators, and games in a browser; it can also run on a server. It is a different language from Java.", km: "JavaScript ឆ្លើយតបនឹងសកម្មភាពអ្នកប្រើ។ វាអាចបង្កើតប៊ូតុង ឧបករណ៍គណនា និងហ្គេមក្នុងកម្មវិធីរុករក ហើយក៏អាចដំណើរការនៅម៉ាស៊ីនមេ។ វាជាភាសាខុសពី Java។" },
    code: 'const button = document.querySelector("button");\nconst output = document.querySelector("output");\nlet clicks = 0;\n\nbutton.addEventListener("click", () => {\n  clicks = clicks + 1;\n  output.textContent = clicks;\n});',
    explanations: [
      { en: "querySelector finds an HTML element. This example needs <button>Click me</button> and <output>0</output> in the page.", km: "querySelector រកធាតុ HTML។ ឧទាហរណ៍នេះត្រូវការ <button>Click me</button> និង <output>0</output> នៅក្នុងទំព័រ។" },
      { en: "let stores a value that can change. Each click adds 1 to the count.", km: "let រក្សាទុកតម្លៃដែលអាចប្រែប្រួល។ ការចុចនីមួយៗបន្ថែម 1 ទៅចំនួន។" },
      { en: "The event listener runs after a click; textContent updates the visible output. Put this script after the button and output elements, before </body>.", km: "Event listener ដំណើរការបន្ទាប់ពីចុច។ textContent ប្ដូរលទ្ធផលដែលមើលឃើញ។ ដាក់ស្គ្រីបនេះក្រោយធាតុ button និង output មុន </body>។" },
    ], challenge: { en: "Try three clicks. In your copied example, change + 1 to + 2 and predict the next result.", km: "សាកចុចបីដង។ ក្នុងឧទាហរណ៍ដែលបានចម្លង ប្ដូរ + 1 ទៅ + 2 ហើយទាយលទ្ធផលបន្ទាប់។" },
    guide: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting",
  },
  python: {
    name: "Python", expansion: "", type: { en: "Automation · programming language", km: "ស្វ័យប្រវត្តិកម្ម · ភាសាសរសេរកម្មវិធី" },
    purpose: { en: "Python uses readable syntax for scripts, automation, data science, and backend software. It normally runs in a Python environment, not directly in a browser like JavaScript.", km: "Python មានវាក្យសម្ពន្ធងាយអានសម្រាប់ស្គ្រីប ស្វ័យប្រវត្តិកម្ម វិទ្យាសាស្ត្រទិន្នន័យ និងកម្មវិធីម៉ាស៊ីនមេ។ ជាទូទៅវាដំណើរការក្នុងបរិស្ថាន Python មិនមែនផ្ទាល់ក្នុងកម្មវិធីរុករកដូច JavaScript ទេ។" },
    code: 'print("Hello, Cambodia!")\n\nfor number in range(1, 4):\n    print(number)',
    explanations: [
      { en: "print() writes text or values to the console. Quotation marks identify a string.", km: "print() សរសេរអត្ថបទ ឬតម្លៃទៅកុងសូល។ សញ្ញាសម្រង់សម្គាល់ខ្សែអត្ថបទ។" },
      { en: "for repeats a block for each value. range(1, 4) gives 1, 2, 3; the end value is excluded.", km: "for ធ្វើប្លុកកូដឡើងវិញសម្រាប់តម្លៃនីមួយៗ។ range(1, 4) ផ្ដល់ 1, 2, 3 ដោយមិនរាប់តម្លៃចុងក្រោយ។" },
      { en: "Indentation puts print(number) inside the loop. Save as hello.py and run with Python 3.", km: "ការចូលបន្ទាត់ដាក់ print(number) ក្នុងរង្វិលជុំ។ រក្សាទុកជា hello.py ហើយដំណើរការជាមួយ Python 3។" },
    ], challenge: { en: "Predict what range(1, 6) prints. How many numbers appear?", km: "ទាយថា range(1, 6) នឹងបង្ហាញអ្វី។ តើមានលេខប៉ុន្មាន?" },
    guide: "https://docs.python.org/3/tutorial/controlflow.html#the-range-function",
  },
};
