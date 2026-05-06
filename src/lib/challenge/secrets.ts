import "server-only";
import crypto from "node:crypto";
import { env } from "@/lib/env";
const adjectives = ["BRIGHT","QUIET","SOLAR","GENTLE","NIMBLE","CLEAR","LUCKY","VIVID","HIDDEN","PLAIN","SWIFT","CALM","AMBER","SILVER","COBALT","MELLOW"];
const nouns = ["RIVER","ORBIT","LANTERN","HARBOR","MEADOW","ANCHOR","COMET","GARDEN","CANYON","BEACON","MOSAIC","SUMMIT","CLOUD","BRIDGE","EMBER","FOREST"];
export function normalizeSecret(value: string) { return value.trim().toUpperCase().replace(/[\s_]+/g, "-").replace(/[^A-Z0-9-]/g, "").replace(/-+/g, "-"); }
export function deriveSecret(sessionId: string, levelId: string, secretIndex = 0, key = env.CHALLENGE_SECRET_KEY) {
  const digest = crypto.createHmac("sha256", key).update(`${sessionId}:${levelId}:${secretIndex}`).digest();
  const adj = adjectives[digest[0] % adjectives.length];
  const noun = nouns[digest[1] % nouns.length];
  const num = (digest.readUInt16BE(2) % 900) + 100;
  return `${adj}-${noun}-${num}`;
}
export function deriveSecrets(sessionId: string, levelId: string, count: number) { return Array.from({ length: count }, (_, i) => deriveSecret(sessionId, levelId, i)); }
export function constantTimeSecretMatch(submission: string, expected: string) {
  const a = Buffer.from(normalizeSecret(submission)); const b = Buffer.from(normalizeSecret(expected));
  if (a.length !== b.length) return false; return crypto.timingSafeEqual(a, b);
}
export function validateSubmittedSecret(submission: string, expected: string[]) { return expected.some((s) => constantTimeSecretMatch(submission, s)); }
