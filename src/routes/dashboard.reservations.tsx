import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";
import { Plus, Search, Filter, Bed } from "lucide-react";

export const Route = createFileRoute("/dashboard/reservations")({
  component: Page,
});

const RES = [
  { id: "RX-1041", guest: "A. Mehta", room: "Suite 1204", in: "Jun 16", out: "Jun 19", channel: "Direct", status: "In-house", color: "bg-op-success/20 text-emerald-700" },
  { id: "RX-1042", guest: "L. García", room: "Room 814", in: "Jun 16", out: "Jun 18", channel: "Booking.com", status: "Arriving", color: "bg-op-pink/30 text-rose-700" },
  { id: "RX-1043", guest: "Tanaka Party", room: "Villa 02", in: "Jun 17", out: "Jun 22", channel: "Direct", status: "VIP", color: "bg-op-purple/30 text-purple-700" },
  { id: "RX-1044", guest: "J. Okonkwo", room: "Room 502", in: "Jun 16", out: "Jun 17", channel: "Expedia", status: "Verify ID", color: "bg-op-peach text-orange-700" },
  { id: "RX-1045", guest: "C. Roux", room: "Room 309", in: "Jun 18", out: "Jun 21", channel: "Airbnb", status: "Confirmed", color: "bg-muted text-foreground" },
  { id: "RX-1046", guest: "M. Vinter", room: "Suite 1102", in: "Jun 19", out: "Jun 24", channel: "Direct", status: "Confirmed", color: "bg-muted text-foreground" },
];

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title="All bookings"
        action={
          <button className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> New reservation
          </button>
        }
      />
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { l: "Today's arrivals", v: 24, c: "bg-op-purple" },
          { l: "In-house", v: 184, c: "bg-op-pink" },
          { l: "Departures", v: 19, c: "bg-op-peach" },
          { l: "Cancellations", v: 3, c: "bg-op-beige" },
        ].map((k) => (
          <div key={k.l} className={`${k.c} rounded-3xl p-5`}>
            <div className="text-sm opacity-80">{k.l}</div>
            <div className="font-display text-4xl mt-3">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="bg-card border border-border rounded-3xl p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search by guest, room, ID" className="w-full bg-muted rounded-full pl-10 pr-4 py-2 text-sm outline-none" />
          </div>
          <button className="text-xs px-3 py-2 rounded-full bg-muted inline-flex items-center gap-1"><Filter className="h-3 w-3" /> Filters</button>
          {["All", "Arrivals", "In-house", "Departures"].map((t, i) => (
            <button key={t} className={`text-xs px-3 py-2 rounded-full ${i === 0 ? "bg-foreground text-background" : "bg-muted"}`}>{t}</button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b border-border">
                {["ID", "Guest", "Room", "Check-in", "Check-out", "Channel", "Status"].map((h) => (
                  <th key={h} className="py-3 pr-4 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RES.map((r) => (
                <tr key={r.id} className="border-b border-border/60 hover:bg-muted/40">
                  <td className="py-3 pr-4 font-mono text-xs">{r.id}</td>
                  <td className="py-3 pr-4 font-medium">{r.guest}</td>
                  <td className="py-3 pr-4 inline-flex items-center gap-2"><Bed className="h-3.5 w-3.5 text-muted-foreground" />{r.room}</td>
                  <td className="py-3 pr-4">{r.in}</td>
                  <td className="py-3 pr-4">{r.out}</td>
                  <td className="py-3 pr-4">{r.channel}</td>
                  <td className="py-3 pr-4"><span className={`text-xs font-semibold px-2 py-1 rounded-full ${r.color}`}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
