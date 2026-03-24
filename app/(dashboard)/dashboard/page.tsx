import type { Metadata } from "next";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { NewFormButton } from "@/components/dashboard/new-form-button";
import { NewWorkspaceButton } from "@/components/dashboard/new-workspace-button";
import { requireAuth } from "@/lib/auth-guard";
import { getWorkspacesWithForms } from "@/db/queries/workspaces";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { FormRow } from "@/components/dashboard/form-row";

export const metadata: Metadata = {
  title: "Home",
};

export default async function DashboardPage() {
  const session = await requireAuth();
  const workspaces = await getWorkspacesWithForms(session.user.id);

  // Flatten workspaces into a list of forms with workspace info
  const forms = workspaces.flatMap((ws) =>
    ws.forms.map((f) => ({
      id: f.id,
      title: f.title || "Untitled Form",
      slug: f.slug,
      published: f.published,
      updatedAt: f.updatedAt,
      workspaceId: ws.id,
      workspaceName: ws.name,
    }))
  );

  // Sort by most recently updated
  forms.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <>
      {/* Top bar */}
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <h1 className="font-display text-lg font-medium">Home</h1>
        <div className="ml-auto flex items-center gap-2">
          <NewWorkspaceButton />
          <NewFormButton />
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 p-6">
        {forms.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-20 text-center">
            <p className="font-display text-lg font-light text-muted-foreground">
              No forms yet
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Create your first form to get started
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Workspace</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {forms.map((form) => (
                <FormRow key={form.id} form={form} />
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
}
