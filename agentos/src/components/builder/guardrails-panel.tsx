"use client";

import { useState } from "react";
import { useGuardrailsStore } from "@/store/guardrails-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { GuardrailEditor } from "./guardrail-editor";
import { GuardrailType, GuardrailSeverity } from "@/lib/types";
import { Shield, Plus } from "lucide-react";

const typeLabels: Record<GuardrailType, string> = {
  identity_verification: "Identity Verification",
  spending_limit: "Spending Limit",
  compliance: "Compliance",
  pii_protection: "PII Protection",
};

const severityVariants: Record<GuardrailSeverity, "default" | "destructive"> = {
  warn: "default",
  block: "destructive",
};

interface GuardrailsPanelProps {
  selectedAopId?: string;
}

export function GuardrailsPanel({ selectedAopId }: GuardrailsPanelProps) {
  const { guardrails, toggleGuardrail } = useGuardrailsStore();
  const [showEditor, setShowEditor] = useState(false);

  const filtered = selectedAopId
    ? guardrails.filter((g) => g.assignedAopIds.includes(selectedAopId))
    : guardrails;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-1.5">
            <Shield className="h-4 w-4" />
            Guardrails
            {selectedAopId && (
              <Badge variant="outline" className="text-[10px] ml-1">
                {filtered.length} active
              </Badge>
            )}
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            className="h-7 gap-1"
            onClick={() => setShowEditor(true)}
          >
            <Plus className="h-3 w-3" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {filtered.length === 0 ? (
          <p className="text-xs text-muted-foreground">No guardrails assigned</p>
        ) : (
          filtered.map((g) => (
            <div
              key={g.id}
              className="flex items-center justify-between rounded-md border p-2"
            >
              <div className="flex-1 min-w-0 mr-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium truncate">{g.name}</span>
                  <Badge variant={severityVariants[g.severity]} className="text-[10px]">
                    {g.severity}
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground truncate mt-0.5">
                  {typeLabels[g.type]} — {g.description}
                </p>
              </div>
              <Switch
                checked={g.enabled}
                onCheckedChange={() => toggleGuardrail(g.id)}
              />
            </div>
          ))
        )}
      </CardContent>

      {showEditor && (
        <GuardrailEditor
          open={showEditor}
          onOpenChange={setShowEditor}
          preAssignAopId={selectedAopId}
        />
      )}
    </Card>
  );
}
