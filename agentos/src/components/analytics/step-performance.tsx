"use client";

import { useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { StepPerformance as StepPerformanceType } from "@/data/mock-aop-analytics";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

const stepTypeBadgeVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  respond: "default",
  check_condition: "secondary",
  escalate: "destructive",
  action: "outline",
  collect_info: "secondary",
};

interface StepPerformanceProps {
  aopName: string;
  steps: StepPerformanceType[];
}

export function StepPerformance({ aopName, steps }: StepPerformanceProps) {
  const hydrated = useHydrated();

  const chartData = steps.map((s, i) => ({
    name: `Step ${i + 1}`,
    escalationRate: s.escalationRate,
    dropoffRate: s.dropoffRate,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">
          Step Performance — {aopName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {hydrated && (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <YAxis tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }} />
              <Bar dataKey="escalationRate" name="Escalation %" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="dropoffRate" name="Drop-off %" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}

        <div className="space-y-2">
          {steps.map((step, i) => (
            <div key={step.stepId} className="flex items-start gap-3 rounded-md border p-2">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant={stepTypeBadgeVariant[step.stepType] || "outline"} className="text-[10px]">
                    {step.stepType}
                  </Badge>
                  <span className="text-xs truncate">{step.instruction}</span>
                </div>
                <div className="flex gap-4 text-[10px] text-muted-foreground">
                  <span>{step.executionCount} executions</span>
                  <span>~{step.avgDuration}s avg</span>
                  <span className={step.escalationRate > 5 ? "text-red-500" : ""}>
                    {step.escalationRate}% escalation
                  </span>
                  <span className={step.dropoffRate > 5 ? "text-amber-500" : ""}>
                    {step.dropoffRate}% drop-off
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
