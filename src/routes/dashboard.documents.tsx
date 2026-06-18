import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/documents")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Vault"
      title="Documents"
      stats={[
        { label: "Files", value: "12,418" },
        { label: "OCR processed", value: "98%" },
        { label: "Expiring (30d)", value: "6", accent: "bg-op-orange/20" },
        { label: "Storage", value: "184GB" },
      ]}
      aiTitle="2 licenses expire in the next 14 days"
      aiBody="Liquor license and elevator certification auto-flagged. Renewal drafts prepared."
      columns={["Document", "Type", "Owner", "Expires", "Status"]}
      rows={[
        ["Liquor license", "License", "Compliance", "Jul 02", "Renewing"],
        ["Vendor MSA #214", "Contract", "Procurement", "—", "Active"],
        ["GST filings Q1", "Tax", "Finance", "—", "Filed"],
        ["Lift certificate", "License", "Engineering", "Jul 09", "Action"],
      ]}
    />
  );
}
