# PromptLock Academy

PromptLock Academy is an original, browser-based, defensive AI security training lab. Players progress through synthetic prompt-injection challenges, chat with fictional AI guardians, submit toy phrases, and receive debriefs about safer AI application architecture.

> This is an authorized educational lab using synthetic data. Do not use these techniques against systems you do not own or have permission to test.

No third-party branding, assets, puzzles, storylines, rooms, characters, or static answers are copied. The seeded levels use original rooms: The Vault Lobby, The Filter Works, and The Agent Wing.

## Local setup

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run prisma:seed
npm run dev
```

Open <http://localhost:3000>.

## Environment variables

- `DATABASE_URL=file:./dev.db`
- `LLM_PROVIDER=mock|openai` (mock is default and requires no network/model key)
- `OPENAI_API_KEY=` server-side only when using OpenAI-compatible mode
- `OPENAI_MODEL=` model name for OpenAI-compatible mode
- `OPENAI_BASE_URL=` optional compatible endpoint
- `CHALLENGE_SECRET_KEY=` required in production; used for HMAC secret derivation and signed cookies
- `ADMIN_TOKEN=` required for admin login
- `LOG_RAW_PROMPTS=false` default privacy-preserving redaction
- `RATE_LIMIT_WINDOW_SECONDS=60`
- `RATE_LIMIT_MAX_REQUESTS=30`

## Running tests

```bash
npm run test
npm run typecheck
npm run build
npm run test:e2e
```

Playwright tests use mock mode. If browsers are missing, run `npx playwright install`.

## LLM provider configuration

The app uses a provider abstraction. `MockProvider` is deterministic and supports local development and automated tests. `OpenAICompatibleProvider` is server-only, reads API credentials from environment variables, caps output tokens, and uses request timeouts.

No model/API calls are made from the browser.

## How to add a room or level

Edit `src/lib/challenge/levels.ts` or import validated challenge JSON from the admin dashboard/API. A level may include `numberOfSecrets`, guard names, scenario text, hints, and debrief data, but must not include plaintext answer fields. The import schema rejects obvious fields such as `secret`, `password`, `answer`, and credential-like values.

## Secret derivation

Secrets are never committed as static answers. For each session and level, the server derives phrases with HMAC-SHA256 over `sessionId`, `levelId`, and `secretIndex`, using `CHALLENGE_SECRET_KEY`. Digests map to safe words and a number such as `BRIGHT-RIVER-482`. Validation derives the expected phrase again and compares normalized values with constant-time equality.

## Guard system

Input guards can block requests before model execution. Output guards can block or redact model output before it reaches the client. Guard events are stored for aggregate analytics. Raw prompts are redacted by default; derived phrases and credential-like patterns are redacted even when raw logging is enabled.

## Deployment notes

- Use a strong `CHALLENGE_SECRET_KEY` and `ADMIN_TOKEN`.
- Use HTTPS so secure cookies are effective.
- Move rate limiting to Redis or another shared store in multi-instance deployments.
- SQLite is for local MVP use; the Prisma schema is structured for a future Postgres migration.
- Do not enable source maps or client env variables containing secrets.

## Privacy notes

The public leaderboard shows only display name, total score, completed levels, and timestamp. It never displays prompts. Admin analytics are aggregate and guard-oriented.

## Security model

The model is treated as an untrusted component. Server-side code owns session cookies, secret derivation, answer validation, guard pipelines, fake tool mediation, analytics, and admin authentication. The MVP deliberately avoids arbitrary URL fetching, file upload, real email, shell execution, browser automation, and real external tools.

## Known limitations

- In-memory rate limiting is not distributed.
- Mock mode is deterministic and intentionally simplified.
- OpenAI-compatible semantic guard judging is represented by deterministic heuristics in the MVP.
- No cohort, SSO, streaming, certificates, or multi-tenant admin model yet.

## Future roadmap

Cohorts/classes, SSO/SAML/OIDC, Postgres production deployment, Redis-backed rate limiting, real tokenizer, streaming model responses, facilitator-led live events, defensive patching mode, team scoring, multilingual and multimodal levels, strict RAG corpus editor, certificates, SCORM/LMS integration, advanced privacy controls, and multi-tenant admin.
