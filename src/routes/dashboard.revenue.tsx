import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";
import { TrendingUp } from "lucide-react";

export const Route = createFileRoute("/dashboard/revenue")({
  component: Page,
});

const BARS = [40, 65, 50, 80, 55, 90, 72, 78, 60, 88, 70, 95];
const CHANNELS = [
  { name: "Direct", share: 42, rev: "$5.96M", color: "bg-foreground" },
  { name: "Booking.com", share: 23, rev: "$3.27M", color: "bg-op-purple" },
  { name: "Expedia", share: 14, rev: "$1.99M", color: "bg-op-pink" },
  { name: "Airbnb", share: 11, rev: "$1.56M", color: "bg-op-peach" },
  { name: "Google Hotels", share: 6, rev: "$0.85M", color: "bg-op-beige" },
  { name: "Other", share: 4, rev: "$0.57M", color: "bg-muted" },
];

function Page() {
  return (
    <>
      <PageHeader eyebrow="Revenue" title="Performance & forecasts" />
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { l: "RevPAR", v: "$271", d: "+9.1%" },
          { l: "ADR", v: "$312", d: "+5.8%" },
          { l: "Occupancy", v: "87%", d: "+4.2%" },
          { l: "GOPPAR", v: "$184", d: "+12%" },
        ].map((k) => (
          <div key={k.l} className="bg-card border border-border rounded-3xl p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{k.l}</span>
              <span className="text-xs font-semibold text-emerald-700 inline-flex items-center gap-1"><TrendingUp className="h-3 w-3" />{k.d}</span>
            </div>
            <div className="font-display text-4xl mt-3">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-sm text-muted-foreground">Revenue, last 12 months</div>
            <div className="text-3xl font-semibold">$14.2M</div>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-op-success/30 text-emerald-700 font-semibold">+18.4% YoY</span>
        </div>
        <div className="flex items-end gap-3 h-64">
          {BARS.map((h, i) => (
            <div key={i} className="flex-1 rounded-t-2xl bg-foreground hover:bg-op-purple transition" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-3xl p-6">
          <h3 className="font-semibold mb-4">Channel mix</h3>
          <div className="flex h-3 rounded-full overflow-hidden mb-4">
            {CHANNELS.map((c) => (
              <div key={c.name} className={c.color} style={{ width: `${c.share}%` }} />
            ))}
          </div>
          <ul className="space-y-2 text-sm">
            {CHANNELS.map((c) => (
              <li key={c.name} className="flex items-center gap-3">
                <span className={`h-3 w-3 rounded-full ${c.color}`} />
                <span className="flex-1">{c.name}</span>
                <span className="text-muted-foreground">{c.share}%</span>
                <span className="font-semibold w-20 text-right">{c.rev}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-op-purple rounded-3xl p-6">
          <h3 className="font-semibold mb-4">AI pricing suggestions</h3>
          <ul className="space-y-2">
            {[
              "Fri-Sun: raise King rates +8%",
              "Tue corporate: hold at $289",
              "Villa 02: open premium tier",
              "Group week 28: bundle F&B credit",
            ].map((s) => (
              <li key={s} className="bg-white/40 rounded-2xl px-4 py-3 text-sm font-medium">{s}</li>
            ))}
          </ul>
          <button className="mt-5 bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold">Apply all</button>
        </div>
      </div>
    </>
  );
}
