import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

export function SiteNav() {
  return (
    <header className="fixed top-3 inset-x-3 sm:inset-x-6 z-50 flex justify-center">
      <nav className="w-full max-w-6xl bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-between pl-6 pr-2 py-2">
        <Link to="/" className="font-display text-2xl tracking-tight">
          OPERIX
        </Link>
        <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/80">
          <Link to="/" className="hover:text-foreground">Product</Link>
          <Link to="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <Link to="/pricing" className="hover:text-foreground">Pricing</Link>
          <a href="#enterprise" className="hover:text-foreground">Enterprise</a>
          <a href="#resources" className="hover:text-foreground">Resources</a>
          <Link to="/sign-in" className="hover:text-foreground">Login</Link>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/sign-up"
            className="hidden sm:inline-flex items-center bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
          >
            Book a demo
          </Link>
          <button className="lg:hidden p-3 rounded-full hover:bg-muted" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background px-6 py-20 mt-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-12">
        <div>
          <div className="font-display text-3xl">OPERIX</div>
          <p className="mt-4 text-background/60 text-sm max-w-xs">
            The AI operating system for modern hospitality.
          </p>
        </div>
        {[
          { h: "Product", l: ["Reservations", "Front Desk", "Housekeeping", "Revenue", "AI Copilot"] },
          { h: "Company", l: ["About", "Customers", "Careers", "Press", "Contact"] },
          { h: "Support", l: ["Help center", "Product tour", "API", "Status", "Security"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="font-semibold mb-4">{c.h}</div>
            <ul className="space-y-3 text-background/60">
              {c.l.map((x) => (
                <li key={x}><a href="#" className="hover:text-background">{x}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/10 flex flex-wrap gap-4 justify-between text-sm text-background/50">
        <span>© 2026 OPERIX. All rights reserved.</span>
        <span>ISO 27001 · GDPR · SOC 2</span>
      </div>
      <div className="mt-16 font-display text-[24vw] sm:text-[20vw] leading-[0.85] text-white/[0.06] text-center select-none whitespace-nowrap">
        OPERIX
      </div>
    </footer>
  );
}
