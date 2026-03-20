"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QueueItem, LifecycleStage } from "@/lib/types";
import { defaultQueueItems } from "@/data/mock-queue";

interface QueueStore {
  items: QueueItem[];
  selectedItemId: string | null;
  selectItem: (id: string | null) => void;
  updateStage: (id: string, stage: LifecycleStage) => void;
  updateOwner: (id: string, owner: string) => void;
  addItem: (item: QueueItem) => void;
}

export const useQueueStore = create<QueueStore>()(
  persist(
    (set) => ({
      items: defaultQueueItems,
      selectedItemId: null,

      selectItem: (id) => set({ selectedItemId: id }),

      updateStage: (id, stage) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, stage, updatedAt: new Date().toISOString() } : i
          ),
        })),

      updateOwner: (id, owner) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.id === id ? { ...i, owner, updatedAt: new Date().toISOString() } : i
          ),
        })),

      addItem: (item) =>
        set((s) => ({ items: [...s.items, item] })),
    }),
    { name: "agentos-queue" }
  )
);
