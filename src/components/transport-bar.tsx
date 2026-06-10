import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  onStart: () => void;
  onPrev: () => void;
  onFlip: () => void;
  onNext: () => void;
  onEnd: () => void;
}

export function TransportBar({ onStart, onPrev, onFlip, onNext, onEnd }: Props) {
  const btns = [
    { Icon: ChevronsLeft, label: "Start", onClick: onStart },
    { Icon: ChevronLeft, label: "Previous", onClick: onPrev },
    { Icon: RotateCcw, label: "Flip", onClick: onFlip, center: true },
    { Icon: ChevronRight, label: "Next", onClick: onNext },
    { Icon: ChevronsRight, label: "End", onClick: onEnd },
  ];
  return (
    <div className="flex items-center justify-center gap-1 border-t border-border bg-surface/40 px-3 py-3">
      {btns.map(({ Icon, label, onClick, center }) => (
        <button
          key={label}
          aria-label={label}
          onClick={onClick}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors",
            "hover:border-border-strong hover:bg-secondary hover:text-foreground",
            center && "h-10 w-10 border-primary/40 text-primary hover:bg-primary/10 hover:text-primary",
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={2} />
        </button>
      ))}
    </div>
  );
}
