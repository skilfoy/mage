# Security Policy

## Responsible use

PromptLock Academy is an authorized educational lab using synthetic data only. Do not use these techniques against systems you do not own or have explicit permission to test.

## Threat model summary

The application assumes model output is untrusted. Server-side controls derive and validate synthetic phrases, mediate fake tools, enforce session/admin cookies, apply rate limits, redact telemetry, and block or redact guarded outputs before client delivery.

## Sensitive data policy

Do not add real secrets, credentials, tokens, customer data, enterprise data, or third-party challenge answers. Seeded challenge configs may specify `numberOfSecrets` only. Plaintext answer-like fields are rejected during JSON import.

## Reporting vulnerabilities

Open a private security advisory or contact the repository owner with reproduction details, affected routes, and security impact. Avoid including real credentials or personal data in reports.

## Synthetic secrets only

All challenge phrases are synthetic per-session values derived from HMAC-SHA256 with `CHALLENGE_SECRET_KEY`. Plaintext derived secrets are not stored in the database and should not be logged.
