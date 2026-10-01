import { ArrowUpRight, HeartPulse, Send } from "lucide-react";
import type { Locale } from "@/types/app";
import "./dengue-health-notice.css";

export const DENGUE_TELEGRAM_URL = "https://t.me/kh_dengue_bot";

const copy = {
  en: {
    badge: "Health check",
    heading: "Feeling sick or running a high fever?",
    body: "Check your symptoms early with our bilingual Dengue Triage Bot on Telegram for instant guidance and local health recommendations.",
    action: "Open Dengue Triage Bot",
    newTab: "Opens Telegram in a new tab",
    note: "Information only. This bot does not diagnose dengue or replace a licensed doctor.",
  },
  km: {
    badge: "ពិនិត្យសុខភាព",
    heading: "តើអ្នកមានអារម្មណ៍មិនស្រួលខ្លួន ឬមានកម្តៅក្តៅខ្លួនមែនទេ?",
    body: "ពិនិត្យរោគសញ្ញារបស់អ្នកជាមុនជាមួយ Telegram Bot វាយតម្លៃជំងឺគ្រុនឈាមទ្វេភាសា សម្រាប់ព័ត៌មានណែនាំរហ័ស។",
    action: "បើក Dengue Triage Bot",
    newTab: "បើក Telegram ក្នុងផ្ទាំងថ្មី",
    note: "សម្រាប់ព័ត៌មានប៉ុណ្ណោះ។ Bot នេះមិនអាចធ្វើរោគវិនិច្ឆ័យជំងឺគ្រុនឈាម ឬជំនួសវេជ្ជបណ្ឌិតដែលមានអាជ្ញាបណ្ណបានទេ។",
  },
};

export function DengueHealthNotice({ locale }: { locale: Locale }) {
  const t = copy[locale];
  return <section className="dengue-notice wrap" aria-labelledby="dengue-notice-title" lang={locale === "km" ? "km" : "en"}>
    <div className="dengue-notice-card">
      <span className="dengue-notice-icon" aria-hidden="true"><HeartPulse size={26} /></span>
      <div className="dengue-notice-copy">
        <span className="dengue-notice-badge">{t.badge}</span>
        <h2 id="dengue-notice-title">{t.heading}</h2>
        <p>{t.body}</p>
        <p className="dengue-notice-note">{t.note}</p>
      </div>
      <a className="dengue-notice-link" href={DENGUE_TELEGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label={`${t.action}. ${t.newTab}`}>
        <Send size={19} aria-hidden="true" /><span>{t.action}</span><ArrowUpRight size={18} aria-hidden="true" />
      </a>
    </div>
  </section>;
}
