"use client";

import { useState } from "react";
import { PageHeader, Card } from "@/components/dashboard-shell";
import { Check } from "lucide-react";



const ROLES = [
  {
    name: "Super Admin",
    desc: "Platform owner. Full access across every property, billing, AI usage and analytics.",
    perms: ["All properties", "Subscriptions", "AI quotas", "Billing", "Audit logs"],
  },
  {
    name: "Hotel Owner",
    desc: "Top-line view across owned properties.",
    perms: ["Revenue", "Reports", "Staff", "Finance"],
  },
  {
    name: "General Manager",
    desc: "Day-to-day operations for one property.",
    perms: ["Occupancy", "Complaints", "Staff performance", "All ops modules"],
  },
  {
    name: "Front Desk Manager",
    desc: "Check-in / out, room allocation, guest requests.",
    perms: ["Reservations", "Front desk", "Room assignment"],
  },
  {
    name: "Housekeeping Manager",
    desc: "Cleaning schedules, room status and laundry.",
    perms: ["Housekeeping", "Inventory (linen)"],
  },
  {
    name: "Maintenance Manager",
    desc: "Asset management, work orders, predictive maintenance.",
    perms: ["Maintenance", "Assets", "Vendors"],
  },
  {
    name: "Restaurant Manager",
    desc: "POS, kitchen, F&B inventory and menu.",
    perms: ["POS", "F&B inventory", "Menu"],
  },
  {
    name: "Finance Manager",
    desc: "Accounting, payroll and taxes.",
    perms: ["Finance", "Payroll", "Documents"],
  },
  {
    name: "HR Manager",
    desc: "Workforce records, attendance, recruitment.",
    perms: ["Staff", "Attendance", "Recruitment"],
  },
  {
    name: "Employee",
    desc: "Limited department-scoped access.",
    perms: ["Tasks", "Inbox"],
  },
];

function Page() {
  const [active, setActive] = useState(ROLES[2].name);
  const role = ROLES.find((r) => r.name === active)!;
  return (
    <>
      <PageHeader eyebrow="RBAC" title="Roles & Access" />
      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        <Card className="p-2">
          <div className="space-y-0.5">
            {ROLES.map((r) => (
              <button
                key={r.name}
                onClick={() => setActive(r.name)}
                className={`w-full text-left text-sm rounded-xl px-3 py-2.5 ${
                  r.name === active ? "bg-foreground text-background" : "hover:bg-muted"
                }`}
              >
                {r.name}
              </button>
            ))}
          </div>
        </Card>
        <div className="space-y-6">
          <Card>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Role</div>
            <div className="font-display text-3xl mt-1">{role.name}</div>
            <p className="mt-3 text-foreground/70">{role.desc}</p>
          </Card>
          <Card>
            <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Permissions</div>
            <ul className="grid sm:grid-cols-2 gap-2">
              {role.perms.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm bg-muted rounded-xl px-3 py-2.5">
                  <Check className="h-4 w-4 text-op-purple" /> {p}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}

export default Page;
