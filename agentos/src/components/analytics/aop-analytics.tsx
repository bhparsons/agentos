"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { aopAnalyticsData } from "@/data/mock-aop-analytics";
import { StepPerformance } from "./step-performance";

export function AOPAnalytics() {
  const [selectedAopId, setSelectedAopId] = useState<string | null>(null);
  const selectedAop = aopAnalyticsData.find((a) => a.aopId === selectedAopId);

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">AOP-Level Breakdown</h3>
      <div className="grid gap-3 md:grid-cols-2">
        {aopAnalyticsData.map((aop) => (
          <Card
            key={aop.aopId}
            className={`cursor-pointer transition-colors hover:bg-accent/50 ${
              selectedAopId === aop.aopId ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedAopId(aop.aopId === selectedAopId ? null : aop.aopId)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{aop.aopName}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Conversations</span>
                  <span className="font-medium">{aop.totalConversations}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Deflection</span>
                  <span className="font-medium">{aop.deflectionRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CSAT</span>
                  <span className="font-medium">{aop.avgCsat}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Escalation</span>
                  <span className={`font-medium ${aop.escalationRate > 10 ? "text-red-500" : ""}`}>
                    {aop.escalationRate}%
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <span>Avg handle: {Math.floor(aop.avgHandleTime / 60)}m {aop.avgHandleTime % 60}s</span>
                <span>·</span>
                <span>{aop.stepPerformance.length} steps</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedAop && (
        <StepPerformance
          aopName={selectedAop.aopName}
          steps={selectedAop.stepPerformance}
        />
      )}
    </div>
  );
}
