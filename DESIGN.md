# DESIGN.md — technical design rules

These are the decisions that are expensive to reverse. Change them via PR that edits this file.

## Money

- **Unit:** integer pence. Type `Pence` (branded `number`) from `@ditto/core`.
- **Storage:** `bigint` columns named `*_pence`. Never `numeric`, never `float`.
- **Wire:** JSON integers. `{ "amount": 1250 }` means £12.50.
- **Arithmetic:** only via `@ditto/core/money` helpers (`addPence`, `subtractPence`, `splitPence`). `splitPence` distributes remainders so sums are exact.
- **Display:** `formatPence` → `£1,250.05` using `Intl.NumberFormat('en-GB')`. Formatting happens in UI code only.
- **Input:** `parsePounds` accepts `"12.50"`, `"£12"`, `"1,250.00"`; rejects more than two decimals.

## Database access

- **Drizzle ORM** (`@ditto/db`) is the only way `apps/api` talks to Postgres. The Drizzle schema is the source of truth; `drizzle-kit generate` produces SQL migrations under `packages/db/drizzle/`, `drizzle-kit migrate` applies them. RLS policies are declared in the schema with `pgPolicy` so they are versioned with the tables.
- The API connects with `SUPABASE_DB_URL` (Supabase pooler, `prepare: false`), which bypasses RLS. Web and mobile never hold this URL.
- **supabase-js** (`@ditto/supabase`) stays for Auth (OTP, sessions, token verification) and for RLS-scoped reads directly from clients (balance, history, realtime later). `database.types.ts` is regenerated from the migrated DB so those reads stay typed.
- Things Drizzle cannot express (triggers, functions) go in `drizzle-kit generate --custom` migrations.

## Ledger

- Wallets and transactions are written **only** by `apps/api`, inside a single `db.transaction(...)`: lock both wallet rows `FOR UPDATE` (ordered by id), check balance, debit, credit, insert the `transactions` row.
- `wallets.balance_pence >= 0` is enforced by a DB check constraint; the API must still pre-check and return a friendly `insufficient_funds` error.
- Transactions are append-only. A mistake produces a new row with `status = 'reversed'` referencing the original; rows are never updated except `pending → completed | failed`.
- Row Level Security lets users **read** their own profile, wallet, and transactions. Clients get no write policies.

## Auth

- Supabase Auth, phone OTP (UK mobile, E.164). The `handle_new_user` trigger (custom migration `0001`) creates profile + GBP wallet.
- Clients send the Supabase access token as `Authorization: Bearer`. `apps/api` verifies it with `auth.getUser(token)` (anon client), never by decoding the JWT locally.
- Mobile persists sessions in `expo-secure-store`. Web uses the Supabase browser client; if SSR needs sessions later, add `@supabase/ssr` and cookie storage.

## API shape

- Base path `/v1`. Health at `/health` (unauthenticated).
- Every response is `ApiResponse<T>`: `{ ok: true, data }` or `{ ok: false, error: { code, message } }`. `code` is a stable snake_case string clients can switch on.
- Input validated by zod schemas exported from `@ditto/core/schemas`; the same schemas power client-side form validation.
- Errors are thrown as `HttpError(status, code, message)` and rendered by one error middleware. 500s never leak internals.
- Express 5: async handlers may throw; still wrap DB calls in `try/catch → next(err)` for clarity until Express 5's promise handling is relied on throughout.

## Packages

- Shared packages export **TypeScript source** (`main: ./src/index.ts`). No build, no `dist`. Consumers transpile: Next via `transpilePackages`, Metro natively, `tsx` for the API in dev and `tsup` (with `noExternal: [/^@ditto\//]`) for the API build.
- Dependency direction: `apps/* → packages/*`. `packages/api-client → packages/core`. `packages/db` and `packages/core` depend on nothing internal. No package imports from `apps/`.
- A package earns its existence when two workspaces need it. Don't pre-create packages.

## Frontend

- **Web:** App Router, Server Components by default, `'use client'` only where state or browser APIs are needed. Tailwind 4 (`@import 'tailwindcss'`). No CSS-in-JS.
- **Mobile:** expo-router file routes under `app/`; everything else in `src/`. `StyleSheet.create` for now; revisit a styling library once there are >10 screens.
- Both read public config from a single `src/lib/env.ts`; nothing else touches `process.env`.

## Tooling

- npm workspaces (single `package-lock.json`), Turborepo for the task graph, Biome for lint + format, Knip for dead code, Vitest for tests, TypeScript 5.9 with `strict` + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`.
- React is pinned to one exact version (currently `19.2.3`) in every workspace so npm hoists a single copy. React Native breaks with two.
- Third-party fixes go in `patches/` via `patch-package`, each with an upstream link.
