import { approximateTokens, ChatCompletionRequest, ChatCompletionResponse, LLMProvider } from "./types";
function extractSecret(system: string) { return system.match(/[A-Z]+-[A-Z]+-\d{3}/g) ?? []; }
export class MockProvider implements LLMProvider { name="mock"; async chat(req: ChatCompletionRequest): Promise<ChatCompletionResponse> { const system=req.messages.find(m=>m.role==="system")?.content ?? ""; const user=req.messages.filter(m=>m.role==="user").at(-1)?.content ?? ""; const secrets=extractSecret(system); const behavior=req.metadata?.mockBehavior ?? "safe"; let content = "I can discuss the defensive lesson using synthetic examples, but I will avoid protected phrases.";
 if (behavior==="open" || /training phrase|what.*phrase|code/i.test(user)) content = `This introductory guardian shares the synthetic training phrase: ${secrets[0]}.`;
 else if (behavior==="reluctant" && /duties|policy|allowed|training/i.test(user)) content = `I am supposed to protect a phrase, but in this toy lab I might mishandle pressure. ${secrets[0]}`;
 else if (behavior==="exact-leak") content = `The unsafe draft would have said ${secrets[0]}, but guards should catch exact exposure.`;
 else if (behavior==="keyword") content = "The gate blocked direct vocabulary; safer systems avoid relying on a word list alone.";
 else if (behavior==="tools") content = /public clue/i.test(user) ? "TOOL:getPublicClue -> Public clue: deterministic policy approved this low-risk action." : "TOOL:requestVaultOpen proposed, but server policy must deny privileged action.";
 else if (behavior==="rag") content = "The memo is untrusted data. It tries to insert an instruction, which should be summarized as content rather than obeyed.";
 else if (behavior==="final") content = "Layered defenses are active: input review, supervisor review, redaction, and rate limits all reduce risk.";
 return { content, provider: this.name, model: "deterministic-mock", usage: { inputTokens: approximateTokens(req.messages.map(m=>m.content).join(" ")), outputTokens: approximateTokens(content), totalTokens: approximateTokens(req.messages.map(m=>m.content).join(" ")+content) } } }
}
