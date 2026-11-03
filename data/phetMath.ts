import type { LocalizedText } from "@/types/app";

export const phetLevelIds = ["early-primary", "upper-primary", "lower-secondary", "upper-secondary"] as const;
export type PhetLevelId = (typeof phetLevelIds)[number];

export const phetLevels: Record<PhetLevelId, { title: LocalizedText; grades: LocalizedText }> = {
  "early-primary": {
    title: { en: "Early primary", km: "បឋមសិក្សាកម្រិតដំបូង" },
    grades: { en: "Suggested grades 1–3", km: "ណែនាំសម្រាប់ថ្នាក់ទី១–៣" },
  },
  "upper-primary": {
    title: { en: "Upper primary", km: "បឋមសិក្សាកម្រិតខ្ពស់" },
    grades: { en: "Suggested grades 4–6", km: "ណែនាំសម្រាប់ថ្នាក់ទី៤–៦" },
  },
  "lower-secondary": {
    title: { en: "Lower secondary", km: "អនុវិទ្យាល័យ" },
    grades: { en: "Suggested grades 7–9", km: "ណែនាំសម្រាប់ថ្នាក់ទី៧–៩" },
  },
  "upper-secondary": {
    title: { en: "Upper secondary", km: "វិទ្យាល័យ" },
    grades: { en: "Suggested grades 10–12 and beyond", km: "ណែនាំសម្រាប់ថ្នាក់ទី១០–១២ និងកម្រិតខ្ពស់ជាងនេះ" },
  },
};

export interface PhetMathResource {
  id: string;
  level: PhetLevelId;
  title: LocalizedText;
  description: LocalizedText;
  activity: LocalizedText;
  symbol: string;
  advanced?: boolean;
  url: string;
}

