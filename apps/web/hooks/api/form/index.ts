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



