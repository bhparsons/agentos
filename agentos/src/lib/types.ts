export interface Agent {
  id: string;
  name: string;
  personality: string;
  channels: { chat: boolean; voice: boolean; email: boolean };
  tone: "professional" | "friendly" | "casual" | "empathetic";
  brandVoice: string;
  greeting: string;
  signOff: string;
  universalGuardrails: string[];
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

// --- Hillclimb / Decagon Feature Types ---

export type LifecycleStage = "identified" | "fix_in_progress" | "validating" | "shipped";

export type QueueItemFixType = "kb_article" | "aop_edit" | "experiment" | "escalation_rule";

export interface QueueItem {
  id: string;
  title: string;
  description: string;
  topic: string;
  volume: number; // conversations affected per week
  csatImpact: number; // negative delta vs baseline
  deflectionImpact: number; // percentage points lost
  stage: LifecycleStage;
  fixType: QueueItemFixType;
  owner: string;
  linkedConversationIds: string[];
  linkedSuggestionId?: string;
  linkedExperimentId?: string;
  linkedWatchtowerFlagIds: string[];
  tradeoffFlag?: string; // e.g. "May increase handle time"
  createdAt: string;
  updatedAt: string;
}

export interface Suggestion {
  id: string;
  title: string;
  topic: string;
  cluster: string;
  coverageGap: number; // 0-100, how much of the gap this fills
  sampleQueries: string[];
  draftContent: string;
  status: "draft" | "published" | "dismissed";
  linkedConversationIds: string[];
  createdAt: string;
}

export interface WatchtowerRule {
  id: string;
  name: string;
  description: string; // natural language criteria
  category: "accuracy" | "tone" | "compliance" | "process" | "safety";
  severity: "low" | "medium" | "high" | "critical";
  enabled: boolean;
  createdAt: string;
}

export interface WatchtowerFlag {
  id: string;
  ruleId: string;
  ruleName: string;
  conversationId: string;
  customerName: string;
  category: WatchtowerRule["category"];
  severity: WatchtowerRule["severity"];
  excerpt: string; // the flagged portion of the conversation
  status: "open" | "reviewed" | "false_positive";
  createdAt: string;
}

export interface RubricScore {
  criterion: string;
  score: number; // 1-5
  weight: number;
}

export type ExperimentStatus = "draft" | "active" | "completed" | "rolled_back";

export interface Experiment {
  id: string;
  name: string;
  hypothesis: string;
  description: string;
  status: ExperimentStatus;
  trafficSplit: number; // 0-100, percentage going to variant
  metrics: string[];
  autoRollbackThreshold?: number; // CSAT threshold
  linkedQueueItemId?: string;
  aopVariantId?: string;
  results?: ExperimentResults;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
}

export interface ExperimentResults {
  controlSampleSize: number;
  variantSampleSize: number;
  metrics: ExperimentMetricResult[];
}

export interface ExperimentMetricResult {
  name: string;
  controlValue: number;
  variantValue: number;
  lift: number; // percentage
  pValue: number;
  significant: boolean;
  confidenceInterval: [number, number];
}

export interface AOPVersion {
  id: string;
  aopId: string;
  agentId: string;
  version: number;
  label: string;
  steps: AOPStep[];
  description: string;
  createdAt: string;
  deployedAt?: string;
}

export type GuardrailType = "identity_verification" | "spending_limit" | "compliance" | "pii_protection";
export type GuardrailSeverity = "warn" | "block";

export interface Guardrail {
  id: string;
  name: string;
  description: string;
  type: GuardrailType;
  severity: GuardrailSeverity;
  enabled: boolean;
  config: Record<string, string>;
  assignedAopIds: string[];
  createdAt: string;
}

export interface TrajectoryTarget {
  id: string;
  metric: string;
  currentValue: number;
  targetValue: number;
  deadline: string;
  customerSet: string;
}

export interface ShippedFix {
  id: string;
  queueItemId: string;
  title: string;
  fixType: QueueItemFixType;
  shippedAt: string;
  metricsBefore: Record<string, number>;
  metricsAfter: Record<string, number>;
}

export interface TrajectoryDataPoint {
  date: string;
  deflectionRate: number;
  csat: number;
  avgResponseTime: number;
  shippedFixId?: string;
}
