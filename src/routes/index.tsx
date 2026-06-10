import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles, Target, TrendingUp, Zap, Power, Settings2, Plus, RotateCcw } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChessBoard } from "@/components/chess-board";
import { EvalBar } from "@/components/eval-bar";
import { OpeningStrip } from "@/components/opening-strip";
import { MoveList } from "@/components/move-list";
import { TransportBar } from "@/components/transport-bar";
import { PromotionDialog } from "@/components/promotion-dialog";
import { GameResultModal } from "@/components/game-result-modal";
import { useChessGame, type ChessGameApi } from "@/lib/chess/use-chess-game";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Analysis — EFChess" },
      { name: "description", content: "Play, analyze, and study chess positions with a clean, professional board." },
    ],
  }),
  component: AnalysisPage,
});

type Tab = "analysis" | "import" | "repertoire";

function AnalysisPage() {
  const [tab, setTab] = useState<Tab>("analysis");
  const game = useChessGame();

  return (
    <div className="relative flex min-h-screen w-full bg-background">
      <AppSidebar />

      <div className="flex flex-1 flex-col">
        <TopBar game={game} />

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[1fr_440px]">
          {/* Board + eval */}
          <section className="relative flex flex-col items-center justify-center px-6 py-8">
            <PlayerStrip
              side={game.orientation === "w" ? "Black" : "White"}
              name="Opponent"
              rating="—"
              active={game.turn !== game.orientation}
            />

            <div className="my-2 flex w-full max-w-[660px] items-stretch gap-2">
              <EvalBar evaluation={0.0} />
              <ChessBoard game={game} className="flex-1" />
            </div>

            <PlayerStrip
              side={game.orientation === "w" ? "White" : "Black"}
              name="You"
              rating="1842"
              active={game.turn === game.orientation}
              highlighted
            />

            <p className="mt-6 max-w-md text-balance text-center text-xs text-muted-foreground">
              Click a piece to see legal moves. Use ← → to navigate, F to flip the board.
            </p>
          </section>

          {/* Right panel */}
          <aside className="flex flex-col border-l border-border bg-surface lg:bg-panel">
            <div className="flex h-10 shrink-0 items-center justify-between border-b border-border px-2">
              <div className="flex h-full items-center">
                {(["analysis", "import", "repertoire"] as Tab[]).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={cn(
                      "relative h-full px-4 text-[11px] font-medium uppercase tracking-brand transition-colors",
                      tab === t ? "text-primary" : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {t}
                    {tab === t && <span className="absolute inset-x-3 -bottom-px h-px bg-primary" />}
                  </button>
                ))}
              </div>
              <button
                onClick={game.reset}
                className="flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium uppercase tracking-brand text-muted-foreground hover:bg-secondary hover:text-foreground"
                aria-label="Reset board"
              >
                <RotateCcw className="h-3 w-3" /> Reset
              </button>
            </div>

            <div className="flex flex-1 flex-col">
              {tab === "analysis" && <AnalysisTab game={game} />}
              {tab === "import" && <ImportTab game={game} />}
              {tab === "repertoire" && <RepertoireTab />}
            </div>
          </aside>
        </div>
      </div>

      <PromotionDialog
        pending={game.pendingPromotion}
        onSelect={game.completePromotion}
        onCancel={game.cancelPromotion}
      />
      <GameResultModal
        result={game.result}
        onClose={() => {/* keep result visible on board */}}
        onNewGame={game.reset}
      />
    </div>
  );
}

function TopBar({ game }: { game: ChessGameApi }) {
  const status = game.result
    ? game.result.kind === "checkmate"
      ? `Checkmate · ${game.result.winner === "w" ? "White" : "Black"} wins`
      : "Draw"
    : game.inCheck
      ? `Check · ${game.turn === "w" ? "White" : "Black"} to move`
      : `${game.turn === "w" ? "White" : "Black"} to move`;
  return (
    <header className="relative z-10 flex h-12 items-center justify-between border-b border-border bg-background/80 px-5 backdrop-blur">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-[17px] font-medium leading-none">Analysis</h1>
        <span className="hidden h-3 w-px bg-border sm:block" />
        <p className="hidden text-xs text-muted-foreground sm:block">{status}</p>
      </div>
      <div className="flex items-center gap-3">
        <button className="hidden items-center gap-1.5 rounded-md border border-border-strong px-2.5 py-1 text-[11px] font-medium uppercase tracking-brand text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground sm:flex">
          <Sparkles className="h-3 w-3" /> Beta
        </button>
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-[11px] font-semibold text-foreground">
          U
        </div>
      </div>
    </header>
  );
}

