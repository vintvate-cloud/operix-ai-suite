import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
// framer-motion no longer needed here; GSAP handles animations
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Search,
  DollarSign,
  MessageCircle,
  Plus,
  ArrowRight,
  Sparkles,
  Bed,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Users,
  Wrench,
  ShoppingCart,
  BarChart3,
  Bot,
  Hotel,
  Star,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-nav";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "OPERIX — The AI Operating System for Hospitality" },
      {
        name: "description",
        content:
          "Run your entire hotel from one AI operating system. Reservations, housekeeping, revenue, staff, inventory, and guest experience — unified.",
      },
      { property: "og:title", content: "OPERIX — The AI Operating System for Hospitality" },
      {
        property: "og:description",
        content: "Manage your entire hotel from one intelligent platform.",
      },
    ],
  }),
  component: Landing,
});

/* --------------------------- Hero --------------------------- */
function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".hero-line", {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.08,
      });
      gsap.from(".hero-cta", { opacity: 0, y: 20, duration: 0.8, delay: 0.6, stagger: 0.1, ease: "power3.out" });
      gsap.from(".hero-tile", {
        scale: 0.6,
        opacity: 0,
        duration: 0.9,
        delay: 0.8,
        stagger: 0.07,
        ease: "back.out(1.7)",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={ref} className="relative bg-foreground text-background pt-36 pb-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <p className="text-sm sm:text-base text-background/60 mb-6">
          The AI Operating System for Hospitality
        </p>
        <h1 className="font-display text-[15vw] sm:text-[11vw] lg:text-[140px] leading-[0.9]">
          <span className="block overflow-hidden"><span className="hero-line inline-block">Run your entire</span></span>
          <span className="block overflow-hidden"><span className="hero-line inline-block">hotel from one</span></span>
          <span className="block overflow-hidden"><span className="hero-line inline-block text-op-purple">AI platform</span></span>
        </h1>
        <p className="hero-cta mt-10 mx-auto max-w-2xl text-lg sm:text-xl text-background/75 leading-relaxed">
          Manage reservations, housekeeping, revenue, staff, inventory, guest
          communication and accounting — from one intelligent platform.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 justify-center">
          <a href="#trial" className="hero-cta bg-op-pink text-foreground rounded-full px-7 py-4 font-semibold hover:scale-[1.03] transition">
            Try for free
          </a>
          <a href="#demo" className="hero-cta bg-white/10 text-background rounded-full px-7 py-4 font-semibold hover:bg-white/20 transition">
            Request a demo
          </a>
        </div>
        <p className="hero-cta mt-6 text-sm text-background/50">
          14-day free trial · No credit card required
        </p>

      </div>
      <div className="mt-20 w-full grid grid-cols-6 sm:grid-cols-12 gap-3 px-2 sm:px-6">
        <div className="hero-tile col-span-2 aspect-square rounded-full bg-op-pink animate-float flex items-center justify-center text-3xl">🛎️</div>
        <div className="hero-tile col-span-1 sm:col-span-2 rounded-3xl bg-op-purple aspect-square flex items-center justify-center animate-float [animation-delay:0.5s]">
          <Search className="text-foreground h-7 w-7" />
        </div>
        <div className="hero-tile col-span-3 sm:col-span-4 rounded-3xl bg-op-pink/70 aspect-[2/1] animate-float [animation-delay:1s] flex items-center justify-center text-background/70 font-display text-2xl">FRONT DESK</div>
        <div className="hero-tile col-span-6 sm:col-span-4 rounded-3xl bg-op-peach aspect-[2/1] animate-float [animation-delay:0.2s] flex items-center px-6 text-foreground/70 font-display text-2xl">REVENUE</div>

        <div className="hero-tile col-span-6 sm:col-span-5 rounded-3xl bg-op-peach aspect-[2.2/1] animate-float [animation-delay:0.7s] flex items-center px-6 text-foreground/70 font-display text-2xl">HOUSEKEEPING</div>
        <div className="hero-tile col-span-2 aspect-square rounded-full bg-op-beige animate-float [animation-delay:1.2s] flex items-center justify-center text-3xl">🛏️</div>
        <div className="hero-tile col-span-2 rounded-3xl bg-op-orange aspect-square flex items-center justify-center animate-float [animation-delay:0.4s]">
          <DollarSign className="text-white h-7 w-7" />
        </div>
        <div className="hero-tile col-span-3 rounded-3xl bg-op-purple/70 aspect-[1.5/1] animate-float [animation-delay:0.9s] flex items-center justify-center">
          <Bot className="text-foreground h-8 w-8" />
        </div>

        <div className="hero-tile col-span-4 rounded-3xl bg-background/10 aspect-[2/1] animate-float [animation-delay:0.3s] backdrop-blur flex items-center px-6 text-background/80 font-display text-xl">AI COPILOT</div>
        <div className="hero-tile col-span-2 aspect-square rounded-full bg-op-pink animate-float [animation-delay:1.4s] flex items-center justify-center text-3xl">🍽️</div>
        <div className="hero-tile col-span-3 rounded-3xl bg-op-beige aspect-[1.5/1] animate-float [animation-delay:0.6s] flex items-center justify-center">
          <Calendar className="text-foreground h-8 w-8" />
        </div>
        <div className="hero-tile col-span-3 rounded-3xl bg-op-orange/80 aspect-[1.5/1] animate-float [animation-delay:0.1s] flex items-center justify-center text-3xl">💼</div>
      </div>
    </section>
  );
}

