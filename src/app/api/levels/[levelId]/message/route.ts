import { z } from "zod"; import { handleError, ok, requireSession } from "@/lib/security/api"; import { runMessage } from "@/lib/challenge/engine";
const schema=z.object({message:z.string().min(1).max(2000)});
export async function POST(req:Request,{params}:{params:Promise<{levelId:string}>}){ try{ const session=await requireSession(); const {levelId}=await params; const {message}=schema.parse(await req.json()); return ok(await runMessage(session.id,levelId,message)); }catch(e){ return handleError(e); } }
