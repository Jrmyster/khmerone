"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { Chess, type Square, type PieceSymbol } from "chess.js";
import { ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Crown, Download, Flag, Lightbulb, RotateCcw, Sparkles, Swords, Trophy, Volume2, WifiOff } from "lucide-react";
import { KhmerOneBar } from "@/components/KhmerOneBar";
import { ChessBoard3D } from "@/components/ChessBoard3D";
import { chessLessons, chessPuzzles } from "@/data/chessLessons";
import { chessCopy } from "@/locales/chess";
import { boardSquares, CHESS_PROGRESS_KEY, CHESS_SESSION_KEY, cleanCompleted, copyGame, PIECE_GLYPHS, playCoordinate, positionStatus } from "@/lib/chess-lab";
import { useChessComputer, type ComputerLevel } from "@/hooks/useChessComputer";
import { useCyberProgress } from "@/hooks/useCyberProgress";
import type { Locale } from "@/types/app";

type Mode = "learn" | "practice" | "play";
type Opponent = "computer" | "local";
type Notice = "correct" | "wrong" | "illegal" | "resume" | "fresh" | null;
const allIds = [...chessLessons, ...chessPuzzles].map((item) => item.id);
const storedLocale = (): Locale => {
  try { return localStorage.getItem("khmerone-locale") === "en" ? "en" : "km"; } catch { return "km"; }
};
function subscribeLocale(callback: () => void) {
  window.addEventListener("storage", callback); window.addEventListener("khmerone-locale-change", callback);
  return () => { window.removeEventListener("storage", callback); window.removeEventListener("khmerone-locale-change", callback); };
}

