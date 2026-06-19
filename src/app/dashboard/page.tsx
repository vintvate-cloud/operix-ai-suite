"use client";

import { useEffect, useState } from "react";
import {
  Bot, Sparkles, TrendingUp, TrendingDown, CheckCircle2, Clock, Bed, Hotel,
  MessageCircle, DollarSign, ArrowUpRight, Plus, X
} from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";

export default function Overview() {
  const { userData } = useAuth();
  
  if (!userData) return <div className="p-8 text-center animate-pulse">Loading dashboard...</div>;

  const role = userData.role || "Super Admin";

  if (role === "Housekeeping") {
    return (
      <div className="text-center p-12 max-w-2xl mx-auto">
        <Bed className="h-16 w-16 mx-auto text-op-purple mb-4" />
        <h2 className="text-3xl font-display mb-2">Housekeeping Dashboard</h2>
        <p className="text-muted-foreground mb-6">Welcome to your daily shift. You can view and complete your assigned room tasks in the Housekeeping module.</p>
        <a href="/dashboard/housekeeping" className="bg-op-purple text-foreground px-6 py-3 rounded-full font-bold">Go to Tasks</a>
      </div>
    );
  }

  if (role === "Front Desk") {
    return (
      <div className="text-center p-12 max-w-2xl mx-auto">
        <Hotel className="h-16 w-16 mx-auto text-op-purple mb-4" />
        <h2 className="text-3xl font-display mb-2">Front Desk Dashboard</h2>
        <p className="text-muted-foreground mb-6">Welcome to your shift. You can manage guest arrivals, check-ins, and reservations.</p>
        <a href="/dashboard/reservations" className="bg-op-purple text-foreground px-6 py-3 rounded-full font-bold">View Reservations</a>
      </div>
    );
  }

  if (role === "Restaurant") {
    return <RestaurantOverview />;
  }

  if (userData.businessType === "restaurant") return <RestaurantOverview />;
  if (userData.businessType === "gym") return <GymOverview />;
  if (userData.businessType === "clinic") return <ClinicOverview />;
  if (userData.businessType === "construction") return <ConstructionOverview />;

  // Default to General Manager / Super Admin
  return <GeneralManagerOverview />;
}

