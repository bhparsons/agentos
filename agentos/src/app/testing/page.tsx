"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { PersonaSelector } from "@/components/testing/persona-selector";
import { ChatSimulator } from "@/components/testing/chat-simulator";
import { TestResults } from "@/components/testing/test-results";
import { QueueContextBanner } from "@/components/testing/queue-context-banner";
import { BeforeAfterCompare } from "@/components/testing/before-after-compare";
import { ReplaySelector } from "@/components/testing/replay-selector";
import { useTestingStore } from "@/store/testing-store";
import { useQueueStore } from "@/store/queue-store";
import { conversationRecords } from "@/data/mock-analytics";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

function TestingContent() {
  const searchParams = useSearchParams();
  const {
    linkedQueueItemId,
    beforeAfterMode,
    comparisonMessages,
    setLinkedQueueItem,
    setBeforeAfterMode,
    setComparisonMessages,
    messages,
  } = useTestingStore();
  const { items } = useQueueStore();

  useEffect(() => {
    const queueItemId = searchParams.get("queueItemId");
    if (queueItemId) {
      setLinkedQueueItem(queueItemId);
      setBeforeAfterMode(true);
      const queueItem = items.find((i) => i.id === queueItemId);
      if (queueItem && queueItem.linkedConversationIds.length > 0) {
        const convo = conversationRecords.find(
          (c) => c.id === queueItem.linkedConversationIds[0]
        );
        if (convo) {
          setComparisonMessages(convo.transcript);
        }
      }
    }
  }, [searchParams, items, setLinkedQueueItem, setBeforeAfterMode, setComparisonMessages]);

  const handleReplay = (conversationId: string) => {
    const convo = conversationRecords.find((c) => c.id === conversationId);
    if (convo) {
      setComparisonMessages(convo.transcript);
    }
  };

  const queueItem = linkedQueueItemId
    ? items.find((i) => i.id === linkedQueueItemId)
    : null;

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem-3rem)] -m-6">
      {linkedQueueItemId && (
        <div className="px-4 pt-3">
          <QueueContextBanner
            queueItemId={linkedQueueItemId}
            onDismiss={() => {
              setLinkedQueueItem(null);
              setBeforeAfterMode(false);
            }}
          />
        </div>
      )}

      {linkedQueueItemId && (
        <div className="px-4 pt-2">
          <Tabs
            value={beforeAfterMode ? "compare" : "standard"}
            onValueChange={(v) => setBeforeAfterMode(v === "compare")}
          >
            <TabsList className="h-7">
              <TabsTrigger value="standard" className="text-xs px-3 h-5">
                Standard
              </TabsTrigger>
              <TabsTrigger value="compare" className="text-xs px-3 h-5">
                Before / After
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 shrink-0 overflow-auto border-r p-4">
          <PersonaSelector />
          {queueItem && queueItem.linkedConversationIds.length > 0 && (
            <div className="mt-4">
              <ReplaySelector
                conversationIds={queueItem.linkedConversationIds}
                onReplay={handleReplay}
              />
            </div>
          )}
        </div>
        <div className="flex-1 flex flex-col p-4">
          {beforeAfterMode ? (
            <BeforeAfterCompare
              beforeMessages={comparisonMessages}
              afterMessages={messages}
            />
          ) : (
            <ChatSimulator />
          )}
        </div>
        <div className="w-64 shrink-0 overflow-auto border-l p-4">
          <TestResults />
        </div>
      </div>
    </div>
  );
}

export default function TestingPage() {
  return (
    <Suspense>
      <TestingContent />
    </Suspense>
  );
}
