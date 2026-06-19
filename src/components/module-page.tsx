"use client";
import type { ReactNode } from "react";
import { PageHeader, StatCard, AIInsight, SimpleTable, Card } from "@/components/dashboard-shell";

export function ModulePage({
  eyebrow, title, action, stats, aiTitle, aiBody, columns, rows, extra,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
  stats: { label: string; value: string; delta?: string; accent?: string }[];
  aiTitle: string;
  aiBody: string;
  columns: string[];
  rows: (string | ReactNode)[][];
  extra?: ReactNode;
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} action={action} />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SimpleTable columns={columns} rows={rows} />
          {extra}
        </div>
        <AIInsight title={aiTitle} body={aiBody} />
      </div>
    </>
  );
}

export { Card };
