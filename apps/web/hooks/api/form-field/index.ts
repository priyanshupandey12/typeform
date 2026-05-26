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

export const useUpdateFieldOrder = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateFieldOrderAsync,
    mutate: updateFieldOrder,
    error,
    failureCount,
    isIdle,
    isError,
    status,
  } = trpc.form.updateFieldOrder.useMutation({
    onMutate: async (newOrder) => {
      await utils.form.listFormFields.cancel({ formId: newOrder.formId });
      const previousFields = utils.form.listFormFields.getData({ formId: newOrder.formId });
      
      // Optimistically update the cache
      if (previousFields) {
        // Create a map of new order indices
        const orderMap = new Map<string, string>(newOrder.fields.map((f: { id: string, orderIndex: string }) => [f.id, String(f.orderIndex)]));
        
        utils.form.listFormFields.setData({ formId: newOrder.formId }, (old) => {
          if (!old) return old;
          return [...old].map(field => {
            if (orderMap.has(field.id)) {
              return { ...field, orderIndex: orderMap.get(field.id)! };
            }
            return field;
          }).sort((a, b) => parseFloat(String(a.orderIndex) || "0") - parseFloat(String(b.orderIndex) || "0"));
        });
      }
      
      return { previousFields, formId: newOrder.formId };
    },
    onError: (err, newOrder, context) => {
      if (context?.previousFields) {
        utils.form.listFormFields.setData({ formId: context.formId }, context.previousFields);
      }
    },
    onSettled: async (data, error, variables, context) => {
      if (context?.formId) {
        await utils.form.listFormFields.invalidate({ formId: context.formId });
      }
    },
  });

  return {
    updateFieldOrderAsync,
    updateFieldOrder,
    error,
    failureCount,
    isIdle,
    isError,
    status,
  };
};
