"use client";

import { useSuggestionsStore } from "@/store/suggestions-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const CLUSTER_COLORS: Record<string, string> = {
  "Billing & Payments": "#4f87f7",
  "Technical & API": "#7c5fcf",
  "Account Management": "#12a594",
};

export function TopicClusters() {
  const suggestions = useSuggestionsStore((s) => s.suggestions);

  const clusters: Record<string, { count: number; avgGap: number; topics: string[] }> = {};

  suggestions.forEach((s) => {
    if (!clusters[s.cluster]) {
      clusters[s.cluster] = { count: 0, avgGap: 0, topics: [] };
    }
    clusters[s.cluster].count += 1;
    clusters[s.cluster].avgGap += s.coverageGap;
    if (!clusters[s.cluster].topics.includes(s.topic)) {
      clusters[s.cluster].topics.push(s.topic);
    }
  });

  Object.keys(clusters).forEach((key) => {
    clusters[key].avgGap = Math.round(clusters[key].avgGap / clusters[key].count);
  });

  const sorted = Object.entries(clusters).sort(([, a], [, b]) => b.avgGap - a.avgGap);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Topic Clusters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-3">
          {sorted.map(([clusterName, data]) => {
            const color = CLUSTER_COLORS[clusterName] || "#6950a1";
            return (
              <div
                key={clusterName}
                className="rounded-lg border border-border p-3 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{clusterName}</span>
                  <Badge variant="outline">{data.count} suggestion{data.count !== 1 ? "s" : ""}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  {data.topics.map((topic) => (
                    <span key={topic} className="text-xs text-muted-foreground">
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Avg. Coverage Gap</span>
                    <span className="font-semibold text-orange-600">{data.avgGap}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{
                        width: `${data.avgGap}%`,
                        backgroundColor: color,
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
