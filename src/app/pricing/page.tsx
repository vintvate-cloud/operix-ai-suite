"use client";
import Link from "next/link";
import { useState } from "react";
import { Check, Sparkles, ArrowRight, Building2, Store, Users, Cog, LayoutGrid, MonitorSmartphone, Brain, Wrench, Calendar, MapPin, Calculator, Globe, Paintbrush } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-nav";



const PACKAGES = [
  {
    name: "Starter",
    price: "₹2,999",
    priceMax: "₹4,999",
    unit: "per month",
    setup: "₹8,000 – ₹15,000 setup",
    blurb: "For small businesses looking to establish a strong online presence.",
    cta: "Start free trial",
    bg: "bg-white",
    fg: "text-foreground",
    features: [
      "Business Website & CMS",
      "Basic SEO",
      "Lead Forms",
      "WhatsApp Integration",
      "Basic CRM",
      "Analytics Dashboard",
    ],
  },
  {
    name: "Growth",
    price: "₹7,999",
    priceMax: "₹14,999",
    unit: "per month",
    setup: "₹25,000 – ₹50,000 setup",
    blurb: "For businesses doing ₹5L–50L/month looking to scale operations.",
    cta: "Start free trial",
    highlight: true,
    bg: "bg-foreground",
    fg: "text-background",
    features: [
      "Everything in Starter",
      "Full ERP",
      "Inventory Management",
      "Billing & Invoicing",
      "Staff Management",
      "Customer Management",
      "Mobile App",
      "AI Reports",
    ],
  },
  {
    name: "Business Pro",
    price: "₹15,000",
    priceMax: "₹35,000",
    unit: "per month",
    setup: "₹50,000 – ₹1.5L setup",
    blurb: "For growing companies that need multiple tools unified into one stack.",
    cta: "Start free trial",
    bg: "bg-op-purple",
    fg: "text-foreground",
    features: [
      "Everything in Growth",
      "Point of Sale (POS)",
      "Marketing Dashboard",
      "AI Copilot",
      "Multi-user Access",
      "Advanced SEO",
      "Priority Support",
    ],
  },
  {
    name: "Enterprise",
    price: "₹50,000+",
    priceMax: "₹3L",
    unit: "per month",
    setup: "₹2L–10L+ setup",
    blurb: "For chains and large organizations running multiple locations.",
    cta: "Talk to sales",
    bg: "bg-op-pink",
    fg: "text-foreground",
    features: [
      "Multi-Branch ERP",
      "Custom Modules",
      "API Integrations",
      "White Label Options",
      "Dedicated Support",
      "AI Automation",
    ],
  },
];

const MODULES = [
  { name: "ERP Core", price: "₹4,999", icon: LayoutGrid },
  { name: "POS", price: "₹2,999", icon: Store },
  { name: "CRM", price: "₹2,499", icon: Users },
  { name: "Website CMS", price: "₹1,999", icon: Globe },
  { name: "SEO Suite", price: "₹2,999", icon: SearchIcon },
  { name: "Mobile App", price: "₹3,999", icon: MonitorSmartphone },
  { name: "AI Copilot", price: "₹2,999", icon: Brain },
  { name: "HR & Payroll", price: "₹2,499", icon: Users },
  { name: "Accounting", price: "₹2,999", icon: Calculator },
  { name: "Inventory", price: "₹1,999", icon: Building2 },
];

function SearchIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
    </svg>
  )
}

