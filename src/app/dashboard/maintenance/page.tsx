"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, updateDoc } from "firebase/firestore";
import { Wrench, CheckCircle2, Clock, AlertTriangle, Hammer, X } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

export default function MaintenancePage() {
  const { user, activeProperty } = useAuth();
  const [tickets, setTickets] = useState<any[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [postFixStatus, setPostFixStatus] = useState("Available"); // Or "Cleaning"

  useEffect(() => {
    if (!user) return;
    let qTickets = query(collection(db, "maintenance_tickets"), where("ownerId", "==", user.uid));
    if (activeProperty) {
      qTickets = query(collection(db, "maintenance_tickets"), where("ownerId", "==", user.uid), where("propertyId", "==", activeProperty));
    }
    const unsub = onSnapshot(qTickets, (snap) => {
      setTickets(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => b.createdAt - a.createdAt));
    });
    return unsub;
  }, [user, activeProperty]);

  const handleResolveTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedTicket) return;

    try {
      // 1. Close the ticket
      await updateDoc(doc(db, "maintenance_tickets", selectedTicket.id), {
        status: "Resolved",
        resolutionNotes,
        resolvedAt: Date.now()
      });

      // 2. Update the Room status back to Available (or Cleaning)
      if (selectedTicket.roomId) {
        await updateDoc(doc(db, "rooms", selectedTicket.roomId), {
          status: postFixStatus
        });
      }

      setIsResolving(false);
      setSelectedTicket(null);
      setResolutionNotes("");
    } catch (err) {
      console.error(err);
    }
  };

  const openTickets = tickets.filter(t => t.status === "Open");
  const resolvedTickets = tickets.filter(t => t.status === "Resolved");

  return (
    <>
      <PageHeader eyebrow="Facilities" title="Maintenance & Repairs" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-rose-500/10 rounded-2xl p-5 border border-rose-500/20">
          <div className="text-xs font-semibold text-rose-700 uppercase tracking-wider mb-1">Open Tickets</div>
          <div className="font-display text-4xl text-rose-800">{openTickets.length}</div>
        </div>
        <div className="bg-emerald-500/10 rounded-2xl p-5 border border-emerald-500/20">
          <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-1">Resolved (7d)</div>
          <div className="font-display text-4xl text-emerald-800">{resolvedTickets.length}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500" /> Active Issues
          </h2>
          {openTickets.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-12 text-center text-muted-foreground flex flex-col items-center">
              <CheckCircle2 className="h-12 w-12 mb-4 opacity-30 text-emerald-500" />
              <h3 className="font-display text-2xl text-foreground mb-2">All Clear!</h3>
              <p>There are no active maintenance tickets right now.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {openTickets.map(ticket => (
                <div key={ticket.id} className="bg-card border border-rose-500/30 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start relative overflow-hidden group">
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                  
                  <div className="h-16 w-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
                    <Wrench className="h-8 w-8" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="bg-rose-500 text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">High Priority</span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" /> Reported {new Date(ticket.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <h3 className="font-display text-2xl mb-1">Room {ticket.roomNumber}</h3>
                    <p className="text-sm text-foreground/80 mb-4">{ticket.description}</p>
                    <p className="text-xs text-muted-foreground mb-4">Reported by: {ticket.reportedBy}</p>
                    
                    <button 
                      onClick={() => { setSelectedTicket(ticket); setIsResolving(true); }}
                      className="bg-muted text-foreground py-2.5 px-5 rounded-xl text-sm font-bold hover:bg-emerald-500 hover:text-white transition flex items-center gap-2"
                    >
                      <Hammer className="h-4 w-4" /> Resolve Ticket
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" /> Recently Resolved
          </h2>
          <div className="bg-card border border-border rounded-3xl p-5 space-y-4">
            {resolvedTickets.length === 0 ? (
              <p className="text-center text-muted-foreground text-sm py-8">No recently resolved tickets.</p>
            ) : (
              resolvedTickets.slice(0, 5).map(ticket => (
                <div key={ticket.id} className="pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm">Room {ticket.roomNumber}</span>
                    <span className="text-[10px] text-muted-foreground">{new Date(ticket.resolvedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-1">{ticket.description}</p>
                  <p className="text-xs text-emerald-500 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {ticket.resolutionNotes || "Fixed"}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {isResolving && selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-emerald-500 flex items-center gap-2"><Hammer className="h-5 w-5"/> Resolve Issue (Room {selectedTicket.roomNumber})</h3>
              <button onClick={() => setIsResolving(false)} className="p-2 hover:bg-muted rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleResolveTicket} className="space-y-5">
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">What did you fix?</label>
                <textarea 
                  required autoFocus
                  rows={3}
                  className="w-full bg-muted border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-emerald-500 resize-none" 
                  placeholder="e.g. Replaced remote batteries, patched pipe leak..."
                  value={resolutionNotes} 
                  onChange={e => setResolutionNotes(e.target.value)} 
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-2 block">Room Status After Fix</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setPostFixStatus("Available")} className={`py-3 rounded-xl border text-sm font-semibold transition ${postFixStatus === "Available" ? "bg-emerald-500 border-emerald-500 text-white" : "border-border hover:bg-muted text-muted-foreground"}`}>
                    Make Available
                  </button>
                  <button type="button" onClick={() => setPostFixStatus("Cleaning")} className={`py-3 rounded-xl border text-sm font-semibold transition ${postFixStatus === "Cleaning" ? "bg-blue-500 border-blue-500 text-white" : "border-border hover:bg-muted text-muted-foreground"}`}>
                    Send to Housekeeping
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-2 pt-4 border-t border-border">
                <button type="button" onClick={() => setIsResolving(false)} className="px-6 py-3 rounded-xl font-semibold hover:bg-muted transition">Cancel</button>
                <button type="submit" className="bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition hover:bg-emerald-600 flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                  <CheckCircle2 className="h-4 w-4" /> Resolve & Close
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
