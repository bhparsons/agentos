"use client";

import { conversationRecords } from "@/data/mock-analytics";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCw } from "lucide-react";

interface ReplaySelectorProps {
  conversationIds: string[];
  onReplay: (conversationId: string) => void;
}

export function ReplaySelector({ conversationIds, onReplay }: ReplaySelectorProps) {
  const conversations = conversationRecords.filter((c) =>
    conversationIds.includes(c.id)
  );

  if (conversations.length === 0) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-medium text-muted-foreground">Replay Conversations</h4>
      {conversations.map((convo) => (
        <div
          key={convo.id}
          className="flex items-center justify-between rounded-md border p-2"
        >
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-[10px] font-mono text-muted-foreground">{convo.id}</span>
            <span className="text-xs truncate">{convo.customerName}</span>
            <Badge variant="outline" className="text-[10px]">
              {convo.topic}
            </Badge>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 gap-1 text-xs"
            onClick={() => onReplay(convo.id)}
          >
            <RotateCw className="h-3 w-3" />
            Replay
          </Button>
        </div>
      ))}
    </div>
  );
}
