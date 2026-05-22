import { db, eq, and, inArray, desc } from "@repo/database";
import { formfieldsTable } from "@repo/database/models/form-field";
import { formsTable } from "@repo/database/models/form";
import {
  CreateFormFieldInput,
  CreateFormFieldInputType,
    UpdateFormFieldInput,
    UpdateFormFieldInputType,
    DeleteFormFieldInput,
    DeleteFormFieldInputType,
    GetFormFieldInput,
    GetFormFieldInputType,
} from "./model";

class FormFieldService {

  private generateLabelKey(label: string): string {
    return label
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "_");
  }


private async getNextIndex(formId: string): Promise<string> {
  const result = await db
    .select({ orderIndex: formfieldsTable.orderIndex })
    .from(formfieldsTable)
    .where(eq(formfieldsTable.formId, formId))
    .orderBy(desc(formfieldsTable.orderIndex))
    .limit(1);

  const last = result[0]?.orderIndex;
  const next = last ? parseFloat(last) + 1 : 1;
  return next.toFixed(2);
}

  public async createFormField(payload: CreateFormFieldInputType) {
    const {
      formId,
      label,
      description,
      placeholder,
      isRequired,
      fieldType,
      options,
      validations,
      conditionalLogic,
    } = await CreateFormFieldInput.parseAsync(payload);

  
    const form = await db
      .select({ id: formsTable.id })
      .from(formsTable)
      .where(eq(formsTable.id, formId))
      .limit(1);

    if (!form[0]?.id) throw new Error("Form not found");

    const labelKey = this.generateLabelKey(label);
    const orderIndex = await this.getNextIndex(formId);

    const result = await db
      .insert(formfieldsTable)
      .values({
        formId,
        label,
        labelKey,
        description,
        placeholder,
        isRequired,
        orderIndex,
        fieldType,
        options,
        validations,
        conditionalLogic,
      })
      .returning({ id: formfieldsTable.id });

    if (!result[0]?.id) throw new Error("Something went wrong");

    return { id: result[0].id ,labelKey,orderIndex};
  }

  public async updateFormField(payload: UpdateFormFieldInputType) {
  const {
    id,
    label,
    description,
    placeholder,
    isRequired,
    orderIndex,
    fieldType,
    options,
    validations,
    conditionalLogic,
  } = await UpdateFormFieldInput.parseAsync(payload);

  const result = await db
    .update(formfieldsTable)
    .set({
      ...(label && { label, labelKey: this.generateLabelKey(label) }),
      ...(description !== undefined && { description }),
      ...(placeholder !== undefined && { placeholder }),
      ...(isRequired !== undefined && { isRequired }),
      ...(orderIndex !== undefined && { orderIndex }),
      ...(fieldType && { fieldType }),
      ...(options !== undefined && { options }),
      ...(validations !== undefined && { validations }),
      ...(conditionalLogic !== undefined && { conditionalLogic }),
    })
    .where(eq(formfieldsTable.id, id))
    .returning({ id: formfieldsTable.id });

  if (!result[0]?.id) throw new Error("Field not found");

  return { id: result[0]!.id };
}

public async deleteFormField(id: DeleteFormFieldInputType) {
    const { id: fieldId } = await DeleteFormFieldInput.parseAsync(id);
  const result = await db
    .delete(formfieldsTable)
    .where(eq(formfieldsTable.id, fieldId))
    .returning({ id: formfieldsTable.id });

  if (!result[0]?.id) throw new Error("Field not found");

  return { id: result[0]!.id };
}
public async listFormFields(formId: GetFormFieldInputType) {
    const { id: formIdParsed } = await GetFormFieldInput.parseAsync(formId);
  return db
    .select({
      id: formfieldsTable.id,
      label: formfieldsTable.label,
      labelKey: formfieldsTable.labelKey,
      description: formfieldsTable.description,
      placeholder: formfieldsTable.placeholder,
      isRequired: formfieldsTable.isRequired,
      orderIndex: formfieldsTable.orderIndex,
      fieldType: formfieldsTable.fieldType,
      options: formfieldsTable.options,
      validations: formfieldsTable.validations,
      conditionalLogic: formfieldsTable.conditionalLogic,
    })
    .from(formfieldsTable)
    .where(eq(formfieldsTable.formId, formIdParsed))
    .orderBy(formfieldsTable.orderIndex);
}
}

    




export default FormFieldService;