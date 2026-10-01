import test, { after } from "node:test";
import assert from "node:assert/strict";
import { readFile, writeFile, mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const temporary = await mkdtemp(join(tmpdir(), "teacher-toolkit-test-"));
after(() => rm(temporary, { recursive: true, force: true }));
async function compile(path, filename, rewrite = (value) => value) {
  const input = await readFile(new URL(path, import.meta.url), "utf8");
  const output = ts.transpileModule(input, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText;
  const target = join(temporary, filename);
  await writeFile(target, rewrite(output));
  return import(pathToFileURL(target).href);
}
const data = await compile("../data/teacherToolkit.ts", "data.mjs");
const utility = await compile("../lib/teacher-toolkit.ts", "utility.mjs", (output) => output.replace('"@/data/teacherToolkit"', '"./data.mjs"'));

test("lesson phases add up to the selected duration", () => {
  for (const duration of [30, 40, 45, 60, 90]) {
    const timings = data.lessonTimings(duration);
    assert.equal(timings.length, 5);
    assert.equal(timings.reduce((a, b) => a + b, 0), duration);
    assert.ok(timings.every((value) => Number.isInteger(value) && value > 0));
  }
});
test("every starter produces all five resources in both languages", () => {
  for (const unit of data.toolkitUnits) {
    assert.equal(unit.questions.length, 5);
    for (const q of unit.questions) {
      assert.ok(q.correct >= 0 && q.correct < q.choices.length);
      assert.ok(q.prompt.en && q.prompt.km && q.explanation.en && q.explanation.km);
    }
    for (const locale of ["en", "km"]) for (const kind of data.resourceKinds) {
      const result = data.buildTeachingResource({ ...data.defaultToolkitSettings, unitId: unit.id }, kind, locale);
      assert.ok(result.body.length > 100);
      assert.equal(result.title, unit.title[locale]);
      assert.equal(Boolean(result.answerKey), kind === "worksheet" || kind === "quiz");
      if (kind === "worksheet" || kind === "quiz") {
        for (const q of unit.questions) {
          assert.ok(result.body.includes(q.prompt[locale]));
          assert.ok(result.body.includes(q.choices[0][locale]));
          assert.ok(result.answerKey.includes(q.explanation[locale]));
        }
      }
    }
  }
});
test("numerical answers and score totals are consistent", () => {
  const answers = (id) => data.toolkitUnits.find((unit) => unit.id === id).questions.map((q) => q.choices[q.correct].en);
  assert.deepEqual(answers("fractions"), ["1/4", "3/4", "2/4", "5", "1"]);
  assert.deepEqual(answers("percentages"), ["20", "18,000 KHR", "1/2", "3,000 KHR", "25%"]);
  assert.deepEqual(answers("circuits"), ["breaks the conducting path", "2 A", "8 V", "ohm (Ω)", "halve"]);
  assert.ok(data.buildTeachingResource(data.defaultToolkitSettings, "quiz", "en").body.includes("Total: 5 points"));
  assert.ok(data.buildTeachingResource(data.defaultToolkitSettings, "rubric", "en").body.includes("Total: 12 points"));
});
test("draft parsing preserves edits and recovers from corrupt or out-of-range data", () => {
  assert.deepEqual(utility.parseToolkitDraft("broken"), utility.defaultToolkitDraft);
  assert.deepEqual(utility.parseToolkitDraft("null"), utility.defaultToolkitDraft);
  const draft = utility.parseToolkitDraft(JSON.stringify({ settings: { ...data.defaultToolkitSettings, grade: -5, duration: 999, students: 800, unitId: "missing" }, kind: "wrong", edits: { "present-simple:km:quiz": "custom", "present-simple:km:quiz:answers": "key", "__proto__": "bad", "invalid": "bad" } }));
  assert.equal(draft.settings.grade, 7); assert.equal(draft.settings.duration, 45); assert.equal(draft.settings.students, 32);
  assert.equal(draft.settings.unitId, "present-simple"); assert.equal(draft.kind, "lesson");
  assert.deepEqual(draft.edits, { "present-simple:km:quiz": "custom", "present-simple:km:quiz:answers": "key" });
});

const sw = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
function workerHarness(failAsset = false) {
  const handlers = {}; const entries = new Map();
  const cache = { match: async (key) => entries.get(typeof key === "string" ? key : new URL(key.url).pathname), put: async (key, value) => entries.set(key, value) };
  const context = {
    self: { location: { origin: "https://example.test" }, addEventListener: (name, handler) => { handlers[name] = handler; }, skipWaiting: async () => {}, clients: { claim: async () => {} } },
    caches: { open: async () => cache, keys: async () => [], delete: async () => true }, URL, Response,
    fetch: async (input) => {
      const path = typeof input === "string" ? input : new URL(input.url).pathname;
      if (path === "/toolkit-offline-assets.json") return Response.json({ assets: ["/assets/app.js", "/assets/style.css"] });
      if (path === "/assets/app.js" && failAsset) return new Response("missing", { status: 404 });
      if (path === "/teacher-toolkit") return new Response("<html>Toolkit</html>", { headers: { "Content-Type": "text/html" } });
      return new Response("asset", { headers: { "Cache-Control": "public, max-age=3600" } });
    },
  };
  vm.runInNewContext(sw, context);
  return { handlers, entries, context };
}
test("offline preparation stores its HTML only after all assets succeed", async () => {
  for (const fail of [false, true]) {
    const harness = workerHarness(fail); let completion; let result;
    harness.handlers.message({ data: { type: "PREPARE_TEACHER_TOOLKIT" }, ports: [{ postMessage: (value) => { result = value; } }], waitUntil: (promise) => { completion = promise; } });
    await completion;
    assert.equal(result.ok, !fail);
    assert.equal(harness.entries.has("/teacher-toolkit"), !fail);
    if (!fail) {
      harness.context.fetch = async () => { throw new Error("offline"); };
      let response;
      harness.handlers.fetch({ request: { url: "https://example.test/teacher-toolkit/", method: "GET", mode: "navigate", headers: new Headers() }, respondWith: (promise) => { response = promise; } });
      assert.equal(await (await response).text(), "<html>Toolkit</html>");
    }
  }
});
