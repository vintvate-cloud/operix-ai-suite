"use client";

import { useEffect, useState } from "react";
import {
  Bot, Sparkles, TrendingUp, TrendingDown, CheckCircle2, Clock, Bed, Hotel,
  MessageCircle, DollarSign, ArrowUpRight, Plus, X, Users, Activity,
  Briefcase, BarChart3, Receipt, Wallet, UserPlus, Target, Megaphone
} from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, addDoc, onSnapshot, query, where } from "firebase/firestore";

export default function Overview() {
  const { userData } = useAuth();
  
  if (!userData) return <div className="p-8 text-center animate-pulse">Loading dashboard...</div>;

  const role = userData.role || "Owner";

  // Platform Level
  if (role === "Super Admin") return <SuperAdminOverview />;

  // Executive Level
  if (role === "Owner") return <OwnerOverview />;
  if (role === "General Manager") return <GeneralManagerOverview />;

  // Department Managers
  if (role === "Finance" || role === "Finance Manager") return <FinanceOverview />;
  if (role === "HR" || role === "HR Manager") return <HROverview />;
  if (role === "Sales" || role === "Sales Manager") return <SalesOverview />;
  if (role === "Marketing" || role === "Marketing Manager") return <MarketingOverview />;

  // Operational Level
  if (role === "Housekeeping") return <HousekeepingOverview />;
  if (role === "Front Desk") return <FrontDeskOverview />;
  if (role === "Restaurant") return <RestaurantOverview />;

  // Default Employee fallback
  return <EmployeeOverview />;
}

