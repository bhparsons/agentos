"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Experiment, ExperimentStatus, ExperimentResults } from "@/lib/types";
import { defaultExperiments } from "@/data/mock-experiments";

interface ExperimentsStore {
  experiments: Experiment[];
  selectedExperimentId: string | null;
  selectExperiment: (id: string | null) => void;
  addExperiment: (experiment: Experiment) => void;
  updateStatus: (id: string, status: ExperimentStatus) => void;
  setResults: (id: string, results: ExperimentResults) => void;
}

export const useExperimentsStore = create<ExperimentsStore>()(
  persist(
    (set) => ({
      experiments: defaultExperiments,
      selectedExperimentId: null,

      selectExperiment: (id) => set({ selectedExperimentId: id }),

      addExperiment: (experiment) =>
        set((s) => ({ experiments: [...s.experiments, experiment] })),

      updateStatus: (id, status) =>
        set((s) => ({
          experiments: s.experiments.map((e) => {
            if (e.id !== id) return e;
            const updates: Partial<Experiment> = { status };
            if (status === "active") updates.startedAt = new Date().toISOString();
            if (status === "completed" || status === "rolled_back")
              updates.completedAt = new Date().toISOString();
            return { ...e, ...updates };
          }),
        })),

      setResults: (id, results) =>
        set((s) => ({
          experiments: s.experiments.map((e) =>
            e.id === id ? { ...e, results } : e
          ),
        })),
    }),
    { name: "agentos-experiments" }
  )
);
