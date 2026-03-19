"use client";

import { MetricCards } from "@/components/analytics/metric-cards";
import { VolumeChart, CsatDeflectionChart, TopicBreakdownChart } from "@/components/analytics/charts";
import { ConversationTable } from "@/components/analytics/conversation-table";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <MetricCards />
      <div className="grid gap-4 md:grid-cols-2">
        <VolumeChart />
        <CsatDeflectionChart />
      </div>
      <TopicBreakdownChart />
      <ConversationTable />
    </div>
  );
}