export function ChessLab() {
  const savedLocale = useSyncExternalStore(subscribeLocale, storedLocale, (): Locale => "km");
  const [sessionLocale, setSessionLocale] = useState<Locale | null>(null);
  const locale = sessionLocale ?? savedLocale;
  const t = chessCopy[locale];
  const [mode, setMode] = useState<Mode>("learn");
  const [index, setIndex] = useState(0);
  const [game, setGame] = useState(() => new Chess(chessLessons[0].fen));
  const [selected, setSelected] = useState<Square | null>(null);
  const [promotion, setPromotion] = useState<{ from: Square; to: Square } | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [storageOk, setStorageOk] = useState(true);
  const [solved, setSolved] = useState(false);
  const [hint, setHint] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [opponent, setOpponent] = useState<Opponent>("computer");
  const [level, setLevel] = useState<ComputerLevel>("gentle");
  const [view, setView] = useState<"2d" | "3d">("3d");
  const [flipped, setFlipped] = useState(false);
  const [viewKey, setViewKey] = useState(0);
  const [fallback, setFallback] = useState(false);
  const [retry, setRetry] = useState(0);
  const [sound, setSound] = useState(false);
  const [offline, setOffline] = useState<"idle" | "preparing" | "ready" | "error">("idle");
  const gameRef = useRef(game);
  const savedGame = useRef<string | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<AudioContext | null>(null);
  const promotionRef = useRef<HTMLDialogElement>(null);
  const cyber = useCyberProgress();
  const list = mode === "practice" ? chessPuzzles : chessLessons;
  const exercise = list[index] ?? list[0];
  const history = game.history({ verbose: true });
  const lastMove = history.at(-1) ?? null;
  const destinations = selected ? game.moves({ square: selected, verbose: true }).map((move) => move.to) : [];
  const status = positionStatus(game);
  const computerTurn = ready && mode === "play" && opponent === "computer" && game.turn() === "b" && !game.isGameOver();

  useEffect(() => { gameRef.current = game; }, [game]);
  useEffect(() => { document.documentElement.lang = locale; }, [locale]);
  useEffect(() => { if (promotion) promotionRef.current?.showModal(); }, [promotion]);
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      try {
        setCompleted(cleanCompleted(JSON.parse(localStorage.getItem(CHESS_PROGRESS_KEY) || "[]"), allIds));
        savedGame.current = localStorage.getItem(CHESS_SESSION_KEY);
        const lang = new URLSearchParams(location.search).get("lang");
        if (lang === "km" || lang === "en") {
          localStorage.setItem("khmerone-locale", lang); setSessionLocale(lang);
        }
      } catch { setStorageOk(false); }
      setReady(true);
    });
    if ("serviceWorker" in navigator) void navigator.serviceWorker.register("/sw.js").catch(() => {});
    return () => { cancelAnimationFrame(frame); void audioRef.current?.close(); };
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(CHESS_PROGRESS_KEY, JSON.stringify(completed));
      if (mode === "play") { const pgn = game.pgn(); savedGame.current = pgn; localStorage.setItem(CHESS_SESSION_KEY, pgn); }
    } catch { /* Session remains usable without persistent storage. */ }
  }, [completed, game, ready, mode]);

  function setPosition(next: Chess) { gameRef.current = next; setGame(next); setSelected(null); setPromotion(null); }
  function chime() {
    if (!sound) return;
    try {
      const audio = audioRef.current ?? new AudioContext(); audioRef.current = audio; void audio.resume();
      const oscillator = audio.createOscillator(), gain = audio.createGain(); oscillator.connect(gain); gain.connect(audio.destination);
      oscillator.type = "sine"; oscillator.frequency.setValueAtTime(520, audio.currentTime); oscillator.frequency.exponentialRampToValueAtTime(340, audio.currentTime + .09);
      gain.gain.setValueAtTime(.07, audio.currentTime); gain.gain.exponentialRampToValueAtTime(.001, audio.currentTime + .1); oscillator.start(); oscillator.stop(audio.currentTime + .11);
    } catch { /* Audio is optional. */ }
  }
  const engineStatus = useChessComputer(game.fen(), computerTurn, level, retry, (coordinate) => {
    const next = playCoordinate(gameRef.current, coordinate);
    if (next) { setPosition(next); chime(); if (next.isGameOver()) cyber.completeStep("chess-game"); }
  });

  function changeLocale(next: Locale) {
    setSessionLocale(next);
    try { localStorage.setItem("khmerone-locale", next); } catch { setStorageOk(false); }
    window.dispatchEvent(new Event("khmerone-locale-change"));
  }
  function startExercise(nextMode: Mode, nextIndex = 0) {
    setMode(nextMode); setIndex(nextIndex); setHint(false); setSolved(false); setNotice(null); setFlipped(false);
    if (nextMode === "play") {
      const restored = new Chess();
      try { if (savedGame.current) { restored.loadPgn(savedGame.current); setNotice("resume"); } } catch { /* Ignore an invalid saved game. */ }
      setPosition(restored);
    } else { setPosition(new Chess((nextMode === "practice" ? chessPuzzles : chessLessons)[nextIndex].fen)); }
  }
  function submitMove(from: Square, to: Square, piece?: PieceSymbol) {
    const coordinate = `${from}${to}${piece ?? ""}`;
    const next = playCoordinate(game, coordinate);
    if (!next) { setNotice("illegal"); setPromotion(null); return; }
    if (mode !== "play" && !exercise.solution.includes(coordinate)) {
      setPosition(new Chess(exercise.fen)); setNotice("wrong"); return;
    }
    setPosition(next); chime(); setNotice(null);
    if (mode !== "play") {
      setSolved(true); setNotice("correct");
      setCompleted((current) => current.includes(exercise.id) ? current : [...current, exercise.id]);
      cyber.completeStep(mode === "learn" ? "chess-move" : "chess-puzzle");
    } else if (next.isGameOver()) { cyber.completeStep("chess-game"); }
  }
  function onSquare(square: Square) {
    if (!ready || promotion || computerTurn || solved || (mode === "play" && game.isGameOver())) return;
    const piece = game.get(square);
    if (piece?.color === game.turn()) { setSelected(square === selected ? null : square); setNotice(null); return; }
    if (!selected) return;
    const moves = game.moves({ square: selected, verbose: true }).filter((move) => move.to === square);
    if (!moves.length) { setNotice("illegal"); return; }
    if (moves.some((move) => move.promotion)) { setPromotion({ from: selected, to: square }); return; }
    submitMove(selected, square);
  }
  function newGame() { savedGame.current = null; setPosition(new Chess()); setNotice("fresh"); }
  function takeBack() {
    const next = copyGame(game);
    next.undo();
    if (opponent === "computer" && next.turn() === "b") next.undo();
    setPosition(next); setNotice(null);
  }
  function keyboard(event: React.KeyboardEvent<HTMLButtonElement>, square: Square) {
    const squares = boardSquares(flipped), current = squares.indexOf(square);
    const offset = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -8, ArrowDown: 8 }[event.key];
    if (offset !== undefined) {
      event.preventDefault(); const destination = squares[Math.max(0, Math.min(63, current + offset))];
      boardRef.current?.querySelector<HTMLButtonElement>(`[data-square="${destination}"]`)?.focus();
    } else if (event.key === "Escape") { setSelected(null); setPromotion(null); }
  }
  async function prepareOffline() {
    setOffline("preparing");
    try {
      if (!("serviceWorker" in navigator)) throw new Error("Unavailable");
      const registration = await navigator.serviceWorker.register("/sw.js");
      await registration.update();
      const active = (await navigator.serviceWorker.ready).active;
      if (!active) throw new Error("Unavailable");
      const channel = new MessageChannel();
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => { channel.port1.close(); reject(new Error("Timeout")); }, 90000);
        channel.port1.onmessage = (event) => { clearTimeout(timeout); channel.port1.close(); if (event.data?.ok) resolve(); else reject(new Error("Download failed")); };
        active.postMessage({ type: "PREPARE_CHESS" }, [channel.port2]);
      });
      setOffline("ready");
    } catch { setOffline("error"); }
  }
  function saveGame() {
    const blob = new Blob([game.pgn()], { type: "application/x-chess-pgn" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "khmerone-chess.pgn"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  const side = game.turn() === "w" ? t.white : t.black;
  const gameMessage = status === "checkmate" ? `${game.turn() === "w" ? t.black : t.white} ${t.wins} · ${t.checkmate}` : status === "check" ? t.check : mode !== "play" || status === "playing" ? t.playing : t[status];
  const squares = boardSquares(flipped);
  const completeCount = list.filter((item) => completed.includes(item.id)).length;

  return <div className="chess-shell" lang={locale}>
    <a className="chess-skip" href="#chess-main">{t.board}</a>
    <KhmerOneBar locale={locale} homeUrl="/#power-skills" />
    <header className="chess-header">
      <Link href="/" className="chess-brand"><span className="chess-brand-mark"><Crown size={25} /></span><span>KHMER ONE<small>{t.name}</small></span></Link>
      <div className="chess-header-actions"><Link href="/#directory" className="chess-back"><ArrowLeft size={16} />{t.back}</Link><div className="chess-language" role="group" aria-label={t.language}>{(["km", "en"] as Locale[]).map((language) => <button key={language} onClick={() => changeLocale(language)} aria-pressed={locale === language}>{language === "km" ? "ខ្មែរ" : "EN"}</button>)}</div></div>
    </header>
    <main id="chess-main" className="chess-main">
      <section className="chess-hero"><div><span className="chess-eyebrow"><Sparkles size={14} />{t.kicker}</span><h1>{t.title}</h1><p>{t.intro}</p></div><div className="chess-hero-stat"><Trophy size={23} /><strong>{completed.length}<span> / {allIds.length}</span></strong><small>{t.completed}</small></div></section>
      <div className="chess-mode-bar"><nav className="chess-modes" aria-label={t.name}>{(["learn", "practice", "play"] as const).map((item) => <button key={item} aria-pressed={mode === item} onClick={() => startExercise(item)}>{item === "learn" ? <BookOpen size={18} /> : item === "practice" ? <Lightbulb size={18} /> : <Swords size={18} />}{t[item]}</button>)}</nav><span className="chess-save-note"><span className="chess-dot" />{storageOk ? t.progress : t.storageUnavailable}</span></div>
      <div className="chess-workspace">
        <section className="chess-board-panel" aria-label={t.board}>
          <div className="chess-board-top"><div><span className={`chess-turn-indicator ${game.turn()}`} /><strong>{side} {t.turn}</strong>{computerTurn && <span className="chess-computer-status" role="status">{engineStatus === "thinking" ? t.thinking : engineStatus === "loading" ? t.engineLoading : ""}</span>}</div><div className="chess-view-picker" role="group" aria-label={t.view}>{(["3d", "2d"] as const).map((item) => <button key={item} aria-pressed={view === item} onClick={() => setView(item)}>{item.toUpperCase()}</button>)}</div></div>
          <div className="chess-board-stage">
            {view === "3d" ? <ChessBoard3D game={game} selected={selected} destinations={destinations} lastMove={lastMove} flipped={flipped} viewKey={viewKey} onSquare={onSquare} onUnavailable={() => { setView("2d"); setFallback(true); }} label={t.board} /> : <div ref={boardRef} className="chess-board-2d" role="group" aria-label={t.board}>{squares.map((square, squareIndex) => {
              const piece = game.get(square), legal = destinations.includes(square), chosen = selected === square;
              const description = `${square}: ${piece ? `${piece.color === "w" ? t.whitePiece : t.blackPiece} ${t[piece.type]}` : t.empty}${legal ? `, ${t.legal}` : ""}`;
              const isDark = (square.charCodeAt(0) + Number(square[1])) % 2 === 0;
              return <button key={square} data-square={square} aria-label={description} aria-pressed={chosen} className={`chess-square ${isDark ? "dark" : "light"} ${chosen ? "chosen" : ""} ${lastMove && [lastMove.from, lastMove.to].includes(square) ? "last" : ""}`} onClick={() => onSquare(square)} onKeyDown={(event) => keyboard(event, square)}>
                {squareIndex % 8 === 0 && <span className="chess-rank" aria-hidden="true">{square[1]}</span>}{squareIndex >= 56 && <span className="chess-file" aria-hidden="true">{square[0]}</span>}
                {piece && <span aria-hidden="true" className={`chess-piece ${piece.color}`}>{PIECE_GLYPHS[piece.type]}</span>}{legal && <span className={`chess-legal ${piece ? "capture" : ""}`} aria-hidden="true" />}
              </button>;
            })}</div>}
            {promotion && <dialog ref={promotionRef} className="chess-promotion" aria-label={t.promotion} onCancel={(event) => { event.preventDefault(); setPromotion(null); }}><strong>{t.promotion}</strong><div>{(["q", "r", "b", "n"] as const).map((piece) => <button key={piece} onClick={() => submitMove(promotion.from, promotion.to, piece)} autoFocus={piece === "q"}><span aria-hidden="true">{PIECE_GLYPHS[piece]}</span>{t[piece]}</button>)}</div><button onClick={() => setPromotion(null)}>{t.cancel}</button></dialog>}
          </div>
          <div className="chess-board-toolbar"><div><button onClick={() => { setFlipped(!flipped); setViewKey(viewKey + 1); }}><RotateCcw size={16} />{t.flip}</button>{view === "3d" && <button onClick={() => setViewKey(viewKey + 1)}>{t.resetView}</button>}</div><button aria-pressed={sound} onClick={() => setSound(!sound)} aria-label={t.sound}><Volume2 size={17} /><span>{sound ? "●" : "○"}</span></button></div>
          <p className="chess-controls">{view === "3d" ? t.controls3d : t.controls}</p>
          <div className={`chess-feedback ${notice === "correct" ? "success" : ""}`} role="status" aria-live="polite" aria-atomic="true">{notice === "correct" ? <Check size={19} /> : <span className="chess-dot" />}<span>{notice ? t[notice] : solved ? t.exerciseDone : gameMessage}</span></div>
          {fallback && <p className="chess-muted" role="status">{t.fallback}</p>}
          {computerTurn && engineStatus === "error" && <div className="chess-engine-error" role="alert"><p>{t.engineError}</p><button onClick={() => setRetry(retry + 1)}>{t.retryEngine}</button><button onClick={() => setOpponent("local")}>{t.local}</button></div>}
        </section>
        <aside className="chess-side-panel">
          {mode !== "play" ? <>
            <div className="chess-side-heading"><span className="chess-eyebrow">{mode === "learn" ? t.course : t.practice}</span><span>{completeCount}/{list.length}</span></div>
            <div className="chess-course-progress"><span style={{ width: `${completeCount / list.length * 100}%` }} /></div>
            <label className="chess-exercise-select"><span>{mode === "learn" ? t.lessons : t.puzzles}</span><select value={index} onChange={(event) => startExercise(mode, Number(event.target.value))}>{list.map((item, itemIndex) => <option value={itemIndex} key={item.id}>{completed.includes(item.id) ? "✓ " : ""}{item.title[locale]}</option>)}</select></label>
            <h2>{exercise.title[locale]}</h2><p className="chess-lesson-copy">{exercise.explanation[locale]}</p>
            <div className="chess-challenge"><span className="chess-eyebrow"><Flag size={14} />{t.goal}</span><p>{exercise.goal[locale]}</p></div>
            {hint && <p className="chess-hint"><Lightbulb size={18} />{exercise.hint[locale]}</p>}
            <div className="chess-lesson-actions"><button className="chess-primary" onClick={() => setHint(!hint)} aria-expanded={hint}><Lightbulb size={16} />{t.hint}</button><button onClick={() => startExercise(mode, index)}><RotateCcw size={16} />{t.retry}</button></div>
            {solved && <button className="chess-next" onClick={() => index + 1 < list.length ? startExercise(mode, index + 1) : startExercise(mode === "learn" ? "practice" : "play")}>{index + 1 < list.length ? t.next : mode === "learn" ? t.practice : t.play}<ArrowRight size={18} /></button>}
            <div className="chess-lesson-list">{list.map((item, itemIndex) => <button key={item.id} aria-current={index === itemIndex ? "step" : undefined} onClick={() => startExercise(mode, itemIndex)}><span>{item.title[locale]}</span>{completed.includes(item.id) ? <Check size={16} /> : <ChevronRight size={16} />}</button>)}</div>
          </> : <>
            <span className="chess-eyebrow">{t.live}</span><h2>{t.play}</h2><p className="chess-muted">{t.untimed}</p>
            <label className="chess-field">{t.opponent}<select value={opponent} onChange={(event) => { setOpponent(event.target.value as Opponent); setSelected(null); }}><option value="computer">{t.computer}</option><option value="local">{t.local}</option></select></label>
            {opponent === "computer" && <label className="chess-field">{t.level}<select value={level} onChange={(event) => setLevel(event.target.value as ComputerLevel)}>{(["gentle", "steady", "challenge"] as const).map((value) => <option key={value} value={value}>{t[value]}</option>)}</select></label>}
            <div className="chess-lesson-actions"><button className="chess-primary" onClick={newGame}><Swords size={17} />{t.newGame}</button><button onClick={takeBack} disabled={!history.length}><RotateCcw size={16} />{t.undo}</button></div>
            <div className="chess-move-journal"><h3>{t.history}</h3>{history.length ? <ol>{Array.from({ length: Math.ceil(history.length / 2) }, (_, row) => <li key={row}><span>{row + 1}.</span><code>{history[row * 2].san}</code><code>{history[row * 2 + 1]?.san ?? "…"}</code></li>)}</ol> : <p>{t.noMoves}</p>}</div>
            <button className="chess-export" onClick={saveGame} disabled={!history.length}><Download size={16} />{t.download}</button>
          </>}
          <p className="chess-kind-note"><Sparkles size={16} />{t.note}</p>
        </aside>
      </div>
      <footer className="chess-footer"><span>{t.rules} · Khmer One</span><button onClick={prepareOffline} disabled={offline === "preparing" || offline === "ready"}><WifiOff size={16} />{offline === "preparing" ? t.preparing : offline === "ready" ? t.offlineReady : t.offline}</button><a href="/chess/NOTICE.txt" target="_blank" rel="noopener noreferrer">{t.license}</a></footer>
      {offline === "error" && <p className="chess-muted" role="alert">{t.offlineError}</p>}
    </main>
  </div>;
}
