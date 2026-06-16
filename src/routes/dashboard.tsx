import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  Bot,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  DollarSign,
  ArrowUpRight,
  Hotel,
  Plus,
} from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — OPERIX" },
      { name: "description", content: "Operate your hotel from one unified dashboard." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="min-h-screen bg-muted/40 text-foreground flex">
      <Sidebar />
      <div className="flex-1 min-w-0">
        <Topbar />
        <main className="p-4 sm:p-8 space-y-6">
          <Greeting />
          <KPIs />
          <div className="grid lg:grid-cols-3 gap-6">
            <RevenueChart />
            <Copilot />
          </div>
          <div className="grid lg:grid-cols-3 gap-6">
            <Arrivals />
            <Housekeeping />
            <Messages />
          </div>
          <Properties />
        </main>
      </div>
    </div>
  );
}

function Sidebar() {
  const items = [
    { icon: LayoutDashboard, label: "Overview", active: true },
    { icon: Calendar, label: "Reservations" },
    { icon: Bed, label: "Housekeeping" },
    { icon: Users, label: "Guests" },
    { icon: BarChart3, label: "Revenue" },
    { icon: MessageCircle, label: "Inbox" },
    { icon: Hotel, label: "Properties" },
    { icon: Settings, label: "Settings" },
  ];
  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 bg-foreground text-background p-4 min-h-screen sticky top-0">
      <Link to="/" className="font-display text-2xl px-3 py-4">OPERIX</Link>
      <nav className="mt-4 space-y-1">
        {items.map((i) => (
          <button
            key={i.label}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition ${
              i.active ? "bg-op-purple text-foreground" : "text-background/70 hover:bg-white/5"
            }`}
          >
            <i.icon className="h-4 w-4" />
            {i.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto bg-white/5 rounded-2xl p-4">
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

function Greeting() {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="text-sm text-muted-foreground">Tuesday, June 16</p>
        <h1 className="font-display text-4xl sm:text-6xl">Good morning, Regina</h1>
      </div>
      <button className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
        <Plus className="h-4 w-4" /> New reservation
      </button>
    </div>
  );
}

function KPIs() {
  const kpis = [
    { label: "Occupancy", value: "87%", delta: "+4.2%", up: true, sub: "vs last week", bg: "bg-op-purple" },
    { label: "ADR", value: "$312", delta: "+$18", up: true, sub: "average daily rate", bg: "bg-op-pink" },
    { label: "RevPAR", value: "$271", delta: "+9.1%", up: true, sub: "revenue per room", bg: "bg-op-peach" },
    { label: "Arrivals", value: "24", delta: "-3", up: false, sub: "today", bg: "bg-op-beige" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k) => (
        <div key={k.label} className={`${k.bg} rounded-3xl p-5 hover-lift`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium opacity-80">{k.label}</span>
            <span className={`text-xs font-semibold inline-flex items-center gap-1 ${k.up ? "text-emerald-700" : "text-rose-700"}`}>
              {k.up ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
              {k.delta}
            </span>
          </div>
          <div className="mt-6 font-display text-5xl">{k.value}</div>
          <div className="mt-2 text-xs opacity-70">{k.sub}</div>
        </div>
      ))}
    </div>
  );
}

function RevenueChart() {
  const bars = [40, 65, 50, 80, 55, 90, 72, 78, 60, 88, 70, 95];
  const labels = ["J","F","M","A","M","J","J","A","S","O","N","D"];
  return (
    <div className="lg:col-span-2 bg-card rounded-3xl p-6 sm:p-8 border border-border">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
        <div>
          <div className="text-sm text-muted-foreground">Revenue, last 12 months</div>
          <div className="text-3xl font-semibold">$14.2M</div>
        </div>
        <div className="flex gap-2">
          {["1M","3M","6M","12M","All"].map((t, i) => (
            <button key={t} className={`text-xs px-3 py-1.5 rounded-full ${i === 3 ? "bg-foreground text-background" : "bg-muted"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      <div className="flex items-end gap-2 sm:gap-3 h-56">
        {bars.map((h, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-2">
            <div className="w-full rounded-t-2xl bg-foreground hover:bg-op-purple transition" style={{ height: `${h}%` }} />
            <span className="text-[10px] text-muted-foreground">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Copilot() {
  const suggestions = [
    "Raise weekend rate by 8% — demand strong",
    "Reassign 3 housekeepers to Floor 8",
    "Reply to 4 guest reviews",
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % suggestions.length), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <div className="bg-op-purple rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Bot className="h-4 w-4" /> AI Copilot
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-op-success animate-pulse-dot" /> Live
        </span>
      </div>
      <h3 className="mt-6 font-display text-3xl">Today's suggestions</h3>
      <ul className="mt-6 space-y-2">
        {suggestions.map((s, i) => (
          <li key={s} className={`flex items-start gap-3 rounded-2xl px-4 py-3 text-sm transition ${i === active ? "bg-foreground text-background" : "bg-white/40"}`}>
            <Sparkles className="h-4 w-4 mt-0.5 shrink-0" />
            <span className="font-medium">{s}</span>
          </li>
        ))}
      </ul>
      <button className="mt-6 w-full bg-foreground text-background rounded-full py-3 text-sm font-semibold inline-flex items-center justify-center gap-2">
        Apply all <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function Arrivals() {
  const rows = [
    { name: "A. Mehta", room: "Suite 1204", status: "In-house", color: "bg-op-success/20 text-emerald-700" },
    { name: "L. García", room: "Room 814", status: "ETA 3:00 PM", color: "bg-op-pink/30 text-rose-700" },
    { name: "Tanaka Party", room: "Villa 02", status: "VIP", color: "bg-op-purple/30 text-purple-700" },
    { name: "J. Okonkwo", room: "Room 502", status: "Verify ID", color: "bg-op-peach text-orange-700" },
  ];
  return (
    <div className="bg-card rounded-3xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Arrivals today</h3>
        <button className="text-xs text-muted-foreground">View all</button>
      </div>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.room} className="flex items-center justify-between rounded-2xl bg-muted/60 px-3 py-2.5">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-8 w-8 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-semibold shrink-0">
                {r.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{r.name}</div>
                <div className="text-xs text-muted-foreground truncate">{r.room}</div>
              </div>
            </div>
            <span className={`text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap ${r.color}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Housekeeping() {
  const stats = [
    { label: "Clean", count: 84, icon: CheckCircle2, color: "text-emerald-700 bg-op-success/20" },
    { label: "In progress", count: 17, icon: Clock, color: "text-rose-700 bg-op-pink/30" },
    { label: "Dirty", count: 23, icon: Bed, color: "text-foreground bg-muted" },
  ];
  return (
    <div className="bg-card rounded-3xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Housekeeping</h3>
        <button className="text-xs text-muted-foreground">Open board</button>
      </div>
      <div className="space-y-3">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3">
            <div className="flex items-center gap-3">
              <span className={`h-8 w-8 rounded-full inline-flex items-center justify-center ${s.color}`}>
                <s.icon className="h-4 w-4" />
              </span>
              <span className="text-sm font-medium">{s.label}</span>
            </div>
            <span className="text-xl font-semibold">{s.count}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs text-muted-foreground">
        Avg turnaround <strong className="text-foreground">22 min</strong>
      </div>
    </div>
  );
}

function Messages() {
  const msgs = [
    { from: "Suite 1204", text: "Late checkout tomorrow possible?", time: "2m" },
    { from: "Room 312", text: "Could we get extra towels?", time: "11m" },
    { from: "Villa 02", text: "Spa booking for two at 11?", time: "24m" },
    { from: "Booking.com", text: "New reservation · 3 nights", time: "1h" },
  ];
  return (
    <div className="bg-card rounded-3xl p-6 border border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Inbox</h3>
        <span className="text-xs bg-op-orange/20 text-orange-700 px-2 py-0.5 rounded-full font-semibold">4 new</span>
      </div>
      <div className="space-y-3">
        {msgs.map((m) => (
          <div key={m.from} className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-full bg-op-purple flex items-center justify-center shrink-0">
              <MessageCircle className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold truncate">{m.from}</span>
                <span className="text-[10px] text-muted-foreground">{m.time}</span>
              </div>
              <p className="text-xs text-muted-foreground truncate">{m.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Properties() {
  const props = [
    { name: "Aurelia Marina", rooms: 84, occ: 92, rev: "$412k", img: "bg-op-purple" },
    { name: "Nordic House", rooms: 36, occ: 78, rev: "$184k", img: "bg-op-pink" },
    { name: "Casa Solar", rooms: 48, occ: 85, rev: "$226k", img: "bg-op-peach" },
    { name: "Kumo Hotel", rooms: 120, occ: 71, rev: "$498k", img: "bg-op-beige" },
  ];
  return (
    <div className="bg-card rounded-3xl p-6 sm:p-8 border border-border">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-semibold text-lg">Your properties</h3>
          <p className="text-xs text-muted-foreground">4 active · 1 onboarding</p>
        </div>
        <button className="text-xs bg-muted px-3 py-1.5 rounded-full font-semibold">Manage</button>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {props.map((p) => (
          <div key={p.name} className="rounded-2xl overflow-hidden bg-muted/60 hover-lift">
            <div className={`${p.img} h-24 flex items-end p-3`}>
              <Hotel className="h-5 w-5" />
            </div>
            <div className="p-4">
              <div className="font-semibold">{p.name}</div>
              <div className="text-xs text-muted-foreground">{p.rooms} rooms</div>
              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="font-semibold">{p.occ}% occ</span>
                <span className="inline-flex items-center gap-1 text-emerald-700"><DollarSign className="h-3 w-3" />{p.rev}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
