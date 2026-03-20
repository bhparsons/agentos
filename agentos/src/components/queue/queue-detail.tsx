"use client";

import { useQueueStore } from "@/store/queue-store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FixActions } from "./fix-actions";
import { TradeoffBanner } from "./tradeoff-banner";
import { LifecycleStage } from "@/lib/types";
import { MessageSquare, TrendingDown, ArrowDownRight } from "lucide-react";

const stageLabels: Record<LifecycleStage, string> = {
  identified: "Identified",
  fix_in_progress: "Fix in Progress",
  validating: "Validating",
  shipped: "Shipped",
};

const fixTypeLabels: Record<string, string> = {
  kb_article: "KB Article",
  aop_edit: "AOP Edit",
  experiment: "Experiment",
  escalation_rule: "Escalation Rule",
};

export function QueueDetail() {
  const { items, selectedItemId } = useQueueStore();
  const item = items.find((i) => i.id === selectedItemId);

  if (!item) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select a queue item to view details
      </div>
    );
  }

  return (
    <div className="space-y-4 overflow-auto">
      <div>
        <h2 className="text-lg font-semibold">{item.title}</h2>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
          <Badge variant="outline">{stageLabels[item.stage]}</Badge>
          <Badge variant="secondary">{fixTypeLabels[item.fixType]}</Badge>
          <Badge variant="secondary">{item.topic}</Badge>
          <span className="text-xs text-muted-foreground">Owner: {item.owner}</span>
        </div>
      </div>

      {item.tradeoffFlag && <TradeoffBanner message={item.tradeoffFlag} />}

      <p className="text-sm text-muted-foreground">{item.description}</p>

      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <MessageSquare className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <div className="text-xl font-bold">{item.volume}</div>
            <div className="text-[10px] text-muted-foreground">convos/week</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <TrendingDown className="h-4 w-4 mx-auto mb-1 text-red-500" />
            <div className="text-xl font-bold text-red-500">{item.csatImpact.toFixed(1)}</div>
            <div className="text-[10px] text-muted-foreground">CSAT impact</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-3 text-center">
            <ArrowDownRight className="h-4 w-4 mx-auto mb-1 text-orange-500" />
            <div className="text-xl font-bold text-orange-500">
              {item.deflectionImpact.toFixed(1)}%
            </div>
            <div className="text-[10px] text-muted-foreground">deflection loss</div>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div>
        <h3 className="text-sm font-medium mb-2">Linked Conversations</h3>
        <div className="flex flex-wrap gap-1">
          {item.linkedConversationIds.map((id) => (
            <Badge key={id} variant="outline" className="text-[10px] font-mono">
              {id}
            </Badge>
          ))}
        </div>
      </div>

      {item.linkedWatchtowerFlagIds.length > 0 && (
        <div>
          <h3 className="text-sm font-medium mb-2">Watchtower Flags</h3>
          <div className="flex flex-wrap gap-1">
            {item.linkedWatchtowerFlagIds.map((id) => (
              <Badge key={id} variant="destructive" className="text-[10px] font-mono">
                {id}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <Separator />

      <FixActions item={item} />
    </div>
  );
}
