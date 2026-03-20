"use client";

import { GuardrailsPanel } from "@/components/builder/guardrails-panel";

export default function RulesPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Define rules and guardrails that govern agent behavior across all AOPs.
      </p>
      <GuardrailsPanel />
    </div>
  );
}
