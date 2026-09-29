import { Heart, Sparkles } from "lucide-react";
import type { Locale } from "@/types/app";

const copy = {
  en: {
    title: "Support KhmerOne Educational Mission",
    body: "KhmerOne is dedicated to creating free, accessible, and offline-ready educational tools for Cambodian students and teachers. Your support helps keep these platforms online and updated.",
    status: "💖 Donation Links Coming Soon",
  },
  km: {
    title: "ចូលរួមគាំទ្របេសកកម្មអប់រំ KhmerOne",
    body: "KhmerOne ប្តេជ្ញាបង្កើតឧបករណ៍សិក្សាដោយឥតគិតថ្លៃ និងអាចប្រើប្រាស់បានដោយគ្មានអ៊ីនធឺណិត សម្រាប់សិស្សនិងគ្រូបង្រៀននៅកម្ពុជា។ ការឧបត្ថម្ភរបស់លោកអ្នកជួយឱ្យវេទិកានេះបន្តដំណើរការ និងអភិវឌ្ឍជាបន្តបន្ទាប់។",
    status: "💖 តំណភ្ជាប់ឧបត្ថម្ភនឹងមានក្នុងពេលឆាប់ៗនេះ",
  },
};

export function DonationNotice({ locale }: { locale: Locale }) {
  const t = copy[locale];

  return <section className="donation-section wrap" aria-labelledby="donation-title">
    <div className="donation-card">
      <div className="donation-heart" aria-hidden="true"><Heart size={25} fill="rgba(236,72,153,.18)" /></div>
      <h2 id="donation-title">{t.title}</h2>
      <p>{t.body}</p>
      <span className="donation-status"><Sparkles size={17} aria-hidden="true" /><span>{t.status}</span></span>
    </div>
  </section>;
}
