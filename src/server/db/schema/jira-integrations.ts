import {
  pgTable,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organizations } from "./organizations";

export const jiraIntegrations = pgTable("jira_integrations", {
  id: uuid("id").primaryKey().defaultRandom(),

  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, {
      onDelete: "cascade",
    }),

  cloudId: varchar("cloud_id", {
    length: 255,
  }).notNull().unique(),

  siteUrl: varchar("site_url", {
    length: 2048,
  }).notNull(),

  siteName: varchar("site_name", {
    length: 255,
  }),

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