function PricingPage() {
  return (
    <main className="bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="pt-36 pb-10 px-4 text-center">
        <p className="text-muted-foreground mb-4">Pricing</p>
        <h1 className="font-display text-[12vw] sm:text-[9vw] lg:text-[100px] leading-[0.9]">
          Don't sell features.<br />
          <span className="text-op-purple">Sell outcomes.</span>
        </h1>
        <p className="mt-8 max-w-2xl mx-auto text-lg text-muted-foreground">
          Instead of paying for a fragmented tech stack, get everything your business needs to operate and grow in one subscription.
        </p>
      </section>

      {/* Packages */}
      <section className="px-3 sm:px-6 pb-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {PACKAGES.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-[32px] p-8 sm:p-10 ${t.bg} ${t.fg} hover-lift ${t.highlight ? "lg:-mt-4" : ""}`}
            >
              {t.highlight && (
                <span className="absolute top-6 right-6 inline-flex items-center gap-1.5 bg-op-pink text-foreground rounded-full px-3 py-1 text-xs font-semibold">
                  <Sparkles className="h-3 w-3" /> Recommended
                </span>
              )}
              <div className="text-sm font-semibold opacity-70">{t.name}</div>
              <div className="mt-6 flex flex-col gap-1">
                <span className="font-display text-4xl xl:text-5xl">{t.price}</span>
                <span className="text-xl font-medium opacity-80">to {t.priceMax}</span>
              </div>
              <div className="text-sm opacity-70 mt-2">{t.unit}</div>
              
              <div className="mt-4 px-3 py-1.5 rounded-full bg-white/20 text-xs font-semibold inline-block">
                {t.setup}
              </div>

              <p className="mt-6 opacity-80 text-sm">{t.blurb}</p>
              
              <Link
                href="/sign-up"
                className={`mt-8 inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold w-full justify-center transition hover:scale-[1.02] ${
                  t.highlight
                    ? "bg-op-pink text-foreground"
                    : t.name === "Enterprise"
                    ? "bg-foreground text-background"
                    : "bg-foreground text-background"
                }`}
              >
                {t.cta} <ArrowRight className="h-4 w-4" />
              </Link>
              
              <ul className="mt-8 space-y-3">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="h-5 w-5 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Per Location Pricing */}
      <section className="px-3 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto bg-muted rounded-[32px] p-8 sm:p-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-4xl sm:text-5xl font-display">Per Location Pricing</h2>
            <p className="mt-4 text-lg text-muted-foreground">The most transparent pricing model. Businesses understand this immediately.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-3xl p-8 hover-lift">
              <MapPin className="h-8 w-8 mx-auto mb-4 text-op-purple" />
              <div className="text-xl font-semibold">1 Branch</div>
              <div className="mt-4 font-display text-4xl">₹9,999</div>
              <div className="text-sm text-muted-foreground mt-1">per month</div>
            </div>
            <div className="bg-foreground text-background rounded-3xl p-8 hover-lift scale-105">
              <div className="flex justify-center mb-4 gap-1">
                <MapPin className="h-8 w-8 text-op-pink" />
                <MapPin className="h-8 w-8 text-op-pink" />
              </div>
              <div className="text-xl font-semibold">5 Branches</div>
              <div className="mt-4 font-display text-4xl">₹39,999</div>
              <div className="text-sm text-background/70 mt-1">per month</div>
            </div>
            <div className="bg-white rounded-3xl p-8 hover-lift">
               <div className="flex justify-center mb-4 gap-1">
                <MapPin className="h-8 w-8 text-op-orange" />
                <MapPin className="h-8 w-8 text-op-orange" />
                <MapPin className="h-8 w-8 text-op-orange" />
              </div>
              <div className="text-xl font-semibold">20 Branches</div>
              <div className="mt-4 font-display text-4xl">₹99,999</div>
              <div className="text-sm text-muted-foreground mt-1">per month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Module-Based Pricing */}
      <section className="px-3 sm:px-6 py-16 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-display">Build your own stack</h2>
            <p className="mt-4 text-lg text-muted-foreground">Only pay for the modules you need. Start small and grow.</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {MODULES.map((m) => (
              <div key={m.name} className="bg-muted rounded-2xl p-6 flex flex-col items-center text-center hover-lift hover:bg-foreground hover:text-background transition group">
                <m.icon className="h-8 w-8 mb-4 opacity-80 group-hover:opacity-100" />
                <div className="font-semibold">{m.name}</div>
                <div className="mt-2 text-xl font-display text-op-purple group-hover:text-op-pink">{m.price}</div>
                <div className="text-xs opacity-60 mt-1">/ month</div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-op-beige rounded-3xl p-8 sm:p-10 flex flex-col sm:flex-row items-center justify-between">
            <div>
              <div className="text-sm font-semibold opacity-70 mb-2">Example Package</div>
              <h3 className="text-2xl font-semibold">Hotel Stack</h3>
              <p className="mt-2 flex gap-2 flex-wrap max-w-lg">
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">ERP</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">POS</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Website</span>
                <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">Mobile App</span>
              </p>
            </div>
            <div className="mt-6 sm:mt-0 text-right">
              <div className="font-display text-4xl sm:text-5xl">₹13k–15k</div>
              <div className="text-sm opacity-70">per month</div>
            </div>
          </div>
        </div>
      </section>

      {/* Add-ons & One Time Fees */}
      <section className="px-3 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
          {/* AI Add-Ons */}
          <div className="bg-foreground text-background rounded-[32px] p-8 sm:p-12">
            <h2 className="text-3xl font-display mb-8 flex items-center gap-3">
              <Brain className="text-op-purple" /> AI Add-Ons
            </h2>
            <div className="space-y-6">
              <div className="border-b border-white/10 pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">AI Assistant</h3>
                    <p className="text-background/70 text-sm mt-1">Reports, Forecasts, Chat Assistant</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display text-op-pink">₹2,999</div>
                    <div className="text-xs opacity-60">/ month</div>
                  </div>
                </div>
              </div>
              <div className="border-b border-white/10 pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">AI Marketing</h3>
                    <p className="text-background/70 text-sm mt-1">Content generation, SEO suggestions, Campaigns</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display text-op-pink">₹4,999</div>
                    <div className="text-xs opacity-60">/ month</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold">AI Revenue Optimization</h3>
                    <p className="text-background/70 text-sm mt-1">Dynamic pricing that pays for itself.</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-display text-op-pink">₹7,999</div>
                    <div className="text-xs opacity-60">/ month</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* One-Time Fees */}
          <div className="bg-muted rounded-[32px] p-8 sm:p-12">
            <h2 className="text-3xl font-display mb-8">One-Time Services</h2>
            <div className="space-y-4">
              {[
                { name: "Website Design", price: "₹15k – ₹75k", icon: Paintbrush },
                { name: "Mobile App Branding", price: "₹20k – ₹1L", icon: MonitorSmartphone },
                { name: "Data Migration", price: "₹10k – ₹50k", icon: Cog },
                { name: "Staff Training", price: "₹5k – ₹25k", icon: Users },
                { name: "Custom Features", price: "₹20k – ₹5L+", icon: Wrench },
              ].map((s) => (
                <div key={s.name} className="bg-white rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center">
                      <s.icon className="h-5 w-5" />
                    </div>
                    <span className="font-medium">{s.name}</span>
                  </div>
                  <span className="font-semibold">{s.price}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-3 sm:px-6 py-6">
        <div className="rounded-[36px] bg-op-orange p-8 sm:p-20 text-center min-h-[50vh] flex flex-col justify-center">
          <h2 className="font-display text-4xl sm:text-7xl text-foreground">
            Get your entire stack<br/>in one subscription
          </h2>
          <p className="mt-6 text-foreground/80">Transform your operations today.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link href="/sign-up" className="bg-foreground text-background rounded-full px-8 py-4 font-semibold inline-flex items-center gap-2 hover:scale-[1.02] transition">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#demo" className="bg-white text-foreground rounded-full px-8 py-4 font-semibold hover:scale-[1.02] transition">Book a demo</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}

export default PricingPage;
