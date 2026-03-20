"use client";

import { useSuggestionsStore } from "@/store/suggestions-store";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  published: "default",
  dismissed: "destructive",
};

export function SuggestionList() {
  const suggestions = useSuggestionsStore((s) => s.suggestions);
  const selectedId = useSuggestionsStore((s) => s.selectedSuggestionId);
  const selectSuggestion = useSuggestionsStore((s) => s.selectSuggestion);

  const sorted = [...suggestions].sort((a, b) => b.coverageGap - a.coverageGap);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3">
        <h2 className="text-sm font-semibold">Knowledge Suggestions</h2>
        <p className="text-xs text-muted-foreground mt-1">
          {suggestions.length} suggestions ranked by coverage gap
        </p>
      </div>
      <Separator />
      <div className="flex-1 overflow-y-auto">
        {sorted.map((suggestion) => (
          <button
            key={suggestion.id}
            onClick={() => selectSuggestion(suggestion.id)}
            className={`w-full text-left px-4 py-3 border-b border-border transition-colors hover:bg-muted/50 ${
              selectedId === suggestion.id ? "bg-muted" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{suggestion.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{suggestion.topic}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-xs text-muted-foreground">{suggestion.cluster}</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1.5 shrink-0">
                <span className="text-sm font-semibold text-orange-600">
                  {suggestion.coverageGap}%
                </span>
                <Badge variant={statusVariant[suggestion.status]}>
                  {suggestion.status}
                </Badge>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
