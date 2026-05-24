import { createHash } from "crypto";
import { db, eq, and, desc, sql } from "@repo/database";
import { formSubmissionsTable } from "@repo/database/models/form-submissions";
import { formsTable } from "@repo/database/models/form";
import {
  createFormSubmissionInput,
  CreateFormSubmissionInputType,
  getSubmissionsByFormIdInput,
  GetSubmissionsByFormIdInputType,
} from "./model";

class FormSubmissionService {

  private hashIp(ip: string): string {
    return createHash("sha256").update(ip).digest("hex");
  }

  public async createSubmission(payload: CreateFormSubmissionInputType) {
    const { formId, values, ip, userAgent } = await createFormSubmissionInput.parseAsync(payload);

    // Verify form exists and is published
    const form = await db
      .select({ 
        id: formsTable.id,
        expiresAt: formsTable.expiresAt,
        responseLimit: formsTable.responseLimit
      })
      .from(formsTable)
      .where(
        and(
          eq(formsTable.id, formId),
          eq(formsTable.status, "published")
        )
      )
      .limit(1);

    if (!form[0]?.id) throw new Error("Form not found");

    if (form[0].expiresAt && new Date() > new Date(form[0].expiresAt)) {
      throw new Error("Form is expired");
    }

    if (form[0].responseLimit) {
      const submissionCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(formSubmissionsTable)
        .where(eq(formSubmissionsTable.formId, formId));
        
      if (Number(submissionCount[0]?.count || 0) >= form[0].responseLimit) {
        throw new Error("limit exceed of response");
      }
    }

    const ipHash = this.hashIp(ip);

    // Check for duplicate submission from same IP
    const existing = await db
      .select({ id: formSubmissionsTable.id })
      .from(formSubmissionsTable)
      .where(
        and(
          eq(formSubmissionsTable.formId, formId),
          eq(formSubmissionsTable.ipHash, ipHash)
        )
      )
      .limit(1);

    if (existing[0]?.id) {
      throw new Error("You have already submitted this form");
    }

    const result = await db
      .insert(formSubmissionsTable)
      .values({
        formId,
        values,
        ipHash,
        userAgent,
      })
      .returning({ id: formSubmissionsTable.id });

    if (!result[0]?.id) throw new Error("Something went wrong");

    return { id: result[0].id };
  }

  public async getSubmissionsByFormId(payload: GetSubmissionsByFormIdInputType) {
    const { formId } = await getSubmissionsByFormIdInput.parseAsync(payload);

    return await db
      .select({
        id: formSubmissionsTable.id,
        formId: formSubmissionsTable.formId,
        values: formSubmissionsTable.values,
        createdAt: formSubmissionsTable.createdAt,
      })
      .from(formSubmissionsTable)
      .where(eq(formSubmissionsTable.formId, formId))
      .orderBy(desc(formSubmissionsTable.createdAt));
  }
}

export default FormSubmissionService;
