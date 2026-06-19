"use client";
import { useState } from "react";
import { PageHeader } from "@/components/dashboard-shell";
import { Database, Plus, X } from "lucide-react";

export default function Page() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <PageHeader
        eyebrow="Operations"
        title="Payroll Runs"
        action={
          <button onClick={() => setIsOpen(true)} className="bg-foreground text-background rounded-full px-5 py-2.5 text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90 transition">
            <Plus className="h-4 w-4" /> Add New
          </button>
        }
      />
      <div className="flex-1 flex items-center justify-center min-h-[500px]">
        <div className="bg-card border border-border rounded-3xl p-12 text-center max-w-md w-full shadow-sm">
          <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
            <Database className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-2xl mb-2">No payroll runs found</h3>
          <p className="text-muted-foreground text-sm mb-8">
            There is currently no data in this module. Connect your database or add a new entry to get started.
          </p>
          <button onClick={() => setIsOpen(true)} className="bg-foreground text-background w-full rounded-xl py-3 font-semibold hover:opacity-90 transition">
            Create first entry
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-background border border-border rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-xl">New Payroll Runs Entry</h3>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-full transition">
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-muted-foreground text-sm mb-6">
              This module is currently in development. You will be able to define custom data schemas and workflows for Payroll Runs here soon!
            </p>
            <div className="flex justify-end">
              <button onClick={() => setIsOpen(false)} className="bg-op-purple text-foreground px-6 py-2.5 rounded-xl font-semibold hover:opacity-90 transition">
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
