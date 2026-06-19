"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, updateDoc, doc } from "firebase/firestore";
import { ChefHat, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

export default function KitchenPage() {
  const { user, activeProperty } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const qOrders = query(collection(db, "orders"), where("ownerId", "==", user.uid));
    const unsub = onSnapshot(qOrders, (snap) => {
      let ords = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (activeProperty) ords = ords.filter(o => !o.propertyId || o.propertyId === activeProperty);
      setOrders(ords.sort((a, b) => b.createdAt - a.createdAt));
    });
    return unsub;
  }, [user, activeProperty]);

  const activeOrders = orders.filter(o => o.status === "Preparing" || o.status === "Ready");

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col">
      <PageHeader eyebrow="Operations" title="Kitchen Display System" />
      
      <div className="flex-1 overflow-y-auto mt-4 pb-12">
        {activeOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground bg-card rounded-3xl border border-border">
            <ChefHat className="h-20 w-20 mx-auto opacity-20 mb-4" />
            <p className="text-xl font-display">No active orders right now.</p>
            <p className="opacity-70">Waiting for front-of-house to send tickets.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {activeOrders.map(o => (
              <div key={o.id} className={`bg-card rounded-3xl p-6 border-2 ${o.status === 'Ready' ? 'border-emerald-500/50' : 'border-op-orange/50'} shadow-lg flex flex-col`}>
                <div className="flex justify-between items-start mb-4 border-b border-border pb-4">
                  <div>
                    <div className="font-bold text-xl">Order #{o.id.substring(0, 5).toUpperCase()}</div>
                    <div className="text-sm text-muted-foreground">{new Date(o.createdAt).toLocaleTimeString()}</div>
                  </div>
                  <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${o.status === 'Ready' ? 'bg-emerald-500/20 text-emerald-600' : 'bg-op-orange/20 text-orange-600'}`}>
                    {o.status}
                  </span>
                </div>
                
                <div className="flex-1 space-y-4 mb-8">
                  {o.items.map((i: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-center">
                      <span className="font-bold bg-muted px-3 py-1.5 rounded-lg text-foreground text-lg">{i.qty}x</span>
                      <span className="font-medium text-xl">{i.name}</span>
                    </div>
                  ))}
                </div>

                {o.status === "Preparing" ? (
                  <button onClick={() => updateDoc(doc(db, "orders", o.id), { status: "Ready" })} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 rounded-xl text-lg transition flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-5 w-5" /> Mark Ready
                  </button>
                ) : (
                  <button onClick={() => updateDoc(doc(db, "orders", o.id), { status: "Completed" })} className="w-full bg-muted font-bold py-4 rounded-xl transition text-muted-foreground hover:bg-muted/80">
                    Archive Order
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
