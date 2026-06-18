import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/inventory")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Stock"
      title="Inventory"
      stats={[
        { label: "SKUs tracked", value: "1,284" },
        { label: "Low stock", value: "18", accent: "bg-op-orange/20" },
        { label: "Wastage (mo)", value: "2.3%" },
        { label: "Stock value", value: "₹14.2L" },
      ]}
      aiTitle="Reorder linen for 96-room property in 4 days"
      aiBody="Consumption forecast based on next week's occupancy and laundry cycle. Auto-PO drafted to vendor Sterling Textiles."
      columns={["Item", "Category", "On hand", "Reorder", "Vendor"]}
      rows={[
        ["King bed sheets", "Linen", "182", "150", "Sterling Textiles"],
        ["Toiletries kit", "Amenities", "420", "300", "Aromas Co."],
        ["Olive oil 5L", "Kitchen", "12", "8", "Mediterra"],
        ["Mineral water 1L", "F&B", "640", "500", "AquaPure"],
      ]}
    />
  );
}
