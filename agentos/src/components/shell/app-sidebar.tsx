"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  Bot,
  Wrench,
  FlaskConical,
  BarChart3,
  ListChecks,
  Eye,
  Lightbulb,
  Beaker,
  Shield,
  BookOpen,
  MessageSquare,
  UserCircle,
} from "lucide-react";

const operationsItems = [
  { title: "Dashboard", href: "/analytics", icon: BarChart3 },
  { title: "Conversations", href: "/conversations", icon: MessageSquare },
  { title: "Impact Queue", href: "/queue", icon: ListChecks },
  { title: "Watchtower", href: "/watchtower", icon: Eye },
];

const agentItems = [
  { title: "Identity", href: "/identity", icon: UserCircle },
  { title: "Agent Builder", href: "/builder", icon: Wrench },
  { title: "Rules", href: "/rules", icon: Shield },
  { title: "Knowledge Base", href: "/knowledge", icon: BookOpen },
];

const insightsItems = [
  { title: "Suggestions", href: "/suggestions", icon: Lightbulb },
  { title: "Experiments", href: "/experiments", icon: Beaker },
  { title: "Testing", href: "/testing", icon: FlaskConical },
];

export function AppSidebar() {
  const pathname = usePathname();

  const renderGroup = (label: string, items: typeof operationsItems) => (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton render={<Link href={item.href} />} isActive={pathname === item.href}>
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-3">
        <Link href="/analytics" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Bot className="h-4 w-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">AgentOS</span>
            <span className="text-[10px] text-sidebar-foreground/60">Enterprise AI Platform</span>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {renderGroup("Operations", operationsItems)}
        {renderGroup("Agent Definition", agentItems)}
        {renderGroup("Insights", insightsItems)}
      </SidebarContent>
      <SidebarFooter className="border-t p-4">
        <div className="text-[11px] text-sidebar-foreground/60">
          AgentOS v0.2.0 &middot; Demo
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
