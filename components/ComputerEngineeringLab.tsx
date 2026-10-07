"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Binary, Check, Code2, Copy, Cpu, Languages, Lightbulb, RotateCcw } from "lucide-react";
import { codingLessons, gateLessons, languageIds, type ProgrammingId } from "@/data/computerEngineering";
import { engineeringCopy } from "@/locales/computerEngineering";
import { evaluateGate, gateIds, tokenizeCode, truthTable, type Bit, type GateId } from "@/lib/digital-logic";
import { apps } from "@/data/apps";
import type { Locale } from "@/types/app";

function readLocale(): Locale {
  try { return localStorage.getItem("khmerone-locale") === "km" ? "km" : "en"; } catch { return "en"; }
}
function subscribeLocale(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("khmerone-locale-change", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("khmerone-locale-change", callback); };
}
const serverLocale = (): Locale => "en";

function GateDiagram({ gate, a, b, output }: { gate: GateId; a: Bit; b: Bit; output: Bit }) {
  const inversion = gate === "NOT" || gate === "NAND";
  const isOr = gate === "OR" || gate === "XOR";
  const path = gate === "NOT" ? "M100 40 L175 90 L100 140 Z" : isOr ? "M95 40 Q140 40 180 90 Q140 140 95 140 Q125 90 95 40 Z" : "M100 40 H132 A50 50 0 0 1 132 140 H100 Z";
  return <svg viewBox="0 0 300 180" role="img" aria-label={`${gate}: A=${a}${gate === "NOT" ? "" : `, B=${b}`}, Y=${output}`} className="ce-gate-svg">
    <path d={gate === "NOT" ? "M28 90 H100" : "M28 65 H107"} className={a ? "wire wire-on" : "wire"} />
    {gate !== "NOT" && <path d="M28 115 H107" className={b ? "wire wire-on" : "wire"} />}
    <path d="M180 90 H270" className={output ? "wire wire-on" : "wire"} />
    <path d={path} className="ce-gate-shape" />
    {gate === "XOR" && <path d="M85 40 Q115 90 85 140" className="ce-gate-extra" />}
    {inversion && <circle cx={gate === "NOT" ? 183 : 190} cy="90" r="8" className="ce-gate-shape" />}
    <text x="136" y="95" textAnchor="middle" className="ce-svg-label">{gate}</text>
    <text x="16" y={gate === "NOT" ? 80 : 55} className="ce-svg-label">A</text>
    {gate !== "NOT" && <text x="16" y="137" className="ce-svg-label">B</text>}
    <circle cx="270" cy="90" r="13" className={output ? "ce-signal ce-signal-on" : "ce-signal"} />
    <text x="270" y="125" textAnchor="middle" className="ce-svg-label">Y = {output}</text>
  </svg>;
}

