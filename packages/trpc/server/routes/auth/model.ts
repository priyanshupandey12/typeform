import {z} from 'zod'


export const createEmailWithUserAndPasswordInput=z.object({
    fullName:z.string().describe('fullName of the user'),
    email:z.email().describe('email of the user'),
    password:z.string().describe('password of the user'),
})

export const createEmailWithUserAndPasswordOutput=z.object({
    id:z.string().describe('user id of the user'),
})


export const SignInEmailWithUserAndPasswordInput=z.object({
    email:z.email().describe('email of the user'),
    password:z.string().describe('password of the user'),
})

export const SignInEmailWithUserAndPasswordOutput=z.object({
    id:z.string().describe('user id of the user'),
})

export const getUserloggedInInfoInput=z.undefined()

export const getUserloggedInInfoOutput=z.object({
  id: z.string().describe('user id of the user'),

  fullName: z.string().describe('fullName of the user'),

  email: z
    .email()
    .describe('email of the user'),

  profileImageUrl: z.string()
    .optional()
    .nullable()
    .describe('profileImageUrl of the user'),
})