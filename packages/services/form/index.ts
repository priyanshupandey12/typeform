import { db, eq, and } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import  { CreateFormInput, listFormsByUserIdInput, ListFormsByUserIdInputType, getFormByIdInput, GetFormByIdInputType } from "./model";
import { formfieldsTable } from "@repo/database/models/form-field";

class FormServices {

  public async CreateForm(payload: CreateFormInput) {
    const {
      title,
      createdBy,
      description,
      slug,
      status,
      visibility,
      password,
      responseLimit,
      expiresAt,
    } = await CreateFormInput.parseAsync(payload);

    const formInsertResult = await db
      .insert(formsTable)
      .values({
        title,
        createdBy,
        description,
        slug,
        status,
        visibility,
        password,
        responseLimit,
        expiresAt,
      })
      .returning({
        id: formsTable.id,
      });

    if (
      !formInsertResult ||
      formInsertResult.length === 0 ||
      !formInsertResult[0]?.id
    ) {
      throw new Error("Something went wrong");
    }

    return {
      id: formInsertResult[0].id,
    };
  }

  public async listFormsByUserId(payload: ListFormsByUserIdInputType) {
    const { userId } = await listFormsByUserIdInput.parseAsync(payload);

    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        slug: formsTable.slug,
        status: formsTable.status,
        visibility: formsTable.visibility,
        responseLimit: formsTable.responseLimit,
        expiresAt: formsTable.expiresAt,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId));

    return forms;
  }


  public async getFormById(payload: GetFormByIdInputType) {
    const { formId } = await getFormByIdInput.parseAsync(payload);

    const rows = await db
      .select({
        form: {
          id: formsTable.id,
          title: formsTable.title,
          description: formsTable.description,
          slug: formsTable.slug,
          status: formsTable.status,
          visibility: formsTable.visibility,
          responseLimit: formsTable.responseLimit,
          expiresAt: formsTable.expiresAt,
        },
        field: {
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
        },
      })
      .from(formsTable)
      .leftJoin(formfieldsTable, eq(formfieldsTable.formId, formsTable.id))
      .where(
        and(
          eq(formsTable.id, formId),
          eq(formsTable.status, "published")
        )
      )
      .orderBy(formfieldsTable.orderIndex);

    if (!rows.length || !rows[0]?.form) throw new Error("Form not found");

    const form = rows[0].form;
    const fields = rows
      .filter((row) => row.field?.id !== null && row.field?.id !== undefined)
      .map((row) => row.field!);

    return {
      ...form,
      fields,
    };
  }
}

export default FormServices;
