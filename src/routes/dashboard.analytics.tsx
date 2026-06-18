import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/analytics")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Business Intelligence"
      title="Analytics"
      stats={[
        { label: "Occupancy", value: "82%" },
        { label: "ADR", value: "₹6,420" },
        { label: "RevPAR", value: "₹5,260", accent: "bg-op-purple/20" },
        { label: "GOPPAR", value: "₹2,140" },
      ]}
      aiTitle="Why did revenue drop last week?"
      aiBody="Drop driven by 6.2% ADR decline on Wed–Thu, caused by competitor flash sale. F&B revenue offset 41% of the gap."
      columns={["KPI", "This week", "Last week", "Δ", "Trend"]}
      rows={[
        ["Occupancy", "82%", "78%", "+4 pts", "▲"],
        ["ADR", "₹6,420", "₹6,840", "−6.2%", "▼"],
        ["RevPAR", "₹5,260", "₹5,330", "−1.3%", "▼"],
        ["F&B revenue", "₹1.1Cr", "₹0.78Cr", "+41%", "▲"],
      ]}
    />
  );
}
