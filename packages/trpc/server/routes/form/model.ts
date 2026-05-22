import { z } from "zod";
import {
  FieldOptionSchema, FieldValidationSchema, ConditionalLogicSchema, FormFieldTypeEnum, CreateFormFieldInputType, GetFormFieldInputType}
 from "@repo/services/form-field/model";

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


export const listFormsByUserIdInput = z.object({
  userId: z.string().describe("uuid of the user whose forms are to be listed"),
});

export const listFormsByUserIdOutput = z.array(
  z.object({
    id: z.string().describe("form id of the form"),

    title: z.string().describe("title of the form"),

    description: z
      .string()
      .nullable()
      .optional()
      .describe("description of the form"),

    slug: z.string().describe("slug of the form"),

    status: z
      .enum(["draft", "published"])
      .optional()
      .describe("status of the form"),

    visibility: z
      .enum(["public", "unlisted"])
      .optional()
      .describe("visibility of the form"),

    responseLimit: z
      .number()
      .nullable()
      .optional()
      .describe("response limit of the form"),

    expiresAt: z
      .date()
      .nullable()
      .optional()
      .describe("expiration date of the form"),
  })
);

export const createFormFieldInput = z.object({
  formId: z.string().uuid(),
  label: z.string().min(1).max(100),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  isRequired: z.boolean().default(false),
  fieldType: FormFieldTypeEnum,
  options: z.array(FieldOptionSchema).optional(),
  validations: FieldValidationSchema.optional(),
  conditionalLogic: ConditionalLogicSchema.optional(),
});

export const createFormFieldOutput = z.object({
  id: z.string().uuid(),
});

export const updateFormFieldInput = z.object({
  id: z.string().uuid(),
  label: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  placeholder: z.string().optional(),
  isRequired: z.boolean().optional(),
  orderIndex: z.string().optional(),
  fieldType: FormFieldTypeEnum.optional(),
  options: z.array(FieldOptionSchema).optional(),
  validations: FieldValidationSchema.optional(),
  conditionalLogic: ConditionalLogicSchema.optional(),
});

export const updateFormFieldOutput = z.object({
  id: z.string().uuid(),
});

export const deleteFormFieldInput = z.object({
  id: z.string().uuid(),
});

export const deleteFormFieldOutput = z.object({
  id: z.string().uuid(),
});

export const listFormFieldsInput = z.object({
  formId: z.string().uuid(),
});

export const listFormFieldsOutput = z.array(
  z.object({
    id: z.string().uuid(),
    label: z.string(),
    labelKey: z.string(),
    description: z.string().nullable().optional(),
    placeholder: z.string().nullable().optional(),
    isRequired: z.boolean(),
    orderIndex: z.string(),
    fieldType: FormFieldTypeEnum,
    options: z.unknown().nullable().optional(),
    validations: z.unknown().nullable().optional(),
    conditionalLogic: z.unknown().nullable().optional(),
  })
);

export const getFormByIdInput = z.object({
  formId: z.string().uuid().describe("uuid of the form to retrieve"),
});

export const getFormByIdOutput = z.object({
  id: z.string().describe("form id"),
  title: z.string().describe("title of the form"),
  description: z.string().nullable().optional().describe("description of the form"),
  slug: z.string().describe("slug of the form"),
  status: z.enum(["draft", "published"]).optional().describe("status of the form"),
  visibility: z.enum(["public", "unlisted"]).optional().describe("visibility of the form"),
  responseLimit: z.number().nullable().optional().describe("response limit"),
  expiresAt: z.date().nullable().optional().describe("expiration date"),
  fields: z.array(
    z.object({
      id: z.string().uuid(),
      label: z.string(),
      labelKey: z.string(),
      description: z.string().nullable().optional(),
      placeholder: z.string().nullable().optional(),
      isRequired: z.boolean(),
      orderIndex: z.string(),
      fieldType: FormFieldTypeEnum,
      options: z.unknown().nullable().optional(),
      validations: z.unknown().nullable().optional(),
      conditionalLogic: z.unknown().nullable().optional(),
    })
  ),
});