import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, Pencil } from "lucide-react";
import type { Move } from "chess.js";

interface Props {
  history: Move[];
  ply: number;
  onJump: (ply: number) => void;
}

export function MoveList({ history, ply, onJump }: Props) {
  const pairs: Array<[Move | undefined, Move | undefined]> = [];
  for (let i = 0; i < history.length; i += 2) {
    pairs.push([history[i], history[i + 1]]);
  }

  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [ply]);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-2">
        <div className="flex items-center gap-1.5 text-[11px]">
          <button className="flex items-center gap-1 font-medium uppercase tracking-brand text-primary">
            Moves <ChevronDown className="h-3 w-3" />
          </button>
          <span className="text-muted-foreground">·</span>
          <span className="font-mono text-muted-foreground">
            {history.length} ply
          </span>
        </div>
        <button
          className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"
          aria-label="Edit moves"
        >
          <Pencil className="h-3 w-3" strokeWidth={1.75} />
        </button>
      </div>

      <div ref={scrollRef} className="max-h-[260px] min-h-[60px] overflow-y-auto px-2 py-1.5">
        {pairs.length === 0 && (
          <p className="px-3 py-2 text-[11px] text-muted-foreground">
            No moves yet. Click a piece to start.
          </p>
        )}
        {pairs.map(([w, b], i) => {
          const whitePly = i * 2 + 1;
          const blackPly = i * 2 + 2;
          return (
            <div
              key={i}
              className="grid grid-cols-[2.25rem_1fr_1fr] items-center gap-1 rounded-sm px-1 py-0.5 text-[13px] hover:bg-secondary/40"
            >
              <span className="font-mono text-[11px] text-muted-foreground">{i + 1}.</span>
              <MoveCell
                san={w?.san ?? ""}
                active={whitePly === ply}
                onClick={() => w && onJump(whitePly)}
                refEl={whitePly === ply ? activeRef : undefined}
              />
              <MoveCell
                san={b?.san ?? ""}
                active={blackPly === ply}
                onClick={() => b && onJump(blackPly)}
                refEl={blackPly === ply ? activeRef : undefined}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MoveCell({
  san,
  active,
  onClick,
  refEl,
}: {
  san: string;
  active: boolean;
  onClick: () => void;
  refEl?: React.RefObject<HTMLButtonElement | null>;
}) {
  if (!san) return <span />;
  return (
    <button
      ref={refEl}
      onClick={onClick}
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
