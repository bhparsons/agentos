"use client";

import { testPersonas } from "@/data/mock-personas";
import { useTestingStore } from "@/store/testing-store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const moodColors: Record<string, string> = {
  angry: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
  confused: "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300",
  polite: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  impatient: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
  technical: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
};

export function PersonaSelector() {
  const { selectedPersonaId, selectPersona } = useTestingStore();

  return (
    <div className="space-y-2">
      <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Test Personas
      </h3>
      {testPersonas.map((persona) => (
        <button
          key={persona.id}
          onClick={() => selectPersona(persona.id)}
          className={cn(
            "w-full rounded-lg border p-3 text-left transition-colors hover:bg-accent",
            selectedPersonaId === persona.id && "border-primary bg-accent"
          )}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{persona.emoji}</span>
            <span className="text-sm font-medium">{persona.name}</span>
          </div>
          <Badge className={cn("text-[10px] mb-1.5", moodColors[persona.mood])}>
            {persona.mood}
          </Badge>
          <p className="text-[11px] text-muted-foreground line-clamp-2">{persona.scenario}</p>
        </button>
      ))}
    </div>
  );
}
