"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dailyMetrics } from "@/data/mock-analytics";
import { TrendingUp, TrendingDown, MessageSquare, Shield, Star, Clock } from "lucide-react";

export function MetricCards() {
  const recent = dailyMetrics.slice(-7);
  const previous = dailyMetrics.slice(-14, -7);

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const totalConvos = recent.reduce((a, m) => a + m.conversations, 0);
  const prevConvos = previous.reduce((a, m) => a + m.conversations, 0);
  const deflection = avg(recent.map((m) => m.deflectionRate));
  const prevDeflection = avg(previous.map((m) => m.deflectionRate));
  const csat = avg(recent.map((m) => m.avgCsat));
  const prevCsat = avg(previous.map((m) => m.avgCsat));
  const responseTime = avg(recent.map((m) => m.avgResponseTime));
  const prevResponseTime = avg(previous.map((m) => m.avgResponseTime));

  const metrics = [
    {
      title: "Total Conversations",
      value: totalConvos.toLocaleString(),
      change: ((totalConvos - prevConvos) / prevConvos) * 100,
      icon: MessageSquare,
    },
    {
      title: "Deflection Rate",
      value: `${deflection.toFixed(1)}%`,
      change: deflection - prevDeflection,
      icon: Shield,
    },
    {
      title: "Avg CSAT",
      value: csat.toFixed(2),
      change: ((csat - prevCsat) / prevCsat) * 100,
      icon: Star,
    },
    {
      title: "Avg Response Time",
      value: `${responseTime.toFixed(1)}s`,
      change: ((prevResponseTime - responseTime) / prevResponseTime) * 100,
      icon: Clock,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {metrics.map((m) => {
        const isPositive = m.change >= 0;
        return (
          <Card key={m.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{m.title}</CardTitle>
              <m.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{m.value}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span className={isPositive ? "text-green-600" : "text-red-500"}>
                  {isPositive ? "+" : ""}
                  {m.change.toFixed(1)}%
                </span>
                <span>vs prev 7d</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
