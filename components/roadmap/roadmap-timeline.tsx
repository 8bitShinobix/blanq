import {
  CheckCircle2,
  Circle,
  Loader2,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Plug,
  Server,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RoadmapItem } from "./types";

const STATUS_ICON: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  completed: { icon: CheckCircle2, className: "text-emerald-500" },
  in_progress: { icon: Loader2, className: "text-violet-500" },
  planned: { icon: Circle, className: "text-indigo-400" },
  consideration: { icon: HelpCircle, className: "text-amber-400" },
};

const CATEGORY_ICON: Record<
  string,
  { icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  feature: { icon: Sparkles, className: "text-violet-500" },
  improvement: { icon: TrendingUp, className: "text-blue-500" },
  integration: { icon: Plug, className: "text-emerald-500" },
  infrastructure: { icon: Server, className: "text-amber-500" },
};

interface RoadmapTimelineProps {
  items: RoadmapItem[];
}

function groupByQuarter(items: RoadmapItem[]) {
  const groups: Record<string, RoadmapItem[]> = {};
  for (const item of items) {
    const key = item.quarter;
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  // Sort quarters in reverse (newest first)
  const sorted = Object.entries(groups).sort(([a], [b]) => b.localeCompare(a));
  return sorted;
}

export function RoadmapTimeline({ items }: RoadmapTimelineProps) {
  const quarters = groupByQuarter(items);

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {quarters.map(([quarter, quarterItems]) => {
        const completedCount = quarterItems.filter(
          (i) => i.status === "completed",
        ).length;
        const progress =
          quarterItems.length > 0
            ? Math.round((completedCount / quarterItems.length) * 100)
            : 0;

        return (
          <div key={quarter}>
            {/* Quarter header */}
            <div className="mb-3 flex items-center gap-3">
              <h3 className="font-display text-sm font-medium">{quarter}</h3>
              <div className="h-px flex-1 bg-border" />
              <span className="text-xs text-muted-foreground">
                {completedCount}/{quarterItems.length} done
              </span>
              {/* Mini progress bar */}
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-grey-100">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Items */}
            <div className="relative ml-3 border-l border-grey-200 pl-5">
              {quarterItems.map((item, index) => {
                const statusConfig =
                  STATUS_ICON[item.status] ?? STATUS_ICON.planned;
                const StatusIcon = statusConfig.icon;
                const catConfig =
                  CATEGORY_ICON[item.category] ?? CATEGORY_ICON.feature;
                const CatIcon = catConfig.icon;

                return (
                  <div
                    key={item.id}
                    className={cn(
                      "group relative pb-5 last:pb-0",
                      "animate-in fade-in-0 slide-in-from-left-2 fill-mode-both",
                    )}
                    style={{
                      animationDelay: `${index * 60}ms`,
                      animationDuration: "300ms",
                    }}
                  >
                    {/* Timeline dot */}
                    <div className="absolute -left-[27px] top-0.5 flex size-5 items-center justify-center rounded-full bg-background">
                      <StatusIcon
                        className={cn("size-4", statusConfig.className)}
                      />
                    </div>

                    {/* Content */}
                    <div className="rounded-lg border border-grey-200/60 bg-card p-3 transition-all duration-200 hover:border-grey-300 hover:shadow-sm">
                      <div className="flex items-start justify-between gap-2">
                        <h4
                          className={cn(
                            "text-sm font-medium leading-snug",
                            item.status === "completed" &&
                              "line-through decoration-muted-foreground/30",
                          )}
                        >
                          {item.title}
                        </h4>
                        <Badge
                          variant="ghost"
                          className="shrink-0 gap-1 rounded-md px-1.5 py-0 text-[10px] font-normal text-muted-foreground"
                        >
                          <CatIcon
                            className={cn("!size-2.5", catConfig.className)}
                          />
                          {item.category}
                        </Badge>
                      </div>
                      {item.description && (
                        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
