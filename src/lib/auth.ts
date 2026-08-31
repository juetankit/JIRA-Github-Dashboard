import { randomUUID } from "node:crypto";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/server/db";
import * as schema from "@/server/db/schema";

function createOrganizationSlug(name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const suffix = randomUUID().slice(0, 6);

  return `${base || "workspace"}-${suffix}`;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  advanced: {
    database: {
      generateId: () => randomUUID(),
    },
  },

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          const [organization] = await db
            .insert(schema.organizations)
            .values({
              name: `${user.name}'s Workspace`,
              slug: createOrganizationSlug(user.name),
            })
            .returning();

          await db.insert(schema.organizationMembers).values({
            organizationId: organization.id,
            userId: user.id,
            role: "owner",
          });
        },
      },
    },
  },

  user: {
    modelName: "users",

    fields: {
      image: "avatarUrl",
    },
  },

  session: {
    modelName: "sessions",
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  account: {
    modelName: "accounts",
  },

  verification: {
    modelName: "verifications",
  },

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
});