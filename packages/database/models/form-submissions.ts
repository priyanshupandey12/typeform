import {
  pgTable,
  uuid,
  text,
  timestamp,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";

import { formsTable } from "./form";

export interface FormSubmission {
  fieldId: string;
  value: string;
}

export type FormSubmissionWithField = FormSubmission[];

export const formSubmissionsTable = pgTable("form_submissions", {
  id: uuid("id").primaryKey().defaultRandom(),

  formId: uuid("form_id")
    .notNull()
    .references(() => formsTable.id),

  values: jsonb("values").$type<FormSubmissionWithField>(),

  ipHash: varchar("ip_hash", { length: 64 }),

  userAgent: text("user_agent"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
});