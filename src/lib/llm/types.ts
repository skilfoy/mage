export type ChatMessage = { role: "system" | "user" | "assistant" | "tool"; content: string };
export type ChatCompletionRequest = { messages: ChatMessage[]; temperature?: number; maxTokens?: number; metadata?: Record<string, string> };
export type ChatCompletionResponse = { content: string; usage?: { inputTokens?: number; outputTokens?: number; totalTokens?: number }; provider: string; model: string };
export interface LLMProvider { name: string; chat(req: ChatCompletionRequest): Promise<ChatCompletionResponse>; }
export function approximateTokens(text: string) { return Math.max(1, Math.ceil(text.length / 4)); }
