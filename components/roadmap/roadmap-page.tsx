"use client";

import { List, TableIcon } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { RoadmapProgress } from "./roadmap-progress";
import { RoadmapTable } from "./roadmap-table";
import { RoadmapTimeline } from "./roadmap-timeline";
import type { RoadmapItem } from "./types";

interface RoadmapPageProps {
  items: RoadmapItem[];
}

export function RoadmapPage({ items }: RoadmapPageProps) {
  return (
    <>
      {/* Dashboard header bar */}
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="font-display text-lg font-medium">Roadmap</h1>
      </header>

      {/* Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Tabs defaultValue="table" className="flex flex-1 flex-col">
          {/* Sub-header with progress + view toggle */}
          <div className="border-b px-6 py-4">
            <div className="mx-auto max-w-5xl space-y-4">
              <RoadmapProgress items={items} />

              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  See what we&apos;re building and what&apos;s coming next.
                </p>
                <TabsList className="h-8">
                  <TabsTrigger value="table" className="gap-1.5 px-3 text-xs">
                    <TableIcon className="!size-3.5" />
                    Table
                  </TabsTrigger>
                  <TabsTrigger
                    value="timeline"
                    className="gap-1.5 px-3 text-xs"
                  >
                    <List className="!size-3.5" />
                    Timeline
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
          </div>

          {/* Table view */}
          <TabsContent value="table" className="relative mt-0 flex-1">
            <div className="absolute inset-0 overflow-auto px-6 py-4">
              <RoadmapTable items={items} />
            </div>
          </TabsContent>

          {/* Timeline view */}
          <TabsContent value="timeline" className="relative mt-0 flex-1">
            <div className="absolute inset-0 overflow-auto p-6">
              <RoadmapTimeline items={items} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}
