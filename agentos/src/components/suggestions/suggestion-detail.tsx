"use client";

import { useSuggestionsStore } from "@/store/suggestions-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const statusVariant: Record<string, "default" | "secondary" | "outline" | "destructive"> = {
  draft: "secondary",
  published: "default",
  dismissed: "destructive",
};

export function SuggestionDetail() {
  const suggestions = useSuggestionsStore((s) => s.suggestions);
  const selectedId = useSuggestionsStore((s) => s.selectedSuggestionId);
  const publishSuggestion = useSuggestionsStore((s) => s.publishSuggestion);
  const dismissSuggestion = useSuggestionsStore((s) => s.dismissSuggestion);

  const suggestion = suggestions.find((s) => s.id === selectedId);

  if (!suggestion) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Select a suggestion from the list to view details
      </div>
    );
  }

  const handlePublish = () => {
    publishSuggestion(suggestion.id);
    toast.success("Article published", {
      description: `"${suggestion.title}" has been published to the knowledge base.`,
    });
  };

  const handleDismiss = () => {
    dismissSuggestion(suggestion.id);
    toast.info("Suggestion dismissed", {
      description: `"${suggestion.title}" has been dismissed.`,
    });
  };

  return (
    <div className="space-y-4 overflow-y-auto h-full">
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-lg font-semibold">{suggestion.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-muted-foreground">{suggestion.topic}</span>
            <span className="text-muted-foreground">-</span>
            <span className="text-sm text-muted-foreground">{suggestion.cluster}</span>
            <Badge variant={statusVariant[suggestion.status]}>{suggestion.status}</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {suggestion.status === "draft" && (
            <>
              <Button variant="outline" size="sm" onClick={handleDismiss}>
                Dismiss
              </Button>
              <Button size="sm" onClick={handlePublish}>
                Publish
              </Button>
            </>
          )}
          {suggestion.status === "published" && (
            <span className="text-xs text-green-600 font-medium">Published</span>
          )}
          {suggestion.status === "dismissed" && (
            <span className="text-xs text-muted-foreground font-medium">Dismissed</span>
          )}
        </div>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sample Queries</CardTitle>
          <CardDescription className="text-xs">
            Queries from conversations that could not be fully answered
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1.5">
            {suggestion.sampleQueries.map((query, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-muted-foreground/60 shrink-0">&bull;</span>
                <span>&ldquo;{query}&rdquo;</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Draft Article</CardTitle>
          <CardDescription className="text-xs">
            Auto-generated article based on conversation patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border bg-muted/30 p-4">
            <div className="prose prose-sm max-w-none text-sm whitespace-pre-wrap text-foreground/90">
              {suggestion.draftContent}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        Coverage gap: <span className="font-semibold text-orange-600">{suggestion.coverageGap}%</span>
        {" "}&middot;{" "}
        Linked conversations: {suggestion.linkedConversationIds.length}
        {" "}&middot;{" "}
        Created: {new Date(suggestion.createdAt).toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" })}
      </div>
    </div>
  );
}
