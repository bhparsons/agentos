"use client";

import { SuggestionList } from "@/components/suggestions/suggestion-list";
import { SuggestionDetail } from "@/components/suggestions/suggestion-detail";
import { TopicClusters } from "@/components/suggestions/topic-clusters";

export default function SuggestionsPage() {
  return (
    <div className="flex flex-col gap-6 h-full">
      <div className="flex gap-4 flex-1 min-h-0">
        <div className="w-80 shrink-0 border border-border rounded-lg overflow-hidden bg-card">
          <SuggestionList />
        </div>
        <div className="flex-1 min-w-0">
          <SuggestionDetail />
        </div>
      </div>
      <TopicClusters />
    </div>
  );
}
