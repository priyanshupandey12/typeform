
import { trpc } from "~/trpc/client"
export const useSignUpForm =()=> {
  const utils=trpc.useUtils()
  const {
    mutateAsync:createUserWithEmailAndPasswordAsync,
    mutate:createUserWithEmailAndPassword,
    error,
    failureCount,
    isIdle,
    isError,
    status

} =trpc.auth.createUserWithEmailAndPassword.useMutation({
  onSuccess:async()=>{
    await utils.auth.getLoggedInUserInfo.invalidate()
  }
})
 return {
    createUserWithEmailAndPasswordAsync,
    createUserWithEmailAndPassword,
    error,
    failureCount,
    isIdle,
    isError,
    status
 }
}

export const useSignInForm =()=> {
   const utils=trpc.useUtils()
  const {
    mutateAsync:signInUserWithEmailAndPasswordAsync,
    mutate:signInUserWithEmailAndPassword,
    error,
    failureCount,
    isIdle,
    isError,
    status

} =trpc.auth.signInUserWithEmailAndPassword.useMutation({
    onSuccess:async()=>{
    await utils.auth.getLoggedInUserInfo.invalidate()
  }
})
 return {
    signInUserWithEmailAndPasswordAsync,
    signInUserWithEmailAndPassword,
    error,
    failureCount,
    isIdle,
    isError,
    status
 }
}

export const useLoggedIn =()=> {
  const {
  data:user,
  error,
  isFetched,
  isFetching,
  status
} =trpc.auth.getLoggedInUserInfo.useQuery()
 return {
   user,
   error,
   isFetched,
   isFetching,
   isLoading: status === "pending",
   isError: status === "error",
   status
 }
}

export const useSignOut = () => {
  const utils = trpc.useUtils();
  const {
    mutateAsync: signOutAsync,
    mutate: signOut,
    status
  } = trpc.auth.signOut.useMutation({
    onSuccess: async () => {
      utils.auth.getLoggedInUserInfo.reset(); // clear cache
    }
  });

  return {
    signOutAsync,
    signOut,
    isLoading: status === "pending",
  };
};