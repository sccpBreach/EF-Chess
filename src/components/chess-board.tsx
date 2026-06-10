import { useMemo, useState } from "react";
import type { Square } from "chess.js";
import { Chess } from "chess.js";
import { cn } from "@/lib/utils";
import { PIECES } from "@/assets/pieces";
import type { ChessGameApi } from "@/lib/chess/use-chess-game";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

interface Props {
  game: ChessGameApi;
  className?: string;
}

export function ChessBoard({ game, className }: Props) {
  const [selected, setSelected] = useState<Square | null>(null);
  const [dragOver, setDragOver] = useState<Square | null>(null);

  const board = useMemo(() => new Chess(game.fen).board(), [game.fen]);

  const flipped = game.orientation === "b";
  const ranks = flipped ? [...RANKS].reverse() : RANKS;
  const files = flipped ? [...FILES].reverse() : FILES;

  const legalTargets = useMemo(
    () => (selected ? new Set(game.legalMovesFrom(selected)) : new Set<string>()),
    [selected, game],
  );

  const lastMove = game.history[game.ply - 1];
  const lastFrom = lastMove?.from as Square | undefined;
  const lastTo = lastMove?.to as Square | undefined;

  const handleSquareClick = (sq: Square) => {
    if (!game.isAtLive) return;
    if (selected) {
      if (selected === sq) {
        setSelected(null);
        return;
      }
      if (legalTargets.has(sq)) {
        game.tryMove(selected, sq);
        setSelected(null);
        return;
      }
    }
    // Select if there's a piece of side-to-move there
    const replay = new Chess(game.fen);
    const piece = replay.get(sq);
    if (piece && piece.color === game.turn) {
      setSelected(sq);
    } else {
      setSelected(null);
    }
  };

  return (
    <div
      className={cn(
        "relative aspect-square w-full max-w-[640px] overflow-hidden rounded-md border border-border-strong shadow-panel",
        "ring-1 ring-inset ring-black/30 select-none",
        className,
      )}
    >
      <div className="grid h-full w-full grid-cols-8 grid-rows-8">
        {ranks.map((rank, ri) =>
          files.map((file, fi) => {
            const sq = `${file}${rank}` as Square;
            const isLight = (ri + fi) % 2 === 0;
            const row = board[8 - rank];
            const cell = row?.[FILES.indexOf(file)];
            const piece = cell ? (cell.color === "w" ? cell.type.toUpperCase() : cell.type) : null;

            const isSelected = selected === sq;
            const isTarget = legalTargets.has(sq);
            const isLast = sq === lastFrom || sq === lastTo;
            const isDragOver = dragOver === sq;
            const hasEnemy = isTarget && piece;

            return (
              <div
                key={sq}
                onClick={() => handleSquareClick(sq)}
                onDragOver={(e) => {
                  if (isTarget) {
                    e.preventDefault();
                    setDragOver(sq);
                  }
                }}
                onDragLeave={() => setDragOver((d) => (d === sq ? null : d))}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(null);
                  if (selected && legalTargets.has(sq)) {
                    game.tryMove(selected, sq);
                    setSelected(null);
                  }
                }}
                className="relative flex items-center justify-center"
                style={{
                  backgroundColor: isLight
                    ? "var(--color-board-light)"
                    : "var(--color-board-dark)",
                }}
              >
                {/* Highlight layers */}
                {isLast && (
                  <span className="pointer-events-none absolute inset-0 bg-primary/25" />
                )}
                {isSelected && (
                  <span className="pointer-events-none absolute inset-0 bg-primary/35" />
                )}
                {isDragOver && (
                  <span className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-primary" />
                )}

                {/* Coordinate labels */}
                {fi === 0 && (
                  <span
                    className="absolute left-1 top-0.5 font-mono text-[10px] font-semibold leading-none"
                    style={{ color: isLight ? "var(--color-board-dark)" : "var(--color-board-light)" }}
                  >
                    {rank}
                  </span>
                )}
                {ri === 7 && (
                  <span
                    className="absolute bottom-0.5 right-1 font-mono text-[10px] font-semibold leading-none"
                    style={{ color: isLight ? "var(--color-board-dark)" : "var(--color-board-light)" }}
                  >
                    {file}
                  </span>
                )}

                {/* Piece */}
                {piece && (
                  <img
                    src={PIECES[piece]}
                    alt={piece}
                    draggable={game.isAtLive && cell?.color === game.turn}
                    onDragStart={(e) => {
                      if (!game.isAtLive || cell?.color !== game.turn) {
                        e.preventDefault();
                        return;
                      }
                      setSelected(sq);
                      e.dataTransfer.effectAllowed = "move";
                      e.dataTransfer.setData("text/plain", sq);
                    }}
                    onDragEnd={() => setDragOver(null)}
                    className="pointer-events-auto relative z-10 h-[88%] w-[88%] cursor-grab select-none active:cursor-grabbing"
                    style={{ filter: "drop-shadow(0 2px 2px oklch(0 0 0 / 0.35))" }}
                  />
                )}

                {/* Legal-move indicator */}
                {isTarget && !hasEnemy && (
                  <span className="pointer-events-none absolute h-1/3 w-1/3 rounded-full bg-foreground/35" />
                )}
                {isTarget && hasEnemy && (
                  <span className="pointer-events-none absolute inset-1 rounded-full ring-[3px] ring-inset ring-foreground/45" />
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
