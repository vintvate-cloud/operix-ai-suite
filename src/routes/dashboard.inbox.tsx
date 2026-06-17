import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard-shell";
import { Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/inbox")({
  component: Page,
});

const THREADS = [
  { id: "1", from: "Suite 1204 · A. Mehta", channel: "WhatsApp", last: "Late checkout tomorrow possible?", time: "2m", unread: true, color: "bg-op-purple" },
  { id: "2", from: "Room 312 · L. Castaño", channel: "SMS", last: "Could we get extra towels?", time: "11m", unread: true, color: "bg-op-pink" },
  { id: "3", from: "Villa 02 · Tanaka", channel: "Email", last: "Spa booking for two at 11?", time: "24m", unread: true, color: "bg-op-peach" },
  { id: "4", from: "Booking.com", channel: "OTA", last: "New reservation · 3 nights", time: "1h", unread: false, color: "bg-op-beige" },
  { id: "5", from: "Room 805 · C. Roux", channel: "WhatsApp", last: "Thanks for the upgrade!", time: "3h", unread: false, color: "bg-muted" },
];

function Page() {
  const [active, setActive] = useState("1");
  const t = THREADS.find((x) => x.id === active)!;
  return (
    <>
      <PageHeader eyebrow="Inbox" title="Guest conversations" />
      <div className="grid lg:grid-cols-[320px_1fr] gap-4 h-[70vh]">
        <div className="bg-card border border-border rounded-3xl p-3 overflow-y-auto">
          {THREADS.map((m) => (
            <button
              key={m.id}
              onClick={() => setActive(m.id)}
              className={`w-full text-left p-3 rounded-2xl mb-1 transition ${active === m.id ? "bg-muted" : "hover:bg-muted/60"}`}
            >
              <div className="flex items-center gap-3">
                <div className={`h-9 w-9 rounded-full ${m.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate">{m.from}</span>
                    <span className="text-[10px] text-muted-foreground">{m.time}</span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{m.last}</p>
                </div>
                {m.unread && <span className="h-2 w-2 rounded-full bg-op-orange shrink-0" />}
              </div>
            </button>
          ))}
        </div>
        <div className="bg-card border border-border rounded-3xl flex flex-col">
          <div className="p-5 border-b border-border">
            <div className="text-sm text-muted-foreground">{t.channel}</div>
            <div className="font-semibold">{t.from}</div>
          </div>
          <div className="flex-1 p-5 space-y-2 overflow-y-auto">
            <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2 max-w-[70%] text-sm">{t.last}</div>
            <div className="ml-auto bg-foreground text-background rounded-2xl rounded-tr-md px-4 py-2 max-w-[70%] text-sm">Of course — confirming now ✨</div>
          </div>
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2 mb-3 text-xs text-muted-foreground">
              <Sparkles className="h-3 w-3" /> AI suggestions
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {["Confirm 2 PM checkout", "Offer spa upgrade", "Send map"].map((s) => (
                <button key={s} className="text-xs bg-op-purple/30 hover:bg-op-purple px-3 py-1.5 rounded-full font-medium">{s}</button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input placeholder="Type a reply…" className="flex-1 bg-muted rounded-full px-4 py-2.5 text-sm outline-none" />
              <button className="bg-foreground text-background rounded-full p-2.5"><Send className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
