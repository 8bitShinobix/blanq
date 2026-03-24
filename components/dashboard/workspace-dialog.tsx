"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface WorkspaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "rename";
  defaultName?: string;
  onSubmit: (name: string) => void | Promise<void>;
}

export function WorkspaceDialog({
  open,
  onOpenChange,
  mode,
  defaultName = "",
  onSubmit,
}: WorkspaceDialogProps) {
  const [name, setName] = useState(defaultName);
  const [isPending, setIsPending] = useState(false);

  // Reset name when dialog opens
  useEffect(() => {
    if (open) setName(defaultName);
  }, [open, defaultName]);

  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed || isPending) return;
    setIsPending(true);
    try {
      await onSubmit(trimmed);
      onOpenChange(false);
    } catch {
      // Keep dialog open on error
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isPending ? undefined : onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create workspace" : "Rename workspace"}
          </DialogTitle>
        </DialogHeader>
        <Input
          autoFocus
          placeholder="Workspace name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          disabled={isPending}
        />
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!name.trim() || isPending}>
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {mode === "create" ? "Create" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
