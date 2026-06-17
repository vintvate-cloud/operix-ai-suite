import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard-shell";
import { User, Building2, Bell, CreditCard, Plug, Shield } from "lucide-react";

export const Route = createFileRoute("/dashboard/settings")({
  component: Page,
});

const TABS = [
  { id: "profile", label: "Profile", icon: User },
  { id: "org", label: "Organization", icon: Building2 },
  { id: "notifs", label: "Notifications", icon: Bell },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "integrations", label: "Integrations", icon: Plug },
  { id: "security", label: "Security", icon: Shield },
];

function Page() {
  const [tab, setTab] = useState("profile");
  return (
    <>
      <PageHeader eyebrow="Settings" title="Workspace" />
      <div className="grid lg:grid-cols-[240px_1fr] gap-4">
        <nav className="bg-card border border-border rounded-3xl p-3 h-fit">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition mb-1 ${
                tab === t.id ? "bg-foreground text-background" : "hover:bg-muted"
              }`}
            >
              <t.icon className="h-4 w-4" /> {t.label}
            </button>
          ))}
        </nav>
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-6">
          {tab === "profile" && (
            <>
              <h3 className="font-display text-3xl">Your profile</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Full name" value="Regina Kacajeva" />
                <Field label="Email" value="regina@aurelia.co" />
                <Field label="Role" value="Director of Operations" />
                <Field label="Language" value="English" />
              </div>
            </>
          )}
          {tab === "org" && (
            <>
              <h3 className="font-display text-3xl">Organization</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Workspace" value="Aurelia Resorts" />
                <Field label="Plan" value="Growth · annual" />
                <Field label="Properties" value="6 active" />
                <Field label="Seats" value="34 / 50" />
              </div>
            </>
          )}
          {tab === "notifs" && <Toggles items={["New reservations", "Cancellations", "Negative reviews", "Revenue alerts"]} />}
          {tab === "billing" && (
            <>
              <h3 className="font-display text-3xl">Billing</h3>
              <div className="bg-op-purple rounded-2xl p-5">
                <div className="text-sm">Next invoice · Jul 1, 2026</div>
                <div className="font-display text-4xl mt-2">$4,820</div>
              </div>
              <Field label="Payment method" value="•••• 4242 · Visa" />
            </>
          )}
          {tab === "integrations" && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {["Stripe","QuickBooks","WhatsApp","Booking.com","Airbnb","Expedia","Google Hotels","Xero","Salesforce"].map((n) => (
                <div key={n} className="rounded-2xl bg-muted p-4 flex items-center justify-between">
                  <span className="font-medium">{n}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-op-success/30 text-emerald-700 font-semibold">Connected</span>
                </div>
              ))}
            </div>
          )}
          {tab === "security" && <Toggles items={["Two-factor auth", "SSO (SAML)", "Audit log", "IP allowlist"]} />}
        </div>
      </div>
    </>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-xs text-muted-foreground">{label}</span>
      <input defaultValue={value} className="mt-1 w-full bg-muted rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-foreground/10" />
    </label>
  );
}

function Toggles({ items }: { items: string[] }) {
  return (
    <div className="space-y-3">
      {items.map((i, idx) => (
        <div key={i} className="flex items-center justify-between bg-muted rounded-2xl px-4 py-3">
          <span className="text-sm font-medium">{i}</span>
          <span className={`h-6 w-11 rounded-full ${idx % 2 === 0 ? "bg-foreground" : "bg-muted-foreground/30"} relative transition`}>
            <span className={`absolute top-0.5 ${idx % 2 === 0 ? "right-0.5" : "left-0.5"} h-5 w-5 bg-background rounded-full`} />
          </span>
        </div>
      ))}
    </div>
  );
}
