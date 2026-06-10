import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PIECES } from "@/assets/pieces";
import type { PendingPromotion, PromotionPiece } from "@/lib/chess/use-chess-game";

interface Props {
  pending: PendingPromotion | null;
  onSelect: (piece: PromotionPiece) => void;
  onCancel: () => void;
}

const CHOICES: PromotionPiece[] = ["q", "r", "b", "n"];
const LABELS: Record<PromotionPiece, string> = { q: "Queen", r: "Rook", b: "Bishop", n: "Knight" };

export function PromotionDialog({ pending, onSelect, onCancel }: Props) {
  const open = pending !== null;
  const color = pending?.color ?? "w";

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-xs">
        <DialogHeader>
          <DialogTitle className="font-display text-base">Promote pawn</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 gap-2 pt-2">
          {CHOICES.map((p) => {
            const key = color === "w" ? p.toUpperCase() : p;
            return (
              <button
                key={p}
                onClick={() => onSelect(p)}
                className="flex aspect-square items-center justify-center rounded-md border border-border bg-secondary/40 transition-colors hover:border-primary hover:bg-primary/10"
                aria-label={LABELS[p]}
              >
                <img src={PIECES[key]} alt={LABELS[p]} className="h-[78%] w-[78%]" />
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
