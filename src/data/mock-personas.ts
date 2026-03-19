import { TestPersona } from "@/lib/types";

export const testPersonas: TestPersona[] = [
  {
    id: "persona-1",
    name: "Angry Karen",
    emoji: "\u{1F621}",
    mood: "angry",
    scenario:
      "Received a damaged product and has been waiting 2 weeks for a replacement. This is her third time contacting support.",
    openingMessage:
      "This is absolutely UNACCEPTABLE. I ordered a laptop TWO WEEKS AGO, it arrived completely smashed, and nobody has done ANYTHING about it. I want a full refund RIGHT NOW or I'm disputing this with my bank.",
    expectedScore: 4,
  },
  {
    id: "persona-2",
    name: "Confused Carlos",
    emoji: "\u{1F615}",
    mood: "confused",
    scenario:
      "New user trying to set up his account but doesn't understand the difference between plans. Not very tech-savvy.",
    openingMessage:
      "Hi um, I just signed up but I'm not sure which plan I picked? There were so many options and I think I clicked the wrong one. Also where do I find my dashboard thing?",
    expectedScore: 3,
  },
  {
    id: "persona-3",
    name: "Polite Priya",
    emoji: "\u{1F60A}",
    mood: "polite",
    scenario:
      "Long-time customer wanting to upgrade her plan. Has a specific question about feature differences.",
    openingMessage:
      "Hello! I've been using the Basic plan for about a year now and I love it. I'm thinking about upgrading to Pro. Could you help me understand what additional features I'd get?",
    expectedScore: 5,
  },
  {
    id: "persona-4",
    name: "Impatient Ivan",
    emoji: "\u{23F1}\u{FE0F}",
    mood: "impatient",
    scenario:
      "Business user whose integration stopped working during a critical demo. Needs immediate resolution.",
    openingMessage:
      "Our Salesforce integration just broke and I have a client demo in 30 minutes. The sync stopped working. I need this fixed NOW. Order #98234.",
    expectedScore: 4,
  },
  {
    id: "persona-5",
    name: "Technical Tara",
    emoji: "\u{1F4BB}",
    mood: "technical",
    scenario:
      "Developer trying to use the API and getting a specific error. Wants detailed technical guidance.",
    openingMessage:
      "I'm getting a 429 rate limit error on the /v2/agents endpoint even though I'm well under the documented 1000 req/min limit. My current rate is ~200 req/min. Is there an undocumented sub-limit on that endpoint?",
    expectedScore: 4,
  },
];
