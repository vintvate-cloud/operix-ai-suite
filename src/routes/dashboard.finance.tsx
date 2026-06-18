import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/finance")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Books"
      title="Finance & Accounting"
      stats={[
        { label: "Revenue (MTD)", value: "₹4.2Cr" },
        { label: "Expenses (MTD)", value: "₹2.6Cr" },
        { label: "Net margin", value: "38%", accent: "bg-op-purple/20" },
        { label: "Cash on hand", value: "₹7.8Cr" },
      ]}
      aiTitle="Cash flow positive through Q3"
      aiBody="Forecast based on confirmed bookings, vendor terms, and seasonal pattern. Suggested CAPEX window opens Sep 15."
      columns={["Account", "Type", "Debit", "Credit", "Balance"]}
      rows={[
        ["Room revenue", "Income", "—", "₹2.8Cr", "₹2.8Cr"],
        ["F&B revenue", "Income", "—", "₹1.1Cr", "₹3.9Cr"],
        ["Payroll", "Expense", "₹1.84Cr", "—", "₹2.06Cr"],
        ["Procurement", "Expense", "₹38L", "—", "₹1.68Cr"],
      ]}
    />
  );
}