// -------------------------------------------------------------------------------------------------
// PLATFORM SUPER ADMIN DASHBOARD
// -------------------------------------------------------------------------------------------------
function SuperAdminOverview() {
  return (
    <>
      <PageHeader eyebrow="Platform Management" title="Super Admin Console" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Total Organizations", v: "142", sub: "+12 this month", icon: Building2 },
          { l: "MRR", v: "₹42,500", sub: "+5.2% growth", icon: DollarSign },
          { l: "Active Users", v: "3,892", sub: "99.9% uptime", icon: Activity },
          { l: "Churn Rate", v: "1.2%", sub: "-0.4% from last month", icon: TrendingDown },
        ].map(k => (
          <div key={k.l} className="bg-muted rounded-3xl p-5 hover-lift">
            <div className="flex items-center gap-2 text-sm font-medium opacity-80 mb-4">
              <k.icon className="h-4 w-4" /> {k.l}
            </div>
            <div className="font-display text-4xl">{k.v}</div>
            <div className="mt-2 text-xs opacity-70">{k.sub}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-3xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><Sparkles className="h-4 w-4 text-op-purple" /> Platform Health</h3>
          <p className="text-sm text-muted-foreground">All systems operational. Redis cache hit rate: 94%. Database CPU: 12%.</p>
        </div>
        <div className="bg-card border border-border rounded-3xl p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><ArrowUpRight className="h-4 w-4 text-op-success" /> Recent Signups</h3>
          <p className="text-sm text-muted-foreground">Oasis Resorts (Premium Plan) just onboarded 12 mins ago.</p>
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------------------------------------------
// ORGANIZATION OWNER DASHBOARD
// -------------------------------------------------------------------------------------------------
function OwnerOverview() {
  const { userData } = useAuth();
  return (
    <>
      <PageHeader eyebrow="Executive Summary" title={`Welcome, ${userData?.name || "Owner"}`} />
      <div className="bg-op-purple/10 border border-op-purple/20 text-op-purple rounded-2xl p-4 mb-6 flex items-center gap-3">
        <Sparkles className="h-5 w-5" />
        <div>
          <div className="font-semibold">AI Insight: Revenue is up 14% compared to last Tuesday.</div>
          <div className="text-sm opacity-80">This is largely driven by increased footfall in your central branch.</div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Total Revenue", v: "₹12,450", bg: "bg-op-purple text-foreground" },
          { l: "Net Profit", v: "₹3,800", bg: "bg-op-success text-emerald-950" },
          { l: "Total Expenses", v: "₹8,650", bg: "bg-op-peach text-orange-950" },
          { l: "Active Employees", v: "24", bg: "bg-muted" },
        ].map(k => (
          <div key={k.l} className={`${k.bg} rounded-3xl p-5 hover-lift shadow-sm`}>
            <div className="text-sm font-medium opacity-80 mb-2">{k.l}</div>
            <div className="font-display text-4xl">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-3xl p-6 border border-border h-64 flex items-center justify-center">
          <div className="text-center text-muted-foreground"><BarChart3 className="h-8 w-8 mx-auto mb-2 opacity-50"/> Revenue vs Expenses Trend</div>
        </div>
        <div className="bg-card rounded-3xl p-6 border border-border">
          <h3 className="font-semibold mb-4">Pending Approvals</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between items-center p-3 bg-muted rounded-xl">Purchase Order #102 <button className="text-op-purple font-bold">Review</button></li>
            <li className="flex justify-between items-center p-3 bg-muted rounded-xl">Payroll Run (July) <button className="text-op-purple font-bold">Review</button></li>
          </ul>
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------------------------------------------
// FINANCE MANAGER DASHBOARD
// -------------------------------------------------------------------------------------------------
function FinanceOverview() {
  return (
    <>
      <PageHeader eyebrow="Finance Department" title="Financial Dashboard" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Cash Flow", v: "+₹4,200", icon: Wallet },
          { l: "Accounts Receivable", v: "₹12,500", icon: ArrowUpRight },
          { l: "Accounts Payable", v: "₹8,300", icon: TrendingDown },
          { l: "Profit Margin", v: "28.4%", icon: DollarSign },
        ].map(k => (
          <div key={k.l} className="bg-muted rounded-3xl p-5 hover-lift">
            <div className="flex items-center gap-2 text-sm font-medium opacity-80 mb-4"><k.icon className="h-4 w-4" /> {k.l}</div>
            <div className="font-display text-4xl">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-3xl p-6 border border-border">
        <h3 className="font-semibold mb-4">Recent Transactions</h3>
        <div className="text-muted-foreground text-sm text-center py-8">Waiting for ledger entries...</div>
      </div>
    </>
  );
}

// -------------------------------------------------------------------------------------------------
// HR MANAGER DASHBOARD
// -------------------------------------------------------------------------------------------------
function HROverview() {
  return (
    <>
      <PageHeader eyebrow="Human Resources" title="Workforce Overview" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Headcount", v: "42", icon: Users },
          { l: "On Leave Today", v: "3", icon: Clock },
          { l: "Open Roles", v: "2", icon: Briefcase },
          { l: "Payroll Estimate", v: "₹48k", icon: Receipt },
        ].map(k => (
          <div key={k.l} className="bg-muted rounded-3xl p-5 hover-lift">
            <div className="flex items-center gap-2 text-sm font-medium opacity-80 mb-4"><k.icon className="h-4 w-4" /> {k.l}</div>
            <div className="font-display text-4xl">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="bg-op-purple/10 border border-op-purple/20 text-op-purple rounded-2xl p-6">
        <div className="flex items-center gap-2 font-bold mb-2"><Sparkles className="h-5 w-5" /> Attrition Prediction</div>
        <p className="text-sm">Based on recent overtime data, 2 employees in operations are at high risk of burnout. Suggest scheduling 1-on-1s.</p>
      </div>
    </>
  );
}

// -------------------------------------------------------------------------------------------------
// SALES MANAGER DASHBOARD
// -------------------------------------------------------------------------------------------------
function SalesOverview() {
  return (
    <>
      <PageHeader eyebrow="Sales Department" title="Sales & Pipeline" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Open Leads", v: "124", icon: UserPlus },
          { l: "Pipeline Value", v: "₹84k", icon: DollarSign },
          { l: "Win Rate", v: "32%", icon: Target },
          { l: "Revenue Won", v: "₹24k", icon: CheckCircle2 },
        ].map(k => (
          <div key={k.l} className="bg-muted rounded-3xl p-5 hover-lift">
            <div className="flex items-center gap-2 text-sm font-medium opacity-80 mb-4"><k.icon className="h-4 w-4" /> {k.l}</div>
            <div className="font-display text-4xl">{k.v}</div>
          </div>
        ))}
      </div>
      <div className="bg-card rounded-3xl p-6 border border-border text-center py-16">
        <Target className="h-12 w-12 mx-auto text-muted-foreground opacity-30 mb-4" />
        <h3 className="font-semibold text-lg">Your Pipeline is Empty</h3>
        <p className="text-sm text-muted-foreground mb-6">Start adding opportunities or connect your lead forms to see them flow here.</p>
        <button className="bg-op-purple text-foreground px-6 py-2 rounded-full font-bold">Add Lead</button>
      </div>
    </>
  );
}

// -------------------------------------------------------------------------------------------------
// MARKETING MANAGER DASHBOARD
// -------------------------------------------------------------------------------------------------
function MarketingOverview() {
  return (
    <>
      <PageHeader eyebrow="Marketing" title="Campaigns & Traffic" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { l: "Web Visitors", v: "4.2k", icon: Activity },
          { l: "New Leads", v: "84", icon: UserPlus },
          { l: "Conversion Rate", v: "2.1%", icon: TrendingUp },
          { l: "Ad Spend", v: "₹1.2k", icon: Megaphone },
        ].map(k => (
          <div key={k.l} className="bg-muted rounded-3xl p-5 hover-lift">
            <div className="flex items-center gap-2 text-sm font-medium opacity-80 mb-4"><k.icon className="h-4 w-4" /> {k.l}</div>
            <div className="font-display text-4xl">{k.v}</div>
          </div>
        ))}
      </div>
    </>
  );
}

// -------------------------------------------------------------------------------------------------
// EMPLOYEE DASHBOARD
// -------------------------------------------------------------------------------------------------
function EmployeeOverview() {
  const { userData } = useAuth();
  return (
    <>
      <PageHeader eyebrow={new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} title={`Hello, ${userData?.name || "Team Member"}`} />
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card rounded-3xl p-6 border border-border">
          <h3 className="font-semibold mb-4">My Tasks for Today</h3>
          <div className="text-center text-muted-foreground py-12">
            <CheckCircle2 className="h-10 w-10 mx-auto opacity-30 mb-3" />
            <p>You have no pending tasks. Great job!</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-op-purple/10 text-op-purple rounded-3xl p-6 border border-op-purple/20 text-center">
            <h3 className="font-semibold mb-2">Current Shift</h3>
            <div className="font-display text-3xl mb-4">09:00 - 17:00</div>
            <button className="w-full bg-op-purple text-foreground py-3 rounded-full font-bold">Clock In</button>
          </div>
          <div className="bg-card rounded-3xl p-6 border border-border">
            <h3 className="font-semibold mb-4">Team Announcements</h3>
            <p className="text-sm text-muted-foreground">No new announcements from management.</p>
          </div>
        </div>
      </div>
    </>
  );
}

// -------------------------------------------------------------------------------------------------
// GENERAL MANAGER & INDUSTRY SPECIFIC (Pre-existing)
// -------------------------------------------------------------------------------------------------
function GeneralManagerOverview() {
  const { user, userData } = useAuth();
  const [totalRooms, setTotalRooms] = useState(0);
  const [occupiedRooms, setOccupiedRooms] = useState(0);
  const [liveRevenue, setLiveRevenue] = useState(0);

  useEffect(() => {
    if (!user) return;
    const qRooms = query(collection(db, "rooms"), where("ownerId", "==", user.uid));
    const unsubRooms = onSnapshot(qRooms, (snap) => {
      setTotalRooms(snap.docs.length);
      const occupied = snap.docs.filter(d => d.data().status === "Occupied").length;
      setOccupiedRooms(occupied);
    });

    const qOrd = query(collection(db, "orders"), where("ownerId", "==", user.uid));
    const unsubOrd = onSnapshot(qOrd, (snap) => {
      let totalRev = 0;
      snap.forEach(doc => { totalRev += doc.data().total || 0; });
      setLiveRevenue(totalRev);
    });

    return () => { unsubRooms(); unsubOrd(); };
  }, [user]);

  const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  return (
    <>
      <PageHeader eyebrow="Operations" title={`Good morning, GM`} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-op-purple rounded-3xl p-5 text-foreground hover-lift shadow-sm">
          <div className="text-sm font-medium opacity-80 mb-2">Occupancy</div>
          <div className="font-display text-4xl">{occupancyRate}%</div>
        </div>
        <div className="bg-op-pink rounded-3xl p-5 text-foreground hover-lift shadow-sm">
          <div className="text-sm font-medium opacity-80 mb-2">Daily Revenue</div>
          <div className="font-display text-4xl">₹{liveRevenue.toFixed(2)}</div>
        </div>
        <div className="bg-op-peach rounded-3xl p-5 text-foreground hover-lift shadow-sm">
          <div className="text-sm font-medium opacity-80 mb-2">Active Guests</div>
          <div className="font-display text-4xl">{occupiedRooms}</div>
        </div>
        <div className="bg-muted rounded-3xl p-5 hover-lift shadow-sm">
          <div className="text-sm font-medium opacity-80 mb-2">Open Tasks</div>
          <div className="font-display text-4xl">0</div>
        </div>
      </div>
      <div className="bg-card rounded-3xl p-6 border border-border text-center text-muted-foreground py-16">
        Waiting for more operational data to populate trends.
      </div>
    </>
  );
}

function HousekeepingOverview() {
  return (
    <div className="text-center p-12 max-w-2xl mx-auto">
      <Bed className="h-16 w-16 mx-auto text-op-purple mb-4" />
      <h2 className="text-3xl font-display mb-2">Housekeeping Dashboard</h2>
      <p className="text-muted-foreground mb-6">Welcome to your daily shift. You can view and complete your assigned room tasks in the Housekeeping module.</p>
      <a href="/dashboard/housekeeping" className="bg-op-purple text-foreground px-6 py-3 rounded-full font-bold">Go to Tasks</a>
    </div>
  );
}

function FrontDeskOverview() {
  return (
    <div className="text-center p-12 max-w-2xl mx-auto">
      <Hotel className="h-16 w-16 mx-auto text-op-purple mb-4" />
      <h2 className="text-3xl font-display mb-2">Front Desk Dashboard</h2>
      <p className="text-muted-foreground mb-6">Welcome to your shift. You can manage guest arrivals, check-ins, and reservations.</p>
      <a href="/dashboard/reservations" className="bg-op-purple text-foreground px-6 py-3 rounded-full font-bold">View Reservations</a>
    </div>
  );
}

function RestaurantOverview() {
  return (
    <>
      <PageHeader eyebrow="Restaurant Operations" title="POS Dashboard" />
      <div className="bg-op-peach/20 border border-op-peach/40 text-orange-800 rounded-2xl p-4 mb-6 flex items-center gap-3">
        <Sparkles className="h-5 w-5" />
        <div>
          <div className="font-semibold">Your POS is ready!</div>
          <div className="text-sm opacity-80">Navigate to the POS module to punch in orders.</div>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[{l: "Active Tables", v: "0"}, {l: "Open Tickets", v: "0"}, {l: "Waitlist", v: "0 parties"}, {l: "Today Rev", v: "₹0"}].map(k => (
          <div key={k.l} className="bg-muted rounded-3xl p-5 hover-lift">
            <div className="text-sm font-medium opacity-80">{k.l}</div>
            <div className="mt-6 font-display text-4xl">{k.v}</div>
          </div>
        ))}
      </div>
    </>
  );
}

function Building2(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>;
}
