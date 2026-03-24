import { CheckCircle2, Clock, Eye, Lightbulb, Rocket, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const STATUS_CONFIG: Record<
  string,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  open: {
    label: "Open",
    className: "bg-grey-100 text-grey-600 border-grey-200",
    icon: Clock,
  },
  under_review: {
    label: "Under Review",
    className: "bg-amber-50 text-amber-600 border-amber-200",
    icon: Eye,
  },
  planned: {
    label: "Planned",
    className: "bg-indigo-50 text-indigo-600 border-indigo-200",
    icon: Lightbulb,
  },
  in_progress: {
    label: "In Progress",
    className: "bg-violet-50 text-violet-600 border-violet-200",
    icon: Rocket,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-600 border-emerald-200",
    icon: CheckCircle2,
  },
  declined: {
    label: "Declined",
    className: "bg-red-50 text-red-500 border-red-200",
    icon: XCircle,
  },
};

export function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.open;
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium",
        config.className,
      )}
    >
      <Icon className="!size-3" />
      {config.label}
    </Badge>
  );
}