function GeneralManagerOverview() {
  const { user, userData } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Live Metrics State
  const [liveReservations, setLiveReservations] = useState(0);
  const [liveRevenue, setLiveRevenue] = useState(0);

  useEffect(() => {
    if (!user) return;
    
    // Listen to reservations
    const qRes = query(collection(db, "reservations"), where("ownerId", "==", user.uid));
    const unsubRes = onSnapshot(qRes, (snap) => {
      setLiveReservations(snap.docs.length);
    });

    // Listen to orders
    const qOrd = query(collection(db, "orders"), where("ownerId", "==", user.uid));
    const unsubOrd = onSnapshot(qOrd, (snap) => {
      let totalRev = 0;
      snap.forEach(doc => {
        totalRev += doc.data().total || 0;
      });
      setLiveRevenue(totalRev);
    });

    return () => { unsubRes(); unsubOrd(); };
  }, [user]);

  const [formData, setFormData] = useState({
    guestName: "",
    roomType: "Standard Room",
    checkIn: "",
    checkOut: ""
  });

  const handleCreateReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    
    try {
      await addDoc(collection(db, "reservations"), {
        ownerId: user.uid,
        ...formData,
        status: "Confirmed",
        createdAt: Date.now()
      });
      setIsModalOpen(false);
      setFormData({ guestName: "", roomType: "Standard Room", checkIn: "", checkOut: "" });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        title={`Good morning, ${userData?.businessName || "Hotel"} team`}
        action={
          <button onClick={() => setIsModalOpen(true)} className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90">
            <Plus className="h-4 w-4" /> New reservation
          </button>
        }
      />
      <div className="bg-op-purple/10 border border-op-purple/20 text-op-purple rounded-2xl p-4 mb-6 flex items-center gap-3">
        <Sparkles className="h-5 w-5" />
        <div>
          <div className="font-semibold">Welcome to your new Operix Workspace!</div>
          <div className="text-sm opacity-80">This is a live dashboard. As you add reservations, staff, and revenue data, these widgets will populate automatically.</div>
        </div>
      </div>
      <KPIs reservations={liveReservations} revenue={liveRevenue} />
      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <RevenueChart />
        <Copilot />
      </div>
      <div className="mt-6 text-center text-muted-foreground p-8 bg-card rounded-3xl border border-border">
        No active properties or arrivals today.
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl">Create Reservation</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-muted rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateReservation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Guest Name</label>
                <input required autoFocus placeholder="e.g. John Doe" value={formData.guestName} onChange={e => setFormData({...formData, guestName: e.target.value})} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Room Type</label>
                <select value={formData.roomType} onChange={e => setFormData({...formData, roomType: e.target.value})} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple">
                  <option>Standard Room</option>
                  <option>Deluxe Suite</option>
                  <option>Ocean View Villa</option>
                  <option>Presidential Suite</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Check-in</label>
                  <input required type="date" value={formData.checkIn} onChange={e => setFormData({...formData, checkIn: e.target.value})} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Check-out</label>
                  <input required type="date" value={formData.checkOut} onChange={e => setFormData({...formData, checkOut: e.target.value})} className="w-full bg-muted border border-border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-op-purple" />
                </div>
              </div>
              <button disabled={isSubmitting} type="submit" className="w-full mt-4 bg-op-purple text-foreground py-3 rounded-xl font-bold hover:opacity-90 transition disabled:opacity-50">
                {isSubmitting ? "Saving..." : "Confirm Reservation"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

function RestaurantOverview() {
  const { userData } = useAuth();
  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        title={`${userData?.businessName || "Restaurant"} POS & Dashboard`}
        action={
          <button className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Order
          </button>
        }
      />
      <div className="bg-op-peach/20 border border-op-peach/40 text-orange-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <Sparkles className="h-5 w-5" />
        <div>
          <div className="font-semibold">Your POS is ready!</div>
          <div className="text-sm opacity-80">Start adding menu items and tables to see live active orders here.</div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[{l: "Active Tables", v: "0/0"}, {l: "Open Tickets", v: "0"}, {l: "Waitlist", v: "0 parties"}, {l: "Today Rev", v: "$0"}].map(k => (
          <div key={k.l} className="bg-muted rounded-3xl p-5 hover-lift">
            <div className="text-sm font-medium opacity-80">{k.l}</div>
            <div className="mt-6 font-display text-4xl">{k.v}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function GymOverview() {
  const { userData } = useAuth();
  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        title={`${userData?.businessName || "Gym"} Management`}
        action={
          <button className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Member
          </button>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[{l: "Active Members", v: "0"}, {l: "Check-ins Today", v: "0"}, {l: "Classes Today", v: "0"}, {l: "MRR", v: "$0"}].map(k => (
          <div key={k.l} className="bg-muted rounded-3xl p-5 hover-lift">
            <div className="text-sm font-medium opacity-80">{k.l}</div>
            <div className="mt-6 font-display text-4xl">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-3xl p-6 border border-border text-center text-muted-foreground py-12">
        <Bot className="h-8 w-8 mx-auto mb-4 opacity-50" />
        <p>No members added yet. Start growing your fitness community!</p>
      </div>
    </>
  );
}

function ClinicOverview() {
  const { userData } = useAuth();
  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        title={`${userData?.businessName || "Clinic"} Dashboard`}
        action={
          <button className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Appointment
          </button>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[{l: "Patients Today", v: "0"}, {l: "Wait Room", v: "0"}, {l: "Available Staff", v: "0"}, {l: "Revenue", v: "$0"}].map(k => (
          <div key={k.l} className="bg-muted rounded-3xl p-5 hover-lift">
            <div className="text-sm font-medium opacity-80">{k.l}</div>
            <div className="mt-6 font-display text-4xl">{k.v}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function ConstructionOverview() {
  const { userData } = useAuth();
  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
        title={`${userData?.businessName || "Construction"} Projects`}
        action={
          <button className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> New Project
          </button>
        }
      />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[{l: "Active Sites", v: "0"}, {l: "Workers Deployed", v: "0"}, {l: "Equipment Out", v: "0"}, {l: "Pending Invoices", v: "0"}].map(k => (
          <div key={k.l} className="bg-muted rounded-3xl p-5 hover-lift">
            <div className="text-sm font-medium opacity-80">{k.l}</div>
            <div className="mt-6 font-display text-4xl">{k.v}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function KPIs({ reservations = 0, revenue = 0 }: { reservations?: number, revenue?: number }) {
  const kpis = [
    { label: "Occupancy", value: reservations > 0 ? "100%" : "0%", delta: "-", up: true, sub: "Based on active bookings", bg: "bg-op-purple" },
    { label: "Revenue", value: `$${revenue.toFixed(2)}`, delta: "-", up: true, sub: "Total POS Revenue", bg: "bg-op-pink" },
    { label: "Reservations", value: reservations.toString(), delta: "-", up: true, sub: "Total bookings", bg: "bg-op-peach" },
    { label: "Arrivals", value: reservations.toString(), delta: "-", up: false, sub: "Expected", bg: "bg-op-beige" },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((k) => (
        <div key={k.label} className={`${k.bg} rounded-3xl p-5 hover-lift ${reservations === 0 && revenue === 0 ? "opacity-70" : "opacity-100"}`}>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium opacity-80">{k.label}</span>
          </div>
          <div className="mt-6 font-display text-5xl">{k.value}</div>
          <div className="mt-2 text-xs opacity-70">{k.sub}</div>
        </div>
      ))}
    </div>
  );
}

function RevenueChart() {
  return (
    <div className="lg:col-span-2 bg-card rounded-3xl p-6 sm:p-8 border border-border flex items-center justify-center text-muted-foreground min-h-[300px]">
      <div>
        <TrendingUp className="h-8 w-8 mx-auto mb-4 opacity-50" />
        <p>No revenue data to display yet.</p>
      </div>
    </div>
  );
}

function Copilot() {
  return (
    <div className="bg-op-purple rounded-3xl p-6 sm:p-8">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Bot className="h-4 w-4" /> AI Copilot
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs">
          <span className="h-2 w-2 rounded-full bg-op-success animate-pulse-dot" /> Live
        </span>
      </div>
      <h3 className="mt-6 font-display text-3xl">Waiting for data...</h3>
      <p className="mt-4 text-sm bg-white/20 p-4 rounded-xl">
        I need more operational data before I can start making intelligent suggestions. Check back later!
      </p>
    </div>
  );
}
