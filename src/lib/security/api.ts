import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { prisma } from "@/lib/db";
import { getSessionIdFromCookie, isAdminCookieValid } from "./session";
export function ok<T>(data:T, init?:ResponseInit){ return NextResponse.json({ ok:true, data }, init); }
export function err(message:string, status=400){ return NextResponse.json({ ok:false, error:{ message } }, { status }); }
export function handleError(e:unknown){ if(e instanceof ZodError) return err(e.issues.map(i=>i.message).join("; "),422); return err(e instanceof Error ? e.message : "Request failed", 400); }
export async function requireSession(){ const id=await getSessionIdFromCookie(); if(!id) throw new Error("Session required"); const session=await prisma.playerSession.findUnique({where:{id}}); if(!session) throw new Error("Session required"); await prisma.playerSession.update({where:{id},data:{lastSeenAt:new Date()}}); return session; }
export async function requireAdmin(){ if(!(await isAdminCookieValid())) throw new Error("Admin authentication required"); }
