"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Guardrail } from "@/lib/types";
import { defaultGuardrails } from "@/data/mock-guardrails";

interface GuardrailsStore {
  guardrails: Guardrail[];
  addGuardrail: (guardrail: Guardrail) => void;
  updateGuardrail: (id: string, updates: Partial<Guardrail>) => void;
  toggleGuardrail: (id: string) => void;
  removeGuardrail: (id: string) => void;
  assignToAop: (guardrailId: string, aopId: string) => void;
  unassignFromAop: (guardrailId: string, aopId: string) => void;
}

export const useGuardrailsStore = create<GuardrailsStore>()(
  persist(
    (set) => ({
      guardrails: defaultGuardrails,

      addGuardrail: (guardrail) =>
        set((s) => ({ guardrails: [...s.guardrails, guardrail] })),

      updateGuardrail: (id, updates) =>
        set((s) => ({
          guardrails: s.guardrails.map((g) =>
            g.id === id ? { ...g, ...updates } : g
          ),
        })),

      toggleGuardrail: (id) =>
        set((s) => ({
          guardrails: s.guardrails.map((g) =>
            g.id === id ? { ...g, enabled: !g.enabled } : g
          ),
        })),

      removeGuardrail: (id) =>
        set((s) => ({
          guardrails: s.guardrails.filter((g) => g.id !== id),
        })),

      assignToAop: (guardrailId, aopId) =>
        set((s) => ({
          guardrails: s.guardrails.map((g) =>
            g.id === guardrailId && !g.assignedAopIds.includes(aopId)
              ? { ...g, assignedAopIds: [...g.assignedAopIds, aopId] }
              : g
          ),
        })),

      unassignFromAop: (guardrailId, aopId) =>
        set((s) => ({
          guardrails: s.guardrails.map((g) =>
            g.id === guardrailId
              ? { ...g, assignedAopIds: g.assignedAopIds.filter((id) => id !== aopId) }
              : g
          ),
        })),
    }),
    { name: "agentos-guardrails" }
  )
);
