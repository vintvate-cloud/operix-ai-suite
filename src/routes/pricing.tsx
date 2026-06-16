import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Sparkles, ArrowRight } from "lucide-react";
import { SiteNav, SiteFooter } from "@/components/site-nav";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — OPERIX" },
      { name: "description", content: "Simple, per-room pricing for hotels of every size. Starter, Growth and Enterprise plans." },
      { property: "og:title", content: "Pricing — OPERIX" },
      { property: "og:description", content: "Per-room pricing for the AI operating system of hospitality." },
    ],
  }),
  component: PricingPage,
});

type Tier = {
  name: string;
  price: { monthly: number; yearly: number };
  unit: string;
  blurb: string;
  cta: string;
  highlight?: boolean;
  bg: string;
  fg: string;
  features: string[];
};

const TIERS: Tier[] = [
  {
    name: "Starter",
    price: { monthly: 9, yearly: 7 },
    unit: "per room / month",
    blurb: "For boutique properties getting their operations under one roof.",
    cta: "Start free trial",
    bg: "bg-white",
    fg: "text-foreground",
    features: [
      "Up to 40 rooms",
      "PMS + Channel Manager",
      "Housekeeping board",
      "Guest messaging (1 channel)",
      "Unlimited users",
      "Email support",
    ],
  },
  {
    name: "Growth",
    price: { monthly: 19, yearly: 15 },
    unit: "per room / month",
    blurb: "For independents scaling revenue with AI pricing and automation.",
    cta: "Start free trial",
    highlight: true,
    bg: "bg-foreground",
    fg: "text-background",
    features: [
      "Unlimited rooms",
      "Everything in Starter",
      "AI dynamic pricing",
      "AI concierge across WhatsApp, SMS, email",
      "Accounting + Payroll",
      "Open API + webhooks",
      "Priority support",
    ],
  },
  {
    name: "Enterprise",
    price: { monthly: 39, yearly: 32 },
    unit: "per room / month",
    blurb: "For groups, resorts and chains running multiple properties.",
    cta: "Talk to sales",
    bg: "bg-op-purple",
    fg: "text-foreground",
    features: [
      "Multi-property HQ",
      "Custom integrations",
      "Dedicated success manager",
      "SSO, SAML, audit logs",
      "SOC 2 + ISO 27001 reports",
      "99.99% SLA",
      "24/7 phone support",
    ],
  },
];

function PricingPage() {
  const [yearly, setYearly] = useState(true);

  return (
    <main className="bg-background text-foreground">
      <SiteNav />

      {/* Hero */}
      <section className="pt-36 pb-10 px-4 text-center">
        <p className="text-muted-foreground mb-4">Pricing</p>
        <h1 className="font-display text-[14vw] sm:text-[10vw] lg:text-[120px] leading-[0.9]">
          Simple, per-room<br />
          <span className="text-op-purple">honest pricing</span>
        </h1>
        <p className="mt-8 max-w-xl mx-auto text-lg text-muted-foreground">
          All plans include the AI copilot, unlimited users, and a 14-day free trial. No credit card required.
        </p>

        <div className="inline-flex mt-10 bg-muted rounded-full p-1.5">
          <button
            onClick={() => setYearly(false)}
            className={`px-5 py-2 text-sm rounded-full font-semibold transition ${!yearly ? "bg-foreground text-background" : "text-foreground/70"}`}
          >
            Monthly
          </button>
          <button
            onClick={() => setYearly(true)}
            className={`px-5 py-2 text-sm rounded-full font-semibold transition ${yearly ? "bg-foreground text-background" : "text-foreground/70"}`}
          >
            Yearly · save 20%
          </button>
        </div>
      </section>

      {/* Tier cards */}
      <section className="px-3 sm:px-6 pb-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-4">
          {TIERS.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-[32px] p-8 sm:p-10 ${t.bg} ${t.fg} hover-lift ${t.highlight ? "lg:-mt-4" : ""}`}
            >
              {t.highlight && (
                <span className="absolute top-6 right-6 inline-flex items-center gap-1.5 bg-op-pink text-foreground rounded-full px-3 py-1 text-xs font-semibold">
                  <Sparkles className="h-3 w-3" /> Most popular
                </span>
              )}
              <div className="text-sm font-semibold opacity-70">{t.name}</div>
              <div className="mt-6 flex items-baseline gap-2">
                <span className="font-display text-7xl">${yearly ? t.price.yearly : t.price.monthly}</span>
              </div>
              <div className="text-sm opacity-70 mt-2">{t.unit}</div>
              <p className="mt-6 opacity-80">{t.blurb}</p>
              <Link
                to={t.name === "Enterprise" ? "/sign-up" : "/sign-up"}
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
              <ul className="mt-10 space-y-3">
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

      {/* Comparison */}
      <section className="px-3 sm:px-6 py-16">
        <div className="max-w-6xl mx-auto bg-muted rounded-[32px] p-8 sm:p-12">
          <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight">Compare features</h2>
          <div className="mt-10 overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-base">
              <thead>
                <tr className="text-muted-foreground">
                  <th className="py-4 pr-4 font-medium">Feature</th>
                  <th className="py-4 px-4 font-semibold text-foreground">Starter</th>
                  <th className="py-4 px-4 font-semibold text-foreground">Growth</th>
                  <th className="py-4 px-4 font-semibold text-foreground">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  ["PMS + Front Desk", true, true, true],
                  ["Channel manager", true, true, true],
                  ["Housekeeping", true, true, true],
                  ["AI dynamic pricing", false, true, true],
                  ["AI concierge", "Email only", "All channels", "All channels + voice"],
                  ["Accounting + Payroll", false, true, true],
                  ["Multi-property HQ", false, false, true],
                  ["SSO / SAML", false, false, true],
                  ["Dedicated success manager", false, false, true],
                  ["Support", "Email", "Priority", "24/7 phone + SLA"],
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="py-4 pr-4">{row[0] as string}</td>
                    {row.slice(1).map((v, j) => (
                      <td key={j} className="py-4 px-4">
                        {typeof v === "boolean" ? (
                          v ? <Check className="h-5 w-5" /> : <span className="text-muted-foreground">—</span>
                        ) : (
                          <span>{v as string}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-3 sm:px-6 py-6">
        <div className="rounded-[36px] bg-op-orange p-8 sm:p-20 text-center min-h-[50vh] flex flex-col justify-center">
          <h2 className="font-display text-4xl sm:text-7xl text-foreground">
            Try OPERIX free for 14 days
          </h2>
          <p className="mt-6 text-foreground/80">No credit card. Cancel anytime.</p>
          <div className="mt-8 flex flex-wrap gap-3 justify-center">
            <Link to="/sign-up" className="bg-foreground text-background rounded-full px-8 py-4 font-semibold inline-flex items-center gap-2">
              Start free trial <ArrowRight className="h-4 w-4" />
            </Link>
            <a href="#demo" className="bg-white text-foreground rounded-full px-8 py-4 font-semibold">Book a demo</a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
