"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Users, Search, Star, Phone, Mail, MapPin, Edit2, Trash2, Plus, X, Heart, History, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

export default function GuestsCRMPage() {
  const { user } = useAuth();
  const [guests, setGuests] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialForm = {
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    address: "",
    preferences: "",
    status: "Active",
    loyaltyTier: "Bronze"
  };
  
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "guests"), where("ownerId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setGuests(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt));
    });
    return unsub;
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const docId = formData.id || crypto.randomUUID();
      await setDoc(doc(db, "guests", docId), {
        ...formData,
        id: docId,
        ownerId: user.uid,
        lifetimeSpend: formData.lifetimeSpend || 0,
        visits: formData.visits || 0,
        createdAt: formData.createdAt || Date.now(),
        updatedAt: Date.now()
      });

      setIsAdding(false);
      setFormData(initialForm);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this guest profile?")) {
      await deleteDoc(doc(db, "guests", id));
      if (selectedGuest?.id === id) setSelectedGuest(null);
    }
  };

  const handleEdit = (g: any) => {
    setFormData(g);
    setIsAdding(true);
  };

  const filteredGuests = guests.filter(g => 
    (g.firstName + " " + g.lastName).toLowerCase().includes(search.toLowerCase()) || 
    g.phone.includes(search)
  );

  return (
    <>
      <PageHeader 
        eyebrow="Guests & Loyalty" 
        title="Guest CRM 360" 
        action={
          <button onClick={() => { setFormData(initialForm); setIsAdding(true); }} className="bg-op-purple text-foreground rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 shadow-lg shadow-op-purple/20 hover:scale-105 transition">
            <Plus className="h-4 w-4" /> Add Guest Profile
          </button>
        } 
      />

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Side: Guest Directory */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              placeholder="Search guests by name or phone..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-card border border-border rounded-2xl pl-11 pr-4 py-3 outline-none focus:ring-2 focus:ring-op-purple transition shadow-sm"
            />
          </div>

          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm h-[calc(100vh-250px)] flex flex-col">
            <div className="p-4 border-b border-border bg-muted/30">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Directory ({filteredGuests.length})</div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {filteredGuests.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground">
                  <Users className="h-8 w-8 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No guests found.</p>
                </div>
              ) : (
                filteredGuests.map(g => (
                  <button 
                    key={g.id} 
                    onClick={() => setSelectedGuest(g)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-center gap-3 ${selectedGuest?.id === g.id ? "bg-op-purple/20 border border-op-purple/30" : "hover:bg-muted"}`}
                  >
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold shrink-0 ${g.loyaltyTier === 'VIP' ? 'bg-amber-500/20 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                      {g.firstName[0]}{g.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold truncate">{g.firstName} {g.lastName}</div>
                      <div className="text-xs text-muted-foreground truncate">{g.phone}</div>
                    </div>
                    {g.loyaltyTier === 'VIP' && <Star className="h-4 w-4 text-amber-500 shrink-0 fill-amber-500" />}
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Side: 360 Profile */}
        <div className="lg:col-span-2">
          {!selectedGuest ? (
            <div className="bg-card border border-border rounded-3xl h-full flex flex-col items-center justify-center p-12 text-muted-foreground min-h-[400px]">
              <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mb-6">
                <Users className="h-10 w-10 opacity-30" />
              </div>
              <h3 className="font-display text-2xl text-foreground mb-2">Select a Guest</h3>
              <p className="text-center max-w-sm">Click on any guest from the directory to view their complete 360° profile, lifetime value, and preferences.</p>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-3xl overflow-hidden animate-in fade-in duration-200">
              {/* Profile Header */}
              <div className="relative h-32 bg-gradient-to-r from-op-purple/40 to-op-pink/40">
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => handleEdit(selectedGuest)} className="bg-background/50 backdrop-blur text-foreground hover:bg-background p-2 rounded-full transition shadow-sm">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => handleDelete(selectedGuest.id)} className="bg-background/50 backdrop-blur text-rose-500 hover:bg-rose-500 hover:text-white p-2 rounded-full transition shadow-sm">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <div className="px-8 pb-8 relative -mt-12">
                <div className="flex items-end gap-5 mb-6">
                  <div className={`h-24 w-24 rounded-3xl flex items-center justify-center font-display text-4xl shadow-xl border-4 border-card ${selectedGuest.loyaltyTier === 'VIP' ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground'}`}>
                    {selectedGuest.firstName[0]}{selectedGuest.lastName[0]}
                  </div>
                  <div className="pb-2">
                    <h2 className="font-display text-3xl">{selectedGuest.firstName} {selectedGuest.lastName}</h2>
                    <div className="flex items-center gap-3 mt-1 text-sm">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${selectedGuest.loyaltyTier === 'VIP' ? 'bg-amber-500/20 text-amber-500' : 'bg-muted text-muted-foreground'}`}>
                        {selectedGuest.loyaltyTier} Member
                      </span>
                      <span className="text-muted-foreground">Since {new Date(selectedGuest.createdAt).getFullYear()}</span>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-muted rounded-2xl p-4 flex flex-col justify-center">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><TrendingUp className="h-3.5 w-3.5"/> Lifetime Spend</div>
                    <div className="font-display text-2xl">${(selectedGuest.lifetimeSpend || 0).toFixed(2)}</div>
                  </div>
                  <div className="bg-muted rounded-2xl p-4 flex flex-col justify-center">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><History className="h-3.5 w-3.5"/> Total Visits</div>
                    <div className="font-display text-2xl">{selectedGuest.visits || 0} Stays</div>
                  </div>
                  <div className="bg-muted rounded-2xl p-4 flex flex-col justify-center">
                    <div className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5"><Heart className="h-3.5 w-3.5"/> Status</div>
                    <div className="font-display text-xl text-emerald-500">{selectedGuest.status}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Contact Info</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0"><Phone className="h-4 w-4" /></div>
                        {selectedGuest.phone || "No phone added"}
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0"><Mail className="h-4 w-4" /></div>
                        {selectedGuest.email || "No email added"}
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center shrink-0"><MapPin className="h-4 w-4" /></div>
                        {selectedGuest.address || "No address added"}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">Guest Preferences</h4>
                    <div className="bg-op-purple/5 border border-op-purple/10 rounded-2xl p-4 h-full min-h-[120px]">
                      {selectedGuest.preferences ? (
                        <p className="text-sm text-foreground/80 leading-relaxed whitespace-pre-wrap">{selectedGuest.preferences}</p>
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No special preferences recorded yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-3xl p-6 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl">{formData.id ? 'Edit' : 'New'} Guest Profile</h3>
              <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-muted rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">First Name</label>
                <input required type="text" className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Last Name</label>
                <input required type="text" className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Phone Number</label>
                <input required type="tel" className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Email Address</label>
                <input type="email" className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              
              <div className="flex flex-col gap-1 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Home Address / Country</label>
                <input type="text" className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Loyalty Tier</label>
                <select className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.loyaltyTier} onChange={e => setFormData({...formData, loyaltyTier: e.target.value})}>
                  <option>Bronze</option>
                  <option>Silver</option>
                  <option>Gold</option>
                  <option>Platinum</option>
                  <option>VIP</option>
                </select>
              </div>

              <div className="flex flex-col gap-1 sm:col-span-2 mt-2">
                <label className="text-xs font-semibold text-muted-foreground ml-1">Guest Preferences & Notes (Allergies, Room Requests, etc.)</label>
                <textarea rows={3} className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple resize-none" value={formData.preferences} onChange={e => setFormData({...formData, preferences: e.target.value})} />
              </div>

              <div className="sm:col-span-2 flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-xl font-semibold hover:bg-muted transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-op-purple text-foreground px-8 py-3 rounded-xl font-bold transition hover:opacity-90 disabled:opacity-50">
                  {isSubmitting ? "Saving..." : "Save Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
