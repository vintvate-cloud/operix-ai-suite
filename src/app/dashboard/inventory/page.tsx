"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc, updateDoc } from "firebase/firestore";
import { Boxes, Plus, Search, AlertTriangle, Edit2, Trash2, ArrowDownUp, PackageOpen, X, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

export default function InventoryPage() {
  const { user, activeProperty } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialForm = {
    name: "",
    category: "Food", // Food, Beverage, Supplies, Linens
    sku: "",
    quantity: 0,
    unit: "kg", // kg, liters, units, boxes
    reorderLevel: 0,
    costPerUnit: 0,
  };
  
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!user) return;
    let q = query(collection(db, "inventory"), where("ownerId", "==", user.uid));
    if (activeProperty) {
      q = query(collection(db, "inventory"), where("ownerId", "==", user.uid), where("propertyId", "==", activeProperty));
    }
    const unsub = onSnapshot(q, (snap) => {
      setInventory(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => a.name.localeCompare(b.name)));
    });
    return unsub;
  }, [user, activeProperty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const docId = formData.id || crypto.randomUUID();
      await setDoc(doc(db, "inventory", docId), {
        ...formData,
        id: docId,
        ownerId: user.uid,
        propertyId: activeProperty || null,
        quantity: Number(formData.quantity),
        reorderLevel: Number(formData.reorderLevel),
        costPerUnit: Number(formData.costPerUnit),
        updatedAt: Date.now()
      });

      setIsAdding(false);
      setFormData(initialForm);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this inventory item?")) {
      await deleteDoc(doc(db, "inventory", id));
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setIsAdding(true);
  };

  const handleQuickAdjust = async (id: string, currentQty: number, adjustment: number) => {
    const newQty = Math.max(0, currentQty + adjustment);
    await updateDoc(doc(db, "inventory", id), { quantity: newQty, updatedAt: Date.now() });
  };

  const filteredItems = inventory.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase()) || 
    i.sku?.toLowerCase().includes(search.toLowerCase())
  );

  const lowStockItems = inventory.filter(i => i.quantity <= i.reorderLevel);
  const totalValue = inventory.reduce((acc, i) => acc + (i.quantity * i.costPerUnit), 0);

  return (
    <>
      <PageHeader 
        eyebrow="Procurement" 
        title="Inventory Control" 
        action={
          <button onClick={() => { setFormData(initialForm); setIsAdding(true); }} className="bg-op-purple text-foreground rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 hover:scale-105 transition shadow-lg shadow-op-purple/20">
            <Plus className="h-4 w-4" /> Add New Stock Item
          </button>
        } 
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-2xl p-5 hover-lift">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2"><PackageOpen className="h-4 w-4"/> Total SKUs</div>
          <div className="font-display text-3xl">{inventory.length}</div>
        </div>
        <div className="bg-card border border-border rounded-2xl p-5 hover-lift">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2"><RefreshCw className="h-4 w-4"/> Stock Value</div>
          <div className="font-display text-3xl">${totalValue.toFixed(2)}</div>
        </div>
        <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-5 hover-lift lg:col-span-2">
          <div className="text-xs font-semibold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-2"><AlertTriangle className="h-4 w-4"/> Low Stock Alerts</div>
          <div className="flex items-end gap-3">
            <div className="font-display text-3xl text-rose-500">{lowStockItems.length} items</div>
            <div className="text-sm text-rose-500/80 mb-1">require immediate reordering</div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-border bg-muted/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Search items by name or SKU..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-background border border-border rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-op-purple transition"
            />
          </div>
          <div className="flex gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold">Healthy Stock</span>
            <span className="px-3 py-1.5 rounded-full bg-rose-500/10 text-rose-500 font-bold">Low Stock</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-muted-foreground">Item Name</th>
                <th className="p-4 font-semibold text-muted-foreground">Category</th>
                <th className="p-4 font-semibold text-muted-foreground">Current Stock</th>
                <th className="p-4 font-semibold text-muted-foreground">Status</th>
                <th className="p-4 font-semibold text-muted-foreground">Avg Cost</th>
                <th className="p-4 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center text-muted-foreground">
                    <Boxes className="h-12 w-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg">No inventory items found.</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map(item => {
                  const isLow = item.quantity <= item.reorderLevel;
                  return (
                    <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-foreground">{item.name}</div>
                        <div className="text-xs text-muted-foreground">SKU: {item.sku || "N/A"}</div>
                      </td>
                      <td className="p-4"><span className="bg-muted px-2 py-1 rounded text-xs">{item.category}</span></td>
                      <td className="p-4 font-display text-lg">
                        {item.quantity} <span className="text-xs text-muted-foreground">{item.unit}</span>
                      </td>
                      <td className="p-4">
                        {isLow ? (
                          <span className="bg-rose-500/20 text-rose-500 px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-max">
                            <AlertTriangle className="h-3 w-3" /> Reorder Now (Min: {item.reorderLevel})
                          </span>
                        ) : (
                          <span className="bg-emerald-500/20 text-emerald-500 px-2.5 py-1 rounded-full text-xs font-bold w-max inline-block">
                            In Stock
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-muted-foreground">${item.costPerUnit.toFixed(2)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {/* Quick Adjust Buttons */}
                          <div className="flex items-center bg-muted rounded-lg mr-2 border border-border overflow-hidden">
                            <button onClick={() => handleQuickAdjust(item.id, item.quantity, -1)} className="px-2 py-1 hover:bg-background transition border-r border-border" title="-1">-</button>
                            <button onClick={() => handleQuickAdjust(item.id, item.quantity, 1)} className="px-2 py-1 hover:bg-background transition" title="+1">+</button>
                          </div>
                          
                          <button onClick={() => handleEdit(item)} className="p-2 hover:bg-blue-500/20 text-blue-500 rounded-lg transition" title="Edit Item">
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-rose-500/20 text-rose-500 rounded-lg transition" title="Delete Item">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-3xl p-6 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl">{formData.id ? 'Edit' : 'New'} Inventory Item</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-muted rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Item Name</label>
                <input required type="text" placeholder="e.g. Tomato Puree, King Size Bed Sheet" className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">SKU / Barcode</label>
                <input type="text" className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Category</label>
                <select className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                  <option>Food</option>
                  <option>Beverage</option>
                  <option>Supplies</option>
                  <option>Linens & Towels</option>
                  <option>Toiletries</option>
                  <option>Equipment</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Current Quantity</label>
                <input required type="number" min="0" step="any" className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple font-mono" value={formData.quantity} onChange={e => setFormData({...formData, quantity: Number(e.target.value)})} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Unit of Measurement</label>
                <select className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.unit} onChange={e => setFormData({...formData, unit: e.target.value})}>
                  <option>units</option>
                  <option>kg</option>
                  <option>liters</option>
                  <option>boxes</option>
                  <option>packs</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Low Stock Alert Level (Reorder Point)</label>
                <input required type="number" min="0" step="any" className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-rose-500 font-mono" value={formData.reorderLevel} onChange={e => setFormData({...formData, reorderLevel: Number(e.target.value)})} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Average Cost Per Unit ($)</label>
                <input required type="number" min="0" step="any" className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-emerald-500 font-mono" value={formData.costPerUnit} onChange={e => setFormData({...formData, costPerUnit: Number(e.target.value)})} />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-xl font-semibold hover:bg-muted transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-op-purple text-foreground px-8 py-3 rounded-xl font-bold transition hover:opacity-90 disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
