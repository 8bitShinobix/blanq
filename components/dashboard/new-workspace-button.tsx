"use client";

import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { WorkspaceDialog } from "./workspace-dialog";

export function NewWorkspaceButton() {
  const addWorkspace = useWorkspaceStore((s) => s.addWorkspace);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <FolderPlus className="h-4 w-4" />
        New workspace
      </Button>
      <WorkspaceDialog
        open={open}
        onOpenChange={setOpen}
        mode="create"
        onSubmit={addWorkspace}
      />
    </>
  );
}
