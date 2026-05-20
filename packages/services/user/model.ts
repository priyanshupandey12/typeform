import {z} from "zod";

export const CreateUserWithEmailAndPasswordInput = z.object({
    fullName:z.string().describe('fullName of the user'),
    email:z.string().describe('email of the user'),
    password:z.string().describe('password of the user')
})

export type CreateUserWithEmailAndPasswordInput = z.infer<typeof CreateUserWithEmailAndPasswordInput>


export const generateUserTokenPayload=z.object({
     id:z.string().describe('uuid of the user'),
})

export type generateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>

export const signInWithEmailAndPasswordInput = z.object({
    email:z.string().describe('email of the user'),
    password:z.string().describe('password of the user')
})

export type SignInWithEmailAndPasswordInputType = z.infer<typeof signInWithEmailAndPasswordInput>