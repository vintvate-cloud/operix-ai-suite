import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";
import { Star, Mail } from "lucide-react";

export const Route = createFileRoute("/dashboard/guests")({
  component: Page,
});

const GUESTS = [
  { name: "Aarav Mehta", tier: "Platinum", stays: 14, spend: "$48k", lang: "EN", color: "bg-op-purple" },
  { name: "Lucia García", tier: "Gold", stays: 8, spend: "$22k", lang: "ES", color: "bg-op-pink" },
  { name: "Hiro Tanaka", tier: "Platinum", stays: 21, spend: "$96k", lang: "JP", color: "bg-op-peach" },
  { name: "Camille Roux", tier: "Silver", stays: 4, spend: "$9k", lang: "FR", color: "bg-op-beige" },
  { name: "Mikael Vinter", tier: "Gold", stays: 11, spend: "$31k", lang: "SE", color: "bg-op-orange" },
  { name: "Laura Castaño", tier: "Silver", stays: 3, spend: "$7k", lang: "ES", color: "bg-op-purple" },
];

function Page() {
  return (
    <>
      <PageHeader eyebrow="Guests · CRM" title="Your guest book" />
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { l: "Total guests", v: "12,408" },
          { l: "Repeat rate", v: "38%" },
          { l: "Avg lifetime value", v: "$8.2k" },
        ].map((k) => (
          <div key={k.l} className="bg-card border border-border rounded-3xl p-5">
            <div className="text-sm text-muted-foreground">{k.l}</div>
            <div className="font-display text-4xl mt-2">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {GUESTS.map((g) => (
          <div key={g.name} className="bg-card border border-border rounded-3xl p-5 hover-lift">
            <div className="flex items-center gap-3">
              <div className={`h-12 w-12 rounded-full ${g.color} flex items-center justify-center font-semibold`}>
                {g.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <div className="font-semibold truncate">{g.name}</div>
                <div className="text-xs text-muted-foreground inline-flex items-center gap-1"><Star className="h-3 w-3" /> {g.tier} · {g.lang}</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-2xl bg-muted px-3 py-2">
                <div className="text-xs text-muted-foreground">Stays</div>
                <div className="font-semibold">{g.stays}</div>
              </div>
              <div className="rounded-2xl bg-muted px-3 py-2">
                <div className="text-xs text-muted-foreground">Lifetime</div>
                <div className="font-semibold">{g.spend}</div>
              </div>
            </div>
            <button className="mt-4 w-full inline-flex items-center justify-center gap-2 text-sm bg-foreground text-background rounded-full py-2.5 font-semibold">
              <Mail className="h-4 w-4" /> Message
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
