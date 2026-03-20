"use client";

import { useEffect, useRef, useState } from "react";
import { useTestingStore } from "@/store/testing-store";
import { testPersonas } from "@/data/mock-personas";
import { generateAgentResponse } from "@/lib/chat-engine";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 px-4 py-3 bg-muted rounded-lg w-fit max-w-[80%]">
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
    </div>
  );
}

export function ChatSimulator() {
  const {
    selectedPersonaId,
    messages,
    isTyping,
    addMessage,
    setTyping,
    resetConversation,
  } = useTestingStore();
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef<string | null>(null);

  const persona = testPersonas.find((p) => p.id === selectedPersonaId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  useEffect(() => {
    if (persona && hasInitialized.current !== persona.id && messages.length === 0) {
      hasInitialized.current = persona.id;
      const userMsg = {
        id: `msg-${Date.now()}`,
        role: "user" as const,
        content: persona.openingMessage,
        timestamp: Date.now(),
      };
      addMessage(userMsg);
      setTyping(true);

      generateAgentResponse(persona.openingMessage, persona.mood).then((response) => {
        setTyping(false);
        addMessage(response);
      });
    }
  }, [persona, messages.length, addMessage, setTyping]);

  const handleSend = async () => {
    if (!inputValue.trim() || isTyping) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      role: "user" as const,
      content: inputValue,
      timestamp: Date.now(),
    };
    addMessage(userMsg);
    setInputValue("");
    setTyping(true);

    const response = await generateAgentResponse(inputValue, persona?.mood);
    setTyping(false);
    addMessage(response);
  };

  const handleReset = () => {
    hasInitialized.current = null;
    resetConversation();
  };

  if (!selectedPersonaId) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-sm text-muted-foreground">
          Select a test persona to start a simulated conversation.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">{persona?.emoji}</span>
          <span className="text-sm font-medium">{persona?.name}</span>
        </div>
        <Button variant="outline" size="sm" onClick={handleReset}>
          <RotateCcw className="h-3 w-3 mr-1" /> Reset
        </Button>
      </div>

      <div className="flex-1 overflow-auto space-y-3 py-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg px-4 py-2.5 text-sm",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              )}
            >
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2 pt-3 border-t">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Type a message..."
          disabled={isTyping}
        />
        <Button onClick={handleSend} disabled={isTyping || !inputValue.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
