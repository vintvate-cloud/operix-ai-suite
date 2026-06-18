import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Calendar, Bed, Users, BarChart3, MessageCircle, Settings, Search, Bell,
  Sparkles, Hotel, Wrench, Boxes, ShoppingBag, UtensilsCrossed, Heart, Bot, PartyPopper,
  Receipt, Wallet, ClipboardList, ShieldCheck, FileText, UserCog, Menu, X, ChevronDown, Globe2,
  Briefcase, BookOpen,
} from "lucide-react";
import { useState, type ReactNode } from "react";

type Item = { icon: any; label: string; to: string };
type Group = { title: string; items: Item[] };

const GROUPS: Group[] = [
  {
    title: "Operate",
    items: [
      { icon: LayoutDashboard, label: "Overview", to: "/dashboard" },
      { icon: Calendar, label: "Reservations", to: "/dashboard/reservations" },
      { icon: Bed, label: "Housekeeping", to: "/dashboard/housekeeping" },
      { icon: Wrench, label: "Maintenance", to: "/dashboard/maintenance" },
      { icon: Globe2, label: "Channel Manager", to: "/dashboard/channels" },
    ],
  },
  {
    title: "Revenue & Sales",
    items: [
      { icon: BarChart3, label: "Revenue AI", to: "/dashboard/revenue" },
      { icon: UtensilsCrossed, label: "Restaurant POS", to: "/dashboard/pos" },
      { icon: ShoppingBag, label: "Procurement", to: "/dashboard/procurement" },
      { icon: Boxes, label: "Inventory", to: "/dashboard/inventory" },
      { icon: PartyPopper, label: "Events", to: "/dashboard/events" },
    ],
  },
  {
    title: "Guests",
    items: [
      { icon: Users, label: "Guest 360", to: "/dashboard/guests" },
      { icon: Heart, label: "Loyalty", to: "/dashboard/loyalty" },
      { icon: Bot, label: "AI Concierge", to: "/dashboard/concierge" },
      { icon: MessageCircle, label: "Inbox", to: "/dashboard/inbox" },
    ],
  },
  {
    title: "Workforce",
    items: [
      { icon: Briefcase, label: "Staff", to: "/dashboard/staff" },
      { icon: ClipboardList, label: "Attendance", to: "/dashboard/attendance" },
      { icon: Receipt, label: "Payroll", to: "/dashboard/payroll" },
    ],
  },
  {
    title: "Finance & Intel",
    items: [
      { icon: Wallet, label: "Finance", to: "/dashboard/finance" },
      { icon: BookOpen, label: "CMS", to: "/dashboard/cms" },
      { icon: FileText, label: "Documents", to: "/dashboard/documents" },
      { icon: BarChart3, label: "Analytics", to: "/dashboard/analytics" },
    ],
  },
  {
    title: "Admin",
    items: [
      { icon: Hotel, label: "Properties", to: "/dashboard/properties" },
      { icon: UserCog, label: "Roles & Access", to: "/dashboard/roles" },
      { icon: ShieldCheck, label: "Security", to: "/dashboard/security" },
      { icon: Sparkles, label: "AI Copilot", to: "/dashboard/copilot" },
      { icon: Settings, label: "Settings", to: "/dashboard/settings" },
    ],
  },
];

