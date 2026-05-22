import { trpc } from "~/trpc/client"

export const useCreateFormField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: createFormFieldAsync,
    mutate: createFormField,
    error,
    failureCount,
    isIdle,
    isError,
    status,
  } = trpc.form.createFormField.useMutation({
    onSuccess: async () => {
      await utils.form.listFormFields.invalidate();
    },
  });

  return {
    createFormFieldAsync,
    createFormField,
    error,
    failureCount,
    isIdle,
    isError,
    status,
  };
};

export const useUpdateFormField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateFormFieldAsync,
    mutate: updateFormField,
    error,
    failureCount,
    isIdle,
    isError,
    status,
  } = trpc.form.updateFormField.useMutation({
    onSuccess: async () => {
      await utils.form.listFormFields.invalidate();
    },
  });

  return {
    updateFormFieldAsync,
    updateFormField,
    error,
    failureCount,
    isIdle,
    isError,
    status,
  };
};

export const useDeleteFormField = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteFormFieldAsync,
    mutate: deleteFormField,
    error,
    failureCount,
    isIdle,
    isError,
    status,
  } = trpc.form.deleteFormField.useMutation({
    onSuccess: async () => {
      await utils.form.listFormFields.invalidate();
    },
  });

  return {
    deleteFormFieldAsync,
    deleteFormField,
    error,
    failureCount,
    isIdle,
    isError,
    status,
  };
};

export const useListFormFields = (formId: string) => {
  const {
    data: listFormFieldsData,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  } = trpc.form.listFormFields.useQuery({ formId });

  return {
    listFormFieldsData,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  };
};
