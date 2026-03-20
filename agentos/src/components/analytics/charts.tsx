"use client";

import { useState, useSyncExternalStore } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dailyMetrics } from "@/data/mock-analytics";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COLORS = {
  blue: "#5754FF",
  violet: "#7C6AFF",
  indigo: "#5B5BD6",
  purple: "#5754FF",
  teal: "#12A594",
  cyan: "#4EEBF3",
};

const emptySubscribe = () => () => {};
function useHydrated() {
  return useSyncExternalStore(emptySubscribe, () => true, () => false);
}

export function VolumeChart() {
  const [range, setRange] = useState<"7" | "14" | "30">("30");
  const data = dailyMetrics.slice(-Number(range));
  const hydrated = useHydrated();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Conversation Volume</CardTitle>
        <Tabs value={range} onValueChange={(v) => setRange(v as "7" | "14" | "30")}>
          <TabsList className="h-7">
            <TabsTrigger value="7" className="text-xs px-2 h-5">7d</TabsTrigger>
            <TabsTrigger value="14" className="text-xs px-2 h-5">14d</TabsTrigger>
            <TabsTrigger value="30" className="text-xs px-2 h-5">30d</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        {hydrated && (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorConv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" })}
                tick={{ fontSize: 11 }}
                stroke="#a1a1aa"
              />
              <YAxis tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #d4d0f0" }}
                labelFormatter={(d) => new Date(d).toLocaleDateString("en", { weekday: "short", month: "short", day: "numeric" })}
              />
              <Area
                type="monotone"
                dataKey="conversations"
                stroke={COLORS.blue}
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorConv)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function CsatDeflectionChart() {
  const data = dailyMetrics.slice(-30);
  const hydrated = useHydrated();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">CSAT & Deflection Rate</CardTitle>
      </CardHeader>
      <CardContent>
        {hydrated && (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis
                dataKey="date"
                tickFormatter={(d) => new Date(d).toLocaleDateString("en", { month: "short", day: "numeric" })}
                tick={{ fontSize: 11 }}
                stroke="#a1a1aa"
              />
              <YAxis yAxisId="left" domain={[3, 5]} tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <YAxis yAxisId="right" orientation="right" domain={[60, 100]} tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #d4d0f0" }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="avgCsat"
                name="CSAT"
                stroke={COLORS.violet}
                strokeWidth={2}
                dot={false}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="deflectionRate"
                name="Deflection %"
                stroke={COLORS.teal}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export function TopicBreakdownChart() {
  const recent = dailyMetrics.slice(-7);
  const topicTotals: Record<string, number> = {};
  recent.forEach((m) => {
    Object.entries(m.topics).forEach(([topic, count]) => {
      topicTotals[topic] = (topicTotals[topic] || 0) + count;
    });
  });

  const data = Object.entries(topicTotals)
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count);

  const hydrated = useHydrated();

  return (
    <Card className="col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Topics (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {hydrated && (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#e4e4e7" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <YAxis dataKey="topic" type="category" width={100} tick={{ fontSize: 11 }} stroke="#a1a1aa" />
              <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #d4d0f0" }} />
              <Bar dataKey="count" fill={COLORS.indigo} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
