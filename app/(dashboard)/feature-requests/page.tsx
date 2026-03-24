import type { Metadata } from "next";
import { FeatureRequestPage } from "@/components/feature-requests/feature-request-page";

export const metadata: Metadata = {
  title: "Feature Requests",
  description: "Vote for the features you want to see next in Blanq.",
};

// Mock data — replace with real DB queries when backend is ready
const MOCK_REQUESTS = [
  {
    id: "1",
    title: "Conditional logic for form fields",
    description:
      "Show or hide fields based on previous answers. This would make forms much more dynamic and reduce unnecessary fields for respondents.",
    status: "in_progress",
    category: "feature",
    voteCount: 247,
    hasVoted: false,
    author: { name: "Sarah Chen", image: null },
    createdAt: new Date("2025-12-15"),
  },
  {
    id: "2",
    title: "Webhook integration for form submissions",
    description:
      "Send form data to external services via webhooks when a response is submitted. Would enable Zapier, Make, and custom integrations.",
    status: "planned",
    category: "integration",
    voteCount: 189,
    hasVoted: true,
    author: { name: "Alex Rivera", image: null },
    createdAt: new Date("2026-01-03"),
  },
  {
    id: "3",
    title: "Export responses to CSV/Excel",
    description:
      "Allow bulk export of form responses in CSV and Excel formats for offline analysis.",
    status: "completed",
    category: "feature",
    voteCount: 156,
    hasVoted: false,
    author: { name: "Jamie Lee", image: null },
    createdAt: new Date("2025-11-20"),
  },
  {
    id: "4",
    title: "File upload size limit is too restrictive",
    description:
      "The current 5MB limit is too low for many use cases. Would be great to have configurable limits, especially on paid plans.",
    status: "under_review",
    category: "bug",
    voteCount: 134,
    hasVoted: false,
    author: { name: "Morgan Patel", image: null },
    createdAt: new Date("2026-02-10"),
  },
  {
    id: "5",
    title: "Multi-language form support",
    description:
      "Support for creating forms in multiple languages with automatic locale detection for respondents.",
    status: "open",
    category: "feature",
    voteCount: 98,
    hasVoted: false,
    author: { name: "Yuki Tanaka", image: null },
    createdAt: new Date("2026-02-25"),
  },
  {
    id: "6",
    title: "Improve mobile form editor experience",
    description:
      "The drag-and-drop editor is difficult to use on tablets. Needs touch-friendly interactions.",
    status: "open",
    category: "improvement",
    voteCount: 76,
    hasVoted: true,
    author: { name: "Chris Murphy", image: null },
    createdAt: new Date("2026-03-01"),
  },
  {
    id: "7",
    title: "Notion integration",
    description:
      "Sync form responses directly to a Notion database.",
    status: "planned",
    category: "integration",
    voteCount: 64,
    hasVoted: false,
    author: { name: "Priya Sharma", image: null },
    createdAt: new Date("2026-02-18"),
  },
  {
    id: "8",
    title: "Custom thank-you page with redirects",
    description: null,
    status: "completed",
    category: "feature",
    voteCount: 52,
    hasVoted: false,
    author: { name: "Ben Wright", image: null },
    createdAt: new Date("2025-10-12"),
  },
];

const MOCK_STATS = {
  total: 8,
  completed: 2,
  inProgress: 1,
  planned: 2,
};

export default async function FeatureRequestsRoute({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    category?: string;
    sort?: string;
  }>;
}) {
  const params = await searchParams;

  let filtered = [...MOCK_REQUESTS];

  if (params.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        r.title.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q),
    );
  }

  if (params.status && params.status !== "all") {
    filtered = filtered.filter((r) => r.status === params.status);
  }

  if (params.category && params.category !== "all") {
    filtered = filtered.filter((r) => r.category === params.category);
  }

  const sort = params.sort ?? "votes";
  if (sort === "newest") {
    filtered.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );
  } else if (sort === "oldest") {
    filtered.sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    );
  } else {
    filtered.sort((a, b) => b.voteCount - a.voteCount);
  }

  return (
    <FeatureRequestPage
      featureRequests={filtered}
      stats={MOCK_STATS}
      currentFilters={{
        search: params.search ?? "",
        status: params.status ?? "all",
        sort: sort,
      }}
    />
  );
}
