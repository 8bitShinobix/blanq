import { Bug, Sparkles, TrendingUp, Plug } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CATEGORY_CONFIG: Record<
  string,
  { label: string; icon: React.ComponentType<{ className?: string }>; className: string }
> = {
  bug: {
    label: "Bug",
    icon: Bug,
    className: "text-red-500",
  },
  feature: {
    label: "Feature",
    icon: Sparkles,
    className: "text-violet-500",
  },
  improvement: {
    label: "Improvement",
    icon: TrendingUp,
    className: "text-blue-500",
  },
  integration: {
    label: "Integration",
    icon: Plug,
    className: "text-emerald-500",
  },
};

export function CategoryBadge({ category }: { category: string }) {
  const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.feature;
  const Icon = config.icon;

  return (
    <Badge
      variant="ghost"
      className={cn(
        "gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-normal text-grey-500",
      )}
    >
      <Icon className={cn("!size-3", config.className)} />
      {config.label}
    </Badge>
  );
}
