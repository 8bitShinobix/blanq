"use client";

import { useState } from "react";
import { useWorkspaceStore } from "@/stores/workspace-store";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, RotateCcw, Trash2 } from "lucide-react";

function timeAgo(date: Date): string {
  const now = Date.now();
  const diff = now - new Date(date).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "today";
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export function TrashContent() {
  const trash = useWorkspaceStore((s) => s.trash);
  const restoreForm = useWorkspaceStore((s) => s.restoreForm);
  const permanentlyDeleteForm = useWorkspaceStore((s) => s.permanentlyDeleteForm);
  const emptyTrash = useWorkspaceStore((s) => s.emptyTrash);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isEmptying, setIsEmptying] = useState(false);

  if (trash.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 px-10 text-center w-full max-w-xl">
          <Trash2 className="h-10 w-10 text-muted-foreground/40" />
          <p className="mt-4 font-display text-lg font-light text-muted-foreground">
            Trash is empty
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Deleted forms will appear here
          </p>
        </div>
      </div>
    );
  }

  const handleRestore = async (formId: string) => {
    setRestoringId(formId);
    try {
      await restoreForm(formId);
    } catch {
      // Error handled by store
    } finally {
      setRestoringId(null);
    }
  };

  const handlePermanentDelete = async (formId: string) => {
    setDeletingId(formId);
    try {
      await permanentlyDeleteForm(formId);
    } catch {
      // Error handled by store
    } finally {
      setDeletingId(null);
    }
  };

  const handleEmptyTrash = async () => {
    setIsEmptying(true);
    try {
      await emptyTrash();
    } catch {
      // Error handled by store
    } finally {
      setIsEmptying(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col">
      {/* Trash items */}
      <div className="flex-1 overflow-y-auto">
        {trash.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-3 border-b px-6 py-4"
          >
            <FileText className="h-5 w-5 shrink-0 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <span className="font-medium">{item.title}</span>
              <span className="ml-3 text-sm text-muted-foreground">
                Form &middot; Deleted {timeAgo(item.deletedAt)}
              </span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0"
              disabled={restoringId === item.id || deletingId === item.id}
              onClick={() => handleRestore(item.id)}
              title="Restore"
            >
              {restoringId === item.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RotateCcw className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-destructive hover:text-destructive"
              disabled={restoringId === item.id || deletingId === item.id}
              onClick={() => handlePermanentDelete(item.id)}
              title="Delete permanently"
            >
              {deletingId === item.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t px-6 py-4">
        <p className="text-sm text-muted-foreground">
          Permanently deletes all items in trash. This cannot be undone.
        </p>
        <Button
          variant="destructive"
          disabled={isEmptying}
          onClick={handleEmptyTrash}
        >
          {isEmptying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Empty trash
        </Button>
      </div>
    </div>
  );
}
