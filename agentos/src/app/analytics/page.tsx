"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MetricCards } from "@/components/analytics/metric-cards";
import { VolumeChart, CsatDeflectionChart, TopicBreakdownChart } from "@/components/analytics/charts";

import { TrajectoryChart } from "@/components/analytics/trajectory-chart";
import { VelocityCards } from "@/components/analytics/velocity-cards";
import { AOPAnalytics } from "@/components/analytics/aop-analytics";
import { OperationsFilter, OperationsFilterValues } from "@/components/operations/operations-filter";

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<OperationsFilterValues>({
    aopId: null,
    dateFrom: "",
    dateTo: "",
  });

  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trajectory">Trajectory</TabsTrigger>
            <TabsTrigger value="aop">AOP Breakdown</TabsTrigger>
          </TabsList>
          <OperationsFilter value={filters} onChange={setFilters} />
        </div>

        <TabsContent value="overview" className="space-y-6">
          <MetricCards />
          <div className="grid gap-4 md:grid-cols-2">
            <VolumeChart />
            <CsatDeflectionChart />
          </div>
          <TopicBreakdownChart />
        </TabsContent>

        <TabsContent value="trajectory" className="space-y-6">
          <VelocityCards />
          <TrajectoryChart />
        </TabsContent>

        <TabsContent value="aop" className="space-y-6">
          <AOPAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
