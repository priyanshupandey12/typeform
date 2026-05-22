import { db ,eq} from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import  { CreateFormInput, listFormsByUserIdInput,ListFormsByUserIdInputType } from "./model";

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


}

export default FormServices;
