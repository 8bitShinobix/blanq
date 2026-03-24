"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Lightbulb,
  Plus,
  Rocket,
} from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FeatureRequestSubmitForm } from "./feature-request-submit-form";
import { SearchAndFilters } from "./search-and-filters";
import { FeatureRequestList } from "./feature-request-list";
import type { FeatureRequestCardProps } from "./feature-request-card";

interface FeatureRequestPageProps {
  featureRequests: Omit<FeatureRequestCardProps, "onVote">[];
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    planned: number;
  };
  currentFilters: {
    search: string;
    status: string;
    sort: string;
  };
  onVote?: (id: string) => Promise<void>;
  onSubmit?: (data: {
    title: string;
    description: string;
    category: string;
  }) => Promise<void>;
}

export function FeatureRequestPage({
  featureRequests,
  stats,
  currentFilters,
  onVote,
  onSubmit,
}: FeatureRequestPageProps) {
  const [formOpen, setFormOpen] = useState(false);

  const hasFilters =
    !!currentFilters.search ||
    (currentFilters.status !== "all" && !!currentFilters.status);

  return (
    <>
      {/* Dashboard header bar */}
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="font-display text-lg font-medium">Feature Requests</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button
            size="sm"
            className="gap-1.5 rounded-lg"
            onClick={() => setFormOpen(!formOpen)}
          >
            <Plus className="!size-4" />
            New Request
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Stats row */}
          {stats.total > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-muted-foreground">
                {stats.total} total request{stats.total !== 1 ? "s" : ""}
              </p>
              <Separator orientation="vertical" className="h-4" />
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="size-3" />
                  {stats.completed} completed
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                  <Rocket className="size-3" />
                  {stats.inProgress} in progress
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                  <Lightbulb className="size-3" />
                  {stats.planned} planned
                </span>
              </div>
            </div>
          )}

          {/* Inline submit form (collapsible) */}
          <FeatureRequestSubmitForm
            open={formOpen}
            onOpenChange={setFormOpen}
            onSubmit={onSubmit}
          />

          {/* Search & Filters */}
          <SearchAndFilters currentFilters={currentFilters} />

          {/* Request list */}
          <FeatureRequestList
            requests={featureRequests}
            hasFilters={hasFilters}
            onVote={onVote}
          />

          {/* Footer count */}
          {featureRequests.length > 0 && (
            <p className="text-center text-xs text-muted-foreground">
              Showing {featureRequests.length} request
              {featureRequests.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
