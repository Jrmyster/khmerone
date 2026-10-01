"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BookOpenText, Check, Download, FileText, Languages, LoaderCircle, Pencil, Printer, RotateCcw, WifiOff } from "lucide-react";
import { buildTeachingResource, defaultToolkitSettings, resourceKinds, resourceLabels, subjectLabels, subjects, toolkitUnits, type ResourceKind, type ToolkitSettings } from "@/data/teacherToolkit";
import { toolkitCopy } from "@/locales/teacherToolkit";
import { parseToolkitDraft, prepareToolkitOffline, TOOLKIT_DRAFT_KEY } from "@/lib/teacher-toolkit";
import { themePresets, rainbowAccents } from "@/data/themes";
import type { Locale } from "@/types/app";

export function TeacherToolkit() {
  const [locale, setLocale] = useState<Locale>("en");
  const [settings, setSettings] = useState<ToolkitSettings>(defaultToolkitSettings);
  const [kind, setKind] = useState<ResourceKind>("lesson");
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [ready, setReady] = useState(false);
  const [saveState, setSaveState] = useState<"saving" | "saved" | "error">("saving");
  const [editing, setEditing] = useState(false);
  const [showAnswers, setShowAnswers] = useState(false);
  const [offlineState, setOfflineState] = useState<"idle" | "loading" | "ready" | "error" | "unsupported">("idle");
  const mounted = useRef(false);
  const t = toolkitCopy[locale];
  const document = buildTeachingResource(settings, kind, locale);
  const unit = document.unit;
  const editKey = `${unit.id}:${locale}:${kind}`;
  const isCustomized = Object.hasOwn(edits, editKey) || Object.hasOwn(edits, `${editKey}:answers`);
  const body = edits[editKey] ?? document.body;
  const answerKey = edits[`${editKey}:answers`] ?? document.answerKey;

  useEffect(() => {
    mounted.current = true;
    try {
      const draft = parseToolkitDraft(localStorage.getItem(TOOLKIT_DRAFT_KEY));
      setSettings(draft.settings); setKind(draft.kind); setEdits(draft.edits);
      const lang = localStorage.getItem("khmerone-locale");
      if (lang === "km" || lang === "en") setLocale(lang);
      const theme = localStorage.getItem("khmerone-theme-v3");
      const accent = localStorage.getItem("khmerone-accent-v2");
      if (themePresets.some((item) => item.id === theme)) window.document.documentElement.dataset.theme = theme!;
      if (rainbowAccents.some((item) => item.id === accent)) window.document.documentElement.dataset.accent = accent!;
    } catch { setSaveState("error"); }
    setReady(true);
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js").catch(() => {});
      void caches.open("khmerone-teacher-toolkit-v1").then((cache) => cache.match("/teacher-toolkit")).then((cached) => {
        if (cached && mounted.current) setOfflineState("ready");
      }).catch(() => {});
    } else setOfflineState("unsupported");
    return () => { mounted.current = false; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    window.document.documentElement.lang = locale;
    try { localStorage.setItem("khmerone-locale", locale); } catch { /* Session language still works. */ }
  }, [locale, ready]);

  useEffect(() => {
    if (!ready) return;
    setSaveState("saving");
    const timer = window.setTimeout(() => {
      try {
        localStorage.setItem(TOOLKIT_DRAFT_KEY, JSON.stringify({ settings, kind, edits }));
        setSaveState("saved");
      } catch { setSaveState("error"); }
    }, 350);
    return () => {
      window.clearTimeout(timer);
      // Keep the final edit when navigating away before the debounce completes.
      try { localStorage.setItem(TOOLKIT_DRAFT_KEY, JSON.stringify({ settings, kind, edits })); } catch { /* No storage available. */ }
    };
  }, [settings, kind, edits, ready]);

  const update = <K extends keyof ToolkitSettings>(key: K, value: ToolkitSettings[K]) => setSettings((previous) => ({ ...previous, [key]: value }));
  const restore = () => setEdits((previous) => { const next = { ...previous }; delete next[editKey]; delete next[`${editKey}:answers`]; return next; });
  const download = () => {
    const output = [document.title, resourceLabels[kind][locale], `${t.grade} ${settings.grade} · ${subjectLabels[unit.subject][locale]} · ${settings.duration} ${t.minutes}`, body, ...(showAnswers && document.answerKey ? [t.answerTitle, answerKey] : []), t.pageNote].join("\n\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", output], { type: "text/plain;charset=utf-8" }));
    const link = window.document.createElement("a");
    link.href = url; link.download = `teacher-toolkit-${unit.id}-${kind}-${locale}.txt`; link.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const offline = async () => {
    setOfflineState("loading");
    try { await prepareToolkitOffline(); if (mounted.current) setOfflineState("ready"); }
    catch (error) { if (mounted.current) setOfflineState(error instanceof Error && error.message === "unsupported" ? "unsupported" : "error"); }
  };

  return <div className={`toolkit-shell ${locale === "km" ? "khmer" : "english"}`}>
    <header className="toolkit-header wrap">
      <Link href="/" className="toolkit-home"><BookOpenText size={24} aria-hidden="true" /><span>{t.home}<small>{t.name}</small></span></Link>
      <div className="toolkit-header-controls"><div id="background-audio-controls" className="audio-header-slot" /><div className="toolkit-language" role="group" aria-label={locale === "km" ? "ភាសា" : "Language"}>{(["km", "en"] as Locale[]).map((lang) => <button type="button" key={lang} aria-pressed={locale === lang} onClick={() => { setLocale(lang); setEditing(false); }}><Languages size={15} aria-hidden="true" />{lang.toUpperCase()}</button>)}</div></div>
    </header>
    <main className="toolkit-main wrap">
      <section className="toolkit-intro" aria-labelledby="toolkit-title"><span className="toolkit-kicker">{t.name}</span><h1 id="toolkit-title">{t.tagline}</h1><p>{t.intro}</p></section>
      <div className="toolkit-workspace">
        <aside className="toolkit-setup" aria-labelledby="toolkit-setup-title">
          <h2 id="toolkit-setup-title"><Pencil size={20} aria-hidden="true" />{t.settings}</h2>
          <label><span>{t.subject}</span><select value={unit.subject} onChange={(event) => update("unitId", toolkitUnits.find((item) => item.subject === event.target.value)!.id)}>{subjects.map((subject) => <option key={subject} value={subject}>{subjectLabels[subject][locale]}</option>)}</select></label>
          <label><span>{t.starter}</span><select value={unit.id} onChange={(event) => update("unitId", event.target.value)}>{toolkitUnits.filter((item) => item.subject === unit.subject).map((item) => <option key={item.id} value={item.id}>{item.title[locale]}</option>)}</select><small>{t.recommended}: {unit.grades}</small></label>
          <div className="toolkit-fields-row"><label><span>{t.grade}</span><select value={settings.grade} onChange={(event) => update("grade", Number(event.target.value))}>{Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{t.grade} {i + 1}</option>)}</select></label><label><span>{t.duration}</span><select value={settings.duration} onChange={(event) => update("duration", Number(event.target.value))}>{[30, 40, 45, 60, 90].map((value) => <option key={value} value={value}>{value} {t.minutes}</option>)}</select></label></div>
          <label><span>{t.students}</span><input type="number" min={1} max={80} value={settings.students} onChange={(event) => update("students", Math.max(1, Math.min(80, Math.round(Number(event.target.value) || 1))))} /></label>
          <label><span>{t.title}</span><input value={settings.title} maxLength={120} placeholder={unit.title[locale]} onChange={(event) => update("title", event.target.value)} /></label>
          <label><span>{t.objective}</span><textarea rows={3} value={settings.objective} maxLength={1200} placeholder={unit.objective[locale]} onChange={(event) => update("objective", event.target.value)} /></label>
          <label><span>{t.notes}</span><textarea rows={3} value={settings.notes} maxLength={2000} placeholder={t.notesHint} onChange={(event) => update("notes", event.target.value)} /></label>
          <p className="toolkit-save" role="status">{saveState === "saved" && <Check size={16} aria-hidden="true" />}{saveState === "error" ? t.storageError : saveState === "saved" ? t.saved : t.saving}</p>
          <p className="toolkit-small">{t.local}</p>
          <div className="toolkit-offline"><WifiOff size={21} aria-hidden="true" /><p>{t.offlineIntro}</p><button type="button" onClick={() => void offline()} disabled={offlineState === "loading" || offlineState === "unsupported"}>{offlineState === "loading" ? <LoaderCircle className="toolkit-spinner" size={18} aria-hidden="true" /> : <Download size={18} aria-hidden="true" />}{offlineState === "loading" ? t.offlineBusy : t.offline}</button><p role="status">{offlineState === "ready" ? t.offlineReady : offlineState === "error" ? t.offlineError : offlineState === "unsupported" ? t.offlineUnsupported : ""}</p></div>
        </aside>
        <section className="toolkit-output" aria-labelledby="toolkit-preview-title">
          <div className="toolkit-resource-picker"><h2>{t.resource}</h2><div role="group" aria-label={t.resource}>{resourceKinds.map((resource) => <button key={resource} type="button" aria-pressed={kind === resource} onClick={() => { setKind(resource); setEditing(false); }}>{resourceLabels[resource][locale]}</button>)}</div></div>
          <div className="toolkit-output-toolbar"><h2 id="toolkit-preview-title"><FileText size={19} aria-hidden="true" />{t.preview}</h2><div><button type="button" onClick={() => setEditing(!editing)}><Pencil size={16} aria-hidden="true" />{editing ? t.done : t.edit}</button>{isCustomized && <button type="button" onClick={restore}><RotateCcw size={16} aria-hidden="true" />{t.restore}</button>}</div></div>
          {isCustomized && <p className="toolkit-custom-note"><strong>{t.custom}.</strong> {t.editNote}</p>}
          {editing && <label className="toolkit-editor"><span>{t.body}</span><textarea rows={18} value={body} maxLength={16000} onChange={(event) => setEdits((previous) => ({ ...previous, [editKey]: event.target.value }))} /></label>}
          {editing && document.answerKey && <label className="toolkit-editor"><span>{t.answerTitle}</span><textarea rows={8} value={answerKey} maxLength={16000} onChange={(event) => setEdits((previous) => ({ ...previous, [`${editKey}:answers`]: event.target.value }))} /></label>}
          <article className="toolkit-paper" lang={locale}>
            <header className="toolkit-paper-header"><span>KHMER ONE / {t.name}</span><h2>{document.title}</h2><p>{resourceLabels[kind][locale]} · {t.grade} {settings.grade} · {subjectLabels[unit.subject][locale]} · {settings.duration} {t.minutes} · {settings.students} {t.learners}</p></header>
            <div className="toolkit-paper-body">{body}</div>
            {showAnswers && document.answerKey && <section className="toolkit-answer-key"><h3>{t.answerTitle}</h3><p>{t.answerNote}</p><div>{answerKey}</div></section>}
            <footer>{t.pageNote}</footer>
          </article>
          <div className="toolkit-export-controls">{document.answerKey && <label className="toolkit-answer-toggle"><input type="checkbox" checked={showAnswers} onChange={(event) => setShowAnswers(event.target.checked)} /><span>{t.answers}</span></label>}<div className="toolkit-export-actions"><button type="button" className="toolkit-primary" onClick={() => window.print()}><Printer size={19} aria-hidden="true" />{t.print}</button><button type="button" onClick={download}><Download size={19} aria-hidden="true" />{t.download}</button></div><p>{t.printTip}</p></div>
        </section>
      </div>
      <footer className="toolkit-footer"><p>{t.starterNote}</p><Link href="/">{t.home}</Link></footer>
    </main>
  </div>;
}
