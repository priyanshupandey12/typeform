import { z } from "zod";


export const FormFieldTypeEnum = z.enum([
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
  "RATING",
]);


export const FieldOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const FieldValidationSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
  minLength: z.number().optional(),
  maxLength: z.number().optional(),
  pattern: z.string().optional(),
});

export const ConditionalLogicSchema = z.object({
  fieldKey: z.string(),
  operator: z.enum(["equals", "not_equals", "contains", "is_empty", "is_not_empty"]),
  value: z.string(),
  action: z.enum(["show", "hide"]),
});


export const CreateFormFieldInput = z.object({
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

export type CreateFormFieldInputType = z.infer<typeof CreateFormFieldInput>;

export const UpdateFormFieldInput = z.object({
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

export type UpdateFormFieldInputType = z.infer<typeof UpdateFormFieldInput>;


export const DeleteFormFieldInput = z.object({
  id: z.string().uuid(),
});

export type DeleteFormFieldInputType = z.infer<typeof DeleteFormFieldInput>;

export const GetFormFieldInput = z.object({
  id: z.string().uuid(),
});

export type GetFormFieldInputType = z.infer<typeof GetFormFieldInput>;

export const UpdateFieldOrderInput = z.object({
  formId: z.string().uuid(),
  fields: z.array(
    z.object({
      id: z.string().uuid(),
      orderIndex: z.string(),
    })
  )
});

export type UpdateFieldOrderInputType = z.infer<typeof UpdateFieldOrderInput>;