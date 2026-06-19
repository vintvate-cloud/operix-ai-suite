"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard-shell";
import { Plus, X, Search, CheckCircle2, Clock, Trash2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc, updateDoc } from "firebase/firestore";

export default function HousekeepingPage() {
  const { user, activeProperty } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ room: "", type: "Cleaning", priority: "Normal" });

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "housekeeping"), where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      if (activeProperty) data = data.filter(d => !d.propertyId || d.propertyId === activeProperty);
      data.sort((a, b) => b.createdAt - a.createdAt);
      setTasks(data);
    });
    return () => unsubscribe();
  }, [user, activeProperty]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await addDoc(collection(db, "housekeeping"), {
      ownerId: user.uid,
      propertyId: activeProperty || "",
      ...formData,
      status: "Pending",
      createdAt: Date.now()
    });
    setIsModalOpen(false);
    setFormData({ room: "", type: "Cleaning", priority: "Normal" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Housekeeping Tasks"
        action={
          <button onClick={() => setIsModalOpen(true)} className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Task
          </button>
        }
      />
      <div className="bg-card border border-border rounded-3xl p-6 shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="border-b border-border text-muted-foreground">
            <tr>
              <th className="py-4 font-semibold">Room / Area</th>
              <th className="py-4 font-semibold">Type</th>
              <th className="py-4 font-semibold">Priority</th>
              <th className="py-4 font-semibold">Status</th>
              <th className="py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length === 0 ? (
              <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No tasks assigned.</td></tr>
            ) : tasks.map(t => (
              <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30">
                <td className="py-4 font-bold">{t.room}</td>
                <td className="py-4">{t.type}</td>
                <td className="py-4"><span className={`px-2 py-1 rounded-full text-xs font-bold ${t.priority === 'High' ? 'bg-rose-500/20 text-rose-700' : 'bg-muted'}`}>{t.priority}</span></td>
                <td className="py-4">
                  {t.status === "Completed" ? (
                    <span className="flex items-center gap-1 text-emerald-600 font-bold text-xs"><CheckCircle2 className="h-4 w-4"/> Done</span>
                  ) : (
                    <span className="flex items-center gap-1 text-orange-600 font-bold text-xs"><Clock className="h-4 w-4"/> Pending</span>
                  )}
                </td>
                <td className="py-4 text-right flex justify-end gap-2">
                  {t.status !== "Completed" && (
                    <button onClick={() => updateDoc(doc(db, "housekeeping", t.id), { status: "Completed" })} className="bg-op-purple/20 text-op-purple px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-op-purple/30">Complete</button>
                  )}
                  <button onClick={() => deleteDoc(doc(db, "housekeeping", t.id))} className="text-rose-500 p-1.5 rounded-lg hover:bg-rose-500/10"><Trash2 className="h-4 w-4"/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form onSubmit={handleAdd} className="bg-background rounded-3xl p-6 w-full max-w-md">
            <h3 className="font-display text-xl mb-4">Add Task</h3>
            <div className="space-y-4">
              <input required placeholder="Room Number (e.g. 102)" value={formData.room} onChange={e=>setFormData({...formData, room: e.target.value})} className="w-full bg-muted p-3 rounded-xl outline-none" />
              <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-muted p-3 rounded-xl outline-none">
                <option>Cleaning</option><option>Deep Clean</option><option>Turn Down</option><option>Inspection</option>
              </select>
              <select value={formData.priority} onChange={e=>setFormData({...formData, priority: e.target.value})} className="w-full bg-muted p-3 rounded-xl outline-none">
                <option>Normal</option><option>High</option>
              </select>
            </div>
            <div className="flex gap-2 mt-6">
              <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-muted p-3 rounded-xl font-bold">Cancel</button>
              <button type="submit" className="flex-1 bg-op-purple text-foreground p-3 rounded-xl font-bold">Assign Task</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
