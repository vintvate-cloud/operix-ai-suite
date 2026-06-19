"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore";
import { Trash2, Utensils, Coffee, Flame } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

export default function MenuManager() {
  const { user, activeProperty } = useAuth();
  const [menu, setMenu] = useState<any[]>([]);
  const [newMenuItem, setNewMenuItem] = useState({ name: "", price: "", category: "Mains" });

  useEffect(() => {
    if (!user) return;
    const qMenu = query(collection(db, "menuItems"), where("ownerId", "==", user.uid));
    const unsub = onSnapshot(qMenu, (snap) => {
      let items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (activeProperty) items = items.filter(i => !i.propertyId || i.propertyId === activeProperty);
      setMenu(items);
    });
    return unsub;
  }, [user, activeProperty]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await addDoc(collection(db, "menuItems"), {
      ownerId: user.uid,
      propertyId: activeProperty || null,
      name: newMenuItem.name,
      price: parseFloat(newMenuItem.price),
      category: newMenuItem.category,
      createdAt: Date.now()
    });
    setNewMenuItem({ name: "", price: "", category: "Mains" });
  };

  const getIcon = (cat: string) => {
    if (cat === "Drinks") return <Coffee className="h-5 w-5" />;
    if (cat === "Mains") return <Flame className="h-5 w-5" />;
    return <Utensils className="h-5 w-5" />;
  };

  return (
    <div className="flex flex-col">
      <PageHeader eyebrow="Configuration" title="Menu Management" />
      
      <div className="bg-card rounded-3xl p-6 border border-border shadow-sm mt-4">
        <div className="mb-6">
          <h2 className="text-xl font-display mb-4">Add New Item</h2>
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4 bg-muted p-4 rounded-2xl">
            <input required placeholder="Item Name (e.g. Avocado Toast)" className="flex-1 px-4 py-3 rounded-xl outline-none border border-border focus:ring-2 focus:ring-op-purple" value={newMenuItem.name} onChange={e=>setNewMenuItem({...newMenuItem, name:e.target.value})}/>
            <input required type="number" step="0.01" placeholder="Price ($)" className="w-full sm:w-32 px-4 py-3 rounded-xl outline-none border border-border focus:ring-2 focus:ring-op-purple" value={newMenuItem.price} onChange={e=>setNewMenuItem({...newMenuItem, price:e.target.value})}/>
            <input required placeholder="Category (e.g. Mains, Drinks)" className="w-full sm:w-48 px-4 py-3 rounded-xl outline-none border border-border focus:ring-2 focus:ring-op-purple" value={newMenuItem.category} onChange={e=>setNewMenuItem({...newMenuItem, category:e.target.value})}/>
            <button type="submit" className="bg-op-purple text-foreground px-8 py-3 font-bold rounded-xl hover:opacity-90 transition">Save Item</button>
          </form>
        </div>

        <h2 className="text-xl font-display mb-4 border-t border-border pt-6">Current Menu</h2>
        {menu.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Your menu is empty. Add your first dish above!</div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
            {menu.map(m => (
              <div key={m.id} className="bg-background border border-border p-4 rounded-2xl flex justify-between items-center shadow-sm group">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-op-purple/10 text-op-purple rounded-lg flex items-center justify-center">
                    {getIcon(m.category)}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{m.name}</div>
                    <div className="text-xs text-muted-foreground">${m.price.toFixed(2)} &bull; {m.category}</div>
                  </div>
                </div>
                <button onClick={() => deleteDoc(doc(db, "menuItems", m.id))} className="text-rose-500 p-2 opacity-0 group-hover:opacity-100 transition hover:bg-rose-500/10 rounded-full"><Trash2 className="h-4 w-4"/></button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
