import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowRight, Mail, Lock } from "lucide-react";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in — OPERIX" },
      { name: "description", content: "Sign in to your OPERIX account." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".auth-el", { opacity: 0, y: 16, duration: 0.7, ease: "power3.out", stagger: 0.06 });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className="min-h-screen grid lg:grid-cols-2 bg-background text-foreground">
      <div className="flex flex-col p-8 sm:p-12 justify-between">
        <Link to="/" className="font-display text-2xl auth-el">OPERIX</Link>
        <div className="max-w-md mx-auto w-full">
          <h1 className="font-display text-5xl sm:text-6xl auth-el">Welcome back</h1>
          <p className="mt-3 text-muted-foreground auth-el">
            Sign in to run your hotel from one platform.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-10 space-y-4 auth-el"
          >
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Email</span>
              <div className="mt-1 flex items-center gap-2 bg-muted rounded-2xl px-4">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <input type="email" placeholder="you@hotel.com" className="bg-transparent w-full py-3 outline-none text-sm" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs font-medium text-muted-foreground">Password</span>
              <div className="mt-1 flex items-center gap-2 bg-muted rounded-2xl px-4">
                <Lock className="h-4 w-4 text-muted-foreground" />
                <input type="password" placeholder="••••••••" className="bg-transparent w-full py-3 outline-none text-sm" />
              </div>
            </label>

            <div className="flex items-center justify-between text-xs">
              <label className="inline-flex items-center gap-2">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <a href="#" className="font-semibold hover:underline">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-foreground text-background rounded-full py-3.5 font-semibold inline-flex items-center justify-center gap-2 hover:scale-[1.01] transition"
            >
              Sign in <ArrowRight className="h-4 w-4" />
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
              <div className="relative flex justify-center text-xs"><span className="bg-background px-2 text-muted-foreground">or continue with</span></div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button type="button" className="bg-muted rounded-2xl py-3 text-sm font-semibold hover:bg-muted/70">Google</button>
              <button type="button" className="bg-muted rounded-2xl py-3 text-sm font-semibold hover:bg-muted/70">SSO</button>
            </div>
          </form>

          <p className="mt-8 text-sm text-muted-foreground auth-el">
            New to OPERIX?{" "}
            <Link to="/sign-up" className="font-semibold text-foreground hover:underline">Create an account</Link>
          </p>
        </div>
        <span className="text-xs text-muted-foreground auth-el">© 2026 OPERIX</span>
      </div>

      <aside className="hidden lg:flex relative bg-foreground text-background p-12 flex-col justify-between overflow-hidden">
        <div className="text-sm text-background/60">The AI Operating System for Hospitality</div>
        <div>
          <h2 className="font-display text-7xl leading-[0.92] auth-el">
            Run your<br /><span className="text-op-purple">whole hotel</span><br />from one home.
          </h2>
          <p className="mt-6 text-background/70 max-w-md auth-el">
            2,300+ teams run their properties on OPERIX. Reservations, housekeeping, revenue, and guest AI — unified.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-3 auth-el">
          <div className="aspect-square rounded-3xl bg-op-purple" />
          <div className="aspect-square rounded-3xl bg-op-pink" />
          <div className="aspect-square rounded-3xl bg-op-orange" />
        </div>
      </aside>
    </div>
  );
}
