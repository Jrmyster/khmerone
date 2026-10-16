import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import vm from "node:vm";
import { Chess } from "chess.js";

const loader = new URL("../public/chess/stockfish.js", import.meta.url);
test("the actual classic-worker loader fetches its matching WASM and returns a legal move", { skip: !existsSync(loader), timeout: 20000 }, async () => {
  const source = await readFile(loader, "utf8");
  const binary = await readFile(new URL("../public/chess/stockfish.wasm", import.meta.url));
  const game = new Chess(); game.move("e4");
  const requested = [];
  const location = new URL("https://khmerone.test/chess/stockfish.js");
  let started = false, complete, failure, deadline;
  const result = new Promise((resolve, reject) => { complete = resolve; failure = reject; deadline = setTimeout(() => reject(new Error("Engine timed out")), 15000); });
  const worker = {
    location, console, WebAssembly, TextDecoder, TextEncoder, performance, URL, Blob, ReadableStream, Response, Headers, Request, AbortController,
    setTimeout, clearTimeout, onmessage: null, importScripts: () => { throw new Error("Unexpected external script"); },
    fetch: async (url) => {
      const path = String(url); requested.push(path);
      if (path !== "https://khmerone.test/chess/stockfish.wasm") return new Response("Missing", { status: 404 });
      return new Response(binary, { headers: { "Content-Type": "application/wasm" } });
    },
    postMessage: (line) => {
      if (typeof line !== "string") return;
      if (line.trim() === "uciok" && !started) { started = true; worker.onmessage({ data: `position fen ${game.fen()}` }); worker.onmessage({ data: "go depth 2" }); }
      const found = line.match(/^bestmove ([a-h][1-8][a-h][1-8][qrbn]?)/);
      if (found) complete(found[1]);
    },
  };
  worker.self = worker;
  try {
    vm.runInNewContext(source, worker, { filename: "stockfish.js" });
    worker.onmessage({ data: "uci" });
    const bestMove = await result;
    assert.ok(requested.includes("https://khmerone.test/chess/stockfish.wasm"));
    assert.ok(game.moves({ verbose: true }).some((move) => `${move.from}${move.to}${move.promotion ?? ""}` === bestMove));
  } catch (error) { failure(error); await result; }
  finally { clearTimeout(deadline); }
});
