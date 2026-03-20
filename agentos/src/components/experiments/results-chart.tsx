"use client";

import { useSyncExternalStore } from "react";
import { ExperimentResults } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ErrorBar,
} from "recharts";

const COLORS = {
  control: "#a1a1aa",
  variant: "#4f87f7",
};

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

interface ResultsChartProps {
  results: ExperimentResults;
}

export function ResultsChart({ results }: ResultsChartProps) {
  const hydrated = useHydrated();

  const chartData = results.metrics.map((m) => ({
    name: m.name,
    Control: m.controlValue,
    Variant: m.variantValue,
  }));

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold">{results.controlSampleSize}</div>
            <div className="text-[10px] text-muted-foreground">Control samples</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <div className="text-lg font-bold">{results.variantSampleSize}</div>
            <div className="text-[10px] text-muted-foreground">Variant samples</div>
          </CardContent>
        </Card>
      </div>

      {hydrated && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Metric Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="#a1a1aa" />
                <YAxis tick={{ fontSize: 11 }} stroke="#a1a1aa" />
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="Control" fill={COLORS.control} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Variant" fill={COLORS.variant} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="space-y-2">
        {results.metrics.map((m) => (
          <div key={m.name} className="flex items-center justify-between rounded-md border p-3">
            <div>
              <p className="text-sm font-medium">{m.name}</p>
              <p className="text-xs text-muted-foreground">
                {m.controlValue} → {m.variantValue}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "text-sm font-medium",
                  m.lift > 0 ? "text-green-600" : m.lift < 0 ? "text-red-500" : ""
                )}
              >
                {m.lift > 0 ? "+" : ""}
                {m.lift.toFixed(1)}%
              </span>
              <Badge variant={m.significant ? "default" : "outline"} className="text-[10px]">
                p={m.pValue.toFixed(3)}
              </Badge>
              {m.significant && (
                <Badge variant="default" className="text-[10px] bg-green-600">
                  Significant
                </Badge>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
