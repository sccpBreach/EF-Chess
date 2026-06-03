import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutGrid, BookOpen, Search, Users, Settings, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", icon: LayoutGrid, label: "Dashboard" },
  { to: "/repertoire", icon: BookOpen, label: "Repertoire" },
  { to: "/analysis", icon: Search, label: "Analysis" },
  { to: "/students", icon: Users, label: "Students" },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside className="relative z-10 flex w-14 shrink-0 flex-col items-center border-r border-sidebar-border bg-sidebar py-4">
      <Link
        to="/"
        className="font-display text-2xl font-semibold leading-none text-primary"
        aria-label="EFChess home"
      >
        EF
      </Link>

      <nav className="mt-8 flex flex-1 flex-col items-center gap-1">
        {items.map((item) => {
          const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "group relative flex h-10 w-10 items-center justify-center rounded-md transition-colors",
                "text-sidebar-foreground/60 hover:text-foreground hover:bg-sidebar-accent",
                active && "text-primary bg-sidebar-accent",
              )}
              aria-label={item.label}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[2px] -translate-y-1/2 rounded-r bg-primary" />
              )}
              <item.icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
              <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md border border-border bg-popover px-2 py-1 text-xs text-foreground opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <Link
        to="/"
        className="flex h-10 w-10 items-center justify-center rounded-md text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent hover:text-foreground"
        aria-label="Settings"
      >
        <Settings className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </Link>

      <div className="mt-3 flex items-center gap-1 text-[10px] font-medium tracking-brand text-muted-foreground">
        <Flame className="h-3 w-3 text-primary" />
        <span>7d</span>
      </div>
    </aside>
  );
}
