"use client";

import { useState } from "react";
import { useAgentStore } from "@/store/agent-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { Agent } from "@/lib/types";

const toneOptions: { value: Agent["tone"]; label: string }[] = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "casual", label: "Casual" },
  { value: "empathetic", label: "Empathetic" },
];

export function AgentIdentityPanel() {
  const { agents, selectedAgentId, updateAgent } = useAgentStore();
  const agent = agents.find((a) => a.id === selectedAgentId);
  const [newGuardrail, setNewGuardrail] = useState("");

  if (!agent) return null;

  const handleAddGuardrail = () => {
    const text = newGuardrail.trim();
    if (!text) return;
    updateAgent(agent.id, {
      universalGuardrails: [...(agent.universalGuardrails ?? []), text],
    });
    setNewGuardrail("");
  };

  const handleRemoveGuardrail = (index: number) => {
    updateAgent(agent.id, {
      universalGuardrails: (agent.universalGuardrails ?? []).filter((_, i) => i !== index),
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Brand & Style</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="identity-name">Agent Name</Label>
            <Input
              id="identity-name"
              value={agent.name}
              onChange={(e) => updateAgent(agent.id, { name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="identity-tone">Tone</Label>
            <Select
              value={agent.tone}
              onValueChange={(v) => updateAgent(agent.id, { tone: v as Agent["tone"] })}
            >
              <SelectTrigger id="identity-tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {toneOptions.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="identity-brand-voice">Brand Voice</Label>
            <Textarea
              id="identity-brand-voice"
              value={agent.brandVoice}
              onChange={(e) => updateAgent(agent.id, { brandVoice: e.target.value })}
              rows={4}
              className="resize-none"
              placeholder="Describe how the agent should sound..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="identity-greeting">Greeting Template</Label>
            <Input
              id="identity-greeting"
              value={agent.greeting}
              onChange={(e) => updateAgent(agent.id, { greeting: e.target.value })}
              placeholder="e.g., Hi {{name}}! How can I help?"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="identity-signoff">Sign-off Template</Label>
            <Input
              id="identity-signoff"
              value={agent.signOff}
              onChange={(e) => updateAgent(agent.id, { signOff: e.target.value })}
              placeholder="e.g., Thanks for reaching out!"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Universal Guardrails</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Rules that always apply regardless of which AOP is active.
          </p>

          <div className="space-y-2">
            {(agent.universalGuardrails ?? []).map((rule, index) => (
              <div
                key={index}
                className="flex items-start gap-2 rounded-md border p-2.5 text-sm"
              >
                <span className="flex-1">{rule}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 shrink-0"
                  onClick={() => handleRemoveGuardrail(index)}
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Input
              value={newGuardrail}
              onChange={(e) => setNewGuardrail(e.target.value)}
              placeholder="e.g., Never share internal pricing"
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAddGuardrail();
              }}
            />
            <Button variant="outline" size="sm" onClick={handleAddGuardrail}>
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
