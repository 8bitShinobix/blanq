"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Loader2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { createFormAction } from "@/app/(dashboard)/forms/actions";

export function NewFormButton() {
  const router = useRouter();
  const workspaces = useWorkspaceStore((s) => s.workspaces);
  const addFormToWorkspace = useWorkspaceStore((s) => s.addFormToWorkspace);
  const [isPending, setIsPending] = useState(false);

  const handleCreate = async (workspaceId: string) => {
    if (isPending) return;
    setIsPending(true);
    try {
      const { id, slug } = await createFormAction(workspaceId);
      addFormToWorkspace(workspaceId, { id, title: "Untitled", slug });
      router.push(`/forms/${slug}`);
    } finally {
      setIsPending(false);
    }
  };

  // Single workspace — create directly without dropdown
  if (workspaces.length <= 1) {
    return (
      <Button
        size="sm"
        onClick={() => handleCreate(workspaces[0]?.id ?? "")}
        disabled={isPending}
      >
        {isPending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
        New form
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
          New form
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {workspaces.map((ws) => (
          <DropdownMenuItem
            key={ws.id}
            onClick={() => handleCreate(ws.id)}
          >
            {ws.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