export function ComputerEngineeringLab() {
  const storedLocale = useSyncExternalStore(subscribeLocale, readLocale, serverLocale);
  const [sessionLocale, setSessionLocale] = useState<Locale | null>(null);
  const locale = sessionLocale ?? storedLocale;
  const [section, setSection] = useState<"logic" | "programming">("logic");
  const [gate, setGate] = useState<GateId>("AND");
  const [a, setA] = useState<Bit>(0);
  const [b, setB] = useState<Bit>(0);
  const [language, setLanguage] = useState<ProgrammingId>("html");
  const [copyState, setCopyState] = useState<"idle" | "copied" | "fallback">("idle");
  const [heading, setHeading] = useState("សួស្តីកម្ពុជា!");
  const [color, setColor] = useState<"gold" | "cyan">("gold");
  const [clicks, setClicks] = useState(0);
  const [pythonStep, setPythonStep] = useState(0);
  const codeRef = useRef<HTMLElement>(null);
  const t = engineeringCopy[locale];
  const lesson = gateLessons[gate];
  const output = evaluateGate(gate, a, b);
  const coding = codingLessons[language];
  const labApp = apps.find((app) => app.id === "khmer-lab-tech");

  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => {
    if (copyState !== "copied") return;
    const timer = window.setTimeout(() => setCopyState("idle"), 2500);
    return () => window.clearTimeout(timer);
  }, [copyState]);

  function changeLocale(next: Locale) {
    try { localStorage.setItem("khmerone-locale", next); setSessionLocale(null); }
    catch { setSessionLocale(next); }
    window.dispatchEvent(new Event("khmerone-locale-change"));
  }
  async function copyCode() {
    try { await navigator.clipboard.writeText(coding.code); setCopyState("copied"); }
    catch {
      setCopyState("fallback");
      if (codeRef.current) {
        const range = document.createRange(); range.selectNodeContents(codeRef.current);
        const selection = window.getSelection(); selection?.removeAllRanges(); selection?.addRange(range);
      }
    }
  }
  function selectLanguage(next: ProgrammingId) { setLanguage(next); setCopyState("idle"); }

  return <div className="ce-shell" lang={locale}>
    <a href="#ce-main" className="ce-skip">{t.back}</a>
    <header className="ce-header">
      <Link href="/" className="ce-brand"><Cpu size={25} aria-hidden="true" /><span>Khmer One<small>{t.name}</small></span></Link>
      <div className="ce-header-actions"><div id="background-audio-controls" className="audio-header-slot" /><div className="ce-language" role="group" aria-label={t.language}>{(["km", "en"] as Locale[]).map((lang) => <button type="button" key={lang} onClick={() => changeLocale(lang)} aria-pressed={locale === lang}><Languages size={15} aria-hidden="true" />{lang.toUpperCase()}</button>)}</div></div>
    </header>
    <main id="ce-main" className="ce-main">
      <section className="ce-hero" aria-labelledby="ce-title">
        <div><span className="ce-eyebrow">{t.kicker}</span><h1 id="ce-title">{t.title}</h1><p>{t.intro}</p><span className="ce-learning-pill"><Binary size={17} aria-hidden="true" />{t.objectives}</span></div>
        <div className="ce-hero-art" aria-hidden="true"><div className="ce-bit">0</div><span>→</span><Cpu size={56} strokeWidth={1.25} /><span>→</span><div className="ce-bit active">1</div></div>
      </section>
      <nav className="ce-section-picker" aria-label={t.name}>{(["logic", "programming"] as const).map((id) => <button type="button" key={id} aria-pressed={section === id} aria-controls={`ce-${id}`} onClick={() => setSection(id)}>{id === "logic" ? <Binary size={20} aria-hidden="true" /> : <Code2 size={20} aria-hidden="true" />}{t[id]}</button>)}</nav>

      {section === "logic" ? <section id="ce-logic" aria-labelledby="ce-logic-title">
        <div className="ce-section-intro"><span className="ce-eyebrow">01 / {t.logic}</span><h2 id="ce-logic-title">Logic Gates / ទ្វារឡូជីខល</h2><p>{t.logicIntro}</p></div>
        <p className="ce-bit-note"><Binary size={20} aria-hidden="true" />{t.bits}</p>
        <div className="ce-gate-picker" role="group" aria-label={t.chooseGate}>{gateIds.map((id) => <button type="button" key={id} aria-pressed={gate === id} onClick={() => setGate(id)}>{id}<small>{gateLessons[id].name[locale].split(" · ")[1]}</small></button>)}</div>
        <div className="ce-lab-grid">
          <article className="ce-card ce-simulator" aria-labelledby="ce-gate-title">
            <div className="ce-card-topline"><h3 id="ce-gate-title">{lesson.name[locale]}</h3><code>{lesson.expression}</code></div>
            <GateDiagram gate={gate} a={a} b={b} output={output} />
            <div className="ce-switches"><button type="button" role="switch" aria-checked={a === 1} aria-label={`${t.toggle} A`} onClick={() => setA(a ? 0 : 1)}><span>{t.input} A</span><strong>{a}</strong><small>{a ? t.on : t.off}</small></button>{gate !== "NOT" && <button type="button" role="switch" aria-checked={b === 1} aria-label={`${t.toggle} B`} onClick={() => setB(b ? 0 : 1)}><span>{t.input} B</span><strong>{b}</strong><small>{b ? t.on : t.off}</small></button>}<div className={`ce-output ${output ? "lit" : ""}`} role="status" aria-live="polite" aria-atomic="true"><Lightbulb size={30} aria-hidden="true" /><span>{t.output} Y</span><strong>{output} · {output ? t.on : t.off}</strong></div></div>
            <div className="ce-simulator-footer"><p>{t.predict}</p><button type="button" onClick={() => { setA(0); setB(0); }}><RotateCcw size={16} aria-hidden="true" />{t.reset}</button></div>
          </article>
          <article className="ce-card ce-truth-table">
            <h3>{t.table}</h3><div className="ce-table-scroll"><table><caption>{gate} — {t.table}</caption><thead><tr><th scope="col">A</th>{gate !== "NOT" && <th scope="col">B</th>}<th scope="col">Y</th><th scope="col"><span className="sr-only">{t.current}</span></th></tr></thead><tbody>{truthTable(gate).map((row) => {
              const current = row.a === a && (gate === "NOT" || row.b === b);
              return <tr key={`${row.a}${row.b}`} className={current ? "ce-current-row" : ""} aria-current={current ? "true" : undefined}><td>{row.a}</td>{gate !== "NOT" && <td>{row.b}</td>}<td><strong>{row.output}</strong></td><td>{current && <><Check size={16} aria-hidden="true" /><span className="sr-only">{t.current}</span></>}</td></tr>;
            })}</tbody></table></div>
            <div className="ce-rule"><h4>{t.rule}</h4><p>{lesson.rule[locale]}</p></div>
          </article>
        </div>
        <div className="ce-explain-grid"><article className="ce-card"><span className="ce-eyebrow">{gate}</span><h3>{t.application}</h3><p>{lesson.application[locale]}</p></article><article className="ce-card"><Cpu size={24} aria-hidden="true" /><h3>{t.bridge}</h3><p>{t.bridgeBody}</p><button type="button" className="ce-inline-action" onClick={() => setSection("programming")}>{t.programming}<ArrowUpRight size={18} aria-hidden="true" /></button></article></div>
      </section> : <section id="ce-programming" aria-labelledby="ce-programming-title">
        <div className="ce-section-intro"><span className="ce-eyebrow">02 / {t.programming}</span><h2 id="ce-programming-title">HTML · CSS · JavaScript · Python</h2><p>{t.programIntro}</p></div>
        <div className="ce-code-picker" role="group" aria-label={t.programming}>{languageIds.map((id, index) => <button type="button" key={id} aria-pressed={language === id} onClick={() => selectLanguage(id)}><span>0{index + 1}</span><strong>{codingLessons[id].name}</strong><small>{codingLessons[id].type[locale]}</small></button>)}</div>
        <div className="ce-coding-grid">
          <article className="ce-card ce-coding-lesson"><span className="ce-eyebrow">{coding.type[locale]}</span><h3>{coding.name}</h3>{coding.expansion && <p className="ce-expansion" lang="en">{coding.expansion}</p>}<h4>{t.purpose}</h4><p>{coding.purpose[locale]}</p><h4>{t.anatomy}</h4><ol>{coding.explanations.map((point, index) => <li key={index}>{point[locale]}</li>)}</ol><div className="ce-challenge"><h4><Lightbulb size={18} aria-hidden="true" />{t.challenge}</h4><p>{coding.challenge[locale]}</p></div><a className="ce-inline-action" href={coding.guide} target="_blank" rel="noopener noreferrer">{t.source}<ArrowUpRight size={17} aria-hidden="true" /></a></article>
          <div className="ce-code-column"><article className="ce-code-card"><div className="ce-code-toolbar"><span>{coding.name} / {language === "html" ? "index.html" : language === "css" ? "style.css" : language === "python" ? "hello.py" : "script.js"}</span><button type="button" onClick={() => void copyCode()}>{copyState === "copied" ? <Check size={16} aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}{copyState === "copied" ? t.copied : t.copy}</button></div><pre tabIndex={0} aria-label={`${coding.name} ${t.anatomy}`}><code ref={codeRef}>{tokenizeCode(coding.code).map((token, i) => <span className={`ce-token-${token.kind}`} key={i}>{token.text}</span>)}</code></pre><p className="ce-copy-status" role="status">{copyState === "fallback" ? t.copyFallback : copyState === "copied" ? t.copied : ""}</p></article>
            <article className="ce-card ce-live-preview"><h3>{t.preview}</h3>{language === "python" ? <><pre className="ce-python-output" aria-live="polite">{["Hello, Cambodia!", "1", "2", "3"].slice(0, pythonStep).join("\n") || "…"}</pre><div className="ce-preview-controls"><button type="button" disabled={pythonStep === 4} onClick={() => setPythonStep((step) => Math.min(4, step + 1))}>{t.reveal}</button><button type="button" onClick={() => setPythonStep(0)} aria-label={t.reset}><RotateCcw size={17} aria-hidden="true" /></button></div><p>{t.pythonNotice}</p></> : <><div className={`ce-demo ce-demo-${color}`}><h4>{heading || "សួស្តីកម្ពុជា!"}</h4><p lang="en">I am learning to build a website.</p>{language === "javascript" && <div><button type="button" onClick={() => setClicks((count) => count + 1)}>{t.countAction}</button><output aria-live="polite" aria-label={t.count}>{clicks}</output></div>}</div><div className="ce-preview-controls">{language === "html" && <label>{t.heading}<input value={heading} maxLength={80} onChange={(event) => setHeading(event.target.value)} /></label>}{language === "css" && <div role="group" aria-label={t.color}>{(["gold", "cyan"] as const).map((value) => <button type="button" key={value} aria-pressed={color === value} onClick={() => setColor(value)}>{t[value]}</button>)}</div>}{language === "javascript" && <button type="button" onClick={() => setClicks(0)}><RotateCcw size={16} aria-hidden="true" />{t.reset}</button>}</div><p>{t.previewHint}</p></>}</article>
          </div>
        </div>
      </section>}
      <footer className="ce-footer"><p>{t.footer}</p><div><Link href="/"><ArrowLeft size={17} aria-hidden="true" />{t.home}</Link>{labApp?.url && <a href={labApp.url} target="_blank" rel="noopener noreferrer">{t.next}<ArrowUpRight size={17} aria-hidden="true" /></a>}</div></footer>
    </main>
  </div>;
}
