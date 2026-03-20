"use client";

import { AgentIdentityPanel } from "@/components/identity/agent-identity-panel";

export default function IdentityPage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Configure your agent's brand identity, tone, and universal guardrails.
      </p>
      <AgentIdentityPanel />
    </div>
  );
}
