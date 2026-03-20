"use client";

import { useState } from "react";
import { useExperimentsStore } from "@/store/experiments-store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface CreateExperimentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultName?: string;
  linkedQueueItemId?: string;
}

export function CreateExperimentDialog({
  open,
  onOpenChange,
  defaultName = "",
  linkedQueueItemId,
}: CreateExperimentDialogProps) {
  const { addExperiment } = useExperimentsStore();
  const [name, setName] = useState(defaultName);
  const [hypothesis, setHypothesis] = useState("");
  const [description, setDescription] = useState("");
  const [trafficSplit, setTrafficSplit] = useState("50");
  const [metrics, setMetrics] = useState("CSAT, Deflection Rate");

  const handleCreate = () => {
    if (!name.trim() || !hypothesis.trim()) return;

    addExperiment({
      id: `exp-${Date.now()}`,
      name: name.trim(),
      hypothesis: hypothesis.trim(),
      description: description.trim(),
      status: "draft",
      trafficSplit: Number(trafficSplit),
      metrics: metrics.split(",").map((m) => m.trim()).filter(Boolean),
      linkedQueueItemId,
      createdAt: new Date().toISOString(),
    });

    toast.success(`Experiment "${name}" created`);
    onOpenChange(false);
    setName("");
    setHypothesis("");
    setDescription("");
    setTrafficSplit("50");
    setMetrics("CSAT, Deflection Rate");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Experiment</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Experiment name" />
          </div>
          <div className="space-y-2">
            <Label>Hypothesis</Label>
            <Textarea
              value={hypothesis}
              onChange={(e) => setHypothesis(e.target.value)}
              placeholder="What do you expect to happen and why?"
              rows={3}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What changes are being tested?"
              rows={2}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Traffic Split (%)</Label>
              <Input
                type="number"
                min="1"
                max="100"
                value={trafficSplit}
                onChange={(e) => setTrafficSplit(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Metrics (comma-separated)</Label>
              <Input value={metrics} onChange={(e) => setMetrics(e.target.value)} />
            </div>
          </div>
          {linkedQueueItemId && (
            <p className="text-xs text-muted-foreground">
              Linked to queue item: <span className="font-mono">{linkedQueueItemId}</span>
            </p>
          )}
          <Button onClick={handleCreate} disabled={!name.trim() || !hypothesis.trim()}>
            Create Experiment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
