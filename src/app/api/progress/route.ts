import { ok, requireSession, handleError } from "@/lib/security/api"; import { prisma } from "@/lib/db";
export async function GET(){ try{ const session=await requireSession(); return ok({progress:await prisma.progress.findMany({where:{sessionId:session.id},select:{levelId:true,status:true,attempts:true,hintsUsed:true,score:true,completedAt:true}})}); }catch(e){ return handleError(e); } }
