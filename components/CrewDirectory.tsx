"use client";

import { useMemo, useState } from "react";
import { Compass, MapPin, Users } from "lucide-react";
import { crewConcepts, pathways } from "@/data/engagement";
import type { Locale } from "@/types/app";
import type { PathwayId } from "@/types/engagement";

const copy = {
  en: { index: "02 / FIND YOUR CREW", title: "Build with people near you.", intro: "Explore proposed skill circles and the projects they could make together.", province: "All provinces", interest: "All interests", concept: "Crew concept", project: "Project idea", save: "Save interest", saved: "Interested ✓", empty: "No crew concepts match these filters.", note: "These are proposed groups, not live memberships. Your choice stays on this device; moderated connections are planned for a future release." },
  km: { index: "០២ / ស្វែងរកក្រុមរបស់អ្នក", title: "បង្កើតអ្វីថ្មីជាមួយមនុស្សនៅក្បែរអ្នក។", intro: "ស្វែងយល់ពីគំនិតក្រុមជំនាញ និងគម្រោងដែលអាចធ្វើរួមគ្នា។", province: "គ្រប់ខេត្តក្រុង", interest: "គ្រប់ជំនាញ", concept: "គំនិតក្រុម", project: "គំនិតគម្រោង", save: "រក្សាទុកចំណាប់អារម្មណ៍", saved: "បានរក្សាទុក ✓", empty: "មិនមានគំនិតក្រុមត្រូវនឹងតម្រងទេ។", note: "ទាំងនេះជាគំនិតក្រុម មិនទាន់ជាសមាជិកភាពពិតទេ។ ជម្រើសរបស់អ្នករក្សាទុកលើឧបករណ៍នេះ។ ការភ្ជាប់ក្រុមដែលមានការគ្រប់គ្រងគ្រោងសម្រាប់ពេលក្រោយ។" },
};

export function CrewDirectory({ locale, selectedId, onSelect }: { locale: Locale; selectedId: string | null; onSelect: (id: string) => void }) {
  const [province, setProvince] = useState("all");
  const [interest, setInterest] = useState<PathwayId | "all">("all");
  const t = copy[locale];
  const provinces = useMemo(() => crewConcepts.map((crew) => ({ id: crew.provinceId, label: crew.province[locale] })), [locale]);
  const visible = crewConcepts.filter((crew) => (province === "all" || crew.provinceId === province) && (interest === "all" || crew.interest === interest));

  return <section id="crew-directory" className="crew-directory wrap" aria-labelledby="crew-title">
    <div className="crew-header"><div><span className="section-index">{t.index}</span><h2 id="crew-title">{t.title}</h2><p>{t.intro}</p></div><span className="crew-emblem"><Users size={24} aria-hidden="true" /></span></div>
    <div className="crew-filters">
      <label><MapPin size={17} aria-hidden="true" /><select aria-label={t.province} value={province} onChange={(event) => setProvince(event.target.value)}><option value="all">{t.province}</option>{provinces.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}</select></label>
      <label><Compass size={17} aria-hidden="true" /><select aria-label={t.interest} value={interest} onChange={(event) => setInterest(event.target.value as PathwayId | "all")}><option value="all">{t.interest}</option>{pathways.map((pathway) => <option key={pathway.id} value={pathway.id}>{pathway.title[locale]}</option>)}</select></label>
    </div>
    {visible.length ? <div className="crew-grid">{visible.map((crew) => {
      const interestName = pathways.find((pathway) => pathway.id === crew.interest)?.title[locale];
      const selected = selectedId === crew.id;
      return <article className={`crew-card ${selected ? "crew-selected" : ""}`} key={crew.id}>
        <div className="crew-card-top"><span className="crew-concept">{t.concept}</span><span className="crew-province"><MapPin size={13} aria-hidden="true" />{crew.province[locale]}</span></div>
        <h3>{crew.title[locale]}</h3><span className="crew-interest">{interestName}</span>
        <p><strong>{t.project}:</strong> {crew.project[locale]}</p>
        <button type="button" aria-pressed={selected} onClick={() => onSelect(crew.id)}>{selected ? t.saved : t.save}</button>
      </article>;
    })}</div> : <p className="crew-empty">{t.empty}</p>}
    <p className="crew-note">{t.note}</p>
  </section>;
}
