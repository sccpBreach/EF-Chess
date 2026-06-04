import { cn } from "@/lib/utils";
import { PIECES } from "@/assets/pieces";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"] as const;
const RANKS = [8, 7, 6, 5, 4, 3, 2, 1] as const;

// Starting position in piece-letter notation (uppercase = white, lowercase = black)
const STARTING: Record<string, string> = {
  a8: "r", b8: "n", c8: "b", d8: "q", e8: "k", f8: "b", g8: "n", h8: "r",
  a7: "p", b7: "p", c7: "p", d7: "p", e7: "p", f7: "p", g7: "p", h7: "p",
  a2: "P", b2: "P", c2: "P", d2: "P", e2: "P", f2: "P", g2: "P", h2: "P",
  a1: "R", b1: "N", c1: "B", d1: "Q", e1: "K", f1: "B", g1: "N", h1: "R",
};

export function ChessBoard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative aspect-square w-full max-w-[640px] overflow-hidden rounded-md border border-border-strong shadow-panel",
        "ring-1 ring-inset ring-black/30",
        className,
      )}
    >
      <div className="grid h-full w-full grid-cols-8 grid-rows-8">
        {RANKS.map((rank, ri) =>
          FILES.map((file, fi) => {
            const sq = `${file}${rank}`;
            const isLight = (ri + fi) % 2 === 0;
            const piece = STARTING[sq];
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
                {piece && (
                  <img
                    src={PIECES[piece]}
                    alt={piece}
                    draggable={false}
                    className="pointer-events-none h-[85%] w-[85%] select-none"
                    style={{ filter: "drop-shadow(0 2px 2px oklch(0 0 0 / 0.35))" }}
                  />
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}
