import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/concierge")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Guest AI"
      title="AI Concierge"
      stats={[
        { label: "Conversations (24h)", value: "1,284" },
        { label: "Resolution rate", value: "92%", accent: "bg-op-purple/20" },
        { label: "Channels", value: "Web · WA · App" },
        { label: "Avg response", value: "1.4s" },
      ]}
      aiTitle="42 guests requested late checkout — auto-approved 31"
      aiBody="Concierge identified low-impact requests against today's occupancy and auto-approved without staff queue."
      columns={["Guest", "Channel", "Intent", "Outcome", "Time"]}
      rows={[
        ["A. Mehta", "WhatsApp", "Late checkout", "Auto-approved", "08:14"],
        ["L. Singh", "Web", "Spa booking", "Booked", "08:21"],
        ["N. Roy", "App", "Room service", "In progress", "08:32"],
        ["P. Das", "WhatsApp", "Airport pickup", "Booked", "08:40"],
      ]}
    />
  );
}
