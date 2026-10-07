"use client";

import { BookOpenText, ExternalLink, FileText } from "lucide-react";
import { apps } from "@/data/apps";
import type { Locale } from "@/types/app";

const copy = {
  en: {
    label: "HISTORY & CULTURE · FREE READING GUIDE",
    detail: "From early communities and Angkor to modern Cambodia: discover the rulers, beliefs, innovations, and daily lives that shaped Khmer civilization.",
    edition: "English edition · 55 pages · 11 historical eras",
    open: "Explore the history guide",
    pdf: "Read the PDF",
    newTab: "Opens in a new tab",
  },
  km: {
    label: "ប្រវត្តិសាស្ត្រ និងវប្បធម៌ · មគ្គុទ្ទេសក៍អានឥតគិតថ្លៃ",
    detail: "ពីសហគមន៍ដំបូង និងអង្គរដល់កម្ពុជាសម័យទំនើប៖ ស្វែងយល់អំពីអ្នកដឹកនាំ ជំនឿ ការច្នៃប្រឌិត និងជីវិតប្រចាំថ្ងៃដែលបានកសាងអរិយធម៌ខ្មែរ។",
    edition: "ឯកសារជាភាសាអង់គ្លេស · ៥៥ ទំព័រ · សម័យប្រវត្តិសាស្ត្រទាំង ១១",
    open: "ស្វែងយល់មគ្គុទ្ទេសក៍ប្រវត្តិសាស្ត្រ",
    pdf: "អានឯកសារ PDF",
    newTab: "បើកក្នុងផ្ទាំងថ្មី",
  },
};

export function KhmerHistoryGuideCard({ locale, onExploreApp }: {
  locale: Locale;
  onExploreApp: (id: string) => void;
}) {
  const guide = apps.find((app) => app.id === "khmer-history-guide");
  if (!guide?.url) return null;
  const t = copy[locale];
  const pdfUrl = new URL("Cambodia-and-Khmer-Culture-Historical-Guide.pdf", guide.url).href;

  return <section id="khmer-history-guide" className="history-guide wrap" aria-labelledby="history-guide-title">
    <article className="pathway-card history-guide-card">
      <div className="history-guide-copy">
        <div className="pathway-top"><span className="pathway-icon"><BookOpenText size={24} aria-hidden="true" /></span><span className="pathway-index">{t.label}</span></div>
        <h2 id="history-guide-title">{guide.title[locale]}</h2>
        <p className="pathway-promise">{t.detail}</p>
        <p className="history-guide-edition">{t.edition}</p>
      </div>
      <div className="history-guide-actions">
        <a className="launch-button" href={guide.url} target="_blank" rel="noopener noreferrer" onClick={() => onExploreApp(guide.id)} aria-label={`${t.open}. ${t.newTab}`}>
          {t.open}<ExternalLink size={17} aria-hidden="true" />
        </a>
        <a className="pathway-resource" href={pdfUrl} target="_blank" rel="noopener noreferrer" onClick={() => onExploreApp(guide.id)} aria-label={`${t.pdf}. ${t.newTab}`}>
          <FileText size={17} aria-hidden="true" />{t.pdf}<ExternalLink size={15} aria-hidden="true" />
        </a>
      </div>
    </article>
  </section>;
}
