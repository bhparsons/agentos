"use client";

import { usePathname } from "next/navigation";
import { useAgentStore } from "@/store/agent-store";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, ChevronDown } from "lucide-react";

const pageTitles: Record<string, string> = {
  "/builder": "Agent Builder",
  "/testing": "Testing & Simulation",
  "/analytics": "Analytics",
  "/integrations": "Integrations",
  "/settings": "Settings",
};

export function Topbar() {
  const pathname = usePathname();
  const { agents, selectedAgentId, selectAgent } = useAgentStore();
  const selectedAgent = agents.find((a) => a.id === selectedAgentId);

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 !h-4" />
      <Breadcrumb className="flex-1">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage>{pageTitles[pathname] || "AgentOS"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" size="sm" />}>
            <Bot className="h-3.5 w-3.5" />
            <span>{selectedAgent?.name || "Select Agent"}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {agents.map((agent) => (
              <DropdownMenuItem key={agent.id} onSelect={() => selectAgent(agent.id)}>
                {agent.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {selectedAgent && (
          <Badge
            variant={
              selectedAgent.status === "deployed"
                ? "default"
                : selectedAgent.status === "changes_pending"
                ? "secondary"
                : "outline"
            }
          >
            {selectedAgent.status === "changes_pending"
              ? "Changes Pending"
              : selectedAgent.status === "deployed"
              ? "Deployed"
              : "Draft"}
          </Badge>
        )}
      </div>
    </header>
  );
}
