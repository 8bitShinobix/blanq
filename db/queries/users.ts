import { eq } from "drizzle-orm";
import { db } from "..";
import { user } from "../schema";

export async function getUserById(id: string) {
  return db.query.user.findFirst({
    where: eq(user.id, id),
  });
}

export async function getUserByEmail(email: string) {
  return db.query.user.findFirst({
    where: eq(user.email, email),
  });
}

export async function updateUserBrandKit(
  id: string,
  data: {
    brandPrimaryColor?: string | null;
    brandSecondaryColor?: string | null;
    logoUrl?: string | null;
  },
) {
  const [updated] = await db
    .update(user)
    .set(data)
    .where(eq(user.id, id))
    .returning();
  return updated;
}

export async function updateUserPlan(
  id: string,
  plan: "free" | "pro" | "business",
) {
  const [updated] = await db
    .update(user)
    .set({ plan })
    .where(eq(user.id, id))
    .returning();
  return updated;
}
