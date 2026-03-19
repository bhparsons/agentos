import { Agent } from "@/lib/types";

export const defaultAgents: Agent[] = [
  {
    id: "agent-1",
    name: "Acme Support Bot",
    personality:
      "Friendly, professional, and empathetic. Always greets customers by name when available. Uses clear, concise language and avoids jargon. Proactively offers next steps.",
    channels: { chat: true, voice: true, email: false },
    status: "deployed",
    knowledgeSources: [
      {
        id: "ks-1",
        name: "Help Center Articles",
        type: "url",
        status: "synced",
        lastSynced: "2026-03-18T10:30:00Z",
      },
      {
        id: "ks-2",
        name: "Product Documentation",
        type: "pdf",
        status: "synced",
        lastSynced: "2026-03-17T14:00:00Z",
      },
      {
        id: "ks-3",
        name: "Returns Policy",
        type: "text",
        status: "synced",
        lastSynced: "2026-03-15T09:00:00Z",
      },
      {
        id: "ks-4",
        name: "Order Status API",
        type: "api",
        status: "syncing",
      },
    ],
    aops: [],
    createdAt: "2026-02-01T08:00:00Z",
    updatedAt: "2026-03-18T10:30:00Z",
  },
  {
    id: "agent-2",
    name: "Onboarding Assistant",
    personality:
      "Warm and encouraging. Guides new users step-by-step through setup. Uses simple language and celebrates small wins. Patient with repeated questions.",
    channels: { chat: true, voice: false, email: true },
    status: "draft",
    knowledgeSources: [
      {
        id: "ks-5",
        name: "Getting Started Guide",
        type: "url",
        status: "synced",
        lastSynced: "2026-03-16T11:00:00Z",
      },
      {
        id: "ks-6",
        name: "Tutorial Videos Transcript",
        type: "text",
        status: "error",
      },
    ],
    aops: [],
    createdAt: "2026-03-10T12:00:00Z",
    updatedAt: "2026-03-16T11:00:00Z",
  },
];
