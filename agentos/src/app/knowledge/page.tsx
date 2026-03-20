"use client";

import { KBList } from "@/components/knowledge/kb-list";
import { KBEditor } from "@/components/knowledge/kb-editor";

export default function KnowledgePage() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Manage the knowledge base that agents use to resolve customer inquiries.
      </p>
      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <KBList />
        <KBEditor />
      </div>
    </div>
  );
}
