"use client";

import { useState } from "react";
import {
  Bug,
  Sparkles,
  TrendingUp,
  Plug,
  Loader2,
  ChevronDown,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "feature", label: "Feature", icon: Sparkles },
  { value: "bug", label: "Bug", icon: Bug },
  { value: "improvement", label: "Improvement", icon: TrendingUp },
  { value: "integration", label: "Integration", icon: Plug },
] as const;

interface FeatureRequestSubmitFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: {
    title: string;
    description: string;
    category: string;
  }) => Promise<void>;
}

export function FeatureRequestSubmitForm({
  open,
  onOpenChange,
  onSubmit,
}: FeatureRequestSubmitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("feature");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || title.trim().length < 5) {
      setError("Title must be at least 5 characters.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      await onSubmit?.({
        title: title.trim(),
        description: description.trim(),
        category,
      });
      setTitle("");
      setDescription("");
      setCategory("feature");
      onOpenChange(false);
    } catch {
      setError("Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 duration-300">
        <Card className="border-grey-200/60 shadow-none">
          <CardHeader className="pb-0">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="font-display text-base font-medium">
                  Submit a Request
                </CardTitle>
                <CardDescription className="mt-1">
                  Please check existing requests before submitting a new one.
                </CardDescription>
              </div>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="icon-xs">
                  <ChevronDown className="!size-4 text-muted-foreground" />
                </Button>
              </CollapsibleTrigger>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Category selector */}
              <div>
                <label className="mb-2 block text-xs font-medium text-muted-foreground">
                  Category
                </label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = category === cat.value;
                    return (
                      <Button
                        key={cat.value}
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setCategory(cat.value)}
                        className={cn(
                          "gap-1.5 rounded-lg transition-all duration-150",
                          isActive &&
                            "border-accent/30 bg-accent/5 text-accent hover:bg-accent/10 hover:text-accent",
                        )}
                      >
                        <Icon className="!size-3.5" />
                        {cat.label}
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="fr-title"
                  className="mb-2 block text-xs font-medium text-muted-foreground"
                >
                  Title
                </label>
                <Input
                  id="fr-title"
                  placeholder="Brief summary of your request..."
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (error) setError(null);
                  }}
                  maxLength={120}
                  className="rounded-lg"
                  autoFocus={open}
                />
                <div className="mt-1 text-right text-[11px] text-muted-foreground">
                  {title.length}/120
                </div>
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="fr-desc"
                  className="mb-2 block text-xs font-medium text-muted-foreground"
                >
                  Description{" "}
                  <span className="font-normal text-muted-foreground/60">
                    (optional)
                  </span>
                </label>
                <Textarea
                  id="fr-desc"
                  placeholder="Provide more details about your request..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  maxLength={500}
                  className="min-h-20 rounded-lg"
                  rows={3}
                />
                <div className="mt-1 text-right text-[11px] text-muted-foreground">
                  {description.length}/500
                </div>
              </div>

              {error && (
                <p className="text-sm text-destructive">{error}</p>
              )}

              {/* Submit */}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSubmitting || !title.trim()}
                  className="gap-2 rounded-lg"
                >
                  {isSubmitting ? (
                    <Loader2 className="!size-4 animate-spin" />
                  ) : (
                    <Send className="!size-3.5" />
                  )}
                  Submit Request
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
