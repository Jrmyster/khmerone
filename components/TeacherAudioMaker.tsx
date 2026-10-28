"use client";

import { useEffect, useRef, useState } from "react";

import { ArrowLeft, Download, Headphones, LoaderCircle, Mic2, Volume2 } from "lucide-react";
import { AUDIO_TEXT_LIMIT, AUDIO_VOICES, type AudioSpeed, type AudioVoice } from "@/lib/teacher-audio";
import { teacherAudioCopy, teacherAudioTemplates } from "@/locales/teacherAudio";
import type { Locale } from "@/types/app";

type ErrorKey = "required" | "tooLong" | "invalid" | "unavailable" | "limited" | "timeout" | "failed" | "playback";
const errorKeys: Record<string, ErrorKey> = {
  invalid_input: "invalid", text_too_long: "tooLong", not_configured: "unavailable", temporarily_unavailable: "unavailable",
  rate_limited: "limited", speech_busy: "limited", speech_timeout: "timeout",
};

export function TeacherAudioMaker() {
  const [locale, setLocale] = useState<Locale>("km");
  const [text, setText] = useState("");
  const [voice, setVoice] = useState<AudioVoice>(AUDIO_VOICES[0]);
  const [speed, setSpeed] = useState<AudioSpeed>("normal");
  const [template, setTemplate] = useState("");
  const [busy, setBusy] = useState(false);
  const [online, setOnline] = useState(true);
  const [error, setError] = useState<ErrorKey | null>(null);
  const [result, setResult] = useState<{ url: string; filename: string } | null>(null);
  const active = useRef<AbortController | null>(null);
  const resultUrl = useRef<string | null>(null);
  const t = teacherAudioCopy[locale];
  const count = Array.from(text).length;

  useEffect(() => {
    const previous = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => { document.documentElement.lang = previous; };
  }, [locale]);
  useEffect(() => {
    const sync = () => setOnline(navigator.onLine);
    sync();
    window.addEventListener("online", sync); window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync); window.removeEventListener("offline", sync);
      active.current?.abort(); active.current = null;
      if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
    };
  }, []);

  function clearResult() {
    if (resultUrl.current) URL.revokeObjectURL(resultUrl.current);
    resultUrl.current = null;
    setResult(null); setError(null);
  }
  function cancel() {
    active.current?.abort(); active.current = null; setBusy(false);
  }
  async function generate() {
    if (active.current) return;
    clearResult();
    if (!text.trim()) { setError("required"); return; }
    if (count > AUDIO_TEXT_LIMIT) { setError("tooLong"); return; }
    const controller = new AbortController();
    active.current = controller; setBusy(true);
    const timer = window.setTimeout(() => controller.abort(), 35000);
    try {
      const response = await fetch("/api/teacher-audio", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice, speed }), signal: controller.signal, cache: "no-store",
      });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        const code = body && typeof body === "object" && "error" in body && typeof body.error === "string" ? body.error : "";
        if (active.current === controller) setError(errorKeys[code] || "failed");
        return;
      }
      if (!response.headers.get("Content-Type")?.includes("audio/mpeg")) throw new Error("invalid_audio");
      const blob = await response.blob();
      if (!blob.size) throw new Error("empty_audio");
      if (active.current !== controller) return;
      const url = URL.createObjectURL(blob);
      resultUrl.current = url;
      setResult({ url, filename: `khmer-lesson-${voice === AUDIO_VOICES[0] ? "sreymom" : "piseth"}-${speed}.mp3` });
    } catch {
      if (active.current === controller) setError(controller.signal.aborted ? "timeout" : "failed");
    } finally {
      window.clearTimeout(timer);
      if (active.current === controller) { active.current = null; setBusy(false); }
    }
  }

  return <div className="teacher-audio-shell" lang={locale}>
    <header className="ta-header">
      <a href="/" className="ta-home"><ArrowLeft size={18} aria-hidden="true" />{t.home}</a>
      <div className="ta-languages" role="group" aria-label="ភាសា / Language">
        <button type="button" lang="km" aria-pressed={locale === "km"} onClick={() => setLocale("km")}>ខ្មែរ</button>
        <button type="button" lang="en" aria-pressed={locale === "en"} onClick={() => setLocale("en")}>English</button>
      </div>
    </header>
    <main className="ta-main">
      <section className="ta-intro" aria-labelledby="ta-title"><span className="ta-kicker"><Mic2 size={16} aria-hidden="true" />{t.kicker}</span><h1 id="ta-title">{t.title}</h1><p>{t.intro}</p></section>
      <div className="ta-grid">
        <form className="ta-editor" onSubmit={(event) => { event.preventDefault(); void generate(); }} aria-busy={busy}>
          <div className="ta-template"><label htmlFor="ta-template">{t.templates}</label><div><select id="ta-template" value={template} disabled={busy} onChange={(event) => setTemplate(event.target.value)}><option value="">{t.choose}</option>{teacherAudioTemplates.map((item) => <option key={item.id} value={item.id}>{item.title[locale]}</option>)}</select><button type="button" disabled={!template || busy} onClick={() => {
            const selected = teacherAudioTemplates.find((item) => item.id === template);
            if (selected && (!text.trim() || window.confirm(t.replace))) { clearResult(); setText(selected.text); }
          }}>{t.insert}</button></div></div>
          <div className="ta-text-heading"><label htmlFor="ta-text">{t.text}</label><span id="ta-count" className={count > AUDIO_TEXT_LIMIT ? "ta-over" : ""}>{count.toLocaleString()} / 2,000 {t.count}</span></div>
          <textarea id="ta-text" lang="km" dir="ltr" value={text} disabled={busy} spellCheck={false} placeholder={t.placeholder} aria-describedby="ta-count ta-limit" aria-invalid={count > AUDIO_TEXT_LIMIT || error === "required" || error === "invalid"} onChange={(event) => { clearResult(); setText(event.target.value); }} />
          <p className="ta-help" id="ta-limit">{t.limit}</p>
          <fieldset className="ta-voices" disabled={busy}><legend>{t.voice}</legend>{AUDIO_VOICES.map((item, index) => <label key={item} className={voice === item ? "is-selected" : ""}><input type="radio" name="voice" value={item} checked={voice === item} onChange={() => { clearResult(); setVoice(item); }} /><Volume2 size={18} aria-hidden="true" /><span>{index === 0 ? t.sreymom : t.piseth}</span></label>)}</fieldset>
          <fieldset className="ta-speed" disabled={busy}><legend>{t.speed}</legend>{(["normal", "slower"] as const).map((item) => <label key={item}><input type="radio" name="speed" value={item} checked={speed === item} onChange={() => { clearResult(); setSpeed(item); }} />{t[item]}{item === "slower" && <small> (−20%)</small>}</label>)}</fieldset><p className="ta-help">{t.speedNote}</p>
          {!online && <p className="ta-error" role="status">{t.offline}</p>}
          {error && <p className="ta-error" role="alert">{t[error]}</p>}
          <div className="ta-actions"><button className="ta-primary" type="submit" disabled={busy || !online || !text.trim() || count > AUDIO_TEXT_LIMIT}>{busy ? <LoaderCircle className="ta-spin" size={20} aria-hidden="true" /> : <Mic2 size={20} aria-hidden="true" />}{busy ? t.generating : t.generate}</button>{busy ? <button type="button" onClick={cancel}>{t.cancel}</button> : <button type="button" disabled={!text && !result} onClick={() => { if (window.confirm(t.clearConfirm)) { clearResult(); setText(""); } }}>{t.clear}</button>}</div>
        </form>
        <aside className="ta-preview" aria-labelledby="ta-preview-title">
          <h2 id="ta-preview-title">{t.preview}</h2>
          <div className="ta-listening-art" aria-hidden="true"><Headphones size={44} strokeWidth={1.4} /><div className="ta-wave">{[14, 30, 46, 24, 58, 38, 18, 46, 30, 16, 34, 52, 24].map((height, index) => <span key={index} style={{ height }} />)}</div></div>
          <div role="status" aria-live="polite"><h3>{busy ? t.generating : result ? t.ready : t.empty}</h3>{!result && !busy && <p>{t.emptyHint}</p>}</div>
          {result && <><audio key={result.url} controls preload="metadata" src={result.url} aria-label={t.preview} onPlay={() => window.dispatchEvent(new Event("khmerone:narration-start"))} onError={() => setError("playback")} /><a className="ta-download" href={result.url} download={result.filename}><Download size={19} aria-hidden="true" />{t.download}</a></>}
          <p className="ta-review">{t.review}</p>
          <a href="/teacher-toolkit" className="ta-toolkit">{t.toolkit} →</a>
        </aside>
      </div>
      <p className="ta-privacy">{t.privacy}</p>
    </main>
  </div>;
}
