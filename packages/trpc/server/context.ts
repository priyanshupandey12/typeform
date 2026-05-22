import {CreateExpressContextOptions} from '@trpc/server/adapters/express'
import {getCookieFactory,ClearCookieFactory,createCookieFactory} from './utils/cookie'

export interface TRPCCtxUser {
  id:string
}

export interface TRPCContext {
   createCookie:ReturnType<typeof createCookieFactory>
   clearCookie:ReturnType<typeof ClearCookieFactory>
   getCookie:ReturnType<typeof getCookieFactory>
   user?:TRPCCtxUser
}

export async function createContext({req,res}:CreateExpressContextOptions):Promise<TRPCContext> {
    const ctx:TRPCContext={
   createCookie:createCookieFactory(res),
   clearCookie: ClearCookieFactory(res),
   getCookie: getCookieFactory(req),
   user:undefined
    }
  return ctx
}
export type Context = Awaited<ReturnType<typeof createContext>>;
