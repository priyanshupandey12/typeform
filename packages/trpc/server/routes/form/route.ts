import { authenticatedProcedure, publicProcedure, router } from "../../trpc";
import { formService, formFieldService, formSubmissionService } from "../../services";
import { generatePath } from "../../utils/path-generator";
import { createFormInput, createFormOutput, listFormsByUserIdOutput, createFormFieldInput, createFormFieldOutput, deleteFormFieldInput, deleteFormFieldOutput, listFormFieldsInput,
listFormFieldsOutput, updateFormFieldInput, updateFormFieldOutput, getFormByIdInput, getFormByIdOutput, createFormSubmissionInput, createFormSubmissionOutput, 
getSubmissionsByFormIdInput, getSubmissionsByFormIdOutput, updateFormInput, updateFormOutput, deleteFormInput, deleteFormOutput, getFormBySlugInput, getFormBySlugOutput, getDashboardAnalyticsInput, getDashboardAnalyticsOutput, getPublicFormsInput, getPublicFormsOutput, UpdateFieldOrderInput, UpdateFieldOrderOutput} from "./model";
import z from "zod";

const TAGS = ["Form"];
const getPath = generatePath("/form");

export const formRouter = router({
  createForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/CreateForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormInput)
    .output(createFormOutput)
    .mutation(async ({ input, ctx }) => {
      const {
        title,
        description,
        slug,
        status,
        visibility,
        password,
        responseLimit,
        expiresAt,
      } = input;

      const { id } = await formService.CreateForm({
        title,
        createdBy: ctx.user.id,
        description,
        slug,
        status,
        visibility,
        password,
        responseLimit,
        expiresAt,
      });

      return {
        id,
      };
    }),

    listFormsByUserId: authenticatedProcedure.meta({
      openapi: {
        method: "GET",
        path: getPath("/ListFormsByUserId"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(z.undefined())
    .output(listFormsByUserIdOutput)
    .query(async ({  ctx }) => {

      const forms = await formService.listFormsByUserId({
        userId: ctx.user.id,
      });

      return forms;
    }),

      createFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/CreateFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(createFormFieldInput)
    .output(createFormFieldOutput)
    .mutation(async ({ input }) => {
      return formFieldService.createFormField(input);
    }),

  updateFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/UpdateFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateFormFieldInput)
    .output(updateFormFieldOutput)
    .mutation(async ({ input }) => {
      return formFieldService.updateFormField(input);
    }),

  deleteFormField: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/DeleteFormField"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteFormFieldInput)
    .output(deleteFormFieldOutput)
    .mutation(async ({ input }) => {
      return formFieldService.deleteFormField(input);
    }),

  updateFieldOrder: authenticatedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/UpdateFieldOrder"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(UpdateFieldOrderInput)
    .output(UpdateFieldOrderOutput)
    .mutation(async ({ input }) => {
      return formFieldService.updateFieldOrder(input);
    }),

  listFormFields: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/ListFormFields"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(listFormFieldsInput)
    .output(listFormFieldsOutput)
    .query(async ({ input }) => {
      return formFieldService.listFormFields({ id: input.formId });
    }),

  getFormById: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/GetFormById"),
        tags: TAGS,
        protect: false,
      },
    })
    .input(getFormByIdInput)
    .output(getFormByIdOutput)
    .query(async ({ input }) => {
      return formService.getFormById({ formId: input.formId });
    }),

  submitForm: publicProcedure
    .meta({
      openapi: {
        method: "POST",
        path: getPath("/SubmitForm"),
        tags: TAGS,
        protect: false,
      },
    })
    .input(createFormSubmissionInput)
    .output(createFormSubmissionOutput)
    .mutation(async ({ input, ctx }) => {
      return formSubmissionService.createSubmission({
        ...input,
        ip: ctx.ip,
        userAgent: ctx.userAgent,
      });
    }),
    getFormSubmissionsByFormId: authenticatedProcedure
      .meta({
        openapi: {
          method: "GET",
          path: getPath("/GetFormSubmissionsByFormId"),
          tags: TAGS,
          protect: true,
        },
      })
      .input(getSubmissionsByFormIdInput)
      .output(getSubmissionsByFormIdOutput)
      .query(async ({ input }) => {
        return formSubmissionService.getSubmissionsByFormId({ formId: input.formId });
      }),
      
  updateForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "PATCH",
        path: getPath("/UpdateForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(updateFormInput)
    .output(updateFormOutput)
    .mutation(async ({ input }) => {
      return formService.updateForm(input);
    }),

  deleteForm: authenticatedProcedure
    .meta({
      openapi: {
        method: "DELETE",
        path: getPath("/DeleteForm"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(deleteFormInput)
    .output(deleteFormOutput)
    .mutation(async ({ input }) => {
      return formService.deleteForm(input);
    }),

  getFormBySlug: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/GetFormBySlug"),
        tags: TAGS,
        protect: false,
      },
    })
    .input(getFormBySlugInput)
    .output(getFormBySlugOutput)
    .query(async ({ input }) => {
      const form = await formService.getFormBySlug(input);
      return form;
    }),

  getDashboardAnalytics: authenticatedProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/GetDashboardAnalytics"),
        tags: TAGS,
        protect: true,
      },
    })
    .input(getDashboardAnalyticsInput)
    .output(getDashboardAnalyticsOutput)
    .query(async ({ ctx }) => {
      const analytics = await formService.getDashboardAnalytics({
        userId: ctx.user.id,
      });
      return analytics;
    }),

  getPublicForms: publicProcedure
    .meta({
      openapi: {
        method: "GET",
        path: getPath("/GetPublicForms"),
        tags: TAGS,
      },
    })
    .input(getPublicFormsInput)
    .output(getPublicFormsOutput)
    .query(async ({ input }) => {
      const forms = await formService.getPublicForms(input);
      return forms;
    }),
});
