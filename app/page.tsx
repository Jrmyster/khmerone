"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Baby, BookOpenText, Check, Coins, Globe2, GraduationCap, HeartPulse, Languages, Moon, Search, SlidersHorizontal, Sun, WifiOff, X, type LucideIcon } from "lucide-react";
import { apps, gradeLabels } from "@/data/apps";
import { AppCategory, type AppEntry, type FilterKey, type GradeLevel, type Locale } from "@/types/app";
import { KhmerOneBar } from "@/components/KhmerOneBar";

const icons: Record<AppEntry["icon"], LucideIcon> = {
  school: GraduationCap, anatomy: HeartPulse, finance: Coins, language: Languages,
  baby: Baby, world: Globe2, peace: BookOpenText,
};

const filters: { key: FilterKey; label: Record<Locale, string> }[] = [
  { key: "all", label: { en: "All", km: "ទាំងអស់" } },
  { key: AppCategory.Stem, label: { en: "STEM", km: "ស្ទែម" } },
  { key: AppCategory.Health, label: { en: "Health", km: "សុខភាព" } },
  { key: AppCategory.Languages, label: { en: "Languages", km: "ភាសា" } },
  { key: AppCategory.Finance, label: { en: "Financial literacy", km: "ហិរញ្ញវត្ថុ" } },
  { key: AppCategory.Simulations, label: { en: "Simulations", km: "ការក្លែងធ្វើ" } },
];

const copy = {
  en: {
    eyebrow: "LEARNING, CONNECTED", title: "One place to keep learning.",
    intro: "Find tools for classrooms, careers and curious minds across Cambodia.",
    search: "Search apps, topics or grade levels", searchLabel: "Search learning apps",
    clear: "Clear search", grade: "Any grade level", browse: "Explore the network",
    apps: "apps", app: "app", all: "All learning apps",
    empty: "No apps match your search.", reset: "Clear filters",
    offline: "Offline ready", launch: "Open app", pending: "Link pending",
    linkInfo: "A public link has not been added yet.",
    network: "Seven learning spaces. One starting point.",
    footer: "Learning should be easy to find, wherever you are.",
    theme: "Toggle dark mode", language: "Switch language",
  },
  km: {
    eyebrow: "ការសិក្សាដែលភ្ជាប់គ្នា", title: "កន្លែងតែមួយសម្រាប់បន្តការសិក្សា។",
    intro: "ស្វែងរកឧបករណ៍សម្រាប់ថ្នាក់រៀន អាជីព និងអ្នកចង់ដឹងនៅទូទាំងកម្ពុជា។",
    search: "ស្វែងរកកម្មវិធី ប្រធានបទ ឬកម្រិតថ្នាក់", searchLabel: "ស្វែងរកកម្មវិធីសិក្សា",
    clear: "លុបពាក្យស្វែងរក", grade: "គ្រប់កម្រិតថ្នាក់", browse: "ស្វែងយល់ពីបណ្ដាញ",
    apps: "កម្មវិធី", app: "កម្មវិធី", all: "កម្មវិធីសិក្សាទាំងអស់",
    empty: "រកមិនឃើញកម្មវិធីដែលត្រូវនឹងការស្វែងរកទេ។", reset: "លុបតម្រង",
    offline: "អាចប្រើក្រៅបណ្ដាញ", launch: "បើកកម្មវិធី", pending: "រង់ចាំតំណ",
    linkInfo: "មិនទាន់មានតំណសាធារណៈទេ។",
    network: "កន្លែងសិក្សាប្រាំពីរ។ ចាប់ផ្ដើមពីទីនេះ។",
    footer: "ការសិក្សាគួរតែងាយស្រួលស្វែងរក ទោះអ្នកនៅទីណាក៏ដោយ។",
    theme: "ប្ដូរពណ៌ផ្ទៃ", language: "ប្ដូរភាសា",
  },
};

function matchesFilter(app: AppEntry, filter: FilterKey) {
  return filter === "all" || app.category === filter ||
    (filter === AppCategory.Simulations && app.category === AppCategory.SocialStudies);
}

