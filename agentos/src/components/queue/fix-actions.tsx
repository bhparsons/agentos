"use client";

import { useRouter } from "next/navigation";
import { QueueItem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Wrench, FlaskConical } from "lucide-react";

interface FixActionsProps {
  item: QueueItem;
}

export function FixActions({ item }: FixActionsProps) {
  const router = useRouter();

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Fix Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {item.linkedSuggestionId && (
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start gap-2"
            onClick={() => router.push(`/suggestions?id=${item.linkedSuggestionId}`)}
          >
            <BookOpen className="h-3.5 w-3.5" />
            Draft KB Article
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() => router.push("/builder")}
        >
          <Wrench className="h-3.5 w-3.5" />
          Edit AOP
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start gap-2"
          onClick={() =>
            router.push(
              `/experiments?create=true&queueItemId=${item.id}&title=${encodeURIComponent(item.title)}`
            )
          }
        >
          <FlaskConical className="h-3.5 w-3.5" />
          Create Experiment
        </Button>
      </CardContent>
    </Card>
  );
}
