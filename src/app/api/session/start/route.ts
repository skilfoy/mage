import { z } from "zod";
import { prisma } from "@/lib/db";
import { ok, handleError } from "@/lib/security/api";
import { setSessionCookie } from "@/lib/security/session";
import { ensureProgress } from "@/lib/challenge/progress";
const schema=z.object({displayName:z.string().trim().min(1).max(40)});
export async function POST(req:Request){ try{ const {displayName}=schema.parse(await req.json()); const session=await prisma.playerSession.create({data:{displayName}}); await setSessionCookie(session.id); await ensureProgress(session.id); return ok({id:session.id,displayName:session.displayName}); }catch(e){ return handleError(e); } }
