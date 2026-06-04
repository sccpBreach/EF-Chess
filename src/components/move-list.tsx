import { cn } from "@/lib/utils";
import { ChevronDown, Pencil } from "lucide-react";

const MOVES: [string, string?][] = [
  ["e4", "e5"],
  ["Nf3", "Nc6"],
  ["Bb5", "a6"],
  ["Ba4", "Nf6"],
  ["O-O", "Be7"],
  ["Re1", "b5"],
  ["Bb3", "d6"],
  ["c3", "O-O"],
];

export function MoveList({ activeIndex = 3 }: { activeIndex?: number }) {
  // activeIndex = ply index (0-based); white = even, black = odd
  return (
    <div className="flex flex-col">
      {/* Perspective header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-2">
        <div className="flex items-center gap-1.5 text-[11px]">
          <button className="flex items-center gap-1 font-medium uppercase tracking-brand text-primary">
            White <ChevronDown className="h-3 w-3" />
          </button>
          <span className="text-muted-foreground">·</span>
          <button className="font-medium uppercase tracking-brand text-muted-foreground hover:text-foreground">
            Black
          </button>
        </div>
        <button className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground" aria-label="Edit moves">
          <Pencil className="h-3 w-3" strokeWidth={1.75} />
        </button>
      </div>

      {/* Movelist */}
      <div className="max-h-[260px] overflow-y-auto px-2 py-1.5">
        {MOVES.map(([w, b], i) => {
          const whitePly = i * 2;
          const blackPly = i * 2 + 1;
          return (
            <div
              key={i}
              className="grid grid-cols-[2.25rem_1fr_1fr] items-center gap-1 rounded-sm px-1 py-0.5 text-[13px] hover:bg-secondary/40"
            >
              <span className="font-mono text-[11px] text-muted-foreground">{i + 1}.</span>
              <MoveCell san={w} active={whitePly === activeIndex} />
              <MoveCell san={b ?? ""} active={blackPly === activeIndex} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MoveCell({ san, active }: { san: string; active: boolean }) {
  if (!san) return <span />;
  return (
    <button
      className={cn(
        "w-fit rounded-sm px-2 py-0.5 font-mono text-[12.5px] transition-colors",
        active
          ? "bg-primary/20 text-primary ring-1 ring-inset ring-primary/40"
          : "text-foreground hover:bg-secondary",
      )}
    >
      {san}
    </button>
  );
}
