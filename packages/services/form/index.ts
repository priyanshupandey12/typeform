import { db, eq, and, inArray, desc } from "@repo/database";
import { formsTable } from "@repo/database/models/form";
import { formfieldsTable } from "@repo/database/models/form-field";
import { formSubmissionsTable } from "@repo/database/models/form-submissions";
import {
  CreateFormInput,
  listFormsByUserIdInput,
  ListFormsByUserIdInputType,
  getFormByIdInput,
  GetFormByIdInputType,
  updateFormInput,
  UpdateFormInputType,
  deleteFormInput,
  DeleteFormInputType,
  getFormBySlugInput,
  GetFormBySlugInputType,
  getDashboardAnalyticsInput,
  GetDashboardAnalyticsInputType,
  getPublicFormsInput,
  GetPublicFormsInputType,
} from "./model";

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
        createdBy: formsTable.createdBy,
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

  public async updateForm(payload: UpdateFormInputType) {
    const {
      id,
      title,
      description,
      slug,
      status,
      visibility,
      password,
      responseLimit,
      expiresAt,
    } = await updateFormInput.parseAsync(payload);

    const result = await db
      .update(formsTable)
      .set({
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(slug !== undefined && { slug }),
        ...(status !== undefined && { status }),
        ...(visibility !== undefined && { visibility }),
        ...(password !== undefined && { password }),
        ...(responseLimit !== undefined && { responseLimit }),
        ...(expiresAt !== undefined && { expiresAt }),
      })
      .where(eq(formsTable.id, id))
      .returning({ id: formsTable.id });

    if (!result[0]?.id) throw new Error("Form not found");

    return { id: result[0].id };
  }

  public async deleteForm(payload: DeleteFormInputType) {
    const { id } = await deleteFormInput.parseAsync(payload);

    // Delete related submissions
    await db
      .delete(formSubmissionsTable)
      .where(eq(formSubmissionsTable.formId, id));

    // Delete related fields
    await db
      .delete(formfieldsTable)
      .where(eq(formfieldsTable.formId, id));

    // Delete the form
    const result = await db
      .delete(formsTable)
      .where(eq(formsTable.id, id))
      .returning({ id: formsTable.id });

    if (!result[0]?.id) throw new Error("Form not found");

    return { id: result[0].id };
  }

  public async getFormBySlug(payload: GetFormBySlugInputType) {
    const { slug, password } = await getFormBySlugInput.parseAsync(payload);

    const rows = await db
      .select({
        form: {
          id: formsTable.id,
          title: formsTable.title,
          description: formsTable.description,
          slug: formsTable.slug,
          status: formsTable.status,
          visibility: formsTable.visibility,
          password: formsTable.password,
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
          eq(formsTable.slug, slug),
          eq(formsTable.status, "published")
        )
      )
      .orderBy(formfieldsTable.orderIndex);

    if (!rows.length || !rows[0]?.form) throw new Error("Form not found");

    const { password: dbPassword, ...formMetadata } = rows[0].form;
    const isPasswordProtected = !!dbPassword;

    let fields: any[] = [];
    
    // Only return fields if not password protected, or if correct password provided
    if (!isPasswordProtected || dbPassword === password) {
      fields = rows
        .filter((row) => row.field?.id !== null && row.field?.id !== undefined)
        .map((row) => row.field!);
    }

    return {
      ...formMetadata,
      isPasswordProtected,
      fields,
    };
  }

  public async getDashboardAnalytics(payload: GetDashboardAnalyticsInputType) {
    const { userId } = await getDashboardAnalyticsInput.parseAsync(payload);

    // 1. Fetch all forms for the user
    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        slug: formsTable.slug,
        status: formsTable.status,
      })
      .from(formsTable)
      .where(eq(formsTable.createdBy, userId));

    const totalForms = forms.length;
    const activeForms = forms.filter((f) => f.status === "published").length;

    if (totalForms === 0) {
      return {
        totalForms: 0,
        activeForms: 0,
        totalSubmissions: 0,
        recentSubmissions: [],
        chartData: [],
      };
    }

    const formIds = forms.map((f) => f.id);

    // 2. Fetch all submissions for these forms
    const submissions = await db
      .select({
        id: formSubmissionsTable.id,
        formId: formSubmissionsTable.formId,
        createdAt: formSubmissionsTable.createdAt,
      })
      .from(formSubmissionsTable)
      .where(inArray(formSubmissionsTable.formId, formIds))
      .orderBy(desc(formSubmissionsTable.createdAt));

    const totalSubmissions = submissions.length;

    // 3. Get recent submissions (top 10)
    // We want to return the form title along with the submission data
    const recentSubmissions = submissions.slice(0, 10).map((sub) => {
      const form = forms.find((f) => f.id === sub.formId);
      return {
        id: sub.id,
        formId: sub.formId,
        formTitle: form?.title || "Unknown Form",
        createdAt: sub.createdAt,
      };
    });

    // 4. Generate Chart Data (Last 30 days)
    const chartDataMap: Record<string, number> = {};
    const today = new Date();
    
    // Initialize last 30 days with 0
    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateString = d.toISOString().split("T")[0] as string;
      chartDataMap[dateString] = 0;
    }

    // Populate chart data
    submissions.forEach((sub) => {
      if (sub.createdAt) {
        const dateString = new Date(sub.createdAt).toISOString().split("T")[0] as string;
        if (chartDataMap[dateString] !== undefined) {
          chartDataMap[dateString]++;
        }
      }
    });

    const chartData = Object.entries(chartDataMap).map(([date, submissionsCount]) => ({
      date,
      submissions: submissionsCount,
    }));

    return {
      totalForms,
      activeForms,
      totalSubmissions,
      recentSubmissions,
      chartData,
    };
  }

  public async getPublicForms(payload: GetPublicFormsInputType) {
    const { limit } = await getPublicFormsInput.parseAsync(payload);

    const forms = await db
      .select({
        id: formsTable.id,
        title: formsTable.title,
        description: formsTable.description,
        slug: formsTable.slug,
        password: formsTable.password,
      })
      .from(formsTable)
      .where(
        and(
          eq(formsTable.status, "published"),
          eq(formsTable.visibility, "public")
        )
      )
      .limit(limit);

    return forms.map((form) => ({
      id: form.id,
      title: form.title,
      description: form.description,
      slug: form.slug,
      isPasswordProtected: !!form.password,
    }));
  }
}

export default FormServices;
