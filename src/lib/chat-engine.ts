import { getAgentResponse } from "@/data/mock-responses";
import { ChatMessage } from "@/lib/types";

export function generateAgentResponse(
  userMessage: string,
  mood?: string
): Promise<ChatMessage> {
  const delay = 800 + Math.random() * 1200;

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: `msg-${Date.now()}`,
        role: "agent",
        content: getAgentResponse(userMessage, mood),
        timestamp: Date.now(),
      });
    }, delay);
  });
}
