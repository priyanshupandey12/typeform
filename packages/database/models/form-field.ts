import {
  pgTable,
  uuid,
  text,
  timestamp,
  pgEnum,
  varchar,
  boolean,
  numeric,
  uniqueIndex,
  jsonb,
} from "drizzle-orm/pg-core";

import { formsTable } from "./form";

export const formFieldTypeEnum = pgEnum("form_field_type", [
  "TEXT",
  "TEXTAREA",
  "SELECT",
  "CHECKBOX",
  "RADIO",
  "DATE",
  "NUMBER",
  "EMAIL",
  "PASSWORD",
  "FILE",
  "YES_NO",
  "RATING"
]);

export const formfieldsTable = pgTable(
  "form_fields",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    formId: uuid("form_id")
      .notNull()
      .references(() => formsTable.id),

    label: varchar("label", { length: 100 }).notNull(),
    labelKey: varchar("label_key", { length: 100 }).notNull(),

    description: text("description"),

    placeholder: text("placeholder"),

    isRequired: boolean("is_required").notNull().default(false),

    orderIndex: numeric("order_index", { scale: 2 }).notNull(),

    fieldType: formFieldTypeEnum("field_type").notNull(),
    options: jsonb("options"),

    validations: jsonb("validations"),

    conditionalLogic: jsonb("conditional_logic"),

    createdAt: timestamp("created_at")
      .notNull()
      .defaultNow(),

       updatedAt: timestamp("updated_at").$onUpdate(()=> new Date()).notNull()
  },
  (table) => {
    return {
      formIdIndex: uniqueIndex("form_id_order_index").on(table.formId, table.orderIndex),
    }
  }
);