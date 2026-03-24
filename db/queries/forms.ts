import { eq, and, desc, isNull, isNotNull, sql } from "drizzle-orm";
import { db } from "..";
import { form, type NewForm } from "../schema";

export async function getFormsByUserId(userId: string) {
  return db.query.form.findMany({
    where: and(eq(form.userId, userId), isNull(form.deletedAt)),
    orderBy: desc(form.updatedAt),
  });
}

export async function getFormById(id: string) {
  return db.query.form.findFirst({
    where: and(eq(form.id, id), isNull(form.deletedAt)),
  });
}

/** Get form by ID including soft-deleted forms (for restore/permanent delete). */
export async function getFormByIdIncludingDeleted(id: string) {
  return db.query.form.findFirst({
    where: eq(form.id, id),
  });
}

export async function getFormBySlug(slug: string) {
  return db.query.form.findFirst({
    where: and(eq(form.slug, slug), isNull(form.deletedAt)),
  });
}

export async function getPublishedFormBySlug(slug: string) {
  return db.query.form.findFirst({
    where: and(eq(form.slug, slug), eq(form.published, true), isNull(form.deletedAt)),
  });
}

export async function createForm(data: NewForm) {
  const [created] = await db.insert(form).values(data).returning();
  return created;
}

export async function updateForm(
  id: string,
  data: Partial<Omit<NewForm, "id" | "userId" | "createdAt">>,
) {
  const [updated] = await db
    .update(form)
    .set(data)
    .where(eq(form.id, id))
    .returning();
  return updated;
}

/** Soft delete: sets deletedAt timestamp. */
export async function deleteForm(id: string) {
  const [deleted] = await db
    .update(form)
    .set({ deletedAt: new Date() })
    .where(eq(form.id, id))
    .returning();
  return deleted;
}

/** Restore: clears deletedAt timestamp. */
export async function restoreForm(id: string) {
  const [restored] = await db
    .update(form)
    .set({ deletedAt: null })
    .where(eq(form.id, id))
    .returning();
  return restored;
}

/** Hard delete: permanently removes the form from the database. */
export async function permanentlyDeleteForm(id: string) {
  const [deleted] = await db
    .delete(form)
    .where(eq(form.id, id))
    .returning();
  return deleted;
}

/** Get all soft-deleted forms for a user. */
export async function getDeletedFormsByUser(userId: string) {
  return db.query.form.findMany({
    where: and(eq(form.userId, userId), isNotNull(form.deletedAt)),
    orderBy: desc(form.deletedAt),
    with: { workspace: true },
  });
}

/** Permanently delete all soft-deleted forms for a user. */
export async function permanentlyDeleteAllTrash(userId: string) {
  await db
    .delete(form)
    .where(and(eq(form.userId, userId), isNotNull(form.deletedAt)));
}

export async function incrementViewCount(id: string) {
  await db
    .update(form)
    .set({ viewCount: sql`${form.viewCount} + 1` })
    .where(eq(form.id, id));
}
