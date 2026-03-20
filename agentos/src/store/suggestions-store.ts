"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Suggestion } from "@/lib/types";
import { defaultSuggestions } from "@/data/mock-suggestions";

interface SuggestionsStore {
  suggestions: Suggestion[];
  selectedSuggestionId: string | null;
  selectSuggestion: (id: string) => void;
  publishSuggestion: (id: string) => void;
  dismissSuggestion: (id: string) => void;
}

export const useSuggestionsStore = create<SuggestionsStore>()(
  persist(
    (set, get) => ({
      suggestions: defaultSuggestions,
      selectedSuggestionId: null,

      selectSuggestion: (id) => set({ selectedSuggestionId: id }),

      publishSuggestion: (id) =>
        set((s) => ({
          suggestions: s.suggestions.map((sg) =>
            sg.id === id ? { ...sg, status: "published" } : sg
          ),
        })),

      dismissSuggestion: (id) =>
        set((s) => ({
          suggestions: s.suggestions.map((sg) =>
            sg.id === id ? { ...sg, status: "dismissed" } : sg
          ),
        })),
    }),
    { name: "agentos-suggestions" }
  )
);
