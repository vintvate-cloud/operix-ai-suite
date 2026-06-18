import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/payroll")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="HR & Finance"
      title="Payroll"
      stats={[
        { label: "Monthly run", value: "₹1.84Cr" },
        { label: "Headcount", value: "428" },
        { label: "PF / ESI / TDS", value: "Compliant" },
        { label: "Anomalies", value: "3", accent: "bg-op-orange/20" },
      ]}
      aiTitle="3 payroll anomalies flagged for review"
      aiBody="Two duplicate OT submissions and one mismatched bank account detected before this month's run."
      columns={["Employee", "Gross", "Deductions", "Net", "Status"]}
      rows={[
        ["R. Kapoor", "₹86,400", "₹14,200", "₹72,200", "Ready"],
        ["S. Iyer", "₹52,000", "₹8,400", "₹43,600", "Ready"],
        ["D. Kumar", "₹48,000", "₹7,200", "₹40,800", "Review"],
        ["A. Khan", "₹62,000", "₹9,800", "₹52,200", "Ready"],
      ]}
    />
  );
}
