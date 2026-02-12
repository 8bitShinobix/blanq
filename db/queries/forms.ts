import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "..";
import { form, type NewForm } from "../schema";

export async function getFormsByUserId(userId: string) {
  return db.query.form.findMany({
    where: eq(form.userId, userId),
    orderBy: desc(form.updatedAt),
  });
}

export async function getFormById(id: string) {
  return db.query.form.findFirst({
    where: eq(form.id, id),
  });
}

export async function getFormBySlug(slug: string) {
  return db.query.form.findFirst({
    where: eq(form.slug, slug),
  });
}

export async function getPublishedFormBySlug(slug: string) {
  return db.query.form.findFirst({
    where: and(eq(form.slug, slug), eq(form.published, true)),
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

export async function deleteForm(id: string) {
  const [deleted] = await db
    .delete(form)
    .where(eq(form.id, id))
    .returning();
  return deleted;
}

export async function incrementViewCount(id: string) {
  await db
    .update(form)
    .set({ viewCount: sql`${form.viewCount} + 1` })
    .where(eq(form.id, id));
}
