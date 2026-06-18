import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/events")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Banquets & Conferences"
      title="Events"
      stats={[
        { label: "Upcoming", value: "12" },
        { label: "Revenue forecast", value: "₹86L" },
        { label: "Halls available", value: "3 / 6" },
        { label: "Avg deal size", value: "₹7.2L" },
      ]}
      aiTitle="Optimal layout for Sharma wedding on Aug 12"
      aiBody="Recommended capacity 320 in Grand Ballroom with 14% margin uplift via plated dinner vs buffet."
      columns={["Event", "Client", "Date", "Hall", "Status"]}
      rows={[
        ["Wedding", "Sharma", "Aug 12", "Grand", "Confirmed"],
        ["Conference", "Infosys", "Aug 18", "Atrium", "Confirmed"],
        ["Product launch", "Zerodha", "Aug 22", "Skyline", "Quote sent"],
        ["Reception", "Patel", "Sep 04", "Garden", "Hold"],
      ]}
    />
  );
}
