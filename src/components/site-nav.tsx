import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const NAV_LINKS = [
  { to: "/", label: "Product" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/pricing", label: "Pricing" },
] as const;

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="fixed top-3 inset-x-3 sm:inset-x-6 z-50 flex justify-center">
        <nav className="w-full max-w-6xl bg-white rounded-full shadow-[0_8px_30px_rgba(0,0,0,0.08)] flex items-center justify-between pl-5 pr-2 py-2">
          <Link to="/" className="font-display text-2xl tracking-tight">
            OPERIX
          </Link>
          <div className="hidden lg:flex items-center gap-8 text-sm font-medium text-foreground/80">
            {NAV_LINKS.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-foreground">{l.label}</Link>
            ))}
            <a href="#enterprise" className="hover:text-foreground">Enterprise</a>
            <Link to="/sign-in" className="hover:text-foreground">Login</Link>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/sign-up"
              className="hidden sm:inline-flex items-center bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold hover:opacity-90 transition"
            >
              Book a demo
            </Link>
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-3 rounded-full hover:bg-muted"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      {open && (
        <div className="fixed inset-0 z-[60] lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-[88%] max-w-sm bg-background p-6 flex flex-col animate-slide-in-right">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl">OPERIX</span>
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-2 rounded-full hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-2 text-2xl font-display">
              {NAV_LINKS.map((l) => (
                <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="py-3 border-b border-border">
                  {l.label}
                </Link>
              ))}
              <a href="#enterprise" onClick={() => setOpen(false)} className="py-3 border-b border-border">Enterprise</a>
              <Link to="/sign-in" onClick={() => setOpen(false)} className="py-3 border-b border-border">Login</Link>
            </nav>
            <Link
              to="/sign-up"
              onClick={() => setOpen(false)}
              className="mt-auto bg-foreground text-background rounded-full px-5 py-4 text-center font-semibold"
            >
              Book a demo
            </Link>
          </div>
        </div>
      )}
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-foreground text-background px-6 py-20 mt-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-4 gap-12">
        <div>
          <div className="font-display text-3xl">OPERIX</div>
          <p className="mt-4 text-background/60 text-sm max-w-xs">
            The AI operating system for modern hospitality.
          </p>
        </div>
        {[
          { h: "Product", l: ["PMS", "Channel Manager", "Revenue AI", "Housekeeping", "POS", "CRM"] },
          { h: "Modules", l: ["Maintenance", "Procurement", "Events", "Payroll", "Finance", "BI"] },
          { h: "Company", l: ["About", "Customers", "Careers", "Security", "Contact", "Status"] },
        ].map((c) => (
          <div key={c.h}>
            <div className="font-semibold mb-4">{c.h}</div>
            <ul className="space-y-3 text-background/60 text-sm">
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
