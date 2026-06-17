import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Calendar,
  Bed,
  Users,
  BarChart3,
  MessageCircle,
  Settings,
  Search,
  Bell,
  Sparkles,
  Hotel,
} from "lucide-react";
import type { ReactNode } from "react";

const NAV = [
  { icon: LayoutDashboard, label: "Overview", to: "/dashboard" },
  { icon: Calendar, label: "Reservations", to: "/dashboard/reservations" },
  { icon: Bed, label: "Housekeeping", to: "/dashboard/housekeeping" },
  { icon: Users, label: "Guests", to: "/dashboard/guests" },
  { icon: BarChart3, label: "Revenue", to: "/dashboard/revenue" },
  { icon: MessageCircle, label: "Inbox", to: "/dashboard/inbox" },
  { icon: Hotel, label: "Properties", to: "/dashboard/properties" },
  { icon: Settings, label: "Settings", to: "/dashboard/settings" },
] as const;

function Sidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-foreground text-background p-4 h-screen sticky top-0 overflow-hidden">
      <Link to="/" className="font-display text-2xl px-3 py-4">OPERIX</Link>
      <nav className="mt-4 space-y-1 flex-1 min-h-0">
        {NAV.map((i) => {
          const active = pathname === i.to;
          return (
            <Link
              key={i.label}
              to={i.to}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
                active ? "bg-op-purple text-foreground" : "text-background/70 hover:bg-white/5"
              }`}
            >
              <i.icon className="h-4 w-4" />
              {i.label}
            </Link>
          );
        })}
      </nav>
      <div className="bg-white/5 rounded-2xl p-4 shrink-0">
        <div className="flex items-center gap-2 text-xs text-op-purple mb-2">
          <Sparkles className="h-3.5 w-3.5" /> AI Copilot
        </div>
        <p className="text-sm text-background/70">Suggest pricing for next weekend?</p>
        <button className="mt-3 text-xs bg-op-purple text-foreground rounded-full px-3 py-1.5 font-semibold">
          Run suggestion
        </button>
      </div>
    </aside>
  );
}

function Topbar() {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border flex items-center gap-3 px-4 sm:px-8 py-3">
      <div className="flex-1 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search reservations, guests, rooms…"
          className="w-full bg-muted rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/10"
        />
      </div>
      <button className="p-2.5 rounded-full hover:bg-muted relative">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-op-orange" />
      </button>
      <div className="h-9 w-9 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-semibold">
        RK
      </div>
    </header>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-muted/40 text-foreground flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <main className="p-4 sm:p-8 space-y-6">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && <p className="text-sm text-muted-foreground">{eyebrow}</p>}
        <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
      </div>
      {action}
    </div>
  );
}
