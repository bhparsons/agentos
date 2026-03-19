"use client";

import { useTestingStore, getEvaluationForPersona } from "@/store/testing-store";
import { testPersonas } from "@/data/mock-personas";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ClipboardCheck } from "lucide-react";
import { useState } from "react";

const criteria = [
  { key: "greeting" as const, label: "Appropriate Greeting" },
  { key: "issueIdentification" as const, label: "Issue Identification" },
  { key: "aopAdherence" as const, label: "AOP Adherence" },
  { key: "accuracy" as const, label: "Response Accuracy" },
  { key: "resolution" as const, label: "Issue Resolution" },
];

export function TestResults() {
  const { selectedPersonaId, messages, evaluationResult, hasEvaluated, setEvaluationResult } =
    useTestingStore();
  const [evaluating, setEvaluating] = useState(false);

  const persona = testPersonas.find((p) => p.id === selectedPersonaId);

  const handleEvaluate = () => {
    if (!persona) return;
    setEvaluating(true);
    setTimeout(() => {
      setEvaluationResult(getEvaluationForPersona(persona));
      setEvaluating(false);
    }, 1500);
  };

  if (!selectedPersonaId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-xs text-muted-foreground">
          Results will appear after running an evaluation.
        </p>
      </div>
    );
  }

  const passCount = evaluationResult
    ? criteria.filter((c) => evaluationResult[c.key]).length
    : 0;
  const totalCount = criteria.length;

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Evaluation Results
      </h3>

      {messages.length >= 3 && !hasEvaluated && (
        <Button
          onClick={handleEvaluate}
          disabled={evaluating}
          className="w-full"
          size="sm"
        >
          <ClipboardCheck className="h-3 w-3 mr-1" />
          {evaluating ? "Evaluating..." : "Run Evaluation"}
        </Button>
      )}

      {messages.length < 3 && !hasEvaluated && (
        <p className="text-xs text-muted-foreground">
          Continue the conversation (3+ messages) to enable evaluation.
        </p>
      )}

      {evaluationResult && (
        <>
          <div className="flex items-center justify-between">
            <Badge
              variant={passCount >= 4 ? "default" : "secondary"}
              className="text-xs"
            >
              {passCount >= 4 ? "Pass" : "Needs Improvement"}
            </Badge>
            <span className="text-sm font-medium">
              {passCount}/{totalCount}
            </span>
          </div>

          <div className="space-y-2">
            {criteria.map((c) => {
              const passed = evaluationResult[c.key];
              return (
                <div
                  key={c.key}
                  className="flex items-center justify-between rounded-md border p-2.5"
                >
                  <span className="text-sm">{c.label}</span>
                  {passed ? (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-500" />
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
