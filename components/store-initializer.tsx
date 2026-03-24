"use client";

import { useRef } from "react";
import { useWorkspaceStore, type OwnerUser, type InitialWorkspace, type TrashedForm } from "@/stores/workspace-store";

export function WorkspaceStoreInitializer({
  user,
  initialWorkspaces,
  initialTrash,
  children,
}: {
  user: OwnerUser;
  initialWorkspaces?: InitialWorkspace[];
  initialTrash?: TrashedForm[];
  children: React.ReactNode;
}) {
  const initialized = useRef(false);
  if (!initialized.current) {
    useWorkspaceStore.getState().initialize(user, initialWorkspaces, initialTrash);
    initialized.current = true;
  }
  return <>{children}</>;
}
