"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Baby, BookOpenText, Check, ClipboardCheck, Coins, Globe2, GraduationCap, HeartPulse, Languages, Search, SlidersHorizontal, TriangleAlert, WifiOff, X, Zap, type LucideIcon } from "lucide-react";
import { apps, gradeLabels } from "@/data/apps";
import { crewConcepts, pathways } from "@/data/engagement";
import { searchAppCatalog, searchCrewConcepts, searchSkillPathways } from "@/utils/search";
import { AppCategory, type AppEntry, type FilterKey, type GradeLevel, type Locale } from "@/types/app";
import { KhmerOneBar } from "@/components/KhmerOneBar";
import { MascotBot } from "@/components/MascotBot";
import { CambodiaTomorrowBanner } from "@/components/CambodiaTomorrowBanner";
import { BottomFloatingSearch } from "@/components/BottomFloatingSearch";
import { DynamicSearchPrompt, useRotatingSearchPrompt, useSearchDismissal } from "@/components/DynamicSearchBar";
import type { SearchPrompt } from "@/data/searchPrompts";
import { PowerSkillsDashboard } from "@/components/PowerSkillsDashboard";
import { CrewDirectory } from "@/components/CrewDirectory";
import { DonationNotice } from "@/components/DonationNotice";
import { FuturePerspectiveBanner } from "@/components/FuturePerspectiveBanner";
import { DengueHealthNotice } from "@/components/DengueHealthNotice";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { AngkorWatIcon } from "@/components/AngkorWatIcon";
import { BackToTopButton } from "@/components/BackToTopButton";
import { rainbowAccents, themeColor, themePresets, type AccentId, type ThemeId } from "@/data/themes";
import { useCyberProgress } from "@/hooks/useCyberProgress";
import { isKhmerOneAlias } from "@/lib/khmerUtils";

