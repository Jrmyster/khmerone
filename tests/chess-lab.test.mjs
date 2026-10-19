import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import vm from "node:vm";
import { Chess } from "chess.js";
import { chessLessons, chessPuzzles } from "../data/chessLessons.ts";
import { chessCopy } from "../locales/chess.ts";
import { boardSquares, cleanCompleted, copyGame, playCoordinate, positionStatus } from "../lib/chess-lab.ts";

test("all authored exercises start legally and their supplied solutions are legal", () => {
  assert.equal(new Set([...chessLessons, ...chessPuzzles].map((item) => item.id)).size, 14);
  for (const exercise of [...chessLessons, ...chessPuzzles]) {
    const game = new Chess(exercise.fen);
    for (const move of exercise.solution) {
      assert.ok(playCoordinate(game, move), `${exercise.id}: ${move}`);
    }
    for (const key of ["title", "explanation", "goal", "hint"]) {
      assert.ok(exercise[key].en.length > 5);
      assert.match(exercise[key].km, /[\u1780-\u17ff]/);
    }
  }
});

test("puzzle outcomes teach the advertised tactical facts", () => {
  const solve = (id) => { const puzzle = chessPuzzles.find((item) => item.id === id); return playCoordinate(new Chess(puzzle.fen), puzzle.solution[0]); };
  assert.equal(solve("free-queen").get("a7").type, "r");
  assert.equal(solve("knight-fork").isCheck(), true);
  assert.equal(solve("knight-fork").isAttacked("a8", "w"), true);
  assert.equal(solve("mate-one").isCheckmate(), true);
  assert.equal(solve("rook-mate").isCheckmate(), true);
});

test("special moves update all affected squares, with explicit promotion choices", () => {
  const lesson = (id) => new Chess(chessLessons.find((item) => item.id === id).fen);
  const castled = playCoordinate(lesson("castle"), "e1g1");
  assert.equal(castled.get("g1").type, "k"); assert.equal(castled.get("f1").type, "r"); assert.equal(castled.get("h1"), undefined);
  const captured = playCoordinate(lesson("en-passant"), "e5d6");
  assert.equal(captured.get("d6").color, "w"); assert.equal(captured.get("d5"), undefined);
  for (const piece of ["q", "r", "b", "n"]) assert.equal(playCoordinate(lesson("promotion"), `a7a8${piece}`).get("a8").type, piece);
  const check = lesson("check"); assert.equal(check.isCheck(), true); assert.equal(playCoordinate(check, "c1e3").isCheck(), false);
  assert.equal(playCoordinate(new Chess("4kr2/8/8/8/8/8/8/4K2R w K - 0 1"), "e1g1"), null);
});

test("illegal and malformed moves cannot mutate the original game", () => {
  const game = new Chess(), before = game.fen();
  for (const move of ["e2e5", "e7e5", "a9a1", "__proto__", "e2e4q", "e1e2"]) assert.equal(playCoordinate(game, move), null, move);
  assert.equal(game.fen(), before);
});

test("game cloning and saved PGN retain repetition history", () => {
  let game = new Chess();
  for (const move of ["g1f3", "g8f6", "f3g1", "f6g8", "g1f3", "g8f6", "f3g1", "f6g8"]) game = playCoordinate(game, move);
  assert.equal(positionStatus(game), "repetition");
  assert.equal(positionStatus(copyGame(game)), "repetition");
  const restored = new Chess(); restored.loadPgn(game.pgn()); assert.equal(restored.history().length, 8);
});

test("both board orientations contain each square exactly once", () => {
  const normal = boardSquares(), flipped = boardSquares(true);
  assert.equal(normal.length, 64); assert.equal(new Set(normal).size, 64);
  assert.equal(normal[0], "a8"); assert.equal(normal.at(-1), "h1"); assert.deepEqual(flipped, normal.toReversed());
});

test("progress rejects unknown and duplicate ids; interface text has a Khmer counterpart", () => {
  assert.deepEqual(cleanCompleted(["rook", "rook", 5, "unknown", "pawn"], ["rook", "pawn"]), ["rook", "pawn"]);
  assert.deepEqual(cleanCompleted({ rook: true }, ["rook"]), []);
  assert.deepEqual(Object.keys(chessCopy.en), Object.keys(chessCopy.km));
  for (const [key, value] of Object.entries(chessCopy.km)) {
    assert.ok(value.trim()); if (!["view2d", "view3d"].includes(key)) assert.match(value, /[\u1780-\u17ff]/, key);
  }
});

const source = await readFile(new URL("../public/sw.js", import.meta.url), "utf8");
function offlineHarness(fail = false, assets = ["/assets/chess.js", "/chess/stockfish.js", "/chess/stockfish-19-lite-single.wasm"]) {
  const handlers = {}, entries = new Map(), cache = { put: async (key, value) => entries.set(key, value), match: async (key) => entries.get(typeof key === "string" ? key : new URL(key.url).pathname) };
  const context = {
    self: { location: { origin: "https://khmerone.test" }, addEventListener: (name, callback) => { handlers[name] = callback; } },
    caches: { open: async () => cache }, URL, Response,
    fetch: async (path) => {
      if (path === "/chess-offline-assets.json") return Response.json({ assets });
      if (path.endsWith(".wasm") && fail) return new Response("Missing", { status: 404 });
      if (path === "/chess") return new Response("<html>Chess</html>", { headers: { "Content-Type": "text/html" } });
      return new Response("asset");
    },
  };
  vm.runInNewContext(source, context);
  return { handlers, entries, context };
}

test("offline chess stores its public page only after every engine and UI asset succeeds", async () => {
  for (const fail of [false, true]) {
    const harness = offlineHarness(fail); let result, promise;
    harness.handlers.message({ data: { type: "PREPARE_CHESS" }, ports: [{ postMessage: (value) => { result = value; } }], waitUntil: (pending) => { promise = pending; } });
    await promise; assert.equal(result.ok, !fail); assert.equal(harness.entries.has("/chess"), !fail);
    if (!fail) {
      harness.context.fetch = async () => { throw new Error("offline"); };
      let response;
      harness.handlers.fetch({ request: { url: "https://khmerone.test/chess?lang=km", method: "GET", mode: "navigate", headers: new Headers() }, respondWith: (pending) => { response = pending; } });
      assert.equal(await (await response).text(), "<html>Chess</html>");
    }
  }
});

test("offline manifests cannot cache foreign origins, private routes or arbitrary files", async () => {
  for (const path of ["https://elsewhere.test/assets/x.js", "/api/private.js", "/assets/../private.js", "/assets/x.js?token=secret"]) {
    const harness = offlineHarness(false, [path]); let result, promise;
    harness.handlers.message({ data: { type: "PREPARE_CHESS" }, ports: [{ postMessage: (value) => { result = value; } }], waitUntil: (pending) => { promise = pending; } });
    await promise; assert.equal(result.ok, false); assert.equal(harness.entries.size, 0);
  }
});
