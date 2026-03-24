import { requireAuth } from "@/lib/auth-guard";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { WorkspaceStoreInitializer } from "@/components/store-initializer";
import { getWorkspacesWithForms, getOrCreateDefaultWorkspace } from "@/db/queries/workspaces";
import { getDeletedFormsByUser } from "@/db/queries/forms";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAuth();

  // Ensure a default workspace always exists for this user
  await getOrCreateDefaultWorkspace(session.user.id);

  const [dbWorkspaces, deletedForms] = await Promise.all([
    getWorkspacesWithForms(session.user.id),
    getDeletedFormsByUser(session.user.id),
  ]);

  // Map DB rows to the shape the workspace store expects
  const initialWorkspaces = dbWorkspaces.map((ws) => ({
    id: ws.id,
    name: ws.name,
    isDefault: ws.isDefault,
    forms: ws.forms.map((f) => ({
      id: f.id,
      title: f.title || "Untitled",
      slug: f.slug,
    })),
  }));

  const initialTrash = deletedForms.map((f) => ({
    id: f.id,
    title: f.title || "Untitled",
    slug: f.slug,
    workspaceId: f.workspaceId ?? "",
    workspaceName: f.workspace?.name ?? "Unknown",
    deletedAt: f.deletedAt!,
  }));

  return (
    <SidebarProvider className="max-h-svh overflow-hidden">
      <WorkspaceStoreInitializer
        user={session.user}
        initialWorkspaces={initialWorkspaces}
        initialTrash={initialTrash}
      >
        <AppSidebar user={session.user} />
        <SidebarInset className="min-w-0">{children}</SidebarInset>
      </WorkspaceStoreInitializer>
    </SidebarProvider>
  );
}
