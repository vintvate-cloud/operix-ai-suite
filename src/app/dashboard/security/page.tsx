"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Plus, Trash2, Lock, X, Edit2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

export default function SecurityPage() {
  const { user, userData, activeProperty } = useAuth();
  const [dataList, setDataList] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const initialForm = {
    timestamp: "",
    event: "",
    user: "",
    severity: ""
  };
  
  const [formData, setFormData] = useState<any>(initialForm);

  useEffect(() => {
    if (!user) return;
    let q = query(collection(db, "security"), where("ownerId", "==", user.uid));
    if (activeProperty) {
      q = query(collection(db, "security"), where("ownerId", "==", user.uid), where("propertyId", "==", activeProperty));
    }
    const unsub = onSnapshot(q, (snap) => {
      setDataList(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user, activeProperty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const docId = formData.id || crypto.randomUUID();
      await setDoc(doc(db, "security", docId), {
        ...formData,
        id: docId,
        ownerId: user.uid,
        propertyId: activeProperty || null,
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

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this entry?")) {
      await deleteDoc(doc(db, "security", id));
    }
  };

  const handleEdit = (item: any) => {
    setFormData(item);
    setIsAdding(true);
  };

  return (
    <>
      <PageHeader 
        eyebrow="Module" 
        title="Security Logs" 
        action={
          <button onClick={() => { setFormData(initialForm); setIsAdding(true); }} className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Entry
          </button>
        } 
      />

      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-3xl p-6 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl">{formData.id ? 'Edit' : 'New'} Security Logs Entry</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-muted rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Timestamp</label>
                <input 
                  required={true} 
                  type="datetime-local" 
                  className="bg-muted border border-border rounded-xl px-4 py-3 outline-none" 
                  value={formData.timestamp || ''} 
                  onChange={e => setFormData({...formData, timestamp: e.target.value})} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Event Description</label>
                <input 
                  required={true} 
                  type="text" 
                  className="bg-muted border border-border rounded-xl px-4 py-3 outline-none" 
                  value={formData.event || ''} 
                  onChange={e => setFormData({...formData, event: e.target.value})} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">User Involved</label>
                <input 
                  required={true} 
                  type="text" 
                  className="bg-muted border border-border rounded-xl px-4 py-3 outline-none" 
                  value={formData.user || ''} 
                  onChange={e => setFormData({...formData, user: e.target.value})} 
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Severity (Low/Medium/High)</label>
                <input 
                  required={true} 
                  type="text" 
                  className="bg-muted border border-border rounded-xl px-4 py-3 outline-none" 
                  value={formData.severity || ''} 
                  onChange={e => setFormData({...formData, severity: e.target.value})} 
                />
              </div>
              <div className="sm:col-span-2 flex justify-end gap-2 mt-4">
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-xl font-semibold hover:bg-muted transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-op-purple text-foreground px-8 py-3 rounded-xl font-bold transition hover:opacity-90 disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Entry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-muted-foreground">Timestamp</th>
                <th className="p-4 font-semibold text-muted-foreground">Event Description</th>
                <th className="p-4 font-semibold text-muted-foreground">User Involved</th>
                <th className="p-4 font-semibold text-muted-foreground">Severity (Low/Medium/High)</th>
                <th className="p-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Lock className="h-8 w-8 text-muted-foreground/50" />
                      No data found. Create your first entry!
                    </div>
                  </td>
                </tr>
              ) : (
                dataList.map(item => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="p-4">{item.timestamp}</td>
                    <td className="p-4">{item.event}</td>
                    <td className="p-4">{item.user}</td>
                    <td className="p-4">{item.severity}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-blue-500 hover:bg-blue-500/10 p-2 rounded-full transition">
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-full transition">
                        <Trash2 className="h-4 w-4" />
                      </button>
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
