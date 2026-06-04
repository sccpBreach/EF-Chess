import { BookOpen, Copy } from "lucide-react";

export function OpeningStrip({ name = "King's Pawn Opening", eco = "C20" }: { name?: string; eco?: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border bg-secondary/30 px-5 py-2.5">
      <div className="flex items-center gap-2 min-w-0">
        <BookOpen className="h-3.5 w-3.5 shrink-0 text-primary" strokeWidth={1.75} />
        <p className="truncate font-display text-[13px] text-foreground">{name}</p>
        <span className="shrink-0 rounded-sm border border-border-strong px-1.5 py-px font-mono text-[10px] text-muted-foreground">
          {eco}
        </span>
      </div>
      <button
        className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-secondary hover:text-primary"
        aria-label="Copy PGN"
      >
        <Copy className="h-3.5 w-3.5" strokeWidth={1.75} />
      </button>
    </div>
  );
}
