"use client";

import { Experiment, ExperimentStatus } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FlaskConical, Play, CheckCircle, RotateCcw } from "lucide-react";

const statusConfig: Record<ExperimentStatus, { label: string; variant: "outline" | "secondary" | "default" | "destructive"; icon: typeof FlaskConical }> = {
  draft: { label: "Draft", variant: "outline", icon: FlaskConical },
  active: { label: "Active", variant: "default", icon: Play },
  completed: { label: "Completed", variant: "secondary", icon: CheckCircle },
  rolled_back: { label: "Rolled Back", variant: "destructive", icon: RotateCcw },
};

interface ExperimentCardProps {
  experiment: Experiment;
  isSelected: boolean;
  onSelect: () => void;
}

export function ExperimentCard({ experiment, isSelected, onSelect }: ExperimentCardProps) {
  const config = statusConfig[experiment.status];
  const Icon = config.icon;

  return (
    <Card
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent/50",
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-medium leading-tight">{experiment.name}</p>
          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={config.variant} className="text-[10px]">
            {config.label}
          </Badge>
          <span className="text-[10px] text-muted-foreground">
            {experiment.trafficSplit}% traffic
          </span>
        </div>
        {experiment.results && (
          <div className="text-[10px] text-muted-foreground">
            {experiment.results.controlSampleSize + experiment.results.variantSampleSize} samples
          </div>
        )}
      </CardContent>
    </Card>
  );
}
