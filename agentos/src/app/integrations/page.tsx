"use client";

import { useState } from "react";
import { useIntegrationsStore } from "@/store/integrations-store";
import { Integration } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Search,
  Cloud,
  Ticket,
  Hash,
  Users,
  MessageCircle,
  Database,
  BookOpen,
  LayoutGrid,
  BarChart2,
  FileText,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";

const iconMap: Record<string, React.ElementType> = {
  cloud: Cloud,
  ticket: Ticket,
  hash: Hash,
  users: Users,
  "message-circle": MessageCircle,
  database: Database,
  "book-open": BookOpen,
  "layout-grid": LayoutGrid,
  "bar-chart-2": BarChart2,
  "file-text": FileText,
};

const categories = ["All", "CRM", "Ticketing", "Communication", "Analytics", "Knowledge"];

export default function IntegrationsPage() {
  const { integrations, toggleConnection, updateConfig } = useIntegrationsStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [configModal, setConfigModal] = useState<Integration | null>(null);
  const [testing, setTesting] = useState(false);
  const [localConfig, setLocalConfig] = useState<Record<string, string>>({});

  const filtered = integrations.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = category === "All" || i.category === category;
    return matchesSearch && matchesCat;
  });

  const openConfig = (integration: Integration) => {
    setConfigModal(integration);
    setLocalConfig(integration.config || { apiKey: "", apiUrl: "", syncDirection: "bidirectional" });
  };

  const handleTestConnection = () => {
    setTesting(true);
    setTimeout(() => {
      setTesting(false);
      toast.success("Connection successful!", {
        description: `${configModal?.name} is responding normally.`,
      });
    }, 2000);
  };

  const handleSaveConfig = () => {
    if (configModal) {
      updateConfig(configModal.id, localConfig);
      toast.success("Configuration saved");
      setConfigModal(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search integrations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Tabs value={category} onValueChange={setCategory}>
          <TabsList>
            {categories.map((c) => (
              <TabsTrigger key={c} value={c} className="text-xs">
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((integration) => {
          const Icon = iconMap[integration.icon] || Cloud;
          return (
            <Card key={integration.id}>
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{integration.name}</CardTitle>
                    <Badge variant="outline" className="text-[10px] mt-1">
                      {integration.category}
                    </Badge>
                  </div>
                </div>
                <Switch
                  checked={integration.connected}
                  onCheckedChange={() => {
                    toggleConnection(integration.id);
                    toast.success(
                      integration.connected
                        ? `${integration.name} disconnected`
                        : `${integration.name} connected`
                    );
                  }}
                />
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground mb-3">{integration.description}</p>
                {integration.connected && (
                  <Button variant="outline" size="sm" onClick={() => openConfig(integration)}>
                    Configure
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!configModal} onOpenChange={() => setConfigModal(null)}>
        <DialogContent>
          {configModal && (
            <>
              <DialogHeader>
                <DialogTitle>Configure {configModal.name}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-2">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input
                    type="password"
                    value={localConfig.apiKey || ""}
                    onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
                    placeholder="sk-..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>API URL</Label>
                  <Input
                    value={localConfig.apiUrl || ""}
                    onChange={(e) => setLocalConfig({ ...localConfig, apiUrl: e.target.value })}
                    placeholder="https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Sync Direction</Label>
                  <Input
                    value={localConfig.syncDirection || "bidirectional"}
                    onChange={(e) => setLocalConfig({ ...localConfig, syncDirection: e.target.value })}
                  />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleTestConnection} disabled={testing}>
                    {testing ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    )}
                    {testing ? "Testing..." : "Test Connection"}
                  </Button>
                  <Button onClick={handleSaveConfig}>Save Configuration</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
