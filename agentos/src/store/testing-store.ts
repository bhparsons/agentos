"use client";

import { create } from "zustand";
import { ChatMessage, EvaluationResult, TestPersona } from "@/lib/types";

interface TestingStore {
  selectedPersonaId: string | null;
  messages: ChatMessage[];
  isTyping: boolean;
  evaluationResult: EvaluationResult | null;
  hasEvaluated: boolean;
  // Fix-to-Validate mode
  linkedQueueItemId: string | null;
  beforeAfterMode: boolean;
  comparisonMessages: ChatMessage[];
  selectPersona: (id: string | null) => void;
  addMessage: (message: ChatMessage) => void;
  setTyping: (typing: boolean) => void;
  setEvaluationResult: (result: EvaluationResult) => void;
  resetConversation: () => void;
  // Fix-to-Validate actions
  setLinkedQueueItem: (id: string | null) => void;
  setBeforeAfterMode: (enabled: boolean) => void;
  setComparisonMessages: (messages: ChatMessage[]) => void;
}

export const useTestingStore = create<TestingStore>()((set) => ({
  selectedPersonaId: null,
  messages: [],
  isTyping: false,
  evaluationResult: null,
  hasEvaluated: false,
  linkedQueueItemId: null,
  beforeAfterMode: false,
  comparisonMessages: [],

  selectPersona: (id) =>
    set({ selectedPersonaId: id, messages: [], evaluationResult: null, hasEvaluated: false }),

  addMessage: (message) =>
    set((s) => ({ messages: [...s.messages, message] })),

  setTyping: (typing) => set({ isTyping: typing }),

  setEvaluationResult: (result) =>
    set({ evaluationResult: result, hasEvaluated: true }),

  resetConversation: () =>
    set({ messages: [], evaluationResult: null, hasEvaluated: false, isTyping: false }),

  setLinkedQueueItem: (id) => set({ linkedQueueItemId: id }),

  setBeforeAfterMode: (enabled) => set({ beforeAfterMode: enabled }),

  setComparisonMessages: (messages) => set({ comparisonMessages: messages }),
}));

export function getEvaluationForPersona(persona: TestPersona): EvaluationResult {
  const score = persona.expectedScore;
  return {
    greeting: score >= 3,
    issueIdentification: score >= 2,
    aopAdherence: score >= 4,
    accuracy: score >= 4,
    resolution: score >= 5,
  };
}
