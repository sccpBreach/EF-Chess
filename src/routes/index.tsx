import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ChevronsLeft, ChevronLeft, Play, ChevronRight, ChevronsRight,
  RotateCcw, Eye, Plus, Sparkles, TrendingUp, Target, Zap,
} from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { ChessBoard } from "@/components/chess-board";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Analysis — EFChess" },
      { name: "description", content: "Analyze positions, study deviations, and prepare against specific opponents." },
    ],
  }),
  component: AnalysisPage,
});

type Tab = "analysis" | "import" | "repertoire";

function AnalysisPage() {
  const [tab, setTab] = useState<Tab>("analysis");

  return (
    <div className="relative flex min-h-screen w-full bg-background">
      <AppSidebar />

      <div className="flex flex-1 flex-col">
        <TopBar />

        <div className="grid flex-1 grid-cols-1 lg:grid-cols-[1fr_420px]">
          {/* Board + meta */}
          <section className="relative flex flex-col items-center justify-center px-6 py-10">
            {/* Evaluation rail */}
            <div className="hidden lg:flex absolute left-6 top-1/2 h-[480px] w-1.5 -translate-y-1/2 flex-col overflow-hidden rounded-full border border-border bg-secondary">
              <div className="h-1/2 w-full bg-foreground/90" />
              <div className="h-1/2 w-full bg-muted" />
            </div>

            <PlayerStrip side="Black" name="Awaiting opponent" rating="—" />
            <ChessBoard className="my-3" />
            <PlayerStrip side="White" name="You" rating="1842" highlighted />

            <div className="mt-4 flex items-center gap-1.5">
              <IconButton aria-label="Flip board"><RotateCcw className="h-4 w-4" /></IconButton>
              <IconButton aria-label="Toggle coordinates"><Eye className="h-4 w-4" /></IconButton>
            </div>

            <p className="mt-6 max-w-md text-balance text-center text-xs text-muted-foreground">
              Drop a PGN, paste a Lichess study link, or load a saved repertoire to begin preparation.
            </p>
          </section>

          {/* Right panel */}
          <aside className="border-l border-border bg-surface lg:bg-panel">
            <div className="flex h-10 items-center gap-0 border-b border-border px-2">
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
                  {tab === t && (
                    <span className="absolute inset-x-3 -bottom-px h-px bg-primary" />
                  )}
                </button>
              ))}
            </div>

            {tab === "analysis" && <AnalysisTab />}
            {tab === "import" && <ImportTab />}
            {tab === "repertoire" && <RepertoireTab />}
          </aside>
        </div>
      </div>
    </div>
  );
}

function TopBar() {
  return (
    <header className="relative z-10 flex h-12 items-center justify-between border-b border-border bg-background/80 px-5 backdrop-blur">
      <div className="flex items-center gap-3">
        <h1 className="font-display text-[17px] font-medium leading-none">Analysis</h1>
        <span className="hidden h-3 w-px bg-border sm:block" />
        <p className="hidden text-xs text-muted-foreground sm:block">Starting position · No engine running</p>
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
  side, name, rating, highlighted,
}: { side: "White" | "Black"; name: string; rating: string; highlighted?: boolean }) {
  return (
    <div className={cn(
      "flex w-full max-w-[640px] items-center justify-between px-1 py-1.5",
      highlighted && "",
    )}>
      <div className="flex items-center gap-2">
        <span className={cn(
          "h-1.5 w-1.5 rounded-full",
          side === "White" ? "bg-primary" : "bg-muted-foreground",
        )} />
        <span className="text-[13px] text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">· {rating}</span>
      </div>
      <span className="font-mono text-[11px] text-muted-foreground">00:00</span>
    </div>
  );
}

function IconButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:border-border-strong hover:bg-secondary hover:text-foreground"
    >
      {children}
    </button>
  );
}

function AnalysisTab() {
  return (
    <div className="flex flex-col">
      {/* Move controls */}
      <div className="flex items-center justify-center gap-1 border-b border-border px-3 py-3">
        {[ChevronsLeft, ChevronLeft, Play, ChevronRight, ChevronsRight].map((Icon, i) => (
          <button
            key={i}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground",
              Icon === Play && "h-9 w-9 bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            <Icon className={cn("h-4 w-4", Icon === Play && "h-4 w-4 fill-current")} />
          </button>
        ))}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 divide-x divide-border border-b border-border">
        <Stat icon={Target} label="Accuracy" value="—" />
        <Stat icon={TrendingUp} label="Eval" value="+0.0" />
        <Stat icon={Zap} label="Depth" value="—" />
      </div>

      {/* Moves */}
      <div className="px-5 py-8 text-center">
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary/50">
          <Play className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-sm text-foreground">No moves loaded</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Play a move on the board or import a game.
        </p>
        <button className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.02]">
          <Zap className="h-3 w-3" /> Run engine
        </button>
      </div>

      <div className="divider-h mx-5" />

      {/* Lines preview */}
      <div className="px-5 py-4">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-brand text-muted-foreground">
          Top Lines · Stockfish 16
        </p>
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center justify-between border-b border-border/60 py-2 last:border-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px] text-primary">+0.{20 + i * 5}</span>
              <span className="font-mono text-xs text-muted-foreground">1.e4 e5 2.Nf3 Nc6 3.Bb5</span>
            </div>
            <span className="text-[10px] text-muted-foreground">d24</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ImportTab() {
  return (
    <div className="flex flex-col gap-4 p-5">
      <Field
        label="From Chess.com or Lichess"
        placeholder="username"
        hint="Pull recent games and prep against patterns."
      />
      <Field
        label="Paste PGN"
        placeholder="1. e4 e5 2. Nf3 Nc6 ..."
        multiline
      />
      <button className="rounded-md bg-primary py-2 text-xs font-semibold text-primary-foreground">
        Analyze
      </button>
    </div>
  );
}

function Field({
  label, placeholder, hint, multiline,
}: { label: string; placeholder: string; hint?: string; multiline?: boolean }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-brand text-muted-foreground">{label}</span>
      {multiline ? (
        <textarea
          rows={5}
          placeholder={placeholder}
          className="resize-none rounded-md border border-border bg-input px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
        />
      ) : (
        <input
          placeholder={placeholder}
          className="rounded-md border border-border bg-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
        />
      )}
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
        <p className="text-[10px] font-semibold uppercase tracking-brand text-muted-foreground">
          3 Repertoires
        </p>
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
                r.color === "White"
                  ? "border-primary/40 text-primary"
                  : "border-border-strong text-muted-foreground",
              )}>{r.color}</span>
            </div>
            <div className="mt-2 flex items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-primary"
                  style={{ width: `${r.coverage}%` }}
                />
              </div>
              <span className="font-mono text-[11px] text-muted-foreground">
                {r.coverage}% · {r.lines} lines
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Stat({ icon: Icon, label, value }: { icon: typeof Target; label: string; value: string }) {
  return (
    <div className="flex flex-col items-center gap-1 py-3">
      <div className="flex items-center gap-1 text-[10px] font-medium uppercase tracking-brand text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className="font-mono text-[13px] text-foreground">{value}</p>
    </div>
  );
}
