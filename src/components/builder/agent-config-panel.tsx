"use client";

import { useAgentStore } from "@/store/agent-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Globe, FileText, Type, Plug } from "lucide-react";
import { useState } from "react";
import { KnowledgeSource } from "@/lib/types";

const sourceTypeIcons = {
  url: Globe,
  pdf: FileText,
  text: Type,
  api: Plug,
};

const statusColors = {
  synced: "default" as const,
  syncing: "secondary" as const,
  error: "destructive" as const,
};

export function AgentConfigPanel() {
  const { agents, selectedAgentId, updateAgent, addKnowledgeSource } = useAgentStore();
  const agent = agents.find((a) => a.id === selectedAgentId);
  const [newSourceName, setNewSourceName] = useState("");
  const [newSourceType, setNewSourceType] = useState<KnowledgeSource["type"]>("url");
  const [dialogOpen, setDialogOpen] = useState(false);

  if (!agent) return null;

  const handleAddSource = () => {
    if (!newSourceName.trim()) return;
    addKnowledgeSource(agent.id, {
      id: `ks-${Date.now()}`,
      name: newSourceName,
      type: newSourceType,
      status: "syncing",
    });
    setNewSourceName("");
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-medium mb-3">Agent Configuration</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agent-name">Agent Name</Label>
            <Input
              id="agent-name"
              value={agent.name}
              onChange={(e) => updateAgent(agent.id, { name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="personality">Personality</Label>
            <Textarea
              id="personality"
              value={agent.personality}
              onChange={(e) => updateAgent(agent.id, { personality: e.target.value })}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium mb-3">Channels</h4>
        <div className="space-y-3">
          {(["chat", "voice", "email"] as const).map((channel) => (
            <div key={channel} className="flex items-center justify-between">
              <Label htmlFor={channel} className="capitalize">
                {channel}
              </Label>
              <Switch
                id={channel}
                checked={agent.channels[channel]}
                onCheckedChange={(checked) =>
                  updateAgent(agent.id, {
                    channels: { ...agent.channels, [channel]: checked },
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium">Knowledge Sources</h4>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger render={<Button variant="outline" size="sm" />}>
              <Plus className="h-3 w-3 mr-1" /> Add
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Knowledge Source</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={newSourceName}
                    onChange={(e) => setNewSourceName(e.target.value)}
                    placeholder="e.g., FAQ Articles"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={newSourceType} onValueChange={(v) => setNewSourceType(v as KnowledgeSource["type"])}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="url">URL</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                      <SelectItem value="text">Text</SelectItem>
                      <SelectItem value="api">API</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleAddSource} className="w-full">
                  Add Source
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="space-y-2">
          {agent.knowledgeSources.map((source) => {
            const Icon = sourceTypeIcons[source.type];
            return (
              <div
                key={source.id}
                className="flex items-center justify-between rounded-md border p-2.5 text-sm"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{source.name}</span>
                </div>
                <Badge variant={statusColors[source.status]} className="text-[10px]">
                  {source.status}
                </Badge>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
