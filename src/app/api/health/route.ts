import { ok } from "@/lib/security/api";
export async function GET(){ return ok({status:"healthy", app:"PromptLock Academy"}); }
