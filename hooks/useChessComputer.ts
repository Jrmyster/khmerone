"use client";

import { useEffect, useRef, useState } from "react";

export type ComputerLevel = "gentle" | "steady" | "challenge";
export function useChessComputer(fen: string, enabled: boolean, level: ComputerLevel, retry: number, onMove: (move: string) => void) {
  const [status, setStatus] = useState<"loading" | "thinking" | "error">("loading");
  const callback = useRef(onMove);
  useEffect(() => { callback.current = onMove; }, [onMove]);
  useEffect(() => {
    if (!enabled) return;
    let worker: Worker | undefined;
    let finished = false;
    const frame = requestAnimationFrame(() => setStatus("loading"));
    const fail = () => { if (!finished) { finished = true; setStatus("error"); worker?.terminate(); } };
    const timeout = window.setTimeout(fail, 30000);
    try {
      worker = new Worker("/chess/stockfish.js");
      worker.onerror = fail;
      worker.onmessage = (event: MessageEvent<string>) => {
        if (finished || typeof event.data !== "string") return;
        const line = event.data.trim();
        if (line === "uciok") {
          const skill = { gentle: 0, steady: 5, challenge: 12 }[level];
          worker?.postMessage(`setoption name Skill Level value ${skill}`);
          worker?.postMessage("setoption name Hash value 16");
          worker?.postMessage("isready");
        } else if (line === "readyok") {
          setStatus("thinking");
          worker?.postMessage(`position fen ${fen}`);
          worker?.postMessage(`go depth ${{ gentle: 2, steady: 6, challenge: 10 }[level]} movetime 1000`);
        } else if (line.startsWith("bestmove ")) {
          const coordinate = line.split(/\s+/)[1];
          if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(coordinate)) { fail(); return; }
          finished = true; clearTimeout(timeout); worker?.terminate(); callback.current(coordinate);
        }
      };
      worker.postMessage("uci");
    } catch { queueMicrotask(fail); }
    return () => { finished = true; cancelAnimationFrame(frame); clearTimeout(timeout); worker?.terminate(); };
  }, [fen, enabled, level, retry]);
  return status;
}
