"use client";

import { useEffect, useState } from "react";
import { Sparkles, X } from "lucide-react";
import type { Locale } from "@/types/app";

const STORAGE_KEY = "khmerone_future_note_dismissed";

const copy = {
  en: {
    badge: "⚡ A Note on the Future & Technological Change",
    title: "Learning in the Era of Superintelligence",
    body: "We are entering a period where artificial superintelligence and rapid technological shifts will transform human society faster than ever before. In an accelerating world, the ability to learn, adapt, and think critically is our most vital capability. KhmerOne is built to keep learning tools accessible, offline-ready, and empowering for everyone.",
    dismiss: "Dismiss future perspective note",
  },
  km: {
    badge: "⚡ កំណត់ចំណាំអំពីអនាគត និងការប្រែប្រួលបច្ចេកវិទ្យា",
    title: "ការរៀនសូត្រក្នុងយុគសម័យបញ្ញាសិប្បនិម្មិតកម្រិតខ្ពស់",
    body: "យើងកំពុងឈានចូលដល់យុគសម័យដែលបញ្ញាសិប្បនិម្មិតកម្រិតខ្ពស់ (Superintelligence) និងការប្រែប្រួលបច្ចេកវិទ្យាយ៉ាងរហ័ស នឹងផ្លាស់ប្តូរពិភពលោកក្នុងល្បឿនដែលមិនធ្លាប់មានពីមុនមក។ ក្នុងពិភពលោកដែលវិវឌ្ឍយ៉ាងលឿននេះ សមត្ថភាពក្នុងការរៀនសូត្រ ការបត់បែន និងការគិតពិចារណា គឺជាជំនាញសំខាន់បំផុតរបស់យើង។ KhmerOne ត្រូវបានបង្កើតឡើងដើម្បីផ្តល់ឧបករណ៍សិក្សាដែលងាយស្រួលប្រើប្រាស់ និងអាចប្រើបានទោះគ្មានអ៊ីនធឺណិត សម្រាប់មនុស្សគ្រប់រូប។",
    dismiss: "បិទកំណត់ចំណាំអំពីអនាគត",
  },
};

export function FuturePerspectiveBanner({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const t = copy[locale];

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try { setVisible(localStorage.getItem(STORAGE_KEY) !== "true"); }
      catch { setVisible(true); }
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const dismiss = () => {
    setVisible(false);
    try { localStorage.setItem(STORAGE_KEY, "true"); } catch {}
  };

  if (!visible) return null;

  return <section className="future-note-section wrap" aria-labelledby="future-note-title">
    <div className="future-note-card">
      <span className="future-note-icon" aria-hidden="true"><Sparkles size={22} /></span>
      <div className="future-note-copy">
        <span className="future-note-badge">{t.badge}</span>
        <h2 id="future-note-title">{t.title}</h2>
        <p>{t.body}</p>
      </div>
      <button className="future-note-dismiss" type="button" onClick={dismiss} aria-label={t.dismiss} title={t.dismiss}><X size={18} aria-hidden="true" /></button>
    </div>
  </section>;
}
