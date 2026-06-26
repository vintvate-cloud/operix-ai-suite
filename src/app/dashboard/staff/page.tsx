"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db, firebaseConfig } from "@/lib/firebase";
import { collection, onSnapshot, query, where, doc, setDoc, deleteDoc } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { Plus, User, Building2, Trash2, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/dashboard-shell";

export default function StaffPage() {
  const { user, userData, activeProperty } = useAuth();
  const [staff, setStaff] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "Front Desk", location: "" });

  const roles = ["General Manager", "Front Desk", "Housekeeping", "Maintenance", "Restaurant", "Finance", "HR", "Sales", "Marketing", "Employee"];

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "users"), where("ownerId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setStaff(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);
    setSuccessMsg("");
    
    try {
      // Use Secondary Firebase App to create user so Super Admin is not logged out
      const secondaryApp = initializeApp(firebaseConfig, "SecondaryApp" + Date.now());
      const secondaryAuth = getAuth(secondaryApp);
      
      const userCredential = await createUserWithEmailAndPassword(secondaryAuth, formData.email, formData.password);
      const newUid = userCredential.user.uid;
      
      // Save their profile into the "users" collection with their new UID
      // This allows them to login, and the AuthProvider will fetch this doc to know their role!
      await setDoc(doc(db, "users", newUid), {
        uid: newUid,
        email: formData.email,
        name: formData.name,
        role: formData.role,
        ownerId: user.uid,
        businessName: userData?.businessName || "",
        propertyId: activeProperty || null, // lock them to a property if selected
        createdAt: Date.now(),
        onboardingComplete: true // They don't need to onboard
      });

      setSuccessMsg(`Account created for ${formData.email}! An email would be sent with password: ${formData.password}`);
      setIsAdding(false);
      setFormData({ name: "", email: "", password: "", role: "Front Desk", location: "" });
      
    } catch (err: any) {
      console.error(err);
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this staff member? Their access will be revoked.")) {
      await deleteDoc(doc(db, "users", id));
      // Note: Full auth deletion requires Admin SDK, but deleting their users doc will break their dashboard access.
    }
  };

  return (
    <>
      <PageHeader 
        eyebrow="Workforce" 
        title="Staff & Role Management" 
        action={
          <button onClick={() => setIsAdding(true)} className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2">
            <Plus className="h-4 w-4" /> Add Staff Member
          </button>
        } 
      />

      {successMsg && (
        <div className="bg-op-success/20 text-emerald-800 p-4 rounded-2xl mb-6 flex items-center gap-2 font-bold animate-in fade-in">
          <CheckCircle2 className="h-5 w-5" /> {successMsg}
        </div>
      )}

      {isAdding && (
        <div className="bg-card p-6 rounded-3xl border border-border mb-6 shadow-2xl animate-in slide-in-from-top-4">
          <h3 className="font-semibold mb-4">Create Employee Account</h3>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <input required placeholder="Full Name" className="bg-muted border border-border rounded-xl px-4 py-3 outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input required type="email" placeholder="Login Email" className="bg-muted border border-border rounded-xl px-4 py-3 outline-none" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            <input required type="password" placeholder="Temporary Password" minLength={6} className="bg-muted border border-border rounded-xl px-4 py-3 outline-none" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            <select className="bg-muted border border-border rounded-xl px-4 py-3 outline-none" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})}>
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="sm:col-span-2 md:col-span-4 flex justify-end gap-2 mt-4">
              <button type="button" onClick={() => setIsAdding(false)} className="px-6 py-3 rounded-xl font-semibold hover:bg-muted transition">Cancel</button>
              <button type="submit" disabled={isSubmitting} className="bg-op-purple text-foreground px-8 py-3 rounded-xl font-bold transition hover:opacity-90 disabled:opacity-50">
                {isSubmitting ? "Creating Auth Profile..." : "Create Account"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-muted/50 border-b border-border">
              <tr>
                <th className="p-4 font-semibold text-muted-foreground">Name</th>
                <th className="p-4 font-semibold text-muted-foreground">Role</th>
                <th className="p-4 font-semibold text-muted-foreground">Property Assignment</th>
                <th className="p-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-muted-foreground">No staff added yet. Create accounts for your team!</td></tr>
              ) : (
                staff.map(s => (
                  <tr key={s.id} className="border-b border-border/50 hover:bg-muted/20">
                    <td className="p-4 flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-foreground text-background flex items-center justify-center font-bold text-sm">
                        {s.name ? s.name[0] : <User className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="font-semibold">{s.name || "Unknown"}</div>
                        <div className="text-xs text-muted-foreground">{s.email}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="bg-op-purple/20 text-op-purple border border-op-purple/20 px-3 py-1.5 rounded-full text-xs font-bold">{s.role}</span>
                    </td>
                    <td className="p-4 flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" /> 
                      {s.propertyId ? "Assigned Location" : "All Locations (Global)"}
                    </td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(s.id)} className="text-rose-500 hover:bg-rose-500/10 p-2 rounded-full transition">
                        <Trash2 className="h-5 w-5" />
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
