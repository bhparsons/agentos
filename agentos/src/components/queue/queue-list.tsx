"use client";

import { useQueueStore } from "@/store/queue-store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LifecycleStage } from "@/lib/types";
import { AlertTriangle, ArrowUpRight, TrendingDown } from "lucide-react";

const stageLabels: Record<LifecycleStage, string> = {
  identified: "Identified",
  fix_in_progress: "Fix in Progress",
  validating: "Validating",
  shipped: "Shipped",
};

const stageVariants: Record<LifecycleStage, "outline" | "secondary" | "default" | "destructive"> = {
  identified: "destructive",
  fix_in_progress: "secondary",
  validating: "outline",
  shipped: "default",
};

export function QueueList() {
  const { items, selectedItemId, selectItem } = useQueueStore();
  const sorted = [...items].sort((a, b) => b.volume - a.volume);

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground mb-3">
        Impact Queue ({items.length})
      </h3>
      {sorted.map((item) => (
        <Card
          key={item.id}
          className={cn(
            "cursor-pointer transition-colors hover:bg-accent/50",
            selectedItemId === item.id && "ring-2 ring-primary"
          )}
          onClick={() => selectItem(item.id)}
        >
          <CardContent className="p-3 space-y-2">
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium leading-tight">{item.title}</p>
              {item.tradeoffFlag && (
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
              )}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={stageVariants[item.stage]} className="text-[10px]">
                {stageLabels[item.stage]}
              </Badge>
              <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                <ArrowUpRight className="h-3 w-3" />
                {item.volume}/wk
              </span>
              <span className="text-[11px] text-red-500 flex items-center gap-0.5">
                <TrendingDown className="h-3 w-3" />
                {item.csatImpact.toFixed(1)} CSAT
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">{item.topic}</span>
              <span className="text-[10px] text-muted-foreground">{item.owner}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
