import { ok } from "@/lib/security/api"; import { leaderboard } from "@/lib/analytics";
export async function GET(){ return ok({entries:await leaderboard()}); }
