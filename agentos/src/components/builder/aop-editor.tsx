"use client";

import { useAgentStore } from "@/store/agent-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical } from "lucide-react";
import { useState } from "react";
import { AOPStep } from "@/lib/types";

const stepTypeBadgeColors: Record<AOPStep["type"], string> = {
  respond: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  check_condition: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  escalate: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  action: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  collect_info: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
};

const stepTypeLabels: Record<AOPStep["type"], string> = {
  respond: "Respond",
  check_condition: "Condition",
  escalate: "Escalate",
  action: "Action",
  collect_info: "Collect Info",
};

export function AOPEditor() {
  const { agents, selectedAgentId, updateAOP, addAOP, addAOPStep, updateAOPStep, removeAOPStep } =
    useAgentStore();
  const agent = agents.find((a) => a.id === selectedAgentId);
  const [activeTab, setActiveTab] = useState<string>(agent?.aops[0]?.id || "");
  const [newStepType, setNewStepType] = useState<AOPStep["type"]>("respond");

  if (!agent) return null;

  const handleAddAOP = () => {
    const newId = `aop-${Date.now()}`;
    addAOP(agent.id, {
      id: newId,
      name: "New Procedure",
      description: "",
      steps: [],
    });
    setActiveTab(newId);
  };

  const handleAddStep = (aopId: string) => {
    addAOPStep(agent.id, aopId, {
      id: `step-${Date.now()}`,
      type: newStepType,
      instruction: "",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Agent Operating Procedures (AOPs)</h3>
      </div>

      {agent.aops.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            No procedures defined yet. Create your first AOP to define how your agent handles conversations.
          </p>
          <Button onClick={handleAddAOP} size="sm">
            <Plus className="h-3 w-3 mr-1" /> Create AOP
          </Button>
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex items-center gap-2">
            <TabsList className="flex-1 justify-start overflow-x-auto">
              {agent.aops.map((aop) => (
                <TabsTrigger key={aop.id} value={aop.id} className="text-xs">
                  {aop.name}
                </TabsTrigger>
              ))}
            </TabsList>
            <Button variant="outline" size="sm" onClick={handleAddAOP}>
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {agent.aops.map((aop) => (
            <TabsContent key={aop.id} value={aop.id} className="space-y-4 mt-4">
              <Input
                value={aop.name}
                onChange={(e) => updateAOP(agent.id, aop.id, { name: e.target.value })}
                className="font-medium"
                placeholder="Procedure name"
              />
              <Textarea
                value={aop.description}
                onChange={(e) => updateAOP(agent.id, aop.id, { description: e.target.value })}
                placeholder="Describe when and how this procedure should be followed..."
                rows={3}
                className="resize-none text-sm"
              />

              <div className="space-y-2">
                <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Steps
                </h4>
                {aop.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="flex items-start gap-2 rounded-md border p-3 group"
                  >
                    <GripVertical className="h-4 w-4 mt-1 text-muted-foreground/50 shrink-0" />
                    <span className="text-xs text-muted-foreground mt-1 shrink-0 w-4">
                      {idx + 1}
                    </span>
                    <div
                      className={`shrink-0 mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-medium ${stepTypeBadgeColors[step.type]}`}
                    >
                      {stepTypeLabels[step.type]}
                    </div>
                    <Textarea
                      value={step.instruction}
                      onChange={(e) =>
                        updateAOPStep(agent.id, aop.id, step.id, {
                          instruction: e.target.value,
                        })
                      }
                      placeholder="Step instruction..."
                      rows={2}
                      className="flex-1 resize-none text-sm min-h-0"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 shrink-0"
                      onClick={() => removeAOPStep(agent.id, aop.id, step.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Select value={newStepType} onValueChange={(v) => setNewStepType(v as AOPStep["type"])}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="respond">Respond</SelectItem>
                    <SelectItem value="check_condition">Condition</SelectItem>
                    <SelectItem value="escalate">Escalate</SelectItem>
                    <SelectItem value="action">Action</SelectItem>
                    <SelectItem value="collect_info">Collect Info</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => handleAddStep(aop.id)}>
                  <Plus className="h-3 w-3 mr-1" /> Add Step
                </Button>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