const ROLES = [
  "Super Admin", "Hotel Owner", "General Manager", "Front Desk", "Housekeeping",
  "Maintenance", "Restaurant", "Finance", "HR", "Employee",
];

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="space-y-5">
      {GROUPS.map((g) => (
        <div key={g.title}>
          <div className="px-3 text-[10px] uppercase tracking-widest text-background/40 mb-1.5">{g.title}</div>
          <div className="space-y-0.5">
            {g.items.map((i) => {
              const active = pathname === i.to;
              return (
                <Link
                  key={i.label}
                  to={i.to}
                  onClick={onNavigate}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition ${
                    active ? "bg-op-purple text-foreground" : "text-background/70 hover:bg-white/5"
                  }`}
                >
                  <i.icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{i.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function RoleSwitcher() {
  const [role, setRole] = useState("General Manager");
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 bg-white/5 hover:bg-white/10 rounded-xl px-3 py-2.5 text-xs"
      >
        <span className="text-background/50">Role</span>
        <span className="font-semibold flex items-center gap-1 truncate">
          {role} <ChevronDown className="h-3 w-3" />
        </span>
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-foreground border border-white/10 rounded-xl p-1 max-h-64 overflow-auto z-10">
          {ROLES.map((r) => (
            <button
              key={r}
              onClick={() => { setRole(r); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 ${
                r === role ? "text-op-purple" : "text-background/80"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarInner() {
  return (
    <div className="flex flex-col h-full">
      <Link to="/" className="font-display text-2xl px-3 py-4 shrink-0">OPERIX</Link>
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 -mr-1">
        <NavList />
      </div>
      <div className="shrink-0 pt-3 space-y-3">
        <RoleSwitcher />
        <div className="bg-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-2 text-xs text-op-purple mb-2">
            <Sparkles className="h-3.5 w-3.5" /> AI Copilot
          </div>
          <p className="text-sm text-background/70">Suggest pricing for next weekend?</p>
          <button className="mt-3 text-xs bg-op-purple text-foreground rounded-full px-3 py-1.5 font-semibold">
            Run suggestion
          </button>
        </div>
      </div>
    </div>
  );
}

function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-foreground text-background p-4 h-screen sticky top-0">
      <SidebarInner />
    </aside>
  );
}

function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border flex items-center gap-2 px-3 sm:px-6 py-3">
      <button onClick={onMenu} aria-label="Open menu" className="lg:hidden p-2 rounded-full hover:bg-muted">
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0 max-w-xl relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          placeholder="Search…"
          className="w-full bg-muted rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-foreground/10"
        />
      </div>
      <button className="p-2.5 rounded-full hover:bg-muted relative shrink-0">
        <Bell className="h-4 w-4" />
        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-op-orange" />
      </button>
      <div className="h-9 w-9 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-semibold shrink-0">
        RK
      </div>
    </header>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen bg-muted/40 text-foreground flex">
      <Sidebar />
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute top-0 left-0 h-full w-[84%] max-w-xs bg-foreground text-background p-4 flex flex-col animate-slide-in-right">
            <button onClick={() => setOpen(false)} aria-label="Close menu" className="self-end p-2 rounded-full hover:bg-white/10">
              <X className="h-5 w-5" />
            </button>
            <div className="flex-1 min-h-0">
              <SidebarInner />
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="p-4 sm:p-8 space-y-6">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <p className="text-sm text-muted-foreground">{eyebrow}</p>}
        <h1 className="font-display text-3xl sm:text-5xl truncate">{title}</h1>
      </div>
      {action}
    </div>
  );
}

// Reusable card primitives for module pages
export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`bg-background rounded-3xl border border-border p-5 sm:p-6 ${className}`}>{children}</div>;
}

export function StatCard({ label, value, delta, accent }: { label: string; value: string; delta?: string; accent?: string }) {
  return (
    <Card className={accent}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-2 font-display text-3xl sm:text-4xl">{value}</div>
      {delta && <div className="mt-1 text-xs text-foreground/60">{delta}</div>}
    </Card>
  );
}

export function AIInsight({ title, body }: { title: string; body: string }) {
  return (
    <Card className="bg-foreground text-background border-transparent">
      <div className="flex items-center gap-2 text-xs text-op-purple mb-2">
        <Sparkles className="h-3.5 w-3.5" /> AI INSIGHT
      </div>
      <div className="font-display text-xl sm:text-2xl leading-tight">{title}</div>
      <p className="mt-2 text-sm text-background/70">{body}</p>
      <button className="mt-4 bg-op-purple text-foreground rounded-full px-4 py-2 text-xs font-semibold">
        Apply recommendation
      </button>
    </Card>
  );
}

export function SimpleTable({ columns, rows }: { columns: string[]; rows: (string | ReactNode)[][] }) {
  return (
    <Card className="overflow-x-auto p-0">
      <table className="w-full text-sm min-w-[560px]">
        <thead>
          <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
            {columns.map((c) => <th key={c} className="px-5 py-3 font-medium">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-t border-border">
              {r.map((cell, j) => <td key={j} className="px-5 py-3">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
