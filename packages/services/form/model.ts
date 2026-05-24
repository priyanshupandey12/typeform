import { z } from "zod";

export const CreateFormInput = z.object({
  title: z.string().describe("title of the form"),
  createdBy: z.string().describe("uuid of the user who created the form"),
  description: z.string().describe("description of the form").optional(),
  slug: z.string().describe("slug of the form"),
  status: z.enum(["draft", "published"]).describe("status of the form").optional(),
  visibility: z
    .enum(["public", "unlisted"])
    .describe("visibility of the form")
    .optional(),
  password: z.string().describe("password of the form").optional(),
  responseLimit: z.number().describe("response limit of the form").optional(),
  expiresAt: z.coerce.date().describe("expiration date of the form").optional(),
});

export type CreateFormInput = z.infer<typeof CreateFormInput>;

export const listFormsByUserIdInput = z.object({
  userId: z.string().describe("uuid of the user whose forms are to be listed"),
});

export type ListFormsByUserIdInputType = z.infer<typeof listFormsByUserIdInput>;

export const getFormByIdInput = z.object({
  formId: z.string().uuid().describe("uuid of the form"),
});

export type GetFormByIdInputType = z.infer<typeof getFormByIdInput>;

export const updateFormInput = z.object({
  id: z.string().uuid().describe("uuid of the form to update"),
  title: z.string().describe("title of the form").optional(),
  description: z.string().describe("description of the form").optional(),
  slug: z.string().describe("slug of the form").optional(),
  status: z.enum(["draft", "published"]).describe("status of the form").optional(),
  visibility: z
    .enum(["public", "unlisted"])
    .describe("visibility of the form")
    .optional(),
  password: z.string().describe("password of the form").optional(),
  responseLimit: z.number().describe("response limit of the form").optional(),
  expiresAt: z.coerce.date().describe("expiration date of the form").optional(),
});

export type UpdateFormInputType = z.infer<typeof updateFormInput>;

export const deleteFormInput = z.object({
  id: z.string().uuid().describe("uuid of the form to delete"),
});

export type DeleteFormInputType = z.infer<typeof deleteFormInput>;

export const getFormBySlugInput = z.object({
  slug: z.string().describe("slug of the form"),
  password: z.string().optional().describe("password to unlock form if protected"),
});

export type GetFormBySlugInputType = z.infer<typeof getFormBySlugInput>;

export const getDashboardAnalyticsInput = z.object({
  userId: z.string().describe("uuid of the user"),
});

export type GetDashboardAnalyticsInputType = z.infer<typeof getDashboardAnalyticsInput>;

export const getPublicFormsInput = z.object({
  limit: z.number().optional().default(20),
});

export type GetPublicFormsInputType = z.infer<typeof getPublicFormsInput>;
