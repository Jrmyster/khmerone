"use client";

import { useState } from "react";
import { Compass, MapPin, Users } from "lucide-react";
import { crewConcepts, pathways } from "@/data/engagement";
import { crewInterestGroups, crewProvinces } from "@/data/crewFilters";
import type { Locale } from "@/types/app";
import type { CrewInterestId } from "@/types/engagement";

const copy = {
  en: { index: "02 / FIND YOUR CREW", title: "Build with people near you.", intro: "Explore proposed skill circles and the projects they could make together.", province: "All provinces", interest: "All interests", concept: "Crew concept", project: "Project idea", save: "Save interest", saved: "Interested ✓", empty: "No crew concepts match these filters.", note: "These are proposed groups, not live memberships. Your choice stays on this device; moderated connections are planned for a future release." },
  km: { index: "០២ / ស្វែងរកក្រុមរបស់អ្នក", title: "បង្កើតអ្វីថ្មីជាមួយមនុស្សនៅក្បែរអ្នក។", intro: "ស្វែងយល់ពីគំនិតក្រុមជំនាញ និងគម្រោងដែលអាចធ្វើរួមគ្នា។", province: "គ្រប់ខេត្តក្រុង", interest: "គ្រប់ជំនាញ", concept: "គំនិតក្រុម", project: "គំនិតគម្រោង", save: "រក្សាទុកចំណាប់អារម្មណ៍", saved: "បានរក្សាទុក ✓", empty: "មិនមានគំនិតក្រុមត្រូវនឹងតម្រងទេ។", note: "ទាំងនេះជាគំនិតក្រុម មិនទាន់ជាសមាជិកភាពពិតទេ។ ជម្រើសរបស់អ្នករក្សាទុកលើឧបករណ៍នេះ។ ការភ្ជាប់ក្រុមដែលមានការគ្រប់គ្រងគ្រោងសម្រាប់ពេលក្រោយ។" },
};

const moderationNote = {
  en: "Note: Proposed skill circles and student groups are moderated to ensure safety and community standards. Additional groups and specialized subjects will be made available for creation in future updates.",
  km: "ចំណាំ៖ ក្រុម និងរង្វង់ជំនាញដែលបានស្នើឡើងទាំងអស់ត្រូវពិនិត្យ និងសម្រួលដើម្បីធានាសុវត្ថិភាព។ ក្រុម និងមុខវិជ្ជាថ្មីៗនឹងត្រូវបានបន្ថែមនៅក្នុងការអាប់ដេតនាពេលខាងមុខ។",
};

export function CrewDirectory({ locale, selectedId, onSelect }: { locale: Locale; selectedId: string | null; onSelect: (id: string) => void }) {
  const [province, setProvince] = useState("all");
  const [interest, setInterest] = useState<CrewInterestId | "all">("all");
  const t = copy[locale];
  const visible = crewConcepts.filter((crew) => (province === "all" || crew.provinceId === province) && (interest === "all" || crew.interests.includes(interest)));

  return <section id="crew-directory" className="crew-directory wrap" aria-labelledby="crew-title">
    <div className="crew-header"><div><span className="section-index">{t.index}</span><h2 id="crew-title">{t.title}</h2><p>{t.intro}</p></div><span className="crew-emblem"><Users size={24} aria-hidden="true" /></span></div>
    <div className="crew-filters">
      <label><MapPin size={17} aria-hidden="true" /><select aria-label={t.province} aria-describedby="crew-moderation-note" value={province} onChange={(event) => setProvince(event.target.value)}><option value="all">{t.province}</option>{crewProvinces.map((item) => <option key={item.id} value={item.id}>{item.label[locale]}</option>)}</select></label>
      <label><Compass size={17} aria-hidden="true" /><select aria-label={t.interest} aria-describedby="crew-moderation-note" value={interest} onChange={(event) => setInterest(event.target.value as CrewInterestId | "all")}><option value="all">{t.interest}</option>{crewInterestGroups.map((group) => <optgroup key={group.id} label={group.label[locale]}>{group.interests.map((item) => <option key={item.id} value={item.id}>{item.label[locale]}</option>)}</optgroup>)}</select></label>
    </div>
    <p id="crew-moderation-note" className="crew-moderation-note">{moderationNote[locale]}</p>
    {visible.length ? <div className="crew-grid">{visible.map((crew) => {
      const interestName = pathways.find((pathway) => pathway.id === crew.interest)?.title[locale];
      const selected = selectedId === crew.id;
      return <article id={`crew-${crew.id}`} className={`crew-card ${selected ? "crew-selected" : ""}`} key={crew.id}>
        <div className="crew-card-top"><span className="crew-concept">{t.concept}</span><span className="crew-province"><MapPin size={13} aria-hidden="true" />{crew.province[locale]}</span></div>
        <h3>{crew.title[locale]}</h3><span className="crew-interest">{interestName}</span>
        <p><strong>{t.project}:</strong> {crew.project[locale]}</p>
        <button type="button" aria-pressed={selected} onClick={() => onSelect(crew.id)}>{selected ? t.saved : t.save}</button>
      </article>;
    })}</div> : <p className="crew-empty" role="status">{t.empty}</p>}
    <p className="crew-note">{t.note}</p>
  </section>;
}
