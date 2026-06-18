import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/maintenance")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Engineering"
      title="Maintenance"
      stats={[
        { label: "Open work orders", value: "27" },
        { label: "Predictive alerts", value: "4", accent: "bg-op-orange/20" },
        { label: "MTTR", value: "3.2h" },
        { label: "Asset uptime", value: "99.1%" },
      ]}
      aiTitle="AC Unit 202 — 83% chance of failure in 15 days"
      aiBody="Vibration & temperature anomalies detected across last 7 days. Schedule preventive service before peak weekend."
      columns={["Asset", "Issue", "Priority", "Assignee", "ETA"]}
      rows={[
        ["AC Unit 202", "Coolant low", "High", "R. Mehta", "Today 4PM"],
        ["Elevator B", "Sensor recalibration", "Medium", "S. Iyer", "Tomorrow"],
        ["Pool pump", "Pressure drop", "Medium", "K. Singh", "Thu"],
        ["Boiler 1", "Annual service", "Low", "D. Kumar", "Next week"],
      ]}
    />
  );
}
