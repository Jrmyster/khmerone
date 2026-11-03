"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, BookOpen, ExternalLink, Languages, Lightbulb, Wifi } from "lucide-react";
import { phetLevelIds, phetLevels, phetMathLinks, phetMathResources, type PhetLevelId } from "@/data/phetMath";
import { phetMathCopy } from "@/locales/phetMath";
import type { Locale } from "@/types/app";

function readLocale(): Locale {
  try { return localStorage.getItem("khmerone-locale") === "km" ? "km" : "en"; }
  catch { return "en"; }
}

function subscribeLocale(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("khmerone-locale-change", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("khmerone-locale-change", callback);
  };
}

const serverLocale = (): Locale => "en";

export function PhetMathResources() {
  const storedLocale = useSyncExternalStore(subscribeLocale, readLocale, serverLocale);
  const [sessionLocale, setSessionLocale] = useState<Locale | null>(null);
  const locale = sessionLocale ?? storedLocale;
  const [level, setLevel] = useState<PhetLevelId | "all">("all");
  const t = phetMathCopy[locale];
  const resources = level === "all" ? phetMathResources : phetMathResources.filter((resource) => resource.level === level);
  const resultCount = t.showing.replace("{count}", String(resources.length)).replace("{total}", String(phetMathResources.length));

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);

  function changeLocale(next: Locale) {
    try { localStorage.setItem("khmerone-locale", next); setSessionLocale(null); }
    catch { setSessionLocale(next); }
    window.dispatchEvent(new Event("khmerone-locale-change"));
  }

  return <div className="pm-shell" lang={locale}>
    <a className="pm-skip" href="#pm-main">{t.skip}</a>
    <header className="pm-header">
      <Link className="pm-back" href="/#educational-tools"><ArrowLeft size={18} aria-hidden="true" /><span>{t.back}</span></Link>
      <div className="pm-language" role="group" aria-label={t.language}>
        <Languages size={18} aria-hidden="true" />
        <button type="button" lang="km" aria-pressed={locale === "km"} onClick={() => changeLocale("km")}>ខ្មែរ</button>
        <button type="button" lang="en" aria-pressed={locale === "en"} onClick={() => changeLocale("en")}>English</button>
      </div>
    </header>

    <main id="pm-main" className="pm-main">
      <section className="pm-hero" aria-labelledby="pm-title">
        <div className="pm-hero-copy">
          <span className="pm-eyebrow">{t.eyebrow}</span>
          <h1 id="pm-title">{t.title}</h1>
          <p>{t.intro}</p>
          <div className="pm-hero-badges"><span><Wifi size={16} aria-hidden="true" />{t.online}</span><span><ExternalLink size={16} aria-hidden="true" />phet.colorado.edu</span></div>
        </div>
        <div className="pm-collection-summary"><strong>{phetMathResources.length}</strong><span>{t.collection}</span><small>{t.progression}</small><div aria-hidden="true">+ <span>½</span> = <span>∫</span></div></div>
      </section>

      <aside className="pm-guide" aria-label={t.sourceTitle}>
        <div><Wifi size={20} aria-hidden="true" /><div><h2>{t.onlineTitle}</h2><p>{t.onlineNote}</p><a href={phetMathLinks.offline} target="_blank" rel="noopener noreferrer">{t.downloads}<ArrowUpRight size={16} aria-hidden="true" /><span className="pm-sr-only"> · {t.opensNewTab}</span></a></div></div>
        <div><Languages size={20} aria-hidden="true" /><div><h2>{t.languageTitle}</h2><p>{t.languageNote}</p><a href={phetMathLinks.khmer} target="_blank" rel="noopener noreferrer">{t.browseKhmer}<ArrowUpRight size={16} aria-hidden="true" /><span className="pm-sr-only"> · {t.opensNewTab}</span></a></div></div>
      </aside>

      <section className="pm-resources" aria-labelledby="pm-resources-title">
        <div className="pm-section-heading"><h2 id="pm-resources-title">{t.resourcesTitle}</h2><p role="status" aria-live="polite" aria-atomic="true">{resultCount}</p></div>
        <div className="pm-level-picker" role="group" aria-label={t.chooseLevel}>
          <button type="button" aria-pressed={level === "all"} aria-controls="pm-resource-grid" onClick={() => setLevel("all")}>{t.all}<span aria-hidden="true">{phetMathResources.length}</span></button>
          {phetLevelIds.map((id) => <button type="button" key={id} aria-pressed={level === id} aria-controls="pm-resource-grid" onClick={() => setLevel(id)}>{phetLevels[id].title[locale]}<span aria-hidden="true">{phetMathResources.filter((resource) => resource.level === id).length}</span></button>)}
        </div>
        <p className="pm-level-note"><BookOpen size={17} aria-hidden="true" /><span>{t.levelNote}</span></p>

        <div className="pm-resource-grid" id="pm-resource-grid">
          {resources.map((resource) => <article className="pm-resource-card" key={resource.id} aria-labelledby={`pm-title-${resource.id}`}>
            <div className="pm-card-top"><span className="pm-symbol" aria-hidden="true">{resource.symbol}</span><span className="pm-external"><ExternalLink size={13} aria-hidden="true" />{t.external}</span></div>
            <div className="pm-card-level"><span>{phetLevels[resource.level].title[locale]}</span>{resource.advanced && <span className="pm-advanced">{t.advanced}</span>}</div>
            <h3 id={`pm-title-${resource.id}`}>{resource.title[locale]}</h3>
            {locale === "km" && <p className="pm-official-title"><span className="pm-sr-only">{t.officialTitle}: </span><span lang="en">{resource.title.en}</span></p>}
            <p className="pm-card-description">{resource.description[locale]}</p>
            <p className="pm-grade">{phetLevels[resource.level].grades[locale]}</p>
            <div className="pm-activity"><h4><Lightbulb size={16} aria-hidden="true" />{t.tryThis}</h4><p>{resource.activity[locale]}</p></div>
            <a className="pm-open" href={resource.url} target="_blank" rel="noopener noreferrer" aria-label={`${t.open}: ${resource.title[locale]}. ${t.opensNewTab}`}><span>{t.open}</span><ArrowUpRight size={19} aria-hidden="true" /></a>
          </article>)}
        </div>
        <p className="pm-new-tab-note"><ExternalLink size={14} aria-hidden="true" />{t.opensNewTab}</p>
      </section>

      <footer className="pm-footer">
        <div className="pm-teaching-tip"><Lightbulb size={21} aria-hidden="true" /><p>{t.teachingTip}</p></div>
        <h2>{t.sourceTitle}</h2><p>{t.attribution}</p>
        <div className="pm-footer-links"><a href={phetMathLinks.attribution} target="_blank" rel="noopener noreferrer">{t.attributionLink}<ArrowUpRight size={16} aria-hidden="true" /><span className="pm-sr-only"> · {t.opensNewTab}</span></a><Link href="/#educational-tools"><ArrowLeft size={16} aria-hidden="true" />{t.back}</Link></div>
      </footer>
    </main>
  </div>;
}
