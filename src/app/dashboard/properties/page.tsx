"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/dashboard-shell";
import { Building2, Plus, MapPin, X } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, where, deleteDoc, doc } from "firebase/firestore";

export default function PropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", location: "", type: "Hotel" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "properties"), where("ownerId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProperties(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "properties"), {
        ownerId: user.uid,
        ...formData,
        createdAt: Date.now()
      });
      setIsModalOpen(false);
      setFormData({ name: "", location: "", type: "Hotel" });
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    await deleteDoc(doc(db, "properties", id));
  };

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Your Properties"
        action={
          <button onClick={() => setIsModalOpen(true)} className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Property
          </button>
        }
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-card border border-border rounded-3xl">
            <Building2 className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>You haven't created any properties yet.</p>
          </div>
        ) : (
          properties.map(p => (
            <div key={p.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 bg-op-purple/10 text-op-purple rounded-xl flex items-center justify-center">
                  <Building2 className="h-6 w-6" />
                </div>
                <button onClick={() => handleDelete(p.id)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-full transition">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <h3 className="font-display text-xl mb-1">{p.name}</h3>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {p.location || "No location set"}
              </div>
              <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-sm">
                <span className="font-semibold text-op-purple">{p.type}</span>
                <button className="font-semibold hover:underline">Manage &rarr;</button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl">New Property</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Property Name</label>
                <input required autoFocus placeholder="e.g. The Grand Plaza" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input required placeholder="City or Address" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple">
                  <option>Hotel</option>
                  <option>Restaurant</option>
                  <option>Gym</option>
                  <option>Clinic</option>
                </select>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full mt-4 bg-op-purple text-foreground py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50">
                {isSubmitting ? "Creating..." : "Create Property"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
