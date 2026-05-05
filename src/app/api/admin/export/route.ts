import { ok, handleError, requireAdmin } from "@/lib/security/api"; import { rooms } from "@/lib/challenge/levels";
export async function GET(){ try{ await requireAdmin(); return ok({rooms}); }catch(e){ return handleError(e); } }