/** Official PhET landing pages. Levels and Khmer copy are Khmer One's guidance. */
export const phetMathResources: readonly PhetMathResource[] = [
  {
    id: "number-play", level: "early-primary", symbol: "1 2 3",
    title: { en: "Number Play", km: "លេងជាមួយចំនួន" },
    description: { en: "Count objects and connect quantities with written numbers.", km: "រាប់វត្ថុ និងភ្ជាប់ចំនួនវត្ថុទៅនឹងតួលេខ។" },
    activity: { en: "Make a group of 8. Show the same number in two different ways.", km: "បង្កើតក្រុមវត្ថុចំនួន ៨។ បង្ហាញចំនួនដូចគ្នានេះតាមវិធីពីរផ្សេងគ្នា។" },
    url: "https://phet.colorado.edu/en/simulations/number-play",
  },
  {
    id: "make-a-ten", level: "early-primary", symbol: "+",
    title: { en: "Make a Ten", km: "ផ្គុំចំនួនឱ្យបានដប់" },
    description: { en: "Group and split numbers to make ten and explore addition.", km: "ផ្គុំ និងបំបែកចំនួន ដើម្បីបង្កើតចំនួន ១០ និងស្វែងយល់ពីការបូក។" },
    activity: { en: "Find three pairs that add to 10. Use a group of ten to work out 8 + 5.", km: "រកចំនួនបីគូដែលបូកគ្នាបាន ១០។ ប្រើក្រុមចំនួនដប់ ដើម្បីគណនា ៨ + ៥។" },
    url: "https://phet.colorado.edu/en/simulations/make-a-ten",
  },
  {
    id: "arithmetic", level: "upper-primary", symbol: "× ÷",
    title: { en: "Arithmetic", km: "ការគុណ និងការចែក" },
    description: { en: "Practice multiplication, division, and finding factors with visual number patterns.", km: "ហាត់ការគុណ ការចែក និងការរកតួចែក តាមលំនាំលេខដែលអាចមើលឃើញ។" },
    activity: { en: "Explore 4 × 6. Find a division fact using the same three numbers.", km: "ស្វែងយល់ពី ៤ × ៦។ សរសេរប្រមាណវិធីចែកមួយ ដោយប្រើចំនួនទាំងបីដដែល។" },
    url: "https://phet.colorado.edu/en/simulations/arithmetic",
  },
  {
    id: "fractions-intro", level: "upper-primary", symbol: "½",
    title: { en: "Fractions: Intro", km: "ស្គាល់ប្រភាគ" },
    description: { en: "Build fractions with visual models and connect them to numbers.", km: "បង្កើតប្រភាគដោយប្រើរូបភាព និងភ្ជាប់រូបភាពទៅនឹងចំនួន។" },
    activity: { en: "Show one half using two different models. Explain what stays the same.", km: "បង្ហាញប្រភាគមួយភាគពីរ ដោយប្រើគំរូពីរផ្សេងគ្នា។ ពន្យល់ថាតើអ្វីនៅដដែល។" },
    url: "https://phet.colorado.edu/en/simulations/fractions-intro",
  },
  {
    id: "fraction-matcher", level: "upper-primary", symbol: "⅔",
    title: { en: "Fraction Matcher", km: "ផ្គូផ្គងប្រភាគ" },
    description: { en: "Match fractions that have equal values, including different visual representations.", km: "ផ្គូផ្គងប្រភាគដែលមានតម្លៃស្មើគ្នា ទោះបីបង្ហាញជារូបភាពខុសគ្នាក៏ដោយ។" },
    activity: { en: "Find a matching pair. Explain why the two fractions represent the same amount.", km: "រកប្រភាគមួយគូដែលត្រូវគ្នា។ ពន្យល់ថាហេតុអ្វីប្រភាគទាំងពីរបង្ហាញបរិមាណដូចគ្នា។" },
    url: "https://phet.colorado.edu/en/simulations/fraction-matcher",
  },
  {
    id: "equality-explorer", level: "lower-secondary", symbol: "=",
    title: { en: "Equality Explorer", km: "ស្វែងយល់ពីសមីការ" },
    description: { en: "Use a balance model to explore equations and solve for an unknown.", km: "ប្រើគំរូជញ្ជីង ដើម្បីស្វែងយល់ពីសមីការ និងរកតម្លៃអថេរ។" },
    activity: { en: "Keep both sides balanced while finding an unknown. Explain each change you make.", km: "រក្សាភាគីទាំងពីរឱ្យស្មើគ្នា ខណៈពេលរកតម្លៃអថេរ។ ពន្យល់រាល់ការផ្លាស់ប្តូរដែលអ្នកធ្វើ។" },
    url: "https://phet.colorado.edu/en/simulations/equality-explorer",
  },
  {
    id: "graphing-lines", level: "lower-secondary", symbol: "↗",
    title: { en: "Graphing Lines", km: "ក្រាបបន្ទាត់ត្រង់" },
    description: { en: "Change a linear equation and observe how its line changes.", km: "ផ្លាស់ប្តូរសមីការបន្ទាត់ត្រង់ ហើយសង្កេតមើលការផ្លាស់ប្តូររបស់ក្រាប។" },
    activity: { en: "Change the slope, then the intercept. Describe how each change moves the line.", km: "ប្តូរមេគុណប្រាប់ទិស រួចប្តូរចំណុចកាត់អ័ក្សបញ្ឈរ។ ពិពណ៌នាឥទ្ធិពលរបស់ការប្តូរនីមួយៗលើបន្ទាត់។" },
    url: "https://phet.colorado.edu/en/simulations/graphing-lines",
  },
  {
    id: "graphing-quadratics", level: "upper-secondary", symbol: "x²",
    title: { en: "Graphing Quadratics", km: "ក្រាបអនុគមន៍ដឺក្រេទី២" },
    description: { en: "Change the coefficients of a quadratic and explore its parabola, vertex, and roots.", km: "ផ្លាស់ប្តូរមេគុណនៃអនុគមន៍ដឺក្រេទី២ ហើយស្វែងយល់ពីប៉ារ៉ាបូល កំពូល និងឫសរបស់វា។" },
    activity: { en: "Change one coefficient at a time. Predict how the parabola will change before trying it.", km: "ប្តូរមេគុណមួយម្តងៗ។ ទស្សន៍ទាយការផ្លាស់ប្តូររបស់ប៉ារ៉ាបូល មុនពេលសាកល្បង។" },
    url: "https://phet.colorado.edu/en/simulations/graphing-quadratics",
  },
  {
    id: "calculus-grapher", level: "upper-secondary", symbol: "∫", advanced: true,
    title: { en: "Calculus Grapher", km: "ដេរីវេ និងអាំងតេក្រាល" },
    description: { en: "Connect a function's graph with its derivative and integral through slope and signed area.", km: "ស្វែងយល់ពីទំនាក់ទំនងរវាងក្រាបអនុគមន៍ ដេរីវេ និងអាំងតេក្រាល តាមមេគុណប្រាប់ទិស និងផ្ទៃក្រឡាដែលគិតសញ្ញា។" },
    activity: { en: "Compare rising and falling parts of a function with the sign of its derivative.", km: "ប្រៀបធៀបផ្នែកកើន និងចុះនៃអនុគមន៍ ជាមួយសញ្ញារបស់ដេរីវេ។" },
    url: "https://phet.colorado.edu/en/simulations/calculus-grapher",
  },
];

export const phetMathLinks = {
  khmer: "https://phet.colorado.edu/en/simulations/filter?locale=km&type=html",
  offline: "https://phet.colorado.edu/en/offline-access",
  attribution: "https://phet.colorado.edu/en/licensing",
  home: "https://phet.colorado.edu/",
} as const;
