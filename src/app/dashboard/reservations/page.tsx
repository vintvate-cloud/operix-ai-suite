"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, setDoc, updateDoc } from "firebase/firestore";
import { Plus, X, Search, BedDouble, CalendarCheck, CreditCard, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

type RoomStatus = "Available" | "Occupied" | "Cleaning" | "Maintenance" | "Blocked";

type Room = {
  id: string;
  number: string;
  type: string;
  status: RoomStatus;
  guestName?: string;
  checkInDate?: string;
  checkOutDate?: string;
  balance?: number;
};

const DEFAULT_ROOMS = [
  { number: "101", type: "Standard", status: "Available" },
  { number: "102", type: "Standard", status: "Available" },
  { number: "201", type: "Deluxe", status: "Available" },
  { number: "202", type: "Deluxe", status: "Cleaning" },
  { number: "301", type: "Suite", status: "Maintenance" },
  { number: "302", type: "Suite", status: "Available" },
];

export default function ReservationsAndFrontDesk() {
  const { user, activeProperty } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [isBooking, setIsBooking] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [search, setSearch] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Booking Form State
  const [formData, setFormData] = useState({
    guestName: "",
    phone: "",
    email: "",
    checkIn: "",
    checkOut: "",
    rate: 150,
  });

  useEffect(() => {
    if (!user) return;
    
    // Fetch Rooms
    let qRooms = query(collection(db, "rooms"), where("ownerId", "==", user.uid));
    if (activeProperty) {
      qRooms = query(collection(db, "rooms"), where("ownerId", "==", user.uid), where("propertyId", "==", activeProperty));
    }
    const unsubRooms = onSnapshot(qRooms, (snap) => {
      const fetchedRooms = snap.docs.map(d => ({ id: d.id, ...d.data() } as Room));
      
      // Auto-populate default rooms if none exist
      if (fetchedRooms.length === 0) {
        DEFAULT_ROOMS.forEach(r => {
          const docId = crypto.randomUUID();
          setDoc(doc(db, "rooms", docId), {
            ...r,
            id: docId,
            ownerId: user.uid,
            propertyId: activeProperty || null,
            balance: 0
          });
        });
      } else {
        // Sort by room number
        setRooms(fetchedRooms.sort((a, b) => a.number.localeCompare(b.number)));
      }
    }, (err) => {
      console.error("Firestore rooms error:", err);
      alert("Database Index Error: Please check console for the Firebase index creation link.");
    });

    // Fetch Restaurant Orders to calculate total room balance
    let qOrders = query(collection(db, "orders"), where("ownerId", "==", user.uid));
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Firestore orders error:", err));

    return () => { unsubRooms(); unsubOrders(); };
  }, [user, activeProperty]);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom || !user) return;
    setIsSubmitting(true);
    try {
      await updateDoc(doc(db, "rooms", selectedRoom.id), {
        status: "Occupied",
        guestName: formData.guestName,
        checkInDate: formData.checkIn,
        checkOutDate: formData.checkOut,
        balance: formData.rate, // Add initial room rate to balance
        phone: formData.phone,
        email: formData.email
      });
      setIsBooking(false);
      setFormData({ guestName: "", phone: "", email: "", checkIn: "", checkOut: "", rate: 150 });
      setSelectedRoom(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCheckOut = async (room: Room) => {
    if (confirm(`Check out ${room.guestName}? This will finalize the bill and set the room to Cleaning.`)) {
      await updateDoc(doc(db, "rooms", room.id), {
        status: "Cleaning",
        guestName: null,
        checkInDate: null,
        checkOutDate: null,
        balance: 0,
        phone: null,
        email: null
      });
    }
  };

  const handleStatusChange = async (room: Room, newStatus: RoomStatus) => {
    await updateDoc(doc(db, "rooms", room.id), { status: newStatus });
  };

  // Calculate total balance (Room rate + Restaurant orders billed to room)
  const getRoomTotalBalance = (roomNumber: string, baseBalance: number = 0) => {
    const roomOrders = orders.filter(o => o.roomNumber === roomNumber && o.status !== "Paid");
    const orderTotal = roomOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    return baseBalance + orderTotal;
  };

  const filteredRooms = rooms.filter(r => 
    r.number.includes(search) || 
    r.guestName?.toLowerCase().includes(search.toLowerCase()) ||
    r.status.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "bg-emerald-500/20 text-emerald-600 border-emerald-500/30";
      case "Occupied": return "bg-op-purple/20 text-op-purple border-op-purple/30";
      case "Cleaning": return "bg-blue-500/20 text-blue-600 border-blue-500/30";
      case "Maintenance": return "bg-rose-500/20 text-rose-600 border-rose-500/30";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <>
      <PageHeader 
        eyebrow="Hotel Operations" 
        title="Front Desk & Rooms" 
        action={
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search rooms or guests..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="bg-background border border-border rounded-full pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-op-purple w-64 shadow-sm"
            />
          </div>
        } 
      />

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-muted rounded-2xl p-4 flex flex-col justify-center">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">Total Rooms</div>
          <div className="font-display text-3xl">{rooms.length}</div>
        </div>
        <div className="bg-emerald-500/10 rounded-2xl p-4 flex flex-col justify-center border border-emerald-500/20">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Available</div>
          <div className="font-display text-3xl text-emerald-800">{rooms.filter(r => r.status === "Available").length}</div>
        </div>
        <div className="bg-op-purple/10 rounded-2xl p-4 flex flex-col justify-center border border-op-purple/20">
          <div className="text-xs font-semibold text-op-purple uppercase tracking-wider mb-1">Occupied</div>
          <div className="font-display text-3xl text-op-purple">{rooms.filter(r => r.status === "Occupied").length}</div>
        </div>
        <div className="bg-blue-500/10 rounded-2xl p-4 flex flex-col justify-center border border-blue-500/20">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">Cleaning</div>
          <div className="font-display text-3xl text-blue-800">{rooms.filter(r => r.status === "Cleaning").length}</div>
        </div>
        <div className="bg-rose-500/10 rounded-2xl p-4 flex flex-col justify-center border border-rose-500/20">
          <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">Maintenance</div>
          <div className="font-display text-3xl text-rose-800">{rooms.filter(r => r.status === "Maintenance").length}</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map(room => (
          <div key={room.id} className="bg-card rounded-3xl border border-border shadow-sm overflow-hidden flex flex-col hover-lift">
            <div className="p-5 border-b border-border flex justify-between items-start">
              <div>
                <div className="font-display text-3xl mb-1">{room.number}</div>
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{room.type}</div>
              </div>
              <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full border ${getStatusColor(room.status)}`}>
                {room.status}
              </span>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              {room.status === "Occupied" ? (
                <div className="space-y-4">
                  <div>
                    <div className="text-xs text-muted-foreground mb-1">Guest</div>
                    <div className="font-bold flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-op-purple/20 text-op-purple flex items-center justify-center text-xs">{room.guestName?.charAt(0)}</div>
                      {room.guestName}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <div className="text-xs text-muted-foreground">Check In</div>
                      <div className="font-medium">{room.checkInDate}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Check Out</div>
                      <div className="font-medium">{room.checkOutDate}</div>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-border mt-auto">
                    <div className="flex justify-between items-end mb-4">
                      <div className="text-xs text-muted-foreground">Total Balance <br/>(Incl. Restaurant)</div>
                      <div className="font-display text-xl">${getRoomTotalBalance(room.number, room.balance).toFixed(2)}</div>
                    </div>
                    <button 
                      onClick={() => handleCheckOut(room)}
                      className="w-full bg-foreground text-background py-2.5 rounded-xl text-sm font-bold hover:opacity-90 flex items-center justify-center gap-2 transition"
                    >
                      <LogOut className="h-4 w-4" /> Check Out & Bill
                    </button>
                  </div>
                </div>
              ) : room.status === "Available" ? (
                <div className="flex flex-col h-full justify-between gap-6">
                  <div className="flex flex-col items-center justify-center text-muted-foreground py-6">
                    <BedDouble className="h-8 w-8 mb-2 opacity-20" />
                    <span className="text-sm">Ready for guest</span>
                  </div>
                  <button 
                    onClick={() => { setSelectedRoom(room); setIsBooking(true); }}
                    className="w-full bg-op-purple text-foreground py-2.5 rounded-xl text-sm font-bold hover:opacity-90 flex items-center justify-center gap-2 transition"
                  >
                    <CalendarCheck className="h-4 w-4" /> Walk-in Check In
                  </button>
                </div>
              ) : (
                <div className="flex flex-col h-full justify-between gap-6">
                  <div className="flex flex-col items-center justify-center text-muted-foreground py-6">
                    {room.status === "Cleaning" ? <AlertCircle className="h-8 w-8 mb-2 opacity-20 text-blue-500" /> : <AlertCircle className="h-8 w-8 mb-2 opacity-20 text-rose-500" />}
                    <span className="text-sm text-center">Room requires attention before check-in.</span>
                  </div>
                  <button 
                    onClick={() => handleStatusChange(room, "Available")}
                    className="w-full bg-muted text-foreground py-2.5 rounded-xl text-sm font-bold hover:bg-muted/80 flex items-center justify-center gap-2 transition"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Mark as Available
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {isBooking && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-3xl p-6 w-full max-w-2xl shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-display text-2xl">Check In / Walk-in</h3>
                <p className="text-sm text-muted-foreground">Assigning to Room {selectedRoom.number} ({selectedRoom.type})</p>
              </div>
              <button onClick={() => setIsBooking(false)} className="p-2 hover:bg-muted rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCheckIn} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">Guest Full Name</label>
                  <input required autoFocus className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">Email</label>
                  <input type="email" required className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">Phone</label>
                  <input type="tel" required className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">Check In Date</label>
                  <input type="date" required className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">Check Out Date</label>
                  <input type="date" required className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground ml-1">Total Room Rate ($)</label>
                  <input type="number" required className="bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple text-lg font-bold" value={formData.rate} onChange={e => setFormData({...formData, rate: Number(e.target.value)})} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button type="button" onClick={() => setIsBooking(false)} className="px-6 py-3 rounded-xl font-semibold hover:bg-muted transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-op-purple text-foreground px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition hover:opacity-90 disabled:opacity-50 shadow-lg shadow-op-purple/20">
                  <CreditCard className="h-4 w-4" /> {isSubmitting ? "Processing..." : "Complete Check-In"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
