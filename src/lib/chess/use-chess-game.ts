import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Chess, type Move, type Square } from "chess.js";

export type PieceColor = "w" | "b";
export type PromotionPiece = "q" | "r" | "b" | "n";

export interface PendingPromotion {
  from: Square;
  to: Square;
  color: PieceColor;
}

export interface GameResult {
  kind: "checkmate" | "stalemate" | "threefold" | "insufficient" | "fifty-move" | "draw";
  winner: PieceColor | null;
}

/**
 * Chess.js wrapper exposing reactive state:
 * - fen of the currently viewed ply
 * - history (list of SAN moves)
 * - ply index (which move we're viewing)
 * - move / jump / reset / undo / flip controls
 * - pending promotion + game result detection
 */
export function useChessGame() {
  const chessRef = useRef(new Chess());
  const [history, setHistory] = useState<Move[]>([]);
  const [ply, setPly] = useState(0); // 0 = starting position; n = after nth half-move
  const [orientation, setOrientation] = useState<PieceColor>("w");
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);

  // Derived FEN at viewed ply — replay history up to `ply`
  const viewFen = useMemo(() => {
    const replay = new Chess();
    for (let i = 0; i < ply; i++) {
      const m = history[i];
      if (!m) break;
      replay.move({ from: m.from, to: m.to, promotion: m.promotion });
    }
    return replay.fen();
  }, [history, ply]);

  // Live chess instance for legal-move queries always reflects ply view
  const viewChess = useMemo(() => new Chess(viewFen), [viewFen]);

  const turn = viewChess.turn();
  const inCheck = viewChess.inCheck();
  const isAtLive = ply === history.length;

  const detectResult = useCallback((c: Chess): GameResult | null => {
    if (c.isCheckmate()) return { kind: "checkmate", winner: c.turn() === "w" ? "b" : "w" };
    if (c.isStalemate()) return { kind: "stalemate", winner: null };
    if (c.isThreefoldRepetition()) return { kind: "threefold", winner: null };
    if (c.isInsufficientMaterial()) return { kind: "insufficient", winner: null };
    if (c.isDraw()) return { kind: "fifty-move", winner: null };
    return null;
  }, []);

  const legalMovesFrom = useCallback(
    (square: Square): Square[] => {
      const moves = viewChess.moves({ square, verbose: true }) as Move[];
      return moves.map((m) => m.to as Square);
    },
    [viewChess],
  );

  const tryMove = useCallback(
    (from: Square, to: Square, promotion?: PromotionPiece): boolean => {
      // Only allow moves at live position
      if (!isAtLive) {
        // Jump back to ply first by truncating history? Instead: ignore.
        return false;
      }
      const piece = chessRef.current.get(from);
      if (!piece) return false;

      // Detect promotion need
      const isPawn = piece.type === "p";
      const lastRank = piece.color === "w" ? "8" : "1";
      const needsPromotion = isPawn && to[1] === lastRank;

      if (needsPromotion && !promotion) {
        // Verify it's a legal target before opening dialog
        const legal = chessRef.current
          .moves({ square: from, verbose: true })
          .some((m) => (m as Move).to === to);
        if (!legal) return false;
        setPendingPromotion({ from, to, color: piece.color });
        return false;
      }

      try {
        const moved = chessRef.current.move({ from, to, promotion });
        if (!moved) return false;
        const newHistory = chessRef.current.history({ verbose: true }) as Move[];
        setHistory(newHistory);
        setPly(newHistory.length);
        setResult(detectResult(chessRef.current));
        return true;
      } catch {
        return false;
      }
    },
    [isAtLive, detectResult],
  );

  const completePromotion = useCallback(
    (piece: PromotionPiece) => {
      if (!pendingPromotion) return;
      const { from, to } = pendingPromotion;
      setPendingPromotion(null);
      tryMove(from, to, piece);
    },
    [pendingPromotion, tryMove],
  );

  const cancelPromotion = useCallback(() => setPendingPromotion(null), []);

  const jumpTo = useCallback(
    (target: number) => {
      setPly(Math.max(0, Math.min(history.length, target)));
    },
    [history.length],
  );

  const goStart = useCallback(() => setPly(0), []);
  const goEnd = useCallback(() => setPly(history.length), [history.length]);
  const goPrev = useCallback(() => setPly((p) => Math.max(0, p - 1)), []);
  const goNext = useCallback(() => setPly((p) => Math.min(history.length, p + 1)), [history.length]);

  const flip = useCallback(() => setOrientation((o) => (o === "w" ? "b" : "w")), []);

  const reset = useCallback(() => {
    chessRef.current = new Chess();
    setHistory([]);
    setPly(0);
    setResult(null);
    setPendingPromotion(null);
  }, []);

  const loadPgn = useCallback(
    (pgn: string): boolean => {
      try {
        const c = new Chess();
        c.loadPgn(pgn);
        chessRef.current = c;
        const h = c.history({ verbose: true }) as Move[];
        setHistory(h);
        setPly(h.length);
        setResult(detectResult(c));
        setPendingPromotion(null);
        return true;
      } catch {
        return false;
      }
    },
    [detectResult],
  );

  // Keyboard navigation (arrows + F flip)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        goStart();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        goEnd();
      } else if (e.key === "f" || e.key === "F") {
        flip();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext, goStart, goEnd, flip]);

  return {
    fen: viewFen,
    history,
    ply,
    orientation,
    turn,
    inCheck,
    isAtLive,
    result,
    pendingPromotion,
    legalMovesFrom,
    tryMove,
    completePromotion,
    cancelPromotion,
    jumpTo,
    goStart,
    goEnd,
    goPrev,
    goNext,
    flip,
    reset,
    loadPgn,
  };
}

export type ChessGameApi = ReturnType<typeof useChessGame>;
