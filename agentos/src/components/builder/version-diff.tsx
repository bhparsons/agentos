"use client";

import { AOPVersion, AOPStep } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitCompareArrows } from "lucide-react";

interface VersionDiffProps {
  leftVersion: AOPVersion;
  rightVersion: AOPVersion;
}

type DiffStatus = "added" | "removed" | "changed" | "unchanged";

interface DiffRow {
  left?: AOPStep;
  right?: AOPStep;
  status: DiffStatus;
}

function computeDiff(leftSteps: AOPStep[], rightSteps: AOPStep[]): DiffRow[] {
  const rows: DiffRow[] = [];
  const maxLen = Math.max(leftSteps.length, rightSteps.length);

  // Build a map of right-side steps by id for matching
  const rightById = new Map(rightSteps.map((s) => [s.id, s]));
  const matchedRightIds = new Set<string>();

  // First pass: match left steps to right steps by id
  for (const leftStep of leftSteps) {
    const rightMatch = rightById.get(leftStep.id);
    if (rightMatch) {
      matchedRightIds.add(rightMatch.id);
      const changed =
        leftStep.type !== rightMatch.type ||
        leftStep.instruction !== rightMatch.instruction;
      rows.push({
        left: leftStep,
        right: rightMatch,
        status: changed ? "changed" : "unchanged",
      });
    } else {
      rows.push({ left: leftStep, status: "removed" });
    }
  }

  // Second pass: find right steps not matched (added)
  for (const rightStep of rightSteps) {
    if (!matchedRightIds.has(rightStep.id)) {
      rows.push({ right: rightStep, status: "added" });
    }
  }

  // If no id matches at all, fall back to positional comparison
  if (leftSteps.length > 0 && rightSteps.length > 0 && matchedRightIds.size === 0) {
    rows.length = 0;
    for (let i = 0; i < maxLen; i++) {
      const l = leftSteps[i];
      const r = rightSteps[i];
      if (l && r) {
        const changed = l.type !== r.type || l.instruction !== r.instruction;
        rows.push({ left: l, right: r, status: changed ? "changed" : "unchanged" });
      } else if (l) {
        rows.push({ left: l, status: "removed" });
      } else if (r) {
        rows.push({ right: r, status: "added" });
      }
    }
  }

  return rows;
}

const statusBg: Record<DiffStatus, string> = {
  added: "bg-green-50 dark:bg-green-950/30",
  removed: "bg-red-50 dark:bg-red-950/30",
  changed: "bg-yellow-50 dark:bg-yellow-950/30",
  unchanged: "",
};

const statusLabel: Record<DiffStatus, string> = {
  added: "Added",
  removed: "Removed",
  changed: "Changed",
  unchanged: "Unchanged",
};

const statusBadgeColor: Record<DiffStatus, string> = {
  added: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  removed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  changed: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
  unchanged: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

function StepCell({ step }: { step?: AOPStep }) {
  if (!step) {
    return (
      <div className="flex-1 p-3 text-sm text-muted-foreground italic">
        (no step)
      </div>
    );
  }
  return (
    <div className="flex-1 p-3 space-y-1">
      <Badge variant="outline" className="text-[10px]">
        {step.type}
      </Badge>
      <p className="text-sm">{step.instruction}</p>
    </div>
  );
}

export function VersionDiff({ leftVersion, rightVersion }: VersionDiffProps) {
  const diffRows = computeDiff(leftVersion.steps, rightVersion.steps);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <GitCompareArrows className="h-4 w-4" />
          Version Comparison
        </CardTitle>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span>
            Left: v{leftVersion.version} &mdash; {leftVersion.label}
          </span>
          <span>
            Right: v{rightVersion.version} &mdash; {rightVersion.label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {/* Legend */}
        <div className="flex items-center gap-3 mb-3">
          {(["added", "removed", "changed", "unchanged"] as DiffStatus[]).map(
            (s) => (
              <div key={s} className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-sm ${statusBadgeColor[s]}`}
                />
                <span className="text-[10px] text-muted-foreground">
                  {statusLabel[s]}
                </span>
              </div>
            )
          )}
        </div>

        {diffRows.map((row, idx) => (
          <div
            key={idx}
            className={`flex rounded-md border ${statusBg[row.status]}`}
          >
            <StepCell step={row.left} />
            <div className="flex flex-col items-center justify-center px-2 border-x">
              <Badge className={`text-[10px] ${statusBadgeColor[row.status]}`}>
                {statusLabel[row.status]}
              </Badge>
            </div>
            <StepCell step={row.right} />
          </div>
        ))}

        {diffRows.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Both versions are identical.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
