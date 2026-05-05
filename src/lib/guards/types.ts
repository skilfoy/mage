import type { LevelConfig } from "@/lib/challenge/schema";
export type GuardSeverity = "allow" | "warn" | "block";
export type GuardResult = { allowed: boolean; severity: GuardSeverity; guardName: string; publicMessage?: string; internalReason?: string; tags?: string[]; redactedText?: string };
export type GuardContext = { sessionId: string; levelId: string; derivedSecrets: string[]; attemptNumber: number; previousGuardEvents?: GuardResult[]; levelConfig: LevelConfig; retrievedDocuments?: { title: string; body: string; trusted: boolean }[]; modelMetadata?: Record<string,string> };
export interface InputGuard { name: string; evaluate(input: string, context: GuardContext): Promise<GuardResult>; }
export interface OutputGuard { name: string; evaluate(output: string, context: GuardContext): Promise<GuardResult>; }
export const allow = (guardName: string, redactedText?: string): GuardResult => ({ allowed: true, severity: "allow", guardName, redactedText });
export const block = (guardName: string, publicMessage: string, internalReason: string, tags: string[] = []): GuardResult => ({ allowed: false, severity: "block", guardName, publicMessage, internalReason, tags });
