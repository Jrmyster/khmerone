export const gateIds = ["AND", "OR", "NOT", "NAND", "XOR"] as const;
export type GateId = typeof gateIds[number];
export type Bit = 0 | 1;

export function evaluateGate(gate: GateId, a: Bit, b: Bit = 0): Bit {
  switch (gate) {
    case "AND": return a === 1 && b === 1 ? 1 : 0;
    case "OR": return a === 1 || b === 1 ? 1 : 0;
    case "NOT": return a === 0 ? 1 : 0;
    case "NAND": return a === 1 && b === 1 ? 0 : 1;
    case "XOR": return a !== b ? 1 : 0;
  }
}

export function truthTable(gate: GateId): { a: Bit; b: Bit; output: Bit }[] {
  const inputs: [Bit, Bit][] = gate === "NOT" ? [[0, 0], [1, 0]] : [[0, 0], [0, 1], [1, 0], [1, 1]];
  return inputs.map(([a, b]) => ({ a, b, output: evaluateGate(gate, a, b) }));
}

/** Small, lossless highlighter for the curated examples. Never interprets code as HTML. */
export function tokenizeCode(code: string): { text: string; kind: "plain" | "string" | "comment" | "keyword" | "number" | "tag" }[] {
  const expression = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/[^\n]*|#(?![0-9a-fA-F]{3,8}\b)[^\n]*|<!--[\s\S]*?-->|<\/?[A-Za-z][^>]*>|#[0-9a-fA-F]{3,8}\b|\b(?:const|let|for|in|print|range|def|return|function|document|addEventListener)\b|\b\d+\b)/g;
  const tokens: ReturnType<typeof tokenizeCode> = [];
  let previous = 0;
  for (const match of code.matchAll(expression)) {
    const text = match[0];
    const start = match.index!;
    if (start > previous) tokens.push({ text: code.slice(previous, start), kind: "plain" });
    const kind = /^(\/\/|<!--)/.test(text) || (text.startsWith("#") && !/^#[0-9a-fA-F]{3,8}$/.test(text)) ? "comment" : /^["']/.test(text) ? "string" : text.startsWith("<") ? "tag" : /^(\d+|#[0-9a-fA-F]{3,8})$/.test(text) ? "number" : "keyword";
    tokens.push({ text, kind });
    previous = start + text.length;
  }
  if (previous < code.length) tokens.push({ text: code.slice(previous), kind: "plain" });
  return tokens;
}
