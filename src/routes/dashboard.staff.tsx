import { createFileRoute } from "@tanstack/react-router";
import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/dashboard/staff")({ component: Page });

function Page() {
  return (
    <ModulePage
      eyebrow="Workforce"
      title="Staff"
      stats={[
        { label: "Employees", value: "428" },
        { label: "Open roles", value: "12" },
        { label: "Avg tenure", value: "3.4y" },
        { label: "eNPS", value: "+42" },
      ]}
      aiTitle="Add 6 housekeepers for weekend forecast"
      aiBody="Predicted 92% occupancy Sat–Sun exceeds current staffing ratio. Draft shift roster generated."
      columns={["Name", "Department", "Role", "Shift", "Status"]}
      rows={[
        ["R. Kapoor", "Front Desk", "Manager", "Morning", "On duty"],
        ["S. Iyer", "Housekeeping", "Supervisor", "Evening", "On duty"],
        ["D. Kumar", "Engineering", "Technician", "Night", "Off"],
        ["A. Khan", "F&B", "Sous Chef", "Split", "On duty"],
      ]}
    />
  );
}
