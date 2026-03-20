"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWatchtowerStore } from "@/store/watchtower-store";
import type { WatchtowerFlag } from "@/lib/types";

const severityVariant: Record<
  WatchtowerFlag["severity"],
  "destructive" | "default" | "secondary" | "outline"
> = {
  critical: "destructive",
  high: "default",
  medium: "secondary",
  low: "outline",
};

const statusVariant: Record<
  WatchtowerFlag["status"],
  "destructive" | "default" | "secondary" | "outline"
> = {
  open: "destructive",
  reviewed: "secondary",
  false_positive: "outline",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function FlagTable() {
  const flags = useWatchtowerStore((s) => s.flags);
  const selectedFlagId = useWatchtowerStore((s) => s.selectedFlagId);
  const selectFlag = useWatchtowerStore((s) => s.selectFlag);
  const updateFlagStatus = useWatchtowerStore((s) => s.updateFlagStatus);

  const selectedFlag = flags.find((f) => f.id === selectedFlagId) ?? null;

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Rule</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flags.map((flag) => (
              <TableRow
                key={flag.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => selectFlag(flag.id)}
              >
                <TableCell className="font-medium text-sm">
                  {flag.ruleName}
                </TableCell>
                <TableCell className="text-sm">{flag.customerName}</TableCell>
                <TableCell>
                  <span className="text-sm capitalize">{flag.category}</span>
                </TableCell>
                <TableCell>
                  <Badge variant={severityVariant[flag.severity]}>
                    {flag.severity}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={statusVariant[flag.status]}>
                    {flag.status === "false_positive"
                      ? "False Positive"
                      : flag.status.charAt(0).toUpperCase() + flag.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {formatDate(flag.createdAt)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selectedFlag}
        onOpenChange={(open) => {
          if (!open) selectFlag(null);
        }}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedFlag?.ruleName}</DialogTitle>
          </DialogHeader>

          {selectedFlag && (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Badge variant={severityVariant[selectedFlag.severity]}>
                  {selectedFlag.severity}
                </Badge>
                <Badge variant={statusVariant[selectedFlag.status]}>
                  {selectedFlag.status === "false_positive"
                    ? "False Positive"
                    : selectedFlag.status.charAt(0).toUpperCase() +
                      selectedFlag.status.slice(1)}
                </Badge>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Customer
                </p>
                <p className="text-sm">{selectedFlag.customerName}</p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Conversation
                </p>
                <p className="text-sm font-mono text-muted-foreground">
                  {selectedFlag.conversationId}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Flagged Excerpt
                </p>
                <div className="rounded-md bg-muted p-3 text-sm leading-relaxed">
                  {selectedFlag.excerpt}
                </div>
              </div>

              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">
                  Flagged At
                </p>
                <p className="text-sm">{formatDate(selectedFlag.createdAt)}</p>
              </div>

              {selectedFlag.status === "open" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      updateFlagStatus(selectedFlag.id, "reviewed");
                      selectFlag(null);
                    }}
                  >
                    Mark Reviewed
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      updateFlagStatus(selectedFlag.id, "false_positive");
                      selectFlag(null);
                    }}
                  >
                    Mark False Positive
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
