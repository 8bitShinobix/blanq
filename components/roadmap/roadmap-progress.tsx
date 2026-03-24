import type { RoadmapItem } from "./types";

const SEGMENTS = [
  { key: "completed", label: "Completed", color: "bg-emerald-400", dot: "bg-emerald-500" },
  { key: "in_progress", label: "In Progress", color: "bg-violet-400", dot: "bg-violet-500" },
  { key: "planned", label: "Planned", color: "bg-indigo-300", dot: "bg-indigo-400" },
  { key: "consideration", label: "Considering", color: "bg-amber-300", dot: "bg-amber-400" },
] as const;

interface RoadmapProgressProps {
  items: RoadmapItem[];
}

export function RoadmapProgress({ items }: RoadmapProgressProps) {
  const total = items.length;
  if (total === 0) return null;

  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.status] = (counts[item.status] ?? 0) + 1;
  }

  return (
    <div className="space-y-2.5">
      {/* Stacked bar */}
      <div className="flex h-3 w-full overflow-hidden rounded-full bg-grey-100">
        {SEGMENTS.map(({ key, color }) => {
          const pct = ((counts[key] ?? 0) / total) * 100;
          if (pct === 0) return null;
          return (
            <div
              key={key}
              className={`${color} transition-all duration-700 ease-out`}
              style={{ width: `${pct}%` }}
            />
          );
        })}
      </div>

      {/* Legend — colored dots */}
      <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
        {SEGMENTS.map(({ key, label, dot }) => {
          const count = counts[key] ?? 0;
          return (
            <div key={key} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`size-2 shrink-0 rounded-full ${dot}`} />
              {label}
              <span className="tabular-nums text-foreground/70">{count}</span>
            </div>
          );
        })}
        <span className="ml-auto text-xs font-medium tabular-nums text-muted-foreground">
          {Math.round(((counts.completed ?? 0) / total) * 100)}% complete
        </span>
      </div>
    </div>
  );
}
