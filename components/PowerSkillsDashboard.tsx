"use client";

import { BriefcaseBusiness, Check, Code2, Cpu, ExternalLink, LockKeyhole, Video, Zap, type LucideIcon } from "lucide-react";
import { apps } from "@/data/apps";
import { pathways } from "@/data/engagement";
import type { Locale } from "@/types/app";
import type { CyberProgress, SkillPathway } from "@/types/engagement";

const icons: Record<SkillPathway["icon"], LucideIcon> = { video: Video, code: Code2, cpu: Cpu, briefcase: BriefcaseBusiness };
const badges = [
  { key: "apprentice", name: { en: "Digital Apprentice", km: "អ្នកហាត់ការឌីជីថល" }, how: { en: "Take your first step", km: "ចាប់ផ្ដើមជំហានដំបូង" } },
  { key: "runner", name: { en: "Code Runner", km: "អ្នកសាកកូដ" }, how: { en: "Finish Web & App Basics", km: "បញ្ចប់មូលដ្ឋានគេហទំព័រ" } },
  { key: "pioneer", name: { en: "Community Pioneer", km: "អ្នកត្រួសត្រាយសហគមន៍" }, how: { en: "Finish a path and pick a crew", km: "បញ្ចប់ផ្លូវមួយ និងជ្រើសក្រុម" } },
] as const;

const text = {
  en: { index: "01 / FAST-TRACK POWER SKILLS", title: "Make your next move.", intro: "Short challenges you can try with the tools you already have. Mark a step after you do it.",
    status: "STATUS & CLOUT", level: "Signal level", progress: "to next level", xp: "CYBER-XP", pace: "Go at your pace. Every useful step counts.",
    minutes: "min path", done: "complete", step: "steps", resource: "Explore related app", badge: "Achievements", locked: "Locked", unlocked: "Unlocked" },
  km: { index: "០១ / ជំនាញអនុវត្តរហ័ស", title: "ចាប់ផ្ដើមជំហានបន្ទាប់របស់អ្នក។", intro: "លំហាត់ខ្លីៗដែលអ្នកអាចសាកជាមួយឧបករណ៍ដែលមាន។ គូសធីកបន្ទាប់ពីបានធ្វើ។",
    status: "ស្ថានភាព និង CYBER-XP", level: "កម្រិតសមត្ថភាព", progress: "ទៅកម្រិតបន្ទាប់", xp: "CYBER-XP", pace: "រៀនតាមល្បឿនរបស់អ្នក។ គ្រប់ជំហានមានតម្លៃ។",
    minutes: "នាទី", done: "បានបញ្ចប់", step: "ជំហាន", resource: "មើលកម្មវិធីពាក់ព័ន្ធ", badge: "សមិទ្ធផល", locked: "មិនទាន់ដោះសោ", unlocked: "បានដោះសោ" },
};

interface Props {
  locale: Locale;
  progress: CyberProgress;
  status: { xp: number; level: number; levelPercent: number; finishedIds: string[]; badges: { apprentice: boolean; runner: boolean; pioneer: boolean } };
  ready: boolean;
  onToggleStep: (id: string) => void;
  onExploreApp: (id: string) => void;
}

export function PowerSkillsDashboard({ locale, progress, status, ready, onToggleStep, onExploreApp }: Props) {
  const t = text[locale];
  return <section id="power-skills" className="power-skills wrap" aria-labelledby="power-skills-title">
    <div className="skills-header"><div><span className="section-index">{t.index}</span><h2 id="power-skills-title">{t.title}</h2><p>{t.intro}</p></div></div>
    <div className="skill-layout">
      <aside className="xp-panel" aria-label={t.status}>
        <div className="xp-topline"><Zap size={18} aria-hidden="true" /><span>{t.status}</span></div>
        <div className="xp-total"><strong>{ready ? status.xp : "—"}</strong><span>{t.xp}</span></div>
        <div className="xp-level"><span>{t.level} {ready ? status.level : "—"}</span><span>{t.progress}</span></div>
        <div className="xp-track" role="progressbar" aria-label={t.progress} aria-valuemin={0} aria-valuemax={120} aria-valuenow={ready ? status.xp % 120 : 0}><span style={{ width: `${ready ? status.levelPercent : 0}%` }} /></div>
        <p className="xp-pace">{t.pace}</p>
        <div className="xp-badges"><h3>{t.badge}</h3>{badges.map((badge) => {
          const earned = ready && status.badges[badge.key];
          return <div className={`xp-badge ${earned ? "earned" : ""}`} key={badge.key} title={badge.how[locale]}>
            <span className="badge-symbol">{earned ? <Check size={16} /> : <LockKeyhole size={15} />}</span>
            <span><strong>{badge.name[locale]}</strong><small>{badge.how[locale]}</small></span>
            <span className="sr-only">{earned ? t.unlocked : t.locked}</span>
          </div>;
        })}</div>
      </aside>

      <div className="pathway-grid">{pathways.map((pathway, index) => {
        const Icon = icons[pathway.icon];
        const count = pathway.steps.filter((step) => progress.completedStepIds.includes(step.id)).length;
        const complete = status.finishedIds.includes(pathway.id);
        const related = apps.find((app) => app.id === pathway.relatedAppId);
        return <article className={`pathway-card ${complete ? "pathway-complete" : ""}`} key={pathway.id}>
          <div className="pathway-top"><span className="pathway-icon"><Icon size={22} aria-hidden="true" /></span><span className="pathway-index">{String(index + 1).padStart(2, "0")} / {pathway.minutes} {t.minutes}</span></div>
          <h3>{pathway.title[locale]}</h3><p className="pathway-promise">{pathway.promise[locale]}</p>
          <div className="pathway-progress"><span>{count}/{pathway.steps.length} {t.step}</span><span>{complete ? t.done : `+${pathway.steps.length * 20 + 50} XP`}</span></div>
          <div className="pathway-track"><span style={{ width: `${count / pathway.steps.length * 100}%` }} /></div>
          <div className="pathway-steps">{pathway.steps.map((step) => {
            const checked = progress.completedStepIds.includes(step.id);
            return <label className={`skill-step ${checked ? "step-done" : ""}`} key={step.id}>
              <input type="checkbox" checked={checked} disabled={!ready} onChange={() => onToggleStep(step.id)} />
              <span className="step-copy"><strong>{step.title[locale]}</strong><small>{step.detail[locale]}</small></span>
            </label>;
          })}</div>
          {related?.url && <a className="pathway-resource" href={related.url} target="_blank" rel="noopener noreferrer" onClick={() => onExploreApp(related.id)}>{t.resource}: {related.title[locale]} <ExternalLink size={15} aria-hidden="true" /></a>}
        </article>;
      })}</div>
    </div>
  </section>;
}
