"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { BookOpenText, ExternalLink, Play, X } from "lucide-react";
import type { Locale } from "@/types/app";

const TRAILER_URL = "https://www.youtube.com/watch?v=pWr0ucHnT3o";

const copy = {
  en: {
    label: "Cambodia Tomorrow preview", genre: "ENGINEERING SCI-FI", soon: "COMING SOON",
    title: "Cambodia Tomorrow", teaser: "Four student engineers. One city's future.",
    watch: "Watch trailer", lore: "Blueprints & lore", dismiss: "Dismiss movie preview",
    storyTitle: "Phnom Penh, 2061", story: "A grid anomaly puts the city's automated flood gates and power distribution at risk. Four classmates combine engineering, CAD design and programming to protect the place they call home.",
    city: "The city", cityText: "Bio-mesh energy, solar sky-bridges, river turbines and AI-assisted planning shape a greener Phnom Penh.",
    team: "The four engineers", srey: "Srey — eco-engineer of bio-mesh lines and vertical gardens.", dara: "Dara — kinetic gadget builder and energy-cell specialist.", sovan: "Sovan — architect of maintenance and surveying drone fleets.", kosal: "Kosal — strategist decoding holographic transport blueprints.",
    close: "Close story", posterAlt: "Illustration of four student engineers overlooking a future Phnom Penh at twilight",
  },
  km: {
    label: "ការណែនាំរឿង កម្ពុជាថ្ងៃស្អែក", genre: "វិទ្យាសាស្ត្រ និងវិស្វកម្ម", soon: "នឹងមកដល់ឆាប់ៗ",
    title: "កម្ពុជាថ្ងៃស្អែក", teaser: "វិស្វករសិស្សបួននាក់។ អនាគតទីក្រុងមួយ។",
    watch: "មើលឈុតណែនាំ", lore: "គម្រោង និងសាច់រឿង", dismiss: "បិទផ្ទាំងណែនាំរឿង",
    storyTitle: "ភ្នំពេញ ឆ្នាំ ២០៦១", story: "បញ្ហាបណ្ដាញថាមពលមួយគំរាមកំហែងទ្វារការពារទឹកជំនន់ស្វ័យប្រវត្តិ និងការចែកចាយអគ្គិសនី។ មិត្តរួមថ្នាក់បួននាក់ប្រើជំនាញវិស្វកម្ម គំនូរបច្ចេកទេស និងកម្មវិធីកុំព្យូទ័រ ដើម្បីការពារទីក្រុងរបស់ពួកគេ។",
    city: "ទីក្រុង", cityText: "បណ្ដាញថាមពលជីវៈ ស្ពានអាកាសសូឡា ទួរប៊ីនតាមដងទន្លេ និងផែនការជំនួយដោយ AI បង្កើតភ្នំពេញបៃតងជាងមុន។",
    team: "វិស្វករទាំងបួន", srey: "ស្រី — វិស្វករបរិស្ថាន បង្កើតបណ្ដាញថាមពលជីវៈ និងសួនបញ្ឈរ។", dara: "ដារ៉ា — អ្នកបង្កើតឧបករណ៍ចលនា និងកោសិកាថាមពល។", sovan: "សុវណ្ណ — អ្នករចនាកងដ្រូនត្រួតពិនិត្យ និងថែទាំទីក្រុង។", kosal: "កុសល — អ្នករៀបផែនការ និងអានគម្រោងដឹកជញ្ជូនហូឡូក្រាម។",
    close: "បិទសាច់រឿង", posterAlt: "រូបគំនូរសិស្សវិស្វករបួននាក់មើលទីក្រុងភ្នំពេញអនាគតនៅពេលល្ងាច",
  },
};

export function CambodiaTomorrowBanner({ locale, onDismiss }: { locale: Locale; onDismiss: () => void }) {
  const [loreOpened, setLoreOpened] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const t = copy[locale];

  const openLore = () => {
    setLoreOpened(true);
    dialogRef.current?.showModal();
  };

  return <>
    <aside className="movie-promo fixed bottom-0 left-0 right-0 z-40" aria-label={t.label}>
      <div className="movie-promo-inner">
        <div className="movie-poster" aria-hidden="true">
          <Image src="/cambodia-tomorrow-320.webp" alt="" width={320} height={480} unoptimized />
          <div className="movie-poster-grid" /><div className="movie-poster-wire" />
          <svg className="movie-poster-holo" viewBox="0 0 80 56" fill="none" stroke="currentColor" strokeWidth=".7" aria-hidden="true"><ellipse cx="40" cy="44" rx="33" ry="10" /><path d="M7 44V30l33-18 33 18v14M7 30l33 16 33-16M40 12v34M23 21v17m34-17v17M7 44l33 10 33-10" /><path d="M7 30l66 14M73 30L7 44" opacity=".6" /></svg>
          <div className="movie-poster-scan" />
          <span className="movie-poster-year">PHNOM PENH<br /><strong>2061</strong></span>
        </div>
        <div className="movie-promo-copy">
          <div className="movie-promo-kickers"><span>{t.genre}</span><span>{t.soon}</span></div>
          <h2><span>{copy.km.title}</span><span className="movie-title-en">{copy.en.title}</span></h2>
          <p>{t.teaser}</p>
        </div>
        <div className="movie-promo-actions">
          <a className="movie-watch" href={TRAILER_URL} target="_blank" rel="noopener noreferrer"><Play size={16} fill="currentColor" aria-hidden="true" />{t.watch}<ExternalLink size={13} aria-hidden="true" /></a>
          <button className="movie-lore-button" type="button" onClick={openLore}><BookOpenText size={16} aria-hidden="true" />{t.lore}</button>
        </div>
        <button className="movie-dismiss" type="button" aria-label={t.dismiss} title={t.dismiss} onClick={onDismiss}><X size={18} /></button>
      </div>
    </aside>

    <dialog className="movie-dialog" ref={dialogRef} aria-labelledby="movie-dialog-title" onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}>
      <button className="movie-dialog-close" type="button" aria-label={t.close} onClick={() => dialogRef.current?.close()}><X size={20} /></button>
      <div className="movie-dialog-art">{loreOpened && <Image src="/cambodia-tomorrow-800.webp" alt={t.posterAlt} width={800} height={1200} loading="lazy" unoptimized />}</div>
      <div className="movie-dialog-content"><span className="section-index">{t.genre} / 2061</span><h2 id="movie-dialog-title">{t.title}</h2><h3>{t.storyTitle}</h3><p>{t.story}</p><h3>{t.city}</h3><p>{t.cityText}</p><h3>{t.team}</h3><ul><li>{t.srey}</li><li>{t.dara}</li><li>{t.sovan}</li><li>{t.kosal}</li></ul><a href={TRAILER_URL} target="_blank" rel="noopener noreferrer" className="movie-watch"><Play size={16} fill="currentColor" aria-hidden="true" />{t.watch}</a></div>
    </dialog>
  </>;
}
