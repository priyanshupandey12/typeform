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
  expiresAt: z.date().describe("expiration date of the form").optional(),
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
