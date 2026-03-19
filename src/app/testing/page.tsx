"use client";

import { PersonaSelector } from "@/components/testing/persona-selector";
import { ChatSimulator } from "@/components/testing/chat-simulator";
import { TestResults } from "@/components/testing/test-results";

export default function TestingPage() {
  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] -m-6">
      <div className="w-64 shrink-0 overflow-auto border-r p-4">
        <PersonaSelector />
      </div>
      <div className="flex-1 flex flex-col p-4">
        <ChatSimulator />
      </div>
      <div className="w-64 shrink-0 overflow-auto border-l p-4">
        <TestResults />
      </div>
    </div>
  );
}
