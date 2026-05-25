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
import { usersTable } from "@repo/database/models/user";
import { formfieldsTable } from "@repo/database/models/form-field";
import { sendCreatorNotification, sendRespondentNotification } from "../email";

class FormSubmissionService {

  private hashIp(ip: string): string {
    return createHash("sha256").update(ip).digest("hex");
  }

  public async createSubmission(payload: CreateFormSubmissionInputType) {
    const { formId, values, ip, userAgent } = await createFormSubmissionInput.parseAsync(payload);

    // Verify form exists and is published, and fetch creator info
    const form = await db
      .select({ 
        id: formsTable.id,
        title: formsTable.title,
        expiresAt: formsTable.expiresAt,
        responseLimit: formsTable.responseLimit,
        creatorEmail: usersTable.email,
        creatorName: usersTable.fullName
      })
      .from(formsTable)
      .leftJoin(usersTable, eq(formsTable.createdBy, usersTable.id))
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

    // Notifications
    const { title: formTitle, creatorEmail, creatorName } = form[0];

    // 1. Send Creator Notification
    if (creatorEmail) {
      await sendCreatorNotification({
        toEmail: creatorEmail,
        creatorName: creatorName || "Creator",
        formTitle,
      });
    }

    // 2. Find if there's an EMAIL field to send respondent receipt
    const fields = await db
      .select({ id: formfieldsTable.id, fieldType: formfieldsTable.fieldType })
      .from(formfieldsTable)
      .where(eq(formfieldsTable.formId, formId));

    const emailFields = fields.filter((f) => f.fieldType === "EMAIL");

    // For each email field, if a value was provided, send a receipt.
    // (Assuming values is a JSON record keyed by field.id)
    const valuesRecord = values as Record<string, any>;
    for (const ef of emailFields) {
      const respondentEmail = valuesRecord[ef.id];
      if (respondentEmail && typeof respondentEmail === "string" && respondentEmail.includes("@")) {
        await sendRespondentNotification({
          toEmail: respondentEmail,
          formTitle,
        });
      }
    }

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
