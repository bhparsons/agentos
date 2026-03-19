"use client";

import { useState } from "react";
import { conversationRecords } from "@/data/mock-analytics";
import { ConversationRecord } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Search, MessageSquare, Phone, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

const channelIcons = {
  chat: MessageSquare,
  voice: Phone,
  email: Mail,
};

const statusColors = {
  resolved: "default" as const,
  escalated: "secondary" as const,
  open: "outline" as const,
};

export function ConversationTable() {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<keyof ConversationRecord>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [selectedConvo, setSelectedConvo] = useState<ConversationRecord | null>(null);
  const [page, setPage] = useState(0);
  const perPage = 8;

  const filtered = conversationRecords.filter(
    (c) =>
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.topic.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === "string" && typeof bVal === "string") {
      return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    }
    return sortDir === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
  });

  const paginated = sorted.slice(page * perPage, (page + 1) * perPage);
  const totalPages = Math.ceil(sorted.length / perPage);

  const toggleSort = (field: keyof ConversationRecord) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium">Conversation Explorer</h3>
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="pl-8"
            />
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("id")}>ID</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("customerName")}>Customer</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("topic")}>Topic</TableHead>
                <TableHead>Channel</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("csat")}>CSAT</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>Status</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("duration")}>Duration</TableHead>
                <TableHead className="cursor-pointer" onClick={() => toggleSort("date")}>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.map((convo) => {
                const ChannelIcon = channelIcons[convo.channel];
                return (
                  <TableRow
                    key={convo.id}
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => setSelectedConvo(convo)}
                  >
                    <TableCell className="font-mono text-xs">{convo.id}</TableCell>
                    <TableCell className="font-medium text-sm">{convo.customerName}</TableCell>
                    <TableCell className="text-sm">{convo.topic}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ChannelIcon className="h-3 w-3" />
                        <span className="text-xs capitalize">{convo.channel}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        {"*".repeat(convo.csat)}
                        <span className="text-xs text-muted-foreground ml-1">{convo.csat}/5</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusColors[convo.status]} className="text-[10px]">
                        {convo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{Math.floor(convo.duration / 60)}m {convo.duration % 60}s</TableCell>
                    <TableCell className="text-sm">{convo.date}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            Showing {page * perPage + 1}-{Math.min((page + 1) * perPage, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(Math.max(0, page - 1))}
              disabled={page === 0}
              className="px-2 py-1 rounded border disabled:opacity-50 hover:bg-accent"
            >
              Prev
            </button>
            <button
              onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
              disabled={page >= totalPages - 1}
              className="px-2 py-1 rounded border disabled:opacity-50 hover:bg-accent"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedConvo} onOpenChange={() => setSelectedConvo(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-auto">
          {selectedConvo && (
            <>
              <DialogHeader>
                <DialogTitle>
                  Conversation {selectedConvo.id} &mdash; {selectedConvo.customerName}
                </DialogTitle>
              </DialogHeader>
              <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                <span>Topic: {selectedConvo.topic}</span>
                <span>Channel: {selectedConvo.channel}</span>
                <span>CSAT: {selectedConvo.csat}/5</span>
                <Badge variant={statusColors[selectedConvo.status]}>
                  {selectedConvo.status}
                </Badge>
              </div>
              <div className="space-y-3">
                {selectedConvo.transcript.map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex",
                      msg.role === "user" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[80%] rounded-lg px-4 py-2.5 text-sm",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
