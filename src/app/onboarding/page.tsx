"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Building2, UtensilsCrossed, Dumbbell, Stethoscope, HardHat, Check, ArrowRight, Sparkles } from "lucide-react";



const BUSINESS_TYPES = [
  { id: "hotel", label: "Hotel / Lodging", icon: Building2 },
  { id: "restaurant", label: "Restaurant / Cafe", icon: UtensilsCrossed },
  { id: "gym", label: "Gym / Fitness", icon: Dumbbell },
  { id: "clinic", label: "Clinic / Spa", icon: Stethoscope },
  { id: "construction", label: "Construction", icon: HardHat },
];

const MODULES = [
  { id: "crm", label: "CRM & Sales", desc: "Manage leads and customers" },
  { id: "pos", label: "Point of Sale", desc: "Process payments and orders" },
  { id: "booking", label: "Booking Engine", desc: "Online reservations" },
  { id: "inventory", label: "Inventory", desc: "Stock management" },
  { id: "hr", label: "Staff & HR", desc: "Attendance and payroll" },
  { id: "website", label: "Website Builder", desc: "Custom business site" },
];

function OnboardingPage() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [data, setData] = useState({
    businessType: "",
    businessName: "",
    modules: [] as string[],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // We only enforce auth check if user is loaded.
    // In a real app we might wait for `loading` from useAuth.
    if (!user && userData === null) {
      // For simplicity in UI logic:
    }
  }, [user, userData]);

  const handleComplete = async () => {
    if (!user) return;
    setLoading(true);
    // Simulate premium loader
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      ...data,
      createdAt: Date.now(),
      onboardingComplete: true,
    });
    
    router.push("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="absolute inset-0 bg-op-purple blur-[50px] opacity-20 rounded-full animate-pulse" />
          <Sparkles className="h-16 w-16 text-op-purple animate-bounce" />
        </div>
        <h2 className="mt-8 text-3xl font-display text-center animate-pulse">Setting up your Operix workspace...</h2>
        <p className="mt-4 text-muted-foreground text-center max-w-sm">
          We are tailoring the AI models and installing the {data.businessType} modules for {data.businessName}.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <div className="font-display text-2xl tracking-tight">OPERIX</div>
        <div className="text-sm font-semibold text-muted-foreground">Step {step} of 3</div>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl animate-in slide-in-from-bottom-8 fade-in duration-500">
          
          {step === 1 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-display">What type of business are you running?</h1>
                <p className="mt-4 text-muted-foreground">We'll customize your dashboard based on your industry.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {BUSINESS_TYPES.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setData(d => ({ ...d, businessType: b.id }))}
                    className={`p-6 rounded-2xl border-2 flex flex-col gap-4 text-left transition-all ${
                      data.businessType === b.id 
                        ? "border-op-purple bg-op-purple/10" 
                        : "border-border bg-muted/30 hover:border-white/20"
                    }`}
                  >
                    <b.icon className={`h-8 w-8 ${data.businessType === b.id ? "text-op-purple" : "text-muted-foreground"}`} />
                    <span className="font-semibold text-lg">{b.label}</span>
                  </button>
                ))}
              </div>
              <button
                disabled={!data.businessType}
                onClick={() => setStep(2)}
                className="w-full bg-foreground text-background py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-display">What's the name of your business?</h1>
                <p className="mt-4 text-muted-foreground">This will be displayed on your invoices and customer-facing site.</p>
              </div>
              <div>
                <input
                  autoFocus
                  type="text"
                  value={data.businessName}
                  onChange={e => setData(d => ({ ...d, businessName: e.target.value }))}
                  placeholder="e.g. The Grand Hotel"
                  className="w-full bg-muted/50 border border-border rounded-2xl px-6 py-5 text-xl outline-none focus:ring-2 focus:ring-op-purple transition"
                />
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="px-8 py-4 rounded-xl font-semibold bg-muted hover:bg-muted/80 transition"
                >
                  Back
                </button>
                <button
                  disabled={!data.businessName.trim()}
                  onClick={() => setStep(3)}
                  className="flex-1 bg-foreground text-background py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-8">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-display">Select your initial stack</h1>
                <p className="mt-4 text-muted-foreground">Choose the modules you need right now. You can add more later.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {MODULES.map(m => {
                  const selected = data.modules.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => {
                        setData(d => ({
                          ...d,
                          modules: selected ? d.modules.filter(x => x !== m.id) : [...d.modules, m.id]
                        }))
                      }}
                      className={`p-5 rounded-2xl border-2 flex items-start gap-4 text-left transition-all ${
                        selected ? "border-op-purple bg-op-purple/10" : "border-border bg-muted/30 hover:border-white/20"
                      }`}
                    >
                      <div className={`mt-1 h-5 w-5 rounded-md flex items-center justify-center shrink-0 border ${selected ? "bg-op-purple border-op-purple" : "border-muted-foreground"}`}>
                        {selected && <Check className="h-3 w-3 text-white" />}
                      </div>
                      <div>
                        <div className="font-semibold">{m.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{m.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-4 rounded-xl font-semibold bg-muted hover:bg-muted/80 transition"
                >
                  Back
                </button>
                <button
                  disabled={data.modules.length === 0}
                  onClick={handleComplete}
                  className="flex-1 bg-op-purple text-foreground py-4 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:bg-op-purple/90 shadow-[0_0_30px_-5px_rgba(126,34,206,0.5)]"
                >
                  Build My Workspace <Sparkles className="h-5 w-5" />
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default OnboardingPage;