function readSetting(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

const icons: Record<AppEntry["icon"], LucideIcon> = {
  school: GraduationCap, anatomy: HeartPulse, finance: Coins, language: Languages,
  exam: ClipboardCheck, baby: Baby, world: Globe2, peace: BookOpenText, speed: Zap, cancer: HeartPulse,
};

const filters: { key: FilterKey; label: Record<Locale, string> }[] = [
  { key: "all", label: { en: "All", km: "ទាំងអស់" } },
  { key: AppCategory.Stem, label: { en: "STEM", km: "ស្ទែម" } },
  { key: AppCategory.Health, label: { en: "Health", km: "សុខភាព" } },
  { key: AppCategory.Languages, label: { en: "Languages", km: "ភាសា" } },
  { key: AppCategory.Finance, label: { en: "Financial literacy", km: "ហិរញ្ញវត្ថុ" } },
  { key: AppCategory.Simulations, label: { en: "Simulations", km: "ការក្លែងធ្វើ" } },
  { key: AppCategory.Utilities, label: { en: "Utilities", km: "ឧបករណ៍សិក្សា" } },
];

const copy = {
  en: {
    eyebrow: "YOUR NEXT MOVE STARTS HERE", title: "Build skills. Shape your future.",
    intro: "Try small challenges, discover useful tools, and find a crew for ideas worth building.",
    power: "Unlock Your Power", explore: "Explore apps",
    search: "Search apps, topics or grade levels", searchLabel: "Search learning apps",
    clear: "Clear search", grade: "Any grade level", browse: "Explore the network",
    apps: "apps", app: "app", all: "All learning apps",
    empty: "No apps match your search.", reset: "Clear filters",
    offline: "Offline ready", launch: "Open app", pending: "Link pending",
    linkInfo: "A public link has not been added yet.",
    network: "Ten learning spaces. One starting point.",
    healthNotice: "Health notice",
    matchingPaths: "Matching skill paths", matchingCrews: "Matching crews",
    noAppMatches: "No app cards match this search. Explore the related results above.",
    museumConcept: "Museum of Obsolete Systems · concept artwork", fullArtwork: "View full image",
    museumAlt: "Fictional KHMER ONE Museum of Obsolete Systems webpage with a futuristic atrium, clocks, periodic table, graph and engine exhibits",
    tomorrowConcept: "Cambodia Tomorrow (2061) · concept poster",
    tomorrowAlt: "Cambodia Tomorrow poster: four Cambodian student engineers overlooking a green futuristic Phnom Penh; directed and produced by Jared Wright",
    footer: "Learning should be easy to find, wherever you are.",
    themeDark: "Switch to dark mode", themeLight: "Switch to light mode", language: "Switch language",
  },
  km: {
    eyebrow: "ជំហានបន្ទាប់ចាប់ផ្ដើមនៅទីនេះ", title: "បង្កើនជំនាញ។ បង្កើតអនាគតរបស់អ្នក។",
    intro: "សាកល្បងលំហាត់ខ្លីៗ ស្វែងរកឧបករណ៍មានប្រយោជន៍ និងក្រុមសម្រាប់គំនិតដែលអ្នកចង់បង្កើត។",
    power: "ពង្រឹងសមត្ថភាពរបស់អ្នក", explore: "ស្វែងរកកម្មវិធី",
    search: "ស្វែងរកកម្មវិធី ប្រធានបទ ឬកម្រិតថ្នាក់", searchLabel: "ស្វែងរកកម្មវិធីសិក្សា",
    clear: "លុបពាក្យស្វែងរក", grade: "គ្រប់កម្រិតថ្នាក់", browse: "ស្វែងយល់ពីបណ្ដាញ",
    apps: "កម្មវិធី", app: "កម្មវិធី", all: "កម្មវិធីសិក្សាទាំងអស់",
    empty: "រកមិនឃើញកម្មវិធីដែលត្រូវនឹងការស្វែងរកទេ។", reset: "លុបតម្រង",
    offline: "អាចប្រើក្រៅបណ្ដាញ", launch: "បើកកម្មវិធី", pending: "រង់ចាំតំណ",
    linkInfo: "មិនទាន់មានតំណសាធារណៈទេ។",
    network: "កន្លែងសិក្សាដប់។ ចាប់ផ្ដើមពីទីនេះ។",
    healthNotice: "សេចក្ដីជូនដំណឹងអំពីសុខភាព",
    matchingPaths: "ជំនាញដែលត្រូវនឹងការស្វែងរក", matchingCrews: "ក្រុមដែលត្រូវនឹងការស្វែងរក",
    noAppMatches: "គ្មានកម្មវិធីដែលត្រូវនឹងការស្វែងរកទេ។ សូមមើលលទ្ធផលពាក់ព័ន្ធខាងលើ។",
    museumConcept: "សារមន្ទីរប្រព័ន្ធហួសសម័យ · រូបភាពគំនិត", fullArtwork: "មើលរូបភាពពេញ",
    museumAlt: "រូបភាពគេហទំព័រ KHMER ONE សារមន្ទីរប្រព័ន្ធហួសសម័យ មានសាលអនាគត នាឡិកា តារាងធាតុ ក្រាប និងម៉ាស៊ីន",
    tomorrowConcept: "កម្ពុជាថ្ងៃស្អែក (២០៦១) · ផ្ទាំងរូបភាពគំនិត",
    tomorrowAlt: "ផ្ទាំងរូបភាពកម្ពុជាថ្ងៃស្អែក៖ សិស្សវិស្វករកម្ពុជាបួននាក់មើលភ្នំពេញបៃតងអនាគត។ ដឹកនាំ និងផលិតដោយ Jared Wright",
    footer: "ការសិក្សាគួរតែងាយស្រួលស្វែងរក ទោះអ្នកនៅទីណាក៏ដោយ។",
    themeDark: "ប្ដូរទៅផ្ទៃងងឹត", themeLight: "ប្ដូរទៅផ្ទៃភ្លឺ", language: "ប្ដូរភាសា",
  },
};

function matchesFilter(app: AppEntry, filter: FilterKey) {
  return filter === "all" || app.category === filter ||
    (filter === AppCategory.Simulations && app.category === AppCategory.SocialStudies);
}

export default function Home() {
  const router = useRouter();
  const [locale, setLocale] = useState<Locale>("en");
  const [theme, setTheme] = useState<ThemeId>("cyberpunk");
  const [accent, setAccent] = useState<AccentId>("default");
  const [settingsReady, setSettingsReady] = useState(false);
  const [query, setQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const { searchOpen, openSearch, closeSearch, dismissSearch } = useSearchDismissal(query, setQuery, setSearchFocused);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [grade, setGrade] = useState<GradeLevel | "all">("all");
  const [promoDismissed, setPromoDismissed] = useState(false);
  const [bottomPosterInView, setBottomPosterInView] = useState(false);
  const [nearPageEnd, setNearPageEnd] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const bottomPosterRef = useRef<HTMLElement>(null);
  const cyber = useCyberProgress();
  const promoVisible = !promoDismissed && !bottomPosterInView && !nearPageEnd;
  const { prompt, fading } = useRotatingSearchPrompt(query, searchFocused);

  useEffect(() => {
    const savedLocale = readSetting("khmerone-locale");
    const savedTheme = readSetting("khmerone-theme-v3") ?? readSetting("khmerone-theme-v2");
    const savedAccent = readSetting("khmerone-accent-v2") ?? readSetting("khmerone-accent-v1");
    const frame = requestAnimationFrame(() => {
      if (savedLocale === "km" || savedLocale === "en") setLocale(savedLocale);
      if (savedTheme === "dark") setTheme("cyberpunk");
      else if (themePresets.some((item) => item.id === savedTheme)) setTheme(savedTheme as ThemeId);
      if (savedAccent === "cyan") setAccent("blue");
      else if (savedAccent === "pink") setAccent("violet");
      else if (rainbowAccents.some((item) => item.id === savedAccent)) setAccent(savedAccent as AccentId);
      setSettingsReady(true);
    });
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setPromoDismissed(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.accent = accent;
    if (settingsReady) {
      try {
        localStorage.setItem("khmerone-locale", locale);
        localStorage.setItem("khmerone-theme-v3", theme);
        localStorage.setItem("khmerone-accent-v2", accent);
      } catch {
        // Keep settings usable for the current session when storage is unavailable.
      }
    }
  }, [locale, theme, accent, settingsReady]);

  useEffect(() => {
    const poster = bottomPosterRef.current;
    if (!poster || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setBottomPosterInView(entry.isIntersecting), {
      rootMargin: "0px 0px -12% 0px", threshold: 0.05,
    });
    observer.observe(poster);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateNearPageEnd = () => {
      const remaining = document.documentElement.scrollHeight - window.scrollY - window.innerHeight;
      setNearPageEnd(remaining < Math.max(700, window.innerHeight * .8));
    };
    window.addEventListener("scroll", updateNearPageEnd, { passive: true });
    window.addEventListener("resize", updateNearPageEnd);
    updateNearPageEnd();
    return () => {
      window.removeEventListener("scroll", updateNearPageEnd);
      window.removeEventListener("resize", updateNearPageEnd);
    };
  }, []);

  const t = copy[locale];
  const results = useMemo(() => {
    return searchAppCatalog(apps, query).filter((app) =>
      matchesFilter(app, filter) && (grade === "all" || app.grades.includes(grade)));
  }, [query, filter, grade]);
  const pathwayMatches = useMemo(() => query.trim() ? searchSkillPathways(pathways, query) : [], [query]);
  const crewMatches = useMemo(() => query.trim() ? searchCrewConcepts(crewConcepts, query) : [], [query]);
  const showRelatedSearch = searchOpen && (pathwayMatches.length > 0 || crewMatches.length > 0);

  const reset = () => { setQuery(""); setFilter("all"); setGrade("all"); };
  const openBrandHome = () => {
    reset();
    router.push("/");
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  };
  const selectSearchPrompt = (selected: SearchPrompt) => {
    openSearch();
    setQuery(selected.query);
    setFilter("all");
    setGrade("all");
    document.getElementById("directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return <div className={`site-shell has-floating-search ${locale === "km" ? "khmer" : "english"} ${promoVisible ? "promo-active" : ""}`}>
    <KhmerOneBar locale={locale} dark={themePresets.find((item) => item.id === theme)?.mode === "dark"} accentColor={themeColor(theme, accent)} homeUrl="/#directory" />
    <header className="main-header wrap">
      <Link className="brand" href="/" aria-label="KhmerOne home"><AngkorWatIcon /><span className="brand-lockup"><span className="brand-title">Khmer<span className="brand-accent">One</span><small>.com</small></span><span className="brand-khmer" lang="km">ខ្មែរ វ័ន</span></span></Link>
      <div className="header-actions">
        <ThemeSwitcher locale={locale} theme={theme} accent={accent} onAccentChange={setAccent} onThemeChange={setTheme} />
        <button className="language-button" aria-label={t.language} onClick={() => setLocale(locale === "en" ? "km" : "en")}><Languages size={17} aria-hidden="true" /><span className="language-label-full">{locale === "en" ? "ភាសាខ្មែរ" : "English"}</span><span className="language-label-short">{locale === "en" ? "ខ្មែរ" : "EN"}</span></button>
      </div>
    </header>

    <main>
      <section className="hero wrap" aria-labelledby="hero-title">
        <div className="hero-panel">
          <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-line" />{t.eyebrow}</div><h1 id="hero-title">{t.title}</h1><p>{t.intro}</p><div className="hero-actions"><a className="hero-primary" href="#power-skills">{t.power}<ArrowUpRight size={18} aria-hidden="true" /></a><a className="hero-secondary" href="#directory">{t.explore}</a></div></div>
          <div className="hero-decoration" aria-hidden="true"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit-center"><BookOpenText strokeWidth={1.6} size={44} /></div><span className="orbit-node node-one"><HeartPulse size={19} /></span><span className="orbit-node node-two"><Globe2 size={19} /></span><span className="orbit-node node-three"><Languages size={19} /></span></div>
        </div>
      </section>

      <PowerSkillsDashboard locale={locale} progress={cyber.progress} status={cyber.status} ready={cyber.ready} onToggleStep={cyber.toggleStep} onExploreApp={cyber.exploreApp} />
      <CrewDirectory locale={locale} selectedId={cyber.progress.crewInterestId} onSelect={cyber.selectCrew} />

      <DengueHealthNotice locale={locale} />

      <section id="directory" className="directory wrap" aria-labelledby="directory-title">
        <div className="directory-toolbar">
          <div className="search-field" data-search-surface>
            <button type="button" className="search-focus-button" aria-label={t.searchLabel} onClick={() => searchRef.current?.focus()}><Search size={21} aria-hidden="true" /></button>
            <div className="search-input-wrap">
              <input ref={searchRef} type="search" aria-label={t.searchLabel} placeholder={searchFocused ? t.search : ""} value={query}
                onChange={(e) => { setQuery(e.target.value); openSearch(); }}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  if (!query.trim()) { e.preventDefault(); dismissSearch(); }
                  else if (isKhmerOneAlias(query)) { e.preventDefault(); dismissSearch(); openBrandHome(); }
                }}
                onFocus={() => { setSearchFocused(true); openSearch(); }} onBlur={() => setSearchFocused(false)} />
              {!query && !searchFocused && <DynamicSearchPrompt locale={locale} prompt={prompt} fading={fading} onSelect={selectSearchPrompt} />}
            </div>
            {(query || searchFocused || searchOpen) && <button type="button" className="clear-button" aria-label={t.clear} onClick={dismissSearch}><X size={17} aria-hidden="true" /></button>}
          </div>
          <label className="grade-field"><SlidersHorizontal size={18} aria-hidden="true" /><select aria-label={t.grade} value={grade} onChange={(e) => setGrade(e.target.value as GradeLevel | "all")}><option value="all">{t.grade}</option>{(Object.keys(gradeLabels) as GradeLevel[]).map((key) => <option key={key} value={key}>{gradeLabels[key][locale]}</option>)}</select></label>
        </div>
        <div className="filter-row" role="group" aria-label={t.browse}>{filters.map(({ key, label }) => <button key={key} type="button" className={`filter-chip ${filter === key ? "active" : ""}`} aria-pressed={filter === key} onClick={() => setFilter(key)}>{label[locale]}</button>)}</div>
        <div className="directory-heading"><div><span className="section-index">03 / {t.browse}</span><h2 id="directory-title">{t.all}</h2></div><span className="result-count" aria-live="polite">{results.length} {results.length === 1 ? t.app : t.apps}</span></div>
        {showRelatedSearch && <div className="related-search-results" data-search-surface onClick={(event) => { if (event.target instanceof Element && event.target.closest("a")) closeSearch(); }} aria-live="polite">
          {pathwayMatches.length > 0 && <div><h3>{t.matchingPaths}</h3><div className="related-search-links">{pathwayMatches.map((pathway) => <a href={`#pathway-${pathway.id}`} key={pathway.id}>{pathway.title[locale]} <ArrowUpRight size={15} aria-hidden="true" /></a>)}</div></div>}
          {crewMatches.length > 0 && <div><h3>{t.matchingCrews}</h3><div className="related-search-links">{crewMatches.map((crew) => <a href={`#crew-${crew.id}`} key={crew.id}>{crew.title[locale]} <ArrowUpRight size={15} aria-hidden="true" /></a>)}</div></div>}
        </div>}
        {results.length ? <div className="app-grid">{results.map((app, index) => {
          const Icon = icons[app.icon];
          return <article className="app-card" key={app.id}>
            <div className="card-top"><span className={`app-icon icon-${app.icon}`}><Icon size={28} strokeWidth={1.8} aria-hidden="true" /></span><span className="card-number">{String(index + 1).padStart(2, "0")}</span></div>
            <div className="card-content"><span className="category-label">{app.categoryLabel[locale]}</span><h3>{app.title[locale]}</h3><p className="card-tagline">{app.tagline[locale]}</p><p className="card-description">{app.description[locale]}</p></div>
            <div className="card-meta"><div className="grade-badges">{app.gradeBadge ? <span className="grade-badge">{app.gradeBadge[locale]}</span> : app.grades.map((g) => <span className="grade-badge" key={g}>{gradeLabels[g][locale]}</span>)}</div><div className="card-status">{app.offlineReady && <span className="offline-status"><WifiOff size={14} />{t.offline}</span>}</div></div>
            {app.notice && <aside className="health-notice" aria-label={t.healthNotice}><TriangleAlert size={18} aria-hidden="true" /><div><strong>{t.healthNotice}</strong><p>{app.notice[locale]}</p></div></aside>}
            <div className="card-bottom">{app.url ? <a className="launch-button" href={app.url} target="_blank" rel="noopener noreferrer" onClick={() => cyber.exploreApp(app.id)} aria-label={`${t.launch}: ${app.title[locale]}`}>{t.launch}<ArrowUpRight size={18} aria-hidden="true" /></a> : <span className="pending-button" title={t.linkInfo} aria-label={`${app.title[locale]}: ${t.linkInfo}`}>{t.pending}</span>}</div>
          </article>;
        })}</div> : showRelatedSearch ? <p className="related-only-note">{t.noAppMatches}</p> : <div className="empty-state"><Search size={27} /><p>{t.empty}</p><button onClick={reset}>{t.reset}</button></div>}
      </section>
      <FuturePerspectiveBanner locale={locale} />
      <section className="museum-feature wrap" aria-label={t.museumConcept}>
        <figure>
          <Image src="/museum-of-obsolete-systems.webp" alt={t.museumAlt} width={1448} height={1086} sizes="(max-width: 680px) calc(100vw - 36px), (max-width: 1232px) calc(100vw - 48px), 1232px" loading="lazy" unoptimized />
          <figcaption><span>{t.museumConcept}</span><a href="/museum-of-obsolete-systems.webp" target="_blank" rel="noopener noreferrer">{t.fullArtwork} <ArrowUpRight size={15} aria-hidden="true" /></a></figcaption>
        </figure>
      </section>
      <section ref={bottomPosterRef} className="tomorrow-feature wrap" aria-label={t.tomorrowConcept}>
        <figure>
          <Image src="/cambodia-tomorrow-poster-896.webp" alt={t.tomorrowAlt} width={896} height={1200} sizes="(max-width: 680px) calc(100vw - 36px), 550px" loading="lazy" unoptimized />
          <figcaption><span>{t.tomorrowConcept}</span><a href="/cambodia-tomorrow-poster-896.webp" target="_blank" rel="noopener noreferrer">{t.fullArtwork} <ArrowUpRight size={15} aria-hidden="true" /></a></figcaption>
        </figure>
      </section>
      <DonationNotice locale={locale} />
    </main>
    <MascotBot locale={locale} query={query} resultCount={results.length} onSelectFilter={(nextFilter) => { setQuery(""); setGrade("all"); setFilter(nextFilter); document.getElementById("directory")?.scrollIntoView({ behavior: "smooth", block: "start" }); }} onFocusSearch={() => { searchRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }); searchRef.current?.focus(); }} />
    <footer className="footer wrap"><div className="footer-rule" /><div><span className="footer-brand">KhmerOne<span>.com</span></span><p>{t.footer}</p></div><span className="footer-note"><Check size={16} />{t.network}</span></footer>
    <BottomFloatingSearch locale={locale} query={query} prompt={prompt} fading={fading} searchFocused={searchFocused} searchOpen={searchOpen} onDismiss={dismissSearch} onFocusChange={(focused) => { setSearchFocused(focused); if (focused) openSearch(); }} onSelectPrompt={selectSearchPrompt} onBrandAlias={openBrandHome} onQueryChange={(value) => { setQuery(value); openSearch(); if (value) { setFilter("all"); setGrade("all"); } }} />
    <BackToTopButton locale={locale} />
    <CambodiaTomorrowBanner locale={locale} visible={promoVisible} onDismiss={() => setPromoDismissed(true)} />
  </div>;
}
