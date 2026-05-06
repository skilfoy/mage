import "server-only";
import crypto from "node:crypto";
import { cookies, headers } from "next/headers";
import { env } from "@/lib/env";
export const SESSION_COOKIE="promptlock_session"; export const ADMIN_COOKIE="promptlock_admin";
function sign(value:string){ return crypto.createHmac("sha256", env.CHALLENGE_SECRET_KEY).update(value).digest("base64url"); }
export function makeSignedCookie(value:string){ return `${value}.${sign(value)}`; }
export function verifySignedCookie(raw?:string){ if(!raw) return null; const [value,sig]=raw.split("."); if(!value||!sig) return null; const expected=sign(value); const a=Buffer.from(sig); const b=Buffer.from(expected); return a.length===b.length && crypto.timingSafeEqual(a,b) ? value : null; }
export async function getSessionIdFromCookie(){ return verifySignedCookie((await cookies()).get(SESSION_COOKIE)?.value); }
export async function setSessionCookie(sessionId:string){ (await cookies()).set(SESSION_COOKIE, makeSignedCookie(sessionId), { httpOnly:true, sameSite:"lax", secure:process.env.NODE_ENV==="production", path:"/", maxAge:60*60*24*30 }); }
export async function setAdminCookie(){ (await cookies()).set(ADMIN_COOKIE, makeSignedCookie("admin"), { httpOnly:true, sameSite:"lax", secure:process.env.NODE_ENV==="production", path:"/", maxAge:60*60*8 }); }
export async function isAdminCookieValid(){ return verifySignedCookie((await cookies()).get(ADMIN_COOKIE)?.value)==="admin"; }
export function safeCompare(a:string,b:string){ const x=Buffer.from(a); const y=Buffer.from(b); return x.length===y.length && crypto.timingSafeEqual(x,y); }
export async function requireSameOrigin(){ const h=await headers(); const method=h.get("x-forwarded-method"); void method; const origin=h.get("origin"); const host=h.get("host"); if(origin && host && !origin.endsWith(`://${host}`)) throw new Error("Invalid request origin"); }
