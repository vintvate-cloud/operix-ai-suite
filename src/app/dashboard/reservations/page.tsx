"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard-shell";
import { Search, Filter, Bed, Plus } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export default function ReservationsPage() {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    
    const q = query(collection(db, "reservations"), where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const resData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort by creation time (newest first)
      resData.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      setReservations(resData);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <PageHeader
        eyebrow="Reservations"
        title="All bookings"
        action={
          <button className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Export CSV
          </button>
        }
      />
      <div className="grid sm:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Total Bookings", v: reservations.length, c: "bg-op-purple" },
          { l: "In-house", v: reservations.filter(r => r.status === "In-house").length || 0, c: "bg-op-pink" },
          { l: "Arrivals", v: reservations.length, c: "bg-op-peach" },
          { l: "Cancellations", v: 0, c: "bg-op-beige" },
        ].map((k) => (
          <div key={k.l} className={`${k.c} rounded-3xl p-5 shadow-sm`}>
            <div className="text-sm opacity-80 font-medium">{k.l}</div>
            <div className="font-display text-4xl mt-3">{k.v}</div>
          </div>
        ))}
      </div>
      
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input placeholder="Search by guest, room, ID" className="w-full bg-muted rounded-full pl-10 pr-4 py-2 text-sm outline-none border border-border focus:ring-2 focus:ring-op-purple" />
          </div>
          <button className="text-xs px-4 py-2.5 rounded-full bg-muted border border-border inline-flex items-center gap-1 hover:bg-muted/80"><Filter className="h-3 w-3" /> Filters</button>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-muted-foreground">
              <tr className="border-b border-border">
                {["ID", "Guest", "Room Type", "Check-in", "Check-out", "Status"].map((h) => (
                  <th key={h} className="py-4 pr-4 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {reservations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-muted-foreground">
                    No reservations found. Go back to the dashboard to create one!
                  </td>
                </tr>
              ) : (
                reservations.map((r) => (
                  <tr key={r.id} className="border-b border-border/60 hover:bg-muted/40 transition">
                    <td className="py-4 pr-4 font-mono text-xs text-muted-foreground">{r.id.substring(0, 8).toUpperCase()}</td>
                    <td className="py-4 pr-4 font-semibold text-foreground">{r.guestName}</td>
                    <td className="py-4 pr-4 inline-flex items-center gap-2 mt-1">
                      <Bed className="h-3.5 w-3.5 text-op-purple" />
                      {r.roomType}
                    </td>
                    <td className="py-4 pr-4">{new Date(r.checkIn).toLocaleDateString()}</td>
                    <td className="py-4 pr-4">{new Date(r.checkOut).toLocaleDateString()}</td>
                    <td className="py-4 pr-4">
                      <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-op-success/20 text-emerald-700">
                        {r.status || "Confirmed"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
