interface ResponseRule {
  keywords: string[];
  response: string;
  moodVariants?: Partial<Record<string, string>>;
}

const rules: ResponseRule[] = [
  {
    keywords: ["refund", "money back", "return"],
    response:
      "I completely understand your frustration. Let me look into this for you right away. Could you please provide your order number so I can pull up the details and get this resolved?",
    moodVariants: {
      angry:
        "I sincerely apologize for the inconvenience you've experienced. This is not the level of service we aim to provide. Let me prioritize your refund request right now. Could you share your order number?",
      polite:
        "Of course! I'd be happy to help with your refund request. Could you share your order number so I can review the details?",
    },
  },
  {
    keywords: ["damaged", "broken", "smashed", "defective"],
    response:
      "I'm sorry to hear your item arrived damaged. That's definitely not acceptable. I'll initiate a replacement or refund for you right away. Can you confirm the order number and describe the damage?",
    moodVariants: {
      angry:
        "I am truly sorry about this. Receiving a damaged product is completely unacceptable, and I understand your frustration. Let me escalate this immediately and ensure we get you a resolution today. I'm pulling up your account now.",
    },
  },
  {
    keywords: ["plan", "upgrade", "downgrade", "pricing", "subscription"],
    response:
      "Great question! Here's a quick breakdown of our plans:\n\n**Basic** ($29/mo) - 1,000 conversations, chat only\n**Pro** ($99/mo) - 10,000 conversations, chat + email, analytics\n**Enterprise** ($299/mo) - Unlimited, all channels, custom AOPs, dedicated support\n\nWould you like to make any changes to your current plan?",
    moodVariants: {
      confused:
        "No worries at all! Let me break this down simply:\n\n**Basic** ($29/mo) - Good for getting started, covers chat support\n**Pro** ($99/mo) - Our most popular! Adds email and gives you analytics\n**Enterprise** ($299/mo) - Everything included, no limits\n\nYou're currently on Basic. Would you like me to explain any of these in more detail?",
    },
  },
  {
    keywords: ["integration", "salesforce", "api", "sync", "connect"],
    response:
      "I can help with your integration issue. Let me check the status of your connection. In the meantime, could you tell me which integration you're having trouble with and any error messages you're seeing?",
    moodVariants: {
      impatient:
        "I understand this is urgent. Let me check your integration status immediately. I can see there was a sync interruption. I'm re-initiating the connection now -- this should take about 2 minutes to restore. I'll stay with you until it's confirmed working.",
      technical:
        "I can look into that. Let me check the service status for that endpoint. There may be a per-account concurrency limit that's separate from the rate limit. Can you share your API key prefix (first 8 chars) so I can check your account-level limits?",
    },
  },
  {
    keywords: ["password", "login", "locked", "access", "sign in", "account"],
    response:
      "I can help you get back into your account. For security, I'll need to verify your identity first. Could you provide the email address associated with your account?",
  },
  {
    keywords: ["billing", "charge", "invoice", "payment"],
    response:
      "I'd be happy to help with your billing question. I can see your account's billing history. What specific charge or period are you asking about?",
  },
  {
    keywords: ["cancel", "close account", "delete"],
    response:
      "I understand you're considering canceling. Before we proceed, would you mind sharing what's prompting this decision? We may be able to address your concerns, and I want to make sure you're aware of all your options.",
  },
  {
    keywords: ["thank", "thanks", "great", "awesome", "perfect"],
    response:
      "You're welcome! I'm glad I could help. Is there anything else I can assist you with today?",
  },
  {
    keywords: ["hello", "hi", "hey", "good morning", "good afternoon"],
    response:
      "Hello! Welcome to Acme Support. I'm here to help you today. What can I assist you with?",
  },
  {
    keywords: ["rate limit", "429", "throttl"],
    response:
      "Thanks for the detailed info. The /v2/agents endpoint does have a sub-limit of 100 concurrent requests (separate from the per-minute rate limit). If you're making parallel calls, you may be hitting this concurrency cap. I'd recommend implementing request queuing with a max concurrency of 80 to stay safely under the limit.",
  },
  {
    keywords: ["demo", "presentation", "client"],
    response:
      "I understand the urgency with your upcoming demo. Let me fast-track this for you. I'm checking the system status now and will have an update within the next minute.",
  },
  {
    keywords: ["where", "find", "how do i", "dashboard"],
    response:
      "Great question! You can find your dashboard by clicking on the home icon in the top-left corner after logging in. From there, you'll see all your key metrics and quick actions. Would you like me to walk you through the main sections?",
    moodVariants: {
      confused:
        "No problem at all! After you log in, look for the little house icon in the top-left corner -- that's your dashboard. It's like your home base where you can see everything. Want me to walk you through it step by step?",
    },
  },
];

export function getAgentResponse(
  userMessage: string,
  mood?: string
): string {
  const lower = userMessage.toLowerCase();

  for (const rule of rules) {
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      if (mood && rule.moodVariants?.[mood]) {
        return rule.moodVariants[mood]!;
      }
      return rule.response;
    }
  }

  return "Thank you for reaching out. I want to make sure I understand your request correctly. Could you provide a bit more detail about what you need help with? I'm here to assist you.";
}
