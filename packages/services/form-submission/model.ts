import { z } from "zod";

export const FormSubmissionValueSchema = z.object({
  fieldId: z.string().uuid(),
  value: z.string(),
});

export const createFormSubmissionInput = z.object({
  formId: z.string().uuid(),
  values: z.array(FormSubmissionValueSchema).min(1),
  ip: z.string(),
  userAgent: z.string(),
});

export type CreateFormSubmissionInputType = z.infer<typeof createFormSubmissionInput>;

export const getSubmissionsByFormIdInput = z.object({
  formId: z.string().uuid(),
});

export type GetSubmissionsByFormIdInputType = z.infer<typeof getSubmissionsByFormIdInput>;
