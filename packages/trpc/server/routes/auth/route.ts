import { CreateUserWithEmailAndPasswordInput } from "@repo/services/user/model";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { createEmailWithUserAndPasswordOutput ,SignInEmailWithUserAndPasswordOutput,SignInEmailWithUserAndPasswordInput,getUserloggedInInfoInput,getUserloggedInInfoOutput} from "./model";
import { userService } from "../../services";
import { getAuthenticationCookie, setAuthenticationCookie } from "../../utils/cookie";


const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  createUserWithEmailAndPassword:publicProcedure.meta({
     openapi:{
      method:'POST',
      path:getPath('/CreateUserWithEmailAndPassword'),
      tags:TAGS
     }
  }).input(CreateUserWithEmailAndPasswordInput).output(createEmailWithUserAndPasswordOutput).mutation(
    async ({input,ctx})=>{
      const {fullName,email,password}=input
      const {id,token} =await userService.CreateUserWithEmailAndPassword({
        fullName,email,password
      })

      setAuthenticationCookie(ctx,token)

      return {
        id
      }
    }
  ),
   signInUserWithEmailAndPassword:publicProcedure.meta({
     openapi:{
      method:'POST',
      path:getPath('/SignInUserWithEmailAndPassword'),
      tags:TAGS
     }
  }).input(SignInEmailWithUserAndPasswordInput).output(SignInEmailWithUserAndPasswordOutput).mutation(
    async ({input,ctx})=>{
      const {email,password}=input
      const {id,token} =await userService.SignInUserithEmailAndPassword({
        email,password
      })

      setAuthenticationCookie(ctx,token)

      return {
        id
      }
    }
  ),
   getLoggedInUserInfo:publicProcedure.meta({
       openapi:{
      method:'GET',
      path:getPath('/GetLoggedInUserInfo'),
      tags:TAGS
     }
   }).input(getUserloggedInInfoInput).output(getUserloggedInInfoOutput).query(async({ctx})=>{
         const token=getAuthenticationCookie(ctx)
         if(!token) throw new Error('user is not logged in')

         const {id,email,fullName,profileImageUrl}=await userService.VerifyAndDecodeToken(token)

        

         return {
           id,
           email,
           fullName,
           profileImageUrl,
         }
   })
     
});
