import type { Metadata } from "next";
import { RoadmapPage } from "@/components/roadmap/roadmap-page";
import type { RoadmapItem } from "@/components/roadmap/types";

export const metadata: Metadata = {
  title: "Roadmap",
  description: "See what we're building and what's coming next for Blanq.",
};

const ROADMAP_ITEMS: RoadmapItem[] = [
  // ─── Completed ────────────────────────────────────────────────────────────
  {
    id: "c1",
    title: "Drag-and-drop form builder",
    description:
      "Visual editor with block-based form creation, reordering, and real-time preview.",
    status: "completed",
    category: "feature",
    quarter: "Q3 2025",
    votes: 312,
    completedAt: "2025-09-15",
  },
  {
    id: "c2",
    title: "Five built-in themes",
    description:
      "Minimal, Bold, Elegant, Playful, and Corporate themes with one-click switching.",
    status: "completed",
    category: "feature",
    quarter: "Q3 2025",
    votes: 245,
    completedAt: "2025-09-28",
  },
  {
    id: "c3",
    title: "Google OAuth sign-in",
    description: "One-click authentication with Google accounts.",
    status: "completed",
    category: "integration",
    quarter: "Q4 2025",
    votes: 189,
    completedAt: "2025-10-10",
  },
  {
    id: "c4",
    title: "CSV/Excel export",
    description:
      "Bulk export form responses in CSV and Excel formats for offline analysis.",
    status: "completed",
    category: "feature",
    quarter: "Q4 2025",
    votes: 156,
    completedAt: "2025-11-20",
  },
  {
    id: "c5",
    title: "Custom brand kit",
    description:
      "Upload your logo and set brand colors that automatically apply across all form themes.",
    status: "completed",
    category: "feature",
    quarter: "Q4 2025",
    votes: 201,
    completedAt: "2025-12-05",
  },

  // ─── In Progress ──────────────────────────────────────────────────────────
  {
    id: "ip1",
    title: "Conditional logic",
    description:
      "Show or hide fields based on previous answers. Branching paths for dynamic forms.",
    status: "in_progress",
    category: "feature",
    quarter: "Q1 2026",
    votes: 247,
  },
  {
    id: "ip2",
    title: "Response analytics dashboard",
    description:
      "Visual charts and insights for form responses — completion rates, drop-off points, and trends.",
    status: "in_progress",
    category: "feature",
    quarter: "Q1 2026",
    votes: 178,
  },
  {
    id: "ip3",
    title: "Performance optimization",
    description:
      "Faster page loads, optimized bundle size, and improved editor responsiveness.",
    status: "in_progress",
    category: "infrastructure",
    quarter: "Q1 2026",
  },

  // ─── Planned ──────────────────────────────────────────────────────────────
  {
    id: "p1",
    title: "Webhook integrations",
    description:
      "Send form data to external services via webhooks on submission. Enables Zapier, Make, and custom workflows.",
    status: "planned",
    category: "integration",
    quarter: "Q1 2026",
    votes: 189,
  },
  {
    id: "p2",
    title: "Notion integration",
    description:
      "Sync form responses directly to a Notion database automatically.",
    status: "planned",
    category: "integration",
    quarter: "Q2 2026",
    votes: 64,
  },
  {
    id: "p3",
    title: "Team workspaces",
    description:
      "Collaborative workspaces with role-based permissions for teams.",
    status: "planned",
    category: "feature",
    quarter: "Q2 2026",
    votes: 134,
  },
  {
    id: "p4",
    title: "Custom domains",
    description:
      "Host forms on your own domain with SSL. White-label form experience.",
    status: "planned",
    category: "feature",
    quarter: "Q2 2026",
    votes: 98,
  },
  {
    id: "p5",
    title: "Email notification templates",
    description:
      "Customize notification emails with your branding when new responses arrive.",
    status: "planned",
    category: "improvement",
    quarter: "Q2 2026",
    votes: 76,
  },

  // ─── Under Consideration ──────────────────────────────────────────────────
  {
    id: "uc1",
    title: "Multi-language forms",
    description:
      "Create forms in multiple languages with automatic locale detection.",
    status: "consideration",
    category: "feature",
    quarter: "Q3 2026",
    votes: 98,
  },
  {
    id: "uc2",
    title: "Stripe payment fields",
    description:
      "Accept payments directly in forms with Stripe-powered payment blocks.",
    status: "consideration",
    category: "integration",
    quarter: "Q3 2026",
    votes: 87,
  },
  {
    id: "uc3",
    title: "Form templates marketplace",
    description:
      "Community-contributed form templates you can clone and customize.",
    status: "consideration",
    category: "feature",
    quarter: "Q3 2026",
    votes: 65,
  },
  {
    id: "uc4",
    title: "API & SDK",
    description:
      "Public API and JavaScript SDK for programmatic form creation and submission management.",
    status: "consideration",
    category: "infrastructure",
    quarter: "Q3 2026",
    votes: 112,
  },
];

export default function RoadmapRoute() {
  return <RoadmapPage items={ROADMAP_ITEMS} />;
}
