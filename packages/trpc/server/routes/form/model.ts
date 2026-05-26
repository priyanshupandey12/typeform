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
  expiresAt: z.coerce.date().describe("expiration date of the form").optional(),
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

    createdBy: z.string().describe("uuid of the user who created the form"),
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
  isPasswordProtected: z.boolean().optional().describe("whether the form is password protected"),
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

export const createFormSubmissionInput = z.object({
  formId: z.string().uuid().describe("uuid of the form being submitted"),
  values: z.array(
    z.object({
      fieldId: z.string().uuid().describe("uuid of the form field"),
      value: z.string().describe("the user's answer"),
    })
  ).min(1).describe("array of field answers"),
});

export const createFormSubmissionOutput = z.object({
  id: z.string().uuid().describe("submission id"),
});

export const getSubmissionsByFormIdInput = z.object({
  formId: z.string().uuid().describe("uuid of the form whose submissions are to be retrieved"),
});

export const getSubmissionsByFormIdOutput = z.array(
  z.object({
    id: z.string().uuid(),
    formId: z.string().uuid(),
    values: z.array(
      z.object({
        fieldId: z.string().uuid(),
        value: z.union([
          z.string(),
          z.number(),
          z.boolean(),
          z.array(z.string()),
          z.null(),
        ]),
      })
    ).nullable(),
    createdAt: z.date(),
  })
);

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

export const updateFormOutput = z.object({
  id: z.string().uuid(),
});

export const deleteFormInput = z.object({
  id: z.string().uuid().describe("uuid of the form to delete"),
});

export const deleteFormOutput = z.object({
  id: z.string().uuid(),
});

export const getFormBySlugInput = z.object({
  slug: z.string().describe("slug of the form to retrieve"),
  password: z.string().optional().describe("password to unlock form if protected"),
});

export const getFormBySlugOutput = getFormByIdOutput;

export const getDashboardAnalyticsInput = z.undefined();

export const getDashboardAnalyticsOutput = z.object({
  totalForms: z.number(),
  activeForms: z.number(),
  totalSubmissions: z.number(),
  recentSubmissions: z.array(
    z.object({
      id: z.string().uuid(),
      formId: z.string().uuid(),
      formTitle: z.string(),
      createdAt: z.date().nullable(),
    })
  ),
  chartData: z.array(
    z.object({
      date: z.string(),
      submissions: z.number(),
    })
  ),
});

export const getPublicFormsInput = z.object({
  limit: z.number().optional().default(20),
});

export const getPublicFormsOutput = z.array(
  z.object({
    id: z.string().uuid(),
    title: z.string(),
    description: z.string().nullable().optional(),
    slug: z.string(),
    isPasswordProtected: z.boolean(),
  })
);

export const UpdateFieldOrderInput = z.object({
  formId: z.string().uuid(),
  fields: z.array(
    z.object({
      id: z.string().uuid(),
      orderIndex: z.string(),
    })
  )
});

export const UpdateFieldOrderOutput = z.object({
  success: z.boolean(),
});