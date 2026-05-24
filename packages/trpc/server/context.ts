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
   ip:string
   userAgent:string
}

export async function createContext({req,res}:CreateExpressContextOptions):Promise<TRPCContext> {
    const ctx:TRPCContext={
   createCookie:createCookieFactory(res),
   clearCookie: ClearCookieFactory(res),
   getCookie: getCookieFactory(req),
   user:undefined,
   ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown',
   userAgent: req.headers['user-agent'] || 'unknown',
    }
  return ctx
}
export type Context = Awaited<ReturnType<typeof createContext>>;
