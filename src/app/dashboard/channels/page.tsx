"use client";

import { ModulePage } from "@/components/module-page";



function Page() {
  return (
    <ModulePage
      eyebrow="Distribution"
      title="Channel Manager"
      stats={[
        { label: "Connected OTAs", value: "12", delta: "+2 this month" },
        { label: "Inventory synced", value: "100%", accent: "bg-op-purple/20" },
        { label: "Parity score", value: "98.4" },
        { label: "Bookings (24h)", value: "184", delta: "+12%" },
      ]}
      aiTitle="Rate parity drift detected on Booking.com"
      aiBody="3 room types are priced 4–6% below Expedia. Auto-sync corrected pricing to restore parity."
      columns={["Channel", "Status", "ADR", "Bookings", "Last sync"]}
      rows={[
        ["Booking.com", "Live", "₹6,420", "82", "2 min ago"],
        ["Airbnb", "Live", "₹7,100", "31", "5 min ago"],
        ["Expedia", "Live", "₹6,690", "44", "1 min ago"],
        ["Agoda", "Live", "₹6,300", "27", "3 min ago"],
        ["MakeMyTrip", "Paused", "—", "—", "1d ago"],
      ]}
    />
  );
}

export default Page;
