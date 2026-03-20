"use client";

import { useExperimentsStore } from "@/store/experiments-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ResultsChart } from "./results-chart";
import { ExperimentStatus } from "@/lib/types";
import { toast } from "sonner";
import { Play, Square, RotateCcw } from "lucide-react";

const statusLabels: Record<ExperimentStatus, string> = {
  draft: "Draft",
  active: "Active",
  completed: "Completed",
  rolled_back: "Rolled Back",
};

export function ExperimentDetail() {
  const { experiments, selectedExperimentId, updateStatus } = useExperimentsStore();
  const experiment = experiments.find((e) => e.id === selectedExperimentId);

  if (!experiment) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select an experiment to view details
      </div>
    );
  }

  const handleStart = () => {
    updateStatus(experiment.id, "active");
    toast.success(`Experiment "${experiment.name}" started`);
  };

  const handleStop = () => {
    updateStatus(experiment.id, "completed");
    toast.success(`Experiment "${experiment.name}" completed`);
  };

  const handleRollback = () => {
    updateStatus(experiment.id, "rolled_back");
    toast.warning(`Experiment "${experiment.name}" rolled back`);
  };

  return (
    <div className="space-y-4 overflow-auto">
      <div>
        <h2 className="text-lg font-semibold">{experiment.name}</h2>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline">{statusLabels[experiment.status]}</Badge>
          <span className="text-xs text-muted-foreground">
            {experiment.trafficSplit}% traffic split
          </span>
          {experiment.autoRollbackThreshold && (
            <span className="text-xs text-muted-foreground">
              Auto-rollback below {experiment.autoRollbackThreshold} CSAT
            </span>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Hypothesis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{experiment.hypothesis}</p>
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{experiment.description}</p>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-medium">Metrics:</span>
        {experiment.metrics.map((m) => (
          <Badge key={m} variant="secondary" className="text-[10px]">
            {m}
          </Badge>
        ))}
      </div>

      <div className="flex gap-2">
        {experiment.status === "draft" && (
          <Button size="sm" onClick={handleStart} className="gap-1">
            <Play className="h-3.5 w-3.5" />
            Start Experiment
          </Button>
        )}
        {experiment.status === "active" && (
          <>
            <Button size="sm" variant="outline" onClick={handleStop} className="gap-1">
              <Square className="h-3.5 w-3.5" />
              Complete
            </Button>
            <Button size="sm" variant="destructive" onClick={handleRollback} className="gap-1">
              <RotateCcw className="h-3.5 w-3.5" />
              Roll Back
            </Button>
          </>
        )}
      </div>

      {experiment.results && (
        <>
          <Separator />
          <ResultsChart results={experiment.results} />
        </>
      )}

      {experiment.linkedQueueItemId && (
        <div className="text-xs text-muted-foreground">
          Linked Queue Item: <span className="font-mono">{experiment.linkedQueueItemId}</span>
        </div>
      )}

      <div className="text-xs text-muted-foreground space-y-0.5">
        <div>Created: {new Date(experiment.createdAt).toLocaleDateString()}</div>
        {experiment.startedAt && (
          <div>Started: {new Date(experiment.startedAt).toLocaleDateString()}</div>
        )}
        {experiment.completedAt && (
          <div>Completed: {new Date(experiment.completedAt).toLocaleDateString()}</div>
        )}
      </div>
    </div>
  );
}
