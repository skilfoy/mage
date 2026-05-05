import "server-only";
import { env } from "@/lib/env";
import { redactText } from "@/lib/guards/redaction";
import type { ChatCompletionRequest, ChatCompletionResponse, LLMProvider } from "./types";

export class OpenAICompatibleProvider implements LLMProvider {
  name = "openai";

  async chat(req: ChatCompletionRequest): Promise<ChatCompletionResponse> {
    if (!env.OPENAI_API_KEY) throw new Error("OpenAI provider configured without OPENAI_API_KEY");
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);
    try {
      const res = await fetch(`${env.OPENAI_BASE_URL.replace(/\/$/, "")}/chat/completions`, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${env.OPENAI_API_KEY}` },
        body: JSON.stringify({ model: env.OPENAI_MODEL, messages: req.messages, temperature: req.temperature ?? 0.2, max_tokens: Math.min(req.maxTokens ?? 400, 800) }),
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`LLM request failed: ${res.status}`);
      const data = await res.json();
      return { content: String(data.choices?.[0]?.message?.content ?? ""), provider: this.name, model: env.OPENAI_MODEL, usage: { inputTokens: data.usage?.prompt_tokens, outputTokens: data.usage?.completion_tokens, totalTokens: data.usage?.total_tokens } };
    } catch (e) {
      console.error("LLM error", redactText(e instanceof Error ? e.message : String(e)));
      throw new Error("The model provider was unavailable. Try again later.");
    } finally {
      clearTimeout(timeout);
    }
  }
}
