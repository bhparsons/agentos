"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface KBArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  status: "published" | "draft";
  lastUpdated: string;
}

const defaultArticles: KBArticle[] = [
  {
    id: "kb-1",
    title: "Return & Refund Policy",
    category: "Policies",
    content:
      "Customers may return items within 30 days of purchase for a full refund. Items must be unused and in original packaging. Refunds are processed within 5-7 business days.",
    status: "published",
    lastUpdated: "2026-03-15",
  },
  {
    id: "kb-2",
    title: "Subscription Cancellation",
    category: "Billing",
    content:
      "Subscriptions can be cancelled at any time from Account Settings. Pro-rated refunds are available for annual plans within the first 30 days.",
    status: "published",
    lastUpdated: "2026-03-12",
  },
  {
    id: "kb-3",
    title: "Shipping & Delivery Times",
    category: "Logistics",
    content:
      "Standard shipping takes 5-7 business days. Express shipping is 2-3 business days. International orders may take 10-14 business days.",
    status: "published",
    lastUpdated: "2026-03-10",
  },
  {
    id: "kb-4",
    title: "Account Security & 2FA",
    category: "Security",
    content:
      "Two-factor authentication can be enabled in Security Settings. We support authenticator apps and SMS verification.",
    status: "published",
    lastUpdated: "2026-03-08",
  },
  {
    id: "kb-5",
    title: "Loyalty Program Tiers",
    category: "Policies",
    content:
      "Silver (0-499 points), Gold (500-1499 points), Platinum (1500+ points). Points are earned at 1 point per dollar spent.",
    status: "draft",
    lastUpdated: "2026-03-05",
  },
];

interface KnowledgeStore {
  articles: KBArticle[];
  selectedArticleId: string | null;
  selectArticle: (id: string | null) => void;
  addArticle: (article: KBArticle) => void;
  updateArticle: (id: string, updates: Partial<KBArticle>) => void;
  removeArticle: (id: string) => void;
}

export const useKnowledgeStore = create<KnowledgeStore>()(
  persist(
    (set) => ({
      articles: defaultArticles,
      selectedArticleId: null,

      selectArticle: (id) => set({ selectedArticleId: id }),

      addArticle: (article) =>
        set((s) => ({ articles: [...s.articles, article] })),

      updateArticle: (id, updates) =>
        set((s) => ({
          articles: s.articles.map((a) =>
            a.id === id ? { ...a, ...updates } : a
          ),
        })),

      removeArticle: (id) =>
        set((s) => ({
          articles: s.articles.filter((a) => a.id !== id),
          selectedArticleId:
            s.selectedArticleId === id ? null : s.selectedArticleId,
        })),
    }),
    { name: "agentos-knowledge" }
  )
);
