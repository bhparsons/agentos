"use client";

import { useAgentStore } from "@/store/agent-store";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Rocket, Save, CheckCircle2, Clock, FileEdit } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const statusConfig = {
  draft: { label: "Draft", icon: FileEdit, variant: "outline" as const },
  deployed: { label: "Deployed", icon: CheckCircle2, variant: "default" as const },
  changes_pending: { label: "Changes Pending", icon: Clock, variant: "secondary" as const },
};

export function DeployBar() {
  const { agents, selectedAgentId, deployAgent } = useAgentStore();
  const agent = agents.find((a) => a.id === selectedAgentId);
  const [deploying, setDeploying] = useState(false);
  const [progress, setProgress] = useState(0);

  if (!agent) return null;

  const config = statusConfig[agent.status];
  const StatusIcon = config.icon;

  const handleDeploy = () => {
    setDeploying(true);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setDeploying(false);
          deployAgent(agent.id);
          toast.success(`${agent.name} deployed successfully!`, {
            description: "Your agent is now live and handling conversations.",
          });
          return 0;
        }
        return p + 5;
      });
    }, 100);
  };

  const handleSave = () => {
    toast.success("Draft saved", {
      description: "Your changes have been saved.",
    });
  };

  return (
    <div className="border-t bg-background p-4">
      {deploying && (
        <div className="mb-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Deploying agent...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <StatusIcon className="h-4 w-4 text-muted-foreground" />
          <Badge variant={config.variant}>{config.label}</Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-3 w-3 mr-1" /> Save Draft
          </Button>
          <Button size="sm" onClick={handleDeploy} disabled={deploying}>
            <Rocket className="h-3 w-3 mr-1" /> Deploy Agent
          </Button>
        </div>
      </div>
    </div>
  );
}