function PlayerStrip({
  side,
  name,
  rating,
  active,
  highlighted,
}: {
  side: "White" | "Black";
  name: string;
  rating: string;
  active?: boolean;
  highlighted?: boolean;
}) {
  return (
    <div className={cn("flex w-full max-w-[660px] items-center justify-between px-1 py-1.5", highlighted && "")}>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full transition-colors",
            side === "White" ? "bg-primary" : "bg-muted-foreground",
            active && "ring-2 ring-primary/40",
          )}
        />
        <span className="text-[13px] text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">· {rating}</span>
        {active && (
          <span className="rounded-sm border border-primary/40 px-1 py-px text-[9px] font-semibold uppercase tracking-brand text-primary">
            to move
          </span>
        )}
      </div>
      <span className="font-mono text-[11px] text-muted-foreground">00:00</span>
    </div>
  );
}

function AnalysisTab({ game }: { game: ChessGameApi }) {
  const [engineOn, setEngineOn] = useState(false);
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <button
          onClick={() => setEngineOn((v) => !v)}
          className={cn(
            "flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] font-medium uppercase tracking-brand transition-colors",
            engineOn
              ? "border-primary/50 bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:text-foreground",
          )}
        >
          <Power className="h-3 w-3" />
          {engineOn ? "Engine on" : "Engine off"}
        </button>
        <span className="font-mono text-[10px] text-muted-foreground">Stockfish 16 · NNUE</span>
      </div>

      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <Stat icon={Target} label="Accuracy" value="—" />
        <Stat icon={TrendingUp} label="Eval" value="+0.0" />
        <Stat icon={Zap} label="Depth" value="—" />
      </div>

      <OpeningStrip />

      <MoveList history={game.history} ply={game.ply} onJump={game.jumpTo} />

      <div className="border-t border-border px-5 py-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-brand text-muted-foreground">
          Top Lines
        </p>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between border-b border-border/60 py-1.5 last:border-0">
            <div className="flex min-w-0 items-center gap-2">
              <span className="shrink-0 font-mono text-[11px] tabular-nums text-primary">+0.{20 + i * 5}</span>
              <span className="truncate font-mono text-[11px] text-muted-foreground">
                1.e4 e5 2.Nf3 Nc6 3.Bb5
              </span>
            </div>
            <span className="shrink-0 font-mono text-[10px] text-muted-foreground">d24</span>
          </div>
        ))}
      </div>

      <div className="flex-1" />
      <TransportBar
        onStart={game.goStart}
        onPrev={game.goPrev}
        onFlip={game.flip}
        onNext={game.goNext}
        onEnd={game.goEnd}
      />
    </div>
  );
}

function ImportTab({ game }: { game: ChessGameApi }) {
  const [pgn, setPgn] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex flex-col gap-4 p-5">
      <Field
        label="From Chess.com or Lichess"
        placeholder="username"
        hint="Pull recent games and prep against patterns. (Coming soon)"
      />
      <label className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-brand text-muted-foreground">
          Paste PGN
        </span>
        <textarea
          rows={6}
          value={pgn}
          onChange={(e) => {
            setPgn(e.target.value);
            setError(null);
          }}
          placeholder="1. e4 e5 2. Nf3 Nc6 ..."
          className="resize-none rounded-md border border-border bg-input px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
        />
        {error && <span className="text-[11px] text-destructive">{error}</span>}
      </label>
      <button
        onClick={() => {
          if (!pgn.trim()) return;
          const ok = game.loadPgn(pgn);
          if (!ok) setError("Could not parse PGN. Check the format.");
        }}
        className="rounded-md bg-primary py-2 text-xs font-semibold uppercase tracking-brand text-primary-foreground transition-transform hover:scale-[1.01]"
      >
        Load PGN
      </button>
    </div>
  );
}

function Field({
  label, placeholder, hint,
}: { label: string; placeholder: string; hint?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-brand text-muted-foreground">{label}</span>
      <input
        placeholder={placeholder}
        className="rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
      />
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}

function RepertoireTab() {
  const reps = [
    { name: "Ruy Lopez — Closed", color: "White", coverage: 78, lines: 124 },
    { name: "Caro-Kann", color: "Black", coverage: 54, lines: 86 },
    { name: "King's Indian", color: "Black", coverage: 31, lines: 142 },
  ];
  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <p className="text-[10px] font-semibold uppercase tracking-brand text-muted-foreground">3 Repertoires</p>
        <button className="flex items-center gap-1 rounded-md border border-border-strong px-2 py-1 text-[11px] text-foreground transition-colors hover:border-primary hover:text-primary">
          <Plus className="h-3 w-3" /> New
        </button>
      </div>
      <ul className="divide-y divide-border">
        {reps.map((r) => (
          <li key={r.name} className="cursor-pointer px-5 py-3 transition-colors hover:bg-secondary/40">
            <div className="flex items-center justify-between">
              <p className="font-display text-[15px] text-foreground">{r.name}</p>
              <span className={cn(
                "rounded-sm border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-brand",
                r.color === "White" ? "border-primary/40 text-primary" : "border-border-strong text-muted-foreground",
              )}>{r.color}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                <div className="h-full bg-primary" style={{ width: `${r.coverage}%` }} />
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">{r.coverage}% · {r.lines} lines</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-2.5">
      <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-brand text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className="font-mono text-[13px] tabular-nums text-foreground">{value}</p>
    </div>
  );
}
