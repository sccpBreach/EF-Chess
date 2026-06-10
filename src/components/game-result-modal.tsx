import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { GameResult } from "@/lib/chess/use-chess-game";

interface Props {
  result: GameResult | null;
  onClose: () => void;
  onNewGame: () => void;
}

const TITLES: Record<GameResult["kind"], string> = {
  checkmate: "Checkmate",
  stalemate: "Stalemate",
  threefold: "Draw by threefold repetition",
  insufficient: "Draw by insufficient material",
  "fifty-move": "Draw by 50-move rule",
  draw: "Draw",
};

export function GameResultModal({ result, onClose, onNewGame }: Props) {
  const open = result !== null;
  const title = result ? TITLES[result.kind] : "";
  const desc = result?.winner
    ? `${result.winner === "w" ? "White" : "Black"} wins.`
    : "The game is drawn.";

  return (
    <AlertDialog open={open} onOpenChange={(o) => !o && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-display">{title}</AlertDialogTitle>
          <AlertDialogDescription>{desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <button
            onClick={onClose}
            className="rounded-md border border-border px-3 py-1.5 text-xs font-medium uppercase tracking-brand text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            Review
          </button>
          <AlertDialogAction onClick={onNewGame}>New game</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