export default function Home() {
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [grade, setGrade] = useState<GradeLevel | "all">("all");

  useEffect(() => {
    const savedLocale = localStorage.getItem("khmerone-locale");
    const savedTheme = localStorage.getItem("khmerone-theme");
    const frame = requestAnimationFrame(() => {
      if (savedLocale === "km" || savedLocale === "en") setLocale(savedLocale);
      if (savedTheme === "dark" || savedTheme === "light") setTheme(savedTheme);
    });
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("khmerone-locale", locale);
    localStorage.setItem("khmerone-theme", theme);
  }, [locale, theme]);

  const t = copy[locale];
  const results = useMemo(() => {
    const words = query.normalize("NFKC").trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    return apps.filter((app) => {
      if (!matchesFilter(app, filter) || (grade !== "all" && !app.grades.includes(grade))) return false;
      const haystack = [app.title.en, app.title.km, app.tagline.en, app.tagline.km,
        app.description.en, app.description.km, app.categoryLabel.en, app.categoryLabel.km,
        app.audience.en, app.audience.km, ...app.features.flatMap((f) => [f.en, f.km]),
        ...app.grades.flatMap((g) => [gradeLabels[g].en, gradeLabels[g].km]),
      ].join(" ").normalize("NFKC").toLocaleLowerCase();
      return words.every((word) => haystack.includes(word));
    });
  }, [query, filter, grade]);

  const reset = () => { setQuery(""); setFilter("all"); setGrade("all"); };

  return <div className={`site-shell ${locale === "km" ? "khmer" : "english"}`}>
    <KhmerOneBar locale={locale} dark={theme === "dark"} homeUrl="/" />
    <header className="main-header wrap">
      <Link className="brand" href="/" aria-label="KhmerOne home"><span className="brand-mark" aria-hidden="true"><span /><span /><span /><span /></span><span>Khmer<span className="brand-accent">One</span><small>.com</small></span></Link>
      <div className="header-actions">
        <button className="icon-button" aria-label={t.theme} title={t.theme} onClick={() => setTheme(theme === "light" ? "dark" : "light")}>{theme === "light" ? <Moon size={19} /> : <Sun size={19} />}</button>
        <button className="language-button" aria-label={t.language} onClick={() => setLocale(locale === "en" ? "km" : "en")}><Languages size={17} aria-hidden="true" /><span>{locale === "en" ? "ភាសាខ្មែរ" : "English"}</span></button>
      </div>
    </header>

    <main>
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</div><h1 id="hero-title">{t.title}</h1><p>{t.intro}</p></div>
        <div className="hero-decoration" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-center"><BookOpenText strokeWidth={1.6} size={44} /></div><span className="orbit-node node-one"><HeartPulse size={19} /></span><span className="orbit-node node-two"><Globe2 size={19} /></span><span className="orbit-node node-three"><Languages size={19} /></span></div>
      </section>

      <section className="directory wrap" aria-labelledby="directory-title">
        <div className="directory-toolbar">
          <div className="search-field"><Search size={21} aria-hidden="true" /><input type="search" aria-label={t.searchLabel} placeholder={t.search} value={query} onChange={(e) => setQuery(e.target.value)} />{query && <button className="clear-button" aria-label={t.clear} onClick={() => setQuery("")}><X size={17} /></button>}</div>
          <label className="grade-field"><SlidersHorizontal size={18} aria-hidden="true" /><select aria-label={t.grade} value={grade} onChange={(e) => setGrade(e.target.value as GradeLevel | "all")}><option value="all">{t.grade}</option>{(Object.keys(gradeLabels) as GradeLevel[]).map((key) => <option key={key} value={key}>{gradeLabels[key][locale]}</option>)}</select></label>
        </div>
        <div className="filter-row" role="group" aria-label={t.browse}>{filters.map(({ key, label }) => <button key={key} type="button" className={`filter-chip ${filter === key ? "active" : ""}`} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label[locale]}</button>)}</div>
        <div className="directory-heading"><div><span className="section-index">01 / {t.browse}</span><h2 id="directory-title">{t.all}</h2></div><span className="result-count" aria-live="polite">{results.length} {results.length === 1 ? t.app : t.apps}</span></div>
        {results.length ? <div className="app-grid">{results.map((app, index) => {
          const Icon = icons[app.icon];
          return <article className="app-card" key={app.id}>
            <div className="card-top"><span className={`app-icon icon-${app.icon}`}><Icon size={28} strokeWidth={1.8} aria-hidden="true" /></span><span className="card-number">{String(index + 1).padStart(2, "0")}</span></div>
            <div className="card-content"><span className="category-label">{app.categoryLabel[locale]}</span><h3>{app.title[locale]}</h3><p className="card-tagline">{app.tagline[locale]}</p><p className="card-description">{app.description[locale]}</p></div>
            <div className="card-meta"><div className="grade-badges">{app.grades.map((g) => <span className="grade-badge" key={g}>{gradeLabels[g][locale]}</span>)}</div><div className="card-status">{app.offlineReady && <span className="offline-status"><WifiOff size={14} />{t.offline}</span>}</div></div>
            <div className="card-bottom">{app.url ? <a className="launch-button" href={app.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.launch}: ${app.title[locale]}`}>{t.launch}<ArrowUpRight size={18} aria-hidden="true" /></a> : <span className="pending-button" title={t.linkInfo} aria-label={`${app.title[locale]}: ${t.linkInfo}`}>{t.pending}</span>}</div>
          </article>;
        })}</div> : <div className="empty-state"><Search size={27} /><p>{t.empty}</p><button onClick={reset}>{t.reset}</button></div>}
      </section>
    </main>
    <footer className="footer wrap"><div className="footer-rule" /><div><span className="footer-brand">KhmerOne<span>.com</span></span><p>{t.footer}</p></div><span className="footer-note"><Check size={16} />{t.network}</span></footer>
  </div>;
}
