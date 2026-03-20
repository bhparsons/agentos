"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { WatchtowerRule, WatchtowerFlag } from "@/lib/types";
import {
  defaultWatchtowerRules,
  defaultWatchtowerFlags,
} from "@/data/mock-watchtower";

interface WatchtowerStore {
  rules: WatchtowerRule[];
  flags: WatchtowerFlag[];
  selectedFlagId: string | null;
  addRule: (rule: WatchtowerRule) => void;
  toggleRule: (ruleId: string) => void;
  updateFlagStatus: (
    flagId: string,
    status: WatchtowerFlag["status"]
  ) => void;
  selectFlag: (flagId: string | null) => void;
}

export const useWatchtowerStore = create<WatchtowerStore>()(
  persist(
    (set, get) => ({
      rules: defaultWatchtowerRules,
      flags: defaultWatchtowerFlags,
      selectedFlagId: null,

      addRule: (rule) =>
        set((s) => ({
          rules: [...s.rules, rule],
        })),

      toggleRule: (ruleId) =>
        set((s) => ({
          rules: s.rules.map((r) =>
            r.id === ruleId ? { ...r, enabled: !r.enabled } : r
          ),
        })),

      updateFlagStatus: (flagId, status) =>
        set((s) => ({
          flags: s.flags.map((f) =>
            f.id === flagId ? { ...f, status } : f
          ),
        })),

      selectFlag: (flagId) =>
        set({ selectedFlagId: flagId }),
    }),
    { name: "agentos-watchtower" }
  )
);
