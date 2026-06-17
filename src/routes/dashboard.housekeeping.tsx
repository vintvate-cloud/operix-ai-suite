import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";
import { CheckCircle2, Clock, Bed, Wrench } from "lucide-react";

export const Route = createFileRoute("/dashboard/housekeeping")({
  component: Page,
});

const COLS = [
  { title: "Dirty", color: "bg-foreground text-background", rooms: ["102", "204", "309", "412", "508"] },
  { title: "In progress", color: "bg-op-pink", rooms: ["110", "215", "318"] },
  { title: "Clean", color: "bg-op-success/30", rooms: ["101", "103", "105", "201", "203", "205", "207"] },
  { title: "Inspected", color: "bg-op-purple", rooms: ["301", "302", "303"] },
];

const STAFF = [
  { name: "Maria L.", floor: "Floor 1-3", load: 8, eta: "2h" },
  { name: "Anh P.", floor: "Floor 4-6", load: 6, eta: "1h 20m" },
  { name: "Diego R.", floor: "Floor 7-9", load: 9, eta: "2h 40m" },
  { name: "Sofia K.", floor: "Villas", load: 4, eta: "1h" },
];

function Page() {
  return (
    <>
      <PageHeader eyebrow="Housekeeping" title="Today's board" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { l: "Clean", v: 84, i: CheckCircle2, c: "bg-op-success/30" },
          { l: "In progress", v: 17, i: Clock, c: "bg-op-pink" },
          { l: "Dirty", v: 23, i: Bed, c: "bg-op-beige" },
          { l: "Maintenance", v: 4, i: Wrench, c: "bg-op-peach" },
        ].map((k) => (
          <div key={k.l} className={`${k.c} rounded-3xl p-5`}>
            <k.i className="h-5 w-5" />
            <div className="font-display text-4xl mt-3">{k.v}</div>
            <div className="text-sm opacity-80">{k.l}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-4 gap-4">
        {COLS.map((col) => (
          <div key={col.title} className="bg-card border border-border rounded-3xl p-4">
            <div className={`${col.color} rounded-2xl px-3 py-2 text-sm font-semibold mb-3`}>
              {col.title} <span className="opacity-70">· {col.rooms.length}</span>
            </div>
            <div className="space-y-2">
              {col.rooms.map((r) => (
                <div key={r} className="bg-muted rounded-xl px-3 py-2.5 text-sm flex items-center justify-between">
                  <span className="font-medium">Room {r}</span>
                  <span className="text-xs text-muted-foreground">King · 32m²</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-3xl p-6">
        <h3 className="font-semibold mb-4">Staff workload</h3>
        <div className="space-y-3">
          {STAFF.map((s) => (
            <div key={s.name} className="flex items-center gap-4">
              <div className="h-9 w-9 rounded-full bg-op-purple flex items-center justify-center text-sm font-semibold">{s.name[0]}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{s.name}</div>
                <div className="text-xs text-muted-foreground">{s.floor} · ETA {s.eta}</div>
              </div>
              <div className="w-40 bg-muted rounded-full h-2 overflow-hidden">
                <div className="h-full bg-foreground" style={{ width: `${s.load * 10}%` }} />
              </div>
              <span className="text-xs font-semibold w-16 text-right">{s.load} rooms</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
