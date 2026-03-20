"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { FlagDashboard } from "@/components/watchtower/flag-dashboard";
import { FlagTable } from "@/components/watchtower/flag-table";
import { RuleEditor } from "@/components/watchtower/rule-editor";
import { useWatchtowerStore } from "@/store/watchtower-store";
import { OperationsFilter, OperationsFilterValues } from "@/components/operations/operations-filter";

const severityColor: Record<string, string> = {
  critical: "destructive",
  high: "default",
  medium: "secondary",
  low: "outline",
};

export default function WatchtowerPage() {
  const rules = useWatchtowerStore((s) => s.rules);
  const toggleRule = useWatchtowerStore((s) => s.toggleRule);
  const [filters, setFilters] = useState<OperationsFilterValues>({
    aopId: null,
    dateFrom: "",
    dateTo: "",
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg font-semibold">Watchtower</h1>
        <p className="text-sm text-muted-foreground">
          Always-on QA monitoring across all conversations
        </p>
      </div>
      <OperationsFilter value={filters} onChange={setFilters} />

      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="rules">Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6 mt-4">
          <FlagDashboard />
          <FlagTable />
        </TabsContent>

        <TabsContent value="rules" className="space-y-6 mt-4">
          <RuleEditor />

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Existing Rules ({rules.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  className="flex items-start justify-between rounded-lg border p-3"
                >
                  <div className="space-y-1 flex-1 mr-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{rule.name}</span>
                      <Badge
                        variant={
                          severityColor[rule.severity] as
                            | "destructive"
                            | "default"
                            | "secondary"
                            | "outline"
                        }
                      >
                        {rule.severity}
                      </Badge>
                      <Badge variant="outline" className="capitalize">
                        {rule.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {rule.description}
                    </p>
                  </div>
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={() => toggleRule(rule.id)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
