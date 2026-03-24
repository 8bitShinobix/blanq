export interface RoadmapItem {
  id: string;
  title: string;
  description: string | null;
  status: "consideration" | "planned" | "in_progress" | "completed";
  category: string;
  quarter: string;
  votes?: number;
  completedAt?: string | null;
}
