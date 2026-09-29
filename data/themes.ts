export const themePresets = [
  { id: "cyberpunk", en: "Cyberpunk Neon", km: "សាយប័រផាំង នីអុង", background: "#0b1329", color: "#38bdf8", mode: "dark" },
  { id: "dracula", en: "Dracula", km: "ដ្រាគូឡា", background: "#282a36", color: "#ff79c6", mode: "dark" },
  { id: "nord", en: "Nord Frost", km: "ន័រដ ទឹកកក", background: "#2e3440", color: "#88c0d0", mode: "dark" },
  { id: "matrix", en: "Matrix Code", km: "ម៉ាទ្រីក កូដ", background: "#050805", color: "#22c55e", mode: "dark" },
  { id: "synthwave", en: "Synthwave 84", km: "ស៊ីនថ្វេវ ៨៤", background: "#1a103c", color: "#ec4899", mode: "dark" },
  { id: "solarized", en: "Solarized Dusk", km: "សូឡារ៉ាយ ព្រលប់", background: "#002b36", color: "#2aa198", mode: "dark" },
  { id: "sepia", en: "Warm Sepia", km: "សេព្យា កក់ក្តៅ", background: "#fbf0d9", color: "#a16207", mode: "light" },
  { id: "light", en: "Clean Light", km: "ពន្លឺស្រស់ស្អាត", background: "#ffffff", color: "#0369a1", mode: "light" },
] as const;

export const rainbowAccents = [
  { id: "red", letter: "R", en: "Crimson / Red", km: "ក្រហម", color: "#ef4444" },
  { id: "orange", letter: "O", en: "Sunset / Orange", km: "ទឹកក្រូច", color: "#f97316" },
  { id: "yellow", letter: "Y", en: "Solar Gold / Yellow", km: "លឿង", color: "#eab308" },
  { id: "green", letter: "G", en: "Emerald / Green", km: "បៃតង", color: "#22c55e" },
  { id: "blue", letter: "B", en: "Ocean Sky / Blue", km: "ខៀវ", color: "#0284c7" },
  { id: "indigo", letter: "I", en: "Deep Royal / Indigo", km: "អាំងឌីហ្គោ", color: "#6366f1" },
  { id: "violet", letter: "V", en: "Vivid Purple / Violet", km: "ស្វាយ", color: "#a855f7" },
] as const;

export type ThemeId = (typeof themePresets)[number]["id"];
export type AccentId = "default" | (typeof rainbowAccents)[number]["id"];

export function themeColor(theme: ThemeId, accent: AccentId) {
  return rainbowAccents.find((item) => item.id === accent)?.color ??
    themePresets.find((item) => item.id === theme)?.color ?? "#38bdf8";
}
