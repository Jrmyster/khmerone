import { defaultToolkitSettings, resourceKinds, toolkitUnits, type ResourceKind, type ToolkitSettings } from "@/data/teacherToolkit";

export interface ToolkitDraft { settings: ToolkitSettings; kind: ResourceKind; edits: Record<string, string> }
export const defaultToolkitDraft: ToolkitDraft = { settings: defaultToolkitSettings, kind: "lesson", edits: {} };
export const TOOLKIT_DRAFT_KEY = "khmerone-teacher-toolkit-v1";
export function parseToolkitDraft(input: string | null): ToolkitDraft {
  if (!input) return defaultToolkitDraft;
  try {
    const raw = JSON.parse(input);
    if (!raw || typeof raw !== "object") return defaultToolkitDraft;
    const s = raw.settings;
    if (!s || typeof s !== "object") return defaultToolkitDraft;
    const string = (value: unknown, max: number) => typeof value === "string" ? value.slice(0, max) : "";
    const integer = (value: unknown, min: number, max: number, fallback: number) => typeof value === "number" && Number.isInteger(value) && value >= min && value <= max ? value : fallback;
    const edits: Record<string, string> = {};
    if (raw.edits && typeof raw.edits === "object" && !Array.isArray(raw.edits)) {
      for (const [key, value] of Object.entries(raw.edits).slice(0, 64)) {
        if (/^[a-z-]+:(en|km):(lesson|worksheet|quiz|rubric|activity)(:answers)?$/.test(key) && typeof value === "string") edits[key] = value.slice(0, 16000);
      }
    }
    return {
      settings: {
        unitId: toolkitUnits.some((unit) => unit.id === s.unitId) ? s.unitId : defaultToolkitSettings.unitId,
        grade: integer(s.grade, 1, 12, 7), duration: [30, 40, 45, 60, 90].includes(s.duration) ? s.duration : 45,
        students: integer(s.students, 1, 80, 32), title: string(s.title, 120), objective: string(s.objective, 1200), notes: string(s.notes, 2000),
      },
      kind: resourceKinds.includes(raw.kind) ? raw.kind : "lesson", edits,
    };
  } catch { return defaultToolkitDraft; }
}

export async function prepareToolkitOffline(): Promise<void> {
  if (!("serviceWorker" in navigator) || !window.isSecureContext) throw new Error("unsupported");
  const registration = await navigator.serviceWorker.register("/sw.js");
  await registration.update();
  const worker = registration.installing ?? registration.waiting ?? registration.active;
  if (!worker) throw new Error("not-ready");
  if (worker.state !== "activated") {
    await new Promise<void>((resolve, reject) => {
      const cleanup = () => { window.clearTimeout(timer); worker.removeEventListener("statechange", changed); };
      const changed = () => {
        if (worker.state === "activated") { cleanup(); resolve(); }
        else if (worker.state === "redundant") { cleanup(); reject(new Error("worker-failed")); }
      };
      const timer = window.setTimeout(() => { cleanup(); reject(new Error("worker-timeout")); }, 30000);
      worker.addEventListener("statechange", changed);
      changed();
    });
  }
  await new Promise<void>((resolve, reject) => {
    const channel = new MessageChannel();
    const timer = window.setTimeout(() => { channel.port1.close(); reject(new Error("timeout")); }, 120000);
    channel.port1.onmessage = (event) => {
      window.clearTimeout(timer);
      channel.port1.close();
      if (event.data?.ok === true) resolve(); else reject(new Error("download-failed"));
    };
    worker.postMessage({ type: "PREPARE_TEACHER_TOOLKIT" }, [channel.port2]);
  });
}
