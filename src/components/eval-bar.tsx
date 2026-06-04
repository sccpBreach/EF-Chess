import { cn } from "@/lib/utils";

export function EvalBar({ evaluation = 0.0, className }: { evaluation?: number; className?: string }) {
  // Clamp eval to [-5, 5] for visual proportion
  const clamped = Math.max(-5, Math.min(5, evaluation));
  const whitePct = 50 + clamped * 10;
  const display = evaluation >= 0 ? `+${evaluation.toFixed(1)}` : evaluation.toFixed(1);

  return (
    <div
      className={cn(
        "relative flex h-full w-2 flex-col overflow-hidden rounded-sm border border-border-strong",
        className,
      )}
      aria-label={`Evaluation ${display}`}
    >
      <div className="w-full bg-[oklch(0.18_0.01_60)]" style={{ height: `${100 - whitePct}%` }} />
      <div className="w-full bg-[oklch(0.96_0.005_80)]" style={{ height: `${whitePct}%` }} />
      <span
        className={cn(
          "absolute left-1/2 -translate-x-1/2 font-mono text-[9px] font-semibold tabular-nums",
          evaluation >= 0 ? "bottom-0.5 text-[oklch(0.18_0.01_60)]" : "top-0.5 text-[oklch(0.96_0.005_80)]",
        )}
      >
        {display}
      </span>
    </div>
  );
}
