"use client";

import { useKnowledgeStore } from "@/store/knowledge-store";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

const categories = ["Policies", "Billing", "Logistics", "Security", "General"];

export function KBEditor() {
  const { articles, selectedArticleId, updateArticle, removeArticle, selectArticle } =
    useKnowledgeStore();

  const article = articles.find((a) => a.id === selectedArticleId);

  if (!article) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
        Select an article to edit
      </div>
    );
  }

  const handleDelete = () => {
    removeArticle(article.id);
    selectArticle(null);
    toast.success("Article deleted");
  };

  const toggleStatus = () => {
    const newStatus = article.status === "published" ? "draft" : "published";
    updateArticle(article.id, { status: newStatus });
    toast.success(newStatus === "published" ? "Article published" : "Article unpublished");
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Edit Article</CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="h-7" onClick={toggleStatus}>
              {article.status === "published" ? "Unpublish" : "Publish"}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-destructive"
              onClick={handleDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Title</Label>
          <Input
            value={article.title}
            onChange={(e) => updateArticle(article.id, { title: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={article.category}
            onValueChange={(v) => { if (v) updateArticle(article.id, { category: v }); }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Content</Label>
          <Textarea
            value={article.content}
            onChange={(e) => updateArticle(article.id, { content: e.target.value })}
            rows={10}
            placeholder="Article content..."
          />
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <Badge variant="outline" className="text-[10px]">
            {article.status}
          </Badge>
          <span>Last updated: {article.lastUpdated}</span>
        </div>
      </CardContent>
    </Card>
  );
}
