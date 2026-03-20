"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useExperimentsStore } from "@/store/experiments-store";
import { ExperimentCard } from "@/components/experiments/experiment-card";
import { ExperimentDetail } from "@/components/experiments/experiment-detail";
import { CreateExperimentDialog } from "@/components/experiments/create-experiment-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

function ExperimentsContent() {
  const { experiments, selectedExperimentId, selectExperiment } = useExperimentsStore();
  const searchParams = useSearchParams();
  const [createOpen, setCreateOpen] = useState(false);
  const [defaultName, setDefaultName] = useState("");
  const [linkedQueueItemId, setLinkedQueueItemId] = useState<string | undefined>();

  useEffect(() => {
    const shouldCreate = searchParams.get("create");
    const queueItemId = searchParams.get("queueItemId");
    const title = searchParams.get("title");
    if (shouldCreate === "true") {
      setCreateOpen(true);
      if (title) setDefaultName(title);
      if (queueItemId) setLinkedQueueItemId(queueItemId);
    }
  }, [searchParams]);

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] -m-6">
      <div className="w-80 shrink-0 overflow-auto border-r p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Experiments ({experiments.length})
          </h3>
          <Button size="sm" variant="outline" onClick={() => setCreateOpen(true)} className="h-7 gap-1">
            <Plus className="h-3 w-3" />
            New
          </Button>
        </div>
        <div className="space-y-2">
          {experiments.map((exp) => (
            <ExperimentCard
              key={exp.id}
              experiment={exp}
              isSelected={selectedExperimentId === exp.id}
              onSelect={() => selectExperiment(exp.id)}
            />
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-auto p-6">
        <ExperimentDetail />
      </div>

      <CreateExperimentDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        defaultName={defaultName}
        linkedQueueItemId={linkedQueueItemId}
      />
    </div>
  );
}

export default function ExperimentsPage() {
  return (
    <Suspense>
      <ExperimentsContent />
    </Suspense>
  );
}
