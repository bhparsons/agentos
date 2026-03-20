"use client";

import { Card, CardContent } from "@/components/ui/card";
import { trajectoryData, trajectoryTargets, shippedFixes } from "@/data/mock-trajectory";
import { TrendingUp, Target, Rocket, ArrowUpRight, ArrowDownRight } from "lucide-react";

export function VelocityCards() {
  const recent7 = trajectoryData.slice(-7);
  const prev7 = trajectoryData.slice(-14, -7);

  const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;

  const recentDeflection = avg(recent7.map((d) => d.deflectionRate));
  const prevDeflection = avg(prev7.map((d) => d.deflectionRate));
  const deflectionSlope = recentDeflection - prevDeflection;

  const recentCsat = avg(recent7.map((d) => d.csat));
  const prevCsat = avg(prev7.map((d) => d.csat));
  const csatSlope = recentCsat - prevCsat;

  const deflectionTarget = trajectoryTargets.find((t) => t.metric === "deflectionRate");
  const csatTarget = trajectoryTargets.find((t) => t.metric === "csat");

  const cards = [
    {
      title: "Deflection Velocity",
      value: `${deflectionSlope > 0 ? "+" : ""}${deflectionSlope.toFixed(1)}pp/wk`,
      positive: deflectionSlope > 0,
      icon: TrendingUp,
    },
    {
      title: "CSAT Velocity",
      value: `${csatSlope > 0 ? "+" : ""}${csatSlope.toFixed(2)}/wk`,
      positive: csatSlope > 0,
      icon: TrendingUp,
    },
    {
      title: "Deflection Gap to Target",
      value: deflectionTarget
        ? `${(deflectionTarget.targetValue - recentDeflection).toFixed(1)}pp`
        : "N/A",
      positive: false,
      icon: Target,
    },
    {
      title: "Fixes Shipped (30d)",
      value: String(shippedFixes.length),
      positive: true,
      icon: Rocket,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <Card key={c.title}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">{c.title}</span>
              <c.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xl font-bold">{c.value}</span>
              {c.positive ? (
                <ArrowUpRight className="h-4 w-4 text-green-600" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-orange-500" />
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
