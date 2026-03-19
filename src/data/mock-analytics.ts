import { DailyMetrics, ConversationRecord, ChatMessage } from "@/lib/types";

function generateDailyMetrics(): DailyMetrics[] {
  const metrics: DailyMetrics[] = [];
  const topics = ["Billing", "Refund", "Account Access", "Technical", "General Inquiry", "Plan Change"];

  for (let i = 29; i >= 0; i--) {
    const date = new Date(2026, 2, 19);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = isWeekend ? 80 : 150;
    const conversations = base + Math.floor(Math.random() * 60) - 20;

    const topicCounts: Record<string, number> = {};
    const weights = [0.25, 0.2, 0.15, 0.15, 0.15, 0.1];
    topics.forEach((t, idx) => {
      topicCounts[t] = Math.round(conversations * weights[idx]);
    });

    metrics.push({
      date: date.toISOString().split("T")[0],
      conversations,
      deflectionRate: 72 + Math.random() * 12,
      avgCsat: 4.1 + Math.random() * 0.6,
      avgResponseTime: 1.5 + Math.random() * 2,
      topics: topicCounts,
    });
  }
  return metrics;
}

export const dailyMetrics = generateDailyMetrics();

function makeTranscript(topic: string): ChatMessage[] {
  const transcripts: Record<string, ChatMessage[]> = {
    Billing: [
      { id: "m1", role: "user", content: "Hi, I noticed a charge of $99 on my account but I'm on the Basic plan at $29/month. Can you explain?", timestamp: Date.now() - 300000 },
      { id: "m2", role: "agent", content: "Hello! I'd be happy to look into that charge for you. Let me pull up your billing history. I can see that on March 5th, your plan was upgraded from Basic to Pro. Could this have been intentional?", timestamp: Date.now() - 280000 },
      { id: "m3", role: "user", content: "Oh, I think my colleague might have done that. Can I switch back to Basic?", timestamp: Date.now() - 260000 },
      { id: "m4", role: "agent", content: "Absolutely! I can downgrade you back to Basic right now. The $70 difference will be prorated and credited to your next billing cycle. Shall I go ahead?", timestamp: Date.now() - 240000 },
      { id: "m5", role: "user", content: "Yes please, thank you!", timestamp: Date.now() - 220000 },
      { id: "m6", role: "agent", content: "Done! Your plan has been switched back to Basic. You'll see a $70 credit on your next invoice. Is there anything else I can help with?", timestamp: Date.now() - 200000 },
    ],
    Refund: [
      { id: "m7", role: "user", content: "I need a refund for order #45231. The product was defective.", timestamp: Date.now() - 300000 },
      { id: "m8", role: "agent", content: "I'm sorry to hear about that. Let me look up order #45231 right away. I can see the order was placed 12 days ago, which is within our 30-day return window. I'll process the refund now.", timestamp: Date.now() - 280000 },
      { id: "m9", role: "user", content: "How long will it take?", timestamp: Date.now() - 260000 },
      { id: "m10", role: "agent", content: "The refund of $149.99 will be credited back to your original payment method within 3-5 business days. You'll receive a confirmation email shortly. Is there anything else I can help with?", timestamp: Date.now() - 240000 },
    ],
    "Account Access": [
      { id: "m11", role: "user", content: "I can't log into my account. It says my password is wrong but I'm sure it's correct.", timestamp: Date.now() - 300000 },
      { id: "m12", role: "agent", content: "I understand how frustrating that can be. For security, I'll need to verify your identity. Could you please provide the email address associated with your account?", timestamp: Date.now() - 280000 },
      { id: "m13", role: "user", content: "It's john.doe@email.com", timestamp: Date.now() - 260000 },
      { id: "m14", role: "agent", content: "Thank you, John. I've sent a password reset link to john.doe@email.com. Please check your inbox (and spam folder) and follow the link to set a new password. The link expires in 24 hours.", timestamp: Date.now() - 240000 },
      { id: "m15", role: "user", content: "Got it, that worked. Thanks!", timestamp: Date.now() - 220000 },
      { id: "m16", role: "agent", content: "Great to hear! You're all set. If you have any other issues, don't hesitate to reach out. Have a great day!", timestamp: Date.now() - 200000 },
    ],
    Technical: [
      { id: "m17", role: "user", content: "Your API is returning 500 errors intermittently on the /v2/conversations endpoint.", timestamp: Date.now() - 300000 },
      { id: "m18", role: "agent", content: "Thank you for reporting this. We're aware of intermittent issues with the /v2/conversations endpoint and our engineering team is actively working on a fix. The issue is related to a database migration that's in progress. ETA for resolution is within the next 2 hours.", timestamp: Date.now() - 280000 },
      { id: "m19", role: "user", content: "Is there a workaround in the meantime?", timestamp: Date.now() - 260000 },
      { id: "m20", role: "agent", content: "Yes! You can use the /v1/conversations endpoint as a temporary fallback -- it's fully operational. The response format is slightly different but the data is the same. I can share the migration guide if that would help.", timestamp: Date.now() - 240000 },
    ],
  };

  return transcripts[topic] || transcripts["Billing"];
}

const customerNames = [
  "Sarah Chen", "Marcus Johnson", "Emily Rodriguez", "David Kim", "Lisa Patel",
  "James Wilson", "Maria Garcia", "Alex Thompson", "Rachel Green", "Tom Baker",
  "Nina Kowalski", "Omar Hassan", "Sophie Martin", "Ryan Nakamura", "Anna Petrov",
  "Chris Davis", "Diana Lopez", "Ethan Wright", "Fiona O'Brien", "George Santos",
  "Hannah Lee", "Isaac Rivera", "Julia Chang",
];

const topics = ["Billing", "Refund", "Account Access", "Technical", "General Inquiry", "Plan Change"];
const channels: ("chat" | "voice" | "email")[] = ["chat", "voice", "email"];
const statuses: ("resolved" | "escalated" | "open")[] = ["resolved", "resolved", "resolved", "escalated", "open"];

export const conversationRecords: ConversationRecord[] = customerNames.map((name, i) => {
  const date = new Date(2026, 2, 19);
  date.setDate(date.getDate() - Math.floor(i * 1.3));
  const topic = topics[i % topics.length];

  return {
    id: `conv-${String(i + 1).padStart(3, "0")}`,
    customerId: `cust-${i + 1}`,
    customerName: name,
    topic,
    channel: channels[i % 3],
    csat: [5, 4, 5, 3, 4, 5, 4, 2, 5, 4, 3, 5, 4, 4, 5, 3, 4, 5, 4, 5, 3, 4, 5][i],
    status: statuses[i % 5],
    duration: 120 + Math.floor(Math.random() * 480),
    date: date.toISOString().split("T")[0],
    transcript: makeTranscript(topic),
  };
});
