import { env } from "@/lib/env";
import { MockProvider } from "./mock";
import { OpenAICompatibleProvider } from "./openai";
export * from "./types";
export function getProvider() { return env.LLM_PROVIDER === "openai" ? new OpenAICompatibleProvider() : new MockProvider(); }
