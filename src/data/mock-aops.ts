import { AOP } from "@/lib/types";

export const defaultAOPs: Record<string, AOP[]> = {
  "agent-1": [
    {
      id: "aop-1",
      name: "Handle Refund Request",
      description:
        "When a customer requests a refund, verify the order details, check eligibility based on our 30-day return policy, and process the refund if eligible. If the order is outside the return window, offer store credit as an alternative. Always confirm the resolution with the customer before closing.",
      steps: [
        {
          id: "step-1",
          type: "collect_info",
          instruction:
            "Ask the customer for their order number and reason for the refund request.",
        },
        {
          id: "step-2",
          type: "action",
          instruction:
            "Look up the order in the system and verify purchase date, items, and amount.",
        },
        {
          id: "step-3",
          type: "check_condition",
          instruction:
            "Check if the order is within the 30-day return window. If yes, proceed to process refund. If no, offer store credit.",
        },
        {
          id: "step-4",
          type: "respond",
          instruction:
            "Inform the customer of the refund status and expected timeline (3-5 business days for card refunds).",
        },
        {
          id: "step-5",
          type: "action",
          instruction:
            "Process the refund in the payment system and send confirmation email.",
        },
      ],
    },
    {
      id: "aop-2",
      name: "Account Access Issue",
      description:
        "Help customers who are locked out of their account or having login difficulties. Verify identity through security questions, then assist with password reset or account unlock. Escalate to security team if suspicious activity is detected.",
      steps: [
        {
          id: "step-6",
          type: "collect_info",
          instruction:
            "Ask for the customer's email address and verify their identity with security questions.",
        },
        {
          id: "step-7",
          type: "check_condition",
          instruction:
            "Check if the account shows signs of suspicious activity (multiple failed attempts, unusual location).",
        },
        {
          id: "step-8",
          type: "escalate",
          instruction:
            "If suspicious activity detected, escalate to the security team immediately.",
        },
        {
          id: "step-9",
          type: "action",
          instruction:
            "Send a password reset link to the verified email address.",
        },
        {
          id: "step-10",
          type: "respond",
          instruction:
            "Guide the customer through the reset process and confirm they can access their account.",
        },
      ],
    },
    {
      id: "aop-3",
      name: "Billing Inquiry",
      description:
        "Address questions about charges, billing cycles, plan upgrades/downgrades, and payment method updates. Provide clear breakdowns of charges and help customers make changes to their subscription.",
      steps: [
        {
          id: "step-11",
          type: "collect_info",
          instruction:
            "Ask which charge or billing period the customer is inquiring about.",
        },
        {
          id: "step-12",
          type: "action",
          instruction:
            "Pull up the customer's billing history and current plan details.",
        },
        {
          id: "step-13",
          type: "respond",
          instruction:
            "Provide a clear breakdown of the charges, explaining each line item.",
        },
        {
          id: "step-14",
          type: "check_condition",
          instruction:
            "If the customer wants to change plans, verify eligibility and proration amounts.",
        },
        {
          id: "step-15",
          type: "action",
          instruction:
            "Process plan changes and update payment method if requested.",
        },
      ],
    },
  ],
  "agent-2": [
    {
      id: "aop-4",
      name: "Welcome & Setup",
      description:
        "Guide new users through their first experience with the platform. Walk them through account setup, initial configuration, and first key action. Celebrate milestones and offer helpful tips along the way.",
      steps: [
        {
          id: "step-16",
          type: "respond",
          instruction:
            "Welcome the user warmly and introduce yourself as their onboarding assistant.",
        },
        {
          id: "step-17",
          type: "collect_info",
          instruction:
            "Ask about their role and what they hope to accomplish with the platform.",
        },
        {
          id: "step-18",
          type: "respond",
          instruction:
            "Provide a personalized setup checklist based on their goals.",
        },
        {
          id: "step-19",
          type: "action",
          instruction:
            "Guide them through completing their profile and initial settings.",
        },
      ],
    },
  ],
};
