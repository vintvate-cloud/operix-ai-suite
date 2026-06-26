"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc, addDoc } from "firebase/firestore";
import { Plus, Trash2, Utensils, X, Edit2, Tag, Layers } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

const DEFAULT_CATEGORIES = ["Starters", "Mains", "Sides", "Desserts", "Beverages", "Cocktails"];

export default function MenuPage() {
  const { user, userData, activeProperty } = useAuth();
  const [dataList, setDataList] = useState<any[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  
  const [isAdding, setIsAdding] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [newCatName, setNewCatName] = useState("");

  const initialForm = {
    itemName: "",
    category: "Mains",
    price: "",
    description: ""
  };
  
  const [formData, setFormData] = useState<any>(initialForm);

  useEffect(() => {
    if (!user) return;
    
    // Fetch Menu Items
    let qMenu = query(collection(db, "menu"), where("ownerId", "==", user.uid));
    if (activeProperty) {
      qMenu = query(collection(db, "menu"), where("ownerId", "==", user.uid), where("propertyId", "==", activeProperty));
    }
    const unsubMenu = onSnapshot(qMenu, (snap) => {
      setDataList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    // Fetch Categories
    let qCats = query(collection(db, "menuCategories"), where("ownerId", "==", user.uid));
    if (activeProperty) {
      qCats = query(collection(db, "menuCategories"), where("ownerId", "==", user.uid), where("propertyId", "==", activeProperty));
    }
    const unsubCats = onSnapshot(qCats, (snap) => {
      const cats = snap.docs.map(d => ({ id: d.id, name: d.data().name }));
      if (cats.length === 0) {
        setCategories(DEFAULT_CATEGORIES.map(c => ({ id: c, name: c })));
      } else {
        setCategories(cats);
      }
    });

    return () => { unsubMenu(); unsubCats(); };
  }, [user, activeProperty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const docId = formData.id || crypto.randomUUID();
      await setDoc(doc(db, "menu", docId), {
        ...formData,
        id: docId,
        ownerId: user.uid,
        propertyId: activeProperty || null,
        price: Number(formData.price),
        updatedAt: Date.now(),
        createdAt: formData.createdAt || Date.now()
      });

      setIsAdding(false);
      setFormData(initialForm);
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newCatName.trim()) return;
    await addDoc(collection(db, "menuCategories"), {
      name: newCatName.trim(),
      ownerId: user.uid,
      propertyId: activeProperty || null,
      createdAt: Date.now()
    });
    setNewCatName("");
  };

  const handleDeleteCategory = async (cat: { id: string; name: string }) => {
    // If it's a default fallback item, we can't delete doc unless we save custom overrides, but if it has a firestore ID we delete
    if (DEFAULT_CATEGORIES.includes(cat.id)) {
      alert("This is a built-in default category. Add custom categories to override defaults.");
      return;
    }
    await deleteDoc(doc(db, "menuCategories", cat.id));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this menu dish?")) {
      await deleteDoc(doc(db, "menu", id));
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setIsAdding(true);
  };

  return (
    <>
      <PageHeader 
        eyebrow="Restaurant POS" 
        title="Menu Editor" 
        action={
          <div className="flex items-center gap-3">
            <button onClick={() => setIsCatModalOpen(true)} className="bg-muted text-foreground hover:bg-muted/80 rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 border border-border shadow-sm transition">
              <Layers className="h-4 w-4 text-op-purple" /> Manage Categories
            </button>
            <button onClick={() => { setFormData({ ...initialForm, category: categories[0]?.name || "Mains" }); setIsAdding(true); }} className="bg-op-purple text-foreground hover:opacity-90 rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-op-purple/20 transition">
              <Plus className="h-4 w-4" /> Add Menu Dish
            </button>
          </div>
        } 
      />

      {/* CATEGORY MANAGEMENT DIALOGUE BOX */}
      {isCatModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-op-purple/10 text-op-purple"><Tag className="h-5 w-5"/></div>
                <h3 className="font-display text-xl">Menu Categories</h3>
              </div>
              <button onClick={() => setIsCatModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
              <input 
                placeholder="New category name..." 
                className="flex-1 bg-muted border border-border rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-op-purple"
                value={newCatName}
                onChange={e => setNewCatName(e.target.value)}
              />
              <button type="submit" className="bg-op-purple text-foreground px-4 py-2.5 rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition">
                Add
              </button>
            </form>

            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Existing Categories</div>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {categories.map(c => (
                <div key={c.id} className="flex items-center justify-between bg-muted/50 p-3 rounded-xl border border-border/60">
                  <span className="font-medium text-sm">{c.name}</span>
                  {!DEFAULT_CATEGORIES.includes(c.id) && (
                    <button onClick={() => handleDeleteCategory(c)} className="text-rose-500 hover:bg-rose-500/10 p-1.5 rounded-lg transition" title="Delete Category">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button onClick={() => setIsCatModalOpen(false)} className="w-full mt-6 bg-muted py-3 rounded-xl font-bold text-sm hover:bg-muted/80 transition">
              Done
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT MENU ITEM MODAL */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <h3 className="font-display text-2xl">{formData.id ? 'Edit' : 'New'} Menu Dish</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-muted rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Dish / Drink Name</label>
                <input 
                  required={true} 
                  type="text" 
                  placeholder="e.g. Truffle Butter Ribeye, Mango Mojito"
                  className="bg-muted border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-op-purple transition" 
                  value={formData.itemName || ''} 
                  onChange={e => setFormData({...formData, itemName: e.target.value})} 
                />
              </div>

              {/* CATEGORY DROPDOWN + QUICK ADD BUTTON */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Category</label>
                  <button type="button" onClick={() => setIsCatModalOpen(true)} className="text-[11px] font-bold text-op-purple hover:underline flex items-center gap-1">
                    + Manage Categories
                  </button>
                </div>
                <select 
                  className="bg-muted border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-op-purple transition font-medium text-foreground"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Price (₹)</label>
                <input 
                  required={true} 
                  type="number" 
                  step="0.01"
                  placeholder="0.00"
                  className="bg-muted border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-op-purple font-mono transition" 
                  value={formData.price || ''} 
                  onChange={e => setFormData({...formData, price: e.target.value})} 
                />
              </div>

              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider ml-1">Description (Menu blurb)</label>
                <textarea 
                  rows={3}
                  placeholder="Describe ingredients, allergens, or preparation..."
                  className="bg-muted border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-op-purple transition resize-none" 
                  value={formData.description || ''} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-border">
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-xl font-semibold hover:bg-muted transition text-sm">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-op-purple text-foreground px-8 py-3 rounded-xl font-bold transition hover:opacity-90 disabled:opacity-50 text-sm shadow-lg shadow-op-purple/20">
                  {isSubmitting ? "Saving..." : "Save Menu Dish"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISH LIST TABLE */}
      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-5 font-semibold text-muted-foreground">Dish Name</th>
                <th className="p-5 font-semibold text-muted-foreground">Category</th>
                <th className="p-5 font-semibold text-muted-foreground">Price</th>
                <th className="p-5 font-semibold text-muted-foreground">Description</th>
                <th className="p-5 font-semibold text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-16 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Utensils className="h-10 w-10 text-muted-foreground/30 mb-1" />
                      <p className="text-lg font-medium text-foreground">Menu is Empty</p>
                      <p className="text-xs">Click &quot;Add Menu Dish&quot; above to create your restaurant menu.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                dataList.map(item => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-5 font-bold text-foreground">{item.itemName}</td>
                    <td className="p-5">
                      <span className="bg-op-purple/10 text-op-purple font-semibold text-xs px-3 py-1 rounded-full inline-block">
                        {item.category}
                      </span>
                    </td>
                    <td className="p-5 font-mono font-bold text-base">₹{Number(item.price).toFixed(2)}</td>
                    <td className="p-5 text-muted-foreground max-w-xs truncate">{item.description || "—"}</td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleEdit(item)} className="text-blue-500 hover:bg-blue-500/10 p-2 rounded-xl transition" title="Edit Item">
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleDelete(item.id)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-xl transition" title="Delete Item">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
