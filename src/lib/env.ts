import { z } from "zod";
export const envSchema = z.object({
  DATABASE_URL: z.string().default("file:./dev.db"),
  LLM_PROVIDER: z.enum(["mock", "openai"]).default("mock"),
  OPENAI_API_KEY: z.string().optional().default(""),
  OPENAI_MODEL: z.string().optional().default("gpt-4.1-mini"),
  OPENAI_BASE_URL: z.string().optional().default("https://api.openai.com/v1"),
  CHALLENGE_SECRET_KEY: z.string().default("development-only-change-me"),
  ADMIN_TOKEN: z.string().default("change-me-admin-token"),
  LOG_RAW_PROMPTS: z.string().default("false"),
  RATE_LIMIT_WINDOW_SECONDS: z.coerce.number().default(60),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(30),
});
export const env = envSchema.parse(process.env);
export const logRawPrompts = env.LOG_RAW_PROMPTS === "true";
