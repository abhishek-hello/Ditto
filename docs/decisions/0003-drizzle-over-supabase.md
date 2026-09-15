# 0003 — Drizzle ORM on top of Supabase Postgres

**Status:** accepted · 2026-09-15

## Decision

`apps/api` reads and writes the database through Drizzle ORM (`@ditto/db`). The Drizzle schema file is the source of truth; drizzle-kit generates and applies migrations. supabase-js remains for Auth and for RLS-scoped reads from web/mobile.

## Why

- **Typed, composable SQL** for the ledger. Multi-statement transactions with row locks are awkward through PostgREST/`rpc`, natural in `db.transaction`.
- **One schema definition** in TypeScript, versioned with the code, that also declares RLS policies (`pgPolicy`) and Supabase roles (`drizzle-orm/supabase`).
- **Migrations without the Supabase CLI** in CI: `drizzle-kit migrate` needs only a connection string.

## Alternatives

- **supabase-js only**: fine for CRUD, poor for atomic multi-row money movement; schema lives in hand-written SQL.
- **Prisma**: heavier client, its own migration engine fights Supabase's `auth` schema, weaker raw-SQL ergonomics.
- **Kysely**: excellent query builder but no schema-as-code or migration generation.

## Consequences

- `SUPABASE_DB_URL` becomes a required API secret. Use the transaction pooler (port 6543) with `prepare: false`.
- `packages/supabase/supabase/migrations` is gone; the Supabase CLI is used only to run the local stack and to regenerate `database.types.ts`.
- Triggers and functions live in `--custom` migrations, since Drizzle's schema cannot express them.
