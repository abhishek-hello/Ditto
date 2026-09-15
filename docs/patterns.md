# Patterns

## Add an API route

1. Define the input schema in `packages/core/src/schemas.ts` and export its types.
2. Create `apps/api/src/routes/<thing>.ts` exporting `function <thing>Router(db)` that returns an Express `Router`.
3. Validate with `validateBody(schema)`. Throw `HttpError(status, 'snake_code', 'message')` for failures. Respond with `ok(res, data)`.
4. Mount it in `apps/api/src/app.ts` under `v1`.
5. Add a method to `packages/api-client/src/index.ts` so web and mobile get a typed call.
6. Test with supertest in `apps/api/src/<thing>.test.ts`.

## Add a mobile screen

- Route file in `apps/mobile/app/` (expo-router). Keep it thin: layout + hooks.
- Logic and components in `apps/mobile/src/`. Import with `@/`.
- Data via `api` from `@/lib/api`; auth via `supabase` from `@/lib/supabase`.

## Add a web page

- `apps/web/src/app/<segment>/page.tsx`. Server Component unless it needs state.
- Client data via `getApi()` from `@/lib/api` inside a `'use client'` component.

## Add a shared package

```sh
mkdir -p packages/<name>/src
```
- `package.json`: `"name": "@ditto/<name>"`, `"private": true`, `"main": "./src/index.ts"`, `exports`, scripts `typecheck` + `clean`, devDep `@ditto/typescript-config`.
- `tsconfig.json` extends `@ditto/typescript-config/library.json`.
- Add to `transpilePackages` in `apps/web/next.config.ts` and to `knip.json` if it needs custom entries.
- `npm install` at root to link it.

## Change the schema

1. Edit `packages/db/src/schema.ts`. Money columns are `bigint('…_pence', { mode: 'number' })`. Add `pgPolicy(...)` entries for any client-readable table and keep `.enableRLS()`.
2. `npm run db:generate -w @ditto/db` → new file under `packages/db/drizzle/`. Read the SQL; drizzle-kit is good but not infallible.
3. Triggers / functions / data backfills: `npx drizzle-kit generate --custom --name <snake_name>` from `packages/db`, then write the SQL by hand.
4. `npm run db:migrate -w @ditto/db` against your local DB, then `npm run types:generate -w @ditto/supabase`.
5. Commit the schema, the SQL, `drizzle/meta/*`, and `database.types.ts` together. `npm run db:check -w @ditto/db` runs in CI to catch drifted snapshots.

Query from the API with `db.query.<table>.findFirst/findMany` (relational) or `db.select().from(...)` (SQL-like). Never string-build SQL; use `sql\`...\`` tags with parameters.

## Add an env var

Add to `env.example` (no value), to the table in `ENVIRONMENTS.md`, and to the zod schema in `apps/api/src/env.ts` or the `publicEnv` object in the app's `src/lib/env.ts`. Run `npm run check:env`.

## Patch a dependency

Edit under `node_modules/<pkg>`, run `npx patch-package <pkg>`, add a row to `patches/README.md` with the upstream link.
