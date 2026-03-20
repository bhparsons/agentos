"use client";

import { useKnowledgeStore, KBArticle } from "@/store/knowledge-store";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export function KBList() {
  const { articles, selectedArticleId, selectArticle, addArticle } =
    useKnowledgeStore();

  const handleAdd = () => {
    const newArticle: KBArticle = {
      id: `kb-${Date.now()}`,
      title: "Untitled Article",
      category: "General",
      content: "",
      status: "draft",
      lastUpdated: new Date().toISOString().split("T")[0],
    };
    addArticle(newArticle);
    selectArticle(newArticle.id);
    toast.success("New article created");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">
          Articles ({articles.length})
        </h3>
        <Button size="sm" variant="outline" className="h-7 gap-1" onClick={handleAdd}>
          <Plus className="h-3 w-3" />
          Add
        </Button>
      </div>
      <div className="space-y-2">
        {articles.map((article) => (
          <Card
            key={article.id}
            className={`cursor-pointer transition-colors hover:bg-muted/50 ${
              selectedArticleId === article.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => selectArticle(article.id)}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{article.title}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {article.category} &middot; Updated {article.lastUpdated}
                  </p>
                </div>
                <Badge
                  variant={article.status === "published" ? "default" : "secondary"}
                  className="text-[10px] ml-2"
                >
                  {article.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
