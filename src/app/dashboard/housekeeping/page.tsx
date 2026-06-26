"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, updateDoc, addDoc } from "firebase/firestore";
import { CheckCircle2, AlertCircle, Clock, BedDouble, Wrench, RefreshCw, X } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

export default function HousekeepingPage() {
  const { user, activeProperty } = useAuth();
  const [rooms, setRooms] = useState<any[]>([]);
  const [isReportingIssue, setIsReportingIssue] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [issueDesc, setIssueDesc] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) return;
    let qRooms = query(collection(db, "rooms"), where("ownerId", "==", user.uid));
    if (activeProperty) {
      qRooms = query(collection(db, "rooms"), where("ownerId", "==", user.uid), where("propertyId", "==", activeProperty));
    }
    const unsub = onSnapshot(qRooms, (snap) => {
      // Housekeeping only cares about Cleaning, Occupied (for daily turndown), and Maintenance
      const allRooms = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const relevantRooms = allRooms.filter(r => r.status === "Cleaning" || r.status === "Occupied");
      setRooms(relevantRooms.sort((a, b) => a.number.localeCompare(b.number)));
    });
    return unsub;
  }, [user, activeProperty]);

  const handleMarkClean = async (roomId: string) => {
    if (!user) return;
    // Set room back to Available so Front Desk can book it
    await updateDoc(doc(db, "rooms", roomId), {
      status: "Available",
      lastCleaned: Date.now()
    });
  };

  const handleReportIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !selectedRoom) return;
    setIsSubmitting(true);
    
    try {
      // 1. Change Room Status to Maintenance
      await updateDoc(doc(db, "rooms", selectedRoom.id), {
        status: "Maintenance"
      });
      
      // 2. Create a Maintenance Ticket
      await addDoc(collection(db, "maintenance_tickets"), {
        ownerId: user.uid,
        propertyId: activeProperty || null,
        roomId: selectedRoom.id,
        roomNumber: selectedRoom.number,
        description: issueDesc,
        status: "Open",
        priority: "High",
        reportedBy: "Housekeeping",
        createdAt: Date.now()
      });

      setIsReportingIssue(false);
      setIssueDesc("");
      setSelectedRoom(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleaningRooms = rooms.filter(r => r.status === "Cleaning");
  const occupiedRooms = rooms.filter(r => r.status === "Occupied");

  return (
    <>
      <PageHeader eyebrow="Operations" title="Housekeeping" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500/10 rounded-2xl p-5 border border-blue-500/20">
          <div className="text-xs font-semibold text-blue-700 uppercase tracking-wider mb-1">To Clean (Check-outs)</div>
          <div className="font-display text-4xl text-blue-800">{cleaningRooms.length}</div>
        </div>
        <div className="bg-op-purple/10 rounded-2xl p-5 border border-op-purple/20">
          <div className="text-xs font-semibold text-op-purple uppercase tracking-wider mb-1">Daily Turndown</div>
          <div className="font-display text-4xl text-op-purple">{occupiedRooms.length}</div>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <RefreshCw className="h-5 w-5 text-blue-500" /> Action Required: Check-out Cleaning
          </h2>
          {cleaningRooms.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
              <CheckCircle2 className="h-10 w-10 mb-3 opacity-30 text-emerald-500" />
              <p>No rooms waiting for deep cleaning right now.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {cleaningRooms.map(room => (
                <div key={room.id} className="bg-card border border-border rounded-2xl p-5 hover-lift flex flex-col relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-display text-3xl leading-none">{room.number}</div>
                      <div className="text-xs text-muted-foreground uppercase mt-1">{room.type}</div>
                    </div>
                    <div className="bg-blue-500/20 text-blue-600 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      Priority
                    </div>
                  </div>
                  
                  <div className="space-y-2 mt-auto">
                    <button 
                      onClick={() => handleMarkClean(room.id)}
                      className="w-full bg-emerald-500 text-white py-3 rounded-xl text-sm font-bold hover:bg-emerald-600 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                    >
                      <CheckCircle2 className="h-4 w-4" /> Mark as Clean
                    </button>
                    <button 
                      onClick={() => { setSelectedRoom(room); setIsReportingIssue(true); }}
                      className="w-full bg-muted text-foreground py-2 rounded-xl text-xs font-bold hover:bg-rose-500 hover:text-white transition flex items-center justify-center gap-2"
                    >
                      <Wrench className="h-3 w-3" /> Report Maintenance Issue
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <BedDouble className="h-5 w-5 text-op-purple" /> Daily Turndown (Occupied Rooms)
          </h2>
          {occupiedRooms.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-8 text-center text-muted-foreground">
              No occupied rooms require daily service.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {occupiedRooms.map(room => (
                <div key={room.id} className="bg-card border border-border rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-display text-2xl">{room.number}</div>
                    <div className="text-xs text-muted-foreground">Guest: {room.guestName?.split(' ')[0]}</div>
                  </div>
                  <button className="bg-muted text-foreground p-3 rounded-full hover:bg-op-purple hover:text-white transition" title="Mark Daily Service Complete">
                    <CheckCircle2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {isReportingIssue && selectedRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl text-rose-500 flex items-center gap-2"><AlertCircle className="h-5 w-5"/> Report Issue (Room {selectedRoom.number})</h3>
              <button onClick={() => setIsReportingIssue(false)} className="p-2 hover:bg-muted rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleReportIssue} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-1 block">What is broken or missing?</label>
                <textarea 
                  required autoFocus
                  rows={4}
                  className="w-full bg-muted border border-border rounded-xl p-4 outline-none focus:ring-2 focus:ring-rose-500 resize-none" 
                  placeholder="e.g. Air conditioning is leaking, TV remote missing..."
                  value={issueDesc} 
                  onChange={e => setIssueDesc(e.target.value)} 
                />
              </div>
              
              <div className="bg-rose-500/10 text-rose-600 p-3 rounded-xl text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                This will instantly lock the room as 'Maintenance' and notify the technicians. The Front Desk will not be able to book this room.
              </div>

              <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
                <button type="button" onClick={() => setIsReportingIssue(false)} className="px-6 py-3 rounded-xl font-semibold hover:bg-muted transition">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="bg-rose-500 text-white px-8 py-3 rounded-xl font-bold transition hover:bg-rose-600 disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-rose-500/20">
                  <Wrench className="h-4 w-4" /> {isSubmitting ? "Submitting..." : "Submit Ticket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
