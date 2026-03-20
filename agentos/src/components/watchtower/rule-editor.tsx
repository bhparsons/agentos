"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useWatchtowerStore } from "@/store/watchtower-store";
import type { WatchtowerRule } from "@/lib/types";

const categories: WatchtowerRule["category"][] = [
  "accuracy",
  "tone",
  "compliance",
  "process",
  "safety",
];

const severities: WatchtowerRule["severity"][] = [
  "low",
  "medium",
  "high",
  "critical",
];

export function RuleEditor() {
  const addRule = useWatchtowerStore((s) => s.addRule);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<WatchtowerRule["category"]>("accuracy");
  const [severity, setSeverity] = useState<WatchtowerRule["severity"]>("medium");
  const [enabled, setEnabled] = useState(true);

  function handleSave() {
    if (!name.trim() || !description.trim()) return;

    const rule: WatchtowerRule = {
      id: `wr-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      category,
      severity,
      enabled,
      createdAt: new Date().toISOString(),
    };

    addRule(rule);
    setName("");
    setDescription("");
    setCategory("accuracy");
    setSeverity("medium");
    setEnabled(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Create New Rule</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="rule-name">Name</Label>
          <Input
            id="rule-name"
            placeholder="e.g. Refund Policy Accuracy"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="rule-description">Description</Label>
          <Textarea
            id="rule-description"
            placeholder="Describe what this rule checks for..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={category} onValueChange={(v) => setCategory(v as WatchtowerRule["category"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Severity</Label>
            <Select value={severity} onValueChange={(v) => setSeverity(v as WatchtowerRule["severity"])}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {severities.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Switch id="rule-enabled" checked={enabled} onCheckedChange={setEnabled} />
          <Label htmlFor="rule-enabled">Enabled</Label>
        </div>

        <Button onClick={handleSave} disabled={!name.trim() || !description.trim()}>
          Save Rule
        </Button>
      </CardContent>
    </Card>
  );
}
