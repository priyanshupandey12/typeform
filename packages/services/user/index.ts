import {db,eq} from "@repo/database"
import * as JWT from 'jsonwebtoken'
import {randomBytes,createHmac} from "node:crypto"
import {usersTable} from "@repo/database/models/user"
import {CreateUserWithEmailAndPasswordInput, generateUserTokenPayload, generateUserTokenPayloadType,SignInWithEmailAndPasswordInputType,signInWithEmailAndPasswordInput} from './model'
import { env } from "../env"

class UserServices {

   private async getUserByEmail(email:string) {
     const result=await db.select().from(usersTable).where(eq(usersTable.email,email))
     if(!result || result.length===0) return null
     return result[0]
   }

   private async generateToken(payload:generateUserTokenPayloadType){
      const {id}=await generateUserTokenPayload.parseAsync(payload)

      const token= JWT.sign({id},env.JWT_SECRET)
      return {token}

   }

    private async generateHash(salt:string,password:string){
        return createHmac('sha256',salt).update(password).digest('hex')

   }

   private async verifyToken(token:string):Promise<generateUserTokenPayloadType>{
        
         try {
            const verficationResult= JWT.verify(token,env.JWT_SECRET) as generateUserTokenPayloadType
            return verficationResult
         } catch (error) {
            throw new Error('invalid token')
         }

   }

   private async getVerifiedUserInfoById(id:string) {
      const user= await db.select({
         id:usersTable.id,
         email:usersTable.email,
         fullName:usersTable.fullName,
         profileImageUrl:usersTable.profileImageUrl
      }).from(usersTable).where(eq(usersTable.id,id))

      if(!user || user.length===0 || !user[0]) throw new Error('invalid user')

         return user[0]
   }


   public async CreateUserWithEmailAndPassword(payload:CreateUserWithEmailAndPasswordInput) {
     const {fullName,email,password}=await CreateUserWithEmailAndPasswordInput.parseAsync(payload)

     //check if user is existing or not
     const existingUser=await this.getUserByEmail(email);
     if(existingUser) {
      throw new Error(`User ith this email already exists`)
     }

      //calculate salt and hash for the password
      const salt=randomBytes(16).toString('hex')
      const hash=createHmac('sha256',salt).update(password).digest('hex')

       //create a user in db
      const userInsertResult=await db.insert(usersTable).values({fullName,email,password:hash,salt}).returning({
         id:usersTable.id
      })

      if(!userInsertResult || userInsertResult.length===0  || !userInsertResult[0]?.id) throw new Error("Something went wrong")

         const userId=userInsertResult[0].id
         const {token} = await this.generateToken({id:userId})

      return {
         id:userId,
         token
      }



   }

   public async SignInUserithEmailAndPassword(payload:SignInWithEmailAndPasswordInputType) {
      const {email,password}= await signInWithEmailAndPasswordInput.parseAsync(payload)
      
      const existingUser=await this.getUserByEmail(email);
     if(!existingUser) {
      throw new Error(` user not found with this email`)
     }

   

      if(!existingUser.password || !existingUser.salt) throw new Error("invalid authentication method")

         

      const hash=await this.generateHash(existingUser.salt,password)

      if(hash!==existingUser.password) throw new Error('Password is wrong')

         const {token} =await this.generateToken({id:existingUser.id})

           return {
            id:existingUser.id,
            token
           }
   }

   public async VerifyAndDecodeToken(token:string) {
     const {id}=await this.verifyToken(token)

     const userInfo =await this.getVerifiedUserInfoById(id)
     return {
      ...userInfo
     }
     
   }

}

export default UserServices