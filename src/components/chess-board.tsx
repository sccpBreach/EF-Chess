import { cn } from "@/lib/utils";

// Visual-only board for the polished shell. Real piece logic will use chess.js + CM-Chessboard later.
const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

// Unicode chess glyphs — high-fidelity, no asset dependency
const STARTING: Record<string, string> = {
  a8: "♜", b8: "♞", c8: "♝", d8: "♛", e8: "♚", f8: "♝", g8: "♞", h8: "♜",
  a7: "♟", b7: "♟", c7: "♟", d7: "♟", e7: "♟", f7: "♟", g7: "♟", h7: "♟",
  a2: "♙", b2: "♙", c2: "♙", d2: "♙", e2: "♙", f2: "♙", g2: "♙", h2: "♙",
  a1: "♖", b1: "♘", c1: "♗", d1: "♕", e1: "♔", f1: "♗", g1: "♘", h1: "♖",
};

export function ChessBoard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full max-w-[640px] overflow-hidden rounded-md border border-border-strong shadow-panel",
        className,
      )}
    >
      <div className="grid h-full w-full grid-cols-8 grid-rows-8">
        {RANKS.map((rank, ri) =>
          FILES.map((file, fi) => {
            const sq = `${file}${rank}`;
            const isLight = (ri + fi) % 2 === 0;
            const piece = STARTING[sq];
            const isWhite = piece && piece.charCodeAt(0) < 9818;
            return (
              <div
                key={sq}
                className="relative flex items-center justify-center"
                style={{
                  backgroundColor: isLight
                    ? "var(--color-board-light)"
                    : "var(--color-board-dark)",
                }}
              >
                {/* coordinates */}
                {fi === 0 && (
                  <span
                    className="absolute left-1 top-0.5 text-[10px] font-medium"
                    style={{ color: isLight ? "var(--color-board-dark)" : "var(--color-board-light)" }}
                  >
                    {rank}
                  </span>
                )}
                {ri === 7 && (
                  <span
                    className="absolute bottom-0.5 right-1 text-[10px] font-medium"
                    style={{ color: isLight ? "var(--color-board-dark)" : "var(--color-board-light)" }}
                  >
                    {file}
                  </span>
                )}
                {piece && (
                  <span
                    className="select-none text-[clamp(2rem,5vw,3.5rem)] leading-none"
                    style={{
                      color: isWhite ? "oklch(0.98 0.005 80)" : "oklch(0.15 0.01 60)",
                      textShadow: isWhite
                        ? "0 1px 2px oklch(0 0 0 / 0.35)"
                        : "0 1px 1px oklch(1 0 0 / 0.1)",
                    }}
                  >
                    {piece}
                  </span>
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
