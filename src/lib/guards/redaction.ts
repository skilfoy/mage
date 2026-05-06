const credentialPatterns = [/(sk-[A-Za-z0-9_-]{8,})/g, /(AKIA[0-9A-Z]{16})/g, /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})/g, /(-----BEGIN [^-]+ PRIVATE KEY-----[\s\S]*?-----END [^-]+ PRIVATE KEY-----)/g];
export function redactText(text: string, secrets: string[] = []) {
  let out = text;
  for (const secret of secrets) if (secret) out = out.split(secret).join("[REDACTED BY GUARD]");
  for (const pattern of credentialPatterns) out = out.replace(pattern, "[REDACTED CREDENTIAL-LIKE VALUE]");
  return out;
}
export function secretVariants(secret: string) { return [secret, secret.replace(/-/g, " "), secret.replace(/-/g, ""), ...secret.split("-")].filter((x) => x.length >= 3); }
