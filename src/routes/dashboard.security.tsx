import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/security")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Trust"
      title="Security Center"
      stats={[
        { label: "Active sessions", value: "184" },
        { label: "Failed logins (24h)", value: "12" },
        { label: "Alerts", value: "2", accent: "bg-op-orange/20" },
        { label: "Compliance", value: "SOC 2 · ISO 27001" },
      ]}
      aiTitle="Insider threat signal on accounts user-2241"
      aiBody="Bulk export of guest profiles outside normal pattern. Account paused pending review."
      columns={["Event", "Actor", "IP", "Risk", "When"]}
      rows={[
        ["Bulk export", "user-2241", "203.0.113.4", "High", "08:12"],
        ["Login from new device", "user-4012", "198.51.100.7", "Medium", "07:48"],
        ["Permission change", "admin-01", "10.0.1.2", "Low", "07:11"],
        ["Failed login ×6", "user-3318", "203.0.113.9", "Medium", "06:58"],
      ]}
    />
  );
}
