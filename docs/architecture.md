# Architecture

## Request flow

```
┌────────────┐        ┌────────────┐
│ apps/mobile│        │  apps/web  │
│ (Expo)     │        │ (Next.js)  │
└─────┬──────┘        └─────┬──────┘
      │ @ditto/api-client (Bearer <supabase jwt>)
      ▼                     ▼
┌────────────────────────────────────┐
│ apps/api  (Express 5)              │
│  helmet → cors → json → pino-http  │
│  /health                           │
│  /v1/* → requireAuth → routes      │
│     zod validate → HttpError → env │
└──────────────┬─────────────────────┘
               │ service-role client (bypasses RLS)
               ▼
┌────────────────────────────────────┐
│ Supabase (Postgres + Auth + RLS)   │
│  profiles · wallets · transactions │
└────────────────────────────────────┘
      ▲
      │ anon client, RLS-scoped reads (balance, history, realtime later)
      └── mobile / web
```

Two paths to the database:

1. **Reads** can go straight from a client to Supabase with the anon key; RLS limits rows to the caller's own.
2. **Writes that move money** go through `apps/api` only. The service-role client is instantiated once in `createApp` and never leaves the server.

## Auth

- Sign-up/sign-in: Supabase phone OTP. The `on_auth_user_created` trigger inserts `profiles` + a GBP `wallets` row so the app never has to handle a "user without wallet" state.
- `requireAuth` middleware calls `auth.getUser(token)` with the anon client. This is a network call to Supabase Auth per request; add an in-process LRU keyed by token (TTL < JWT expiry) once traffic warrants it.

## Ledger (target design)

A P2P payment must debit, credit, and record atomically. Plan:

```sql
create function public.transfer_p2p(from_wallet uuid, to_wallet uuid, amount_pence bigint, reference text)
returns public.transactions
language plpgsql security definer as $$ ... $$;
```

- Locks both wallet rows (`select ... for update`, ordered by id to avoid deadlocks).
- Checks `balance_pence >= amount_pence`, raises `insufficient_funds`.
- Updates both balances, inserts one `transactions` row with `status = 'completed'`.
- `apps/api` calls it with `db.rpc('transfer_p2p', …)` and maps SQL errors to `HttpError` codes.

Until this lands, `POST /v1/payments` returns `501 not_implemented`.

## Packages and dependency direction

```
apps/mobile ─┐
apps/web    ─┼─▶ @ditto/api-client ─▶ @ditto/core
apps/api    ─┼─▶ @ditto/supabase   ─▶ (supabase-js)
             └─▶ @ditto/core
```

`@ditto/core` has no internal deps. Nothing imports from `apps/`.

## Build and deploy

| Target | Build | Artifact | Host |
| --- | --- | --- | --- |
| web | `next build` | `.next/` | Vercel (root dir `apps/web`, install at repo root) |
| api | `tsup` (bundles `@ditto/*` + their deps into one ESM file; `apps/api` deps stay external) | `dist/index.js` + `node dist/index.js` | Container or Node host |
| mobile | EAS Build | `.ipa` / `.aab` | App Store / Play |

Turborepo caches `build`, `typecheck`, `test` locally and in CI (`.turbo/`). Remote cache is off until there's a team account.
