import { z } from "zod";

export const createFormInput = z.object({
  title: z.string().describe("title of the form"),
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

export const createFormOutput = z.object({
  id: z.string().describe("form id of the form"),
});
