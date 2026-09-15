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
               │ Drizzle ORM via SUPABASE_DB_URL (bypasses RLS)
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
2. **Writes that move money** go through `apps/api` only, via Drizzle (`createDb()` in `createApp`). The connection string never leaves the server. The anon supabase-js client in the API exists only to verify access tokens.

## Auth

- Sign-up/sign-in: Supabase phone OTP. The `on_auth_user_created` trigger inserts `profiles` + a GBP `wallets` row so the app never has to handle a "user without wallet" state.
- `requireAuth` middleware calls `auth.getUser(token)` with the anon client. This is a network call to Supabase Auth per request; add an in-process LRU keyed by token (TTL < JWT expiry) once traffic warrants it.

## Ledger (target design)

A P2P payment must debit, credit, and record atomically. Plan:

```ts
await db.transaction(async (tx) => {
  const [a, b] = await tx.select().from(wallets)
    .where(inArray(wallets.id, [fromId, toId].sort())).for('update');
  if (from.balancePence < amount) throw new HttpError(422, 'insufficient_funds', …);
  await tx.update(wallets).set({ balancePence: sql`${wallets.balancePence} - ${amount}` }).where(eq(wallets.id, fromId));
  await tx.update(wallets).set({ balancePence: sql`${wallets.balancePence} + ${amount}` }).where(eq(wallets.id, toId));
  return tx.insert(transactions).values({ kind: 'p2p', status: 'completed', amountPence: amount, fromWalletId, toWalletId, reference }).returning();
});
```

- Lock order is by wallet id to avoid deadlocks. The `wallets_balance_non_negative` check is the last line of defence.
- Serializable isolation is not required; row locks are sufficient for two-wallet transfers.

Until this lands, `POST /v1/payments` returns `501 not_implemented`.

## Packages and dependency direction

```
apps/mobile ─┐
apps/web    ─┼─▶ @ditto/api-client ─▶ @ditto/core
             ├─▶ @ditto/supabase   ─▶ (supabase-js)     ← auth + RLS reads
apps/api    ─┼─▶ @ditto/db         ─▶ (drizzle-orm, postgres)  ← all writes
             ├─▶ @ditto/supabase                          ← token verification
             └─▶ @ditto/core
```

`@ditto/core` and `@ditto/db` have no internal deps. Nothing imports from `apps/`. `@ditto/db` is server-only.

## Build and deploy

| Target | Build | Artifact | Host |
| --- | --- | --- | --- |
| web | `next build` | `.next/` | Vercel (root dir `apps/web`, install at repo root) |
| api | `tsup` (bundles `@ditto/*` + their deps into one ESM file; `apps/api` deps stay external) | `dist/index.js` + `node dist/index.js` | Container or Node host |
| mobile | EAS Build | `.ipa` / `.aab` | App Store / Play |

Turborepo caches `build`, `typecheck`, `test` locally and in CI (`.turbo/`). Remote cache is off until there's a team account.
