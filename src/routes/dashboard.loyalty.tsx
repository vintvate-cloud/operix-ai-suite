import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/loyalty")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Guest retention"
      title="Loyalty"
      stats={[
        { label: "Members", value: "24,182" },
        { label: "Tier upgrades (mo)", value: "412" },
        { label: "Churn risk", value: "138", accent: "bg-op-orange/20" },
        { label: "Points issued", value: "1.4M" },
      ]}
      aiTitle="Retain 138 high-value guests with targeted campaign"
      aiBody="Send weekend stay credit to Platinum members inactive >90 days. Expected revenue lift ₹18.2L."
      columns={["Member", "Tier", "Lifetime spend", "Last stay", "Risk"]}
      rows={[
        ["A. Sharma", "Platinum", "₹6.2L", "84 days", "High"],
        ["M. Khan", "Gold", "₹3.1L", "32 days", "Low"],
        ["R. Pillai", "Platinum", "₹8.4L", "112 days", "High"],
        ["J. Verma", "Silver", "₹1.4L", "8 days", "Low"],
      ]}
    />
  );
}
