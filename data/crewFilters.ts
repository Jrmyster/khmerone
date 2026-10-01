import type { LocalizedText } from "@/types/app";
import type { CrewInterestGroup } from "@/types/engagement";

// Independent of the current crew concepts: locations without groups remain selectable.
// Khmer place names checked against the NCDD Cambodia Gazetteer.
export const crewProvinces: { id: string; label: LocalizedText }[] = [
  { id: "phnom-penh", label: { en: "Phnom Penh", km: "ភ្នំពេញ" } },
  { id: "banteay-meanchey", label: { en: "Banteay Meanchey", km: "បន្ទាយមានជ័យ" } },
  { id: "battambang", label: { en: "Battambang", km: "បាត់ដំបង" } },
  { id: "kampong-cham", label: { en: "Kampong Cham", km: "កំពង់ចាម" } },
  { id: "kampong-chhnang", label: { en: "Kampong Chhnang", km: "កំពង់ឆ្នាំង" } },
  { id: "kampong-speu", label: { en: "Kampong Speu", km: "កំពង់ស្ពឺ" } },
  { id: "kampong-thom", label: { en: "Kampong Thom", km: "កំពង់ធំ" } },
  { id: "kampot", label: { en: "Kampot", km: "កំពត" } },
  { id: "kandal", label: { en: "Kandal", km: "កណ្ដាល" } },
  { id: "koh-kong", label: { en: "Koh Kong", km: "កោះកុង" } },
  { id: "kratie", label: { en: "Kratié", km: "ក្រចេះ" } },
  { id: "mondulkiri", label: { en: "Mondulkiri", km: "មណ្ឌលគិរី" } },
  { id: "oddar-meanchey", label: { en: "Oddar Meanchey", km: "ឧត្ដរមានជ័យ" } },
  { id: "pailin", label: { en: "Pailin", km: "ប៉ៃលិន" } },
  { id: "preah-sihanouk", label: { en: "Preah Sihanouk", km: "ព្រះសីហនុ" } },
  { id: "preah-vihear", label: { en: "Preah Vihear", km: "ព្រះវិហារ" } },
  { id: "pursat", label: { en: "Pursat", km: "ពោធិ៍សាត់" } },
  { id: "prey-veng", label: { en: "Prey Veng", km: "ព្រៃវែង" } },
  { id: "ratanakiri", label: { en: "Ratanakiri", km: "រតនគិរី" } },
  { id: "siem-reap", label: { en: "Siem Reap", km: "សៀមរាប" } },
  { id: "stung-treng", label: { en: "Stung Treng", km: "ស្ទឹងត្រែង" } },
  { id: "svay-rieng", label: { en: "Svay Rieng", km: "ស្វាយរៀង" } },
  { id: "takeo", label: { en: "Takéo", km: "តាកែវ" } },
  { id: "kep", label: { en: "Kep", km: "កែប" } },
  { id: "tboung-khmum", label: { en: "Tboung Khmum", km: "ត្បូងឃ្មុំ" } },
];

export const crewInterestGroups: CrewInterestGroup[] = [
  { id: "science", label: { en: "STEM & Science", km: "ស្ទែម និងវិទ្យាសាស្ត្រ" }, interests: [
    { id: "physics", label: { en: "Physics", km: "រូបវិទ្យា" } },
    { id: "chemistry", label: { en: "Chemistry", km: "គីមីវិទ្យា" } },
    { id: "biology", label: { en: "Biology", km: "ជីវវិទ្យា" } },
    { id: "mathematics", label: { en: "Mathematics", km: "គណិតវិទ្យា" } },
    { id: "environmental-science", label: { en: "Environmental Science", km: "វិទ្យាសាស្ត្របរិស្ថាន" } },
  ] },
  { id: "technology", label: { en: "Technology & Innovation", km: "បច្ចេកវិទ្យា និងនវានុវត្តន៍" }, interests: [
    { id: "web-development", label: { en: "Web Development", km: "ការអភិវឌ្ឍគេហទំព័រ" } },
    { id: "robotics-drones", label: { en: "Robotics & Drones", km: "មនុស្សយន្ត និងដ្រូន" } },
    { id: "ai-coding", label: { en: "AI & Coding", km: "បញ្ញាសិប្បនិម្មិត និងការសរសេរកូដ" } },
    { id: "frugal-engineering", label: { en: "Frugal Engineering", km: "វិស្វកម្មចំណាយទាប" } },
  ] },
  { id: "languages", label: { en: "Languages & Communication", km: "ភាសា និងទំនាក់ទំនង" }, interests: [
    { id: "english-conversation", label: { en: "English Conversation", km: "ការសន្ទនាភាសាអង់គ្លេស" } },
    { id: "public-speaking", label: { en: "Public Speaking", km: "ការនិយាយជាសាធារណៈ" } },
    { id: "khmer-literature", label: { en: "Khmer Literature", km: "អក្សរសាស្ត្រខ្មែរ" } },
  ] },
  { id: "arts", label: { en: "Creative & Arts", km: "ការច្នៃប្រឌិត និងសិល្បៈ" }, interests: [
    { id: "digital-art-design", label: { en: "Digital Art & Design", km: "សិល្បៈឌីជីថល និងការរចនា" } },
    { id: "video-media", label: { en: "Video & Media", km: "វីដេអូ និងមេឌៀ" } },
    { id: "music-production", label: { en: "Music Production", km: "ការផលិតតន្ត្រី" } },
  ] },
  { id: "community", label: { en: "Community & Practical", km: "សហគមន៍ និងជំនាញអនុវត្ត" }, interests: [
    { id: "sustainable-agriculture", label: { en: "Sustainable Agriculture", km: "កសិកម្មប្រកបដោយចីរភាព" } },
    { id: "health-hygiene", label: { en: "Health & Hygiene", km: "សុខភាព និងអនាម័យ" } },
    { id: "life-skills", label: { en: "Life Skills", km: "ជំនាញជីវិត" } },
    { id: "sports", label: { en: "Sports", km: "កីឡា" } },
  ] },
];
