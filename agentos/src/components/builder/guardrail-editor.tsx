"use client";

import { useState } from "react";
import { useGuardrailsStore } from "@/store/guardrails-store";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GuardrailType, GuardrailSeverity } from "@/lib/types";
import { toast } from "sonner";

interface GuardrailEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preAssignAopId?: string;
}

export function GuardrailEditor({ open, onOpenChange, preAssignAopId }: GuardrailEditorProps) {
  const { addGuardrail } = useGuardrailsStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<GuardrailType>("compliance");
  const [severity, setSeverity] = useState<GuardrailSeverity>("warn");

  const handleSave = () => {
    if (!name.trim() || !description.trim()) return;

    addGuardrail({
      id: `gr-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      type,
      severity,
      enabled: true,
      config: {},
      assignedAopIds: preAssignAopId ? [preAssignAopId] : [],
      createdAt: new Date().toISOString(),
    });

    toast.success(`Guardrail "${name}" created`);
    onOpenChange(false);
    setName("");
    setDescription("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Guardrail</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Guardrail name" />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What should this guardrail prevent or enforce?"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as GuardrailType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="identity_verification">Identity Verification</SelectItem>
                  <SelectItem value="spending_limit">Spending Limit</SelectItem>
                  <SelectItem value="compliance">Compliance</SelectItem>
                  <SelectItem value="pii_protection">PII Protection</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Severity</Label>
              <Select value={severity} onValueChange={(v) => setSeverity(v as GuardrailSeverity)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="warn">Warn</SelectItem>
                  <SelectItem value="block">Block</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <Button onClick={handleSave} disabled={!name.trim() || !description.trim()}>
            Create Guardrail
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
