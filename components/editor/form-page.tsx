"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { FormEditor } from "./form-editor";
import { EditorToolbar } from "./editor-toolbar";
import { PublishedView } from "./published-view";
import { useFormContentStore } from "@/stores/form-content-store";
import { useWorkspaceStore } from "@/stores/workspace-store";

export function FormPage() {
  const title = useFormContentStore((s) => s.title);
  const published = useFormContentStore((s) => s.published);
  const workspaceId = useFormContentStore((s) => s.workspaceId);
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const workspaceName = workspaces.find((ws) => ws.id === workspaceId)?.name ?? "My workspace";
  const displayTitle = title || "Untitled";

  if (published) {
    return <PublishedView />;
  }

  return (
    <>
      {/* Top bar */}
      <header className="flex h-14 shrink-0 items-center gap-2 border-b px-2 sm:px-4">
        <SidebarTrigger className="shrink-0" />
        <Separator orientation="vertical" className="mr-1 h-4 sm:mr-2" />
        <Breadcrumb className="min-w-0">
          <BreadcrumbList className="flex-nowrap">
            <BreadcrumbItem className="hidden sm:inline-flex">
              <BreadcrumbLink href="/dashboard">{workspaceName}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden sm:inline-flex" />
            <BreadcrumbItem className="min-w-0">
              <BreadcrumbPage className="truncate">{displayTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <EditorToolbar />
      </header>

      {/* Editor canvas */}
      <FormEditor />
    </>
  );
}
