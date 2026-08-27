import { randomUUID } from "node:crypto";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/server/db";
import * as schema from "@/server/db/schema";

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