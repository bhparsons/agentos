"use client";

import { useAgentStore } from "@/store/agent-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { History, RotateCcw } from "lucide-react";

export function VersionHistory() {
  const { aopVersions, selectedAgentId, rollbackToVersion, getSelectedAgent } = useAgentStore();
  const agent = getSelectedAgent();
  const aopId = agent?.aops[0]?.id;

  if (!aopId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="h-4 w-4" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">No AOP selected.</p>
        </CardContent>
      </Card>
    );
  }

  const versions = aopVersions
    .filter((v) => v.aopId === aopId && v.agentId === selectedAgentId)
    .sort((a, b) => b.version - a.version);

  const handleRollback = (versionId: string, versionLabel: string) => {
    rollbackToVersion(selectedAgentId, aopId, versionId);
    toast.success(`Rolled back to "${versionLabel}"`);
  };

  if (versions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="h-4 w-4" />
            Version History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No versions saved yet. Versions are created automatically on deploy.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <History className="h-4 w-4" />
          Version History
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {versions.map((version, idx) => (
          <div
            key={version.id}
            className="flex items-center justify-between rounded-md border p-3"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">v{version.version}</span>
                <Badge variant="outline" className="text-[10px]">
                  {version.label}
                </Badge>
                {version.deployedAt && (
                  <Badge className="text-[10px] bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                    Deployed
                  </Badge>
                )}
                {idx === 0 && (
                  <Badge className="text-[10px] bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                    Latest
                  </Badge>
                )}
              </div>
              <span className="text-xs text-muted-foreground">
                {new Date(version.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="text-xs text-muted-foreground">
                {version.steps.length} step{version.steps.length !== 1 ? "s" : ""}
              </span>
            </div>
            {idx > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleRollback(version.id, version.label)}
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                Rollback
              </Button>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
