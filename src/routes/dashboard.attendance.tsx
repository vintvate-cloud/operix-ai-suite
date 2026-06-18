import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/attendance")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Workforce"
      title="Attendance"
      stats={[
        { label: "Present today", value: "402 / 428" },
        { label: "Late arrivals", value: "9" },
        { label: "Absence rate", value: "6.1%", accent: "bg-op-orange/20" },
        { label: "OT hours (wk)", value: "184" },
      ]}
      aiTitle="Absenteeism likely to spike Friday"
      aiBody="Based on last 8 weeks, F&B absenteeism rises 18% on long weekends. Pre-approve standby shifts."
      columns={["Employee", "Dept", "In", "Out", "Status"]}
      rows={[
        ["R. Kapoor", "Front Desk", "08:02", "—", "Present"],
        ["S. Iyer", "Housekeeping", "14:11", "—", "Present"],
        ["A. Khan", "F&B", "—", "—", "Absent"],
        ["D. Kumar", "Engg.", "21:58", "—", "Present"],
      ]}
    />
  );
}
