"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { Plus, Trash2, Building2, Hotel, UtensilsCrossed, X, MapPin, BedDouble, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

export default function PropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [isAddingProperty, setIsAddingProperty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Managing Rooms state
  const [selectedProperty, setSelectedProperty] = useState<any>(null);

  const initialForm = {
    name: "",
    address: "",
    type: "Hotel", // Hotel or Restaurant
  };
  
  const [formData, setFormData] = useState<any>(initialForm);

  useEffect(() => {
    if (!user) return;
    // For Property Management, we always want to see ALL properties owned by the user, ignoring activeProperty scope.
    const q = query(collection(db, "properties"), where("ownerId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setProperties(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      const docId = crypto.randomUUID();
      await setDoc(doc(db, "properties", docId), {
        id: docId,
        name: formData.name,
        address: formData.address,
        type: formData.type,
        ownerId: user.uid,
        createdAt: Date.now()
      });

      setIsAddingProperty(false);
      setFormData(initialForm);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    if (confirm("Are you sure you want to delete this property? You will lose access to its scoped data.")) {
      await deleteDoc(doc(db, "properties", id));
    }
  };

  if (selectedProperty) {
    return (
      <RoomManager 
        property={selectedProperty} 
        onBack={() => setSelectedProperty(null)} 
      />
    );
  }

  return (
    <>
      <PageHeader 
        eyebrow="Admin Setup" 
        title="Property Management" 
        action={
          <button onClick={() => { setFormData(initialForm); setIsAddingProperty(true); }} className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 hover:scale-105 transition">
            <Plus className="h-4 w-4" /> Add Property
          </button>
        } 
      />

      {isAddingProperty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl">Create New Property</h3>
              <button onClick={() => setIsAddingProperty(false)} className="p-2 hover:bg-muted rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddProperty} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground ml-1">Property Name</label>
                <input 
                  required autoFocus
                  className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" 
                  placeholder="e.g. Grand Oasis Resort"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground ml-1">Address / Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input 
                    required 
                    className="w-full bg-muted border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" 
                    placeholder="e.g. 123 Palm Ave, Miami"
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground ml-1">Property Type</label>
                <div className="relative">
                  {formData.type === "Hotel" ? <Hotel className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" /> : <UtensilsCrossed className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />}
                  <select 
                    required
                    className="w-full bg-muted border border-border rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-op-purple appearance-none" 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value})} 
                  >
                    <option value="Hotel">Hotel / Resort</option>
                    <option value="Restaurant">Restaurant / Cafe</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-border">
                <button type="button" onClick={() => setIsAddingProperty(false)} className="px-6 py-3 rounded-xl font-semibold hover:bg-muted transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-op-purple text-foreground px-8 py-3 rounded-xl font-bold transition hover:opacity-90 disabled:opacity-50 flex items-center gap-2">
                  <Building2 className="h-4 w-4" /> {isSubmitting ? "Building..." : "Create Property"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {properties.length === 0 ? (
        <div className="bg-card rounded-3xl border border-border flex flex-col items-center justify-center p-16 text-muted-foreground">
          <Building2 className="h-16 w-16 mb-4 opacity-30" />
          <h3 className="font-display text-2xl text-foreground mb-2">No Properties Yet</h3>
          <p className="max-w-md text-center text-sm">Add your first hotel or restaurant to start mapping rooms, tables, and assigning staff to specific locations.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(prop => (
            <div key={prop.id} className="bg-card rounded-3xl border border-border overflow-hidden hover-lift flex flex-col group">
              <div className="h-32 bg-muted relative flex items-center justify-center border-b border-border">
                {prop.type === "Hotel" ? <Hotel className="h-12 w-12 text-op-purple opacity-50" /> : <UtensilsCrossed className="h-12 w-12 text-op-peach opacity-50" />}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={() => handleDeleteProperty(prop.id)} className="bg-background/80 backdrop-blur text-rose-500 hover:bg-rose-500 hover:text-white p-2 rounded-full transition shadow-sm">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className={`text-[10px] uppercase tracking-widest font-bold mb-2 ${prop.type === "Hotel" ? "text-op-purple" : "text-op-peach"}`}>
                  {prop.type}
                </div>
                <h3 className="font-display text-2xl mb-2">{prop.name}</h3>
                <p className="text-sm text-muted-foreground flex items-center gap-1.5 mb-6">
                  <MapPin className="h-3.5 w-3.5" /> {prop.address}
                </p>
                
                <div className="mt-auto pt-4 border-t border-border">
                  {prop.type === "Hotel" ? (
                    <button onClick={() => setSelectedProperty(prop)} className="w-full bg-muted text-foreground hover:bg-op-purple hover:text-white py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2">
                      <BedDouble className="h-4 w-4" /> Manage Hotel Rooms
                    </button>
                  ) : (
                    <div className="w-full text-center py-3 text-sm font-medium text-muted-foreground">
                      Restaurant configuration active
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ----------------------------------------------------------------------
// DEDICATED ROOM MANAGER COMPONENT (Visual Mapping)
// ----------------------------------------------------------------------
function RoomManager({ property, onBack }: { property: any, onBack: () => void }) {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [roomData, setRoomData] = useState({ number: "", type: "Standard" });

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "rooms"), 
      where("ownerId", "==", user.uid), 
      where("propertyId", "==", property.id)
    );
    const unsub = onSnapshot(q, (snap) => {
      setRooms(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => a.number.localeCompare(b.number)));
    });
    return unsub;
  }, [user, property.id]);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const docId = crypto.randomUUID();
    await setDoc(doc(db, "rooms", docId), {
      id: docId,
      ownerId: user.uid,
      propertyId: property.id,
      number: roomData.number,
      type: roomData.type,
      status: "Available", // Default status
      balance: 0,
      createdAt: Date.now()
    });
    setIsAddingRoom(false);
    setRoomData({ number: "", type: "Standard" });
  };

  const handleDeleteRoom = async (id: string) => {
    if (confirm("Delete this room permanently?")) {
      await deleteDoc(doc(db, "rooms", id));
    }
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-4">
        <button onClick={onBack} className="h-10 w-10 bg-card border border-border rounded-full flex items-center justify-center hover:bg-muted transition">
          <ArrowRight className="h-5 w-5 rotate-180" />
        </button>
        <div>
          <p className="text-sm text-op-purple font-bold tracking-widest uppercase">{property.name}</p>
          <h1 className="font-display text-3xl">Manage Rooms</h1>
        </div>
      </div>

      <div className="bg-card border border-border rounded-3xl p-6 sm:p-8">
        <div className="flex justify-between items-center mb-8 border-b border-border pb-6">
          <div>
            <h2 className="text-xl font-semibold">Property Floorplan Mapping</h2>
            <p className="text-sm text-muted-foreground mt-1">Add all physical rooms located in this specific property. They will immediately become available at the Front Desk.</p>
          </div>
          <button onClick={() => setIsAddingRoom(true)} className="bg-op-purple text-foreground rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 hover:scale-105 transition shadow-lg shadow-op-purple/20">
            <Plus className="h-4 w-4" /> Add New Room
          </button>
        </div>

        {isAddingRoom && (
          <form onSubmit={handleAddRoom} className="bg-muted border border-border rounded-2xl p-6 mb-8 flex flex-col sm:flex-row gap-4 items-end animate-in slide-in-from-top-4">
            <div className="flex-1 w-full">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Room Number</label>
              <input required autoFocus placeholder="e.g. 101, 405B" className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={roomData.number} onChange={e=>setRoomData({...roomData, number: e.target.value})} />
            </div>
            <div className="flex-1 w-full">
              <label className="text-xs font-semibold text-muted-foreground ml-1">Room Category</label>
              <select className="w-full bg-background border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={roomData.type} onChange={e=>setRoomData({...roomData, type: e.target.value})}>
                <option>Standard</option>
                <option>Deluxe</option>
                <option>Suite</option>
                <option>Presidential</option>
                <option>Dormitory</option>
              </select>
            </div>
            <div className="flex gap-2 w-full sm:w-auto mt-4 sm:mt-0">
              <button type="button" onClick={() => setIsAddingRoom(false)} className="px-4 py-3 rounded-xl font-semibold hover:bg-background transition">Cancel</button>
              <button type="submit" className="bg-foreground text-background px-6 py-3 rounded-xl font-bold transition hover:opacity-90 whitespace-nowrap">Save Room</button>
            </div>
          </form>
        )}

        {rooms.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BedDouble className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No rooms mapped to this property yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {rooms.map(room => (
              <div key={room.id} className="bg-background border border-border rounded-2xl p-4 flex flex-col relative group hover:border-op-purple transition-colors">
                <button onClick={() => handleDeleteRoom(room.id)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition shadow-md hover:scale-110">
                  <X className="h-3 w-3" />
                </button>
                <div className="font-display text-2xl mb-1">{room.number}</div>
                <div className="text-xs text-muted-foreground font-medium uppercase">{room.type}</div>
                <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
                  <div className={`h-2 w-2 rounded-full ${room.status === 'Available' ? 'bg-emerald-500' : room.status === 'Occupied' ? 'bg-op-purple' : 'bg-rose-500'}`} title={room.status} />
                  <span className="text-[10px] text-muted-foreground">{room.status}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
