import { prisma } from "@/lib/db";
import { allLevels } from "./levels";
export async function ensureProgress(sessionId:string){ const existing=await prisma.progress.findMany({where:{sessionId}}); const have=new Set(existing.map(p=>p.levelId)); for(const level of allLevels){ if(!have.has(level.id)){ await prisma.progress.create({data:{sessionId,levelId:level.id,status:level.order===1?"available":"locked",score:level.scoring.base}}); } } }
export async function unlockNext(sessionId:string, completedOrder:number){ const next=allLevels.find(l=>l.order===completedOrder+1); if(next) await prisma.progress.updateMany({where:{sessionId,levelId:next.id,status:"locked"},data:{status:"available"}}); }
