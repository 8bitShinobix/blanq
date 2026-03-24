import { eq, and, isNull } from "drizzle-orm";
import { db } from "..";
import { workspace, form, type NewWorkspace } from "../schema";

/** Get all workspaces for a user, including their non-deleted forms. */
export async function getWorkspacesWithForms(userId: string) {
  return db.query.workspace.findMany({
    where: eq(workspace.userId, userId),
    with: {
      forms: {
        where: isNull(form.deletedAt),
      },
    },
    orderBy: (ws, { asc }) => [asc(ws.createdAt)],
  });
}

/** Get or create the default workspace for a user. Race-safe via unique partial index. */
export async function getOrCreateDefaultWorkspace(userId: string) {
  await db
    .insert(workspace)
    .values({ userId, name: "My workspace", isDefault: true })
    .onConflictDoNothing();

  return db.query.workspace.findFirst({
    where: and(eq(workspace.userId, userId), eq(workspace.isDefault, true)),
  }) as Promise<typeof workspace.$inferSelect>;
}

export async function createWorkspace(data: NewWorkspace) {
  const [created] = await db.insert(workspace).values(data).returning();
  return created;
}

export async function getWorkspaceById(id: string) {
  return db.query.workspace.findFirst({
    where: eq(workspace.id, id),
  });
}

export async function renameWorkspace(id: string, name: string) {
  const [updated] = await db
    .update(workspace)
    .set({ name })
    .where(eq(workspace.id, id))
    .returning();
  return updated;
}

/** Move all forms from one workspace to another. */
export async function moveFormsToWorkspace(
  fromWorkspaceId: string,
  toWorkspaceId: string,
) {
  await db
    .update(form)
    .set({ workspaceId: toWorkspaceId })
    .where(eq(form.workspaceId, fromWorkspaceId));
}

export async function deleteWorkspace(id: string) {
  const [deleted] = await db
    .delete(workspace)
    .where(eq(workspace.id, id))
    .returning();
  return deleted;
}
