import {
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations";

export const githubIntegrations = pgTable("github_integrations", {
  id: uuid("id").primaryKey().defaultRandom(),

  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),

  githubInstallationId: varchar("github_installation_id", {
    length: 255,
  })
    .notNull()
    .unique(),

  githubAccountId: varchar("github_account_id", {
    length: 255,
  }).notNull(),

  githubAccountLogin: varchar("github_account_login", {
    length: 255,
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});