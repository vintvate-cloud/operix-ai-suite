import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/pos")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Food & Beverage"
      title="Restaurant POS"
      stats={[
        { label: "Open tables", value: "14 / 32" },
        { label: "Avg ticket", value: "₹2,340" },
        { label: "Sales today", value: "₹3.8L", accent: "bg-op-purple/20" },
        { label: "Top dish", value: "Tikka" },
      ]}
      aiTitle="Cut 18% food waste this week with menu rebalancing"
      aiBody="Demand forecast suggests reducing prep of low-velocity items by 22% and adding a chef's special tied to forecast occupancy."
      columns={["Table", "Order", "Items", "Total", "Status"]}
      rows={[
        ["T-04", "#88421", "6", "₹3,420", "Preparing"],
        ["T-11", "#88422", "3", "₹1,640", "Served"],
        ["T-17", "#88423", "9", "₹6,180", "Billing"],
        ["Bar-2", "#88424", "4", "₹2,200", "Open"],
      ]}
    />
  );
}
