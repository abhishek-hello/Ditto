# ENVIRONMENTS.md — env vars and stages

## The one rule

**There is one `.env`, at the repo root.** Every app loads it explicitly:

| App | How it loads root `.env` |
| --- | --- |
| `apps/api` | `src/env.ts` → `dotenv` with path `../../.env`, then zod-validates and fails fast |
| `apps/web` | `next.config.ts` → `dotenv` at config time, so `NEXT_PUBLIC_*` is inlined at build |
| `apps/mobile` | `app.config.ts` → `dotenv` at config time, so `EXPO_PUBLIC_*` is inlined by Metro |

`env.example` is the catalogue: every key, no values. `npm run check:env` fails if `.env` is missing a key or has one that isn't catalogued. Add a var → add it to `env.example` in the same commit.

## Visibility

| Prefix | Ends up in | Safe for |
| --- | --- | --- |
| `NEXT_PUBLIC_` | Next.js browser bundle | Public URLs, anon key |
| `EXPO_PUBLIC_` | Expo app bundle | Public URLs, anon key |
| _(none)_ | Server process only | Service-role key, JWT secret, DB URL |

The Supabase **anon** key is public by design (RLS protects data). `SUPABASE_DB_URL` and the **service-role** key bypass RLS and must only ever be set for `apps/api` and migration tooling.

## Variables

| Key | Used by | Notes |
| --- | --- | --- |
| `NODE_ENV` | api | `development` / `test` / `production` |
| `LOG_LEVEL` | api | pino level, default `info` |
| `PORT` | api | default `4000` |
| `API_CORS_ORIGINS` | api | comma-separated, default `http://localhost:3000` |
| `SUPABASE_URL` | api | project URL |
| `SUPABASE_ANON_KEY` | api | used to verify user tokens |
| `SUPABASE_SERVICE_ROLE_KEY` | api (future: storage/admin auth) | **secret**, bypasses RLS |
| `SUPABASE_JWT_SECRET` | api (future) | only if we verify JWTs locally |
| `SUPABASE_DB_URL` | api, drizzle-kit | Postgres URL used by Drizzle, **secret**, bypasses RLS. Local: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`. Cloud: the *transaction pooler* URL (port 6543) |
| `NEXT_PUBLIC_APP_URL` | web | canonical site URL |
| `NEXT_PUBLIC_API_URL` | web | `apps/api` base URL |
| `NEXT_PUBLIC_SUPABASE_URL` | web | same value as `SUPABASE_URL` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | web | same value as `SUPABASE_ANON_KEY` |
| `EXPO_PUBLIC_API_URL` | mobile | on a device, use your machine's LAN IP, not `localhost` |
| `EXPO_PUBLIC_SUPABASE_URL` | mobile | |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | mobile | |
| `EXPO_PUBLIC_DEV_BYPASS_AUTH` | mobile | `1` makes every route reachable without a session (dev builds only). Leave empty otherwise |

## Stages

| Stage | Supabase | api | web | mobile |
| --- | --- | --- | --- | --- |
| **local** | `supabase start` (Docker) or a personal cloud project | `npm run dev:api` on :4000 | `npm run dev:web` on :3000 | Expo Go / dev client |
| **preview** | shared `ditto-staging` project | container per PR (or single staging) | Vercel preview deployment | EAS `preview` channel (internal distribution) |
| **production** | `ditto-prod` project | container, autoscaled | Vercel production | EAS `production` channel, store builds |

Secrets for preview/production live in the host's secret manager (Vercel env, EAS secrets, container env), never in the repo. CI uses placeholder values for build-only checks (see `.github/workflows/ci.yml`).

## Local Supabase quick reference

```sh
cd packages/supabase
npx supabase start            # first run pulls Docker images
npx supabase status           # shows URL, anon key, service_role key, DB URL
cd ../..
npm run db:migrate -w @ditto/db            # apply Drizzle migrations
npm run types:generate -w @ditto/supabase  # refresh supabase-js types
```

Studio: http://localhost:54323
