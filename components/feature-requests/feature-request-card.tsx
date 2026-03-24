"use client";

import { useOptimistic, useTransition } from "react";
import { ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "./status-badge";
import { CategoryBadge } from "./category-badge";
import { cn } from "@/lib/utils";

export interface FeatureRequestCardProps {
  id: string;
  title: string;
  description: string | null;
  status: string;
  category: string;
  voteCount: number;
  hasVoted: boolean;
  author: {
    name: string;
    image: string | null;
  };
  createdAt: Date;
  onVote?: (id: string) => Promise<void>;
}

export function FeatureRequestCard({
  id,
  title,
  description,
  status,
  category,
  voteCount,
  hasVoted,
  author,
  createdAt,
  onVote,
}: FeatureRequestCardProps) {
  const [isPending, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    { count: voteCount, hasVoted },
    (current) => ({
      count: current.hasVoted ? current.count - 1 : current.count + 1,
      hasVoted: !current.hasVoted,
    }),
  );

  const handleVote = () => {
    if (!onVote) return;
    startTransition(async () => {
      setOptimistic(undefined);
      await onVote(id);
    });
  };

  const initials = author.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="group flex items-start gap-3 rounded-xl border border-grey-200/60 bg-card p-4 transition-all duration-200 hover:border-grey-300 hover:shadow-sm sm:gap-4">
      {/* Upvote button */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              onClick={handleVote}
              disabled={isPending}
              className={cn(
                "flex h-auto w-12 shrink-0 flex-col items-center gap-0.5 rounded-lg border px-2 py-2 text-xs font-medium shadow-none transition-all duration-200",
                optimistic.hasVoted
                  ? "border-accent/30 bg-accent/5 text-accent hover:border-accent/50 hover:bg-accent/10"
                  : "border-grey-200 text-muted-foreground hover:border-grey-300 hover:text-foreground",
              )}
            >
              <ChevronUp
                className={cn(
                  "!size-4 transition-transform duration-200",
                  optimistic.hasVoted && "text-accent",
                )}
                strokeWidth={2.5}
              />
              <span className="tabular-nums">{optimistic.count}</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {optimistic.hasVoted ? "Remove vote" : "Upvote this request"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="text-[15px] font-medium leading-snug text-foreground">
              {title}
            </h3>
            {description && (
              <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {/* Status + Category badges */}
          <div className="hidden shrink-0 flex-col items-end gap-1.5 sm:flex">
            <StatusBadge status={status} />
            <CategoryBadge category={category} />
          </div>
        </div>

        {/* Meta row */}
        <div className="mt-2.5 flex items-center gap-2 text-xs text-muted-foreground">
          <Avatar size="sm">
            {author.image && (
              <AvatarImage src={author.image} alt={author.name} />
            )}
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
          <span className="font-medium text-muted-foreground/80">
            {author.name}
          </span>
          <span className="text-muted-foreground/40">&middot;</span>
          <span>
            {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </span>

          {/* Mobile badges */}
          <div className="ml-auto flex items-center gap-1.5 sm:hidden">
            <StatusBadge status={status} />
          </div>
        </div>
      </div>
    </div>
  );
}
