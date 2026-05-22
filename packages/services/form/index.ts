import { db } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import  { CreateFormInput } from "./model";

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
}

export default FormServices;
