import {
  CheckCircle2,
  Circle,
  ChevronUp,
  Loader2,
  HelpCircle,
  Sparkles,
  TrendingUp,
  Plug,
  Server,
  Calendar,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { RoadmapItem } from "./types";

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    dot: string;
    icon: React.ComponentType<{ className?: string }>;
    iconClass: string;
  }
> = {
  in_progress: {
    label: "In Progress",
    dot: "bg-violet-500",
    icon: Loader2,
    iconClass: "text-violet-500",
  },
  planned: {
    label: "Planned",
    dot: "bg-indigo-400",
    icon: Circle,
    iconClass: "text-indigo-400",
  },
  consideration: {
    label: "Considering",
    dot: "bg-amber-400",
    icon: HelpCircle,
    iconClass: "text-amber-400",
  },
  completed: {
    label: "Completed",
    dot: "bg-emerald-500",
    icon: CheckCircle2,
    iconClass: "text-emerald-500",
  },
};

const CATEGORY_CONFIG: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    className: string;
  }
> = {
  feature: { label: "Feature", icon: Sparkles, className: "text-violet-500" },
  improvement: { label: "Improvement", icon: TrendingUp, className: "text-blue-500" },
  integration: { label: "Integration", icon: Plug, className: "text-emerald-500" },
  infrastructure: { label: "Infrastructure", icon: Server, className: "text-amber-500" },
};

const STATUS_ORDER = ["in_progress", "planned", "consideration", "completed"];

interface RoadmapTableProps {
  items: RoadmapItem[];
}

export function RoadmapTable({ items }: RoadmapTableProps) {
  const sorted = [...items].sort(
    (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
  );

  return (
    <Table>
      <TableHeader>
        <TableRow className="hover:bg-transparent">
          <TableHead className="w-[40%]">Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Quarter</TableHead>
          <TableHead className="text-right">Votes</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((item) => {
          const status = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.planned;
          const category = CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG.feature;
          const CatIcon = category.icon;
          const isCompleted = item.status === "completed";

          return (
            <TableRow key={item.id}>
              {/* Title + description */}
              <TableCell className="max-w-0">
                <div className="min-w-0">
                  <p
                    className={cn(
                      "truncate text-sm font-medium",
                      isCompleted && "text-muted-foreground line-through decoration-muted-foreground/30",
                    )}
                  >
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </TableCell>

              {/* Status */}
              <TableCell>
                <div className="flex items-center gap-2">
                  <span className={cn("size-2 shrink-0 rounded-full", status.dot)} />
                  <span className="text-xs text-muted-foreground">{status.label}</span>
                </div>
              </TableCell>

              {/* Category */}
              <TableCell>
                <Badge
                  variant="ghost"
                  className="gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-normal text-muted-foreground"
                >
                  <CatIcon className={cn("!size-3", category.className)} />
                  {category.label}
                </Badge>
              </TableCell>

              {/* Quarter */}
              <TableCell>
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="size-3" />
                  {item.quarter}
                </span>
              </TableCell>

              {/* Votes */}
              <TableCell className="text-right">
                {item.votes != null && item.votes > 0 ? (
                  <span className="inline-flex items-center gap-0.5 text-xs tabular-nums text-muted-foreground">
                    <ChevronUp className="size-3" />
                    {item.votes}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground/40">&mdash;</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
