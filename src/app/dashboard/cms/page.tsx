"use client";

import { ModulePage } from "@/components/module-page";



function Page() {
  return (
    <ModulePage
      eyebrow="Marketing"
      title="Website CMS"
      stats={[
        { label: "Pages", value: "42" },
        { label: "Languages", value: "6" },
        { label: "Conversion", value: "4.8%", accent: "bg-op-purple/20" },
        { label: "Direct bookings", value: "+38%" },
      ]}
      aiTitle="Optimize hero copy for monsoon campaign"
      aiBody="A/B test suggests `Stay dry. Live lush.` outperforms current headline by 22% CTR."
      columns={["Page", "Locale", "Status", "Last edit", "Author"]}
      rows={[
        ["Home", "EN", "Published", "Today", "Marketing"],
        ["Rooms", "EN", "Draft", "Today", "Marketing"],
        ["Spa", "FR", "Published", "Yesterday", "Localization"],
        ["Wedding", "EN", "Scheduled", "Aug 01", "Events"],
      ]}
    />
  );
}

export default Page;
