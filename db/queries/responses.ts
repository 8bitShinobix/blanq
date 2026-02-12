import { eq, desc, count, sql } from "drizzle-orm";
import { db } from "..";
import { response, type NewResponse } from "../schema";

export async function createResponse(data: NewResponse) {
  const [created] = await db.insert(response).values(data).returning();
  return created;
}

export async function getResponsesByFormId(
  formId: string,
  { limit = 50, offset = 0 }: { limit?: number; offset?: number } = {},
) {
  return db.query.response.findMany({
    where: eq(response.formId, formId),
    orderBy: desc(response.createdAt),
    limit,
    offset,
  });
}

export async function getResponseCount(formId: string) {
  const [result] = await db
    .select({ count: count() })
    .from(response)
    .where(eq(response.formId, formId));
  return result.count;
}

export async function getResponseCountByDate(formId: string) {
  return db
    .select({
      date: sql<string>`date(${response.createdAt})`.as("date"),
      count: count(),
    })
    .from(response)
    .where(eq(response.formId, formId))
    .groupBy(sql`date(${response.createdAt})`)
    .orderBy(sql`date(${response.createdAt})`);
}
