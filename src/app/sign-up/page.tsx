"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ArrowRight, Mail, Lock, User, Building2, Loader2 } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";



function SignUp() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".auth-el", { opacity: 0, y: 16, duration: 0.7, ease: "power3.out", stagger: 0.05 });
    }, ref);
    return () => ctx.revert();
  }, []);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push("/onboarding");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div ref={ref} className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      <aside className="hidden lg:flex relative bg-op-purple text-foreground p-12 flex-col justify-between overflow-hidden order-2">
        <div className="text-sm font-medium">Free for 14 days</div>
        <div>
          <h2 className="font-display text-7xl leading-[0.92] auth-el">
            Your hotel,<br />finally on<br /><span className="bg-foreground text-background px-3">autopilot</span>
          </h2>
          <ul className="mt-8 space-y-3 text-foreground/80 auth-el">
            {[
              "Unlimited users, every plan",
              "AI copilot included",
              "Import your data in minutes",
              "No credit card required",
            ].map((b) => (
              <li key={b} className="flex items-center gap-3"><span className="h-1.5 w-1.5 rounded-full bg-foreground" />{b}</li>
            ))}
          </ul>
        </div>
        <div className="text-xs text-foreground/60 auth-el">
          “We retired five tools in a month.” — Camille Roux, CEO, Maison Elysée
        </div>
      </aside>

      <div className="flex flex-col p-8 sm:p-12 justify-between">
        <Link href="/" className="font-display text-2xl auth-el">OPERIX</Link>
        <div className="max-w-md mx-auto w-full">
          <h1 className="font-display text-5xl sm:text-6xl auth-el">Create account</h1>
          <p className="mt-3 text-muted-foreground auth-el">14 days free. Cancel anytime.</p>

          <form onSubmit={handleSignUp} className="mt-10 space-y-4 auth-el">
            {error && <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-xl">{error}</div>}
            
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Work email</span>
              <div className="mt-1 flex items-center gap-2 bg-muted rounded-2xl px-4">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input 
                  type="email" 
                  placeholder="you@company.com" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="bg-transparent w-full py-3 outline-none text-sm" 
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Password</span>
              <div className="mt-1 flex items-center gap-2 bg-muted rounded-2xl px-4">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="bg-transparent w-full py-3 outline-none text-sm" 
                  required
                />
              </div>
            </label>

            <label className="flex items-start gap-2 text-xs text-muted-foreground">
              <input type="checkbox" className="mt-0.5" defaultChecked />
              <span>I agree to the <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.</span>
            </label>

            <button disabled={loading} type="submit" className="w-full bg-foreground text-background rounded-full py-3.5 font-semibold inline-flex items-center justify-center gap-2 hover:scale-[1.01] transition disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Start free trial <ArrowRight className="h-4 w-4" /></>}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="bg-muted rounded-2xl py-3 text-sm font-semibold hover:bg-muted/70">Sign up with Google</button>
              <button type="button" className="bg-muted rounded-2xl py-3 text-sm font-semibold hover:bg-muted/70">Single sign-on</button>
            </div>
          </form>

          <p className="mt-8 text-sm text-muted-foreground auth-el">
            Already have an account?{" "}
            <Link href="/sign-in" className="font-semibold text-foreground hover:underline">Sign in</Link>
          </p>
        </div>
        <span className="text-xs text-muted-foreground auth-el">© 2026 OPERIX</span>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  placeholder,
  type = "text",
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="mt-1 flex items-center gap-2 bg-muted rounded-2xl px-4">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <input type={type} placeholder={placeholder} className="bg-transparent w-full py-3 outline-none text-sm" />
      </div>
    </label>
  );
}

export default SignUp;
