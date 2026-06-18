import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/procurement")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Supply"
      title="Procurement"
      stats={[
        { label: "Active POs", value: "42" },
        { label: "Pending approvals", value: "7" },
        { label: "Vendors", value: "138" },
        { label: "Spend (MTD)", value: "₹38.4L" },
      ]}
      aiTitle="Price anomaly on bulk rice from Vendor #214"
      aiBody="Last invoice priced 11% above 90-day average and 7% above the market median. Flagged for review."
      columns={["PO #", "Vendor", "Items", "Amount", "Status"]}
      rows={[
        ["PO-10241", "Sterling Textiles", "12", "₹2.1L", "Approved"],
        ["PO-10242", "AquaPure", "3", "₹38,200", "Pending"],
        ["PO-10243", "Mediterra", "8", "₹1.4L", "Approved"],
        ["PO-10244", "Vendor #214", "2", "₹86,400", "Flagged"],
      ]}
    />
  );
}
