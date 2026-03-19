export interface Agent {
  id: string;
  name: string;
  personality: string;
  channels: { chat: boolean; voice: boolean; email: boolean };
  status: "draft" | "deployed" | "changes_pending";
  knowledgeSources: KnowledgeSource[];
  aops: AOP[];
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  type: "url" | "pdf" | "text" | "api";
  status: "synced" | "syncing" | "error";
  lastSynced?: string;
}

export interface AOP {
  id: string;
  name: string;
  description: string;
  steps: AOPStep[];
}

export interface AOPStep {
  id: string;
  type: "respond" | "check_condition" | "escalate" | "action" | "collect_info";
  instruction: string;
}

export interface TestPersona {
  id: string;
  name: string;
  emoji: string;
  mood: "angry" | "confused" | "polite" | "impatient" | "technical";
  scenario: string;
  openingMessage: string;
  expectedScore: number;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: number;
}

export interface ConversationRecord {
  id: string;
  customerId: string;
  customerName: string;
  topic: string;
  channel: "chat" | "voice" | "email";
  csat: number;
  status: "resolved" | "escalated" | "open";
  duration: number; // seconds
  date: string;
  transcript: ChatMessage[];
}

export interface DailyMetrics {
  date: string;
  conversations: number;
  deflectionRate: number;
  avgCsat: number;
  avgResponseTime: number; // seconds
  topics: Record<string, number>;
}

export interface Integration {
  id: string;
  name: string;
  category: "CRM" | "Ticketing" | "Communication" | "Analytics" | "Knowledge";
  description: string;
  icon: string;
  connected: boolean;
  config?: Record<string, string>;
}

export interface EvaluationResult {
  greeting: boolean;
  issueIdentification: boolean;
  aopAdherence: boolean;
  accuracy: boolean;
  resolution: boolean;
}