/* ------------------------- Trusted by ------------------------- */
function TrustedBy() {
  const logos = ["MARRIOTT","HILTON","ACCOR","FOUR SEASONS","HYATT","AMAN","RITZ-CARLTON","ROSEWOOD","SOHO HOUSE","SIX SENSES"];
  return (
    <section className="bg-background py-24 px-4">
      <div className="max-w-5xl mx-auto text-center">
        <p className="text-muted-foreground mb-4">Customers</p>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Trusted by 2,300+ hospitality teams
        </h2>
      </div>
      <div className="mt-16 overflow-hidden marquee-mask">
        <div className="flex gap-12 animate-marquee w-max">
          {[...logos, ...logos].map((l, i) => (
            <div key={i} className="flex items-center gap-3 bg-white rounded-2xl px-6 py-4 shadow-sm shrink-0 hover-lift">
              <div className="h-9 w-9 rounded-lg bg-foreground text-background flex items-center justify-center text-xs font-bold">
                {l[0]}
              </div>
              <span className="font-semibold text-lg whitespace-nowrap">{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- AI Command Center ------------------ */
function AICommandCenter() {
  const messages = [
    "Occupancy next week?",
    "Generate housekeeping schedule",
    "Predict cancellations",
    "Optimize room pricing",
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % messages.length), 2500);
    return () => clearInterval(t);
  }, []);
  return (
    <section className="px-3 sm:px-6 py-6">
      <div className="rounded-[36px] p-8 sm:p-16 bg-op-purple text-foreground relative overflow-hidden">
        <div className="text-center max-w-3xl mx-auto">
          <p className="font-medium mb-4">AI Copilot</p>
          <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl">
            Your hotel,<br />on autopilot
          </h2>
          <p className="mt-6 text-lg max-w-xl mx-auto">
            Ask anything. OPERIX AI forecasts occupancy, builds schedules, and
            optimizes pricing in real time.
          </p>
        </div>

        <div className="mt-12 max-w-2xl mx-auto bg-white rounded-3xl p-6 shadow-xl">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Bot className="h-4 w-4" /> OPERIX Copilot
            <span className="ml-auto inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-op-success animate-pulse-dot" />
              Live
            </span>
          </div>
          <div className="space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition ${i === active ? "bg-foreground text-background" : "bg-muted"}`}>
                <Sparkles className="h-4 w-4 shrink-0" />
                <span className="text-sm font-medium">{m}</span>
                {i === active && (<span className="ml-auto text-xs opacity-70">answering…</span>)}
              </div>
            ))}
          </div>
          <div className="mt-4 rounded-2xl border bg-background p-4 text-sm">
            <span className="text-muted-foreground">Forecast: </span>
            Next week occupancy <strong>87%</strong> · ADR <strong>$312</strong> · RevPAR{" "}
            <strong>$271</strong>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------- Reservations card ------------------- */
function ReservationsCard() {
  return (
    <section className="px-3 sm:px-6 py-6">
      <div className="rounded-[36px] bg-foreground text-background p-8 sm:p-16">
        <div className="max-w-3xl">
          <p className="text-background/60 mb-3">Reservations</p>
          <h2 className="font-display text-5xl sm:text-7xl">
            Manage bookings<br />without chaos
          </h2>
          <p className="mt-6 text-lg text-background/70 max-w-xl">
            PMS, front desk, group bookings, OTA sync, check-in & check-out — one
            unified timeline.
          </p>
        </div>
        <div className="mt-12 bg-white text-foreground rounded-3xl p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="text-sm text-muted-foreground">Today · June 16</div>
              <div className="text-2xl font-semibold">Arrivals (12)</div>
            </div>
            <div className="flex gap-2">
              {["Day", "Week", "Month"].map((t, i) => (
                <button key={t} className={`text-xs px-3 py-1.5 rounded-full ${i === 1 ? "bg-foreground text-background" : "bg-muted"}`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            {[
              { name: "Suite 1204 · A. Mehta", status: "Checked-in", color: "bg-op-success/20 text-emerald-700" },
              { name: "Room 814 · L. García", status: "Arriving 3:00 PM", color: "bg-op-pink/30 text-rose-700" },
              { name: "Villa 02 · The Tanaka Party", status: "VIP", color: "bg-op-purple/30 text-purple-700" },
              { name: "Room 502 · J. Okonkwo", status: "Awaiting verification", color: "bg-op-peach text-orange-700" },
            ].map((r) => (
              <div key={r.name} className="flex items-center justify-between rounded-2xl bg-muted/60 px-4 py-3 hover-lift">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-foreground text-background flex items-center justify-center">
                    <Bed className="h-4 w-4" />
                  </div>
                  <span className="font-medium">{r.name}</span>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${r.color}`}>{r.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HousekeepingCard() {
  return (
    <section className="px-3 sm:px-6 py-6">
      <div className="rounded-[36px] bg-op-beige p-8 sm:p-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-5xl sm:text-7xl">Stay in control</h2>
          <p className="mt-6 text-lg max-w-xl mx-auto">
            Keep rooms, queues and contracts tidy in one home. Save hours every day with smart assignments and live status.
          </p>
          <a href="#explore" className="mt-8 inline-flex bg-foreground text-background rounded-full px-7 py-4 font-semibold hover:scale-[1.03] transition">
            Explore housekeeping
          </a>
        </div>
        <div className="mt-12 grid sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Clean", count: 84, color: "bg-op-success" },
            { label: "In progress", count: 17, color: "bg-op-pink" },
            { label: "Dirty", count: 23, color: "bg-foreground text-background" },
          ].map((c) => (
            <div key={c.label} className="bg-white rounded-3xl p-6 hover-lift">
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-full ${c.color}`}>
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="mt-4 text-4xl font-semibold">{c.count}</div>
              <div className="text-sm text-muted-foreground">{c.label} rooms</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function RevenueCard() {
  const bars = [40, 65, 50, 80, 55, 90, 72];
  return (
    <section className="px-3 sm:px-6 py-6">
      <div className="rounded-[36px] bg-op-pink p-8 sm:p-16">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-5xl sm:text-7xl">Grow revenue</h2>
          <p className="mt-6 text-lg max-w-xl mx-auto text-foreground/80">
            Track ADR, RevPAR, occupancy, and forecasts. Let AI tune dynamic pricing across every channel.
          </p>
        </div>
        <div className="mt-12 max-w-4xl mx-auto bg-white rounded-3xl p-8">
          <div className="flex flex-wrap items-end justify-between mb-6 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Revenue this month</div>
              <div className="text-4xl font-semibold">$1,284,930</div>
            </div>
            <span className="px-3 py-1 bg-op-success/20 text-emerald-700 rounded-full font-semibold text-sm">
              <TrendingUp className="inline h-3.5 w-3.5 mr-1" /> +18.4%
            </span>
          </div>
          <div className="flex items-end gap-3 h-44">
            {bars.map((h, i) => (<div key={i} className="flex-1 rounded-t-2xl bg-foreground" style={{ height: `${h}%` }} />))}
          </div>
          <div className="grid grid-cols-3 mt-6 gap-3 text-sm">
            {[{ k: "ADR", v: "$312" },{ k: "RevPAR", v: "$271" },{ k: "Occupancy", v: "87%" }].map((m) => (
              <div key={m.k} className="rounded-2xl bg-muted p-4">
                <div className="text-muted-foreground">{m.k}</div>
                <div className="text-xl font-semibold">{m.v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function GuestExperience() {
  return (
    <section className="px-3 sm:px-6 py-6">
      <div className="rounded-[36px] bg-op-peach p-8 sm:p-16 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <p className="text-foreground/60 mb-3">Guest experience</p>
          <h2 className="font-display text-5xl sm:text-7xl">Every guest, delighted</h2>
          <p className="mt-6 text-lg max-w-md text-foreground/80">
            AI concierge across WhatsApp, SMS and email. Handle requests, upsells, and reviews automatically — 24/7.
          </p>
          <a href="#guest" className="mt-8 inline-flex bg-foreground text-background rounded-full px-7 py-4 font-semibold hover:scale-[1.03] transition">
            Explore guest AI
          </a>
        </div>
        <div className="relative mx-auto w-full max-w-xs">
          <div className="rounded-[40px] bg-foreground p-3 shadow-2xl">
            <div className="rounded-[32px] bg-white p-4 min-h-[480px]">
              <div className="text-xs text-muted-foreground mb-3 flex items-center gap-2">
                <MessageCircle className="h-3.5 w-3.5" /> OPERIX Concierge
              </div>
              <div className="space-y-2 text-sm">
                <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2 max-w-[80%]">Hi! Can I get a late checkout tomorrow?</div>
                <div className="ml-auto bg-foreground text-background rounded-2xl rounded-tr-md px-4 py-2 max-w-[80%]">Of course — 2 PM works for Suite 1204. Confirmed ✨</div>
                <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2 max-w-[80%]">Perfect. Could you book the spa at 11?</div>
                <div className="ml-auto bg-foreground text-background rounded-2xl rounded-tr-md px-4 py-2 max-w-[80%]">Booked. 60-min deep tissue, $180 added to your folio.</div>
                <div className="bg-muted rounded-2xl rounded-tl-md px-4 py-2 max-w-[80%]">You're amazing 🙏</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Ecosystem() {
  const modules = [
    { icon: Calendar, label: "Reservations" },
    { icon: Hotel, label: "Front Desk" },
    { icon: Bed, label: "Housekeeping" },
    { icon: Wrench, label: "Maintenance" },
    { icon: Users, label: "CRM" },
    { icon: DollarSign, label: "Accounting" },
    { icon: ShoppingCart, label: "Inventory" },
    { icon: Users, label: "HR" },
    { icon: BarChart3, label: "Revenue" },
    { icon: ShoppingCart, label: "POS" },
    { icon: ShoppingCart, label: "Procurement" },
    { icon: Bot, label: "AI Copilot" },
  ];
  return (
    <section className="bg-background py-24 px-4">
      <div className="max-w-4xl mx-auto text-center px-4">
        <p className="text-muted-foreground mb-3">Ecosystem</p>
        <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
          One platform. Every module. Zero silos.
        </h2>
      </div>
      <div className="mt-16 max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {modules.map((m) => (
          <div key={m.label} className="group bg-white rounded-3xl p-6 hover:bg-foreground hover:text-background transition hover-lift cursor-pointer">
            <m.icon className="h-6 w-6 mb-6" />
            <div className="text-lg font-semibold">{m.label}</div>
            <div className="mt-1 text-sm text-muted-foreground group-hover:text-background/60">Built-in module</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Integrations() {
  const items = ["Stripe","QuickBooks","Xero","WhatsApp","Booking.com","Airbnb","Expedia","Google Hotels","Oracle","Salesforce"];
  return (
    <section className="px-3 sm:px-6 py-6">
      <div className="rounded-[36px] bg-foreground text-background p-8 sm:p-16">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-background/60 mb-3">Integrations</p>
          <h2 className="font-display text-5xl sm:text-7xl">Plays nice with your stack</h2>
        </div>
        <div className="mt-12 overflow-hidden marquee-mask">
          <div className="flex gap-3 animate-marquee-slow w-max">
            {[...items, ...items, ...items].map((i, idx) => (
              <span key={idx} className="bg-white/10 hover:bg-op-purple hover:text-foreground transition rounded-full px-5 py-3 font-semibold whitespace-nowrap">
                {i}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Scroll-driven color-shifting big sections ---------- */
const SHIFT_SECTIONS = [
  {
    bg: "bg-op-orange",
    text: "text-foreground",
    eyebrow: "Workforce",
    title: "Find, schedule, and grow the right team for every shift",
  },
  {
    bg: "bg-op-purple",
    text: "text-foreground",
    eyebrow: "Revenue",
    title: "Forecast demand, price every room, win every channel",
  },
  {
    bg: "bg-op-pink",
    text: "text-foreground",
    eyebrow: "Guest AI",
    title: "Answer guests in seconds, in any language, on any channel",
  },
  {
    bg: "bg-op-peach",
    text: "text-foreground",
    eyebrow: "Housekeeping",
    title: "Turn every room around faster with live AI assignments",
  },
  {
    bg: "bg-op-beige",
    text: "text-foreground",
    eyebrow: "Finance",
    title: "Close the books in hours, not weeks, with built-in accounting",
  },
  {
    bg: "bg-foreground",
    text: "text-background",
    eyebrow: "Operations",
    title: "Turn chaos into clarity across every property in your group",
  },
];


function ShiftStack() {
  return (
    <div className="relative">
      {SHIFT_SECTIONS.map((s, i) => (
        <ShiftSection key={i} index={i} total={SHIFT_SECTIONS.length} {...s} />
      ))}
    </div>
  );
}

function ShiftSection({ bg, text, eyebrow, title, index, total }: { bg: string; text: string; eyebrow: string; title: string; index: number; total: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current.querySelector(".shift-title");
    if (!el) return;
    const split = (el.textContent || "").split(" ");
    el.innerHTML = split
      .map((w) => `<span class="inline-block overflow-hidden"><span class="inline-block shift-word">${w}&nbsp;</span></span>`)
      .join("");
    const ctx = gsap.context(() => {
      gsap.from(".shift-word", {
        yPercent: 110,
        duration: 0.9,
        ease: "expo.out",
        stagger: 0.04,
        scrollTrigger: { trigger: ref.current, start: "top 75%" },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={ref}
      className="sticky px-3 sm:px-6 pb-6"
      style={{ top: `${index * 24}px` }}
    >
      <div
        className={`rounded-[36px] ${bg} ${text} min-h-[88vh] p-8 sm:p-16 flex flex-col justify-between overflow-hidden shadow-[0_-20px_60px_-20px_rgba(0,0,0,0.25)]`}
      >
        <div className="flex items-center justify-between text-sm font-medium opacity-70">
          <span>{eyebrow}</span>
          <span>
            0{index + 1} / 0{total}
          </span>
        </div>
        <h2 className="shift-title font-display text-5xl sm:text-8xl max-w-5xl">{title}</h2>
      </div>
    </section>
  );
}


/* ----------------------- Testimonials (auto-scroll) ------------------------ */
function Testimonials() {
  const items = [
    { brand: "AURELIA RESORTS", quote: "Before OPERIX, our operations were split across six tools. Now everything runs in one place. Our team saves 30+ hours a week.", name: "Regina Kacajeva", role: "Director of Operations", color: "bg-op-peach" },
    { brand: "NORDIC HOUSE", quote: "Revenue forecasts that actually work. We hit RevPAR targets two quarters in a row.", name: "Mikael Vinter", role: "GM", color: "bg-op-purple" },
    { brand: "CASA SOLAR", quote: "Housekeeping turns dropped from 38 to 22 minutes. Guests notice.", name: "Laura Castaño", role: "Head of Operations", color: "bg-op-pink" },
    { brand: "KUMO HOTELS", quote: "The AI concierge handles 70% of guest messages without a human in the loop.", name: "Hiro Tanaka", role: "Founder", color: "bg-op-beige" },
    { brand: "MAISON ELYSÉE", quote: "One log-in for everything. We retired five tools in a month.", name: "Camille Roux", role: "CEO", color: "bg-op-orange" },
  ];
  return (
    <section className="bg-background py-24">
      <div className="max-w-4xl mx-auto text-center mb-12 px-4">
        <p className="text-muted-foreground mb-3">Testimonials</p>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          From teams who used to drown in spreadsheets
        </h2>
      </div>
      <div className="overflow-hidden marquee-mask">
        <div className="flex gap-6 animate-marquee-slow w-max">
          {[...items, ...items].map((t, i) => (
            <article key={i} className={`shrink-0 w-[88vw] sm:w-[520px] ${t.color} rounded-[32px] p-8 sm:p-10 hover-lift`}>
              <div className="font-display text-xl">{t.brand}</div>
              <p className="mt-6 text-lg leading-relaxed text-foreground/85">{t.quote}</p>
              <div className="mt-8 flex items-center gap-4">
                <div className="h-11 w-11 rounded-full bg-foreground text-background flex items-center justify-center font-semibold">
                  {t.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-foreground/60">{t.role}</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, j) => (<Star key={j} className="h-4 w-4 fill-foreground" />))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Resources() {
  return (
    <section id="resources" className="bg-background py-24 px-4">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <p className="text-muted-foreground mb-3">Resources</p>
        <h2 className="text-4xl sm:text-5xl font-semibold tracking-tight">Become a smarter hotelier</h2>
      </div>
      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-5">
        <article className="bg-muted rounded-3xl p-6 hover-lift">
          <div className="rounded-2xl bg-op-purple h-56 flex items-end p-6"><BarChart3 className="h-10 w-10" /></div>
          <span className="inline-block mt-6 text-xs bg-white px-3 py-1 rounded-full font-semibold">Revenue Lab</span>
          <h3 className="mt-4 text-2xl font-semibold">Pricing playbook 2026</h3>
          <p className="mt-2 text-muted-foreground">How leading independent hotels are using AI to push RevPAR by 22% YoY.</p>
        </article>
        <article className="bg-muted rounded-3xl p-6 hover-lift">
          <div className="rounded-2xl bg-foreground h-56 flex items-end p-6"><Users className="h-10 w-10 text-background" /></div>
          <span className="inline-block mt-6 text-xs bg-white px-3 py-1 rounded-full font-semibold">Survey Says</span>
          <h3 className="mt-4 text-2xl font-semibold">What guests actually want</h3>
          <p className="mt-2 text-muted-foreground">We surveyed 4,200 travelers. The results will reshape your concierge strategy.</p>
        </article>
      </div>
    </section>
  );
}

/* ----------------------- FAQ (accordion) -------------------------------- */
function FAQ() {
  const items = [
    { q: "What is OPERIX and how does it work?", a: "OPERIX is an AI-native operating system for hotels. It unifies your PMS, channel manager, housekeeping, revenue, CRM, accounting and guest messaging in one platform — with an AI copilot that automates the busywork." },
    { q: "Is OPERIX a PMS, a channel manager, or both?", a: "Both, and more. OPERIX replaces your PMS, channel manager, RMS, and guest messaging tools with a single unified system, so you stop paying for — and reconciling — five different vendors." },
    { q: "Can I use OPERIX for boutique hotels and resorts?", a: "Yes. OPERIX runs single-property boutiques, resorts, hostels, serviced apartments, and global groups with hundreds of locations. The platform scales with you." },
    { q: "Will it integrate with my existing systems?", a: "OPERIX integrates with Stripe, QuickBooks, Xero, WhatsApp, Booking.com, Airbnb, Expedia, Google Hotels, Oracle, Salesforce and more — plus an open API for everything else." },
    { q: "How does OPERIX pricing work?", a: "Pricing is per room, per month, with three tiers (Starter, Growth, Enterprise). All plans include the AI copilot, unlimited users, and 24/7 support." },
    { q: "Is there a free trial?", a: "Yes — 14 days, no credit card required. You can import your data and run your full property end-to-end before deciding." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="px-3 sm:px-6 py-6">
      <div className="bg-muted rounded-[36px] p-8 sm:p-12 max-w-5xl mx-auto">
        <h2 className="text-4xl sm:text-5xl font-semibold mb-8">Frequently asked questions</h2>
        <div className="divide-y divide-border">
          {items.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q} className="py-2">
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                  aria-expanded={isOpen}
                >
                  <span className="text-lg sm:text-xl font-medium pr-6 group-hover:translate-x-1 transition-transform">{item.q}</span>
                  <span className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center transition ${isOpen ? "bg-foreground text-background" : "bg-white"}`}>
                    <Plus className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`} />
                  </span>
                </button>
                <div
                  className="grid transition-all duration-500 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-14 text-base sm:text-lg text-muted-foreground leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FinalCTA() {
  return (
    <section className="px-3 sm:px-6 py-6">
      <div className="rounded-[36px] bg-op-orange p-8 sm:p-20 text-center min-h-[70vh] flex flex-col justify-center">
        <h2 className="font-display text-5xl sm:text-8xl lg:text-9xl text-foreground">
          The future of hotel<br />operations is here
        </h2>
        <div className="mt-12 flex flex-wrap gap-3 justify-center">
          <a href="#trial" className="bg-foreground text-background rounded-full px-8 py-4 font-semibold inline-flex items-center gap-2 hover:scale-[1.03] transition">
            Start free trial <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#demo" className="bg-white text-foreground rounded-full px-8 py-4 font-semibold hover:scale-[1.03] transition">
            Book a demo
          </a>
        </div>
        <div className="mt-16 grid grid-cols-3 max-w-2xl mx-auto gap-6 text-foreground/80">
          {[
            { icon: Zap, label: "Set up in days" },
            { icon: Shield, label: "Enterprise-grade" },
            { icon: Globe, label: "Multi-property" },
          ].map((b) => (
            <div key={b.label} className="flex flex-col items-center gap-2">
              <b.icon className="h-5 w-5" />
              <span className="text-sm font-medium">{b.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Bento grid ----------------------- */
function BentoFeatures() {
  return (
    <section className="px-3 sm:px-6 py-6">
      <div className="max-w-6xl mx-auto text-center mb-10 px-4">
        <p className="text-muted-foreground mb-3">Everything in one OS</p>
        <h2 className="text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05]">
          A bento of capabilities, <br className="hidden sm:block" />wired into one brain
        </h2>
      </div>
      <div className="max-w-6xl mx-auto grid grid-cols-6 auto-rows-[140px] gap-3">
        <div className="col-span-6 sm:col-span-4 row-span-2 bg-foreground text-background rounded-3xl p-8 flex flex-col justify-between hover-lift">
          <Bot className="h-7 w-7" />
          <div>
            <div className="font-display text-4xl">AI Copilot</div>
            <p className="mt-2 text-background/70 max-w-md">Ask anything — pricing, occupancy, schedules, reviews — and it acts on it.</p>
          </div>
        </div>
        <div className="col-span-3 sm:col-span-2 bg-op-purple rounded-3xl p-6 hover-lift">
          <Calendar className="h-6 w-6 mb-3" />
          <div className="font-semibold">Reservations</div>
          <div className="text-xs opacity-70">PMS + OTA sync</div>
        </div>
        <div className="col-span-3 sm:col-span-2 bg-op-pink rounded-3xl p-6 hover-lift">
          <Bed className="h-6 w-6 mb-3" />
          <div className="font-semibold">Housekeeping</div>
          <div className="text-xs opacity-70">Smart turn boards</div>
        </div>
        <div className="col-span-3 sm:col-span-2 row-span-2 bg-op-peach rounded-3xl p-6 flex flex-col justify-between hover-lift">
          <BarChart3 className="h-6 w-6" />
          <div>
            <div className="font-semibold text-lg">Revenue & RMS</div>
            <p className="text-xs opacity-70">Dynamic pricing across every channel, every night.</p>
          </div>
        </div>
        <div className="col-span-3 sm:col-span-2 bg-op-beige rounded-3xl p-6 hover-lift">
          <MessageCircle className="h-6 w-6 mb-3" />
          <div className="font-semibold">Guest Inbox</div>
          <div className="text-xs opacity-70">WhatsApp · SMS · Email</div>
        </div>
        <div className="col-span-3 sm:col-span-2 bg-op-orange text-foreground rounded-3xl p-6 hover-lift">
          <DollarSign className="h-6 w-6 mb-3" />
          <div className="font-semibold">Accounting</div>
          <div className="text-xs opacity-80">Auto-reconciled</div>
        </div>
        <div className="col-span-3 sm:col-span-2 bg-foreground text-background rounded-3xl p-6 hover-lift">
          <Users className="h-6 w-6 mb-3" />
          <div className="font-semibold">Staff & HR</div>
          <div className="text-xs opacity-70">Rosters that flex</div>
        </div>
        <div className="col-span-3 sm:col-span-2 bg-op-purple rounded-3xl p-6 hover-lift">
          <ShoppingCart className="h-6 w-6 mb-3" />
          <div className="font-semibold">Inventory & POS</div>
          <div className="text-xs opacity-70">F&B included</div>
        </div>
        <div className="col-span-6 sm:col-span-2 bg-op-pink rounded-3xl p-6 hover-lift">
          <Wrench className="h-6 w-6 mb-3" />
          <div className="font-semibold">Maintenance</div>
          <div className="text-xs opacity-70">Tickets that close themselves</div>
        </div>
      </div>
    </section>
  );
}

/* ----------------------- Onboarding ----------------------- */
const STEPS = [
  { n: 1, title: "Create your workspace", body: "Add your brand, set currency and time zones. 60 seconds, no card.", color: "bg-op-purple" },
  { n: 2, title: "Connect your channels", body: "Booking.com, Airbnb, Expedia, Google Hotels — we sync inventory live.", color: "bg-op-pink" },
  { n: 3, title: "Import your rooms", body: "Drop a CSV or pull from your old PMS. We map fields automatically.", color: "bg-op-peach" },
  { n: 4, title: "Meet your AI copilot", body: "Train it on your SOPs in one click. It listens, drafts, and acts.", color: "bg-op-beige" },
  { n: 5, title: "Go live with your team", body: "Invite staff, assign roles, and run your property from day one.", color: "bg-op-orange" },
];

function Onboarding() {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const start = performance.now();
    const dur = 4000;
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setProgress(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else setStep((s) => (s + 1) % STEPS.length);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [step]);

  return (
    <section className="px-3 sm:px-6 py-6">
      <div className="rounded-[36px] bg-foreground text-background p-8 sm:p-16">
        <div className="max-w-3xl">
          <p className="text-background/60 mb-3">Onboarding</p>
          <h2 className="font-display text-5xl sm:text-7xl">
            Live in <span className="text-op-purple">five steps</span>
          </h2>
          <p className="mt-6 text-lg text-background/70 max-w-xl">
            From signup to a fully running hotel, OPERIX guides you with live previews, smart defaults, and a copilot that never sleeps.
          </p>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1.2fr_1fr] gap-8 items-start">
          <div className="space-y-3">
            {STEPS.map((s, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <button
                  key={s.n}
                  onClick={() => setStep(i)}
                  className={`w-full text-left rounded-3xl p-5 flex items-start gap-4 transition-all duration-500 ${
                    active ? `${s.color} text-foreground scale-[1.01]` : done ? "bg-white/10" : "bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <span className={`h-10 w-10 shrink-0 rounded-full flex items-center justify-center font-semibold ${active ? "bg-foreground text-background" : done ? "bg-op-success text-foreground" : "bg-white/10"}`}>
                    {done ? <CheckCircle2 className="h-5 w-5" /> : s.n}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{s.title}</div>
                    <p className={`text-sm mt-1 ${active ? "text-foreground/80" : "text-background/60"}`}>{s.body}</p>
                    {active && (
                      <div className="mt-3 h-1 rounded-full bg-foreground/10 overflow-hidden">
                        <div className="h-full bg-foreground" style={{ width: `${progress * 100}%` }} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className={`rounded-3xl p-6 sm:p-8 transition-colors duration-500 ${STEPS[step].color} text-foreground min-h-[420px] flex flex-col`}>
            <div className="text-xs font-medium opacity-70">Step 0{STEPS[step].n} preview</div>
            <div className="font-display text-3xl mt-2">{STEPS[step].title}</div>

            <div className="mt-6 flex-1 bg-white rounded-2xl p-5 space-y-3">
              {step === 0 && (
                <>
                  <PreviewField label="Workspace name" value="Aurelia Resorts" />
                  <PreviewField label="Currency" value="EUR · €" />
                  <PreviewField label="Time zone" value="Europe/Lisbon" />
                </>
              )}
              {step === 1 && (
                <div className="grid grid-cols-2 gap-2">
                  {["Booking.com","Airbnb","Expedia","Google Hotels"].map((c, i) => (
                    <div key={c} className="rounded-xl bg-muted px-3 py-3 flex items-center justify-between">
                      <span className="text-sm font-medium">{c}</span>
                      <span className={`h-2 w-2 rounded-full ${i < 3 ? "bg-op-success animate-pulse-dot" : "bg-muted-foreground/30"}`} />
                    </div>
                  ))}
                </div>
              )}
              {step === 2 && (
                <>
                  <div className="text-xs text-muted-foreground">Importing rooms.csv</div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden"><div className="h-full bg-foreground" style={{ width: `${30 + progress * 70}%` }} /></div>
                  <ul className="text-sm space-y-1 mt-3">
                    {["Mapping room types","Inferring rates","Validating availability"].map((l) => (
                      <li key={l} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-600" />{l}</li>
                    ))}
                  </ul>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground"><Bot className="h-3.5 w-3.5" /> Copilot · training on your SOPs</div>
                  <div className="rounded-2xl bg-muted px-4 py-3 text-sm">Generating welcome message in 6 languages…</div>
                  <div className="flex gap-1">
                    {[0,1,2].map((d) => (
                      <span key={d} className="h-2 w-2 rounded-full bg-foreground animate-pulse-dot" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                </>
              )}
              {step === 4 && (
                <>
                  <div className="text-xs text-muted-foreground">Invite your team</div>
                  {["regina@aurelia.co · Owner","ops@aurelia.co · Manager","desk@aurelia.co · Agent"].map((m) => (
                    <div key={m} className="flex items-center justify-between bg-muted rounded-xl px-3 py-2 text-sm">
                      <span>{m}</span>
                      <span className="text-xs text-emerald-700 font-semibold">Sent</span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function PreviewField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-muted px-3 py-2.5">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value}</div>
    </div>
  );
}

function Landing() {
  return (
    <main className="bg-background text-foreground">
      <SiteNav />
      <Hero />
      <TrustedBy />
      <div className="text-center pt-8 pb-4">
        <p className="text-muted-foreground">Reservations. Housekeeping. Revenue. AI.</p>
        <h2 className="mt-3 text-4xl sm:text-6xl font-semibold tracking-tight max-w-3xl mx-auto px-4 leading-[1.05]">
          Your whole hotel, finally connected in one workflow
        </h2>
      </div>
      <AICommandCenter />
      <ReservationsCard />
      <HousekeepingCard />
      <RevenueCard />
      <GuestExperience />
      <Ecosystem />
      <FlagshipAI />
      <BentoFeatures />
      <Integrations />
      <ShiftStack />
      <Onboarding />
      <Testimonials />

      <Resources />
      <FAQ />
      <FinalCTA />
      <SiteFooter />
    </main>
  );
}
