"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Agent, AOP, AOPStep, KnowledgeSource } from "@/lib/types";
import { defaultAgents } from "@/data/mock-agents";
import { defaultAOPs } from "@/data/mock-aops";

interface AgentStore {
  agents: Agent[];
  selectedAgentId: string;
  selectAgent: (id: string) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  addKnowledgeSource: (agentId: string, source: KnowledgeSource) => void;
  addAOP: (agentId: string, aop: AOP) => void;
  updateAOP: (agentId: string, aopId: string, updates: Partial<AOP>) => void;
  addAOPStep: (agentId: string, aopId: string, step: AOPStep) => void;
  updateAOPStep: (agentId: string, aopId: string, stepId: string, updates: Partial<AOPStep>) => void;
  removeAOPStep: (agentId: string, aopId: string, stepId: string) => void;
  deployAgent: (id: string) => void;
  getSelectedAgent: () => Agent | undefined;
}

function initAgents(): Agent[] {
  return defaultAgents.map((a) => ({
    ...a,
    aops: defaultAOPs[a.id] || [],
  }));
}

export const useAgentStore = create<AgentStore>()(
  persist(
    (set, get) => ({
      agents: initAgents(),
      selectedAgentId: "agent-1",

      selectAgent: (id) => set({ selectedAgentId: id }),

      updateAgent: (id, updates) =>
        set((s) => ({
          agents: s.agents.map((a) =>
            a.id === id
              ? { ...a, ...updates, status: a.status === "deployed" ? "changes_pending" : a.status, updatedAt: new Date().toISOString() }
              : a
          ),
        })),

      addKnowledgeSource: (agentId, source) =>
        set((s) => ({
          agents: s.agents.map((a) =>
            a.id === agentId
              ? { ...a, knowledgeSources: [...a.knowledgeSources, source] }
              : a
          ),
        })),

      addAOP: (agentId, aop) =>
        set((s) => ({
          agents: s.agents.map((a) =>
            a.id === agentId ? { ...a, aops: [...a.aops, aop] } : a
          ),
        })),

      updateAOP: (agentId, aopId, updates) =>
        set((s) => ({
          agents: s.agents.map((a) =>
            a.id === agentId
              ? {
                  ...a,
                  aops: a.aops.map((aop) =>
                    aop.id === aopId ? { ...aop, ...updates } : aop
                  ),
                }
              : a
          ),
        })),

      addAOPStep: (agentId, aopId, step) =>
        set((s) => ({
          agents: s.agents.map((a) =>
            a.id === agentId
              ? {
                  ...a,
                  aops: a.aops.map((aop) =>
                    aop.id === aopId
                      ? { ...aop, steps: [...aop.steps, step] }
                      : aop
                  ),
                }
              : a
          ),
        })),

      updateAOPStep: (agentId, aopId, stepId, updates) =>
        set((s) => ({
          agents: s.agents.map((a) =>
            a.id === agentId
              ? {
                  ...a,
                  aops: a.aops.map((aop) =>
                    aop.id === aopId
                      ? {
                          ...aop,
                          steps: aop.steps.map((step) =>
                            step.id === stepId ? { ...step, ...updates } : step
                          ),
                        }
                      : aop
                  ),
                }
              : a
          ),
        })),

      removeAOPStep: (agentId, aopId, stepId) =>
        set((s) => ({
          agents: s.agents.map((a) =>
            a.id === agentId
              ? {
                  ...a,
                  aops: a.aops.map((aop) =>
                    aop.id === aopId
                      ? { ...aop, steps: aop.steps.filter((s) => s.id !== stepId) }
                      : aop
                  ),
                }
              : a
          ),
        })),

      deployAgent: (id) =>
        set((s) => ({
          agents: s.agents.map((a) =>
            a.id === id
              ? { ...a, status: "deployed", updatedAt: new Date().toISOString() }
              : a
          ),
        })),

      getSelectedAgent: () => {
        const s = get();
        return s.agents.find((a) => a.id === s.selectedAgentId);
      },
    }),
    { name: "agentos-agents" }
  )
);
