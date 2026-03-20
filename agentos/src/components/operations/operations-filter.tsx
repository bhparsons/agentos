"use client";

import { useAgentStore } from "@/store/agent-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export interface OperationsFilterValues {
  aopId: string | null;
  dateFrom: string;
  dateTo: string;
}

interface OperationsFilterProps {
  value: OperationsFilterValues;
  onChange: (value: OperationsFilterValues) => void;
}

export function OperationsFilter({ value, onChange }: OperationsFilterProps) {
  const { getSelectedAgent } = useAgentStore();
  const agent = getSelectedAgent();
  const aops = agent?.aops ?? [];

  const hasFilters = value.aopId || value.dateFrom || value.dateTo;

  const clear = () => onChange({ aopId: null, dateFrom: "", dateTo: "" });

  return (
    <div className="flex items-end gap-3 flex-wrap">
      <div className="space-y-1">
        <Label className="text-[11px] text-muted-foreground">AOP</Label>
        <Select
          value={value.aopId ?? "all"}
          onValueChange={(v) =>
            onChange({ ...value, aopId: v === "all" ? null : v })
          }
        >
          <SelectTrigger className="w-[200px] h-8 text-xs">
            <SelectValue placeholder="All AOPs" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All AOPs</SelectItem>
            {aops.map((aop) => (
              <SelectItem key={aop.id} value={aop.id}>
                {aop.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label className="text-[11px] text-muted-foreground">From</Label>
        <Input
          type="date"
          className="w-[150px] h-8 text-xs"
          value={value.dateFrom}
          onChange={(e) => onChange({ ...value, dateFrom: e.target.value })}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-[11px] text-muted-foreground">To</Label>
        <Input
          type="date"
          className="w-[150px] h-8 text-xs"
          value={value.dateTo}
          onChange={(e) => onChange({ ...value, dateTo: e.target.value })}
        />
      </div>
      {hasFilters && (
        <Button variant="ghost" size="sm" className="h-8 px-2" onClick={clear}>
          <X className="h-3 w-3 mr-1" />
          <span className="text-xs">Clear</span>
        </Button>
      )}
    </div>
  );
}
