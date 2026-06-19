"use client";
import Link from "next/link";
import { ChefHat, Building2, usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, Bed, Users, BarChart3, MessageCircle, Settings, Search, Bell,
  Sparkles, Hotel, Wrench, Boxes, ShoppingBag, UtensilsCrossed, Heart, Bot, PartyPopper,
  Receipt, Wallet, ClipboardList, ShieldCheck, FileText, UserCog, Menu, X, ChevronDown, Globe2,
  Briefcase, BookOpen, Send, Plus, Lock
} from "lucide-react";
import { useState, createContext, useContext, useEffect, type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

export const RoleContext = createContext<{ role: string; setRole: (r: string) => void }>({
  role: "General Manager",
  setRole: () => {},
});

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
      { icon: ChefHat, label: "Kitchen Display", to: "/dashboard/kitchen" },
      { icon: Settings, label: "Menu Editor", to: "/dashboard/menu" },
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

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { userData } = useAuth();
  const role = userData?.role || "Super Admin";

  const filteredGroups = GROUPS.map(g => {
    let items = g.items;
    
    // If they have selected specific modules from onboarding
    if (userData?.modules?.length) {
      if (g.title === "Operate") {
         items = items.filter(i => i.label === "Overview" || userData.modules!.includes("booking") || userData.modules!.includes("pos"));
      } else if (g.title === "Revenue & Sales") {
         items = items.filter(i => userData.modules!.includes("pos") || userData.modules!.includes("inventory"));
      } else if (g.title === "Guests") {
         items = items.filter(i => userData.modules!.includes("crm"));
      } else if (g.title === "Workforce") {
         items = items.filter(i => userData.modules!.includes("hr"));
      } else if (g.title === "Finance & Intel") {
         items = items.filter(i => i.label === "Analytics" || userData.modules!.includes("website") || userData.modules!.includes("pos"));
      }
    }

    // Still respect the local role override if they use the role switcher for demo purposes
    if (role === "Front Desk") {
      if (g.title === "Finance & Intel" || g.title === "Admin" || g.title === "Workforce" || g.title === "Revenue & Sales") items = [];
    } else if (role === "Housekeeping") {
      if (g.title !== "Operate") items = [];
      else items = items.filter(i => i.label === "Overview" || i.label === "Housekeeping");
    } else if (role === "Restaurant") {
      if (g.title !== "Revenue & Sales" && g.title !== "Operate") items = [];
      else items = items.filter(i => i.label === "Overview" || i.label === "Restaurant POS" || i.label === "Inventory");
    }
    return { ...g, items };
  }).filter(g => g.items.length > 0);

  return (
    <nav className="space-y-5">
      {filteredGroups.map((g) => (
        <div key={g.title}>
          <div className="px-3 text-[10px] uppercase tracking-widest text-background/40 mb-1.5">{g.title}</div>
          <div className="space-y-0.5">
            {g.items.map((i) => {
              const active = pathname === i.to;
              return (
                <Link
                  key={i.label}
                  href={i.to}
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

function PropertySwitcher() {
  const { user, activeProperty, setActiveProperty } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "properties"), where("ownerId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const props = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setProperties(props);
      if (props.length > 0 && !activeProperty) {
        setActiveProperty(props[0].id);
      }
    });
    return unsub;
  }, [user]);

  const active = properties.find(p => p.id === activeProperty);

  if (properties.length === 0) return null;

  return (
    <div className="relative mb-2">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 bg-op-purple/20 text-op-purple hover:bg-op-purple/30 rounded-xl px-3 py-2.5 text-xs transition border border-op-purple/20"
      >
        <span className="flex items-center gap-2 font-bold truncate">
          <Building2 className="h-4 w-4 shrink-0" />
          <span className="truncate">{active ? active.name : "Select Property"}</span>
        </span>
        <ChevronDown className="h-3 w-3 shrink-0" />
      </button>
      {open && (
        <div className="absolute bottom-full mb-2 left-0 right-0 bg-foreground border border-white/10 rounded-xl p-1 max-h-64 overflow-auto z-10 shadow-2xl">
          {properties.map((p) => (
            <button
              key={p.id}
              onClick={() => { setActiveProperty(p.id); setOpen(false); }}
              className={`w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-white/10 ${
                p.id === activeProperty ? "text-op-purple font-bold" : "text-background/80"
              }`}
            >
              {p.name}
            </button>
          ))}
          <Link href="/dashboard/properties" onClick={() => setOpen(false)} className="w-full flex justify-center px-3 py-2 text-xs rounded-lg hover:bg-white/10 text-background/50 mt-1 border-t border-white/5">
            + Manage Properties
          </Link>
        </div>
      )}
    </div>
  );
}

function SidebarInner() {
  return (
    <div className="flex flex-col h-full">
      <Link href="/" className="font-display text-2xl px-3 py-4 shrink-0">OPERIX</Link>
      <div className="flex-1 min-h-0 overflow-y-auto pr-1 -mr-1">
        <NavList />
      </div>
      <div className="shrink-0 pt-3 space-y-3">
        <PropertySwitcher />
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

function Topbar({ onMenu, setCmdOpen }: { onMenu: () => void, setCmdOpen: (o: boolean) => void }) {
  return (
    <header className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border flex items-center gap-2 px-3 sm:px-6 py-3">
      <button onClick={onMenu} aria-label="Open menu" className="lg:hidden p-2 rounded-full hover:bg-muted">
        <Menu className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0 max-w-xl relative cursor-text" onClick={() => setCmdOpen(true)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <div className="w-full bg-muted rounded-full pl-10 pr-4 py-2.5 text-sm text-muted-foreground flex justify-between items-center transition hover:bg-muted/80">
           <span>Search…</span>
           <kbd className="hidden sm:inline-block bg-background/50 px-2 py-0.5 rounded text-[10px] font-semibold border border-border">CMD K</kbd>
        </div>
      </div>
      <button className="p-2.5 rounded-full hover:bg-muted relative shrink-0 ml-2">
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
  const [cmdOpen, setCmdOpen] = useState(false);
  
  const { isTrialExpired, user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in");
    }
  }, [user, loading, router]);

  if (loading) return <div className="min-h-screen bg-muted/40" />;

  return (
    
      <div className="min-h-screen bg-muted/40 text-foreground flex relative">
        {isTrialExpired && (
          <div className="fixed inset-0 z-[200] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-foreground text-background max-w-md w-full rounded-3xl p-8 shadow-2xl text-center">
              <div className="mx-auto h-12 w-12 bg-op-purple rounded-full flex items-center justify-center mb-6">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="text-3xl font-display mb-2">Trial Expired</h2>
              <p className="text-background/70 mb-8">
                Your 7-day free trial has ended. Please upgrade your plan to continue using Operix and access your data.
              </p>
              <Link href="/pricing" className="block w-full bg-op-purple text-foreground rounded-full py-4 font-semibold hover:scale-105 transition-transform shadow-[0_0_30px_-5px_rgba(126,34,206,0.5)]">
                Upgrade to Premium
              </Link>
            </div>
          </div>
        )}
        <Sidebar />
        {open && (
          <div className="fixed inset-0 z-[70] lg:hidden">
            <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
            <div className="absolute top-0 left-0 h-full w-[84%] max-w-xs bg-foreground text-background p-4 flex flex-col">
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
          <Topbar onMenu={() => setOpen(true)} setCmdOpen={setCmdOpen} />
          <main className="p-4 sm:p-8 space-y-6">{children}</main>
        </div>
        <AIChatWidget />
        <CommandPalette open={cmdOpen} setOpen={setCmdOpen} />
      </div>
    
  );
}

function CommandPalette({ open, setOpen }: { open: boolean, setOpen: (o: boolean) => void }) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setOpen]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-[90%] max-w-2xl bg-foreground text-background rounded-2xl shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] overflow-hidden scale-100 transition-transform origin-top animate-in zoom-in-95 duration-200">
        <div className="flex items-center px-4 py-4 border-b border-white/10">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <input 
            autoFocus
            placeholder="Search commands, modules, or ask Copilot..." 
            className="flex-1 bg-transparent border-none outline-none text-lg text-background placeholder:text-background/40"
          />
          <kbd className="hidden sm:inline-flex px-2 py-1 bg-white/10 rounded text-xs text-background/60">ESC</kbd>
        </div>
        <div className="p-2">
          <div className="px-3 py-2 text-xs font-semibold text-background/40 uppercase tracking-wider">Suggested Actions</div>
          {[
            { icon: Plus, label: "Create new reservation" },
            { icon: Sparkles, label: "Run Revenue Optimizer" },
            { icon: MessageCircle, label: "Send broadcast message to guests" },
            { icon: BarChart3, label: "View daily revenue report" }
          ].map(a => (
            <button key={a.label} className="w-full flex items-center px-3 py-3 hover:bg-white/10 rounded-xl transition text-left group">
              <a.icon className="h-4 w-4 mr-3 opacity-70 group-hover:text-op-purple group-hover:opacity-100" />
              <span className="text-sm font-medium">{a.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{user: boolean, text: string}[]>([
    { user: false, text: "Hi Regina! I've noticed a 12% drop in weekend bookings. Want me to generate a new pricing strategy?" }
  ]);
  const [input, setInput] = useState("");

  return (
    <>
      <button 
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 h-14 w-14 bg-op-purple text-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group"
      >
        {open ? <X className="h-6 w-6" /> : <Sparkles className="h-6 w-6 group-hover:rotate-12 transition-transform" />}
      </button>
      
      {open && (
        <div className="fixed bottom-24 right-6 w-80 sm:w-96 bg-foreground text-background rounded-3xl shadow-2xl overflow-hidden z-50 border border-white/10 flex flex-col h-[500px] max-h-[80vh] animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 bg-white/5 border-b border-white/10 flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-op-purple flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 text-foreground" />
            </div>
            <div>
              <div className="font-semibold text-sm">Operix Copilot</div>
              <div className="text-xs flex items-center gap-1 opacity-80">
                <span className="h-1.5 w-1.5 rounded-full bg-op-success animate-pulse-dot" /> Online
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {msgs.map((m, i) => (
              <div key={i} className={`flex ${m.user ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${m.user ? "bg-op-purple text-foreground" : "bg-white/10 text-background"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <form 
            onSubmit={e => {
              e.preventDefault();
              if (!input) return;
              setMsgs(p => [...p, {user: true, text: input}]);
              setInput("");
              setTimeout(() => {
                setMsgs(p => [...p, {user: false, text: "I'll analyze that right away. Generating a detailed report for you now..."}]);
              }, 1000);
            }} 
            className="p-3 border-t border-white/10"
          >
            <div className="relative">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask Copilot anything..."
                className="w-full bg-white/5 rounded-full pl-4 pr-10 py-2.5 text-sm outline-none focus:bg-white/10 transition"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-op-purple text-foreground rounded-full hover:scale-105 transition">
                <Send className="h-3 w-3" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
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
