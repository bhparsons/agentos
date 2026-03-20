"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Agent, AOP, AOPStep, AOPVersion, KnowledgeSource } from "@/lib/types";
import { defaultAgents } from "@/data/mock-agents";
import { defaultAOPs } from "@/data/mock-aops";
import { defaultAOPVersions } from "@/data/mock-aop-versions";

interface AgentStore {
  agents: Agent[];
  selectedAgentId: string;
  aopVersions: AOPVersion[];
  selectAgent: (id: string) => void;
  updateAgent: (id: string, updates: Partial<Agent>) => void;
  addKnowledgeSource: (agentId: string, source: KnowledgeSource) => void;
  addAOP: (agentId: string, aop: AOP) => void;
  updateAOP: (agentId: string, aopId: string, updates: Partial<AOP>) => void;
  addAOPStep: (agentId: string, aopId: string, step: AOPStep) => void;
  updateAOPStep: (agentId: string, aopId: string, stepId: string, updates: Partial<AOPStep>) => void;
  removeAOPStep: (agentId: string, aopId: string, stepId: string) => void;
  deployAgent: (id: string) => void;
  createVersion: (agentId: string, aopId: string, label: string) => void;
  rollbackToVersion: (agentId: string, aopId: string, versionId: string) => void;
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
      aopVersions: defaultAOPVersions,

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
        set((s) => {
          const agent = s.agents.find((a) => a.id === id);
          const newVersions = [...s.aopVersions];

          if (agent) {
            for (const aop of agent.aops) {
              const existing = s.aopVersions.filter(
                (v) => v.aopId === aop.id && v.agentId === id
              );
              const nextNum = existing.length > 0
                ? Math.max(...existing.map((v) => v.version)) + 1
                : 1;
              const now = new Date().toISOString();
              newVersions.push({
                id: `ver-${Date.now()}-${aop.id}`,
                aopId: aop.id,
                agentId: id,
                version: nextNum,
                label: `Deploy v${nextNum}`,
                steps: aop.steps.map((step) => ({ ...step })),
                description: `Auto-snapshot on deploy`,
                createdAt: now,
                deployedAt: now,
              });
            }
          }

          return {
            agents: s.agents.map((a) =>
              a.id === id
                ? { ...a, status: "deployed", updatedAt: new Date().toISOString() }
                : a
            ),
            aopVersions: newVersions,
          };
        }),

      createVersion: (agentId, aopId, label) =>
        set((s) => {
          const agent = s.agents.find((a) => a.id === agentId);
          const aop = agent?.aops.find((a) => a.id === aopId);
          if (!aop) return s;

          const existing = s.aopVersions.filter(
            (v) => v.aopId === aopId && v.agentId === agentId
          );
          const nextNum = existing.length > 0
            ? Math.max(...existing.map((v) => v.version)) + 1
            : 1;

          const newVersion: AOPVersion = {
            id: `ver-${Date.now()}`,
            aopId,
            agentId,
            version: nextNum,
            label,
            steps: aop.steps.map((step) => ({ ...step })),
            description: aop.description,
            createdAt: new Date().toISOString(),
          };

          return { aopVersions: [...s.aopVersions, newVersion] };
        }),

      rollbackToVersion: (agentId, aopId, versionId) =>
        set((s) => {
          const version = s.aopVersions.find((v) => v.id === versionId);
          if (!version) return s;

          return {
            agents: s.agents.map((a) =>
              a.id === agentId
                ? {
                    ...a,
                    status: a.status === "deployed" ? "changes_pending" : a.status,
                    updatedAt: new Date().toISOString(),
                    aops: a.aops.map((aop) =>
                      aop.id === aopId
                        ? { ...aop, steps: version.steps.map((step) => ({ ...step })) }
                        : aop
                    ),
                  }
                : a
            ),
          };
        }),

      getSelectedAgent: () => {
        const s = get();
        return s.agents.find((a) => a.id === s.selectedAgentId);
      },
    }),
    { name: "agentos-agents" }
  )
);
