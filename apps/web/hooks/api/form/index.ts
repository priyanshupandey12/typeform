import { trpc } from "~/trpc/client"

export const useCreateForm = () => {
    const utils = trpc.useUtils();
  const{
    mutateAsync:createFormAsync,
    mutate:createForm,
    error,
    failureCount,
    isIdle,
    isError,
    status
  }= trpc.form.createForm.useMutation({
    onSuccess:async()=>{
      await utils.form.invalidate();
    }
  });

    return {
        createFormAsync,
        createForm,
        error,
        failureCount,
        isIdle,
        isError,
        status
    }
};

export const useListFormsByUserId = () => {
  const{
    data:listFormsByUserIdData,
    error,
    isFetched,
    isFetching,
    isLoading,
    status
  }= trpc.form.listFormsByUserId.useQuery();

    return {
        listFormsByUserIdData,
        error,
        isFetched,
        isFetching,
       isLoading,
        status
    
    }
};

export const useGetFormById = (formId: string) => {
  const {
    data: formData,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  } = trpc.form.getFormById.useQuery({ formId });

  return {
    formData,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  };
};

export const useSubmitForm = () => {
  const {
    mutateAsync: submitFormAsync,
    mutate: submitForm,
    error,
    failureCount,
    isIdle,
    isError,
    status,
  } = trpc.form.submitForm.useMutation();

  return {
    submitFormAsync,
    submitForm,
    error,
    failureCount,
    isIdle,
    isError,
    status,
  };
};

export const useGetSubmissionsByFormId = (formId: string) => {
  const {
    data: submissionsData,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  } = trpc.form.getFormSubmissionsByFormId.useQuery({ formId });
   return {
    submissionsData,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  };
};

export const useUpdateForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: updateFormAsync,
    mutate: updateForm,
    error,
    status,
  } = trpc.form.updateForm.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return { updateFormAsync, updateForm, error, status };
};

export const useDeleteForm = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: deleteFormAsync,
    mutate: deleteForm,
    error,
    status,
  } = trpc.form.deleteForm.useMutation({
    onSuccess: async () => {
      await utils.form.invalidate();
    },
  });

  return { deleteFormAsync, deleteForm, error, status };
};

export const useGetFormBySlug = (slug: string, password?: string) => {
  const {
    data: formData,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  } = trpc.form.getFormBySlug.useQuery({ slug, password });

  return {
    formData,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  };
};

export const useGetDashboardAnalytics = () => {
  const {
    data: analyticsData,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  } = trpc.form.getDashboardAnalytics.useQuery();

  return {
    analyticsData,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  };
};

export const useGetPublicForms = (limit = 20) => {
  const {
    data: forms,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  } = trpc.form.getPublicForms.useQuery({ limit });

  return {
    forms,
    error,
    isFetched,
    isFetching,
    isLoading,
    status,
  };
};