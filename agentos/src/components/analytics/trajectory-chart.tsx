"use client";

import { useState, useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trajectoryData, shippedFixes, trajectoryTargets } from "@/data/mock-trajectory";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot,
} from "recharts";

const COLORS = {
  blue: "#4f87f7",
  violet: "#7c5fcf",
  teal: "#12a594",
  green: "#16a34a",
};

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

type MetricKey = "deflectionRate" | "csat" | "avgResponseTime";

const metricLabels: Record<MetricKey, string> = {
  deflectionRate: "Deflection Rate (%)",
  csat: "CSAT Score",
  avgResponseTime: "Avg Response Time (s)",
};

export function TrajectoryChart() {
  const [metric, setMetric] = useState<MetricKey>("deflectionRate");
  const hydrated = useHydrated();

  const target = trajectoryTargets.find((t) => t.metric === metric);
  const fixPoints = trajectoryData.filter((d) => d.shippedFixId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Trajectory View</CardTitle>
        <Tabs value={metric} onValueChange={(v) => setMetric(v as MetricKey)}>
          <TabsList className="h-7">
            <TabsTrigger value="deflectionRate" className="text-xs px-2 h-5">Deflection</TabsTrigger>
            <TabsTrigger value="csat" className="text-xs px-2 h-5">CSAT</TabsTrigger>
            <TabsTrigger value="avgResponseTime" className="text-xs px-2 h-5">Response Time</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {hydrated && (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trajectoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) =>
                  new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" })
                }
                tick={{ fontSize: 11 }}
                stroke="#a1a1aa"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e4e4e7" }}
                labelFormatter={(d) =>
                  new Date(d).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })
                }
                formatter={(value, name) => {
                  if (typeof value === "number" && name === metricLabels[metric]) return [value.toFixed(2), name];
                  return [value, name];
                }}
              />
              <Line
                type="monotone"
                dataKey={metric}
                name={metricLabels[metric]}
                stroke={COLORS.blue}
                strokeWidth={2}
                dot={false}
              />
              {target && (
                <ReferenceLine
                  y={target.targetValue}
                  stroke={COLORS.green}
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                  label={{
                    value: `Target: ${target.targetValue}`,
                    position: "right",
                    fill: COLORS.green,
                    fontSize: 10,
                  }}
                />
              )}
              {fixPoints.map((point) => (
                <ReferenceDot
                  key={point.shippedFixId}
                  x={point.date}
                  y={point[metric]}
                  r={5}
                  fill={COLORS.violet}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}

        {shippedFixes.length > 0 && (
          <div className="mt-3 space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Shipped Fixes</p>
            {shippedFixes.map((fix) => (
              <div key={fix.id} className="flex items-center gap-2 text-xs">
                <div className="h-2 w-2 rounded-full bg-violet-500" />
                <span className="text-muted-foreground">{fix.shippedAt}</span>
                <span>{fix.title}</span>
                <Badge variant="outline" className="text-[10px]">{fix.fixType}</Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
