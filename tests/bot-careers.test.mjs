import assert from "node:assert/strict";
import { test } from "node:test";
import { startBotCareerSequence } from "../lib/bot-careers.ts";

test("all five professions play twice in order, with full activity and idle durations", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 0 });
  const seen = [];
  const dispose = startBotCareerSequence(beat => seen.push({ ...beat, time: Date.now() }));
  t.after(dispose);
  const expected = [
    ["idle", "idle", 3000],
    ["drill", "retrieve", 450], ["drill", "active", 2000], ["drill", "stow", 450], ["drill", "idle", 3000],
    ["weld", "retrieve", 600], ["weld", "active", 2500], ["weld", "stow", 600], ["weld", "idle", 3000],
    ["textbook", "retrieve", 450], ["textbook", "active", 2000], ["textbook", "snap", 300], ["textbook", "stow", 450], ["textbook", "idle", 3000],
    ["doctor", "retrieve", 450], ["doctor", "active", 4000], ["doctor", "stow", 450],
    ["telescope", "retrieve", 450], ["telescope", "extend", 400], ["telescope", "active", 3000], ["telescope", "collapse", 400], ["telescope", "stow", 450],
    ["idle", "idle", 1000],
  ];
  let elapsed = 0;
  for (const [stage, phase, duration] of [...expected, ...expected.slice(1)]) {
    assert.deepEqual(seen.at(-1), { stage, phase, duration, time: elapsed });
    const count = seen.length;
    t.mock.timers.tick(duration - 1);
    assert.equal(seen.length, count, `${stage}/${phase} must remain for its entire duration`);
    t.mock.timers.tick(1);
    elapsed += duration;
    assert.equal(seen.length, count + 1, "only one next beat fires at the boundary");
  }
});

for (const stage of ["doctor", "telescope"]) test(`unmount or pause during ${stage} cancels all future stage callbacks`, (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let latest;
  let count = 0;
  const dispose = startBotCareerSequence(beat => { latest = beat; count++; });
  while (latest.stage !== stage || latest.phase !== "active") t.mock.timers.tick(latest.duration);
  t.mock.timers.tick(1500);
  dispose();
  dispose();
  const before = count;
  t.mock.timers.tick(120000);
  assert.equal(count, before);
});

test("pause/resume and Strict Mode effect cleanup cannot create overlapping sequences", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const oldBeats = [];
  const disposeOld = startBotCareerSequence(beat => oldBeats.push(beat));
  t.mock.timers.tick(3000);
  disposeOld();
  const oldCount = oldBeats.length;
  const newBeats = [];
  const disposeNew = startBotCareerSequence(beat => newBeats.push(beat));
  t.after(disposeNew);
  t.mock.timers.tick(2999);
  assert.equal(newBeats.length, 1);
  t.mock.timers.tick(1);
  assert.equal(newBeats.length, 2);
  assert.equal(newBeats[1].stage, "drill");
  assert.equal(oldBeats.length, oldCount);
});

test("a callback can cancel at a cycle boundary without leaving a timeout running", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  let dispose;
  let latest;
  let count = 0;
  dispose = startBotCareerSequence(beat => {
    latest = beat;
    count++;
    if (count > 1 && beat.stage === "idle") dispose();
  });
  while (count === 1 || latest.stage !== "idle") t.mock.timers.tick(latest.duration);
  const before = count;
  t.mock.timers.tick(120000);
  assert.equal(count, before);
});
