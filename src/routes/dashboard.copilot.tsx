import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Card } from "@/components/dashboard-shell";
import { Send, Sparkles } from "lucide-react";

export const Route = createFileRoute("/dashboard/copilot")({ component: Page });

const SUGGESTIONS = [
  "Show occupancy next week",
  "Why are food costs rising?",
  "Which guests are likely to return?",
  "Which rooms need maintenance?",
  "Create staff schedule for next week",
];

const THREAD = [
  { from: "user", text: "Why did revenue drop last week?" },
  {
    from: "ai",
    text:
      "Revenue declined 1.3% week-over-week. Primary driver: ADR fell 6.2% on Wed–Thu after competitor flash sale. F&B revenue (+41%) offset 41% of the gap. Recommended: counter-pricing rule for Wed–Thu weeks with sub-80% pace.",
  },
];

function Page() {
  return (
    <>
      <PageHeader eyebrow="Operix Intelligence" title="AI Copilot" />
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <Card className="bg-foreground text-background border-transparent space-y-4">
          {THREAD.map((m, i) => (
            <div key={i} className={m.from === "user" ? "text-right" : ""}>
              <div
                className={`inline-block max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                  m.from === "user" ? "bg-op-purple text-foreground" : "bg-white/5 text-background/90"
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
          <div className="flex items-center gap-2 bg-white/5 rounded-full pl-4 pr-1 py-1">
            <input
              placeholder="Ask anything about your hotel…"
              className="flex-1 bg-transparent outline-none text-sm py-2 placeholder:text-background/40"
            />
            <button className="bg-op-purple text-foreground p-2.5 rounded-full">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-2 text-xs text-foreground/60 mb-3">
            <Sparkles className="h-3.5 w-3.5" /> SUGGESTED
          </div>
          <div className="space-y-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} className="w-full text-left text-sm bg-muted hover:bg-muted/70 rounded-xl px-3 py-2.5">
                {s}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
