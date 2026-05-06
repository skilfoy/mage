import { analytics } from "@/lib/analytics"; import { handleError, ok, requireAdmin } from "@/lib/security/api";
export async function GET(){ try{ await requireAdmin(); return ok(await analytics()); }catch(e){ return handleError(e); } }
