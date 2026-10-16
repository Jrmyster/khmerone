import { Chess, type Square } from "chess.js";

export const CHESS_PROGRESS_KEY = "khmerone-chess-progress-v1";
export const CHESS_SESSION_KEY = "khmerone-chess-session-v1";
export const PIECE_GLYPHS = { k: "♚", q: "♛", r: "♜", b: "♝", n: "♞", p: "♟" } as const;

export function boardSquares(flipped = false): Square[] {
  const files = flipped ? "hgfedcba" : "abcdefgh";
  const ranks = flipped ? "12345678" : "87654321";
  return [...ranks].flatMap((rank) => [...files].map((file) => `${file}${rank}` as Square));
}

/** PGN preserves repetition history and the initial position of a lesson. */
export function copyGame(game: Chess): Chess {
  const next = new Chess();
  next.loadPgn(game.pgn());
  return next;
}

export function playCoordinate(game: Chess, coordinate: string): Chess | null {
  if (!/^[a-h][1-8][a-h][1-8][qrbn]?$/.test(coordinate)) return null;
  try {
    const legal = game.moves({ square: coordinate.slice(0, 2) as Square, verbose: true }).some((move) => move.to === coordinate.slice(2, 4) && move.promotion === coordinate[4]);
    if (!legal) return null;
    const next = copyGame(game);
    next.move({ from: coordinate.slice(0, 2), to: coordinate.slice(2, 4), promotion: coordinate[4] });
    return next;
  } catch { return null; }
}

export function cleanCompleted(value: unknown, allowed: readonly string[]): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.filter((id): id is string => typeof id === "string" && allowed.includes(id)))];
}

export type PositionStatus = "checkmate" | "stalemate" | "repetition" | "material" | "draw" | "check" | "playing";
export function positionStatus(game: Chess): PositionStatus {
  if (game.isCheckmate()) return "checkmate";
  if (game.isStalemate()) return "stalemate";
  if (game.isThreefoldRepetition()) return "repetition";
  if (game.isInsufficientMaterial()) return "material";
  if (game.isDraw()) return "draw";
  return game.isCheck() ? "check" : "playing";
}
