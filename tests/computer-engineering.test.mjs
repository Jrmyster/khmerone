import test from "node:test";
import assert from "node:assert/strict";
import { gateIds, evaluateGate, truthTable, tokenizeCode } from "../lib/digital-logic.ts";
import { gateLessons, codingLessons, languageIds } from "../data/computerEngineering.ts";
import { engineeringCopy } from "../locales/computerEngineering.ts";
import vm from "node:vm";

test("every logic gate agrees with its independent truth table", () => {
  const expected = { AND: [0, 0, 0, 1], OR: [0, 1, 1, 1], NOT: [1, 0], NAND: [1, 1, 1, 0], XOR: [0, 1, 1, 0] };
  for (const gate of gateIds) {
    const rows = truthTable(gate);
    assert.deepEqual(rows.map((row) => row.output), expected[gate]);
    for (const row of rows) assert.equal(evaluateGate(gate, row.a, row.b), row.output);
  }
  assert.equal(evaluateGate("NOT", 0, 1), 1);
  assert.equal(evaluateGate("NOT", 1, 1), 0);
});

test("NAND can invert a bit and XOR plus AND implement half-addition", () => {
  for (const a of [0, 1]) {
    assert.equal(evaluateGate("NAND", a, a), evaluateGate("NOT", a));
    for (const b of [0, 1]) assert.equal(evaluateGate("XOR", a, b) + 2 * evaluateGate("AND", a, b), a + b);
  }
});

test("every core label and every curriculum explanation is bilingual", () => {
  assert.deepEqual(Object.keys(engineeringCopy.en).sort(), Object.keys(engineeringCopy.km).sort());
  for (const key of Object.keys(engineeringCopy.en)) {
    assert.ok(engineeringCopy.en[key].trim());
    assert.match(engineeringCopy.km[key], /[\u1780-\u17ff]/, key);
  }
  for (const lesson of Object.values(gateLessons)) for (const key of ["name", "rule", "application"]) {
    assert.ok(lesson[key].en.length > 5); assert.match(lesson[key].km, /[\u1780-\u17ff]/);
  }
  for (const lesson of Object.values(codingLessons)) {
    assert.equal(lesson.explanations.length, 3);
    for (const text of [lesson.type, lesson.purpose, lesson.challenge, ...lesson.explanations]) {
      assert.ok(text.en.length > 5); assert.match(text.km, /[\u1780-\u17ff]/);
    }
    assert.ok(/^https:\/\/(developer\.mozilla\.org|docs\.python\.org)\//.test(lesson.guide));
  }
});

test("syntax highlighting preserves every source character including Khmer and CSS colors", () => {
  for (const language of languageIds) {
    const source = codingLessons[language].code;
    assert.equal(tokenizeCode(source).map((token) => token.text).join(""), source);
  }
  assert.equal(tokenizeCode("#fbbf24")[0].kind, "number");
  assert.equal(tokenizeCode('# example\nprint("សួស្តី")')[0].kind, "comment");
});

test("the supplied JavaScript listener actually increments its output", () => {
  let listener;
  const output = { textContent: 0 };
  const button = { addEventListener(event, handler) { assert.equal(event, "click"); listener = handler; } };
  vm.runInNewContext(codingLessons.javascript.code, { document: { querySelector(selector) { return selector === "button" ? button : output; } } });
  listener(); listener(); listener();
  assert.equal(output.textContent, 3);
});
