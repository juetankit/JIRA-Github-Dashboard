import { asc, eq } from "drizzle-orm";

import { db } from "@/server/db";
import { organizationMembers, organizations } from "@/server/db/schema";

/**
 * Every user has exactly one workspace today (auto-created at signup in
 * src/lib/auth.ts). This returns that workspace. Once multi-org membership
 * / an org switcher exists, this should take an explicit organization id
 * instead of guessing the first one.
 */
export async function getCurrentOrganizationForUser(userId: string) {
  const [row] = await db
    .select({
      id: organizations.id,
      name: organizations.name,
      slug: organizations.slug,
    })
    .from(organizationMembers)
    .innerJoin(
      organizations,
      eq(organizationMembers.organizationId, organizations.id),
    )
    .where(eq(organizationMembers.userId, userId))
    .orderBy(asc(organizationMembers.createdAt))
    .limit(1);

  return row ?? null;
}
