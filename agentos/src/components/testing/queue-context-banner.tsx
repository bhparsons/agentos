"use client";

import { useQueueStore } from "@/store/queue-store";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QueueContextBannerProps {
  queueItemId: string;
  onDismiss: () => void;
}

export function QueueContextBanner({ queueItemId, onDismiss }: QueueContextBannerProps) {
  const { items } = useQueueStore();
  const item = items.find((i) => i.id === queueItemId);

  if (!item) return null;

  return (
    <div className="flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm dark:border-blue-800 dark:bg-blue-950">
      <ArrowUpRight className="h-4 w-4 shrink-0 text-blue-600" />
      <div className="flex-1 min-w-0">
        <span className="font-medium text-blue-800 dark:text-blue-200">Testing fix for: </span>
        <span className="text-blue-700 dark:text-blue-300 truncate">{item.title}</span>
      </div>
      <Badge variant="secondary" className="text-[10px] shrink-0">
        {item.volume}/wk
      </Badge>
      <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={onDismiss}>
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
}
