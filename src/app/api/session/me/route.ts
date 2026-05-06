import { ok } from "@/lib/security/api"; import { prisma } from "@/lib/db"; import { getSessionIdFromCookie } from "@/lib/security/session";
export async function GET(){ const id=await getSessionIdFromCookie(); if(!id) return ok({session:null}); const s=await prisma.playerSession.findUnique({where:{id},select:{id:true,displayName:true,lastSeenAt:true}}); return ok({session:s}); }
