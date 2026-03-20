"use client";

import { ChatMessage } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BeforeAfterCompareProps {
  beforeMessages: ChatMessage[];
  afterMessages: ChatMessage[];
}

function MessageList({ messages, label }: { messages: ChatMessage[]; label: string }) {
  return (
    <Card className="flex-1">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-auto">
        {messages.length === 0 ? (
          <p className="text-xs text-muted-foreground">No messages yet</p>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex",
                msg.role === "user" ? "justify-end" : "justify-start"
              )}
            >
              <div
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-2 text-xs",
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export function BeforeAfterCompare({ beforeMessages, afterMessages }: BeforeAfterCompareProps) {
  return (
    <div className="flex gap-4">
      <MessageList messages={beforeMessages} label="Before (Original)" />
      <MessageList messages={afterMessages} label="After (Updated)" />
    </div>
  );
}
