import { authenticatedProcedure, router } from "../../trpc";
import { formService } from "../../services";
import { generatePath } from "../../utils/path-generator";
import { createFormInput, createFormOutput } from "./model";

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
});
