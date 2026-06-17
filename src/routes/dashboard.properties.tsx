import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/dashboard-shell";
import { Hotel, MapPin, Plus } from "lucide-react";

export const Route = createFileRoute("/dashboard/properties")({
  component: Page,
});

const PROPS = [
  { name: "Aurelia Marina", city: "Lisbon, PT", rooms: 84, occ: 92, rev: "$412k", img: "bg-op-purple" },
  { name: "Nordic House", city: "Oslo, NO", rooms: 36, occ: 78, rev: "$184k", img: "bg-op-pink" },
  { name: "Casa Solar", city: "Barcelona, ES", rooms: 48, occ: 85, rev: "$226k", img: "bg-op-peach" },
  { name: "Kumo Hotel", city: "Tokyo, JP", rooms: 120, occ: 71, rev: "$498k", img: "bg-op-beige" },
  { name: "Maison Elysée", city: "Paris, FR", rooms: 64, occ: 88, rev: "$351k", img: "bg-op-orange" },
  { name: "Six Sands Resort", city: "Tulum, MX", rooms: 92, occ: 95, rev: "$612k", img: "bg-op-purple" },
];

function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Your properties"
        action={
          <button className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add property
          </button>
        }
      />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PROPS.map((p) => (
          <div key={p.name} className="bg-card border border-border rounded-3xl overflow-hidden hover-lift">
            <div className={`${p.img} h-36 p-5 flex items-end`}>
              <Hotel className="h-7 w-7" />
            </div>
            <div className="p-5">
              <div className="font-display text-2xl">{p.name}</div>
              <div className="text-xs text-muted-foreground inline-flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" /> {p.city}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-2xl bg-muted p-3"><div className="text-xs text-muted-foreground">Rooms</div><div className="font-semibold">{p.rooms}</div></div>
                <div className="rounded-2xl bg-muted p-3"><div className="text-xs text-muted-foreground">Occ</div><div className="font-semibold">{p.occ}%</div></div>
                <div className="rounded-2xl bg-muted p-3"><div className="text-xs text-muted-foreground">MTD</div><div className="font-semibold">{p.rev}</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
