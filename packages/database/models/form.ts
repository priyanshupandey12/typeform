import {
  pgTable,
  uuid,
  text,
  integer,
  timestamp,
  pgEnum,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { usersTable } from "./user";

export const formStatusEnum = pgEnum("form_status", [
  "draft",
  "published",
]);

export const formVisibilityEnum = pgEnum("form_visibility", [
  "public",
  "unlisted",
]);

export const formsTable = pgTable(
  "forms",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    createdBy: uuid("created_by")
      .notNull()
      .references(() => usersTable.id),

    title: text("title").notNull(),

    description: text("description"),

    slug: text("slug").notNull(),

    status: formStatusEnum("status")
      .notNull()
      .default("draft"),

    visibility: formVisibilityEnum("visibility")
      .notNull()
      .default("public"),

    password: text("password"),

    responseLimit: integer("response_limit"),

    expiresAt: timestamp("expires_at"),

    createdAt: timestamp("created_at")
      .notNull()
      .defaultNow(),

    updatedAt: timestamp("updated_at").$onUpdate(()=> new Date()).notNull()
  },

  (table) => {
    return {
      slugCreatedByIndex: uniqueIndex("slug_created_by_index").on(table.slug, table.createdBy),
    }
  }
);