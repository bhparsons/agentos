"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Integration } from "@/lib/types";
import { defaultIntegrations } from "@/data/mock-integrations";

interface IntegrationsStore {
  integrations: Integration[];
  toggleConnection: (id: string) => void;
  updateConfig: (id: string, config: Record<string, string>) => void;
}

export const useIntegrationsStore = create<IntegrationsStore>()(
  persist(
    (set) => ({
      integrations: defaultIntegrations,

      toggleConnection: (id) =>
        set((s) => ({
          integrations: s.integrations.map((i) =>
            i.id === id ? { ...i, connected: !i.connected } : i
          ),
        })),

      updateConfig: (id, config) =>
        set((s) => ({
          integrations: s.integrations.map((i) =>
            i.id === id ? { ...i, config } : i
          ),
        })),
    }),
    { name: "agentos-integrations" }
  )
);
