import { z } from "zod";
export const guardConfigSchema = z.object({ name: z.string(), options: z.record(z.unknown()).optional() });
export const levelConfigSchema = z.object({
  id: z.string(), slug: z.string(), roomId: z.string(), title: z.string(), difficulty: z.string(), order: z.number(),
  learningObjective: z.string(), scenarioText: z.string(), guardianName: z.string(), systemPromptTemplate: z.string(),
  numberOfSecrets: z.number().int().min(1).max(3), inputGuards: z.array(guardConfigSchema), outputGuards: z.array(guardConfigSchema),
  semanticGuard: guardConfigSchema.optional(), mockBehavior: z.string().optional(), retrievedDocuments: z.array(z.object({ title: z.string(), body: z.string(), trusted: z.boolean().default(false) })).optional(),
  tools: z.array(z.string()).optional(), hints: z.array(z.string()).min(1),
  debrief: z.object({ whatHappened: z.string(), whyItMatters: z.string(), betterDefenses: z.array(z.string()), riskCategories: z.array(z.string()) }),
  scoring: z.object({ base: z.number().default(1000), attemptPenalty: z.number().default(35), hintPenalty: z.number().default(120), guardPenalty: z.number().default(50), tokenPenaltyDivisor: z.number().default(25) }).default({ base: 1000, attemptPenalty: 35, hintPenalty: 120, guardPenalty: 50, tokenPenaltyDivisor: 25 })
});
export const roomConfigSchema = z.object({ id: z.string(), slug: z.string(), title: z.string(), description: z.string(), order: z.number(), levels: z.array(levelConfigSchema) });
export type LevelConfig = z.infer<typeof levelConfigSchema>;
export type RoomConfig = z.infer<typeof roomConfigSchema>;
const forbiddenField = /"(secret|password|answer|api[_-]?key|token)"\s*:/i;
const credentialPattern = /(sk-[A-Za-z0-9_-]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (RSA|OPENSSH|PRIVATE) KEY-----)/;
export function validateChallengeJson(input: unknown) {
  const raw = JSON.stringify(input);
  if (forbiddenField.test(raw)) throw new Error("Challenge JSON must not include plaintext secret/password/answer/token fields; use numberOfSecrets only.");
  if (credentialPattern.test(raw)) throw new Error("Challenge JSON appears to contain a credential-like value.");
  return z.array(roomConfigSchema).parse(input);
}
